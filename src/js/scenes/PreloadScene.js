/* ==========================================================================
   PHASER SCENE: PRELOAD SCENE (ASSET LOADER & TEXTURE GENERATOR)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    /**
       Mempersiapkan visual loading bar neon dan mengunduh berkas aset statis.
     */
    preload() {
        this.createNeonLoadingInterface();

        // 1. MEMUAT PUSTAKA ASET FISIK (JIKA ADA DI SERVER)
        // Kita mendaftarkan pemuatan secara asinkron. Jika file kosong, manajer
        // Phaser akan mengeluarkan warning tetapi game tidak akan crash karena kita
        // telah menyiapkan engine generator tekstur dinamis di bawah.
        this.load.setPath('assets/');
        
        // Memuat berkas audio (SFX & BGM)
        this.load.audio('bgm_menu', 'audio/bgm_menu.mp3');
        this.load.audio('bgm_level_1', 'audio/bgm_level_1.mp3');
        this.load.audio('bgm_level_2', 'audio/bgm_level_2.mp3');
        this.load.audio('bgm_level_3', 'audio/bgm_level_3.mp3');
        this.load.audio('bgm_winner', 'audio/bgm_winner.mp3');
        
        this.load.audio('sfx_dice_charge', 'audio/sfx_dice_charge.mp3');
        this.load.audio('sfx_dice_roll', 'audio/sfx_dice_roll.mp3');
        this.load.audio('sfx_ladder_up', 'audio/sfx_ladder_up.mp3');
        this.load.audio('sfx_snake_slide', 'audio/sfx_snake_slide.mp3');
        this.load.audio('sfx_skull_bomb', 'audio/sfx_skull_bomb.mp3');
        this.load.audio('sfx_quiz_correct', 'audio/sfx_quiz_correct.mp3');
        this.load.audio('sfx_quiz_wrong', 'audio/sfx_quiz_wrong.mp3');
        this.load.audio('sfx_evolution', 'audio/sfx_evolution.mp3');
        this.load.audio('sfx_drop_out', 'audio/sfx_drop_out.mp3');
        
        // 2. GENERATOR TEKSTUR DINAMIS (Penyelamat Kompatibilitas Tanpa Aset Fisik)
        // Kita membuat generator tekstur langsung menggunakan Canvas 2D agar game
        // berjalan sempurna 100% secara visual saat pertama kali dipasang oleh pengguna.
        this.generateDynamicAssets();
    }

    /**
       Membuat visualisasi loading bar neon bergaya Cyberpunk Academic di tengah layar.
     */
    createNeonLoadingInterface() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;
        const barWidth = 400;
        const barHeight = 20;

        // Kontainer/Background bar (Neon border)
        const outlineBox = this.add.graphics();
        outlineBox.lineStyle(2, 0x00e5ff, 0.8);
        outlineBox.strokeRoundedRect((screenWidth - barWidth) / 2, (screenHeight - barHeight) / 2, barWidth, barHeight, 6);

        // Progress bar fill
        const progressBox = this.add.graphics();

        // Teks Persentase Loading
        const percentText = this.add.text(screenWidth / 2, screenHeight / 2 - 25, '0%', {
            font: 'bold 18px Outfit',
            fill: '#00e5ff'
        }).setOrigin(0.5);

        // Teks Informasi Proses
        const infoText = this.add.text(screenWidth / 2, screenHeight / 2 + 30, 'Mengunduh modul game...', {
            font: '14px Inter',
            fill: '#8b9bb4'
        }).setOrigin(0.5);

        // Event listener saat loading sedang berjalan
        this.load.on('progress', (value) => {
            percentText.setText(`${Math.floor(value * 100)}%`);
            progressBox.clear();
            progressBox.fillStyle(0x00e5ff, 0.6);
            progressBox.fillRoundedRect(
                (screenWidth - barWidth) / 2 + 3,
                (screenHeight - barHeight) / 2 + 3,
                (barWidth - 6) * value,
                barHeight - 6,
                4
            );
        });

        // Event listener saat loading selesai
        this.load.on('complete', () => {
            progressBox.destroy();
            outlineBox.destroy();
            percentText.destroy();
            infoText.destroy();
            console.log("🚀 Seluruh aset berhasil dimuat!");
        });
    }

    /**
       Menyintesis 17 variasi bidak karakter (evolusi) & visual dadu
       menggunakan API Canvas 2D dan mendaftarkannya ke Phaser Texture Manager.
     */
    generateDynamicAssets() {
        // Skema Warna untuk 4 Pemain
        const playerPalettes = [
            { primary: '#00e5ff', accent: '#008ba3', text: 'P1' }, // Pemain 1: Cyan
            { primary: '#ff2e93', accent: '#b50058', text: 'P2' }, // Pemain 2: Maroon/Pink
            { primary: '#1ed760', accent: '#009633', text: 'P3' }, // Pemain 3: Green
            { primary: '#ff8800', accent: '#b35f00', text: 'P4' }  // Pemain 4: Orange
        ];

        // Buat 4 level evolusi untuk masing-masing 4 pemain (Total 16 tekstur)
        for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
            const palette = playerPalettes[playerIndex];
            
            for (let evolutionLevel = 1; evolutionLevel <= 4; evolutionLevel++) {
                const textureKey = `p${playerIndex + 1}_lvl${evolutionLevel}`;
                
                // Dimensi Canvas Bidak (Lebar 64px, Tinggi 64px)
                const canvasTexture = this.textures.createCanvas(textureKey, 64, 64);
                const ctx = canvasTexture.context;
                
                ctx.clearRect(0, 0, 64, 64);
                ctx.save();
                
                // 1. Gambar Bidak Dasar (Lingkaran Bawah / Stand)
                ctx.fillStyle = palette.accent;
                ctx.beginPath();
                ctx.ellipse(32, 52, 20, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // 2. Gambar Tubuh / Baju Bidak
                ctx.fillStyle = palette.primary;
                ctx.beginPath();
                ctx.moveTo(32, 28);
                ctx.lineTo(16, 50);
                ctx.lineTo(48, 50);
                ctx.closePath();
                ctx.fill();
                
                // Gambar Aksen Baju Berdasarkan Level Evolusi
                if (evolutionLevel === 1) {
                    // Level 1: Punk (Baju denim robek)
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(24, 42); ctx.lineTo(24, 46);
                    ctx.moveTo(40, 42); ctx.lineTo(40, 46);
                    ctx.stroke();
                } else if (evolutionLevel === 2) {
                    // Level 2: Casual (Kancing kemeja acak)
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(32, 36, 2, 0, Math.PI * 2);
                    ctx.arc(32, 44, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (evolutionLevel === 3) {
                    // Level 3: Tidy (Kaos Polo Rapi)
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(27, 28); ctx.lineTo(32, 34); ctx.lineTo(37, 28);
                    ctx.closePath();
                    ctx.fill();
                } else if (evolutionLevel === 4) {
                    // Level 4: Formal (Kemeja berdasi)
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(29, 28); ctx.lineTo(32, 34); ctx.lineTo(35, 28);
                    ctx.closePath();
                    ctx.fill();
                    // Dasi merah tipis
                    ctx.fillStyle = '#ff3333';
                    ctx.beginPath();
                    ctx.moveTo(32, 34); ctx.lineTo(34, 44); ctx.lineTo(32, 48); ctx.lineTo(30, 44);
                    ctx.closePath();
                    ctx.fill();
                }
                
                // 3. Gambar Kepala Bidak
                ctx.fillStyle = '#ffe0b2'; // Warna Kulit dasar
                ctx.beginPath();
                ctx.arc(32, 22, 10, 0, Math.PI * 2);
                ctx.fill();
                
                // Gambar Aksen Rambut Berdasarkan Level Evolusi
                ctx.fillStyle = playerIndex === 0 ? '#333333' : (playerIndex === 1 ? '#4b2c20' : '#ffd54f');
                if (evolutionLevel === 1) {
                    // Level 1: Punk (Rambut Spiky berdiri tegak)
                    ctx.beginPath();
                    ctx.moveTo(22, 18); ctx.lineTo(24, 6); ctx.lineTo(28, 14);
                    ctx.lineTo(32, 4); ctx.lineTo(36, 14); ctx.lineTo(40, 6);
                    ctx.lineTo(42, 18); ctx.closePath();
                    ctx.fill();
                } else if (evolutionLevel === 2) {
                    // Level 2: Casual (Rambut Messy acak samping)
                    ctx.beginPath();
                    ctx.arc(30, 18, 11, Math.PI, Math.PI * 1.8);
                    ctx.lineTo(42, 22);
                    ctx.closePath();
                    ctx.fill();
                } else if (evolutionLevel === 3 || evolutionLevel === 4) {
                    // Level 3 & 4: Tidy/Formal (Rambut rapi klimis)
                    ctx.beginPath();
                    ctx.arc(32, 20, 11, Math.PI * 1.1, Math.PI * 1.9);
                    ctx.closePath();
                    ctx.fill();
                }
                
                // 4. Label Nama Bidak (P1-P4)
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 8px Outfit';
                ctx.textAlign = 'center';
                ctx.fillText(palette.text, 32, 46);
                
                ctx.restore();
                canvasTexture.refresh();
            }
        }

        // 3. GENERATOR SPRITE PEMENANG KHUSUS (winner_duta_ipb)
        const canvasWinner = this.textures.createCanvas('winner_duta', 96, 96);
        const winCtx = canvasWinner.context;
        winCtx.clearRect(0, 0, 96, 96);
        winCtx.save();

        // Podium Stand Emas
        winCtx.fillStyle = '#ffd700';
        winCtx.beginPath();
        winCtx.ellipse(48, 80, 36, 12, 0, 0, Math.PI * 2);
        winCtx.fill();

        // Badan Jas Almamater Biru IPB
        winCtx.fillStyle = '#042c64';
        winCtx.beginPath();
        winCtx.moveTo(48, 38);
        winCtx.lineTo(24, 76);
        winCtx.lineTo(72, 76);
        winCtx.closePath();
        winCtx.fill();

        // Selempang Emas "DUTA IPB"
        winCtx.strokeStyle = '#ffd700';
        winCtx.lineWidth = 4;
        winCtx.beginPath();
        winCtx.moveTo(34, 46);
        winCtx.lineTo(62, 72);
        winCtx.stroke();

        // Kepala bermahkota
        winCtx.fillStyle = '#ffe0b2';
        winCtx.beginPath();
        winCtx.arc(48, 28, 14, 0, Math.PI * 2);
        winCtx.fill();

        // Mahkota Emas
        winCtx.fillStyle = '#ffd700';
        winCtx.beginPath();
        winCtx.moveTo(36, 20);
        winCtx.lineTo(38, 8);
        winCtx.lineTo(44, 14);
        winCtx.lineTo(48, 4);
        winCtx.lineTo(52, 14);
        winCtx.lineTo(58, 8);
        winCtx.lineTo(60, 20);
        winCtx.closePath();
        winCtx.fill();

        // Teks "DUTA IPB"
        winCtx.fillStyle = '#ffffff';
        winCtx.font = 'bold 9px Outfit';
        winCtx.textAlign = 'center';
        winCtx.fillText('DUTA IPB', 48, 68);

        winCtx.restore();
        canvasWinner.refresh();

        // 4. GENERATOR TEKSTUR DADU DINAMIS (dice_1 s.d dice_6)
        for (let diceNumber = 1; diceNumber <= 6; diceNumber++) {
            const diceCanvas = this.textures.createCanvas(`dice_${diceNumber}`, 64, 64);
            const dCtx = diceCanvas.context;
            
            dCtx.clearRect(0, 0, 64, 64);
            dCtx.save();
            
            // Kotak Dadu Dasar (Putih gading mengkilat dengan border emas)
            dCtx.fillStyle = '#f5f5f0';
            dCtx.strokeStyle = '#f2b80f';
            dCtx.lineWidth = 3;
            dCtx.beginPath();
            dCtx.roundRect(4, 4, 56, 56, 12);
            dCtx.fill();
            dCtx.stroke();
            
            // Menggambar titik-titik dadu berwarna merah menyala
            dCtx.fillStyle = '#e61919';
            const dotsCoordinatesMap = {
                1: [[32, 32]],
                2: [[18, 18], [46, 46]],
                3: [[18, 18], [32, 32], [46, 46]],
                4: [[18, 18], [18, 46], [46, 18], [46, 46]],
                5: [[18, 18], [18, 46], [32, 32], [46, 18], [46, 46]],
                6: [[18, 18], [18, 32], [18, 46], [46, 18], [46, 32], [46, 46]]
            };
            
            const activeDots = dotsCoordinatesMap[diceNumber];
            activeDots.forEach(coordinate => {
                dCtx.beginPath();
                dCtx.arc(coordinate[0], coordinate[1], diceNumber === 1 ? 7 : 5, 0, Math.PI * 2);
                dCtx.fill();
            });
            
            dCtx.restore();
            diceCanvas.refresh();
        }

        // 5. GENERATOR PARTIKEL BULAT SEDERHANA (untuk Emitter)
        const particleCanvas = this.textures.createCanvas('particle_dot', 8, 8);
        const pCtx = particleCanvas.context;
        pCtx.clearRect(0, 0, 8, 8);
        pCtx.fillStyle = '#ffffff';
        pCtx.beginPath();
        pCtx.arc(4, 4, 4, 0, Math.PI * 2);
        pCtx.fill();
        particleCanvas.refresh();
    }

    /**
       Setelah seluruh pemuatan selesai, alihkan visual ke MenuScene.
     */
    create() {
        this.scene.start('MenuScene');
    }
}
