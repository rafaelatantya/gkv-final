/* ==========================================================================
   PHASER 3 ENGINE CONFIGURATION & BOOTSTRAPPER
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { PrologueScene } from './scenes/PrologueScene.js';
import { GameScene } from './scenes/GameScene.js';
import { HUDScene } from './scenes/HUDScene.js';

/**
   Objek konfigurasi global untuk engine Phaser 3.
   Menentukan setelan WebGL, skalabilitas layar adaptif, dan layering adegan.
 */
const phaserGameConfiguration = {
    type: Phaser.AUTO, // Memprioritaskan WebGL dengan fallback otomatis ke Canvas 2D
    width: 1366,       // Resolusi lebar dasar standar widescreen 16:9
    height: 768,       // Resolusi tinggi dasar standar widescreen 16:9
    parent: 'phaser-game-container', // Elemen kontainer DOM penampung Canvas
    
    // Fitur integrasi DOM untuk menyematkan overlay HTML/CSS di atas Canvas WebGL
    dom: {
        createContainer: true
    },
    
    // Sistem Skala Responsif untuk menyesuaikan visual di berbagai rasio layar
    scale: {
        mode: Phaser.Scale.FIT, // Mengisi layar sambil mempertahankan rasio aspek dasar
        autoCenter: Phaser.Scale.CENTER_BOTH // Memposisikan game tepat di tengah viewport
    },
    
    // Mengaktifkan fitur anti-aliasing untuk melicinkan tepian visual 2D
    pixelArt: false,
    
    // Urutan Adegan (Scenes) yang didaftarkan ke manajer adegan Phaser
    scene: [
        BootScene,
        PreloadScene,
        MenuScene,
        PrologueScene,
        GameScene,
        HUDScene
    ]
};

// Inisialisasi instance game Phaser ketika dokumen web selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
    window.phaserGameInstance = new Phaser.Game(phaserGameConfiguration);
});
