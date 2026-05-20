/* ==========================================================================
   GAME BOARD BUILDER COMPONENT (DYNAMIC GRAPHICS & COORDINATES)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

import { contentData } from '../contentData.js';

export class BoardBuilder {
    /**
       Konstruktor inisialisasi visual papan permainan.
       @param {Phaser.Scene} scene Reference ke adegan GameScene aktif.
     */
    constructor(scene) {
        this.scene = scene;

        // Dimensi dan Posisi Papan Permainan
        this.boardWidth = 640;
        this.boardHeight = 640;
        this.tileSize = 64; // 10x10 Grid (640px / 10 = 64px)

        // Penyelarasan papan agar terpusat di area canvas setelah dikurangi sidebar 320px
        const remainingWidth = this.scene.cameras.main.width - 320;
        this.boardOriginX = 320 + (remainingWidth - this.boardWidth) / 2; // ~523px
        this.boardOriginY = (this.scene.cameras.main.height - this.boardHeight) / 2; // ~64px

        // Caching seluruh koordinat petak 1-100 demi performa rendering optimal
        this.tileCoordinatesMap = {};
        this.precomputeBoardGridCoordinates();
    }

    /**
       Menghitung koordinat X dan Y absolut dari 100 petak zig-zag secara matematis.
     */
    precomputeBoardGridCoordinates() {
        for (let tile = 1; tile <= 100; tile++) {
            const zeroIndexed = tile - 1;
            const row = Math.floor(zeroIndexed / 10);
            let col = zeroIndexed % 10;

            // Alur zig-zag: Baris ganjil bergerak dari kanan ke kiri
            if (row % 2 === 1) {
                col = 9 - col;
            }

            // Koordinat pusat piksel dari petak
            const x = this.boardOriginX + (col * this.tileSize) + (this.tileSize / 2);
            const y = this.boardOriginY + (this.boardHeight) - (row * this.tileSize) - (this.tileSize / 2);

            this.tileCoordinatesMap[tile] = { x, y, row, col };
        }
    }

    /**
       Mengambil data koordinat pusat piksel (x, y) dari nomor petak tertentu.
       @param {Number} tileNumber Nomor petak target (1 s.d 100).
       @returns {Object} Koordinat X dan Y.
     */
    getTileCenterCoordinates(tileNumber) {
        // Fallback proteksi batas petak
        const clampedTile = Phaser.Math.Clamp(tileNumber, 1, 100);
        return this.tileCoordinatesMap[clampedTile];
    }

    /**
       Menggambar elemen dasar grid papan permainan 10x10 di atas Canvas WebGL.
     */
    drawBoardGrid() {
        const boardGraphics = this.scene.add.graphics();
        
        // Skema warna grid berdasarkan level fase akademik
        const phaseColorPalette = {
            ppku: 0x042c64,    // Biru Tua PPKU (Petak 1-25)
            dept: 0x008ba3,    // Cyan Departemen (Petak 26-50)
            expert: 0x009633,  // Hijau Keahlian (Petak 51-75)
            grad: 0xb35f00     // Oranye Emas Skripsi (Petak 76-100)
        };

        for (let tile = 1; tile <= 100; tile++) {
            const coord = this.getTileCenterCoordinates(tile);
            const tileLeft = coord.x - (this.tileSize / 2);
            const tileTop = coord.y - (this.tileSize / 2);

            // Tentukan kelompok warna berdasarkan level akademis
            let tileBgColor = phaseColorPalette.ppku;
            if (tile > 25 && tile <= 50) tileBgColor = phaseColorPalette.dept;
            else if (tile > 50 && tile <= 75) tileBgColor = phaseColorPalette.expert;
            else if (tile > 75) tileBgColor = phaseColorPalette.grad;

            // Menggambar latar belakang petak glassmorphism bergradien warna redup
            boardGraphics.fillStyle(tileBgColor, 0.25);
            boardGraphics.lineStyle(1.5, 0xffffff, 0.1);
            boardGraphics.strokeRoundedRect(tileLeft + 2, tileTop + 2, this.tileSize - 4, this.tileSize - 4, 8);
            boardGraphics.fillRoundedRect(tileLeft + 2, tileTop + 2, this.tileSize - 4, this.tileSize - 4, 8);

            // Tambahkan nomor petak di pojok kiri atas sel
            this.scene.add.text(tileLeft + 6, tileTop + 6, tile.toString(), {
                font: 'bold 10px Inter',
                fill: '#8b9bb4',
                alpha: 0.8
            });

            // Tambahkan dekorasi teks/ikon petak khusus statis
            this.drawTileSpecialDecorations(tile, tileLeft, tileTop);
        }
    }

    /**
       Menggambar indikator ikon khusus (Kuis, Tengkorak, Ular, Tangga) di setiap sel.
     */
    drawTileSpecialDecorations(tile, tileLeft, tileTop) {
        // Petak Kuis (?) - Petak nomor kelipatan 8 yang bukan ular/tangga
        const isQuizTile = tile % 8 === 0 && !contentData.snakes[tile] && !contentData.ladders[tile] && tile !== 100;
        
        if (isQuizTile) {
            this.scene.add.text(tileLeft + this.tileSize / 2, tileTop + this.tileSize / 2 + 2, '❓', {
                font: '18px Arial',
                align: 'center'
            }).setOrigin(0.5).setAlpha(0.7);
        }

        // Petak Tengkorak DO (💀)
        if (contentData.skulls[tile]) {
            this.scene.add.text(tileLeft + this.tileSize / 2, tileTop + this.tileSize / 2 + 2, '💀', {
                font: '20px Arial',
                align: 'center'
            }).setOrigin(0.5);
            
            // Beri warna latar khusus merah membara pada petak tengkorak
            const skullBg = this.scene.add.graphics();
            skullBg.lineStyle(2, 0xff3333, 0.7);
            skullBg.strokeRoundedRect(tileLeft + 3, tileTop + 3, this.tileSize - 6, this.tileSize - 6, 8);
        }

        // Penanda khusus untuk Petak 1 (Start) dan Petak 100 (Wisuda)
        if (tile === 1) {
            this.scene.add.text(tileLeft + this.tileSize / 2, tileTop + this.tileSize / 2 + 10, 'START', {
                font: 'bold 9px Outfit',
                fill: '#00e5ff'
            }).setOrigin(0.5);
        } else if (tile === 100) {
            this.scene.add.text(tileLeft + this.tileSize / 2, tileTop + this.tileSize / 2, '🎓', {
                font: '26px Arial'
            }).setOrigin(0.5);
            this.scene.add.text(tileLeft + this.tileSize / 2, tileTop + this.tileSize / 2 + 18, 'WISUDA', {
                font: 'bold 8px Outfit',
                fill: '#ffd700'
            }).setOrigin(0.5);
        }
    }

    /**
       Menggambar seluruh rute ular secara bercahaya menggunakan garis kurva Bezier Phaser Graphics.
     */
    drawSnakesRutes() {
        const snakeGraphics = this.scene.add.graphics();

        Object.keys(contentData.snakes).forEach(headTileStr => {
            const headTile = parseInt(headTileStr, 10);
            
            // Hitung petak ekor ular (Misal: Ular berat turun 4 baris = 40 petak)
            let tailTile = headTile - 10; // Default turun 1 baris
            if (headTile === 34 || headTile === 54 || headTile === 73) tailTile = headTile - 20; // Sedang
            if (headTile === 84 || headTile === 98) tailTile = headTile - 40; // Berat

            const headCoord = this.getTileCenterCoordinates(headTile);
            const tailCoord = this.getTileCenterCoordinates(tailTile);

            // Tentukan warna ular berdasarkan tingkat keparahan sanksi (kuning/merah neon)
            const colorSnake = headTile >= 80 ? 0xff2e93 : 0xff8800;

            // Menggambar kurva melengkung Bezier agar ular terlihat meliuk fleksibel
            const curve = new Phaser.Curves.CubicBezier(
                new Phaser.Math.Vector2(headCoord.x, headCoord.y),
                new Phaser.Math.Vector2((headCoord.x + tailCoord.x) / 2 + 60, (headCoord.y + tailCoord.y) / 2 - 40),
                new Phaser.Math.Vector2((headCoord.x + tailCoord.x) / 2 - 60, (headCoord.y + tailCoord.y) / 2 + 40),
                new Phaser.Math.Vector2(tailCoord.x, tailCoord.y)
            );

            // 1. Gambar efek glow neon di bawah garis utama
            snakeGraphics.lineStyle(6, colorSnake, 0.25);
            curve.draw(snakeGraphics);

            // 2. Gambar tubuh utama ular
            snakeGraphics.lineStyle(3.5, colorSnake, 0.95);
            curve.draw(snakeGraphics);

            // 3. Tambahkan mata kepala ular bersinar di kepala
            this.scene.add.circle(headCoord.x, headCoord.y, 4, 0xffffff, 0.9);
            this.scene.add.circle(headCoord.x, headCoord.y, 2, 0x000000, 1.0);
        });
    }

    /**
       Menggambar seluruh rute tangga secara bercahaya menggunakan garis lurus Phaser Graphics.
     */
    drawLaddersRutes() {
        const ladderGraphics = this.scene.add.graphics();

        Object.keys(contentData.ladders).forEach(bottomTileStr => {
            const bottomTile = parseInt(bottomTileStr, 10);
            
            // Hitung petak puncak tangga (Naik 10, 20, atau 30 petak)
            let topTile = bottomTile + 10;
            if (bottomTile === 15 || bottomTile === 28 || bottomTile === 38) topTile = bottomTile + 20;
            if (bottomTile === 50 || bottomTile === 65) topTile = bottomTile + 30;

            const bottomCoord = this.getTileCenterCoordinates(bottomTile);
            const topCoord = this.getTileCenterCoordinates(topTile);

            // Skema warna tangga bercahaya emas IPB & hijau neon prestasi
            const colorLadder = 0x1ed760;

            // Hitung arah vector tegak lurus untuk menggambar tiang tangga kiri & kanan sejajar
            const dx = topCoord.x - bottomCoord.x;
            const dy = topCoord.y - bottomCoord.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / length;
            const uy = dy / length;

            // Offset lebar tiang tangga kiri-kanan (jarak 8 piksel dari garis tengah)
            const offsetX = -uy * 8;
            const offsetY = ux * 8;

            // 1. Gambar tiang kiri tangga
            ladderGraphics.lineStyle(2.5, colorLadder, 0.8);
            ladderGraphics.lineBetween(bottomCoord.x + offsetX, bottomCoord.y + offsetY, topCoord.x + offsetX, topCoord.y + offsetY);

            // 2. Gambar tiang kanan tangga
            ladderGraphics.lineBetween(bottomCoord.x - offsetX, bottomCoord.y - offsetY, topCoord.x - offsetX, topCoord.y - offsetY);

            // 3. Menggambar anak tangga horisontal secara berjarak (tiap 16 piksel)
            const stepCount = Math.floor(length / 16);
            ladderGraphics.lineStyle(1.5, 0xffffff, 0.7);
            
            for (let i = 1; i < stepCount; i++) {
                const ratio = i / stepCount;
                const sx = bottomCoord.x + dx * ratio;
                const sy = bottomCoord.y + dy * ratio;

                ladderGraphics.lineBetween(sx + offsetX, sy + offsetY, sx - offsetX, sy - offsetY);
            }

            // Tambahkan neon glow lembut di belakang seluruh tangga
            ladderGraphics.lineStyle(8, colorLadder, 0.15);
            ladderGraphics.lineBetween(bottomCoord.x, bottomCoord.y, topCoord.x, topCoord.y);
        });
    }
}
