document.querySelector('a[href="#list_h1"]').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#list_h1').scrollIntoView({
        behavior: 'smooth'
    });
});
