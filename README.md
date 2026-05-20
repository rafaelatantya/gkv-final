# Ular Tangga Tata Tertib IPB University
### Proyek Akhir Mata Kuliah KOM1304 - Grafika Komputer dan Visualisasi

Game simulasi papan edukatif multipemain berbasis web yang merepresentasikan perjalanan transformasi karakter mahasiswa baru dari **Petak 0 ( punk berantakan )** hingga ber-evolusi secara *real-time* menjadi **Petak 100 ( Duta IPB University berjas almamater dan selempang emas )**. Game ini memvisualisasikan aturan kedisiplinan dan tata tertib kehidupan kampus IPB secara interaktif, menyenangkan, dan kompetitif.

---

## 👥 Anggota Tim Pengembang (Kelompok)

| Nama Lengkap | NIM | Peran Utama |
| :--- | :--- | :--- |
| **Ayubi Fathan** | M0403241050 | UI/UX Designer & Audio Planner |
| **Nafil Khautal Budiono** | M0403241102 | Content Creator & Riset Tata Tertib |
| **Muhammad Syaamil** | M0403241115 | Graphics Programmer (SVG Render) |
| **Rafael Federico Atantya** | M0403241108 | Lead Core Systems Engineer |

---

## 🌟 Fitur Unggulan Game

1.  **Sistem Kontrol Dadu (Dice Gauge):** Mekanika pelemparan dadu presisi terinspirasi dari *LINE: Let's Get Rich!*. Pemain menahan dan melepas tombol ROLL untuk mengisi daya persentase dadu guna membidik target angka lemparan secara strategis.
2.  **Evolusi Karakter Real-Time:** Visualisasi bidak pemain ber-evolusi secara dinamis di sepanjang 4 fase tingkat semester:
    *   **Petak 0 - 25 (Fase PPKU):** Karakter bergaya Punk.
    *   **Petak 26 - 50 (Fase Departemen):** Karakter bergaya Kasual Berantakan.
    *   **Petak 51 - 75 (Kuliah Keahlian):** Karakter kaos polo berkerah rapi.
    *   **Petak 76 - 99 (Skripsi Akhir):** Karakter kemeja rapi formal.
    *   **Petak 100 (Finish/Wisuda):** Karakter megah berjas almamater IPB dan selempang **"Duta IPB"**.
3.  **Petak Khusus Edukatif:**
    *   **Petak Kuis (?):** Memicu pop-up pertanyaan pilihan ganda seputar Peraturan Akademik IPB. Menjawab benar memberi reward maju, menjawab salah mendapat penalti mundur.
    *   **Petak Tengkorak (💀):** Pelanggaran berat fatal. Pemain diturunkan 4 baris, disuspensi (skip 1 giliran), dan jika terkena akumulasi 3 kali mendarat akan langsung **Drop Out (Kalah)**.
4.  **Vector SVG Overlay:** Garis kurva ular hijau neon dan tangga kayu cokelat digambar secara dinamis menggunakan SVG relatif terhadap titik tengah sel grid papan untuk visualisasi yang super bersih dan responsif.
5.  **Audio Dinamis per Semester:** BGM berotasi otomatis sesuai fase wilayah terjauh pemain. Dilengkapi dengan **Web Audio API Synthesizer** sebagai penyelamat suara jika file aset fisik `.mp3` kosong di web hosting.

---

## 📂 Struktur Direktori Proyek

```
gkv-final/
├── docs/                      # Pusat Dokumentasi Lengkap
│   ├── README.md              # Index panduan docs
│   ├── AGENTS.md              # Batasan operasional & aturan bagi AI Agent
│   ├── architecture.md        # Desain fungsionalitas modular berkas JS
│   ├── game_rules_mechanics.md# Mekanika dadu gauge, suspensi, & AI Bot
│   ├── game_content.md        # Database kuis, pelanggaran, & prestasi IPB
│   └── assets_design.md       # Skema warna HSL, glassmorphism, & audio
├── src/                       # Source Code Program Utama
│   ├── index.html             # DOM layout SPA (Single Page Application)
│   ├── css/                   # Stylesheets (main.css, board.css, ui.css)
│   ├── js/                    # Modul ES6 (app.js, game.js, board.js, dll.)
│   └── assets/                # Folder aset multimedia (.png, .mp3)
├── package.json               # Konfigurasi Live Server lokal & script npm
├── server.js                  # Server HTTP statis premium dengan kompresi Gzip bawaan
└── README.md                  # Ringkasan Proyek Utama [Berkas Ini]
```

---

## 🚀 Cara Menjalankan Game Secara Lokal

### Prasyarat
Pastikan komputer Anda sudah terpasang [Node.js](https://nodejs.org/).

### Langkah Instalasi
1.  Buka Terminal atau Command Prompt di direktori proyek `gkv-final/`.
2.  Pasang dependensi server pengembang lokal:
    ```bash
    npm install
    ```
3.  Jalankan server pengembangan dengan kompresi Gzip bawaan:
    ```bash
    # Menggunakan npm script
    npm start

    # Atau menggunakan Node.js langsung
    node server.js
    ```
4.  Buka browser Anda dan akses alamat **`http://localhost:3000`**. Server statis berkinerja tinggi ini akan melayani aset secara responsif tanpa lag.

---

## 📖 Panduan Dokumentasi Rinci
Untuk mempelajari sistem kerja engine, diagram interaksi kelas JavaScript, bank soal lengkap, serta rincian mekanika dadu secara mendalam, silakan baca dokumentasi lengkap kami di direktori [docs/README.md](file:///\\wsl.localhost\Ubuntu\home\lenovo\projects\gkv-final/docs/README.md).
