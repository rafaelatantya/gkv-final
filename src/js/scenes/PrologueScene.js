/* ==========================================================================
   PHASER SCENE: PROLOGUE SCENE (NARRATIVE CINEMATIC)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

export class PrologueScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PrologueScene' });
    }

    /**
       Fungsi penerima transfer data dari adegan sebelumnya (MenuScene).
       @param {Object} data Objek data berisi array data pemain hasil setup.
     */
    init(data) {
        this.playersData = data.players || [];
        // Indeks paragraf cerita aktif saat ini
        this.currentStoryIndex = 0;
        
        // Kumpulan narasi pengantar cerita bertema kehidupan mahasiswa baru IPB University
        this.storyScript = [
            {
                speaker: "UKK IPB",
                avatar: "👮",
                text: "Selamat datang di Kampus Hijau Dramaga, Mahasiswa Baru IPB University! Perjalanan akademik kalian resmi dimulai hari ini di asrama PPKU."
            },
            {
                speaker: "Dosen Wali",
                avatar: "👩‍🏫",
                text: "Di sini, kalian tidak hanya dituntut berprestasi secara akademik, melainkan juga wajib memahami dan mematuhi seluruh peraturan tata tertib kehidupan kampus."
            },
            {
                speaker: "Kakak Tingkat",
                avatar: "🧑‍🎓",
                text: "Papan permainan ini melambangkan perjalanan kalian. Petak tangga mewakili pencapaian prestasi akademik. Petak ular mewakili pelanggaran sanksi akademik."
            },
            {
                speaker: "Rektor IPB",
                avatar: "🏛️",
                text: "Buktikan integritas kalian! Raih level evolusi tertinggi dari mahasiswa punk spiky hingga dinobatkan menjadi Duta IPB di wisuda petak 100! Gas!"
            }
        ];
    }

    /**
       Fungsi utama pembuatan visualisasi adegan prolog.
     */
    create() {
        console.log("🎬 PrologueScene Active: Memutar Sinematik Pengantar Cerita...");

        // Putar musik suasana santai asrama PPKU jika tersedia di cache
        this.playPrologueBackgroundMusic();

        // Gambar latar belakang ruang angkasa/cyber berdenyut neon menggunakan Phaser Graphics
        this.createDynamicParallaxBackground();

        // Injeksi GUI cerita ke DOM layer
        this.renderPrologueStoryInterface();
    }

    /**
       Memutar musik latar belakang prologue.
     */
    playPrologueBackgroundMusic() {
        if (this.sound.get('bgm_level_1')) {
            this.sound.play('bgm_level_1', { loop: true, volume: 0.45 });
        }
    }

    /**
       Membuat visualisasi background dinamis Phaser 3 yang bergerak lambat
       untuk memunculkan nuansa mendalam (deep space/academic glowing arena).
     */
    createDynamicParallaxBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Tambahkan grafis latar belakang abstrak berdenyut
        this.bgGraphics = this.add.graphics();
        
        // Timer berulang untuk memperbarui denyut visual grafis latar belakang
        this.tweens.addCounter({
            from: 0,
            to: 360,
            duration: 8000,
            loop: -1,
            onUpdate: (tween) => {
                const value = tween.getValue();
                const intensity = Math.sin(Phaser.Math.DegToRad(value)) * 0.15 + 0.85;

                this.bgGraphics.clear();
                // Gambar gradien melingkar di tengah
                this.bgGraphics.fillStyle(0x0a0f1d, 1.0);
                this.bgGraphics.fillRect(0, 0, width, height);

                // Tambahkan lingkaran aura bersinar neon biru IPB di koordinat tengah bawah
                this.bgGraphics.fillStyle(0x042c64, 0.25 * intensity);
                this.bgGraphics.fillCircle(width / 2, height, 400);

                // Tambahkan lingkaran aura bersinar emas di kiri atas
                this.bgGraphics.fillStyle(0xf2b80f, 0.08 * intensity);
                this.bgGraphics.fillCircle(100, 100, 250);
            }
        });

        // Membuat partikel debu kosmik melayang di udara agar scene terasa hidup
        this.createFloatingDustParticles(width, height);
    }

    /**
       Membuat simulasi partikel melayang asinkron di atas Canvas WebGL.
     */
    createFloatingDustParticles(width, height) {
        // Menggunakan emitter partikel modern Phaser 3.60+
        const particleDot = this.add.particles(0, 0, 'particle_dot', {
            x: { min: 0, max: width },
            y: { min: 0, max: height },
            speed: { min: 5, max: 15 },
            angle: { min: 0, max: 360 },
            scale: { min: 0.1, max: 0.4 },
            alpha: { min: 0.1, max: 0.45 },
            lifespan: 12000,
            frequency: 150,
            blendMode: 'ADD'
        });

        // Set kedalaman agar berada di belakang teks UI DOM overlay
        particleDot.setDepth(1);
    }

    /**
       Menyuntikkan UI dialog box glassmorphism ke dalam app-ui-layer DOM.
     */
    renderPrologueStoryInterface() {
        const uiContainer = document.getElementById('app-ui-layer');
        if (!uiContainer) return;

        uiContainer.innerHTML = '';

        const prologuePanel = document.createElement('div');
        prologuePanel.className = 'glass-panel prologue-content';
        prologuePanel.id = 'prologue-narrative-panel';

        prologuePanel.innerHTML = `
            <div class="dialogue-header">
                📝 REKAM JEJAK MAHASISWA BARU IPB
            </div>
            
            <div class="dialogue-box">
                <div id="dialogue-avatar" class="character-visual-placeholder">🎓</div>
                <div class="dialogue-text-area">
                    <h4 id="dialogue-speaker">Rektor IPB</h4>
                    <p id="dialogue-text">Memuat cerita kampus...</p>
                </div>
            </div>
            
            <div class="prologue-actions">
                <button id="btn-skip-story" class="btn btn-secondary">LEWATI</button>
                <button id="btn-next-story" class="btn btn-primary btn-glow">LANJUT</button>
            </div>
        `;

        uiContainer.appendChild(prologuePanel);

        // Tambahkan event listener untuk tombol-tombol dialog
        document.getElementById('btn-skip-story').addEventListener('click', () => {
            this.playButtonClickSound();
            this.exitPrologueAndStartGame();
        });

        document.getElementById('btn-next-story').addEventListener('click', () => {
            this.playButtonClickSound();
            this.advanceStoryScript();
        });

        // Tampilkan potongan cerita pertama kali
        this.displayStoryIndex(this.currentStoryIndex);
    }

    /**
       Menampilkan dialog pada indeks script cerita tertentu dengan efek ketikan lambat.
       @param {Number} index Indeks skrip aktif.
     */
    displayStoryIndex(index) {
        const currentLine = this.storyScript[index];
        if (!currentLine) return;

        const avatarElement = document.getElementById('dialogue-avatar');
        const speakerElement = document.getElementById('dialogue-speaker');
        const textElement = document.getElementById('dialogue-text');

        if (avatarElement) avatarElement.textContent = currentLine.avatar;
        if (speakerElement) speakerElement.textContent = currentLine.speaker;

        // Efek mesin tik (Typewriter Effect)
        if (textElement) {
            textElement.textContent = '';
            let charIndex = 0;
            const fullText = currentLine.text;

            // Hentikan timer ketikan sebelumnya jika ada
            if (this.typewriterTimer) {
                this.typewriterTimer.destroy();
            }

            // Daftarkan event timer baru di Phaser untuk menulis karakter demi karakter
            this.typewriterTimer = this.time.addEvent({
                delay: 25,
                repeat: fullText.length - 1,
                callback: () => {
                    textElement.textContent += fullText.charAt(charIndex);
                    charIndex++;
                }
            });
        }
    }

    /**
       Memajukan alur script cerita ke indeks berikutnya atau memulai game jika selesai.
     */
    advanceStoryScript() {
        this.currentStoryIndex++;

        // Jika semua naskah cerita telah terbaca habis, segera mulai game
        if (this.currentStoryIndex >= this.storyScript.length) {
            this.exitPrologueAndStartGame();
        } else {
            this.displayStoryIndex(this.currentStoryIndex);
        }
    }

    /**
       Menghentikan musik dan keluar dari scene prolog menuju arena permainan utama (GameScene).
     */
    exitPrologueAndStartGame() {
        console.log("🎮 Memulai Game Utama Ular Tangga IPB...");
        
        // Hentikan timer typewriter jika masih berjalan
        if (this.typewriterTimer) {
            this.typewriterTimer.destroy();
        }

        // Hentikan BGM Level 1 sebelum transisi
        if (this.sound.get('bgm_level_1')) {
            this.sound.stopByKey('bgm_level_1');
        }

        const uiContainer = document.getElementById('app-ui-layer');
        if (uiContainer) uiContainer.innerHTML = '';

        // Berpindah scene ke GameScene dengan meneruskan data setup mahasiswa baru
        this.scene.start('GameScene', { players: this.playersData });
    }

    /**
       Utilitas global pemutar efek suara klik interaksi.
     */
    playButtonClickSound() {
        if (this.sound.get('sfx_dice_charge')) {
            this.sound.play('sfx_dice_charge', { volume: 0.35 });
        }
    }
}
