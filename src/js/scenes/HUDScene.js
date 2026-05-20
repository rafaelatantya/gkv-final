/* ==========================================================================
   PHASER SCENE: HUD SCENE (GLASSMORPHISM UI OVERLAY LAYER)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

import { DiceGauge } from '../components/DiceGauge.js';
import { SFXEngine } from '../components/SFXEngine.js';

export class HUDScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HUDScene' });
    }

    /**
       Fungsi bawaan Phaser untuk inisialisasi awal scene.
       @param {Object} data Objek data berisi array pemain hasil setup.
     */
    init(data) {
        this.playersList = data.players || [];
        this.turnTimerCountdown = 10;
        this.turnTimerEvent = null;
    }

    /**
       Fungsi pembuatan komponen visual HUD.
     */
    create() {
        console.log("📺 HUDScene Active: Merakit Lapisan UI Glassmorphism...");

        // Hubungkan instansi SFXEngine secara global untuk HUD
        this.sfxEngine = new SFXEngine(this);

        // Ambil reference langsung ke GameScene untuk koordinasi turn loop
        this.gameScene = this.scene.get('GameScene');

        // Suntikkan layout gameplay HTML/CSS secara utuh ke DOM Overlay Layer
        this.renderGameplayHUDLayout();

        // Inisialisasi pengukur daya dadu LGR Style
        this.initializeDiceGaugeMechanics();
    }

    /**
       Menginjeksi elemen DOM struktur layout dasar HUD game di atas canvas Phaser.
     */
    renderGameplayHUDLayout() {
        const uiContainer = document.getElementById('app-ui-layer');
        if (!uiContainer) return;

        uiContainer.innerHTML = '';

        // Elemen pembungkus grid gameplay
        const gameplayGrid = document.createElement('div');
        gameplayGrid.className = 'game-screen';
        gameplayGrid.id = 'screen-gameplay';

        gameplayGrid.innerHTML = `
            <!-- SIDEBAR KIRI: Status Pemain & Log Info -->
            <div class="glass-panel sidebar-panel">
                <div class="sidebar-header">
                    <h3>🎓 MAHASISWA IPB</h3>
                </div>
                
                <!-- Status List Pemain PPKU-Skripsi -->
                <div id="sidebar-players-status-list">
                    <!-- Dinamis terisi oleh helper method -->
                </div>
                
                <!-- Penunjuk Giliran Aktif & Timer 10 Detik -->
                <div class="turn-indicator-box">
                    <div>
                        <p>GILIRAN MAHASISWA</p>
                        <h4 id="hud-active-player-name" style="font-family:var(--font-heading); color:#00e5ff;">Budi PPKU</h4>
                    </div>
                    <div class="turn-timer" id="hud-turn-timer">10s</div>
                </div>
                
                <!-- Berita Kampus (Activity Log Box) -->
                <div class="activity-log-box">
                    <h4>📰 BERITA KAMPUS</h4>
                    <div class="log-content" id="hud-activity-log-box">
                        <div class="log-item system">Registrasi mahasiswa baru selesai. Permainan dimulai!</div>
                    </div>
                </div>
            </div>
            
            <!-- PANEL KANAN ATAS: Hanya placeholder untuk menyeimbangkan letak Canvas Phaser -->
            <div class="board-container"></div>
            
            <!-- CONTROL BAR KANAN BAWAH: Dice Charge & Roll Action -->
            <div class="glass-panel control-panel">
                <!-- Pengatur Audio BGM/SFX -->
                <div class="audio-controls">
                    <button id="btn-toggle-audio" class="btn-circle" title="Matikan Suara">🔊</button>
                </div>
                
                <!-- LGR Force Gauge -->
                <div class="dice-gauge-container">
                    <div class="gauge-label">
                        HOLD TOMBOL UNTUK CHARGE POWER DADU (LGR STYLE)
                    </div>
                    <div class="gauge-bar-wrapper">
                        <div class="gauge-bar-fill" id="dice-charge-fill"></div>
                        <div class="gauge-markers">
                            <span class="marker" style="left:20%;">MIN</span>
                            <span class="marker" style="left:50%;">MID</span>
                            <span class="marker" style="left:80%;">MAX</span>
                        </div>
                    </div>
                </div>
                
                <!-- Tombol Roll & Visual Hasil Dadu -->
                <div class="dice-roll-actions">
                    <button id="btn-roll-dice" class="btn btn-primary btn-glow">LEMPAR DADU</button>
                    <div id="dice-visuals-container">
                        <span id="hud-dice-icon" class="dice">🎲</span>
                        <span id="dice-result-text">HASIL DADU<br/><strong>0</strong></span>
                    </div>
                </div>
            </div>
        `;

        uiContainer.appendChild(gameplayGrid);

        // Update list status pemain pertama kali
        this.updatePlayersStatusList(this.playersList);

        // Daftarkan event listener audio toggle
        let audioEnabled = true;
        document.getElementById('btn-toggle-audio').addEventListener('click', (e) => {
            audioEnabled = !audioEnabled;
            if (audioEnabled) {
                this.sound.mute = false;
                e.currentTarget.textContent = "🔊";
                this.addLogActivityMessage("Audio diaktifkan kembali.", "system");
            } else {
                this.sound.mute = true;
                e.currentTarget.textContent = "🔇";
                this.addLogActivityMessage("Audio dimatikan (Silent mode).", "system");
            }
        });
    }

    /**
       Menyiapkan mekanisme pengisian daya dadu LGR.
     */
    initializeDiceGaugeMechanics() {
        this.diceGauge = new DiceGauge(this, (rolledNumber, finalCharge) => {
            // Matikan tombol dadu agar tidak di-spam saat bidak melompat
            this.diceGauge.setDisabled(true);

            // Perbarui visual angka dadu di HUD
            this.updateDiceVisualIconResult(rolledNumber, finalCharge);

            // Beritahu GameScene untuk menjalankan gerakan lompat bidak
            if (this.gameScene) {
                this.gameScene.handleDiceRollResult(rolledNumber);
            }
        });
    }

    /**
       Fungsi loop update Phaser 3 untuk sinkronisasi meteran dadu.
     */
    update() {
        if (this.diceGauge) {
            this.diceGauge.update();
        }
    }

    /**
       Memperbarui sidebar panel list data mahasiswa secara real-time.
       @param {Array} players Array data status pemain.
     */
    updatePlayersStatusList(players) {
        const listContainer = document.getElementById('sidebar-players-status-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        players.forEach(p => {
            const isSuspendedText = p.isSuspended ? ' (DISKORS)' : '';
            
            const card = document.createElement('div');
            card.className = `player-status-card${p.isSuspended ? ' suspended' : ''}`;
            card.id = `status-card-p${p.id}`;

            card.innerHTML = `
                <div class="status-card-header">
                    <span class="status-card-name">${p.name}${isSuspendedText}</span>
                    <span class="player-badge p${p.id}">P${p.id}</span>
                </div>
                <div class="status-card-stats">
                    <span>Petak: <strong>${p.currentPosition}</strong></span>
                    <span>Sanksi DO: <strong>${p.skullCount}/3</strong></span>
                </div>
                <div class="status-card-evolution">
                    Lvl ${p.evolutionLevel} - ${this.getPlayerEvolutionName(p.evolutionLevel)}
                </div>
            `;

            listContainer.appendChild(card);
        });
    }

    /**
       Helper mendapatkan nama tingkat akademis evolusi.
     */
    getPlayerEvolutionName(level) {
        switch (level) {
            case 1: return "Maba PPKU";
            case 2: return "Departemen";
            case 3: return "Praktikan";
            case 4: return "Calon Wisuda";
            default: return "Maba";
        }
    }

    /**
       Menandai secara visual giliran mahasiswa yang aktif melempar dadu dan
       menjalankan hitung mundur 10 detik.
       @param {Object} activePlayer Data profil pemain aktif.
     */
    highlightActivePlayerTurn(activePlayer) {
        // 1. Bersihkan tanda aktif di seluruh kartu pemain sidebar
        const allCards = document.querySelectorAll('.player-status-card');
        allCards.forEach(card => card.classList.remove('active-turn'));

        // 2. Beri highlight border cyan pada kartu pemain aktif
        const activeCard = document.getElementById(`status-card-p${activePlayer.id}`);
        if (activeCard) {
            activeCard.classList.add('active-turn');
        }

        // 3. Perbarui tulisan nama di penunjuk giliran
        const nameLabel = document.getElementById('hud-active-player-name');
        if (nameLabel) {
            nameLabel.textContent = activePlayer.name;
            nameLabel.style.color = activePlayer.id === 1 ? '#00e5ff' : (activePlayer.id === 2 ? '#ff2e93' : (activePlayer.id === 3 ? '#1ed760' : '#ff8800'));
        }

        // 4. Nyalakan kembali tombol dadu (jika pemain bukan bot)
        if (this.diceGauge) {
            this.diceGauge.setDisabled(activePlayer.isBot);
        }

        // 5. Jalankan countdown 10 detik
        this.startTurnCountdownTimer(activePlayer);
    }

    /**
       Menjalankan timer hitung mundur 10 detik per putaran giliran.
     */
    startTurnCountdownTimer(activePlayer) {
        // Hentikan timer putaran sebelumnya
        if (this.turnTimerEvent) {
            this.turnTimerEvent.destroy();
        }

        this.turnTimerCountdown = 10;
        const timerLabel = document.getElementById('hud-turn-timer');
        if (timerLabel) {
            timerLabel.textContent = "10s";
            timerLabel.style.color = '#ffd700'; // Emas
        }

        this.turnTimerEvent = this.time.addEvent({
            delay: 1000,
            repeat: 9,
            callback: () => {
                this.turnTimerCountdown--;
                if (timerLabel) {
                    timerLabel.textContent = `${this.turnTimerCountdown}s`;
                    
                    // Merahkan tulisan jika waktu kritis di bawah 4 detik
                    if (this.turnTimerCountdown <= 3) {
                        timerLabel.style.color = '#ff3333';
                        this.sfxEngine.playEffectSound('sfx_dice_charge', 'dice'); // Detak kecil sfx
                    }
                }

                // Waktu habis! Lewati giliran pemain secara otomatis
                if (this.turnTimerCountdown === 0) {
                    this.addLogActivityMessage(`Waktu habis! Giliran ${activePlayer.name} terlewatkan.`, "system");
                    this.gameScene.handlePlayerTurnTimeout();
                }
            }
        });
    }

    /**
       Menghentikan hitung mundur timer saat dadu berhasil diklik/dilemparkan.
     */
    stopTurnCountdownTimer() {
        if (this.turnTimerEvent) {
            this.turnTimerEvent.destroy();
        }
        const timerLabel = document.getElementById('hud-turn-timer');
        if (timerLabel) {
            timerLabel.textContent = "WAIT";
            timerLabel.style.color = '#8b9bb4';
        }
    }

    /**
       Menuliskan pesan teks ke dalam log Berita Kampus di sidebar.
       @param {String} message Pesan yang ingin disampaikan.
       @param {String} type Jenis pesan ('system', 'move', 'event', 'sanction').
     */
    addLogActivityMessage(message, type = 'system') {
        const logBox = document.getElementById('hud-activity-log-box');
        if (!logBox) return;

        const logItem = document.createElement('div');
        logItem.className = `log-item ${type}`;
        logItem.innerHTML = `[${new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ${message}`;

        logBox.appendChild(logItem);
        
        // Auto scroll log ke posisi paling bawah
        logBox.scrollTop = logBox.scrollHeight;
    }

    /**
       Mengubah visual gambar dadu sesuai dengan angka dadu asli yang terpilih.
     */
    updateDiceVisualIconResult(diceNumber, chargePower) {
        const diceIcon = document.getElementById('hud-dice-icon');
        const diceResult = document.getElementById('dice-result-text');

        // Peta visual karakter dadu 🎲
        const diceIconsMap = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' };

        if (diceIcon) diceIcon.textContent = diceIconsMap[diceNumber] || '🎲';
        if (diceResult) {
            diceResult.innerHTML = `ANGKA: <strong>${diceNumber}</strong><br/>Power: ${chargePower.toFixed(0)}%`;
        }
    }

    /**
       Membuka pop-up modal Kuis Ujian UTS/UAS pilihan ganda.
       @param {Object} questionData Objek soal kuis dari bank data.
       @param {Function} onAnswerCallback Callback menerima parameter boolean true/false.
     */
    showQuizModal(questionData, onAnswerCallback) {
        this.stopTurnCountdownTimer();

        const uiContainer = document.getElementById('app-ui-layer');
        if (!uiContainer) return;

        // Sound kuis berbunyi
        this.sfxEngine.playEffectSound('sfx_dice_charge', 'dice');

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.id = 'quiz-modal-window';

        modalOverlay.innerHTML = `
            <div class="glass-panel modal-box">
                <div class="modal-header">
                    <span class="modal-icon">❓</span>
                    <span class="modal-title">UTS / UAS AKADEMIK IPB</span>
                </div>
                <div class="modal-body">
                    <p class="quiz-question">${questionData.question}</p>
                    <div class="quiz-options">
                        <!-- Opsi pilihan ganda dinamis -->
                    </div>
                </div>
            </div>
        `;

        uiContainer.appendChild(modalOverlay);

        const optionsContainer = modalOverlay.querySelector('.quiz-options');
        
        // Daftarkan opsi pilihan ganda A dan B
        questionData.options.forEach(opt => {
            const btnOpt = document.createElement('button');
            btnOpt.className = 'btn-option';
            btnOpt.innerHTML = `<strong>${opt.key}.</strong> ${opt.text}`;
            
            btnOpt.addEventListener('click', () => {
                this.sfxEngine.playEffectSound('sfx_dice_charge', 'dice');
                
                // Evaluasi apakah jawaban yang diklik adalah kunci jawaban benar
                const isCorrect = opt.key.toUpperCase() === questionData.correctKey.toUpperCase();
                
                // Mainkan SFX evaluasi jawaban kuis
                this.sfxEngine.playEffectSound(
                    isCorrect ? 'sfx_quiz_correct' : 'sfx_quiz_wrong',
                    isCorrect ? 'correct' : 'wrong'
                );

                // Buang modal kuis dari layar DOM
                modalOverlay.remove();

                // Tembakkan callback hasil evaluasi kuis ke GameScene
                if (onAnswerCallback) {
                    onAnswerCallback(isCorrect);
                }
            });

            optionsContainer.appendChild(btnOpt);
        });
    }

    /**
       Membuka pop-up modal informasi statis (Prestasi tangga / Sanksi ular).
       @param {String} title Judul informasi pop-up.
       @param {String} message Isi deskripsi sanksi/prestasi.
       @param {String} actionType Tipe visual aksi ('ladder', 'snake', 'skull').
       @param {Function} onConfirmCallback Callback setelah tombol OK ditekan.
     */
    showTileActionModal(title, message, actionType, onConfirmCallback) {
        this.stopTurnCountdownTimer();

        const uiContainer = document.getElementById('app-ui-layer');
        if (!uiContainer) return;

        let icon = '🪜';
        let sfxKey = 'sfx_ladder_up';
        let synthType = 'ladder';
        
        if (actionType === 'snake') {
            icon = '🐍';
            sfxKey = 'sfx_snake_slide';
            synthType = 'snake';
        } else if (actionType === 'skull') {
            icon = '💀';
            sfxKey = 'sfx_skull_bomb';
            synthType = 'skull';
        }

        // Putar audio sfx aksi petak khusus
        this.sfxEngine.playEffectSound(sfxKey, synthType);

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.id = 'action-modal-window';

        modalOverlay.innerHTML = `
            <div class="glass-panel modal-box" style="border-color:${actionType === 'snake' || actionType === 'skull' ? 'var(--color-danger)' : 'var(--color-success)'}">
                <div class="modal-header">
                    <span class="modal-icon">${icon}</span>
                    <span class="modal-title" style="color:${actionType === 'snake' || actionType === 'skull' ? 'var(--color-danger)' : 'var(--color-success)'}">${title}</span>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button id="btn-modal-confirm" class="btn btn-primary btn-glow">SIAP, LANJUTKAN!</button>
                </div>
            </div>
        `;

        uiContainer.appendChild(modalOverlay);

        document.getElementById('btn-modal-confirm').addEventListener('click', () => {
            this.sfxEngine.playEffectSound('sfx_dice_charge', 'dice');
            modalOverlay.remove();
            
            if (onConfirmCallback) {
                onConfirmCallback();
            }
        });
    }

    /**
       Menampilkan layar kemenangan penuh DUTA IPB dengan podium wisuda emas.
       @param {String} winnerName Nama mahasiswa yang memenangkan wisuda.
       @param {Function} onRestartCallback Callback restart permainan kembali ke menu utama.
     */
    showWinnerScreen(winnerName, onRestartCallback) {
        this.stopTurnCountdownTimer();

        // Putar BGM Wisuda Winner jika tersedia
        this.sfxEngine.playBackgroundMusic('bgm_winner');

        const uiContainer = document.getElementById('app-ui-layer');
        if (!uiContainer) return;

        uiContainer.innerHTML = '';

        const winnerOverlay = document.createElement('div');
        winnerOverlay.className = 'modal-overlay';
        winnerOverlay.id = 'winner-screen-overlay';

        winnerOverlay.innerHTML = `
            <div class="glass-panel modal-box" style="max-width:550px; text-align:center; padding:50px 30px; border-color:var(--color-secondary);">
                <div style="font-size:5rem; animation:pulse-glow 2s infinite ease-in-out;">🎓</div>
                <h1 style="font-family:var(--font-heading); font-size:2rem; color:var(--color-secondary); margin-top:20px;">
                    CONGRATULATIONS!
                </h1>
                <h2 style="font-family:var(--font-heading); font-size:1.4rem; margin-top:5px; margin-bottom:20px;">
                    ${winnerName}
                </h2>
                <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.6; margin-bottom:30px;">
                    Telah berhasil lulus tepat waktu dan dinobatkan sebagai <strong>DUTA MAHASISWA BERPRESTASI IPB UNIVERSITY</strong> di Sidang Senat Terbuka Petak 100!
                </p>
                
                <button id="btn-restart-game" class="btn btn-primary btn-glow btn-wide">KEMBALI KE MENU UTAMA</button>
            </div>
        `;

        uiContainer.appendChild(winnerOverlay);

        document.getElementById('btn-restart-game').addEventListener('click', () => {
            this.sfxEngine.playEffectSound('sfx_dice_charge', 'dice');
            
            // Hentikan BGM Winner
            this.sound.stopAll();

            winnerOverlay.remove();
            
            if (onRestartCallback) {
                onRestartCallback();
            }
        });
    }

    /**
       Menampilkan layar tragis DROP OUT (DO) merah jika pemain melakukan pelanggaran hukum fatal berulang.
       @param {String} studentName Nama mahasiswa yang dikeluarkan.
       @param {Function} onConfirmCallback Callback melanjutkan sisa pemain yang masih aktif berjuang.
     */
    showGameOverDO(studentName, onConfirmCallback) {
        this.stopTurnCountdownTimer();

        // Mainkan SFX Drop Out fatal
        this.sfxEngine.playEffectSound('sfx_drop_out', 'skull');

        const uiContainer = document.getElementById('app-ui-layer');
        if (!uiContainer) return;

        const doOverlay = document.createElement('div');
        doOverlay.className = 'modal-overlay';
        doOverlay.id = 'do-screen-overlay';

        doOverlay.innerHTML = `
            <div class="glass-panel modal-box" style="border-color:var(--color-danger); text-align:center; padding:40px 30px;">
                <div style="font-size:4rem; color:var(--color-danger);">🔴</div>
                <h2 style="font-family:var(--font-heading); font-size:1.8rem; color:var(--color-danger); margin-top:15px; margin-bottom:5px;">
                    DROP OUT!
                </h2>
                <h3 style="font-family:var(--font-heading); font-size:1.2rem; color:#fff; margin-bottom:15px;">
                    ${studentName}
                </h3>
                <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.6; margin-bottom:25px;">
                    Berdasarkan Keputusan Sidang Komisi Disiplin IPB University, Anda terbukti melakukan pelanggaran berat tata tertib secara berulang dan resmi diberhentikan sebagai mahasiswa.
                </p>
                <button id="btn-do-continue" class="btn btn-primary btn-glow btn-wide" style="background:var(--color-danger);">LANJUTKAN SISA MAHASISWA</button>
            </div>
        `;

        uiContainer.appendChild(doOverlay);

        document.getElementById('btn-do-continue').addEventListener('click', () => {
            this.sfxEngine.playEffectSound('sfx_dice_charge', 'dice');
            doOverlay.remove();

            if (onConfirmCallback) {
                onConfirmCallback();
            }
        });
    }
}
