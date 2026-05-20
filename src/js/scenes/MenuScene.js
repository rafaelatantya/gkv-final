/* ==========================================================================
   PHASER SCENE: MENU SCENE (MAIN MENU & SETUP)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    /**
       Fungsi bawaan Phaser untuk inisialisasi awal scene.
     */
    create() {
        console.log("🖥️ MenuScene Active: Membuka Menu Utama...");
        
        // Memutar BGM Menu Utama secara asinkron dengan kontrol fallback
        this.playMenuBackgroundMusic();

        // Merender tampilan Menu Utama statis/dinamis ke dalam DOM UI Layer
        this.renderMainMenuInterface();
    }

    /**
       Memutar musik latar belakang menu utama jika aset berhasil dimuat.
     */
    playMenuBackgroundMusic() {
        if (this.sound.get('bgm_menu')) {
            this.sound.play('bgm_menu', { loop: true, volume: 0.5 });
        } else {
            console.warn("🔊 Aset bgm_menu tidak ditemukan di cache. Mengandalkan sfx dinamis.");
        }
    }

    /**
       Menginjeksi elemen DOM untuk Menu Utama secara dinamis ke dalam app-ui-layer.
     */
    renderMainMenuInterface() {
        const uiContainer = document.getElementById('app-ui-layer');
        if (!uiContainer) return;

        // Bersihkan isi container UI
        uiContainer.innerHTML = '';

        // Elemen pembungkus panel glassmorphism menu
        const menuPanel = document.createElement('div');
        menuPanel.className = 'glass-panel menu-content';
        menuPanel.id = 'main-menu-panel';

        menuPanel.innerHTML = `
            <div class="logo-area">
                <div class="logo-ipb">🎓</div>
                <h1>ULAR TANGGA TATA TERTIB</h1>
                <h2>IPB University</h2>
                <p class="menu-tagline">
                    Jadilah Mahasiswa Berprestasi yang Menjunjung Tinggi Integritas dan Tata Tertib Kampus Hijau Dramaga!
                </p>
            </div>
            
            <div class="menu-actions">
                <button id="btn-start-setup" class="btn btn-primary btn-glow btn-wide">MULAI PERMAINAN</button>
                <button id="btn-show-credits" class="btn btn-secondary btn-wide">KREDIT PENGEMBANG</button>
            </div>
        `;

        uiContainer.appendChild(menuPanel);

        // Pasang Event Listeners tombol
        document.getElementById('btn-start-setup').addEventListener('click', () => {
            this.playButtonClickSound();
            this.renderPlayerSetupInterface();
        });

        document.getElementById('btn-show-credits').addEventListener('click', () => {
            this.playButtonClickSound();
            this.renderCreditsInterface();
        });
    }

    /**
       Merender form setup pemain (2 - 4 Pemain) beserta pemilihan tipe (Manusia / Bot).
     */
    renderPlayerSetupInterface() {
        const uiContainer = document.getElementById('app-ui-layer');
        if (!uiContainer) return;

        uiContainer.innerHTML = '';

        const setupPanel = document.createElement('div');
        setupPanel.className = 'glass-panel setup-content';
        setupPanel.id = 'setup-players-panel';

        // Setelan default: 2 Pemain
        let selectedPlayerCount = 2;

        setupPanel.innerHTML = `
            <button id="btn-back-to-menu" class="btn-back">← KEMBALI</button>
            <h2>SETUP MAHASISWA</h2>
            <p class="section-desc">Pilih jumlah mahasiswa baru yang akan bersaing di kampus</p>
            
            <div class="setup-group">
                <label>JUMLAH PEMAIN</label>
                <div class="player-count-selector">
                    <button class="btn-selector active" data-count="2">2 PEMAIN</button>
                    <button class="btn-selector" data-count="3">3 PEMAIN</button>
                    <button class="btn-selector" data-count="4">4 PEMAIN</button>
                </div>
            </div>
            
            <div class="setup-group">
                <label>DAFTAR MAHASISWA</label>
                <div id="players-input-list" class="players-input-list">
                    <!-- Form input dinamis akan disuntikkan di sini oleh method helper -->
                </div>
            </div>
            
            <button id="btn-launch-game" class="btn btn-primary btn-glow btn-wide">GAS MAHASISWA BARU!</button>
        `;

        uiContainer.appendChild(setupPanel);

        // Helper fungsi untuk merender list kartu input secara dinamis
        const generatePlayerInputFields = (count) => {
            const listContainer = document.getElementById('players-input-list');
            if (!listContainer) return;

            listContainer.innerHTML = '';

            const defaultNames = ["Budi PPKU", "Siti Ekologi", "Agus FMIPA", "Dewi Vokasi"];

            for (let i = 1; i <= 4; i++) {
                const playerInputCard = document.createElement('div');
                playerInputCard.className = `player-input-card${i > count ? ' bot' : ''}`;
                playerInputCard.id = `input-card-p${i}`;

                const badgeColorClass = `p${i}`;
                const isBot = i > count;
                const defaultName = isBot ? `Bot ${defaultNames[i-1]}` : defaultNames[i-1];

                playerInputCard.innerHTML = `
                    <span class="player-badge ${badgeColorClass}">P${i}</span>
                    <input type="text" id="player-name-p${i}" value="${defaultName}" maxLength="14" ${isBot ? 'disabled' : ''}/>
                    <span class="player-type">${isBot ? '🤖 BOT AI' : '👤 MANUSIA'}</span>
                `;

                listContainer.appendChild(playerInputCard);
            }
        };

        // Render awal form input untuk 2 pemain
        generatePlayerInputFields(selectedPlayerCount);

        // Daftarkan event listener untuk tombol pemilih jumlah pemain
        const countButtons = setupPanel.querySelectorAll('.player-count-selector .btn-selector');
        countButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.playButtonClickSound();
                countButtons.forEach(btn => btn.classList.remove('active'));
                
                const targetButton = e.currentTarget;
                targetButton.classList.add('active');
                
                selectedPlayerCount = parseInt(targetButton.getAttribute('data-count'), 10);
                generatePlayerInputFields(selectedPlayerCount);
            });
        });

        // Event listener kembali ke menu utama
        document.getElementById('btn-back-to-menu').addEventListener('click', () => {
            this.playButtonClickSound();
            this.renderMainMenuInterface();
        });

        // Event listener memulai transisi scene game
        document.getElementById('btn-launch-game').addEventListener('click', () => {
            this.playButtonClickSound();

            // Kumpulkan data konfigurasi pemain hasil input
            const playersData = [];
            for (let i = 1; i <= 4; i++) {
                const nameInput = document.getElementById(`player-name-p${i}`);
                playersData.push({
                    id: i,
                    name: nameInput.value.trim() || `Pemain ${i}`,
                    isBot: i > selectedPlayerCount,
                    evolutionLevel: 1, // Memulai dari level 1 (Punk Style)
                    currentPosition: 1, // Memulai dari petak 1
                    isSuspended: false, // Status skorsing awal
                    skullCount: 0 // Penghitung sanksi tengkorak
                });
            }

            console.log("🎮 Konfigurasi Pemain Siap: ", playersData);

            // Matikan BGM Menu sebelum berpindah scene
            if (this.sound.get('bgm_menu')) {
                this.sound.stopByKey('bgm_menu');
            }

            // Pindah ke PrologueScene dengan membawa data setup pemain
            uiContainer.innerHTML = '';
            this.scene.start('PrologueScene', { players: playersData });
        });
    }

    /**
       Merender layar Kredit Pengembang akademis yang terstruktur rapi.
     */
    renderCreditsInterface() {
        const uiContainer = document.getElementById('app-ui-layer');
        if (!uiContainer) return;

        uiContainer.innerHTML = '';

        const creditsPanel = document.createElement('div');
        creditsPanel.className = 'glass-panel credits-content';
        creditsPanel.id = 'credits-panel';

        creditsPanel.innerHTML = `
            <button id="btn-back-from-credits" class="btn-back">← KEMBALI</button>
            <h2>KREDIT PENGEMBANG</h2>
            <h3>Mata Kuliah Grafika Komputer & Visualisasi</h3>
            <hr/>
            
            <div class="team-grid">
                <div class="team-card">
                    <div class="avatar">👨‍💻</div>
                    <h4>Rafael Atantya</h4>
                    <span class="nim">NIM. G6401221000</span>
                </div>
                <div class="team-card">
                    <div class="avatar">💻</div>
                    <h4>Tim Grafkom IPB</h4>
                    <span class="nim">Departemen Ilmu Komputer</span>
                </div>
            </div>
            
            <div class="credits-footer">
                © 2026 DEPARTEMEN ILMU KOMPUTER<br/>
                FMIPA IPB UNIVERSITY
            </div>
        `;

        uiContainer.appendChild(creditsPanel);

        document.getElementById('btn-back-from-credits').addEventListener('click', () => {
            this.playButtonClickSound();
            this.renderMainMenuInterface();
        });
    }

    /**
       Utilitas global pemutar efek suara klik tombol jika tersedia di cache.
     */
    playButtonClickSound() {
        // Menggunakan sfx_dice_charge sebagai representasi sfx interaksi UI cepat
        if (this.sound.get('sfx_dice_charge')) {
            this.sound.play('sfx_dice_charge', { volume: 0.35 });
        }
    }
}
