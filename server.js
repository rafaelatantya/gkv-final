/* ==========================================================================
   HIGH-PERFORMANCE COMPRESSED STATIC WEB SERVER (ZERO DEPENDENCY)
   Proyek: Ular Tangga Tata Tertib IPB University
   Mata Kuliah: Grafika Komputer dan Visualisasi
   ========================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'src');

// Daftar Ekstensi MIME untuk Penanganan Format Berkas Web Modern
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav'
};

// Format Berkas yang Layak Dikompresi Gzip untuk Menghemat Bandwidth & Mencegah Lag
const COMPRESSIBLE_TYPES = [
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
    'image/svg+xml'
];

const server = http.createServer((req, res) => {
    const startTime = Date.now();

    // Hapus query parameters (?v=123) untuk mencari berkas fisik
    let safeUrl = req.url.split('?')[0];
    
    // Normalisasi rute awal ke index.html
    if (safeUrl === '/' || safeUrl === '') {
        safeUrl = '/index.html';
    }

    // Resolusi path berkas di dalam direktori 'src'
    let filePath = path.join(PUBLIC_DIR, safeUrl);

    // Pastikan path aman dan tidak mengakses di luar folder 'src' (Cegah Directory Traversal)
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('403 Forbidden: Akses ditolak.');
        logRequest(req, 403, startTime, 'Forbidden');
        return;
    }

    // Cek ketersediaan berkas secara asinkron
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Berkas tidak ditemukan, kirim respon 404
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end('<h1>404 Not Found</h1><p>Berkas yang Anda cari tidak ditemukan di server Dramaga.</p>');
            logRequest(req, 404, startTime, 'Not Found');
            return;
        }

        // Tentukan Tipe Konten berdasarkan ekstensi berkas
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);

        // Atur Cache-Control agar aset statis di-cache oleh browser untuk performa lebih cepat
        res.setHeader('Cache-Control', 'public, max-age=31536000');

        // Deteksi apakah klien mendukung Gzip Compression
        const acceptEncoding = req.headers['accept-encoding'] || '';
        const shouldCompress = COMPRESSIBLE_TYPES.some(type => contentType.includes(type));

        if (acceptEncoding.includes('gzip') && shouldCompress) {
            // Putar asinkron Gzip Stream untuk efisiensi RAM maksimal
            res.setHeader('Content-Encoding', 'gzip');
            
            const rawStream = fs.createReadStream(filePath);
            const gzipStream = zlib.createGzip();

            res.statusCode = 200;
            rawStream.pipe(gzipStream).pipe(res);

            gzipStream.on('error', () => {
                res.statusCode = 500;
                res.end();
            });

            logRequest(req, 200, startTime, 'Gzipped');
        } else {
            // Kirim berkas polos tanpa kompresi (misal untuk berkas biner seperti MP3 & PNG yang sudah terkompresi bawaan)
            const rawStream = fs.createReadStream(filePath);
            
            res.statusCode = 200;
            rawStream.pipe(res);

            rawStream.on('error', () => {
                res.statusCode = 500;
                res.end();
            });

            logRequest(req, 200, startTime, 'Raw');
        }
    });
});

/**
 * Logger visual premium untuk log request di terminal
 */
function logRequest(req, statusCode, startTime, mode) {
    const duration = Date.now() - startTime;
    const date = new Date();
    const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    
    // Warnai status code di terminal
    let statusColored = `[${statusCode}]`;
    if (statusCode === 200) {
        statusColored = `\x1b[32m[200 OK]\x1b[0m`; // Green
    } else if (statusCode >= 400) {
        statusColored = `\x1b[31m[${statusCode}]\x1b[0m`; // Red
    }

    const modeStr = mode === 'Gzipped' ? `\x1b[36m[GZIP]\x1b[0m` : `\x1b[90m[RAW]\x1b[0m`;

    console.log(`[${timeStr}] ${statusColored} ${modeStr} ${req.method} ${req.url} - \x1b[33m${duration}ms\x1b[0m`);
}

// Mulai mendengarkan di Port target
server.listen(PORT, () => {
    console.log(`\n\x1b[34m============================================================\x1b[0m`);
    console.log(`\x1b[1m🚀 SERVER KAMPUS DRAMAGA AKTIF!\x1b[0m`);
    console.log(`Game siap diakses di: \x1b[36m\x1b[4mhttp://localhost:${PORT}\x1b[0m`);
    console.log(`Kompresi Gzip: \x1b[32mAKTIF (Mencegah lag transmisi berkas)\x1b[0m`);
    console.log(`Aset Terpeta: \x1b[90m${PUBLIC_DIR}\x1b[0m`);
    console.log(`\x1b[34m============================================================\x1b[0m\n`);
});
