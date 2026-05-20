# Dokumentasi Proyek: Ular Tangga Tata Tertib IPB University
### Mata Kuliah KOM1304 - Grafika Komputer dan Visualisasi

Selamat datang di direktori dokumentasi resmi untuk proyek **Ular Tangga Tata Tertib IPB University**. Repositori ini berisi seluruh dokumen panduan desain, spesifikasi teknis, bank konten, serta arsitektur kode dari game simulasi edukasi ini.

---

## 📌 Daftar Dokumen Panduan

Untuk memahami proyek ini secara menyeluruh, silakan jelajahi dokumen-dokumen berikut:

1.  **[Arsitektur Proyek & Struktur File (architecture.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/architecture.md)**
    *   Panduan lengkap tata letak file proyek.
    *   Deskripsi fungsionalitas dari setiap file HTML, CSS, dan modul JavaScript (ES6 Modular).
    *   Diagram interaksi dan alur data modular dalam aplikasi game.

2.  **[Mekanika & Aturan Permainan (game_rules_mechanics.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/game_rules_mechanics.md)**
    *   Logika penentuan giliran (*Turn-Based Local Multiplayer* & *AI Bot*).
    *   Sistem pelemparan dadu otomatis berbasis timer (10 detik).
    *   Panduan perhitungan algoritma **Dice Gauge System** (*LINE: Let's Get Rich!* style).
    *   Mekanika penalti petak tengkorak (Skorsing/Skip Turn, mundur 4 baris, akumulasi Drop Out).
    *   Logika pergerakan modular serta aturan tangga (*ladders*) dan ular (*snakes*).
    *   Kondisi kemenangan mutlak (petak 100).

3.  **[Bank Konten Permainan (game_content.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/game_content.md)**
    *   **Kuis Pop-up (6 Petak Tanda Tanya):** Pertanyaan & jawaban seputar tata tertib kehidupan mahasiswa IPB University.
    *   **Petak Biasa (Normal Tiles):** Teks narasi motivasi & perilaku positif kecil beserta poin rewards.
    *   **Petak Ular:** Kasus pelanggaran ringan, sedang, dan berat berdasarkan Buku Saku IPB.
    *   **Petak Tangga:** Penghargaan, pencapaian akademik/non-akademik, lomba, dan magang tingkat nasional.
    *   **Petak Tengkorak:** Kasus skorsing/pelanggaran akademis fatal.

4.  **[Perancangan Aset & Desain Visual (assets_design.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/assets_design.md)**
    *   Rincian **17 variasi sprite** evolusi karakter secara *real-time* (Punk hingga Duta IPB).
    *   Panduan UI/UX (Glassmorphism, Cyberpunk Modern Academic).
    *   Skema warna modern (HSL dynamic palettes).
    *   Rancangan transisi musik (BGM dinamis per level) & efek audio (SFX).

5.  **[Panduan Operasional AI Agent (AGENTS.md)](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/AGENTS.md)**
    *   Instruksi khusus dan batasan operasional bagi seluruh AI Agent di dalam repositori ini.
    *   Penjelasan larangan git commit, push ke main/production, dan rilis otomatis.

---

## 🛠️ Cara Menjalankan Game Secara Lokal

Game ini dirancang murni menggunakan teknologi web modern standard tanpa memerlukan proses *building* yang rumit. Ikuti langkah-langkah berikut untuk menjalankannya di komputer Anda:

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
4.  Buka alamat **`http://localhost:3000`** di browser Anda. Server ini mendukung logging berwarna dan kompresi gzip untuk performa transmisi bebas lag.

### Metode 2: Membuka File HTML Secara Langsung
Karena modul JavaScript (ES6 Modules) digunakan untuk struktur kode yang rapi, beberapa browser modern membatasi pemuatan modul lokal lewat protokol `file://` karena alasan keamanan (CORS). Oleh karena itu, **sangat disarankan** menggunakan server lokal seperti Metode 1, ekstensi VS Code "Live Server", atau perintah python:
```bash
# Python 3
python -m http.server 8000
```
Lalu buka `http://localhost:8000` di web browser Anda.
