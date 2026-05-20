/* ==========================================================================
   CORE GAME ENGINE (STATE MACHINE & GAME LOOP)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

import { audioManager } from './audio.js';
import { boardRenderer } from './board.js';
import { diceController } from './dice.js';
import { Player } from './player.js';
import { quizManager } from './quiz.js';
import { contentData } from './contentData.js';

class GameEngine {
    constructor() {
        this.players = [];
        this.currentPlayerIdx = 0; // Index dari pemain aktif
        this.gameState = 'PRE_GAME'; // PRE_GAME, PLAYING, IN_ANIMATION, IN_MODAL, GAME_OVER
        
        // Timer giliran
        this.turnTimer = null;
        this.timeLeft = 10;
        this.maxTime = 10;

        // Referensi Elemen DOM Modals
        this.modalOverlay = null;
        this.modalBox = null;
        this.modalIcon = null;
        this.modalTitle = null;
        this.modalBody = null;
        this.modalFooter = null;
    }

    /**
     * Mempersiapkan list objek Player berdasarkan data setup awal
     * @param {Array} playersData Array berisi {name, index, isBot}
     */
    setupPlayers(playersData) {
        this.players = playersData.map(data => new Player(data.name, data.index, data.isBot));
        this.currentPlayerIdx = 0;
        this.gameState = 'PRE_GAME';
        
        this.initDOMReferences();
        this.updateStatusUI();
    }

    /**
     * Inisialisasi referensi elemen DOM
     */
    initDOMReferences() {
        this.modalOverlay = document.getElementById('modal-container');
        this.modalBox = document.getElementById('modal-box');
        this.modalIcon = document.getElementById('modal-icon');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.getElementById('modal-body');
        this.modalFooter = document.getElementById('modal-footer');
    }

    /**
     * Memulai jalannya permainan papan utama
     */
    startGame() {
        this.gameState = 'PLAYING';
        this.currentPlayerIdx = 0;
        
        // Posisikan semua bidak di petak 0 awal
        boardRenderer.updatePlayerTokens(this.players);
        
        // Inisialisasi controller dadu
        diceController.init((diceValue) => {
            this.handleDiceRollComplete(diceValue);
        });

        this.logMessage("Permainan dimulai! Semua mahasiswa bersiap di Petak 0 (Pra-Kuliah).", "system");
        
        // Mulai giliran pemain pertama
        this.startTurn();
    }

    /**
     * Memulai giliran untuk pemain aktif saat ini
     */
    startTurn() {
        if (this.gameState === 'GAME_OVER') return;

        const player = this.players[this.currentPlayerIdx];
        
        // Cek jika pemain telah Drop Out
        if (player.isDroppedOut) {
            this.nextTurn();
            return;
        }

        this.gameState = 'PLAYING';
        this.updateStatusUI();
        
        // Mainkan SFX transisi giliran baru
        audioManager.playSFX('click');

        // Rotasi otomatis musik BGM sesuai level petak pemain terdepan
        this.updateDynamicBGM();

        // 1. Cek Sanksi Skorsing (Suspended)
        if (player.suspensionTurns > 0) {
            player.suspensionTurns--;
            this.logMessage(`[SKORSING] Giliran ${player.name} dilewati karena sedang menjalani skorsing tata tertib!`, "sanction");
            
            // Tampilkan pop-up info skorsing sejenak sebelum dilewati
            this.showSuspensionAlert(player, () => {
                this.nextTurn();
            });
            return;
        }

        // Tampilkan badge pemain aktif
        const badge = document.getElementById('current-player-badge');
        if (badge) {
            badge.textContent = player.name;
            badge.className = `player-badge p${player.index}`;
            badge.style.boxShadow = `0 0 10px ${player.colorTheme.hex}`;
        }

        // Reset & Mulai Timer Giliran (10 Detik)
        this.resetTurnTimer();

        // 2. Perilaku Giliran: Manusia vs AI Bot
        if (player.isBot) {
            diceController.disableControls();
            this.logMessage(`Giliran ${player.name} (AI Bot) berpikir...`, "system");
            
            // Jeda realistis berpikir bagi Bot
            setTimeout(() => {
                if (this.gameState === 'PLAYING') {
                    this.stopTurnTimer();
                    diceController.triggerAISpeedRoll();
                }
            }, 1500);
        } else {
            diceController.enableControls();
            this.logMessage(`Giliran Anda, ${player.name}! Tahan tombol ROLL untuk membidik dadu.`, "move");
        }
    }

    /**
     * Memproses pergerakan setelah angka dadu didapat
     */
    handleDiceRollComplete(diceValue) {
        this.stopTurnTimer();
        const player = this.players[this.currentPlayerIdx];
        this.gameState = 'IN_ANIMATION';

        this.logMessage(`${player.name} melempar dadu dan mendapatkan angka: [ ${diceValue} ]`, "move");

        // Hitung posisi target & deteksi pantulan garis finish
        const currentPos = player.position;
        let targetPos = currentPos + diceValue;
        let isBouncing = false;
        let bounceSteps = 0;

        if (targetPos > 100) {
            isBouncing = true;
            bounceSteps = targetPos - 100;
            targetPos = 100 - bounceSteps;
            this.logMessage(`${player.name} melangkah melebihi petak 100! Memantul mundur ${bounceSteps} petak ke Petak ${targetPos}.`, "system");
        }

        // Pemicu pergerakan bidak langkah demi langkah (Smooth Step-by-Step Animation)
        this.moveStepByStep(player, diceValue, isBouncing, bounceSteps, () => {
            this.evaluateLandTile(player);
        });
    }

    /**
     * Animasi pergerakan bidak 1 per 1 petak
     */
    moveStepByStep(player, stepsRemaining, isBouncing, bounceSteps, onComplete) {
        if (stepsRemaining === 0) {
            onComplete();
            return;
        }

        // Hitung jika sedang bergerak maju atau berbalik memantul mundur
        // Misalkan total dadu = 5. Posisi awal 98. 
        // Langkah 1: 99, Langkah 2: 100 (Hit), Langkah 3: 99 (Bounce), Langkah 4: 98, Langkah 5: 97.
        let nextPos = player.position;

        if (isBouncing && (player.position === 100 || stepsRemaining <= bounceSteps)) {
            // Bergerak mundur karena memantul
            nextPos = player.position - 1;
        } else {
            // Bergerak maju normal
            nextPos = player.position + 1;
        }

        player.setPosition(nextPos);
        boardRenderer.updatePlayerTokens(this.players);
        audioManager.playSFX('click');

        setTimeout(() => {
            this.moveStepByStep(player, stepsRemaining - 1, isBouncing, bounceSteps, onComplete);
        }, 180); // Delay 180ms per langkah bidak
    }

    /**
     * Jalur pergerakan instan/langsung (untuk rintangan ular / akselerasi tangga)
     */
    moveDirectlyTo(player, targetPosition, sfxType, onComplete) {
        audioManager.playSFX(sfxType);
        
        const stepTransition = () => {
            if (player.position === targetPosition) {
                setTimeout(onComplete, 400); // Tunggu sejenak setelah mendarat
                return;
            }

            const step = player.position < targetPosition ? 1 : -1;
            player.setPosition(player.position + step);
            boardRenderer.updatePlayerTokens(this.players);
            audioManager.playSFX('click');

            setTimeout(stepTransition, 100); // Kecepatan luncuran ular/tangga lebih cepat (100ms)
        };

        stepTransition();
    }

    /**
     * Mengevaluasi efek dari petak akhir tempat pemain mendarat
     */
    evaluateLandTile(player) {
        const pos = player.position;

        // 1. Kondisi Kemenangan Mutlak (Petak 100)
        if (pos === 100) {
            this.triggerVictory(player);
            return;
        }

        // 2. Petak Khusus: Tengkorak (Sanction)
        if (boardRenderer.specialTiles.skull.includes(pos)) {
            const reason = contentData.skulls[pos];
            this.handleSkullTile(player, reason);
            return;
        }

        // 3. Petak Khusus: Tanda Tanya (Kuis)
        if (boardRenderer.specialTiles.quiz.includes(pos)) {
            this.handleQuizTile(player);
            return;
        }

        // 4. Objek Papan: Tangga (Ladders)
        if (boardRenderer.ladders[pos]) {
            const destination = boardRenderer.ladders[pos];
            const text = contentData.ladders[pos];
            this.handleLadderTile(player, destination, text);
            return;
        }

        // 5. Objek Papan: Ular (Snakes)
        if (boardRenderer.snakes[pos]) {
            const destination = boardRenderer.snakes[pos];
            const text = contentData.snakes[pos];
            this.handleSnakeTile(player, destination, text);
            return;
        }

        // 6. Petak Biasa (Normal Tiles)
        this.handleNormalTile(player);
    }

    /* ==========================================================================
       TILE EVENT HANDLERS
       ========================================================================== */

    // --- A. Petak Biasa (Normal Event) ---
    handleNormalTile(player) {
        this.gameState = 'IN_MODAL';
        
        // Tentukan level alasan berdasarkan evolusi pemain (Lvl 1-4)
        const lvl = Math.min(4, player.currentEvolutionLvl);
        const reasons = contentData.normalTiles[lvl];
        const randomIdx = Math.floor(Math.random() * reasons.length);
        const actionText = reasons[randomIdx];

        this.logMessage(`[KEGIATAN POSITIF] ${player.name} di Petak ${player.position}: ${actionText}`, "event");

        this.showModal({
            icon: "🍃",
            title: "Kegiatan Positif Mahasiswa",
            body: `
                <div style="text-align: center; margin-bottom: 15px; font-size: 3rem;">${player.getEvolutionEmoji()}</div>
                <p style="font-size: 1rem; line-height: 1.6; text-align: center; font-style: italic;">"${actionText}"</p>
                <div style="margin-top: 20px; background: rgba(30, 215, 96, 0.1); border: 1px solid var(--color-success); padding: 10px; border-radius: 8px; text-align: center; color: var(--color-success); font-weight: 600;">
                    Disiplin Kampus Terjaga! Bidak aman di Petak ${player.position}
                </div>
            `,
            buttons: [
                {
                    text: "Lanjutkan Kuliah",
                    class: "btn-primary",
                    action: () => {
                        this.hideModal();
                        this.nextTurn();
                    }
                }
            ]
        });
    }

    // --- B. Petak Tangga (Ladders) ---
    handleLadderTile(player, destination, text) {
        this.gameState = 'IN_MODAL';
        this.logMessage(`[PRESTASI] ${player.name} mendarat di Petak ${player.position}! Naik tangga menuju Petak ${destination}.`, "event");

        this.showModal({
            icon: "🪜",
            title: "Prestasi Mahasiswa Lolos!",
            body: `
                <div style="text-align: center; margin-bottom: 15px; font-size: 3rem;">🌟</div>
                <p style="font-size: 1rem; line-height: 1.6; font-weight: 500; text-align: center;">${text}</p>
                <div style="margin-top: 15px; text-align: center; color: var(--color-success); font-weight: 700;">
                    Melesat Naik ke Petak ${destination}!
                </div>
            `,
            buttons: [
                {
                    text: "Panjat Tangga",
                    class: "btn-primary btn-glow",
                    action: () => {
                        this.hideModal();
                        this.moveDirectlyTo(player, destination, 'ladder', () => {
                            this.nextTurn();
                        });
                    }
                }
            ]
        });
    }

    // --- C. Petak Ular (Snakes) ---
    handleSnakeTile(player, destination, text) {
        this.gameState = 'IN_MODAL';
        this.logMessage(`[PELANGGARAN] ${player.name} mendarat di Petak ${player.position}! Merosot turun ular ke Petak ${destination}.`, "sanction");

        this.showModal({
            icon: "🐍",
            title: "Peringatan Pelanggaran Tata Tertib!",
            body: `
                <div style="text-align: center; margin-bottom: 15px; font-size: 3rem;">⚠️</div>
                <p style="font-size: 1rem; line-height: 1.6; font-weight: 500; text-align: center; color: #ffbcbc;">${text}</p>
                <div style="margin-top: 15px; text-align: center; color: var(--color-danger); font-weight: 700;">
                    Turun Merosot ke Petak ${destination}!
                </div>
            `,
            buttons: [
                {
                    text: "Jalani Sanksi",
                    class: "btn-primary",
                    action: () => {
                        this.hideModal();
                        this.moveDirectlyTo(player, destination, 'snake', () => {
                            this.nextTurn();
                        });
                    }
                }
            ]
        });
    }

    // --- D. Petak Kuis Tanda Tanya (Quiz) ---
    handleQuizTile(player) {
        this.gameState = 'IN_MODAL';
        const quiz = quizManager.getRandomQuestion();
        
        this.logMessage(`[KUIS] ${player.name} memicu kuis tata tertib kampus di Petak ${player.position}!`, "system");

        // Callback saat bot menjawab kuis
        const isBot = player.isBot;
        
        this.showQuizModal(player, quiz, (selectedKey) => {
            const isCorrect = selectedKey === quiz.correctAnswer;
            
            // Putar SFX evaluasi jawaban
            audioManager.playSFX(isCorrect ? 'correct' : 'wrong');

            // Hitung target geser posisi
            const reward = isCorrect ? quiz.reward : quiz.penalty;
            const targetPos = Math.max(0, Math.min(100, player.position + reward));
            
            const explanationText = isCorrect ? quiz.explanation.correct : quiz.explanation.wrong;
            this.logMessage(`[HASIL KUIS] ${player.name} menjawab [${isCorrect ? 'BENAR' : 'SALAH'}]: ${explanationText}`, isCorrect ? "event" : "sanction");

            // Tampilkan Modal Hasil Evaluasi Jawaban
            this.showModal({
                icon: isCorrect ? "✅" : "❌",
                title: isCorrect ? "Jawaban Benar!" : "Jawaban Salah!",
                body: `
                    <p style="font-size: 1.05rem; line-height: 1.6; font-weight: 500; text-align: center;">${explanationText}</p>
                    <div style="margin-top: 15px; text-align: center; font-weight: 700; color: ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'};">
                        Posisi bergeser dari ${player.position} ke Petak ${targetPos}
                    </div>
                `,
                buttons: [
                    {
                        text: isCorrect ? "Ambil Hadiah" : "Terima Hukuman",
                        class: isCorrect ? "btn-primary btn-glow" : "btn-secondary",
                        action: () => {
                            this.hideModal();
                            this.moveDirectlyTo(player, targetPos, isCorrect ? 'ladder' : 'snake', () => {
                                this.nextTurn();
                            });
                        }
                    }
                ]
            });
        });

        // Simulasi bot memilih jawaban kuis secara otomatis
        if (isBot) {
            setTimeout(() => {
                // Pilih jawaban secara acak (75% kemungkinan memilih benar agar Bot menantang)
                const botChooseCorrect = Math.random() < 0.75;
                const finalKey = botChooseCorrect ? quiz.correctAnswer : (quiz.correctAnswer === 'A' ? 'B' : 'A');
                
                // Trigger visual click di option button bot
                const options = this.modalBody.querySelectorAll('.btn-option');
                options.forEach(opt => {
                    if (opt.dataset.key === finalKey) {
                        opt.classList.add('selected');
                    }
                });

                // Auto submit setelah 1.2 detik
                setTimeout(() => {
                    const submitBtn = this.modalFooter.querySelector('button');
                    if (submitBtn) submitBtn.click();
                }, 1200);

            }, 1800);
        }
    }

    // --- E. Petak Tengkorak (Sanction Heavy) ---
    handleSkullTile(player, reason) {
        this.gameState = 'IN_MODAL';
        
        // Terapkan sanksi akademis di kelas Player
        const result = player.applySkullSanction(reason);
        
        this.logMessage(`[SANKSI FATAL] ${player.name} mendarat di Petak Tengkorak ${player.position}! Sanksi: ${reason}. Pelanggaran: [ ${result.violations} / 3 ]`, "sanction");

        if (result.isDO) {
            // Pemain langsung Drop Out!
            this.handlePlayerDropOut(player);
            return;
        }

        // Tampilkan modal bom ledakan dengan background berkedip merah (Cyberpunk Sanction Alert)
        this.modalOverlay.style.background = 'rgba(230, 25, 25, 0.45)'; // Flash red
        audioManager.playSFX('bomb');

        this.showModal({
            icon: "💀",
            title: "PELANGGARAN AKADEMIK BERAT!",
            body: `
                <div class="bomb-animation" style="text-align: center; margin-bottom: 15px; font-size: 4rem; animation: pulse-glow 0.5s infiniteAlternate;">💣</div>
                <p style="font-size: 1.05rem; line-height: 1.6; font-weight: 700; text-align: center; color: var(--color-danger);">${reason}</p>
                <hr style="margin: 15px 0; border: none; border-top: 1px dashed rgba(255,255,255,0.15);">
                <div style="background: rgba(230,25,25,0.1); border: 1px solid var(--color-danger); padding: 12px; border-radius: 8px; font-size: 0.9rem;">
                    <ul style="list-style-type: none; padding: 0; margin: 0; text-align: left; color: #ffbcbc;">
                        <li>⚠️ <strong>Skorsing:</strong> Hak melangkah dibekukan selama 1 putaran.</li>
                        <li>📉 <strong>Penurunan Baris:</strong> Mundur 4 baris ke bawah.</li>
                        <li>🔴 <strong>Akumulasi Sanksi:</strong> ${result.violations} dari batas maks 3 kali (Bila 3 kali mendarat akan langsung <strong>DROP OUT</strong>).</li>
                    </ul>
                </div>
            `,
            buttons: [
                {
                    text: "Jalani Hukuman & Turun Baris",
                    class: "btn-primary btn-glow",
                    action: () => {
                        this.modalOverlay.style.background = 'rgba(5, 7, 15, 0.85)'; // Restore background blur
                        this.hideModal();
                        
                        // Lakukan animasi geser mundur ke posisi sanksi
                        this.moveDirectlyTo(player, result.newPos, 'snake', () => {
                            this.nextTurn();
                        });
                    }
                }
            ]
        });
    }

    /**
     * Memproses sanksi Drop Out langsung bagi pemain aktif
     */
    handlePlayerDropOut(player) {
        audioManager.playSFX('dropout');
        this.modalOverlay.style.background = 'rgba(120, 10, 10, 0.9)'; // Dark blood red

        this.showModal({
            icon: "🚫",
            title: "SURAT REKTOR: DROP OUT!",
            body: `
                <div style="text-align: center; margin-bottom: 20px; font-size: 4rem;">🎓❌</div>
                <h4 style="text-align: center; color: var(--color-danger); font-size: 1.2rem; font-family: var(--font-heading); font-weight: 800; margin-bottom: 10px;">MAHASISWA DIBERHENTIKAN SECARA TIDAK HORMAT</h4>
                <p style="font-size: 0.95rem; line-height: 1.6; text-align: center; color: #ccc;">
                    Saudara <strong>${player.name}</strong> secara resmi dinyatakan dikeluarkan (Drop Out) dari Institut Pertanian Bogor dikarenakan telah mendarat di Petak Tengkorak sebanyak 3 kali secara akumulatif.
                </p>
                <div style="margin-top: 20px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; text-align: center; color: var(--color-danger); font-weight: bold; border: 1px solid var(--color-danger);">
                    STATUS: DROP OUT (GUGUR DARI BOARD GAME)
                </div>
            `,
            buttons: [
                {
                    text: "Keluar dari Kampus Dramaga",
                    class: "btn-primary",
                    action: () => {
                        this.modalOverlay.style.background = 'rgba(5, 7, 15, 0.85)'; // Restore
                        this.hideModal();
                        
                        // Hapus bidak di papan
                        boardRenderer.updatePlayerTokens(this.players);
                        
                        // Cek jika seluruh pemain Drop Out
                        const allDroppedOut = this.players.every(p => p.isDroppedOut);
                        if (allDroppedOut) {
                            this.triggerGameOverLose();
                        } else {
                            this.nextTurn();
                        }
                    }
                }
            ]
        });
    }

    // --- F. Pop-up Suspended Alert ---
    showSuspensionAlert(player, onComplete) {
        this.gameState = 'IN_MODAL';
        
        this.showModal({
            icon: "⏳",
            title: "Skorsing Tata Tertib Sedang Berjalan",
            body: `
                <div style="text-align: center; margin-bottom: 15px; font-size: 3rem;">🧑‍🎓🔒</div>
                <p style="font-size: 1.05rem; line-height: 1.6; text-align: center; font-weight: 500;">
                    Mahasiswa <strong>${player.name}</strong> sedang berada dalam masa suspensi akademik akibat pelanggaran berat sebelumnya.
                </p>
                <p style="text-align: center; color: var(--color-danger); font-weight: 600; margin-top: 10px;">
                    Hak melangkah Anda dibekukan untuk giliran putaran ini!
                </p>
            `,
            buttons: [
                {
                    text: "Lewati Giliran",
                    class: "btn-secondary",
                    action: () => {
                        this.hideModal();
                        onComplete();
                    }
                }
            ]
        });

        // Jika Bot, skip alert otomatis setelah 2 detik
        if (player.isBot) {
            setTimeout(() => {
                const btn = this.modalFooter.querySelector('button');
                if (btn) btn.click();
            }, 2000);
        }
    }

    /* ==========================================================================
       VICTORY & GAME OVER CONTROLLERS
       ========================================================================== */

    /**
     * Memicu kemenangan mutlak saat mendarat tepat di petak 100
     */
    triggerVictory(player) {
        this.gameState = 'GAME_OVER';
        this.stopTurnTimer();
        diceController.disableControls();

        // Putar musik Mars IPB sebagai lagu kemenangan megah
        audioManager.playBGM('winner');

        // Bikin podium list (pemenang urutan pertama)
        const sortedPlayers = [...this.players]
            .filter(p => !p.isDroppedOut)
            .sort((a, b) => b.position - a.position);

        this.showModal({
            icon: "👑",
            title: "DUTA IPB UNIVERSITY TERBENTUK!",
            body: `
                <div style="text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 5rem; display: block; animation: pulse-glow 1s infinite alternate;">🏆</span>
                    <span style="font-size: 1.2rem; font-weight: 800; color: var(--color-secondary); font-family: var(--font-heading); display: block; margin-top: 10px;">WISUDA LULUSAN DENGAN PUJIAN</span>
                </div>
                <h4 style="text-align: center; font-size: 1.3rem; font-family: var(--font-heading); font-weight: 800; margin-bottom: 8px;">Selamat, ${player.name}!</h4>
                <p style="font-size: 0.95rem; line-height: 1.6; text-align: center; color: #ddd; margin-bottom: 20px;">
                    Anda berhasil menertibkan diri dari Punk nakal di petak 0 hingga dinobatkan menjadi <strong>Duta IPB University Berprestasi</strong> seutuhnya di Petak 100!
                </p>
                <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-glass); border-radius: 12px; padding: 15px;">
                    <h5 style="font-family: var(--font-heading); font-weight: 700; margin-bottom: 10px; text-align: center; color: var(--color-accent);">📊 Peringkat Wisuda Kampus</h5>
                    <ol style="padding-left: 20px; margin: 0; color: #ccc; font-size: 0.9rem;">
                        <li style="color: #fff; font-weight: bold; margin-bottom: 4px;">🥇 ${player.name} (Petak 100) - Duta IPB!</li>
                        ${sortedPlayers.filter(p => p.index !== player.index).map(p => `
                            <li style="margin-bottom: 4px;">🥈 ${p.name} (Petak ${p.position}) - Lulus (${p.getEvolutionSpriteName()})</li>
                        `).join('')}
                        ${this.players.filter(p => p.isDroppedOut).map(p => `
                            <li style="color: var(--color-danger); opacity: 0.6; margin-bottom: 4px;">❌ ${p.name} - (Drop Out)</li>
                        `).join('')}
                    </ol>
                </div>
            `,
            buttons: [
                {
                    text: "Kembali ke Menu Utama",
                    class: "btn-primary btn-glow",
                    action: () => {
                        this.hideModal();
                        // Reset BGM ke Menu utama
                        audioManager.playBGM('menu');
                        // Kembalikan SPA ke menu
                        if (window.app) {
                            window.app.showScreen('menu');
                        }
                    }
                }
            ]
        });
    }

    /**
     * Kondisi kekalahan mutlak: Seluruh pemain gugur terkena Drop Out (DO)
     */
    triggerGameOverLose() {
        this.gameState = 'GAME_OVER';
        this.stopTurnTimer();
        diceController.disableControls();

        // Mainkan SFX sedih / funeral
        audioManager.playSFX('dropout');

        this.showModal({
            icon: "⛓️",
            title: "GAME OVER: REKTORAT DITUTUP!",
            body: `
                <div style="text-align: center; margin-bottom: 20px; font-size: 4rem;">💀🎓</div>
                <h4 style="text-align: center; color: var(--color-danger); font-size: 1.3rem; font-family: var(--font-heading); font-weight: 800; margin-bottom: 10px;">SElURUH MAHASISWA TELAH DROP OUT!</h4>
                <p style="font-size: 0.95rem; line-height: 1.6; text-align: center; color: #ccc; margin-bottom: 15px;">
                    Tragis! Tidak ada satupun mahasiswa yang berhasil mematuhi tata tertib dengan baik. Semua peserta permainan telah di-Drop Out dari kampus Dramaga karena melanggar tata tertib berat berulang kali.
                </p>
                <div style="background: rgba(230, 25, 25, 0.15); border: 1px solid var(--color-danger); padding: 12px; border-radius: 8px; text-align: center; color: var(--color-danger); font-weight: 800;">
                    KEDISIPLINAN KAMPUS TOTAL GAGAL!
                </div>
            `,
            buttons: [
                {
                    text: "Ulangi Persiapan PPKU",
                    class: "btn-primary btn-glow",
                    action: () => {
                        this.hideModal();
                        audioManager.playBGM('menu');
                        if (window.app) {
                            window.app.showScreen('menu');
                        }
                    }
                }
            ]
        });
    }

    /* ==========================================================================
       TURN MANAGEMENT & TIMERS
       ========================================================================== */

    /**
     * Menggeser giliran ke pemain berikutnya
     */
    nextTurn() {
        if (this.gameState === 'GAME_OVER') return;

        this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
        
        // Berikan jeda transisi giliran agar pergantian bidak tidak patah-patah
        setTimeout(() => {
            this.startTurn();
        }, 500);
    }

    /**
     * Mengatur rotasi BGM secara dinamis berdasarkan posisi maba terjauh di papan
     */
    updateDynamicBGM() {
        // Cari posisi petak terdepan di antara player yang aktif (non-DO)
        const activePlayers = this.players.filter(p => !p.isDroppedOut);
        if (activePlayers.length === 0) return;

        const maxPos = Math.max(...activePlayers.map(p => p.position));

        if (maxPos >= 76) {
            audioManager.playBGM('level3'); // Fase Skripsi (76-99)
        } else if (maxPos >= 26) {
            audioManager.playBGM('level2'); // Fase Kuliah Departemen (26-75)
        } else {
            audioManager.playBGM('level1'); // Fase PPKU (0-25)
        }
    }

    /**
     * Merestart hitungan mundur giliran (10 Detik)
     */
    resetTurnTimer() {
        this.stopTurnTimer();
        this.timeLeft = this.maxTime;
        
        const timerElement = document.getElementById('timer-value');
        if (timerElement) timerElement.textContent = this.timeLeft;

        this.turnTimer = setInterval(() => {
            this.timeLeft--;
            if (timerElement) timerElement.textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                this.stopTurnTimer();
                this.handleTurnTimeout();
            }
        }, 1000);
    }

    /**
     * Menghentikan interval timer giliran aktif
     */
    stopTurnTimer() {
        if (this.turnTimer) {
            clearInterval(this.turnTimer);
            this.turnTimer = null;
        }
    }

    /**
     * Penanganan saat batas waktu giliran 10 detik habis (Auto Roll Dadu)
     */
    handleTurnTimeout() {
        const player = this.players[this.currentPlayerIdx];
        this.logMessage(`Batas waktu habis! Giliran ${player.name} bergulir otomatis (Auto Roll).`, "system");

        if (player.isBot) {
            // Memicu pelemparan otomatis langsung
            diceController.triggerAISpeedRoll();
        } else {
            // Manusia auto-roll: matikan kontrol dadu dan simulasikan lemparan daya acak (50%)
            diceController.disableControls();
            const rndPercent = 50;
            const targetVal = diceController.calculateDiceTarget(rndPercent);
            diceController.animateRoll(targetVal);
        }
    }

    /* ==========================================================================
       UI INTERFACE UPDATERS
       ========================================================================== */

    /**
     * Memperbarui daftar status bar pemain di panel sidebar kiri
     */
    updateStatusUI() {
        const listContainer = document.getElementById('player-status-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        this.players.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = `player-status-card`;
            
            // Tandai jika giliran aktif atau sedang disuspensi/DO
            if (idx === this.currentPlayerIdx && this.gameState === 'PLAYING') {
                card.classList.add('active-turn');
                card.style.borderColor = p.colorTheme.hex;
            }
            if (p.suspensionTurns > 0) {
                card.classList.add('suspended');
            }
            if (p.isDroppedOut) {
                card.style.opacity = '0.35';
                card.style.textDecoration = 'line-through';
            }

            // Bentuk visualisasi pelanggaran tengkorak (💀)
            let skullIcons = "";
            for (let i = 1; i <= 3; i++) {
                if (i <= p.skullViolations) {
                    skullIcons += "🔴 "; // Sanksi aktif
                } else {
                    skullIcons += "⚪ "; // Kosong
                }
            }

            card.innerHTML = `
                <div class="status-card-header">
                    <span class="status-card-name" style="color: ${p.colorTheme.hex};">${p.name} ${p.isBot ? '(AI)' : ''}</span>
                    <span class="player-badge p${p.index}" style="font-size: 0.6rem; padding: 2px 6px;">P${p.index}</span>
                </div>
                <div class="status-card-stats">
                    <span>Posisi: <strong>Petak ${p.position}</strong></span>
                    <span>Sanksi: <strong style="color: var(--color-danger);">${skullIcons}</strong></span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                    <span class="status-card-evolution">${p.getEvolutionEmoji()} ${p.getEvolutionSpriteName()}</span>
                    ${p.suspensionTurns > 0 ? `<span style="font-size: 0.7rem; color: var(--color-danger); font-weight: 700; animation: pulse-glow 0.8s infiniteAlternate;">DITANGGUHKAN</span>` : ''}
                    ${p.isDroppedOut ? `<span style="font-size: 0.7rem; color: var(--color-danger); font-weight: 700;">DROP OUT</span>` : ''}
                </div>
            `;

            listContainer.appendChild(card);
        });
    }

    /**
     * Memasukkan baris riwayat berita aktivitas di sidebar bawah
     */
    logMessage(message, type = "system") {
        const logContent = document.getElementById('log-messages');
        if (!logContent) return;

        const logItem = document.createElement('p');
        logItem.className = `log-item ${type}`;
        
        // Waktu log bergaya retro jam digital
        const time = new Date();
        const timeStr = `[${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}] `;
        
        logItem.textContent = timeStr + message;
        
        logContent.appendChild(logItem);
        // Scroll log ke bagian terbawah secara otomatis
        logContent.scrollTop = logContent.scrollHeight;
    }

    /* ==========================================================================
       MODAL VIEW CONTROLLERS (OPEN/CLOSE/QUIZ)
       ========================================================================== */

    /**
     * Membuka modal box dialog kustom
     * @param {Object} config {icon, title, body, buttons: [{text, class, action}]}
     */
    showModal(config) {
        if (!this.modalOverlay) return;

        this.modalIcon.textContent = config.icon || "💡";
        this.modalTitle.textContent = config.title || "Pengumuman Kampus";
        this.modalBody.innerHTML = config.body || "";
        this.modalFooter.innerHTML = "";

        // Buat tombol interaktif secara dinamis
        if (config.buttons && config.buttons.length > 0) {
            config.buttons.forEach(btn => {
                const btnEl = document.createElement('button');
                btnEl.className = `btn ${btn.class || 'btn-secondary'}`;
                btnEl.textContent = btn.text || "OK";
                btnEl.addEventListener('click', () => {
                    audioManager.playSFX('click');
                    if (btn.action) btn.action();
                });
                this.modalFooter.appendChild(btnEl);
            });
        }

        this.modalOverlay.classList.remove('hidden');
    }

    /**
     * Membuka modal khusus untuk pilihan ganda soal kuis tata tertib
     */
    showQuizModal(player, quiz, onSubmit) {
        if (!this.modalOverlay) return;

        this.modalIcon.textContent = "❓";
        this.modalTitle.textContent = `Kuis Mahasiswa: ${player.name}`;
        
        // Rancang antarmuka kuis pilihan ganda
        this.modalBody.innerHTML = `
            <div style="margin-bottom: 12px; font-size: 0.8rem; color: var(--color-accent); font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Petak Kuis Tata Tertib IPB</div>
            <p class="quiz-question" style="font-size: 1.05rem; line-height: 1.5; font-weight: 600; margin-bottom: 20px;">${quiz.question}</p>
            <div class="quiz-options" id="quiz-options-wrapper">
                ${quiz.options.map(opt => `
                    <button class="btn-option" data-key="${opt.key}">
                        <strong style="color: var(--color-accent); margin-right: 8px;">[ ${opt.key} ]</strong> ${opt.text}
                    </button>
                `).join('')}
            </div>
        `;

        this.modalFooter.innerHTML = "";
        
        // Tombol submit kuis
        const submitBtn = document.createElement('button');
        submitBtn.className = "btn btn-primary btn-glow btn-wide";
        submitBtn.textContent = "Kirim Jawaban";
        submitBtn.disabled = true; // Dinonaktifkan sebelum ada opsi yang dipilih
        this.modalFooter.appendChild(submitBtn);

        this.modalOverlay.classList.remove('hidden');

        // Event listener untuk penyeleksian opsi kuis
        let selectedOptionKey = null;
        const optionButtons = this.modalBody.querySelectorAll('.btn-option');
        
        optionButtons.forEach(btn => {
            // Hindari klik manusia jika giliran Bot
            if (player.isBot) {
                btn.style.pointerEvents = 'none';
            }

            btn.addEventListener('click', () => {
                audioManager.playSFX('click');
                optionButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedOptionKey = btn.dataset.key;
                submitBtn.disabled = false; // Aktifkan tombol submit
            });
        });

        // Event listener submit jawaban
        submitBtn.addEventListener('click', () => {
            if (selectedOptionKey) {
                onSubmit(selectedOptionKey);
            }
        });
    }

    /**
     * Menyembunyikan modal box dialog
     */
    hideModal() {
        if (this.modalOverlay) {
            this.modalOverlay.classList.add('hidden');
        }
    }
}

export const gameEngine = new GameEngine();
export { GameEngine };
