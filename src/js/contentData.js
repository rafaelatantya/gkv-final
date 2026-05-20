/* ==========================================================================
   GAME TEXT CONTENT DATABASE (MODULAR DATA)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

export const contentData = {
    // 6 Tingkatan Alasan Petak Biasa (Normal Tiles)
    normalTiles: {
        1: [ // Level 1: Petak 1 - 25 (Masa PPKU)
            "Kamu memungut bungkus cilok yang berserakan di depan GWW dan membuangnya ke tempat sampah. Langkah kecil menuju kampus bersih!",
            "Kamu datang 15 menit lebih awal saat kuliah Fisika Dasar di CCR. Kedisiplinan adalah awal kesuksesan!",
            "Kamu membagikan rangkuman materi kalkulus ke teman sekamar asrama yang sedang kebingungan menghadapi kuis.",
            "Kamu tertib mengantre saat naik bus kampus (Shuttle Bus IPB) di halte koridor PPKU.",
            "Kamu mematikan kran air yang bocor di toilet umum gedung perkuliahan CCR."
        ],
        2: [ // Level 2: Petak 26 - 50 (Fase Departemen)
            "Kamu secara sukarela membantu kating mengangkut peralatan praktikum tanah dari LSI ke Fakultas Pertanian. Dapat koneksi baru!",
            "Kamu aktif berdiskusi dalam kelompok belajar departemen tanpa membedakan latar belakang rekan kuliah.",
            "Kamu tertib menggunakan name tag dan kemeja rapi saat praktikum perdana di laboratorium departemen.",
            "Kamu mengembalikan kunci ruang himpunan tepat waktu setelah mengadakan rapat kerja divisi.",
            "Kamu memilah sampah organik dan anorganik saat makan siang di kantin Stekpi."
        ],
        3: [ // Level 3: Petak 51 - 75 (Kuliah Keahlian)
            "Kamu menemukan dompet penuh uang milik dosen yang tertinggal di kantin Stekpi, lalu segera mengembalikannya secara utuh lewat pihak keamanan. Kejujuran dihargai!",
            "Kamu memimpin proyek kelompok untuk membuat aplikasi visualisasi data yang dipuji oleh dosen pengampu.",
            "Kamu mendampingi adik tingkat yang mengalami kesulitan adaptasi akademik di lingkungan departemen.",
            "Kamu menjadi relawan dalam kegiatan seminar internasional yang diselenggarakan oleh fakultas.",
            "Kamu berhasil mengamankan sertifikasi kompetensi keahlian dasar tingkat nasional."
        ],
        4: [ // Level 4: Petak 76 - 99 (Fase Skripsi & Akhir)
            "Kamu menjadi asisten praktikum (asprak) sukarela untuk membantu adik tingkat yang kesulitan memahami materi pengkodean grafika komputer. Inspiratif!",
            "Kamu menyelesaikan bab analisis data penelitian skripsi lebih cepat berkat kegigihanmu berkonsultasi di perpustakaan LSI.",
            "Kamu mendonasikan buku-buku referensi kuliah bekasmu ke taman bacaan lingkar kampus Dramaga.",
            "Kamu membantu menyunting abstrak penelitian rekan kuliah agar siap dipresentasikan di seminar departemen.",
            "Kamu berhasil menyusun draf publikasi jurnal dengan format rujukan ilmiah yang sangat tertib dan akurat."
        ]
    },

    // Petak Tangga (Prestasi Akademik / Non-Akademik)
    ladders: {
        3: "Hebat! Kamu meraih Juara 1 Lomba Debat antar Departemen di tingkat Fakultas. Bakat public speaking-mu diakui oleh para dosen! (Naik 1 Baris)",
        15: "Inspiratif! Proposal proyek pengabdian sosialmu lolos pendanaan BEM Fakultas. Kamu mulai menggerakkan perubahan nyata di desa lingkar kampus! (Naik 2 Baris)",
        28: "Luar Biasa! Laporan praktikum biologi milikmu terpilih sebagai laporan terbaik mingguan karena ulasan analisis yang sangat tajam dan rapi. (Naik 2 Baris)",
        38: "Prestasi Hebat! Karya tulis ilmiahmu tentang inovasi pertanian presisi memenangkan Juara 1 Tingkat Nasional. Kerja kerasmu di laboratorium membuahkan hasil! (Naik 2 Baris)",
        50: "Membanggakan! Kamu terpilih sebagai delegasi IPB University dalam konferensi pemuda PBB seputar ketahanan pangan global di luar negeri. (Naik 3 Baris)",
        65: "Luar Biasa! Proposal Program Kreativitas Mahasiswa (PKM) milikmu lolos pendanaan Direktorat Belmawa Kemendikbud. Selangkah menuju PIMNAS! (Naik 3 Baris)"
    },

    // Petak Ular (Pelanggaran Tata Tertib Ringan-Sedang)
    snakes: {
        17: "Pelanggaran Ringan! Anda memarkir motor sembarangan di luar kantin Stekpi dan menghalangi jalan bus kampus. Anda ditegur UKK! (Mundur 1 baris)",
        34: "Pelanggaran Ringan! Anda membuang botol plastik sembarangan di koridor Fakultas Ekologi Manusia. Jagalah kebersihan kampus hijau IPB! (Mundur 2 baris)",
        54: "Pelanggaran Sedang! Anda menginjak-injak tanaman obat langka di Kebun Botani IPB saat berfoto selfie demi konten sosial media. (Mundur 2 baris)",
        73: "Pelanggaran Sedang! Anda menimbun buku referensi wajib perpustakaan LSI selama 2 bulan tanpa pengembalian, menghambat mahasiswa lain yang ingin belajar. (Mundur 2 baris)",
        84: "Pelanggaran Berat! Anda terbukti memalsukan tanda tangan dosen wali pada kartu rencana studi (KRS) untuk memanipulasi jumlah SKS. (Mundur 4 baris)",
        98: "Pelanggaran Berat! Anda bertindak ceroboh di Laboratorium Kimia karena bercanda, memecahkan alat spektrofotometer mahal, dan mencoba menyembunyikannya. (Mundur 4 baris)"
    },

    // Petak Tengkorak (Pelanggaran Berat / Fatal - Skorsing & DO Warning)
    skulls: {
        26: "Pelanggaran Berat Akademis! Anda terbukti menyalahgunakan obat-obatan terlarang (narkoba) di lingkungan asrama IPB. Tindakan ini melanggar hukum negara dan tata tertib kampus!",
        58: "Pelanggaran Berat Akademis! Anda tertangkap basah bertindak sebagai joki ujian akhir semester (UAS) untuk rekan mahasiswa lain secara terorganisir.",
        72: "Pelanggaran Berat Akademis! Anda terbukti membawa senjata tajam dan memprovokasi tawuran antar fakultas di area parkir GWW."
    }
};
