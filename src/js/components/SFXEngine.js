/* ==========================================================================
   GAME AUDIO SFX ENGINE (WEB AUDIO API RETRO CHIPTUNE SYNTHESIZER)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

export class SFXEngine {
    /**
       Konstruktor inisialisasi engine audio.
       @param {Phaser.Scene} scene Reference ke adegan Phaser aktif untuk trigger audio Phaser.
     */
    constructor(scene) {
        this.scene = scene;
        
        // Coba inisialisasi Web Audio API Context bawaan browser untuk synthesizer retro
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContextClass();
        } catch (error) {
            console.error("⚠️ Web Audio API tidak didukung di browser ini. Synthesizer retro dimatikan.", error);
            this.audioContext = null;
        }

        // Variabel penampung volume global (0.0 s.d 1.0)
        this.bgmVolumeSetting = 0.5;
        this.sfxVolumeSetting = 0.6;
        
        // Menyimpan track BGM aktif saat ini
        this.currentBgmKey = null;
    }

    /**
       Memutar lagu latar belakang (BGM) dengan fitur crossfade lembut.
       @param {String} bgmKey Kunci aset lagu yang dimuat Phaser.
     */
    playBackgroundMusic(bgmKey) {
        if (this.currentBgmKey === bgmKey) return; // Lagu yang sama sudah berbunyi

        const phaserSoundManager = this.scene.sound;
        
        // Hentikan BGM aktif sebelumnya secara bertahap (fade out) jika ada
        if (this.currentBgmKey) {
            const activeSound = phaserSoundManager.get(this.currentBgmKey);
            if (activeSound) {
                this.scene.tweens.add({
                    targets: activeSound,
                    volume: 0,
                    duration: 1000,
                    onComplete: () => activeSound.stop()
                });
            }
        }

        // Mulai mainkan lagu baru secara asinkron (fade in)
        this.currentBgmKey = bgmKey;
        const newSound = phaserSoundManager.add(bgmKey, { loop: true, volume: 0 });
        
        if (newSound) {
            newSound.play();
            this.scene.tweens.add({
                targets: newSound,
                volume: this.bgmVolumeSetting,
                duration: 1200
            });
        } else {
            console.warn(`🎵 Aset BGM '${bgmKey}' gagal dibuat. Mengaktifkan keheningan estetis.`);
        }
    }

    /**
       Mengatur volume musik latar secara dinamis di tengah game.
       @param {Number} targetVolume Nilai desimal volume (0.0 s.d 1.0).
     */
    setBackgroundMusicVolume(targetVolume) {
        this.bgmVolumeSetting = Phaser.Math.Clamp(targetVolume, 0, 1);
        if (this.currentBgmKey) {
            const activeBgm = this.scene.sound.get(this.currentBgmKey);
            if (activeBgm) {
                activeBgm.setVolume(this.bgmVolumeSetting);
            }
        }
    }

    /**
       Memutar efek suara (SFX) statis Phaser, dengan fallback otomatis ke
       synthesizer retro Web Audio API jika file MP3 kosong.
       @param {String} sfxKey Kunci aset suara statis Phaser.
       @param {String} synthType Nama jenis instrumen synthesizer fallback ('dice', 'ladder', 'snake', 'skull', 'correct', 'wrong').
     */
    playEffectSound(sfxKey, synthType = 'dice') {
        const phaserSoundManager = this.scene.sound;
        const sfxInstance = phaserSoundManager.get(sfxKey);

        if (sfxInstance) {
            // Putar audio fisik mp3 jika berhasil termuat sempurna
            phaserSoundManager.play(sfxKey, { volume: this.sfxVolumeSetting });
        } else {
            // Aset mp3 kosong, trigger modul synthesizer chiptune dinamis
            this.synthesizeRetroChiptune(synthType);
        }
    }

    /**
       Menyintesis nada retro chiptune (sine/square wave) 8-bit langsung menggunakan Web Audio API.
       @param {String} soundType Jenis suara yang diinginkan.
     */
    synthesizeRetroChiptune(soundType) {
        if (!this.audioContext) return;
        
        // Aktifkan AudioContext jika dalam status ditangguhkan oleh kebijakan autoplay browser
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const ctx = this.audioContext;
        const currentTime = ctx.currentTime;

        switch (soundType) {
            case 'dice': // Efek Dadu Menggelinding (Frekuensi Noise/Gemerincing meningkat cepat)
                this.createChiptuneTone(180, 480, 0.15, 'sine', currentTime);
                break;
                
            case 'ladder': // Efek Naik Tangga Prestasi (Melodi tangga nada Arpeggio menaik cepat)
                const ladderNotes = [261.63, 329.63, 392.00, 523.25, 659.25]; // Nada C-E-G-C-E
                ladderNotes.forEach((frequency, index) => {
                    this.createChiptuneTone(frequency, frequency, 0.15, 'triangle', currentTime + (index * 0.08));
                });
                break;
                
            case 'snake': // Efek Meluncur Turun Ular Sanksi (Frekuensi menurun drastis)
                this.createChiptuneTone(440, 110, 0.45, 'sawtooth', currentTime);
                break;
                
            case 'skull': // Efek Ledakan Bom Tengkorak DO (Suara bass bergemuruh)
                this.createChiptuneTone(150, 40, 0.6, 'square', currentTime);
                break;
                
            case 'correct': // Kuis Terjawab Benar (Nada ganda ceria)
                this.createChiptuneTone(523.25, 523.25, 0.1, 'sine', currentTime);
                this.createChiptuneTone(783.99, 783.99, 0.25, 'sine', currentTime + 0.1);
                break;
                
            case 'wrong': // Kuis Terjawab Salah (Nada disonansi sedih)
                this.createChiptuneTone(220, 180, 0.35, 'square', currentTime);
                break;
                
            default:
                this.createChiptuneTone(330, 330, 0.1, 'sine', currentTime);
                break;
        }
    }

    /**
       Helper internal untuk membuat satu gelombang osilator nada chiptune murni.
       @param {Number} startFreq Frekuensi awal gelombang nada (Hz).
       @param {Number} endFreq Frekuensi akhir gelombang nada (Hz).
       @param {Number} duration Durasi bunyinya nada dalam detik.
       @param {String} waveType Bentuk gelombang osilator ('sine', 'square', 'sawtooth', 'triangle').
       @param {Number} startTime Waktu mulai bunyi.
     */
    createChiptuneTone(startFreq, endFreq, duration, waveType, startTime) {
        const ctx = this.audioContext;

        // 1. Buat Osilator & Gain Node (Pengatur Volume)
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = waveType;
        
        // Atur transisi frekuensi gelombang secara linear (pitch sweep)
        oscillator.frequency.setValueAtTime(startFreq, startTime);
        oscillator.frequency.linearRampToValueAtTime(endFreq, startTime + duration);

        // Atur kurva envelope volume suara (Fade out lembut agar tidak klik pecah)
        gainNode.gain.setValueAtTime(this.sfxVolumeSetting, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        // 2. Hubungkan modul generator suara ke speaker utama
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // 3. Picu nyala dan matinya nada
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
}
