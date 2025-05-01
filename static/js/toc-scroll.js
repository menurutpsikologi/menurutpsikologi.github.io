window.addEventListener('DOMContentLoaded', () => {
    // --- Pastikan selektor ini cocok dengan struktur HTML Anda ---
    const tocLinks = document.querySelectorAll('#TableOfContents a');
    const mainContentSelector = '.singleContent'; // <-- GANTI JIKA PERLU
    const tocSidebarSelector = '.toc-sidebar';  // <-- GANTI JIKA PERLU (untuk auto-scroll)
    // ---------------------------------------------------------
    const headers = [];
    // Ambil semua elemen heading yang memiliki ID di dalam konten utama
    document.querySelectorAll(
        `${mainContentSelector} h1[id], ${mainContentSelector} h2[id], ${mainContentSelector} h3[id], ${mainContentSelector} h4[id], ${mainContentSelector} h5[id], ${mainContentSelector} h6[id]`
    ).forEach(header => {
        headers.push(header);
    });

    // Urutkan header berdasarkan posisi vertikalnya di dokumen
    headers.sort((a, b) => a.offsetTop - b.offsetTop);

    if (tocLinks.length === 0 || headers.length === 0) {
        console.log("ToC links or target headers not found. Exiting ToC script.");
        return; // Keluar jika tidak ada ToC atau heading ber-ID
    }

    let activeLink = null;
    // Offset: Jarak dari atas viewport. SESUAIKAN NILAI INI!
    const topOffset = 80; // Contoh penyesuaian, misal untuk header 60px

    function highlightTocLink() {
        let currentHeader = null;
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        // Cari heading terakhir yang posisi atasnya sudah dilewati scroll + offset
        // Iterasi mundur penting untuk logika ini
        for (let i = headers.length - 1; i >= 0; i--) {
            // Cek apakah header ada di DOM (kadang bisa hilang karena dynamic loading, dll)
            if (headers[i] && document.body.contains(headers[i])) {
                 if (headers[i].offsetTop <= scrollY + topOffset) {
                    currentHeader = headers[i];
                    break;
                 }
            }
        }

        const currentId = currentHeader ? currentHeader.id : null;
        let newActiveLink = null;

        if (currentId) {
             try {
                // Gunakan try-catch jika ID mungkin mengandung karakter khusus yang tidak valid untuk CSS selector
                newActiveLink = document.querySelector(`#TableOfContents a[href="#${CSS.escape(currentId)}"]`);
             } catch (e) {
                console.warn(`Could not select ToC link for ID "${currentId}":`, e);
             }
        }


        // Update kelas 'active' hanya jika link aktif berubah
        if (newActiveLink !== activeLink) {
            if (activeLink) {
                activeLink.classList.remove('active');
            }
            if (newActiveLink) {
                newActiveLink.classList.add('active');

                // Opsional: Scroll ToC agar link aktif terlihat
                const tocSidebar = document.querySelector(tocSidebarSelector);
                if (tocSidebar && tocSidebar.scrollHeight > tocSidebar.clientHeight) {
                    const linkRect = newActiveLink.getBoundingClientRect(); // Posisi relatif ke viewport
                    const sidebarRect = tocSidebar.getBoundingClientRect(); // Posisi sidebar relatif ke viewport

                    // Hitung posisi link relatif TERHADAP sidebar
                    const linkTopRelativeToSidebar = linkRect.top - sidebarRect.top;
                    const linkBottomRelativeToSidebar = linkTopRelativeToSidebar + newActiveLink.offsetHeight;

                    const sidebarScrollTop = tocSidebar.scrollTop;
                    const sidebarVisibleHeight = tocSidebar.clientHeight;

                    // Cek apakah link berada di luar area pandang ToC
                    if (linkTopRelativeToSidebar < 0 || linkBottomRelativeToSidebar > sidebarVisibleHeight) {
                         // Scroll ToC agar link aktif berada di tengah area pandang
                        tocSidebar.scrollTo({
                            top: sidebarScrollTop + linkTopRelativeToSidebar - (sidebarVisibleHeight / 2) + (newActiveLink.offsetHeight / 2),
                            behavior: 'smooth'
                        });
                    }
                }
            }
            activeLink = newActiveLink;
        }
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Gunakan debounce pada event scroll
    const debouncedHighlight = debounce(highlightTocLink, 50); // Delay 50ms

    window.addEventListener('scroll', debouncedHighlight, { passive: true });

    // Panggil sekali saat load untuk inisialisasi
    highlightTocLink();
});