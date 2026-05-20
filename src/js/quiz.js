/* ==========================================================================
   QUIZ BANK & MODAL LOGIC (TATA TERTIB IPB)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

class QuizManager {
    constructor() {
        this.questions = [
            {
                id: 1,
                question: "Menurut Peraturan Akademik IPB, apakah mahasiswa diperbolehkan memakai kaos oblong tidak berkerah dan sandal jepit saat mengikuti Ujian Tengah Semester (UTS)?",
                options: [
                    { key: "A", text: "Ya, diperbolehkan asal sopan dan bersih." },
                    { key: "B", text: "Tidak diperbolehkan, wajib mengenakan kemeja berkerah, pakaian rapi, dan sepatu tertutup." }
                ],
                correctAnswer: "B",
                explanation: {
                    correct: "Hebat! Pemahaman tata tertib pakaian ujian Anda luar biasa! Anda berhak maju 2 petak.",
                    wrong: "Salah! Pengawas ujian meminta Anda keluar ruangan. Anda harus pulang untuk mengganti pakaian. Mundur 2 petak!"
                },
                penalty: -2,
                reward: 2
            },
            {
                id: 2,
                question: "Berapakah batas waktu maksimal masa studi reguler untuk program Sarjana (S1) di IPB University sebelum mahasiswa dinyatakan Drop Out?",
                options: [
                    { key: "A", text: "10 Semester (5 Tahun)" },
                    { key: "B", text: "14 Semester (7 Tahun)" }
                ],
                correctAnswer: "B",
                explanation: {
                    correct: "Tepat sekali! Batas waktu maksimal studi S1 reguler di IPB adalah 14 semester. Anda berhak maju 1 petak.",
                    wrong: "Salah! Masa studi reguler maksimal S1 adalah 14 semester. Anda mendapat surat peringatan akademik dan mundur 1 petak."
                },
                penalty: -1,
                reward: 1
            },
            {
                id: 3,
                question: "Apakah nama resmi dari masa persiapan bagi mahasiswa baru pada tahun pertama di IPB University saat ini?",
                options: [
                    { key: "A", text: "Program Pendidikan Kompetensi Umum (PPKU)" },
                    { key: "B", text: "Tingkat Persiapan Bersama (TPB)" }
                ],
                correctAnswer: "A",
                explanation: {
                    correct: "Tepat sekali! PPKU merupakan nama resmi masa persiapan tahun pertama. Anda berhak maju 1 petak.",
                    wrong: "Salah! TPB adalah sebutan lama, nama resminya sekarang adalah PPKU. Mundur 1 petak."
                },
                penalty: -1,
                reward: 1
            },
            {
                id: 4,
                question: "Di manakah mahasiswa dilarang keras mengendarai sepeda motor dengan kecepatan tinggi di lingkungan kampus Dramaga?",
                options: [
                    { key: "A", text: "Di seluruh area kampus, batas kecepatan maksimal adalah 30 km/jam demi keselamatan bersama." },
                    { key: "B", text: "Hanya di jalan raya utama depan Gedung Rektorat Andi Hakim Nasoetion." }
                ],
                correctAnswer: "A",
                explanation: {
                    correct: "Bagus! Anda berkendara dengan aman dan menghormati pejalan kaki. Anda berhak maju 2 petak.",
                    wrong: "Bahaya! Anda dihentikan oleh Unit Keamanan Kampus (UKK) karena ngebut. Anda kena tilang kampus dan mundur 2 petak!"
                },
                penalty: -2,
                reward: 2
            },
            {
                id: 5,
                question: "Tindakan manakah yang dikategorikan sebagai plagiarisme saat Anda menyusun Laporan Praktikum atau Skripsi di IPB?",
                options: [
                    { key: "A", text: "Mengutip paragraf orang lain dengan mencantumkan sumber rujukan secara lengkap dan jujur." },
                    { key: "B", text: "Menyalin mentah-mentah hasil laporan praktikum teman tanpa izin dan mengakuinya sebagai karya pribadi." }
                ],
                correctAnswer: "B",
                explanation: {
                    correct: "Luar biasa! Kejujuran akademik adalah prinsip utama mahasiswa IPB. Anda berhak maju 3 petak!",
                    wrong: "Gawat! Laporan praktikum Anda diberi nilai E karena plagiarisme. Anda mendapat hukuman akademik mundur 3 petak."
                },
                penalty: -3,
                reward: 3
            },
            {
                id: 6,
                question: "Manakah perilaku berikut yang dilarang keras saat Anda berada di dalam Perpustakaan LSI (Lembaga Sumberdaya Informasi) IPB?",
                options: [
                    { key: "A", text: "Membawa makanan berat berbau menyengat, minuman gelas terbuka, dan mengobrol dengan suara keras." },
                    { key: "B", text: "Membaca e-journal di laptop menggunakan Wi-Fi IPB secara tenang dan tertib." }
                ],
                correctAnswer: "A",
                explanation: {
                    correct: "Tepat! Menjaga kenyamanan dan ketenangan perpustakaan membantu proses belajar bersama. Maju 1 petak.",
                    wrong: "Ditegur! Petugas LSI menegur Anda karena menumpahkan mie ayam di meja buku. Silakan keluar dan mundur 1 petak."
                },
                penalty: -1,
                reward: 1
            }
        ];
    }

    /**
     * Mengambil satu pertanyaan secara acak dari database
     */
    getRandomQuestion() {
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        return this.questions[randomIndex];
    }
}

export const quizManager = new QuizManager();
export { QuizManager };
