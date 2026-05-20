/* ==========================================================================
   AUDIO MANAGER WITH SYNTHESIZED FALLBACKS
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

class AudioManager {
    constructor() {
        this.bgmEnabled = true;
        this.sfxEnabled = true;
        this.currentBGMKey = null;
        
        // Simpan referensi objek Audio
        this.bgmAudios = {};
        this.sfxAudios = {};
        
        // Inisialisasi Audio Context untuk Synthesizer Fallback jika aset audio kosong
        this.ctx = null;
        this.initAudioContext();
        this.setupAudioListeners();
    }

    /**
     * Inisialisasi AudioContext browser secara aman
     */
    initAudioContext() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.ctx = new AudioContextClass();
            }
        } catch (e) {
            console.warn("Web Audio API tidak didukung pada browser ini.");
        }
    }

    /**
     * Listener kontrol UI audio
     */
    setupAudioListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const btnBgm = document.getElementById('btn-toggle-bgm');
            const btnSfx = document.getElementById('btn-toggle-sfx');

            if (btnBgm) {
                btnBgm.addEventListener('click', () => {
                    this.bgmEnabled = !this.bgmEnabled;
                    btnBgm.textContent = this.bgmEnabled ? '🎵' : '🔇';
                    btnBgm.style.opacity = this.bgmEnabled ? '1' : '0.5';
                    this.updateBGMState();
                });
            }

            if (btnSfx) {
                btnSfx.addEventListener('click', () => {
                    this.sfxEnabled = !this.sfxEnabled;
                    btnSfx.textContent = this.sfxEnabled ? '🔊' : '🔇';
                    btnSfx.style.opacity = this.sfxEnabled ? '1' : '0.5';
                });
            }
        });
    }

    /**
     * Mulai memutar musik pertama kali
     */
    initBGM() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (this.currentBGMKey) {
            this.playBGM(this.currentBGMKey);
        } else {
            this.playBGM('menu');
        }
    }

    /**
     * Memutar Background Music (BGM) berdasarkan key level/fase
     */
    playBGM(bgmKey) {
        if (this.currentBGMKey === bgmKey && this.bgmAudios[bgmKey] && !this.bgmAudios[bgmKey].paused) {
            return; // Sedang diputar, jangan diputar ulang
        }

        // Hentikan BGM sebelumnya
        this.stopAllBGM();
        this.currentBGMKey = bgmKey;

        if (!this.bgmEnabled) return;

        // Path audio file BGM
        const paths = {
            menu: 'assets/audio/bgm_menu.mp3',
            prologue: 'assets/audio/bgm_prologue.mp3',
            level1: 'assets/audio/bgm_level1.mp3', // PPKU (0-25)
            level2: 'assets/audio/bgm_level2.mp3', // Kuliah (26-75)
            level3: 'assets/audio/bgm_level3.mp3', // Kelulusan (76-99)
            winner: 'assets/audio/bgm_winner.mp3'  // Mars IPB (100)
        };

        const src = paths[bgmKey];
        if (!src) return;

        // Bikin element Audio jika belum ada
        if (!this.bgmAudios[bgmKey]) {
            this.bgmAudios[bgmKey] = new Audio(src);
            this.bgmAudios[bgmKey].loop = true;
            this.bgmAudios[bgmKey].volume = 0.35;
            
            // Tambahkan handling error agar jika file tidak ada, program tidak crash
            this.bgmAudios[bgmKey].addEventListener('error', () => {
                console.warn(`Gagal memuat file BGM: ${src}. Beralih ke Silent Mode.`);
            });
        }

        // Putar file jika didukung, abaikan error file tidak ditemukan secara mulus
        this.bgmAudios[bgmKey].play().catch(() => {
            console.log(`Pemuatan file BGM '${bgmKey}' gagal. Memutar instrumen cadangan.`);
        });
    }

    /**
     * Memperbarui status BGM (aktif/nonaktif)
     */
    updateBGMState() {
        if (this.bgmEnabled) {
            if (this.currentBGMKey) {
                const key = this.currentBGMKey;
                this.currentBGMKey = null; // Reset key untuk memicu pemutaran kembali
                this.playBGM(key);
            }
        } else {
            this.stopAllBGM();
        }
    }

    /**
     * Menghentikan seluruh trek BGM
     */
    stopAllBGM() {
        Object.keys(this.bgmAudios).forEach(key => {
            this.bgmAudios[key].pause();
            this.bgmAudios[key].currentTime = 0;
        });
    }

    /**
     * Memutar Sound Effect (SFX) dengan Synthesizer sebagai Fallback Utama
     */
    playSFX(sfxName) {
        if (!this.sfxEnabled) return;

        // Path berkas audio fisik
        const paths = {
            click: 'assets/audio/sfx_click.mp3',
            roll: 'assets/audio/sfx_roll.mp3',
            ladder: 'assets/audio/sfx_ladder.mp3',
            snake: 'assets/audio/sfx_snake.mp3',
            bomb: 'assets/audio/sfx_bomb.mp3',
            correct: 'assets/audio/sfx_correct.mp3',
            wrong: 'assets/audio/sfx_wrong.mp3',
            evolve: 'assets/audio/sfx_evolve.mp3',
            dropout: 'assets/audio/sfx_dropout.mp3'
        };

        const src = paths[sfxName];
        if (!src) return;

        // Jalankan file audio fisik jika ada
        if (!this.sfxAudios[sfxName]) {
            this.sfxAudios[sfxName] = new Audio(src);
            this.sfxAudios[sfxName].volume = 0.65;
            this.sfxAudios[sfxName].addEventListener('error', () => {
                // Jika error, gunakan Web Audio API Synth sebagai penyelamat
                this.playSynthesizedSFX(sfxName);
            });
        }

        this.sfxAudios[sfxName].play().catch(() => {
            // Jika ditolak browser atau file tidak ditemukan, gunakan synth
            this.playSynthesizedSFX(sfxName);
        });
    }

    /**
     * 🎹 Web Audio API Synthesizer (Retro 8-Bit Generator)
     * Menjamin efek suara game tetap berbunyi mewah walau tanpa file aset eksternal!
     */
    playSynthesizedSFX(type) {
        if (!this.ctx) return;
        
        // Aktifkan Audio Context jika suspended
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const now = this.ctx.currentTime;
        
        switch (type) {
            case 'click':
                this.synthBeep(1200, 0.05, 'sine', 0.1);
                break;
                
            case 'roll':
                // Suara gulungan dadu bergulir (frekuensi naik turun cepat)
                for (let i = 0; i < 5; i++) {
                    this.synthBeep(300 + (i * 100), 0.08, 'triangle', 0.15, now + (i * 0.08));
                }
                break;
                
            case 'ladder':
                // Arpeggio nada menanjak (kesuksesan akademik)
                const scaleUp = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C - E - G - C - E - G
                scaleUp.forEach((freq, idx) => {
                    this.synthBeep(freq, 0.15, 'sine', 0.2, now + (idx * 0.1));
                });
                break;
                
            case 'snake':
                // Nada meluncur turun (kemerosotan nilai/posisi)
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.6);
                
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
                
            case 'bomb':
                // Ledakan sanksi tengkorak (Low frequency noise & buzz)
                const oscBomb = this.ctx.createOscillator();
                const gainBomb = this.ctx.createGain();
                
                oscBomb.type = 'sawtooth';
                oscBomb.frequency.setValueAtTime(120, now);
                oscBomb.frequency.linearRampToValueAtTime(30, now + 0.8);
                
                gainBomb.gain.setValueAtTime(0.5, now);
                gainBomb.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
                
                oscBomb.connect(gainBomb);
                gainBomb.connect(this.ctx.destination);
                oscBomb.start(now);
                oscBomb.stop(now + 0.8);
                break;
                
            case 'correct':
                // Denting positif ceria
                this.synthBeep(523.25, 0.1, 'sine', 0.2, now); // C5
                this.synthBeep(659.25, 0.2, 'sine', 0.2, now + 0.08); // E5
                break;
                
            case 'wrong':
                // Dengungan buzzer gagal
                this.synthBeep(180, 0.3, 'sawtooth', 0.35, now);
                this.synthBeep(175, 0.3, 'sawtooth', 0.35, now + 0.05);
                break;
                
            case 'evolve':
                // Nada hembusan sihir / sparkle
                for (let i = 0; i < 8; i++) {
                    const randomFreq = 800 + Math.random() * 800;
                    this.synthBeep(randomFreq, 0.1, 'sine', 0.15, now + (i * 0.05));
                }
                break;
                
            case 'dropout':
                // funeral march sad chord
                this.synthBeep(196.00, 0.4, 'triangle', 0.3, now); // G3
                this.synthBeep(155.56, 0.4, 'triangle', 0.3, now + 0.15); // Eb3
                this.synthBeep(130.81, 0.6, 'triangle', 0.4, now + 0.3); // C3
                break;
        }
    }

    /**
     * Memproduksi bunyi beep sederhana dengan Web Audio API
     */
    synthBeep(frequency, duration, type = 'sine', volume = 0.2, startTime = null) {
        if (!this.ctx) return;
        
        const time = startTime || this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, time);
        
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(time);
        osc.stop(time + duration);
    }
}

// Ekspor instance tunggal (singleton)
export const audioManager = new AudioManager();
export { AudioManager };
