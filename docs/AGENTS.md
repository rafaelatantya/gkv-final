# Panduan untuk AI Agent (AGENTS.md)

Dokumen ini berisi instruksi khusus dan batasan operasional bagi seluruh AI Agent (seperti Antigravity, Claude, GPT, dan asisten kode lainnya) yang bekerja di dalam repositori ini.

---

## 🚫 Larangan Keras (Strict Restrictions)

1. **JANGAN melakukan Commit secara mandiri.**
   * AI Agent dilarang keras membuat git commit baru atau mengubah riwayat komgit secara otomatis tanpa konfirmasi dan instruksi manual eksplisit dari pengguna.
2. **JANGAN melakukan Push ke `main` atau cabang Produksi.**
   * AI Agent dilarang menjalankan perintah `git push` ke cabang utama (`main`, `master`, `production`, atau cabang deployment lainnya).
3. **JANGAN mempublikasikan (Publish) Kode/Rilis.**
   * AI Agent dilarang menjalankan perintah deploy, publish paket (npm/yarn publish), atau men-trigger pipeline rilis produksi secara otomatis.

---

## ✅ Tugas dan Peran Agent (Allowed Actions)

Peran utama AI Agent di dalam repositori ini adalah **sebagai kolaborator dan asisten teknis**, bukan eksekutor deployment/kontrol versi otomatis. 

AI Agent diharapkan untuk:
* **Memberikan bantuan teknis**: Menganalisis masalah, menyusun arsitektur kode modular, dan memberikan saran solusi.
* **Menyediakan instruksi/perintah**: Menuliskan perintah git atau deployment yang tepat (seperti perintah `git commit` atau `git push`) di dalam chat atau dokumentasi agar dapat ditinjau dan **dijalankan sendiri secara manual oleh pengguna (Human-in-the-Loop)**.
* **Menulis dan merevisi kode**: Membantu memprogram fitur game, membetulkan bug, atau merancang dokumentasi baru dalam lingkup workspace lokal sebelum diajukan ke pengguna.

---

> **PENTING UNTUK AGENT:**  
> Selalu hormati batasan ini untuk menjaga integritas kode dan keamanan repositori. Biarkan pengguna yang memegang kendali penuh atas komit, cabang utama, dan siklus perilisan produk.
