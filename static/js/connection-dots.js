const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasContainer = canvas.parentElement; // Dapatkan div pembungkus

// --- Pengaturan Partikel ---
const particlesArray = [];
// Kurangi jumlah partikel karena area lebih kecil
const numberOfParticles = 60;
const connectDistance = 80; // Mungkin perlu disesuaikan
const particleSpeed = 0.8; // Mungkin perlu disesuaikan
const particleRadius = 2.5;
const particleColor = 'rgba(255, 255, 255, 0.8)';
const connectionColor = 'rgba(0, 191, 255, 0.5)'; // Warna koneksi mouse (biru terang)

// --- Objek Mouse ---
const mouse = {
    x: null,
    y: null,
    radius: connectDistance * 1.2 // Sesuaikan radius interaksi
};

// --- Fungsi untuk Mengatur Ukuran Canvas ---
function resizeCanvas() {
    // Set ukuran canvas sesuai ukuran container aktualnya
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    // Update radius mouse jika diperlukan (misal berdasarkan % lebar canvas)
    mouse.radius = (canvas.width / 10) > 100 ? (canvas.width / 10) : 100; // Contoh: 10% lebar, min 100px
    init(); // Panggil init setelah resize untuk reposisi partikel
}

// --- Event Listener Mouse (di dalam area Canvas) ---
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect(); // Dapatkan posisi canvas di layar
    mouse.x = event.clientX - rect.left; // Koordinat X relatif thd canvas
    mouse.y = event.clientY - rect.top;  // Koordinat Y relatif thd canvas
    // console.log(`Mouse in Canvas: x=${mouse.x?.toFixed(0)}, y=${mouse.y?.toFixed(0)}`);
});

canvas.addEventListener('mouseleave', () => { // Gunakan mouseleave pada canvas
    mouse.x = null;
    mouse.y = null;
    // console.log("Mouse left canvas");
});

// --- Kelas Partikel ---
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = particleRadius;
        // Kecepatan awal acak di dalam batas canvas
        this.speedX = (Math.random() * particleSpeed * 2) - particleSpeed;
        this.speedY = (Math.random() * particleSpeed * 2) - particleSpeed;
    }

    draw() {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // Memantul di tepi canvas (yang ukurannya sudah benar)
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.speedX = -this.speedX;
            // Koreksi posisi agar tidak terjebak di luar batas
            if (this.x + this.radius > canvas.width) this.x = canvas.width - this.radius;
            if (this.x - this.radius < 0) this.x = this.radius;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.speedY = -this.speedY;
             // Koreksi posisi
            if (this.y + this.radius > canvas.height) this.y = canvas.height - this.radius;
            if (this.y - this.radius < 0) this.y = this.radius;
        }
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

// --- Inisialisasi Partikel ---
function init() {
    particlesArray.length = 0; // Kosongkan array
    for (let i = 0; i < numberOfParticles; i++) {
        // Posisi acak DI DALAM BATAS CANVAS aktual
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
    }
    console.log(`Initialized ${particlesArray.length} particles within ${canvas.width}x${canvas.height}`);
}


// --- Fungsi Koneksi ---
function connectParticles() {
    let opacityValue = 1;

    for (let a = 0; a < particlesArray.length; a++) {
        // Koneksi Partikel-ke-Partikel
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.hypot(dx, dy); // Cara lain hitung jarak

            if (distance < connectDistance) {
                opacityValue = 1 - (distance / connectDistance);
                // Warna garis antar partikel (putih transparan)
                ctx.strokeStyle = `rgba(16, 46, 80, ${opacityValue * 0.5})`; // Lebih transparan
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        // Koneksi Partikel-ke-Mouse (Hover Effect)
        if (mouse.x !== null && mouse.y !== null) {
            const dxMouse = particlesArray[a].x - mouse.x;
            const dyMouse = particlesArray[a].y - mouse.y;
            const distanceMouse = Math.hypot(dxMouse, dyMouse);

            if (distanceMouse < mouse.radius) {
                opacityValue = 1 - (distanceMouse / mouse.radius);
                // Warna garis ke mouse (sesuai variabel)
                ctx.strokeStyle = `rgba(255, 0, 0, ${opacityValue * 0.5})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(mouse.x, mouse.y); // Gunakan mouse.x/y yang sudah relatif
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// Helper function to convert rgba string to rgb part for strokeStyle
function hexToRgb(rgbaString) {
    // Ekstrak nilai R, G, B dari string rgba(R, G, B, A)
    const result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/.exec(rgbaString);
    return result ? `${result[1]}, ${result[2]}, ${result[3]}` : '255, 255, 255'; // Default putih jika gagal
}


// --- Loop Animasi ---
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();

    requestAnimationFrame(animate); // Loop
}

// --- Event Listener Resize Jendela ---
window.addEventListener('resize', resizeCanvas);

// --- Panggilan Awal ---
resizeCanvas(); // Panggil sekali di awal untuk set ukuran & init partikel
animate(); // Mulai animasi