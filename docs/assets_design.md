# Dokumen Perancangan Aset dan Desain Visual
### Proyek: Ular Tangga Tata Tertib IPB University

Dokumen ini memuat spesifikasi panduan visual, UI/UX, skema warna modern, serta tata suara (audio) yang digunakan dalam game **Ular Tangga Tata Tertib IPB University** untuk mewujudkan tampilan game yang premium, responsif, dan dinamis.

---

## 🎨 1. Skema Warna dan Identitas Visual

Untuk memberikan kesan akademis modern dan futuristik yang premium, kami menggunakan kombinasi palet warna resmi IPB University dengan aksen **Glassmorphism** dan **Cyberpunk Academic**.

### 🌟 Palet Warna Utama (CSS Variable Tokens)
Warna didefinisikan menggunakan format HSL (Hue, Saturation, Lightness) untuk mempermudah pembuatan efek transparansi (*alpha channel*) secara dinamis.

| Nama Warna | Kode Warna HSL | Kode HEX | Kegunaan Visual |
| :--- | :--- | :--- | :--- |
| **IPB Blue (Primary)** | `hsl(215, 90%, 25%)` | `#042C64` | Warna dasar menu, header, dan border utama. |
| **IPB Gold (Secondary)** | `hsl(43, 90%, 50%)` | `#F2B80F` | Aksen tombol aktif, piala kemenangan, dan highlight teks penting. |
| **Academic Cyber (Accent)**| `hsl(190, 100%, 45%)`| `#00E5FF` | Efek neon, glow dari Dice Gauge, dan warna petak Kuis. |
| **Violations Red (Danger)**| `hsl(0, 85%, 50%)` | `#E61919` | Efek ledakan, petak tengkorak, sanksi, dan tanda drop out. |
| **Glass Background** | `hsla(215, 30%, 12%, 0.75)`| — | Latar belakang modal kuis dan panel status pemain. |

### ✨ Prinsip Desain Glassmorphism
Antarmuka UI (seperti panel, modal kuis, dan menu setelan) harus mematuhi aturan styling berikut untuk mendapatkan efek kaca premium:
*   `background: rgba(255, 255, 255, 0.08);` (atau menggunakan warna gelap transparan).
*   `backdrop-filter: blur(12px) saturate(160%);` untuk memberikan efek buram di belakang panel.
*   `border: 1px solid rgba(255, 255, 255, 0.15);` sebagai bingkai tipis pemantul cahaya.
*   `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);` untuk memberikan kedalaman (*depth*).

---

## 🧍 2. Sistem Aset Karakter (Evolution Sprites)

Game ini tidak menggunakan token lingkaran statis, melainkan file gambar/sprite animasi 2D karakter mahasiswa yang dapat berubah bentuk (evolusi) secara langsung berdasarkan posisi petak.

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

## 🔊 3. Sistem Audio dan Tata Suara (BGM & SFX)

Sistem audio game dirancang untuk beradaptasi dengan level permainan secara dinamis, memperkuat aspek edukasi serta hiburan.

### 🎵 A. Background Music (BGM) Dinamis Per Level
Musik latar belakang akan berubah secara otomatis ketika rata-rata atau posisi pemain terdepan memasuki wilayah petak tertentu:

1.  **Level 1 (Fase PPKU - Petak 0 s.d 25):**
    *   *Judul Lagu:* "Masa Transisi" (Tempo cepat, bersemangat, menggunakan gitar elektrik/pop-punk santai untuk menggambarkan semangat mahasiswa baru yang bebas).
2.  **Level 2 & 3 (Fase Kuliah Keahlian - Petak 26 s.d 75):**
    *   *Judul Lagu:* "Serius tapi Santai" (Tempo sedang, instrumen akustik gitar & piano, menggambarkan masa-masa praktikum yang padat namun penuh kebersamaan).
3.  **Level 4 (Fase Skripsi & Akhir - Petak 76 s.d 99):**
    *   *Judul Lagu:* "Menuju Kelulusan" (Tempo lambat, instrumen orkestra biola & piano yang dramatis, membangun ketegangan menjelang garis finish).
4.  **Level Finish (Petak 100 - Winner Screen):**
    *   *Judul Lagu:* **"Hymne / Mars IPB University"** (Aransemen orkestra megah dan sakral untuk menyambut keberhasilan lulus sebagai Duta IPB).

### 🔊 B. Sound Effects (SFX)
Efek suara singkat yang terpicu saat kejadian tertentu terjadi di layar:
*   `sfx_dice_charge.mp3`: Suara getaran/elektrik yang semakin meninggi seiring bertambahnya meteran Dice Gauge.
*   `sfx_dice_roll.mp3`: Suara gesekan dadu kayu menggelinding di atas meja.
*   `sfx_ladder_up.mp3`: Suara loncatan harpa bernada menanjak (*ascending scale*) yang melambangkan kesuksesan akademik.
*   `sfx_snake_slide.mp3`: Suara mendesis ular dibarengi peluncuran pelan (*slide whistle down*) yang melambangkan penurunan posisi.
*   `sfx_skull_bomb.mp3`: Suara ledakan bom menggelegar dibarengi efek gempa layar (*screen shake*).
*   `sfx_quiz_correct.mp3`: Suara denting bel positif (*ting!*).
*   `sfx_quiz_wrong.mp3`: Suara buzzer berdengung rendah (*buzz!*).
*   `sfx_evolution.mp3`: Suara hembusan sihir/cahaya berkilau (*sparkle / swoosh*) saat bidak karakter naik level visual.
*   `sfx_drop_out.mp3`: Suara lonceng pemakaman lambat melambangkan kesedihan akibat Drop Out.
