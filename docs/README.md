# Dokumentasi Proyek: Ular Tangga Tata Tertib IPB University (PhaserJS Edition)
### Mata Kuliah KOM1304 - Grafika Komputer dan Visualisasi

Selamat datang di direktori dokumentasi resmi untuk proyek **Ular Tangga Tata Tertib IPB University**. Repositori ini telah dimigrasikan menggunakan engine game **PhaserJS (Phaser 3)** guna menyajikan tampilan game papan maksimalis dengan visual 60 FPS bebas lag, efek partikel melimpah, dan kamera dinamis.

---

## 📌 Daftar Dokumen Panduan

Untuk memahami proyek ini secara menyeluruh, silakan jelajahi dokumen-dokumen berikut:

1.  **[Arsitektur Proyek & Struktur Adegan (architecture.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/architecture.md)**
    *   Panduan lengkap tata letak berkas modular Phaser 3.
    *   Deskripsi fungsionalitas dari setiap file adegan (`BootScene`, `PreloadScene`, `MenuScene`, `PrologueScene`, `GameScene`, `HUDScene`) dan komponen logika pendukung.
    *   Diagram interaksi dan siklus perjalanan giliran (*Game Turn Loop*) berbasis WebGL.

2.  **[Mekanika & Aturan Permainan (game_rules_mechanics.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/game_rules_mechanics.md)**
    *   Logika penentuan giliran (*Turn-Based Local Multiplayer* & *AI Bot*).
    *   Sistem pelemparan dadu otomatis berbasis timer (10 detik) dan visualisasi meteran **Dice Gauge**.
    *   Mekanika pergerakan bidak langkah-demi-langkah dengan efek pantulan elastis (*elastic tween*).
    *   Sutradara kamera dinamis (*zoom-in*, *camera follow*, *camera shake*) yang fokus pada objek permainan.
    *   Sanksi skorsing, pemotongan baris di petak tengkorak, serta aturan mutlak kemenangan di petak 100 dengan sistem pantulan dadu.

3.  **[Bank Konten Permainan (game_content.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/game_content.md)**
    *   **Kuis Pop-up (6 Petak Tanda Tanya):** Pertanyaan & jawaban pilihan ganda seputar tata tertib kehidupan mahasiswa IPB University.
    *   **Petak Biasa (Normal Tiles):** Teks narasi motivasi & perilaku positif kecil beserta poin rewards.
    *   **Petak Ular:** Kasus pelanggaran ringan, sedang, dan berat berdasarkan Buku Saku IPB.
    *   **Petak Tangga:** Penghargaan, pencapaian akademik/non-akademik, lomba, dan magang tingkat nasional.
    *   **Petak Tengkorak:** Kasus skorsing/pelanggaran akademis fatal.

4.  **[Perancangan Aset & Efek Visual Maksimalis (assets_design.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/assets_design.md)**
    *   Skema warna dynamic HSL IPB & Cyberpunk bercahaya GPU accelerated.
    *   Sistem partikel maksimalis Phaser (`Dice Emitter`, `Ladder Emitter`, `Snake Emitter`, `Skull Burst`, dan `Winner Fireworks`).
    *   Spesifikasi **17 variasi spritesheet** evolusi karakter secara *real-time* (Punk hingga Duta IPB).
    *   Pengelolaan musik latar belakang (BGM) dinamis per fase semester dengan transisi halus (*crossfading*) serta **Web Audio API Synthesizer Fallback** (suara retro chiptune bawaan).

5.  **[Panduan Operasional AI Agent (AGENTS.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/AGENTS.md)**
    *   Instruksi khusus dan batasan operasional bagi seluruh AI Agent di dalam repositori ini.
    *   Penjelasan larangan git commit, push ke main/production, dan rilis otomatis secara mandiri.

---

## 🛠️ Cara Menjalankan Game Secara Lokal

Karena game ini memanfaatkan modul ES6 dan asinkron preloading aset game Phaser 3, Anda wajib menjalankannya di bawah lingkungan server lokal untuk menghindari batasan keamanan CORS peramban.

### Metode 1: Menggunakan Server Statis Terkompresi Gzip (Sangat Direkomendasikan)
1.  Pastikan Anda telah menginstal [Node.js](https://nodejs.org/).
2.  Buka terminal/command prompt pada direktori root proyek:
    ```bash
    npm install
    ```
3.  Jalankan server pengembangan berbasis Gzip (Zero-Dependency):
    ```bash
    # Menggunakan npm script
    npm start

    # Atau menggunakan Node.js langsung
    node server.js
    ```
4.  Buka peramban Anda dan akses **`http://localhost:3000`**. Server statis berkinerja tinggi ini mendukung pemantauan log request secara real-time dan kompresi gzip untuk pengiriman seluruh berkas visual Phaser secara instan dan bebas lag.

### Metode 2: Menggunakan Ekstensi VS Code "Live Server"
1. Buka folder proyek ini di VS Code.
2. Instal ekstensi **"Live Server"** oleh Ritwick Dey.
3. Klik tombol **"Go Live"** di pojok kanan bawah editor.
4. Akses game pada alamat lokal yang terbuka otomatis.
