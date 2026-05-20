/* ==========================================================================
   APP ROUTER & SCREEN NAVIGATION (BOOTSTRAPPER)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

import { audioManager } from './audio.js';
import { gameEngine } from './game.js';
import { boardRenderer } from './board.js';

class App {
    constructor() {
        this.screens = {
            menu: document.getElementById('screen-menu'),
            setup: document.getElementById('screen-setup'),
            prologue: document.getElementById('screen-prologue'),
            gameplay: document.getElementById('screen-gameplay'),
            credits: document.getElementById('screen-credits')
        };
        
        this.playerCount = 1; // Default: 1 Player manusia (lainnya Bot)
        this.initEvents();
    }

    /**
     * Inisialisasi Event Listener untuk navigasi layar
     */
    initEvents() {
        // --- 1. Main Menu Screen ---
        document.getElementById('btn-to-setup').addEventListener('click', () => {
            audioManager.playSFX('click');
            this.showScreen('setup');
        });

        document.getElementById('btn-to-credits').addEventListener('click', () => {
            audioManager.playSFX('click');
            this.showScreen('credits');
        });

        // --- 2. Setup Screen ---
        const selectorButtons = document.querySelectorAll('.btn-selector');
        selectorButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                audioManager.playSFX('click');
                selectorButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.playerCount = parseInt(btn.dataset.count);
                this.updatePlayerInputCards();
            });
        });

        document.querySelector('.btn-close-setup').addEventListener('click', () => {
            audioManager.playSFX('click');
            this.showScreen('menu');
        });

        document.getElementById('btn-start-game').addEventListener('click', () => {
            audioManager.playSFX('click');
            this.startGameSetup();
        });

        // --- 3. Credits Screen ---
        document.querySelector('.btn-close-credits').addEventListener('click', () => {
            audioManager.playSFX('click');
            this.showScreen('menu');
        });

        // --- 4. Prologue Screen ---
        document.getElementById('btn-next-dialogue').addEventListener('click', () => {
            audioManager.playSFX('click');
            this.advancePrologue();
        });

        document.getElementById('btn-skip-prologue').addEventListener('click', () => {
            audioManager.playSFX('click');
            this.enterGameplayScreen();
        });

        // Inisialisasi musik latar saat halaman disentuh pertama kali (karena aturan browser)
        window.addEventListener('click', () => {
            audioManager.initBGM();
        }, { once: true });
    }

    /**
     * Mengatur perpindahan layar dengan kelas .hidden
     */
    showScreen(screenKey) {
        Object.keys(this.screens).forEach(key => {
            if (key === screenKey) {
                this.screens[key].classList.remove('hidden');
            } else {
                this.screens[key].classList.add('hidden');
            }
        });

        // Memutar BGM yang pas berdasarkan layar yang aktif
        if (screenKey === 'menu' || screenKey === 'credits' || screenKey === 'setup') {
            audioManager.playBGM('menu');
        } else if (screenKey === 'prologue') {
            audioManager.playBGM('prologue');
        }
    }

    /**
     * Memperbarui kartu input nama berdasarkan jumlah pemain nyata
     */
    updatePlayerInputCards() {
        for (let i = 1; i <= 4; i++) {
            const card = document.getElementById(`card-p${i}`);
            const input = document.getElementById(`input-p${i}-name`);
            const labelType = card.querySelector('.player-type');
            
            if (i <= this.playerCount) {
                card.classList.remove('bot');
                input.removeAttribute('disabled');
                if (input.value.startsWith('Bot ')) {
                    input.value = `Mahasiswa ${String.fromCharCode(64 + i)}`;
                }
                labelType.textContent = 'Manusia (Aktif)';
            } else {
                card.classList.add('bot');
                input.setAttribute('disabled', 'true');
                
                const botNames = ['Bot Antigravity', 'Bot IPB', 'Bot Rektorat', 'Bot Dekanat'];
                input.value = botNames[i - 2] || `Bot ${i}`;
                labelType.textContent = 'AI Bot';
            }
        }
    }

    /**
     * Memproses transisi dari Setup ke Prologue
     */
    startGameSetup() {
        const playersData = [];
        for (let i = 1; i <= 4; i++) {
            const name = document.getElementById(`input-p${i}-name`).value.trim();
            const isBot = i > this.playerCount;
            playersData.push({
                name: name || `Pemain ${i}`,
                index: i,
                isBot: isBot
            });
        }

        // Simpan data pemain di engine
        gameEngine.setupPlayers(playersData);
        
        // Beralih ke layar Prolog
        this.showScreen('prologue');
        this.prologueStep = 0;
        this.prologueDialogues = [
            {
                speaker: "Si Punk (Mahasiswa Baru)",
                text: "Waduh, hari pertama masuk kampus IPB nih! Rambutku masih mohawk berantakan, jaket robek-robek... Katanya tata tertib di sini ketat banget. Apa aku bisa bertahan ya?",
                avatar: "🧑‍🎤"
            },
            {
                speaker: "Duta IPB (Rekan Kakak Tingkat)",
                text: "Hei maba! Selamat datang di IPB University. Perjalananmu dimulai dari petak 0. Ingat, setiap tindakanmu dinilai. Hormati tata tertib, ikuti perkuliahan dengan jujur, dan berprestasilah!",
                avatar: "👑"
            },
            {
                speaker: "Si Punk (Mahasiswa Baru)",
                text: "Siap, Kak! Saya berjanji akan belajar sungguh-sungguh, menaati aturan akademik, menjauhi pelanggaran tengkorak, dan membidik kelulusan mulia menjadi Duta IPB seutuhnya!",
                avatar: "🧑‍🎤"
            }
        ];
        this.renderPrologueStep();
    }

    /**
     * Merender percakapan prolog visual-novel style
     */
    renderPrologueStep() {
        const dialog = this.prologueDialogues[this.prologueStep];
        document.getElementById('dialogue-speaker').textContent = dialog.speaker;
        document.getElementById('dialogue-text').textContent = dialog.text;
        document.querySelector('.character-visual-placeholder').textContent = dialog.avatar;
    }

    /**
     * Memajukan langkah dialog prolog
     */
    advancePrologue() {
        this.prologueStep++;
        if (this.prologueStep < this.prologueDialogues.length) {
            this.renderPrologueStep();
        } else {
            this.enterGameplayScreen();
        }
    }

    /**
     * Masuk ke game board utama
     */
    enterGameplayScreen() {
        this.showScreen('gameplay');
        // Render papan fisik
        boardRenderer.renderBoard();
        // Memulai giliran game engine
        gameEngine.startGame();
    }
}

// Inisialisasi App saat DOM termuat
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
export { App };
