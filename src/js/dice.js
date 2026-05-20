/* ==========================================================================
   DICE GAUGE CONTROL SYSTEM (LINE Let's Get Rich style)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

import { audioManager } from './audio.js';

class DiceController {
    constructor() {
        this.btnRoll = null;
        this.gaugeBar = null;
        this.dice1Element = null;
        this.dice2Element = null;
        
        this.chargePercent = 0;
        this.isCharging = false;
        this.chargeDirection = 1; // 1 = Naik, -1 = Turun
        this.animationFrameId = null;
        this.callbackOnRollComplete = null;
        
        // Emoji dadu unicode 1 s.d 6
        this.diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    }

    /**
     * Mengikat elemen UI dadu dan tombol kontrol
     * @param {Function} onRollComplete Callback setelah dadu selesai di-roll
     */
    init(onRollComplete) {
        this.btnRoll = document.getElementById('btn-roll-dice');
        this.gaugeBar = document.getElementById('dice-gauge-bar');
        this.dice1Element = document.getElementById('dice-1');
        this.dice2Element = document.getElementById('dice-2');
        this.callbackOnRollComplete = onRollComplete;

        if (!this.btnRoll) return;

        // Pasang Event Listeners (Mendukung Mouse & Touch Screen)
        this.btnRoll.addEventListener('mousedown', this.startCharging.bind(this));
        this.btnRoll.addEventListener('mouseup', this.stopCharging.bind(this));
        this.btnRoll.addEventListener('mouseleave', this.cancelCharging.bind(this));

        this.btnRoll.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startCharging();
        });
        this.btnRoll.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopCharging();
        });
    }

    /**
     * Memulai pengisian daya dadu (Tahan Tombol)
     */
    startCharging() {
        if (this.isCharging || this.btnRoll.disabled) return;

        this.isCharging = true;
        this.chargePercent = 0;
        this.chargeDirection = 1;
        this.updateGaugeUI();

        // Putar suara getaran daya dadu
        audioManager.playSFX('roll');

        // Loop animasi pengisian daya
        const chargeLoop = () => {
            if (!this.isCharging) return;

            // Kecepatan pengisian daya (bertambah/berkurang 2.5% per frame)
            this.chargePercent += 2.5 * this.chargeDirection;

            if (this.chargePercent >= 100) {
                this.chargePercent = 100;
                this.chargeDirection = -1; // Balik arah turun
            } else if (this.chargePercent <= 0) {
                this.chargePercent = 0;
                this.chargeDirection = 1; // Balik arah naik
            }

            this.updateGaugeUI();
            this.animationFrameId = requestAnimationFrame(chargeLoop);
        };

        this.animationFrameId = requestAnimationFrame(chargeLoop);
    }

    /**
     * Menghentikan pengisian daya (Lepas Tombol) dan melempar dadu
     */
    stopCharging() {
        if (!this.isCharging) return;

        this.isCharging = false;
        cancelAnimationFrame(this.animationFrameId);

        // Kunci nilai akhir dadu berdasarkan persentase
        const targetValue = this.calculateDiceTarget(this.chargePercent);
        
        // Matikan tombol sementara saat dadu menggelinding
        this.btnRoll.disabled = true;

        this.animateRoll(targetValue);
    }

    /**
     * Membatalkan pengisian daya secara paksa jika kursor keluar area tombol
     */
    cancelCharging() {
        if (this.isCharging) {
            this.stopCharging();
        }
    }

    /**
     * Memperbarui visual meteran bar di layar
     */
    updateGaugeUI() {
        if (this.gaugeBar) {
            this.gaugeBar.style.width = `${this.chargePercent}%`;
            
            // Efek warna dinamis berdasarkan daya
            if (this.chargePercent <= 25) {
                this.gaugeBar.style.background = 'linear-gradient(90deg, #00C6FF, #0072FF)';
            } else if (this.chargePercent <= 50) {
                this.gaugeBar.style.background = 'linear-gradient(90deg, #3a7bd5, #3a6073)';
            } else if (this.chargePercent <= 75) {
                this.gaugeBar.style.background = 'linear-gradient(90deg, #11998e, #38ef7d)';
            } else {
                this.gaugeBar.style.background = 'linear-gradient(90deg, #f12711, #f5af19)';
            }
        }
    }

    /**
     * Perhitungan Target Dadu Berdasarkan Charge Percent
     */
    calculateDiceTarget(percent) {
        let targetRange = [];
        
        if (percent <= 25) {
            targetRange = [2, 3]; // Level 1: Status Percobaan
        } else if (percent <= 50) {
            targetRange = [4, 5, 6]; // Level 2: Mahasiswa Reguler
        } else if (percent <= 75) {
            targetRange = [7, 8, 9]; // Level 3: Mahasiswa Teladan
        } else {
            targetRange = [10, 11, 12]; // Level 4: Duta Tata Tertib
        }

        // Ambil satu nilai target acak dari rentang
        const rnd = Math.floor(Math.random() * targetRange.length);
        return targetRange[rnd];
    }

    /**
     * Memicu pelemparan otomatis untuk Bot AI
     * Bot akan mengisi meteran secara acak dan melempar
     */
    triggerAISpeedRoll() {
        this.btnRoll.disabled = true;
        this.chargePercent = 0;
        
        // Simulasikan bot menahan tombol sejenak
        const randomTargetPercent = Math.floor(Math.random() * 100);
        let currentPct = 0;
        
        audioManager.playSFX('roll');

        const botCharge = () => {
            currentPct += 4;
            this.chargePercent = currentPct;
            this.updateGaugeUI();

            if (currentPct < randomTargetPercent) {
                setTimeout(botCharge, 20);
            } else {
                // Selesai charge, langsung lempar
                const targetValue = this.calculateDiceTarget(randomTargetPercent);
                this.animateRoll(targetValue);
            }
        };

        botCharge();
    }

    /**
     * Animasi visual dadu bergulir (3D-like emoji spin) selama 1 detik
     */
    animateRoll(finalValue) {
        let rollCounter = 0;
        
        // Animasi acak berputar cepat
        const interval = setInterval(() => {
            const tempD1 = Math.floor(Math.random() * 6) + 1;
            const tempD2 = Math.floor(Math.random() * 6) + 1;
            
            this.dice1Element.textContent = this.diceFaces[tempD1 - 1];
            this.dice2Element.textContent = this.diceFaces[tempD2 - 1];
            document.getElementById('dice-result-text').textContent = `Total: ${tempD1 + tempD2}`;
            
            rollCounter++;
            if (rollCounter > 12) {
                clearInterval(interval);
                
                // Kunci ke angka dadu final yang memenuhi target total
                const { d1, d2 } = this.splitTargetValue(finalValue);
                
                this.dice1Element.textContent = this.diceFaces[d1 - 1];
                this.dice2Element.textContent = this.diceFaces[d2 - 1];
                document.getElementById('dice-result-text').textContent = `Total: ${finalValue}`;
                
                // Mainkan SFX dadu jatuh selesai
                audioManager.playSFX('click');

                // Selesai rolling, panggil callback setelah jeda kecil
                setTimeout(() => {
                    this.chargePercent = 0;
                    this.updateGaugeUI();
                    
                    if (this.callbackOnRollComplete) {
                        this.callbackOnRollComplete(finalValue);
                    }
                }, 400);
            }
        }, 80);
    }

    /**
     * Membagi nilai target 2-12 menjadi dua dadu 1-6 secara valid
     */
    splitTargetValue(total) {
        const minD1 = Math.max(1, total - 6);
        const maxD1 = Math.min(6, total - 1);
        
        const d1 = Math.floor(Math.random() * (maxD1 - minD1 + 1)) + minD1;
        const d2 = total - d1;

        return { d1, d2 };
    }

    /**
     * Mengaktifkan kembali kontrol tombol dadu
     */
    enableControls() {
        if (this.btnRoll) {
            this.btnRoll.disabled = false;
        }
    }

    /**
     * Menonaktifkan kontrol tombol dadu
     */
    disableControls() {
        if (this.btnRoll) {
            this.btnRoll.disabled = true;
        }
    }
}

export const diceController = new DiceController();
export { DiceController };
