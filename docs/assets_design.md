# Dokumen Perancangan Aset dan Desain Visual (PhaserJS Edition)
### Proyek: Ular Tangga Tata Tertib IPB University
### Mata Kuliah: Grafika Komputer dan Visualisasi

Dokumen ini memuat spesifikasi panduan visual, UI/UX, skema warna, efek partikel, kamera, serta tata suara (audio) yang diimplementasikan menggunakan **PhaserJS (Phaser 3)** untuk menciptakan pengalaman game papan maksimalis, premium, responsif, dan ultra-smooth.

---

## 🎨 1. Skema Warna dan Identitas Visual (WebGL Accelerated)

Untuk memberikan kesan akademis modern dan futuristik yang premium, kami menggunakan kombinasi palet warna resmi IPB University dengan aksen **Glassmorphism UI Overlay** dan **Cyberpunk Academic Effects** yang didukung akselerasi GPU WebGL.

### 🌟 Palet Warna Utama (CSS & WebGL Tinting)
Warna didefinisikan menggunakan format HSL dan Hexadesimal untuk diintegrasikan secara serasi baik pada elemen UI HTML maupun objek grafis Phaser 3.

| Nama Warna | Kode Warna HSL | Kode HEX | Kegunaan Visual |
| :--- | :--- | :--- | :--- |
| **IPB Blue (Primary)** | `hsl(215, 90%, 25%)` | `0x042c64` | Warna dasar menu, border utama, dan sel standar. |
| **IPB Gold (Secondary)** | `hsl(43, 90%, 50%)` | `0xf2b80f` | Aksen tombol aktif, piala kemenangan, dan partikel tangga. |
| **Academic Cyber (Accent)**| `hsl(190, 100%, 45%)`| `0x00e5ff` | Efek neon glowing, pancaran dadu, dan petak Kuis. |
| **Violations Red (Danger)**| `hsl(0, 85%, 50%)` | `0xe61919` | Efek ledakan, petak tengkorak, sanksi, dan partikel DO. |
| **Glass Background** | `hsla(215, 30%, 12%, 0.75)`| — | Latar belakang modal kuis dan panel status pemain. |

---

## ✨ 2. Sistem Partikel dan Visual Maksimalis (Phaser Particles)

Salah satu alasan utama menggunakan Phaser 3 adalah kemampuannya merender ribuan partikel secara simultan tanpa lag. Kita memanfaatkan **Phaser.GameObjects.Particles** untuk efek visual bernyawa berikut:

### A. Dadu Charge Aura (Dice Emitter)
*   **Trigger:** Ketika pemain menahan tombol ROLL dadu.
*   **Deskripsi:** Partikel berupa partikel cahaya biru muda (`0x00e5ff`) berukuran kecil akan menyedot masuk (*implode*) dari luar ke arah titik dadu, bergerak semakin cepat seiring dengan bertambahnya pengisian daya (gauge).

### B. Tangga Emas Bersinar (Ladder Emitter)
*   **Trigger:** Ketika bidak memanjat tangga.
*   **Deskripsi:** Partikel bintang emas (`0xf2b80f`) mengekor di belakang kaki bidak (*pawn tail trail*) dan memancar ke atas secara vertikal, menyimbolkan peningkatan prestasi akademik yang cemerlang.

### C. Ular Hijau Beracun (Snake Emitter)
*   **Trigger:** Ketika bidak merosot turun digigit ular.
*   **Deskripsi:** Asap partikel hijau tua pekat (`0x2ecc71`) membumbung tinggi menyelimuti bidak sepanjang lintasan ular ke bawah, melambangkan konsekuensi dari pelanggaran tata tertib.

### D. Ledakan Tengkorak Merah (Skull Burst)
*   **Trigger:** Ketika bidak mendarat di petak tengkorak.
*   **Deskripsi:** Ledakan lingkaran partikel merah berapi (`0xe61919`) memancar keluar secara eksplosif dari petak dibarengi dengan getaran kamera (*camera shake*) selama 250ms.

### E. Kembang Api Kemenangan (Winner Fireworks)
*   **Trigger:** Ketika pemain mencapai petak 100.
*   **Deskripsi:** Beberapa emitter kembang api partikel multi-warna akan meledak secara berulang di layar atas dengan efek gravitasi ke bawah, melambangkan kebahagiaan wisuda kelulusan.

---

## 🧍 3. Sistem Aset Karakter (Spritesheets & Evolution)

Game ini tidak menggunakan token lingkaran statis, melainkan **Spritesheet 2D** beranimasi yang dapat berubah bentuk (evolusi) secara langsung berdasarkan posisi petak.

### 🖼️ Total Kebutuhan Aset Visual Bidak: 17 Sprite
Terdapat **4 karakter dasar** (warna rambut/pakaian utama berbeda untuk membedakan pemain 1, 2, 3, dan 4). Masing-masing memiliki **4 fase evolusi**. Ditambah **1 sprite khusus kemenangan**.

```
Fase 1: PUNK       Fase 2: CASUAL MESSY       Fase 3: TIDY T-SHIRT       Fase 4: FORMAL SHIRT       Fase 5: WINNER DUTA
 (Petak 0-25)         (Petak 26-50)               (Petak 51-75)              (Petak 76-99)             (Petak 100)
   [ 🧑‍🎤 ]   ───>        [ 🧑‍💻 ]       ───>         [ 🧑‍💼 ]       ───>         [ 👔 ]      ───>       [ 👑 ]
```

#### 📌 Rincian Spesifikasi Sprite per Pemain:
*   **Pemain 1 (Tema Biru):**
    *   `p1_lvl1_punk.png`: Rambut spike biru, jaket denim sobek-sobek.
    *   `p1_lvl2_casual.png`: Rambut disisir samping, kemeja biru dikeluarkan.
    *   `p1_lvl3_tidy.png`: Kaos polo biru berkerah rapi.
    *   `p1_lvl4_formal.png`: Kemeja biru lengan panjang, celana hitam, dimasukkan rapi.
*   **Pemain 2 (Tema Merah Maroon):**
    *   `p2_lvl1_punk.png`: Rambut mohawk merah, jaket kulit hitam berpeniti.
    *   `p2_lvl2_casual.png`: Kemeja flanel merah kotak-kotak tidak dikancingkan.
    *   `p2_lvl3_tidy.png`: Kaos polo merah rapi.
    *   `p2_lvl4_formal.png`: Kemeja merah maroon formal, celana abu-abu.
*   **Pemain 3 (Tema Hijau Toska):**
    *   `p3_lvl1_punk.png`: Rambut spike hijau, kaos hitam robek bergambar band.
    *   `p3_lvl2_casual.png`: Kemeja hijau kasual lengan pendek yang kusut.
    *   `p3_lvl3_tidy.png`: Kaos kerah hijau toska bersih.
    *   `p3_lvl4_formal.png`: Kemeja hijau pastel formal, ikat pinggang kulit.
*   **Pemain 4 (Tema Oranye):**
    *   `p4_lvl1_punk.png`: Rambut gimbal oranye, rompi jeans bertabur paku logam.
    *   `p4_lvl2_casual.png`: Jaket hoodie oranye longgar.
    *   `p4_lvl3_tidy.png`: Kaos polo oranye berkerah dimasukkan rapi.
    *   `p4_lvl4_formal.png`: Kemeja oranye lembut formal, sepatu pantofel.
*   **Sprite Pemenang Khusus (`winner_duta_ipb.png`):**
    *   Desain khusus berukuran 1.5x lebih besar dari bidak biasa. Karakter memegang piala emas, memakai selempang kuning bertuliskan **"DUTA IPB UNIVERSITY"**, mengenakan Jas Almamater IPB biru tua yang sangat megah, dan berpose selebrasi menyapa penonton.

---

## 🔊 4. Sistem Audio dan Tata Suara (Phaser Sound Manager)

Sistem audio game dikelola oleh **Phaser.Sound.BaseSoundManager** untuk menangani pemutaran lagu dinamis, pencampuran audio (*volume mixing*), transisi perpindahan musik halus (*crossfading*), serta sound effects (SFX) berkecepatan tinggi.

### 🎵 A. Background Music (BGM) Dinamis Per Fase
Musik latar belakang akan berubah secara otomatis melalui efek *crossfade* 1.5 detik ketika posisi pemain terdepan memasuki wilayah petak tertentu:

1.  **Level 1 (Fase PPKU - Petak 0 s.d 25):**
    *   *Judul Lagu:* "Masa Transisi" (Tempo cepat, bersemangat, menggunakan gitar elektrik/pop-punk santai untuk menggambarkan semangat mahasiswa baru yang bebas).
2.  **Level 2 & 3 (Fase Kuliah Keahlian - Petak 26 s.d 75):**
    *   *Judul Lagu:* "Serius tapi Santai" (Tempo sedang, instrumen akustik gitar & piano, menggambarkan masa-masa praktikum yang padat namun penuh kebersamaan).
3.  **Level 4 (Fase Skripsi & Akhir - Petak 76 s.d 99):**
    *   *Judul Lagu:* "Menuju Kelulusan" (Tempo lambat, instrumen orkestra biola & piano yang dramatis, membangun ketegangan menjelang garis finish).
4.  **Level Finish (Petak 100 - Winner Screen):**
    *   *Judul Lagu:* **"Hymne / Mars IPB University"** (Aransemen orkestra megah dan sakral untuk menyambut keberhasilan lulus sebagai Duta IPB).

### 🔊 B. Web Audio API Synthesizer (Fallback Engine)
Jika berkas `.mp3` fisik tidak ditemukan atau diblokir oleh browser karena kebijakan autoplayer, **SFXEngine** berbasis **Web Audio API** bawaan browser akan secara otomatis mengambil alih fungsi audio. Engine ini menyintesis gelombang suara chiptune 8-bit secara real-time:
*   *Dadu Berputar:* Getaran gelombang *sine* dengan frekuensi menanjak cepat.
*   *Denting Kuis Benar:* Kombinasi nada harmoni mayor *arpeggio* pendek.
*   *Ledakan Tengkorak:* Gelombang *noise* pekat dengan filter pelemahan frekuensi (*exponential decay*).
