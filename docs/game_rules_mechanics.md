# Panduan Mekanika dan Aturan Permainan
### Proyek: Ular Tangga Tata Tertib IPB University

Dokumen ini menjabarkan seluruh aturan main, mekanika interaktif, formula dadu, sanksi skorsing/Drop Out, serta detail teknis yang mengatur jalannya permainan **Ular Tangga Tata Tertib IPB University**.

---

## 📖 1. Mekanisme Prolog (Narrative Opener)

Ketika permainan dimulai untuk pertama kali:
*   Sebelum masuk ke papan permainan, seluruh pemain akan disajikan jendela narasi pembuka (**Prologue Screen**).
*   Narasi menceritakan kisah perjalanan "Mahasiswa Bermasalah" (gaya punk, rambut acak-acakan) yang masuk ke IPB University dan menyadari pentingnya menaati tata tertib kehidupan kampus demi mencapai kelulusan yang membanggakan (menjadi Duta IPB).
*   Prolog disajikan dalam format dialog bergambar (visual novel gaya sederhana) dengan tombol *Next* untuk melanjutkan cerita. Setelah dialog selesai, barulah papan permainan utama dirender dan petak dimulai dari **Petak 0** (titik persiapan pra-kuliah).

---

## 🎲 2. Sistem Dadu Interaktif (Dice Gauge System)

Untuk menghilangkan kelemahan utama ular tangga klasik yang murni mengandalkan keberuntungan acak (RNG), game ini mengadaptasi **Sistem Dice Gauge** (pengukur daya lemparan) yang terinspirasi dari game *LINE: Let's Get Rich!*.

### 🕹️ Cara Kerja Dice Gauge
1.  Pemain menahan tombol **"ROLL"** (*Mouse Down* atau *Touch Start*).
2.  Sebuah bar meteran pengisian daya (*charge bar*) di layar akan terisi secara dinamis dari **0% hingga 100%** dengan animasi berdenyut bolak-balik (0% -> 100% -> 0%).
3.  Pemain harus melepas tombol **"ROLL"** (*Mouse Up* atau *Touch End*) pada saat meteran berada di persentase target untuk membidik angka dadu tertentu.
4.  Dadu yang digunakan adalah **2 buah dadu** (angka minimum 2, maksimum 12).

### 📐 Logika Kondisional Penguncian Angka Dadu
Logika penguncian angka dadu dihitung secara matematis berdasarkan tingkat persentase pengisian daya (`chargePercent`):

| Tingkat (Level) Daya | Batas Persentase | Rentang Target Angka Dadu | Status Mahasiswa | Filosofi Mekanika |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1** | `0% <= chargePercent <= 25%` | `[2, 3]` | Status Percobaan | Kurang usaha, fokus minimal. Peluang maju sangat kecil. |
| **Level 2** | `25% < chargePercent <= 50%` | `[4, 5, 6]` | Mahasiswa Reguler | Usaha sedang. Langkah perkuliahan stabil dan aman. |
| **Level 3** | `50% < chargePercent <= 75%` | `[7, 8, 9]` | Mahasiswa Teladan | Usaha optimal. Berpeluang besar melompat ke petak prestasi. |
| **Level 4** | `75% < chargePercent <= 100%` | `[10, 11, 12]` | Duta Tata Tertib | Usaha maksimal & ketepatan tinggi. Melangkah sangat jauh. |

### 🎲 Kode Logika Pemilihan Angka (Pseudo-code)
```javascript
function calculateDiceValue(chargePercent) {
    let targetRange = [];
    
    if (chargePercent <= 25) {
        targetRange = [2, 3];
    } else if (chargePercent <= 50) {
        targetRange = [4, 5, 6];
    } else if (chargePercent <= 75) {
        targetRange = [7, 8, 9];
    } else {
        targetRange = [10, 11, 12];
    }
    
    // Pilih angka secara acak dari rentang target untuk variasi dadu yang realistis
    const randomIndex = Math.floor(Math.random() * targetRange.length);
    return targetRange[randomIndex];
}
```

---

## 🤖 3. Aturan Giliran dan AI Bot

### 👥 Multipemain Lokal (Turn-based Local Multiplayer)
*   Mendukung pertarungan **2 hingga 4 pemain nyata** yang bermain di satu perangkat yang sama secara bergantian.
*   Nama pemain dapat dikustomisasi di awal permainan.

### ⏱️ Pelemparan Otomatis (Auto Roll Timer)
*   Terdapat batas waktu tunggu (**Timer**) selama **10 detik** per giliran aktif pemain.
*   Jika pemain tidak melakukan aksi (menahan tombol ROLL) hingga batas waktu habis, sistem secara otomatis akan menggulirkan dadu dengan nilai daya acak (*Auto Roll*), memastikan permainan tidak terhenti jika pemain tidak aktif.

### 🤖 Mekanisme Bot AI (Computer Players)
*   Jika slot pemain tidak terpenuhi oleh pemain nyata (misalnya memilih mode 1 Player), slot kosong akan otomatis diisi oleh **AI Bot**.
*   **Perilaku AI Bot:**
    *   Ketika giliran Bot aktif, sistem akan memberikan jeda realistis selama **1.5 detik** untuk mensimulasikan waktu berpikir.
    *   Bot akan melakukan pengisian dadu secara acak (memilih target level daya secara otomatis dengan simulasi menahan tombol selama sekian milidetik).
    *   Bidak Bot bergerak dan berinteraksi dengan petak layaknya pemain manusia asli.

---

## 💀 4. Spesifikasi dan Fungsi Petak Khusus

Papan permainan ular tangga ini memiliki 100 petak dengan rincian kategori petak sebagai berikut:

### A. Petak Biasa (Normal Tiles) - Jumlah Poin
Ketika pemain mendarat di petak ini, sistem menampilkan pop-up informasi mengenai aktivitas mahasiswa sehari-hari. Format pesan terstruktur: 
`"Selamat, Anda telah mendapatkan [jumlah dadu] poin dikarenakan [alasan]."`
*   Poin yang dimaksud adalah jumlah langkah maju tambahan/normal dari dadu.
*   Alasan disesuaikan secara dinamis berdasarkan 6 level posisi petak pemain saat itu.

### B. Petak Tanda Tanya (Quiz Tiles) - 6 Petak
*   **Posisi:** Tersebar secara strategis di papan (misal: petak 7, 20, 33, 46, 77, 86).
*   **Fungsi:** Memicu pop-up kuis tata tertib kampus.
*   **Aturan Kuis:**
    *   Pemain diberikan pertanyaan pilihan ganda terkait peraturan tata tertib kehidupan kampus di IPB.
    *   **Jika Jawaban Benar:** Pemain mendapatkan penghargaan (misal: melangkah maju 2 petak ekstra) atau tetap aman di posisi tersebut.
    *   **Jika Jawaban Salah:** Pemain mendapat sanksi (misal: mundur 2 petak).
    *   Bank soal kuis ditambahkan secara statis (telah ditentukan) untuk mencegah galat logis (misalnya pemain terpental ke petak tengkorak sesaat setelah menjawab benar).

### C. Petak Tengkorak (Sanction Tiles) - 3 Petak
Merepresentasikan pelanggaran akademis fatal atau sanksi berat (skorsing).
*   **Posisi:** Ditempatkan di area kritis papan (misal: petak 26, 58, 72).
*   **Aturan Penalti:**
    1.  **Skip Turn (Skorsing):** Hak melangkah pemain dibekukan selama 1 kali putaran jalannya permainan (giliran berikutnya akan dilewati).
    2.  **Mundur 4 Baris:** Pemain diturunkan sebanyak 4 baris ke bawah (mundur 40 petak). Jika posisi saat ini kurang dari 40, pemain kembali ke petak 0.
    3.  **Animasi Ledakan:** Layar akan memunculkan efek visual getaran dan animasi bom ledakan.
    4.  **Drop Out (Kekalahan Mutlak):** Jika seorang pemain mendarat di petak tengkorak ini sebanyak **3 kali secara akumulatif**, pemain tersebut dinyatakan kalah langsung (**Drop Out / DO**) dan dikeluarkan dari permainan.

---

## 🪜 5. Rintangan dan Akselerasi (Ular & Tangga)

Elemen klasik Ular dan Tangga dimodifikasi untuk mencerminkan dinamika akademik semester:

*   **Tangga (Ladders) - Akselerasi:** Melambangkan pencapaian akademik/organisasi yang luar biasa. Memiliki 3 tingkatan elevasi:
    *   **Tangga Pendek:** Menaikkan pemain **1 baris** ke atas (+10 petak).
    *   **Tangga Sedang:** Menaikkan pemain **2 baris** ke atas (+20 petak).
    *   **Tangga Panjang:** Menaikkan pemain **3 baris** ke atas (+30 petak).
*   **Ular (Snakes) - Rintangan:** Melambangkan hambatan studi dan pelanggaran tata tertib sedang. Memiliki 3 tingkatan penurunan:
    *   **Ular Pendek:** Menurunkan pemain **1 baris** ke bawah (-10 petak).
    *   **Ular Sedang:** Menurunkan pemain **2 baris** ke bawah (-20 petak).
    *   **Ular Panjang:** Menurunkan pemain **4 baris** ke bawah (-40 petak).

---

## 🧍 6. Sistem Evolusi Karakter (Real-time Evolution)

Bidak pemain bukan berupa keping lingkaran biasa, melainkan visual karakter mahasiswa yang ber-evolusi secara langsung (*real-time*) sesuai dengan progres poin/posisi petak mereka:

```
[Punk Style] ──(Petak 26)──> [Messy Casual] ──(Petak 51)──> [T-Shirt Tidy] ──(Petak 76)──> [Full Formal Shirt] ──(Petak 100)──> [Duta IPB]
```

### 📈 Rincian Tahapan Evolusi:
1.  **Tingkat 1 (Petak 0 - 25) - Gaya Punk:** Mahasiswa baru yang belum beradaptasi dengan budaya tertib kampus. Visual rambut acak-acakan berwana cerah, jaket penuh patch/pin berantakan, celana robek.
2.  **Tingkat 2 (Petak 26 - 50) - Gaya Kasual Berantakan:** Mulai menyadari aturan, tetapi masih malas. Rambut mulai disisir rapi, memakai kemeja tetapi tidak dikancingkan sempurna/dikeluarkan, celana jeans longgar.
3.  **Tingkat 3 (Petak 51 - 75) - Gaya Rapi Santai:** Mulai menjadi mahasiswa teladan. Memakai kaos oblong berkerah yang bersih, rambut rapi, sepatu kasual bersih.
4.  **Tingkat 4 (Petak 76 - 99) - Gaya Rapi Formal:** Mahasiswa tingkat akhir yang siap lulus. Memakai kemeja berkerah rapi yang dimasukkan ke celana bahan, memakai sabuk, sepatu formal.
5.  **Tingkat 5 (Petak 100) - Duta IPB University:** Pemenang mutlak! Memakai setelan kemeja rapi penuh, lengkap dengan dasi, jas almamater kebanggaan IPB berwarna biru tua, serta selempang emas bertuliskan **"Duta IPB"**.

### 🌟 Jumlah Aset Sprite Karakter (17 Variasi Sprite)
Sistem mengalokasikan 4 jenis variasi visual dasar (warna dasar rambut/pakaian berbeda) untuk 4 pemain:
*   **Pemain 1 - 4:** Masing-masing memiliki 4 tingkat evolusi (4 pemain x 4 tingkat = 16 sprite).
*   **Sprite Pemenang Khusus:** 1 sprite berukuran besar dengan pose kemenangan memegang piala/selempang Duta IPB (1 sprite).
*   **Total Keseluruhan:** **17 file variasi sprite**.

---

## 🏆 7. Kondisi Kemenangan (Victory Condition)

*   Pemain dinyatakan menang secara mutlak jika berhasil mendarat **tepat pada petak ke-100**.
*   **Aturan Pantulan Dadu:** Jika lemparan dadu melebihi batas petak 100, bidak pemain akan memantul mundur sisa langkahnya. Contoh: Jika pemain berada di petak 98 dan mendapatkan angka dadu 5:
    *   Maju 2 langkah ke petak 100.
    *   Memantul mundur 3 langkah sisa ke petak 97.
*   Saat ada salah satu pemain mencapai petak 100, permainan dihentikan, lagu kemenangan diputar, dan layar menampilkan papan peringkat akhir dengan animasi selebrasi yang meriah.
