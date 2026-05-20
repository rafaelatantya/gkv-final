/* ==========================================================================
   PLAYER DATA CLASS & EVOLUTION SYSTEM
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

import { audioManager } from './audio.js';

class Player {
    constructor(name, index, isBot = false) {
        this.name = name;
        this.index = index; // 1, 2, 3, atau 4
        this.isBot = isBot; // True jika digerakkan komputer
        
        this.position = 0; // Mulai dari petak 0 (Pra-Kuliah)
        this.suspensionTurns = 0; // Hitungan sanksi skip giliran (Skorsing)
        this.skullViolations = 0; // Akumulasi sanksi tengkorak (Maks 3 -> DO)
        this.isDroppedOut = false; // Status apakah dikeluarkan dari IPB
        this.currentEvolutionLvl = 1; // 1 s.d 5
        this.colorTheme = this.getColorTheme();
    }

    /**
     * Mendapatkan teks/tema warna representatif bidak
     */
    getColorTheme() {
        const themes = {
            1: { name: 'Biru Cyan', hex: '#00E5FF' },
            2: { name: 'Merah Maroon', hex: '#FF2E93' },
            3: { name: 'Hijau Toska', hex: '#1ED760' },
            4: { name: 'Oranye Pastel', hex: '#FF8800' }
        };
        return themes[this.index] || themes[1];
    }

    /**
     * Mengatur perpindahan posisi pemain
     * @param {number} newPosition Posisi petak target
     */
    setPosition(newPosition) {
        // Batasi posisi minimum di 0 dan maksimum di 100
        this.position = Math.max(0, Math.min(100, newPosition));
        
        // Cek apakah terjadi evolusi visual karakter
        this.checkEvolution();
    }

    /**
     * Cek dan perbarui level evolusi karakter secara real-time
     */
    checkEvolution() {
        let targetLvl = 1;

        if (this.position === 100) {
            targetLvl = 5; // Finish / Duta IPB
        } else if (this.position >= 76) {
            targetLvl = 4; // Kemeja Formal
        } else if (this.position >= 51) {
            targetLvl = 3; // Kaos Polo Rapi
        } else if (this.position >= 26) {
            targetLvl = 2; // Kasual Rapi Sedikit
        } else {
            targetLvl = 1; // Punk
        }

        // Jika ada kenaikan evolusi, putar efek suara selebrasi evolusi
        if (targetLvl !== this.currentEvolutionLvl) {
            if (targetLvl > this.currentEvolutionLvl && this.position > 0) {
                audioManager.playSFX('evolve');
            }
            this.currentEvolutionLvl = targetLvl;
            console.log(`Pemain ${this.name} berevolusi ke Level ${this.currentEvolutionLvl}!`);
        }
    }

    /**
     * Mendapatkan nama kelas visual/sprite berdasarkan level evolusi saat ini
     */
    getEvolutionSpriteName() {
        const levels = {
            1: "Punk Style",
            2: "Messy Casual",
            3: "Tidy T-Shirt",
            4: "Formal Shirt",
            5: "Duta IPB 🎉"
        };
        return levels[this.currentEvolutionLvl] || levels[1];
    }

    /**
     * Mendapatkan representasi karakter emoji (visual sementara)
     */
    getEvolutionEmoji() {
        const emojis = {
            1: "🧑‍🎤", // Punk
            2: "🧑‍💻", // Casual Messy
            3: "🧑‍💼", // Tidy T-Shirt
            4: "👔", // Formal Shirt
            5: "👑"  // Winner Duta IPB
        };
        return emojis[this.currentEvolutionLvl] || "🧑‍🎓";
    }

    /**
     * Memproses sanksi Petak Tengkorak
     * Mundur 4 baris, disuspensi 1 giliran, akumulasi DO
     * @param {string} reason Alasan pelanggaran akademik berat
     */
    applySkullSanction(reason) {
        this.skullViolations++;
        this.suspensionTurns = 1; // Dilewati 1 giliran berikutnya
        
        // Mundur 4 baris (40 petak)
        const targetPos = Math.max(0, this.position - 40);
        this.setPosition(targetPos);
        
        // Cek jika terkena DO
        if (this.skullViolations >= 3) {
            this.isDroppedOut = true;
        }
        
        audioManager.playSFX('bomb');
        return {
            newPos: targetPos,
            isDO: this.isDroppedOut,
            violations: this.skullViolations
        };
    }
}

export { Player };
