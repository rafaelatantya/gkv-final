/* ==========================================================================
   GAME DICE GAUGE COMPONENT (LGR STYLE FORCE CHARGE MECHANICS)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

export class DiceGauge {
    /**
       Konstruktor inisialisasi pengukur daya dadu.
       @param {Phaser.Scene} scene Adegan HUDScene/GameScene penampung kontrol.
       @param {Function} onRollCallback Aksi callback saat dadu berhasil dilempar.
     */
    constructor(scene, onRollCallback) {
        this.scene = scene;
        this.onRollCallback = onRollCallback;

        // Variabel Logika Pengisian Daya
        this.isCharging = false;
        this.chargeValue = 0; // Nilai persentase 0.0 s.d 100.0
        this.chargeDirection = 1; // 1 = Naik, -1 = Turun
        this.chargeSpeed = 3.5; // Kecepatan osilasi pengisian per frame

        // Element DOM Overlay HUD
        this.barFillElement = document.getElementById('dice-charge-fill');
        this.btnRollElement = document.getElementById('btn-roll-dice');

        // Pastikan elemen DOM ada sebelum mendaftarkan event listener
        this.initializeInputControls();
    }

    /**
       Mendaftarkan event listener untuk input hold & release tombol dadu.
     */
    initializeInputControls() {
        if (!this.btnRollElement) {
            console.warn("⚠️ Tombol 'btn-roll-dice' tidak ditemukan di DOM. Menggunakan fallback input keyboard.");
            return;
        }

        // 1. Event saat tombol mulai DITEKAN & DITAHAN (Hold Start)
        const startChargeHandler = (e) => {
            e.preventDefault();
            if (this.isCharging || this.btnRollElement.disabled) return;
            
            this.startDiceCharging();
        };

        this.btnRollElement.addEventListener('mousedown', startChargeHandler);
        this.btnRollElement.addEventListener('touchstart', startChargeHandler);

        // 2. Event saat tombol DILEPAS (Release Trigger)
        const stopChargeHandler = (e) => {
            e.preventDefault();
            if (!this.isCharging) return;

            this.triggerDiceRoll();
        };

        window.addEventListener('mouseup', stopChargeHandler);
        window.addEventListener('touchend', stopChargeHandler);
    }

    /**
       Memicu dimulainya pengisian energi dadu.
     */
    startDiceCharging() {
        this.isCharging = true;
        this.chargeValue = 0;
        this.chargeDirection = 1;
        
        // Perbarui visual tombol menjadi berdenyut
        this.btnRollElement.textContent = "TAHAN...";
        this.btnRollElement.classList.add('btn-glowing-active');

        // Mainkan SFX pengisian daya berulang/menanjak jika tersedia
        if (this.scene.sfxEngine) {
            this.scene.sfxEngine.playEffectSound('sfx_dice_charge', 'dice');
        }

        // Tampilkan info teks log HUD
        this.scene.addLogActivityMessage("Mengisi daya dadu...", "system");
    }

    /**
       Fungsi loop update internal untuk memperbarui persentase bar meteran bolak-balik.
       Dipanggil di dalam fungsi update() scene.
     */
    update() {
        if (!this.isCharging) return;

        // Lakukan pengisian bolak-balik (0 -> 100 -> 0 -> 100)
        this.chargeValue += this.chargeSpeed * this.chargeDirection;

        if (this.chargeValue >= 100) {
            this.chargeValue = 100;
            this.chargeDirection = -1; // Balik arah turun
        } else if (this.chargeValue <= 0) {
            this.chargeValue = 0;
            this.chargeDirection = 1; // Balik arah naik
        }

        // Sinkronisasi tinggi/lebar bar fill di DOM overlay
        const domBarFill = document.getElementById('dice-charge-fill');
        if (domBarFill) {
            domBarFill.style.width = `${this.chargeValue}%`;
            
            // Perubahan warna bar dinamis berdasarkan tingkat daya
            if (this.chargeValue > 80) {
                domBarFill.style.background = 'linear-gradient(90deg, #ff8800, #ff2e93)'; // Super Charge (Emas/Pink)
            } else if (this.chargeValue > 40) {
                domBarFill.style.background = 'linear-gradient(90deg, #1ed760, #00e5ff)'; // Medium Charge (Hijau/Cyan)
            } else {
                domBarFill.style.background = 'linear-gradient(90deg, #042c64, #00e5ff)'; // Low Charge (Biru/Cyan)
            }
        }
    }

    /**
       Menghentikan pengisian, menghitung hasil dadu berdasarkan persentase daya,
       dan menembakkan callback ke GameScene.
     */
    triggerDiceRoll() {
        this.isCharging = false;
        
        // Reset visual tombol
        this.btnRollElement.textContent = "LEMPAR DADU";
        this.btnRollElement.classList.remove('btn-glowing-active');

        const finalCharge = this.chargeValue;
        
        // Kalkulasi angka dadu secara cerdas berdasarkan daya LGR Style
        let rolledNumber = 1;

        if (finalCharge >= 81) {
            // Super Charge (81-100%): Peluang sangat tinggi angka besar (5 atau 6)
            const rand = Math.random();
            rolledNumber = rand < 0.45 ? 6 : (rand < 0.8 ? 5 : Math.floor(Math.random() * 4) + 1);
        } else if (finalCharge >= 41 && finalCharge <= 80) {
            // Medium Charge (41-80%): Peluang tinggi angka sedang (3 atau 4)
            const rand = Math.random();
            rolledNumber = rand < 0.45 ? 4 : (rand < 0.8 ? 3 : (rand < 0.9 ? 5 : 2));
        } else {
            // Low Charge (0-40%): Peluang tinggi angka kecil (1 atau 2)
            const rand = Math.random();
            rolledNumber = rand < 0.5 ? 2 : (rand < 0.85 ? 1 : Math.floor(Math.random() * 4) + 3);
        }

        // Pengaman angka dadu
        rolledNumber = Phaser.Math.Clamp(rolledNumber, 1, 6);

        console.log(`🎲 Dice Released! Daya: ${finalCharge.toFixed(1)}% -> Angka Dadu: ${rolledNumber}`);

        // Mainkan SFX pelemparan dadu asli
        if (this.scene.sfxEngine) {
            this.scene.sfxEngine.playEffectSound('sfx_dice_roll', 'dice');
        }

        // Tembakkan fungsi callback ke GameScene untuk memproses pergerakan bidak
        if (this.onRollCallback) {
            this.onRollCallback(rolledNumber, finalCharge);
        }
    }

    /**
       Menonaktifkan sementara tombol dadu saat bidak sedang bergerak
       demi menghindari double click/interferensi giliran.
       @param {Boolean} disabled Status penonaktifan.
     */
    setDisabled(disabled) {
        if (this.btnRollElement) {
            this.btnRollElement.disabled = disabled;
            if (disabled) {
                this.btnRollElement.classList.add('btn-disabled');
                this.btnRollElement.style.opacity = '0.4';
                this.btnRollElement.style.cursor = 'not-allowed';
            } else {
                this.btnRollElement.classList.remove('btn-disabled');
                this.btnRollElement.style.opacity = '1.0';
                this.btnRollElement.style.cursor = 'pointer';
            }
        }
    }
}
