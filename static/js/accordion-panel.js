function toggleInfo() {
    const accordion = document.getElementById('cart-accordion');
    accordion.classList.toggle('active'); // Toggle class "active"
}

function closeAccordion(event) {
    event.preventDefault(); // Mencegah aksi default (navigasi langsung)
    const accordion = document.getElementById('cart-accordion');

    // Hapus class "active" untuk menutup accordion
    if (accordion.classList.contains('active')) {
        accordion.classList.remove('active');
    }

    // Tunggu transisi selesai sebelum menggulir
    setTimeout(() => {
        const target = document.querySelector('#list_h1');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 400); // Sesuai dengan durasi transisi di CSS (0.4s)
}


function togglePanel(button) {
    const panel = button.nextElementSibling;
    panel.classList.toggle('open');
}






function togglePanel(button) {
    const panel = button.nextElementSibling;
    panel.classList.toggle('open'); // Mengubah kelas panel

    const icon = button.querySelector('.accordion-icon');
    if (panel.classList.contains('open')) {
        icon.style.transform = 'rotate(180deg)'; // Rotasi panah ke atas
    } else {
        icon.style.transform = 'rotate(0deg)'; // Kembali ke posisi default
    }
}
