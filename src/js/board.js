/* ==========================================================================
   BOARD GRAPHICS & VISUALIZATION ENGINE
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

class BoardRenderer {
    constructor() {
        this.boardElement = null;
        this.svgOverlay = null;
        
        // Definisikan Petak Khusus
        this.specialTiles = {
            skull: [26, 58, 72],
            quiz: [7, 20, 33, 46, 77, 86]
        };

        // Definisikan Pemetaan Tangga: Start -> End (Naik)
        this.ladders = {
            3: 14,   // Pendek (Naik 1 baris)
            15: 36,  // Sedang (Naik 2 baris)
            28: 48,  // Sedang (Naik 2 baris)
            38: 63,  // Sedang (Naik 2 baris)
            50: 89,  // Panjang (Naik 3 baris)
            65: 96   // Panjang (Naik 3 baris)
        };

        // Definisikan Pemetaan Ular: Start -> End (Turun)
        this.snakes = {
            17: 6,   // Pendek (Turun 1 baris)
            34: 13,  // Sedang (Turun 2 baris)
            54: 35,  // Sedang (Turun 2 baris)
            73: 52,  // Sedang (Turun 2 baris)
            84: 43,  // Panjang (Turun 4 baris)
            98: 57   // Panjang (Turun 4 baris)
        };
    }

    /**
     * Membangun Grid Papan 10x10 di DOM dan melukis SVG Ular/Tangga
     */
    renderBoard() {
        this.boardElement = document.getElementById('game-board');
        this.svgOverlay = document.getElementById('board-svg-overlay');

        if (!this.boardElement) return;

        this.boardElement.innerHTML = '';
        this.svgOverlay.innerHTML = '';

        // Loop untuk menggambar grid dari koordinat CSS Grid (Row 0-9, Col 0-9)
        // Row 0 adalah baris teratas (petak 91-100), Row 9 adalah baris terbawah (petak 1-10)
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const tileNum = this.getTileNumberFromCoords(row, col);
                const tileType = this.getTileType(tileNum);
                
                const tileDiv = document.createElement('div');
                tileDiv.id = `tile-${tileNum}`;
                tileDiv.className = `tile ${tileType}`;
                
                // Kelas selang-seling warna papan catur
                const isEvenCell = (row + col) % 2 === 0;
                tileDiv.classList.add(isEvenCell ? 'tile-light' : 'tile-dark');

                // Nomor Petak
                const numSpan = document.createElement('span');
                numSpan.className = 'tile-number';
                numSpan.textContent = tileNum;
                tileDiv.appendChild(numSpan);

                // Container bidak dalam petak
                const tokensDiv = document.createElement('div');
                tokensDiv.id = `tokens-container-${tileNum}`;
                tokensDiv.className = 'tokens-container';
                tileDiv.appendChild(tokensDiv);

                this.boardElement.appendChild(tileDiv);
            }
        }

        // Jalankan penggambaran Ular dan Tangga secara dinamis setelah render grid selesai
        // Menggunakan requestAnimationFrame/setTimeout agar dimensi elemen DOM terhitung dengan benar
        setTimeout(() => {
            this.drawSnakesAndLadders();
        }, 100);

        // Pasang event listener untuk menghitung ulang posisi SVG saat layar di-resize
        window.removeEventListener('resize', this.handleResize);
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Menghitung ulang rute garis SVG saat layar di-resize
     */
    handleResize() {
        if (this.svgOverlay) {
            this.svgOverlay.innerHTML = '';
            this.drawSnakesAndLadders();
        }
    }

    /**
     * Konversi koordinat Grid DOM (0-9, 0-9) ke nomor petak Ular Tangga (1-100) zig-zag
     */
    getTileNumberFromCoords(gridRow, gridCol) {
        const bottomRowIndex = 9 - gridRow; // 0 di bawah, 9 di atas
        
        if (bottomRowIndex % 2 === 0) {
            // Baris genap dari bawah: Kiri ke Kanan (1-10, 21-30, dst.)
            return bottomRowIndex * 10 + gridCol + 1;
        } else {
            // Baris ganjil dari bawah: Kanan ke Kiri (11-20, 31-40, dst.)
            return bottomRowIndex * 10 + (9 - gridCol) + 1;
        }
    }

    /**
     * Mendapatkan kategori tipe petak khusus
     */
    getTileType(tileNum) {
        if (tileNum === 1) return 'tile-start';
        if (tileNum === 100) return 'tile-finish';
        if (this.specialTiles.skull.includes(tileNum)) return 'tile-skull';
        if (this.specialTiles.quiz.includes(tileNum)) return 'tile-quiz';
        return '';
    }

    /**
     * Mengambil koordinat tengah dari sebuah petak relatif terhadap Papan
     */
    getTileCenterCoordinates(tileNum) {
        const tileDiv = document.getElementById(`tile-${tileNum}`);
        const boardDiv = this.boardElement;

        if (!tileDiv || !boardDiv) return { x: 0, y: 0 };

        const tileRect = tileDiv.getBoundingClientRect();
        const boardRect = boardDiv.getBoundingClientRect();

        // Cari koordinat tengah relatif
        const x = (tileRect.left - boardRect.left) + (tileRect.width / 2);
        const y = (tileRect.top - boardRect.top) + (tileRect.height / 2);

        return { x, y };
    }

    /**
     * Melukis rute visual Ular dan Tangga secara dinamis pada elemen SVG
     */
    drawSnakesAndLadders() {
        if (!this.svgOverlay) return;

        // 1. Gambar Tangga (Ladders)
        Object.keys(this.ladders).forEach(start => {
            const end = this.ladders[start];
            const pStart = this.getTileCenterCoordinates(start);
            const pEnd = this.getTileCenterCoordinates(end);

            this.createSVGXladders(pStart, pEnd);
        });

        // 2. Gambar Ular (Snakes)
        Object.keys(this.snakes).forEach(start => {
            const end = this.snakes[start];
            const pStart = this.getTileCenterCoordinates(start);
            const pEnd = this.getTileCenterCoordinates(end);

            this.createSVGXsnakes(pStart, pEnd);
        });
    }

    /**
     * Merender tangga vector premium (Double line dengan anak tangga cokelat)
     */
    createSVGXladders(pStart, pEnd) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'svg-ladder');

        // Garis tepi kiri & kanan tangga
        const dx = pEnd.x - pStart.x;
        const dy = pEnd.y - pStart.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // Vektor tegak lurus untuk ketebalan/lebar tangga
        const width = 12; // Setengah lebar tangga
        const px = (-dy / length) * width;
        const py = (dx / length) * width;

        // Garis Kiri
        const lineLeft = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineLeft.setAttribute('x1', pStart.x - px);
        lineLeft.setAttribute('y1', pStart.y - py);
        lineLeft.setAttribute('x2', pEnd.x - px);
        lineLeft.setAttribute('y2', pEnd.y - py);
        lineLeft.setAttribute('stroke', '#d38b35');
        lineLeft.setAttribute('stroke-width', '4');
        lineLeft.setAttribute('stroke-linecap', 'round');
        group.appendChild(lineLeft);

        // Garis Kanan
        const lineRight = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineRight.setAttribute('x1', pStart.x + px);
        lineRight.setAttribute('y1', pStart.y + py);
        lineRight.setAttribute('x2', pEnd.x + px);
        lineRight.setAttribute('y2', pEnd.y + py);
        lineRight.setAttribute('stroke', '#d38b35');
        lineRight.setAttribute('stroke-width', '4');
        lineRight.setAttribute('stroke-linecap', 'round');
        group.appendChild(lineRight);

        // Anak tangga (Rungs) di sepanjang lintasan
        const rungsCount = Math.floor(length / 22);
        for (let i = 1; i < rungsCount; i++) {
            const t = i / rungsCount;
            // Interpolasi linear posisi
            const rx = pStart.x + dx * t;
            const ry = pStart.y + dy * t;

            const rung = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            rung.setAttribute('x1', rx - px);
            rung.setAttribute('y1', ry - py);
            rung.setAttribute('x2', rx + px);
            rung.setAttribute('y2', ry + py);
            rung.setAttribute('stroke', '#f4b05e');
            rung.setAttribute('stroke-width', '3');
            group.appendChild(rung);
        }

        this.svgOverlay.appendChild(group);
    }

    /**
     * Merender ular vector premium (Garis gelombang neon hijau dengan mata merah)
     */
    createSVGXsnakes(pStart, pEnd) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'svg-snake');

        // Bikin kurva gelombang sinus menggunakan Path Bézier
        const dx = pEnd.x - pStart.x;
        const dy = pEnd.y - pStart.y;
        
        // Titik kontrol kurva agar melengkung indah
        const mx = (pStart.x + pEnd.x) / 2;
        const my = (pStart.y + pEnd.y) / 2;

        // Hitung sudut tegak lurus
        const angle = Math.atan2(dy, dx);
        const waveOffset = 30; // Amplitudo gelombang ular
        
        // Titik kontrol gelombang
        const cx1 = mx + Math.cos(angle + Math.PI / 2) * waveOffset;
        const cy1 = my + Math.sin(angle + Math.PI / 2) * waveOffset;
        const cx2 = mx + Math.cos(angle - Math.PI / 2) * waveOffset;
        const cy2 = my + Math.sin(angle - Math.PI / 2) * waveOffset;

        // Path kurva gelombang ular (Bézier Cubic)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const dAttr = `M ${pStart.x} ${pStart.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pEnd.x} ${pEnd.y}`;
        path.setAttribute('d', dAttr);
        path.setAttribute('stroke', '#1ED760');
        path.setAttribute('stroke-width', '6');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('filter', 'drop-shadow(0px 0px 4px rgba(30, 215, 96, 0.4))');
        group.appendChild(path);

        // Kepala ular (Bulatan bercahaya di petak awal/atas)
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        head.setAttribute('cx', pStart.x);
        head.setAttribute('cy', pStart.y);
        head.setAttribute('r', '8');
        head.setAttribute('fill', '#14a344');
        head.setAttribute('stroke', '#fff');
        head.setAttribute('stroke-width', '1.5');
        group.appendChild(head);

        // Mata ular kecil merah (Detil premium!)
        const eye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        eye.setAttribute('cx', pStart.x + Math.cos(angle) * 2);
        eye.setAttribute('cy', pStart.y + Math.sin(angle) * 2);
        eye.setAttribute('r', '2');
        eye.setAttribute('fill', '#FF2E93');
        group.appendChild(eye);

        this.svgOverlay.appendChild(group);
    }

    /**
     * Memperbarui visual posisi bidak pemain di dalam petak
     * @param {Array<Player>} players List seluruh pemain aktif
     */
    updatePlayerTokens(players) {
        // Kosongkan semua container bidak terlebih dahulu
        document.querySelectorAll('.tokens-container').forEach(el => el.innerHTML = '');

        // Masukkan bidak ke petak masing-masing
        players.forEach(p => {
            if (p.isDroppedOut) return; // Jika Drop Out, sembunyikan bidak

            // Petak 0 tidak memiliki div fisik khusus di grid, 
            // sehingga untuk petak 0 diposisikan di petak 1 secara visual (Start Tile)
            const targetTileNum = p.position === 0 ? 1 : p.position;
            const container = document.getElementById(`tokens-container-${targetTileNum}`);

            if (container) {
                const tokenSpan = document.createElement('div');
                tokenSpan.className = `token p${p.index}`;
                tokenSpan.setAttribute('data-name', p.name);
                tokenSpan.textContent = p.getEvolutionEmoji();
                
                // Set warna shadow neon sesuai tema
                tokenSpan.style.boxShadow = `0 0 12px ${p.colorTheme.hex}`;
                
                container.appendChild(tokenSpan);
            }
        });
    }
}

export const boardRenderer = new BoardRenderer();
export { BoardRenderer };
