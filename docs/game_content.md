# Dokumen Bank Data dan Konten Permainan
### Proyek: Ular Tangga Tata Tertib IPB University

Dokumen ini memuat seluruh data tekstual statis yang akan diintegrasikan ke dalam game. Konten ini dirancang khusus berdasarkan peraturan resmi **Buku Saku Tata Tertib Kehidupan Mahasiswa IPB University** dan dinamika riil perkuliahan.

---

## ❓ 1. Bank Soal Kuis (Quiz Tiles - Petak Tanda Tanya)

Berikut adalah daftar pertanyaan pilihan ganda (statis) yang akan muncul secara acak ketika pemain mendarat di **Petak Tanda Tanya (?)**.

### Soal 1: Penggunaan Busana UTS/UAS
*   **Pertanyaan:** "Menurut Peraturan Akademik IPB, apakah mahasiswa diperbolehkan memakai kaos oblong tidak berkerah dan sandal jepit saat mengikuti Ujian Tengah Semester (UTS)?"
*   **Pilihan Jawaban:**
    *   A. Ya, diperbolehkan asal sopan.
    *   B. Tidak diperbolehkan, wajib mengenakan pakaian berkerah, rapi, dan sepatu tertutup.
*   **Jawaban Benar:** **B**
*   **Dampak Mekanik:**
    *   *Benar:* Maju 2 petak ("Hebat! Pemahaman tata tertib pakaian ujian Anda luar biasa!")
    *   *Salah:* Mundur 2 petak ("Sanksi! Pengawas ujian meminta Anda keluar ruangan. Anda harus mengganti pakaian!")

### Soal 2: Masa Studi S1
*   **Pertanyaan:** "Berapa batas waktu maksimal masa studi reguler untuk program Sarjana (S1) di IPB University sebelum dinyatakan Drop Out?"
*   **Pilihan Jawaban:**
    *   A. 10 Semester (5 Tahun)
    *   B. 14 Semester (7 Tahun)
*   **Jawaban Benar:** **B**
*   **Dampak Mekanik:**
    *   *Benar:* Maju 1 petak ("Benar! Batas waktu maksimal studi S1 adalah 14 semester.")
    *   *Salah:* Mundur 1 petak ("Salah! Anda terancam DO karena tidak memperhatikan batas masa studi.")

### Soal 3: Masa Persiapan Bersama
*   **Pertanyaan:** "Apa nama resmi dari masa persiapan bagi mahasiswa baru pada tahun pertama di IPB University saat ini?"
*   **Pilihan Jawaban:**
    *   A. Program Pendidikan Kompetensi Umum (PPKU)
    *   B. Tingkat Persiapan Bersama (TPB)
*   **Jawaban Benar:** **A**
*   **Dampak Mekanik:**
    *   *Benar:* Maju 1 petak ("Tepat sekali! PPKU merupakan gerbang awal mahasiswa baru IPB.")
    *   *Salah:* Mundur 1 petak ("Salah! TPB adalah nama lama, sekarang bernama PPKU.")

### Soal 4: Etika Berkendara di Kampus
*   **Pertanyaan:** "Di area manakah mahasiswa dilarang keras mengendarai sepeda motor dengan kecepatan tinggi di lingkungan kampus Dramaga?"
*   **Pilihan Jawaban:**
    *   A. Di seluruh area kampus, batas kecepatan maksimal adalah 30 km/jam demi keselamatan pejalan kaki.
    *   B. Hanya di depan gedung rektorat (Andi Hakim Nasoetion).
*   **Jawaban Benar:** **A**
*   **Dampak Mekanik:**
    *   *Benar:* Maju 2 petak ("Bagus! Anda berkendara dengan aman dan menghargai pejalan kaki.")
    *   *Salah:* Mundur 2 petak ("Bahaya! Anda ditilang oleh UKK (Unit Keamanan Kampus) karena mengebut!")

### Soal 5: Integritas Akademik
*   **Pertanyaan:** "Apa tindakan yang dikategorikan sebagai plagiarisme saat menyusun Laporan Praktikum atau Skripsi di IPB?"
*   **Pilihan Jawaban:**
    *   A. Mengutip tulisan orang lain dengan mencantumkan sumber referensi secara lengkap dan jelas.
    *   B. Menyalin mentah-mentah hasil karya orang lain atau teman seangkatan tanpa mencantumkan referensi dan mengklaimnya sebagai milik sendiri.
*   **Jawaban Benar:** **B**
*   **Dampak Mekanik:**
    *   *Benar:* Maju 3 petak ("Luar biasa! Kejujuran akademik adalah prinsip utama mahasiswa IPB.")
    *   *Salah:* Mundur 3 petak ("Plagiarisme! Laporan praktikum Anda diberi nilai E oleh dosen pengampu!")

### Soal 6: Larangan di Perpustakaan LSI
*   **Pertanyaan:** "Manakah dari perilaku berikut yang **dilarang keras** saat Anda berada di dalam ruang baca Perpustakaan LSI (Lembaga Sumberdaya Informasi)?"
*   **Pilihan Jawaban:**
    *   A. Membawa makanan berat, minuman bergelas tanpa tutup, dan membuat kegaduhan.
    *   B. Membaca e-book di laptop menggunakan koneksi Wi-Fi IPB secara tenang.
*   **Jawaban Benar:** **A**
*   **Dampak Mekanik:**
    *   *Benar:* Maju 1 petak ("Tepat! Menjaga ketenangan perpustakaan membantu kenyamanan belajar bersama.")
    *   *Salah:* Mundur 1 petak ("Ditegur! Petugas perpustakaan menyita makanan Anda karena mengotori area buku.")

---

## 🐍 2. Konten Petak Ular (Rintangan Pelanggaran Sedang-Ringan)

Ketika pemain mendarat di petak yang terhubung dengan kepala ular, sistem menampilkan jendela peringatan pelanggaran tata tertib dan memicu animasi turun baris.

### 🟢 Ular Pendek (Turun 1 Baris / 10 Petak) - Pelanggaran Ringan
1.  **Kasus Parkir Liar:**
    *   *Teks:* "Pelanggaran Ringan! Anda memarkir motor sembarangan di luar kantin Stekpi dan menghalangi jalan bus kampus. Anda ditegur UKK! (Mundur 1 baris)"
2.  **Kasus Sampah Plastik:**
    *   *Teks:* "Pelanggaran Ringan! Anda membuang botol plastik sembarangan di koridor Fakultas Ekologi Manusia. Jagalah kebersihan kampus hijau IPB! (Mundur 1 baris)"
3.  **Kasus Merokok Sembarangan:**
    *   *Teks:* "Pelanggaran Ringan! Anda merokok di area bebas rokok Fakultas Matematika dan Ilmu Pengetahuan Alam (FMIPA). Patuhi kawasan bebas rokok! (Mundur 1 baris)"

### 🟡 Ular Sedang (Turun 2 Baris / 20 Petak) - Pelanggaran Sedang
1.  **Perusakan Tanaman Langka:**
    *   *Teks:* "Pelanggaran Sedang! Anda menginjak-injak tanaman obat langka di Kebun Botani IPB saat berfoto selfi demi konten. (Mundur 2 baris)"
2.  **Keterlambatan Pengembalian Buku:**
    *   *Teks:* "Pelanggaran Sedang! Anda menimbun buku referensi wajib perpustakaan LSI selama 2 bulan tanpa pengembalian, menghambat mahasiswa lain yang ingin belajar. (Mundur 2 baris)"
3.  **Keributan di Asrama PPKU:**
    *   *Teks:* "Pelanggaran Sedang! Anda membuat kegaduhan di lorong Asrama PPKU setelah jam malam (pukul 22.00 WIB) sehingga mengganggu istirahat rekan sekamar. (Mundur 2 baris)"

### 🔴 Ular Panjang (Turun 4 Baris / 40 Petak) - Pelanggaran Berat
1.  **Pemalsuan Tanda Tangan:**
    *   *Teks:* "Pelanggaran Berat! Anda terbukti memalsukan tanda tangan dosen wali pada kartu rencana studi (KRS) untuk memanipulasi jumlah SKS. (Mundur 4 baris)"
2.  **Kerusakan Fasilitas Laboratorium:**
    *   *Teks:* "Pelanggaran Berat! Anda bertindak ceroboh di Laboratorium Kimia karena bercanda, memecahkan alat spektrofotometer mahal, dan mencoba menyembunyikannya. (Mundur 4 baris)"
3.  **Vandalisme Kampus:**
    *   *Teks:* "Pelanggaran Berat! Anda mencorat-coret dinding gedung kuliah umum Common Class Room (CCR) dengan pilox bertuliskan logo angkatan secara liar. (Mundur 4 baris)"

---

## 🪜 3. Konten Petak Tangga (Pencapaian & Prestasi Akademik)

Ketika pemain mendarat di petak kaki tangga, sistem menampilkan pop-up apresiasi dan menggeser bidak naik baris.

### 🟢 Tangga Pendek (Naik 1 Baris / 10 Petak)
1.  **Duta Public Speaking:**
    *   *Teks:* "Hebat! Kamu meraih Juara 1 Lomba Debat antar Departemen di tingkat Fakultas. Bakat public speaking-mu diakui oleh para dosen! (Naik 1 Baris)"
2.  **Pengembangan Sosial:**
    *   *Teks:* "Inspiratif! Proposal proyek pengabdian sosialmu lolos pendanaan BEM Fakultas. Kamu mulai menggerakkan perubahan nyata di desa lingkar kampus! (Naik 1 Baris)"
3.  **Praktikan Teladan:**
    *   *Teks:* "Luar Biasa! Laporan praktikum biologi milikmu terpilih sebagai laporan terbaik mingguan karena ulasan analisis yang sangat tajam dan rapi. (Naik 1 Baris)"

### 🟡 Tangga Sedang (Naik 2 Baris / 20 Petak)
1.  **Juara Karya Tulis Ilmiah:**
    *   *Teks:* "Prestasi Hebat! Karya tulis ilmiahmu tentang inovasi pertanian presisi memenangkan Juara 1 Tingkat Nasional. Kerja kerasmu di laboratorium membuahkan hasil! (Naik 2 Baris)"
2.  **Delegasi Internasional:**
    *   *Teks:* "Membanggakan! Kamu terpilih sebagai delegasi IPB University dalam konferensi pemuda PBB seputar ketahanan pangan global di luar negeri. (Naik 2 Baris)"
3.  **Lolos Pendanaan PKM:**
    *   *Teks:* "Luar Biasa! Proposal Program Kreativitas Mahasiswa (PKM) milikmu lolos pendanaan Direktorat Belmawa Kemendikbud. Selangkah menuju PIMNAS! (Naik 2 Baris)"

### 🔴 Tangga Panjang (Naik 3 Baris / 30 Petak)
1.  **Magang di Perusahaan Global:**
    *   *Teks:* "Pencapaian Emas! Berkat IPK tinggi dan keaktifan organisasi, kamu berhasil diterima magang di perusahaan teknologi multinasional bergengsi. (Naik 3 Baris)"
2.  **Juara PIMNAS (Medali Emas):**
    *   *Teks:* "Sejarah Terukir! Tim PKM-mu berhasil meraih Medali Emas di ajang PIMNAS (Pekan Ilmiah Mahasiswa Nasional). Nama IPB University harum berkat kontribusimu! (Naik 3 Baris)"
3.  **Mahasiswa Berprestasi (Mapres):**
    *   *Teks:* "Puncak Prestasi! Kamu dinobatkan sebagai Mahasiswa Berprestasi Utama IPB University setelah melewati seleksi ketat portofolio dan bahasa asing. (Naik 3 Baris)"

---

## 💀 4. Konten Petak Tengkorak (Sanksi Skorsing / Drop Out)

Petak Tengkorak merepresentasikan pelanggaran hukum/peraturan akademis tingkat fatal. Landasan hukum didasarkan pada Buku Tata Tertib Kehidupan Mahasiswa IPB.

1.  **Pelanggaran Hukum Fatal (Narkoba):**
    *   *Teks:* "Pelanggaran Berat Akademis! Anda terbukti mengedarkan atau menyalahgunakan narkoba di lingkungan asrama IPB. Tindakan ini melanggar hukum negara dan tata tertib kampus!"
    *   *Penalti:* Diturunkan 4 baris, disuspensi (skip 1 giliran), dan mendapat +1 akumulasi pelanggaran DO.
2.  **Kecurangan Akademik Massal (Perjokian):**
    *   *Teks:* "Pelanggaran Berat Akademis! Anda tertangkap basah bertindak sebagai joki ujian akhir semester (UAS) untuk rekan mahasiswa lain secara terorganisir."
    *   *Penalti:* Diturunkan 4 baris, disuspensi (skip 1 giliran), dan mendapat +1 akumulasi pelanggaran DO.
3.  **Tawuran dan Senjata Tajam:**
    *   *Teks:* "Pelanggaran Berat Akademis! Anda terbukti membawa senjata tajam dan memprovokasi tawuran antar fakultas di area parkir GWW."
    *   *Penalti:* Diturunkan 4 baris, disuspensi (skip 1 giliran), dan mendapat +1 akumulasi pelanggaran DO.

> [!WARNING]
> **Kondisi Drop Out:** Jika pemain mendarat di petak tengkorak sebanyak **3 kali**, layar akan berubah menjadi merah penuh dan menampilkan surat keputusan Rektor: **"DROP OUT! Anda secara resmi diberhentikan dari IPB University karena pelanggaran tata tertib berat berulang."** Pemain tersebut gugur dari permainan.

---

## 🚶 5. Konten Petak Biasa (Perilaku Positif Kecil Mahasiswa)

Ketika pemain mendarat di petak normal, sistem menampilkan popup apresiasi perilaku harian dengan format reward berupa poin tambahan dari dadu:

*   **Petak Level 1 (Fase PPKU - Petak 1-25):**
    *   *Aksi:* "Kamu memungut bungkus cilok yang berserakan di depan GWW dan membuangnya ke tempat sampah. Langkah kecil menuju kampus bersih!"
    *   *Poin:* +1 langkah dadu.
*   **Petak Level 2 (Fase Pemilihan Departemen - Petak 26-50):**
    *   *Aksi:* "Kamu secara sukarela membantu kating (kakak tingkat) mengangkut peralatan praktikum tanah dari LSI ke Fakultas Pertanian. Dapat koneksi baru!"
    *   *Poin:* +2 langkah dadu.
*   **Petak Level 3 (Fase Kuliah Keahlian - Petak 51-75):**
    *   *Aksi:* "Kamu menemukan dompet penuh uang milik dosen yang tertinggal di kantin Stekpi, lalu segera mengembalikannya secara utuh lewat pihak keamanan. Kejujuran dihargai!"
    *   *Poin:* +3 langkah dadu.
*   **Petak Level 4 (Fase Skripsi & Kelulusan - Petak 76-99):**
    *   *Aksi:* "Kamu menjadi asisten praktikum (asprak) sukarela untuk membantu adik tingkat yang kesulitan memahami materi pengkodean grafika komputer. Inspiratif!"
    *   *Poin:* +4 langkah dadu.
