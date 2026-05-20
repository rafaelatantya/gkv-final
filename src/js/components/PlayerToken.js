/* ==========================================================================
   GAME PLAYER TOKEN COMPONENT (PHASER SPRITE & TWEEN MOVEMENT & EVOLUTION)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

export class PlayerToken {
    /**
       Konstruktor inisialisasi bidak pemain.
       @param {Phaser.Scene} scene Reference ke adegan GameScene aktif.
       @param {Object} playerData Objek data profil pemain (id, name, isBot, dll).
       @param {BoardBuilder} boardBuilder Reference ke instansi pembentuk koordinat papan.
     */
    constructor(scene, playerData, boardBuilder) {
        this.scene = scene;
        this.boardBuilder = boardBuilder;

        // Menyalin properti data model pemain
        this.id = playerData.id;
        this.name = playerData.name;
        this.isBot = playerData.isBot;
        
        this.currentPosition = playerData.currentPosition || 1;
        this.evolutionLevel = playerData.evolutionLevel || 1;
        this.isSuspended = playerData.isSuspended || false;
        this.skullCount = playerData.skullCount || 0;

        // Hitung offset offset khusus untuk merapikan tumpukan bidak di petak yang sama
        this.offsetCoordinates = this.calculateStackingOffsetCoordinates();

        // Cari koordinat petak awal
        const startCoord = this.boardBuilder.getTileCenterCoordinates(this.currentPosition);
        
        // Buat objek Sprite utama Phaser 3 untuk bidak pemain
        const initialTextureKey = `p${this.id}_lvl${this.evolutionLevel}`;
        this.sprite = this.scene.add.sprite(
            startCoord.x + this.offsetCoordinates.x,
            startCoord.y + this.offsetCoordinates.y,
            initialTextureKey
        );

        // Atur kedalaman rendering agar selalu berada di depan garis ular/tangga
        this.sprite.setDepth(15);
        this.sprite.setOrigin(0.5, 0.5);

        // Pasang bayangan hitam transparan di bawah bidak untuk estetika 3D depth
        this.shadow = this.scene.add.ellipse(
            this.sprite.x,
            this.sprite.y + 16,
            24,
            8,
            0x000000,
            0.35
        );
        this.shadow.setDepth(14);
    }

    /**
       Kalkulasi offset penyebaran bidak berdasarkan ID pemain
       agar tidak saling menutupi 100% jika mendarat di petak yang sama.
     */
    calculateStackingOffsetCoordinates() {
        const offsetDist = 10;
        switch (this.id) {
            case 1: return { x: -offsetDist, y: offsetDist }; // Kiri Bawah
            case 2: return { x: offsetDist, y: offsetDist };  // Kanan Bawah
            case 3: return { x: -offsetDist, y: -offsetDist }; // Kiri Atas
            case 4: return { x: offsetDist, y: -offsetDist };  // Kanan Atas
            default: return { x: 0, y: 0 };
        }
    }

    /**
       Menjalankan animasi pergerakan bidak langkah-demi-langkah dari posisi saat ini.
       @param {Number} steps Jumlah langkah dadu yang harus ditempuh (maju/mundur).
       @param {Function} onCompleteCallback Callback asinkron ketika pergerakan selesai.
     */
    moveStepByStep(steps, onCompleteCallback) {
        if (steps === 0) {
            if (onCompleteCallback) onCompleteCallback();
            return;
        }

        const isMovingForward = steps > 0;
        const totalStepsCount = Math.abs(steps);
        let stepIndex = 0;

        // Generator fungsi iterasi lompatan berurutan asinkron
        const executeNextJump = () => {
            stepIndex++;
            
            // Perbarui posisi model angka petak
            if (isMovingForward) {
                this.currentPosition++;
            } else {
                this.currentPosition--;
            }

            // Kunci batas atas/bawah petak (1 s.d 100)
            this.currentPosition = Phaser.Math.Clamp(this.currentPosition, 1, 100);

            // Ambil titik koordinat piksel petak berikutnya
            const nextCoord = this.boardBuilder.getTileCenterCoordinates(this.currentPosition);
            const targetX = nextCoord.x + this.offsetCoordinates.x;
            const targetY = nextCoord.y + this.offsetCoordinates.y;

            // Mainkan SFX langkah cepat (dadu menggelinding)
            if (this.scene.sfxEngine) {
                this.scene.sfxEngine.playEffectSound('sfx_dice_charge', 'dice');
            }

            // 1. Jalankan tween melompat parabola (X, Y) untuk Sprite bidak
            this.scene.tweens.add({
                targets: this.sprite,
                x: targetX,
                y: targetY - 24, // Membuat puncak lompatan parabola ke atas
                duration: 160,
                yoyo: true, // Kembali turun saat mendarat
                ease: 'Quad.Out',
                onComplete: () => {
                    // Pastikan bidak menapak tepat di koordinat target
                    this.sprite.x = targetX;
                    this.sprite.y = targetY;

                    // Perbarui posisi bayangan
                    this.shadow.x = targetX;
                    this.shadow.y = targetY + 16;

                    // Cek dan picu evaluasi evolusi karakter real-time saat melompat
                    this.checkAndTriggerEvolutions();

                    // Cek kelanjutan langkah lompatan berikutnya
                    if (stepIndex < totalStepsCount && this.currentPosition !== 100 && this.currentPosition !== 1) {
                        this.scene.time.delayedCall(80, executeNextJump);
                    } else {
                        // Selesai seluruh lompatan, picu callback
                        if (onCompleteCallback) {
                            onCompleteCallback();
                        }
                    }
                }
            });

            // 2. Jalankan tween penskalaan bayangan agar mengecil saat bidak melayang tinggi
            this.scene.tweens.add({
                targets: this.shadow,
                scaleX: 0.6,
                scaleY: 0.6,
                alpha: 0.15,
                duration: 160,
                yoyo: true,
                ease: 'Quad.Out'
            });
        };

        // Mulai lompatan pertama
        executeNextJump();
    }

    /**
       Meluncurkan bidak secara instan meluncur (Slide) untuk ular/tangga.
       Menggunakan tween tunggal berdurasi lebih lambat dengan camera tracking.
       @param {Number} targetTile Nomor petak tujuan setelah meluncur.
       @param {String} slideType Jenis luncuran ('ladder' = naik tangga, 'snake' = turun ular).
       @param {Function} onCompleteCallback Callback setelah mendarat di ujung rute.
     */
    slideDirectlyToTile(targetTile, slideType, onCompleteCallback) {
        this.currentPosition = targetTile;
        
        const endCoord = this.boardBuilder.getTileCenterCoordinates(targetTile);
        const targetX = endCoord.x + this.offsetCoordinates.x;
        const targetY = endCoord.y + this.offsetCoordinates.y;

        const isLadder = slideType === 'ladder';
        const slideDuration = isLadder ? 1400 : 1800; // Tangga naik cepat, Ular meliuk lambat

        // Mainkan SFX peluncuran yang sesuai
        if (this.scene.sfxEngine) {
            this.scene.sfxEngine.playEffectSound(
                isLadder ? 'sfx_ladder_up' : 'sfx_snake_slide',
                isLadder ? 'ladder' : 'snake'
            );
        }

        // Tembakkan partikel bintang bersinar sepanjang luncuran
        const trailEmitter = this.scene.createVisualTrailParticles(
            this.sprite, 
            isLadder ? 0x1ed760 : 0xff8800
        );

        // Jalankan tween geser linear halus menuju petak tujuan
        this.scene.tweens.add({
            targets: [this.sprite, this.shadow],
            props: {
                x: { value: targetX, duration: slideDuration, ease: 'Cubic.Out' },
                y: { 
                    value: (target) => target === this.sprite ? targetY : targetY + 16, 
                    duration: slideDuration, 
                    ease: 'Cubic.Out' 
                }
            },
            onComplete: () => {
                // Matikan trail partikel
                if (trailEmitter) trailEmitter.destroy();

                // Picu getaran kamera kecil jika terjatuh ular sanksi
                if (!isLadder) {
                    this.scene.cameras.main.shake(200, 0.008);
                }

                // Cek dan evaluasi tingkat evolusi
                this.checkAndTriggerEvolutions();

                if (onCompleteCallback) onCompleteCallback();
            }
        });
    }

    /**
       Mengevaluasi secara dinamis apakah bidak berhak naik level evolusi visual
       berdasarkan nomor petak yang didudukinya saat ini.
     */
    checkAndTriggerEvolutions() {
        let targetLvl = 1;

        if (this.currentPosition > 75) targetLvl = 4; // Level 4: Formal Suit (Skripsi)
        else if (this.currentPosition > 50) targetLvl = 3; // Level 3: Tidy neat (Kuliah Keahlian)
        else if (this.currentPosition > 25) targetLvl = 2; // Level 2: Casual messy (Departemen)

        // Jika level evolusi berubah, ganti tekstur sprite dan picu partikel ledakan
        if (this.evolutionLevel !== targetLvl) {
            this.evolutionLevel = targetLvl;
            const newTextureKey = `p${this.id}_lvl${this.evolutionLevel}`;
            
            this.sprite.setTexture(newTextureKey);

            // Ledakan kembang api partikel kecil saat berevolusi!
            this.scene.triggerEvolutionFireworks(this.sprite.x, this.sprite.y);

            if (this.scene.sfxEngine) {
                this.scene.sfxEngine.playEffectSound('sfx_evolution', 'correct');
            }

            // Tambahkan catatan di log
            this.scene.addLogActivityMessage(
                `Evolusi! ${this.name} telah naik ke Level ${this.evolutionLevel} (${this.getEvolutionTitleName()})!`,
                "event"
            );
        }
    }

    /**
       Mendapatkan nama title akademis berdasarkan level evolusi aktif.
     */
    getEvolutionTitleName() {
        switch (this.evolutionLevel) {
            case 1: return "Maba PPKU Punk";
            case 2: return "Mahasiswa Casual";
            case 3: return "Praktikan Rapi";
            case 4: return "Calon Wisudawan Formal";
            default: return "Mahasiswa Baru";
        }
    }

    /**
       Menghancurkan objek sprite Phaser ketika pemain dinyatakan Drop Out / Kalah.
     */
    destroyToken() {
        this.sprite.destroy();
        this.shadow.destroy();
    }
}
