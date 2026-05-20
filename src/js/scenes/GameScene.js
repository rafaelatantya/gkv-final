/* ==========================================================================
   PHASER SCENE: GAME SCENE (CORE BOARD GAME ENGINE)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

import { BoardBuilder } from '../components/BoardBuilder.js';
import { PlayerToken } from '../components/PlayerToken.js';
import { SFXEngine } from '../components/SFXEngine.js';
import { contentData } from '../contentData.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    /**
       Fungsi penerima transfer data konfigurasi pemain dari adegan setup.
       @param {Object} data Objek data berisi array pemain.
     */
    init(data) {
        this.rawPlayersData = data.players || [];
        this.playersMap = {}; // Asosiasi ID -> Instansi PlayerToken
        this.turnQueue = []; // Antrean giliran ID pemain aktif
        this.currentQueueIndex = 0; // Indeks antrean aktif saat ini

        // Bank data soal kuis Pilihan Ganda dari contentData
        this.quizQuestionsBank = [
            {
                question: "Menurut Peraturan Akademik IPB, apakah mahasiswa diperbolehkan memakai kaos oblong tidak berkerah dan sandal jepit saat UTS/UAS?",
                options: [
                    { key: "A", text: "Ya, diperbolehkan asal sopan." },
                    { key: "B", text: "Tidak diperbolehkan, wajib mengenakan pakaian berkerah, rapi, dan sepatu tertutup." }
                ],
                correctKey: "B",
                rewardSteps: 2,
                penaltySteps: -2,
                successMsg: "Hebat! Pemahaman tata tertib pakaian ujian Anda luar biasa! (Maju 2 petak)",
                failMsg: "Sanksi! Pengawas ujian meminta Anda keluar ruangan. Anda harus mengganti pakaian! (Mundur 2 petak)"
            },
            {
                question: "Berapa batas waktu maksimal masa studi reguler untuk program Sarjana (S1) di IPB University sebelum dinyatakan Drop Out?",
                options: [
                    { key: "A", text: "10 Semester (5 Tahun)" },
                    { key: "B", text: "14 Semester (7 Tahun)" }
                ],
                correctKey: "B",
                rewardSteps: 1,
                penaltySteps: -1,
                successMsg: "Benar! Batas waktu maksimal studi S1 adalah 14 semester. (Maju 1 petak)",
                failMsg: "Salah! Anda terancam DO karena tidak memperhatikan batas masa studi. (Mundur 1 petak)"
            },
            {
                question: "Apa nama resmi dari masa persiapan bagi mahasiswa baru pada tahun pertama di IPB University saat ini?",
                options: [
                    { key: "A", text: "Program Pendidikan Kompetensi Umum (PPKU)" },
                    { key: "B", text: "Tingkat Persiapan Bersama (TPB)" }
                ],
                correctKey: "A",
                rewardSteps: 1,
                penaltySteps: -1,
                successMsg: "Tepat sekali! PPKU merupakan gerbang awal mahasiswa baru IPB. (Maju 1 petak)",
                failMsg: "Salah! TPB adalah nama lama, sekarang bernama PPKU. (Mundur 1 petak)"
            },
            {
                question: "Di area manakah mahasiswa dilarang keras mengendarai sepeda motor dengan kecepatan tinggi di Dramaga?",
                options: [
                    { key: "A", text: "Di seluruh area kampus, batas kecepatan maksimal adalah 30 km/jam demi keselamatan." },
                    { key: "B", text: "Hanya di depan gedung rektorat (Andi Hakim Nasoetion)." }
                ],
                correctKey: "A",
                rewardSteps: 2,
                penaltySteps: -2,
                successMsg: "Bagus! Anda berkendara dengan aman dan menghargai pejalan kaki. (Maju 2 petak)",
                failMsg: "Bahaya! Anda ditilang oleh UKK karena mengebut! (Mundur 2 petak)"
            },
            {
                question: "Apa tindakan yang dikategorikan sebagai plagiarisme saat menyusun Laporan Praktikum atau Skripsi di IPB?",
                options: [
                    { key: "A", text: "Mengutip tulisan orang dengan mencantumkan rujukan secara jelas." },
                    { key: "B", text: "Menyalin mentah-mentah hasil karya orang lain tanpa mencantumkan referensi." }
                ],
                correctKey: "B",
                rewardSteps: 3,
                penaltySteps: -3,
                successMsg: "Luar biasa! Kejujuran akademik adalah prinsip utama mahasiswa IPB. (Maju 3 petak)",
                failMsg: "Plagiarisme! Laporan praktikum Anda diberi nilai E oleh dosen pengampu! (Mundur 3 petak)"
            },
            {
                question: "Manakah dari perilaku berikut yang DILARANG KERAS saat Anda berada di dalam ruang baca Perpustakaan LSI?",
                options: [
                    { key: "A", text: "Membawa makanan berat, minuman bergelas tanpa tutup, dan membuat kegaduhan." },
                    { key: "B", text: "Membaca e-book di laptop menggunakan koneksi Wi-Fi IPB secara tenang." }
                ],
                correctKey: "A",
                rewardSteps: 1,
                penaltySteps: -1,
                successMsg: "Tepat! Menjaga ketenangan perpustakaan membantu kenyamanan belajar bersama. (Maju 1 petak)",
                failMsg: "Ditegur! Petugas perpustakaan menyita makanan Anda karena mengotori area buku. (Mundur 1 petak)"
            }
        ];
    }

    /**
       Fungsi utama merakit visualisasi game arena.
     */
    create() {
        console.log("🎮 GameScene Active: Menginisialisasi Arena Utama...");

        // Putar musik latar belakang dinamis Semester 1
        this.sfxEngine = new SFXEngine(this);
        this.sfxEngine.playBackgroundMusic('bgm_level_2');

        // 1. Instansiasi pembentuk papan grid koordinat zig-zag 10x10
        this.boardBuilder = new BoardBuilder(this);

        // 2. Gambar dasar grid visual
        this.boardBuilder.drawBoardGrid();

        // 3. Gambar visual neon ular & tangga bercahaya
        this.boardBuilder.drawSnakesRutes();
        this.boardBuilder.drawLaddersRutes();

        // 4. Instansiasi objek Sprite bidak pemain
        this.initializePlayerTokens();

        // 5. Jalankan lapisan HUDScene secara paralel di atas GameScene
        this.scene.launch('HUDScene', { players: this.rawPlayersData });
        
        // Ambil reference ke HUDScene setelah diluncurkan
        this.time.delayedCall(100, () => {
            this.hudScene = this.scene.get('HUDScene');
            
            // Daftarkan log berita aktivitas maba pertama
            this.addLogActivityMessage("Selamat berjuang di Kampus Dramaga, rekan-rekan Mahasiswa!", "system");

            // Mulai putaran giliran pertama secara asinkron
            this.startNextPlayerTurnLoop();
        });
    }

    /**
       Membuat kelas pembungkus token bidak untuk masing-masing profil pemain.
     */
    initializePlayerTokens() {
        this.rawPlayersData.forEach(pData => {
            const tokenInstance = new PlayerToken(this, pData, this.boardBuilder);
            
            this.playersMap[pData.id] = tokenInstance;
            this.turnQueue.push(pData.id);
        });

        console.log("♟️ Seluruh Bidak Berhasil Ditempatkan: ", this.playersMap);
    }

    /**
       Menjalankan putaran giliran berikutnya (Turn Loop Manager).
     */
    startNextPlayerTurnLoop() {
        // Pengecekan kondisi antrean giliran kosong (Seluruh mahasiswa Drop Out!)
        if (this.turnQueue.length === 0) {
            this.addLogActivityMessage("Kritis! Tidak ada mahasiswa tersisa di kampus. Permainan berakhir!", "sanction");
            return;
        }

        // Dapatkan ID pemain aktif saat ini
        const activePlayerId = this.turnQueue[this.currentQueueIndex];
        const activePlayerToken = this.playersMap[activePlayerId];

        console.log(`➡️ Giliran Pemain: ${activePlayerToken.name} (ID: ${activePlayerId})`);

        // Evaluasi status hukuman Skorsing (Skip giliran)
        if (activePlayerToken.isSuspended) {
            activePlayerToken.isSuspended = false; // Bebaskan hukuman skorsing untuk giliran berikutnya
            
            this.addLogActivityMessage(`Skorsing! Giliran ${activePlayerToken.name} dilewati karena sedang dalam sanksi UKK.`, "sanction");
            
            if (this.hudScene) {
                this.hudScene.showTileActionModal(
                    "SANSKI SKORSING",
                    `Mahasiswa ${activePlayerToken.name} sedang menjalani skorsing akademis giliran ini. Patuhi peraturan!`,
                    "skull",
                    () => {
                        this.advanceQueueIndexPointer();
                        this.startNextPlayerTurnLoop();
                    }
                );
            }
            return;
        }

        // Perbarui HUD giliran aktif di sidebar
        if (this.hudScene) {
            this.hudScene.updatePlayersStatusList(this.getPlayersCurrentStateList());
            this.hudScene.highlightActivePlayerTurn(activePlayerToken);
        }

        // Jalankan Panning & Zoom-in kamera secara halus ke posisi bidak aktif saat giliran dimulai
        this.focusCameraOnTargetSprite(activePlayerToken.sprite, 1.2, 800);

        // Pengecekan AI Bot: Jika pemain aktif adalah bot, picu bot melempar dadu otomatis
        if (activePlayerToken.isBot) {
            this.addLogActivityMessage(`Dosen Wali: ${activePlayerToken.name} (BOT) sedang menganalisis langkah...`, "system");
            
            this.time.delayedCall(2000, () => {
                this.triggerAiBotDiceRoll(activePlayerToken);
            });
        }
    }

    /**
       Mekanisme AI Bot: Mengisi charge daya dadu bolak-balik acak, lalu melempar dadu.
     */
    triggerAiBotDiceRoll(botToken) {
        if (this.hudScene && this.hudScene.diceGauge) {
            const gauge = this.hudScene.diceGauge;
            
            // Simulasikan power charge hold
            gauge.startDiceCharging();

            // Set delay acak penahanan power charge dadu (0.4s s.d 1.1s)
            const chargeHoldDuration = Phaser.Math.Between(400, 1100);
            
            this.time.delayedCall(chargeHoldDuration, () => {
                gauge.triggerDiceRoll();
            });
        }
    }

    /**
       Menangani hasil lemparan dadu dari DiceGauge/HUDScene dan melompatkan bidak.
       @param {Number} rolledNumber Angka dadu yang terpilih (1-6).
     */
    handleDiceRollResult(rolledNumber) {
        // Hentikan timer putaran giliran di HUD
        if (this.hudScene) {
            this.hudScene.stopTurnCountdownTimer();
        }

        const activePlayerId = this.turnQueue[this.currentQueueIndex];
        const activePlayerToken = this.playersMap[activePlayerId];

        this.addLogActivityMessage(`${activePlayerToken.name} melempar dadu: dapet angka [${rolledNumber}]!`, "move");

        // Mulai pergerakan bidak langkah-demi-langkah asinkron
        activePlayerToken.moveStepByStep(rolledNumber, () => {
            // Evaluasi aksi petak setelah mendarat
            this.evaluateLandedTileRulesAction(activePlayerToken);
        });
    }

    /**
       Menangani kejadian di mana pemain kehabisan waktu melempar dadu (timeout 10 detik).
     */
    handlePlayerTurnTimeout() {
        // Paksa lempar dadu dengan angka acak/aman
        const activePlayerId = this.turnQueue[this.currentQueueIndex];
        const activePlayerToken = this.playersMap[activePlayerId];

        this.addLogActivityMessage(`Timeout! Sistem melempar dadu otomatis untuk ${activePlayerToken.name}.`, "system");
        
        const safeDiceRoll = Phaser.Math.Between(1, 6);
        
        if (this.hudScene) {
            this.hudScene.updateDiceVisualIconResult(safeDiceRoll, 0.0);
            this.hudScene.diceGauge.setDisabled(true);
        }

        activePlayerToken.moveStepByStep(safeDiceRoll, () => {
            this.evaluateLandedTileRulesAction(activePlayerToken);
        });
    }

    /**
       Mengevaluasi secara logis konsekuensi/aksi dari petak tempat mendarat bidak.
       @param {PlayerToken} player Bidak pemain aktif.
     */
    evaluateLandedTileRulesAction(player) {
        const tile = player.currentPosition;

        // 1. KONDISI MENANG: Petak 100 (Sidang Senat Terbuka Wisuda)
        if (tile === 100) {
            this.addLogActivityMessage(`WISUDA! ${player.name} berhasil memenangkan permainan!`, "event");
            this.triggerWinnerCelebrationPartikels();
            
            if (this.hudScene) {
                this.hudScene.showWinnerScreen(player.name, () => {
                    this.scene.stop('HUDScene');
                    this.scene.start('MenuScene');
                });
            }
            return;
        }

        // 2. PETAK KHUSUS TENGKORAK DO (💀)
        if (contentData.skulls[tile]) {
            const skullText = contentData.skulls[tile];
            player.skullCount++;

            this.addLogActivityMessage(`Hukum! ${player.name} melanggar tata tertib berat di petak ${tile}. Sanksi skorsing aktif!`, "sanction");

            if (this.hudScene) {
                this.hudScene.showTileActionModal(
                    "SANSKI BERAT AKADEMIS",
                    skullText + `<br/><br/><strong>Penalti:</strong> Turun 4 baris, disuspensi (skip 1 giliran), dan mendapat akumulasi sanksi DO: <strong>${player.skullCount}/3</strong>.`,
                    "skull",
                    () => {
                        // Cek kondisi Drop Out kritis
                        if (player.skullCount >= 3) {
                            this.executePlayerDropOutProcess(player);
                        } else {
                            // Jatuhkan sanksi skorsing (skip giliran) dan mundurkan bidak 4 baris (40 petak)
                            player.isSuspended = true;
                            const targetTile = Phaser.Math.Clamp(player.currentPosition - 40, 1, 100);
                            
                            player.slideDirectlyToTile(targetTile, 'snake', () => {
                                this.concludeActivePlayerTurn();
                            });
                        }
                    }
                );
            }
            return;
        }

        // 3. PETAK KHUSUS ULAR (🐍)
        if (contentData.snakes[tile]) {
            const snakeText = contentData.snakes[tile];
            
            // Kalkulasi petak ekor ular
            let tailTile = tile - 10; // Ringan
            if (tile === 34 || tile === 54 || tile === 73) tailTile = tile - 20; // Sedang
            if (tile === 84 || tile === 98) tailTile = tile - 40; // Berat
            
            tailTile = Phaser.Math.Clamp(tailTile, 1, 100);

            this.addLogActivityMessage(`Melanggar! ${player.name} mendarat di petak ular ${tile} dan ditegur oleh UKK Dramaga.`, "sanction");

            if (this.hudScene) {
                this.hudScene.showTileActionModal(
                    "KASUS PELANGGARAN TATA TERTIB",
                    snakeText,
                    "snake",
                    () => {
                        player.slideDirectlyToTile(tailTile, 'snake', () => {
                            this.concludeActivePlayerTurn();
                        });
                    }
                );
            }
            return;
        }

        // 4. PETAK KHUSUS TANGGA (🪜)
        if (contentData.ladders[tile]) {
            const ladderText = contentData.ladders[tile];
            
            // Kalkulasi petak puncak tangga
            let topTile = tile + 10;
            if (tile === 15 || tile === 28 || tile === 38) topTile = tile + 20;
            if (tile === 50 || tile === 65) topTile = tile + 30;

            topTile = Phaser.Math.Clamp(topTile, 1, 100);

            this.addLogActivityMessage(`Prestasi! ${player.name} naik tangga dari petak ${tile} berkat inovasi PKM/Juara Karya Tulis!`, "event");

            if (this.hudScene) {
                this.hudScene.showTileActionModal(
                    "PRESTASI MAHASISWA CEMERLANG",
                    ladderText,
                    "ladder",
                    () => {
                        player.slideDirectlyToTile(topTile, 'ladder', () => {
                            this.concludeActivePlayerTurn();
                        });
                    }
                );
            }
            return;
        }

        // 5. PETAK KHUSUS KUIS PILIHAN GANDA (❓)
        const isQuizTile = tile % 8 === 0 && tile !== 100;
        
        if (isQuizTile) {
            this.addLogActivityMessage(`Ujian! ${player.name} dihadapkan pada Kuis Ujian Tata Tertib Akademik IPB.`, "system");

            // Ambil soal kuis acak dari bank kuis
            const randomQuestion = Phaser.Utils.Array.GetRandom(this.quizQuestionsBank);

            if (this.hudScene) {
                this.hudScene.showQuizModal(randomQuestion, (isCorrectAnswer) => {
                    if (isCorrectAnswer) {
                        this.addLogActivityMessage(`Hebat! ${player.name} menjawab kuis dengan BENAR.`, "event");
                        
                        this.hudScene.showTileActionModal(
                            "JAWABAN BENAR",
                            randomQuestion.successMsg,
                            "ladder",
                            () => {
                                player.moveStepByStep(randomQuestion.rewardSteps, () => {
                                    this.evaluateLandedTileRulesAction(player);
                                });
                            }
                        );
                    } else {
                        this.addLogActivityMessage(`Aduh! ${player.name} menjawab kuis dengan SALAH.`, "sanction");
                        
                        this.hudScene.showTileActionModal(
                            "JAWABAN SALAH",
                            randomQuestion.failMsg,
                            "snake",
                            () => {
                                player.moveStepByStep(randomQuestion.penaltySteps, () => {
                                    this.evaluateLandedTileRulesAction(player);
                                });
                            }
                        );
                    }
                });
            }
            return;
        }

        // 6. PETAK BIASA (BONUS HARIAN PERILAKU POSITIF)
        // Diberikan peluang 30% untuk memicu visual apresiasi perilaku harian
        if (Math.random() < 0.35 && tile > 1 && tile < 100) {
            let levelKey = 1;
            if (tile > 75) levelKey = 4;
            else if (tile > 50) levelKey = 3;
            else if (tile > 25) levelKey = 2;

            const regularTileMessagesList = contentData.normalTiles[levelKey];
            const randomMessageText = Phaser.Utils.Array.GetRandom(regularTileMessagesList);

            // Berikan bonus langkah dadu berdasarkan level akademik
            const bonusStepsReward = levelKey; // Lvl 1 PPKU: +1, Lvl 2 Dept: +2, Lvl 3 Expert: +3, Lvl 4 Skripsi: +4

            this.addLogActivityMessage(`Motivasi! ${player.name} diapresiasi atas perilaku positif kecil di kampus.`, "event");

            if (this.hudScene) {
                this.hudScene.showTileActionModal(
                    "PERILAKU POSITIF MAHASISWA",
                    randomMessageText + `<br/><br/><strong>Bonus Reward:</strong> Maju +${bonusStepsReward} langkah dadu!`,
                    "ladder",
                    () => {
                        player.moveStepByStep(bonusStepsReward, () => {
                            this.evaluateLandedTileRulesAction(player);
                        });
                    }
                );
            }
            return;
        }

        // Mendarat di petak biasa tanpa trigger khusus: Segera selesaikan giliran
        this.concludeActivePlayerTurn();
    }

    /**
       Mengeksekusi proses Drop Out maba jika melanggar sanksi DO sebanyak 3 kali.
     */
    executePlayerDropOutProcess(player) {
        this.addLogActivityMessage(`BREAKING NEWS: Mahasiswa ${player.name} DIBERHENTIKAN secara resmi (DO) dari IPB University!`, "sanction");

        // Ledakan partikel merah bomb tengkorak di bidak
        this.triggerEvolutionFireworks(player.sprite.x, player.sprite.y, 0xff3333);

        // Hancurkan visual Sprite bidak di canvas
        player.destroyToken();

        // Buang pemain dari antrean giliran aktif
        this.turnQueue.splice(this.currentQueueIndex, 1);

        // Sesuaikan kembali indeks penunjuk giliran setelah antrean dikurangi
        if (this.currentQueueIndex >= this.turnQueue.length) {
            this.currentQueueIndex = 0;
        }

        if (this.hudScene) {
            this.hudScene.showGameOverDO(player.name, () => {
                // Cek apakah ada mahasiswa tersisa untuk melanjutkan perjuangan
                if (this.turnQueue.length === 0) {
                    this.addLogActivityMessage("Seluruh mahasiswa telah gugur (DO). Permainan Berakhir tragis!", "sanction");
                    
                    this.time.delayedCall(1200, () => {
                        this.scene.stop('HUDScene');
                        this.scene.start('MenuScene');
                    });
                } else {
                    // Mulai giliran sisa mahasiswa
                    this.startNextPlayerTurnLoop();
                }
            });
        }
    }

    /**
       Menyelesaikan seluruh urutan giliran aktif pemain, merapikan offset tumpukan,
       serta memindahkan giliran ke antrean berikutnya.
     */
    concludeActivePlayerTurn() {
        // Rapikan tumpukan bidak jika ada pemain di petak yang sama
        this.recalculateOverlapPlayersStackingOffsets();

        // Kembalikan kamera ke mode normal (zoom-out melihat seluruh papan)
        this.focusCameraOnWholeBoardGrid(1000);

        // Beri delay jeda antar-giliran 1.2 detik agar transisi terasa halus
        this.time.delayedCall(1200, () => {
            this.advanceQueueIndexPointer();
            this.startNextPlayerTurnLoop();
        });
    }

    /**
       Memajukan penunjuk indeks giliran antrean ke pemain berikutnya.
     */
    advanceQueueIndexPointer() {
        if (this.turnQueue.length === 0) return;
        
        this.currentQueueIndex++;
        if (this.currentQueueIndex >= this.turnQueue.length) {
            this.currentQueueIndex = 0;
        }
    }

    /**
       Penyelarasan visual: Merapikan offset koordinat bidak agar tidak bertumpuk
       jika mendarat di petak nomor yang sama secara bersamaan.
     */
    recalculateOverlapPlayersStackingOffsets() {
        // Kelompokkan pemain berdasarkan nomor petak
        const tilesGroups = {};
        
        this.turnQueue.forEach(pId => {
            const playerToken = this.playersMap[pId];
            const pos = playerToken.currentPosition;
            
            if (!tilesGroups[pos]) tilesGroups[pos] = [];
            tilesGroups[pos].push(playerToken);
        });

        // Terapkan offset hanya pada petak yang dihuni lebih dari 1 bidak
        Object.keys(tilesGroups).forEach(tileStr => {
            const tokensList = tilesGroups[tileStr];
            
            if (tokensList.length === 1) {
                // Hanya 1 bidak: Kembalikan persis ke tengah tanpa offset
                const token = tokensList[0];
                const center = this.boardBuilder.getTileCenterCoordinates(token.currentPosition);
                
                this.tweens.add({
                    targets: [token.sprite, token.shadow],
                    props: {
                        x: { value: center.x, duration: 250 },
                        y: { value: (target) => target === token.sprite ? center.y : center.y + 16, duration: 250 }
                    }
                });
            } else {
                // Lebih dari 1 bidak: Sebarkan melingkar kecil di sudut-sudut petak
                tokensList.forEach((token, index) => {
                    const center = this.boardBuilder.getTileCenterCoordinates(token.currentPosition);
                    const spreadOffset = token.offsetCoordinates; // Gunakan offset terstruktur bawaan

                    this.tweens.add({
                        targets: [token.sprite, token.shadow],
                        props: {
                            x: { value: center.x + spreadOffset.x, duration: 250 },
                            y: { value: (target) => target === token.sprite ? center.y + spreadOffset.y : center.y + spreadOffset.y + 16, duration: 250 }
                        }
                    });
                });
            }
        });
    }

    /**
       Kamera Dinamis: Melakukan Panning & Zoom-in ke target sprite.
     */
    focusCameraOnTargetSprite(targetSprite, zoomLevel, duration) {
        this.cameras.main.pan(targetSprite.x, targetSprite.y, duration, 'Cubic.Out');
        this.cameras.main.zoomTo(zoomLevel, duration, 'Cubic.Out');
    }

    /**
       Kamera Dinamis: Melakukan Panning & Zoom-out untuk memperlihatkan seluruh area papan.
     */
    focusCameraOnWholeBoardGrid(duration) {
        const boardCenterX = this.boardBuilder.boardOriginX + (this.boardBuilder.boardWidth / 2);
        const boardCenterY = this.boardBuilder.boardOriginY + (this.boardBuilder.boardHeight / 2);

        this.cameras.main.pan(boardCenterX, boardCenterY, duration, 'Cubic.Out');
        this.cameras.main.zoomTo(1.0, duration, 'Cubic.Out');
    }

    /**
       Menulis pesan ke HUD activity log box di sidebar.
     */
    addLogActivityMessage(message, type = 'system') {
        if (this.hudScene) {
            this.hudScene.addLogActivityMessage(message, type);
        }
    }

    /**
       Mengonversi status instansi pemain map saat ini ke array objek statis demi sinkronisasi HUD.
     */
    getPlayersCurrentStateList() {
        const list = [];
        this.rawPlayersData.forEach(pData => {
            const inst = this.playersMap[pData.id];
            list.push({
                id: pData.id,
                name: inst.name,
                isBot: inst.isBot,
                currentPosition: inst.currentPosition,
                evolutionLevel: inst.evolutionLevel,
                isSuspended: inst.isSuspended,
                skullCount: inst.skullCount
            });
        });
        return list;
    }

    /**
       Membuat emitter partikel bintang bersinar sepanjang luncuran ular/tangga.
       @param {Phaser.GameObjects.Sprite} targetSprite Bidak yang sedang meluncur.
       @param {Number} tintColor Warna partikel dalam format hex.
     */
    createVisualTrailParticles(targetSprite, tintColor) {
        return this.add.particles(0, 0, 'particle_dot', {
            speed: { min: 20, max: 40 },
            scale: { start: 0.35, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 600,
            frequency: 45,
            blendMode: 'ADD',
            tint: tintColor,
            follow: targetSprite
        });
    }

    /**
       Trigger ledakan kembang api partikel kecil neon saat berevolusi.
     */
    triggerEvolutionFireworks(x, y, tintColor = 0x00e5ff) {
        const fireworks = this.add.particles(x, y, 'particle_dot', {
            speed: { min: 50, max: 120 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1.0, end: 0 },
            lifespan: 800,
            gravityY: 100,
            quantity: 35,
            blendMode: 'ADD',
            tint: tintColor,
            emitting: false
        });

        fireworks.explode();
        this.time.delayedCall(1000, () => fireworks.destroy());
    }

    /**
       Kembang Api Kemenangan Petak 100 melimpah ruah!
     */
    triggerWinnerCelebrationPartikels() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const colors = [0xff2e93, 0x00e5ff, 0x1ed760, 0xff8800, 0ffd700];

        // Tembakkan kembang api berulang-ulang di koordinat acak atas papan
        this.time.addEvent({
            delay: 450,
            repeat: 14,
            callback: () => {
                const rx = Phaser.Math.Between(this.boardBuilder.boardOriginX, this.boardBuilder.boardOriginX + 640);
                const ry = Phaser.Math.Between(100, 400);
                const rColor = Phaser.Utils.Array.GetRandom(colors);
                
                this.triggerEvolutionFireworks(rx, ry, rColor);
                
                if (this.sfxEngine) {
                    this.sfxEngine.playEffectSound('sfx_dice_roll', 'dice');
                }
            }
        });
    }
}
