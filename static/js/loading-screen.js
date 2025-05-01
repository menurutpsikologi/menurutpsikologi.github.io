
  let percent = 0;
  const interval = setInterval(() => {
    if (percent < 99) {
      percent += Math.floor(Math.random() * 3) + 1; // naik acak 1-3%
      if (percent > 99) percent = 99;
      document.getElementById("progress-percent").textContent = percent + "%";
    }
  }, 60);

  window.addEventListener('load', () => {
    clearInterval(interval);
    document.getElementById("progress-percent").textContent = "100%";
    setTimeout(() => {
      document.getElementById("loading-screen").style.display = "none";
    }, 500); // jeda sedikit sebelum menghilangkan loader
  });
