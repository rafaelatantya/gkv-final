/* ==========================================================================
   PHASER SCENE: BOOT SCENE (INITIALIZATION)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    /**
       Memuat aset minimal yang dibutuhkan untuk menggambar loading bar di scene berikutnya.
     */
    preload() {
        // Aset visual awal (seperti logo IPB) dapat dimuat di sini secara cepat jika perlu.
        // Di sini kita biarkan kosong dan mengandalkan visual generator berbasis grafis di PreloadScene.
    }

    /**
       Menyiapkan dasar sistem Phaser, lalu segera mengalihkan alur ke PreloadScene.
     */
    create() {
        // Melakukan pengecekan konsol awal
        console.log("🎮 Game Booted! Menyiapkan sistem rendering WebGL...");

        // Segera picu transisi ke PreloadScene untuk pengunduhan aset utama secara paralel
        this.scene.start('PreloadScene');
    }
}
