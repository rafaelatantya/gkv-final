# Panduan Mekanika dan Aturan Permainan (PhaserJS Edition)
### Proyek: Ular Tangga Tata Tertib IPB University
### Mata Kuliah: Grafika Komputer dan Visualisasi

Dokumen ini menjabarkan seluruh aturan main, mekanika interaktif, formula dadu, sanksi skorsing/Drop Out, serta integrasi **animasi visual dan kamera dinamis PhaserJS** yang mengatur jalannya permainan **Ular Tangga Tata Tertib IPB University**.

---

## 📖 1. Mekanisme Prolog (Narrative Opener)

Ketika permainan dimulai untuk pertama kali:
*   Sebelum masuk ke papan permainan, seluruh pemain disajikan adegan pengantar cerita (**PrologueScene**).
*   Narasi menceritakan kisah perjalanan "Mahasiswa Bermasalah" (gaya punk, rambut acak-acakan) yang masuk ke IPB University dan menyadari pentingnya menaati tata tertib kehidupan kampus demi mencapai kelulusan yang membanggakan (menjadi Duta IPB).
*   Prolog disajikan dalam format visual novel sederhana menggunakan aset teks typewriter Phaser dan parallax scrolling background, lengkap dengan tombol Glassmorphism *Next* untuk melanjutkan cerita.

---

## 🎲 2. Sistem Dadu Interaktif (Dice Gauge System)

Untuk menghilangkan kelemahan utama ular tangga klasik yang murni mengandalkan keberuntungan acak (RNG), game ini mengadaptasi **Sistem Dice Gauge** (pengukur daya lemparan) yang terinspirasi dari game *LINE: Let's Get Rich!*.

### 🕹️ Cara Kerja Dice Gauge di Phaser
1.  Pemain menahan tombol **"ROLL"** di panel HUD (*Mouse Down* atau *Touch Start*).
2.  Adegan `HUDScene` secara asinkron memperbarui meteran pengisian daya (*charge bar*) dari **0% hingga 100%** dengan animasi berdenyut bolak-balik (0% -> 100% -> 0%) menggunakan loop timer internal.
3.  Partikel aura tersedot masuk ke arah dadu (`Dice Emitter`) sebagai visualisasi penumpukan energi.
4.  Pemain melepas tombol **"ROLL"** pada saat meteran berada di persentase target untuk membidik angka dadu tertentu (menggunakan 2 dadu, rentang nilai 2 s.d 12).

### 📐 Logika Kondisional Penguncian Angka Dadu
Logika penguncian angka dadu dihitung secara matematis berdasarkan tingkat persentase pengisian daya (`chargePercent`):

| Tingkat (Level) Daya | Batas Persentase | Rentang Target Angka Dadu | Status Mahasiswa | Filosofi Mekanika |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1** | `0% <= chargePercent <= 25%` | `[2, 3]` | Status Percobaan | Kurang usaha, fokus minimal. Peluang maju sangat kecil. |
| **Level 2** | `25% < chargePercent <= 50%` | `[4, 5, 6]` | Mahasiswa Reguler | Usaha sedang. Langkah perkuliahan stabil dan aman. |
| **Level 3** | `50% < chargePercent <= 75%` | `[7, 8, 9]` | Mahasiswa Teladan | Usaha optimal. Berpeluang besar melompat ke petak prestasi. |
| **Level 4** | `75% < chargePercent <= 100%` | `[10, 11, 12]` | Duta Tata Tertib | Usaha maksimal & ketepatan tinggi. Melangkah sangat jauh. |

---

## 🤖 3. Aturan Giliran dan AI Bot

### 👥 Multipemain Lokal (Turn-based Local Multiplayer)
*   Mendukung pertarungan **2 hingga 4 pemain nyata** yang bermain di satu perangkat secara bergantian.

### ⏱️ Pelemparan Otomatis (Auto Roll Timer)
*   Terdapat batas waktu tunggu (**Timer**) selama **10 detik** per giliran aktif pemain di HUD.
*   Jika timer habis, sistem memicu pengisian daya dadu acak otomatis (*Auto Roll*) agar permainan tidak terhambat.

### 🤖 Mekanisme Bot AI (Computer Players)
*   Jika slot pemain tidak terpenuhi oleh pemain nyata, slot kosong akan otomatis diisi oleh **AI Bot**.
*   **Perilaku AI Bot:**
    *   Ketika giliran Bot aktif, sistem memberikan jeda realistis selama **1.5 detik** untuk simulasi berpikir.
    *   Bot memicu `DiceGauge.js` secara otomatis, menahan tombol dadu selama durasi acak terpilih, lalu melepasnya.
    *   Gerakan bidak Bot diatur sepenuhnya oleh game engine dengan kecepatan pemrosesan yang sama seperti pemain manusia.

---

## 🏃 4. Animasi Pergerakan Bidak & Kamera Dinamis

Salah satu keunggulan migrasi PhaserJS adalah visualisasi gerakan bidak yang sangat hidup dan dramatis:

### A. Animasi Pergerakan Elastis (Step-by-Step Elastic Tween)
*   Bidak tidak langsung berpindah instan ke petak tujuan. `PlayerToken.js` menghitung rute sel-demi-sel.
*   Pergerakan dilakukan langkah-demi-langkah dengan durasi 180ms per petak menggunakan **Phaser Tweens** dengan fungsi easing `Bounce.Out` atau `Back.Out`.
*   Efek ini membuat bidak terlihat seolah-olah meloncat secara fisik dan memantul elastis saat menyentuh permukaan petak.
*   Denting suara lompatan berbunyi tepat saat kaki bidak menyentuh sel.

### B. Kamera Sutradara (Dynamic Director Camera)
*   **Focus Zoom:** Saat giliran pemain aktif dimulai, kamera utama `GameScene` melakukan *smooth pan* (pergeseran) dan *zoom-in* (hingga 1.5x) untuk menyoroti bidak tersebut.
*   **Camera Follow:** Selama bidak berjalan melompati sel papan, kamera secara dinamis mengikuti koordinat bidak agar pergerakan selalu berada di tengah layar.
*   **Action Pan:** Ketika bidak mendarat di tangga atau ular, kamera akan meluncur lambat mengikuti pergerakan naik/turun bidak demi membangun ketegangan dramatis.
*   **Zoom Out:** Giliran berakhir ditandai dengan kamera yang melakukan *zoom-out* kembali ke tampilan penuh papan 10x10.

---

## 💀 5. Spesifikasi dan Fungsi Petak Khusus

### A. Petak Biasa (Normal Tiles)
Menampilkan pop-up informasi akademis harian mahasiswa IPB.
*   Format pesan: `"Selamat, Anda telah mendapatkan [jumlah dadu] poin dikarenakan [alasan]."`

### B. Petak Tanda Tanya (Quiz Tiles) - 6 Petak
*   **Posisi:** Tersebar strategis (misal: petak 7, 20, 33, 46, 77, 86).
*   **Fungsi:** Memicu pop-up kuis tata tertib kehidupan kampus di IPB.
*   **Aturan Kuis:**
    *   Menampilkan dialog overlay berisi soal pilihan ganda dari `contentData.js`.
    *   **Jika Benar:** Pemain mendapat reward maju 2 petak ekstra (atau tetap aman).
    *   **Jika Salah:** Pemain mendapat sanksi mundur 2 petak.

### C. Petak Tengkorak (Sanction Tiles) - 3 Petak
Kondisi pelanggaran tata tertib berat dan fatal.
*   **Posisi:** Ditempatkan di area kritis papan (misal: petak 26, 58, 72).
*   **Aturan Penalti:**
    1.  **Skip Turn (Skorsing):** Pemain ditandai `suspended = true` di `PlayerToken.js` sehingga giliran berikutnya otomatis dilewati.
    2.  **Mundur 4 Baris:** Pemain diturunkan sebanyak 4 baris ke bawah (-40 petak). Jika posisi < 40, kembali ke petak 0.
    3.  **Visual Ledakan:** Memicu ledakan partikel merah pekat dan guncangan layar (*camera shake*) keras selama 250ms dibarengi suara bom ledakan.
    4.  **Drop Out (Kalah Mutlak):** Jika seorang pemain mendarat di petak tengkorak ini sebanyak **3 kali secara akumulatif**, pemain tersebut langsung tereliminasi dari papan game dengan layar hitam "Drop Out".

---

## 🪜 6. Rintangan dan Akselerasi (Ular & Tangga)

Elemen klasik Ular dan Tangga dimodifikasi untuk mencerminkan dinamika akademik semester:

*   **Tangga (Ladders) - Akselerasi:** Melambangkan pencapaian akademik/organisasi luar biasa. 
    *   Bidak memanjat naik lintasan lurus diiringi partikel bintang emas berkilauan (`Ladder Emitter`) dan suara arpeggio harpa bernada naik.
    *   Tingkat elevasi: **Pendek (+10 petak)**, **Sedang (+20 petak)**, **Panjang (+30 petak)**.
*   **Ular (Snakes) - Rintangan:** Melambangkan hambatan studi dan pelanggaran tata tertib sedang.
    *   Bidak meluncur turun meliuk di sepanjang garis kurva diiringi asap partikel hijau beracun (`Snake Emitter`) dan suara meluncur turun.
    *   Tingkat penurunan: **Pendek (-10 petak)**, **Sedang (-20 petak)**, **Panjang (-40 petak)**.

---

## 🧍 7. Sistem Evolusi Karakter (Real-time Evolution)

Bidak pemain ber-evolusi secara langsung (*real-time*) sesuai dengan posisi petak semester mereka:

```
[Punk Style] ──(Petak 26)──> [Messy Casual] ──(Petak 51)──> [T-Shirt Tidy] ──(Petak 76)──> [Full Formal Shirt] ──(Petak 100)──> [Duta IPB]
```

### 📈 Rincian Tahapan Evolusi:
1.  **Tingkat 1 (Petak 0 - 25) - Gaya Punk:** Mahasiswa baru yang belum tertib. Visual rambut spike acak-acakan dan jaket jeans penuh patch sobek.
2.  **Tingkat 2 (Petak 26 - 50) - Gaya Kasual Berantakan:** Kemeja flanel berantakan dikeluarkan, rambut disisir samping.
3.  **Tingkat 3 (Petak 51 - 75) - Gaya Rapi Santai:** Memakai kaos oblong berkerah rapi, sepatu bersih, rambut rapi.
4.  **Tingkat 4 (Petak 76 - 99) - Gaya Rapi Formal:** Siap sidang akhir. Kemeja formal rapi dimasukkan ke celana bahan, bersepatu pantofel.
5.  **Tingkat 5 (Petak 100) - Duta IPB University:** Pemenang mutlak! Memakai setelan kemeja rapi penuh, lengkap dengan dasi, jas almamater kebanggaan IPB berwarna biru tua, serta selempang emas bertuliskan **"Duta IPB"**.

*Saat melintasi batas petak tingkat evolusi, bidak akan memancarkan partikel sihir berkilau (`sfx_evolution`) sebagai penanda kenaikan tingkat.*

---

## 🏆 8. Kondisi Kemenangan (Victory Condition)

*   Pemain dinyatakan menang jika berhasil mendarat **tepat pada petak ke-100**.
*   **Aturan Pantulan Dadu:** Jika lemparan dadu melebihi batas petak 100, bidak pemain akan meluncur hingga 100 lalu memantul melangkah mundur sisa langkahnya secara asinkron.
*   Saat ada salah satu pemain mencapai petak 100, permainan dihentikan, lagu **Hymne IPB** diputar, dan layar menampilkan selebrasi kembang api partikel meriah menyambut wisuda Duta IPB.
