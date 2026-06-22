/* ============================================================
   SCRIPT.JS — Birthday Website untuk Nduk ❤️
   Berisi: Loading, Stars, Musik, Galeri, Timeline, Countdown, Kejutan
   ============================================================ */

// ── TUNGGU SAMPAI DOM SIAP ────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ── 1. LOADING SCREEN ──────────────────────────────────
  // Tampilkan loading screen selama ~2.5 detik, lalu hilangkan
  const loadingScreen = document.getElementById("loading-screen");

  setTimeout(() => {
    loadingScreen.classList.add("fade-out");
    // Setelah animasi selesai, sembunyikan elemen
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 800);
  }, 2500);

  // ── 2. BINTANG LATAR HERO ──────────────────────────────
  // Buat bintang-bintang kecil acak di belakang hero
  const starsContainer = document.getElementById("stars-container");

  function createStars(count = 60) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.classList.add("star");

      const size = Math.random() * 4 + 2; // 2–6px
      const x = Math.random() * 100; // posisi X %
      const y = Math.random() * 100; // posisi Y %
      const dur = Math.random() * 3 + 2; // durasi 2–5s
      const delay = Math.random() * 5; // delay 0–5s

      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        --dur: ${dur}s;
        --delay: ${delay}s;
      `;
      starsContainer.appendChild(star);
    }
  }
  createStars();

  // ── 3. TOMBOL "BUKA KEJUTAN" → TAMPILKAN MAIN CONTENT ──
  const openBtn = document.getElementById("open-surprise-btn");
  const mainContent = document.getElementById("main-content");
  const heroSection = document.getElementById("hero");

  openBtn.addEventListener("click", () => {
    // Animasi hero menghilang
    heroSection.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    heroSection.style.opacity = "0";
    heroSection.style.transform = "scale(0.97)";

    setTimeout(() => {
      heroSection.style.display = "none";
      mainContent.classList.remove("hidden");
      // Scroll ke atas konten utama
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  });

  // ── 4. MUSIK LATAR ──────────────────────────────────────
  const bgMusic = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");
  const letterMusicBtn = document.getElementById("letter-music-btn");
  let isPlaying = false;

  // Fungsi toggle musik
  function toggleMusic() {
    if (isPlaying) {
      bgMusic.pause();
      musicBtn.textContent = "🎵";
      musicBtn.classList.remove("playing");
      isPlaying = false;
    } else {
      bgMusic.play().catch(() => {
        // Browser memblokir autoplay — tidak ada masalah
        console.warn("Autoplay diblokir browser. Klik tombol untuk memutar.");
      });
      musicBtn.textContent = "🎶";
      musicBtn.classList.add("playing");
      isPlaying = true;
    }
  }

  // Tombol musik floating di pojok kanan bawah
  document
    .getElementById("music-player")
    .addEventListener("click", toggleMusic);

  // Tombol musik di dalam surat
  letterMusicBtn.addEventListener("click", () => {
    toggleMusic();
    if (isPlaying) {
      letterMusicBtn.textContent = "⏸ Musik Sedang Diputar...";
    } else {
      letterMusicBtn.textContent = "🎵 Klik untuk Rasakan Musiknya";
    }
  });

  // ── 5. GALERI — LIGHTBOX ────────────────────────────────
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  // Buka lightbox saat foto diklik
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-src");
      lightboxImg.src = src;
      lightbox.classList.remove("hidden");
      document.body.style.overflow = "hidden"; // Cegah scroll saat lightbox terbuka
    });
  });

  // Tutup lightbox saat klik tombol ✕
  lightboxClose.addEventListener("click", closeLightbox);

  // Tutup lightbox saat klik di luar gambar
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Tutup lightbox dengan tombol Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  // ── 6. TIMELINE — REVEAL ON SCROLL ──────────────────────
  // Setiap item timeline muncul saat di-scroll ke area tampak
  const timelineItems = document.querySelectorAll(".timeline-item");

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          timelineObserver.unobserve(entry.target); // Hanya sekali
        }
      });
    },
    { threshold: 0.2 },
  );

  timelineItems.forEach((item) => timelineObserver.observe(item));

  // ── 7. COUNTDOWN ULANG TAHUN ────────────────────────────
  // GANTI tanggal ulang tahun berikutnya di sini (YYYY, bulan-1, hari)
  // Contoh: 21 Juni 2027 → new Date(2027, 5, 21, 0, 0, 0)
  const birthdayNext = new Date(2027, 5, 21, 0, 0, 0); // ← GANTI DI SINI

  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMinutes = document.getElementById("cd-minutes");
  const cdSeconds = document.getElementById("cd-seconds");

  // Fungsi format 2 digit
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  // Fungsi animasi flip angka
  function flipNumber(el, value) {
    const formatted = pad(value);
    if (el.textContent !== formatted) {
      el.classList.add("flip");
      el.textContent = formatted;
      setTimeout(() => el.classList.remove("flip"), 150);
    }
  }

  function updateCountdown() {
    const now = new Date();
    const diff = birthdayNext - now;

    if (diff <= 0) {
      // Sudah hari ulang tahun!
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMinutes.textContent = "00";
      cdSeconds.textContent = "00";
      document.querySelector(".countdown-message").textContent =
        "🎂 Selamat Ulang Tahun, Nduk! ❤️";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    flipNumber(cdDays, days);
    flipNumber(cdHours, hours);
    flipNumber(cdMinutes, minutes);
    flipNumber(cdSeconds, seconds);
  }

  updateCountdown(); // Langsung update
  setInterval(updateCountdown, 1000); // Update setiap detik

  // ── 8. TOMBOL KEJUTAN — CONFETTI & HATI ─────────────────
  const triggerBtn = document.getElementById("trigger-surprise");
  const surpriseMsg = document.getElementById("surprise-message");
  const confettiCanvas = document.getElementById("confetti-canvas");
  const ctx = confettiCanvas.getContext("2d");

  let confettiPieces = [];
  let heartPieces = [];
  let animFrameId = null;

  // Resize canvas mengikuti jendela
  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Kelas satu partikel confetti
  class Confetti {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * confettiCanvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 4;
      this.speed = Math.random() * 4 + 2;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.2;
      this.drift = (Math.random() - 0.5) * 2;
      // Warna-warna sesuai tema
      const colors = [
        "#FFB3CE",
        "#C9A6E8",
        "#D4AF7A",
        "#FFD6E7",
        "#E8D5F5",
        "#F0D89A",
        "#FF85A1",
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.y += this.speed;
      this.x += this.drift;
      this.angle += this.spin;
      if (this.y > confettiCanvas.height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      ctx.restore();
    }
  }

  // Kelas satu partikel hati melayang
  class Heart {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * confettiCanvas.width;
      this.y = confettiCanvas.height + 20;
      this.size = Math.random() * 24 + 12;
      this.speed = Math.random() * 2 + 1;
      this.drift = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.5 + 0.4;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -40) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = "#E8789A";
      ctx.font = `${this.size}px serif`;
      ctx.fillText("❤️", this.x, this.y);
      ctx.restore();
    }
  }

  // Inisialisasi partikel
  function initParticles() {
    confettiPieces = Array.from({ length: 120 }, () => new Confetti());
    heartPieces = Array.from({ length: 30 }, () => new Heart());
  }

  // Loop animasi partikel
  function animateParticles() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach((p) => {
      p.update();
      p.draw();
    });
    heartPieces.forEach((h) => {
      h.update();
      h.draw();
    });
    animFrameId = requestAnimationFrame(animateParticles);
  }

  // Hentikan animasi setelah 8 detik
  function stopParticles() {
    setTimeout(() => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }, 8000);
  }

  // Klik tombol kejutan
  triggerBtn.addEventListener("click", () => {
    // Sembunyikan tombol
    triggerBtn.style.display = "none";

    // Tampilkan pesan kejutan
    surpriseMsg.classList.remove("hidden");

    // Scroll ke pesan kejutan
    surpriseMsg.scrollIntoView({ behavior: "smooth", block: "center" });

    // Mulai animasi confetti & hati
    initParticles();
    animateParticles();
    stopParticles();

    // Putar musik otomatis saat kejutan (jika belum main)
    if (!isPlaying) {
      bgMusic
        .play()
        .then(() => {
          isPlaying = true;
          musicBtn.textContent = "🎶";
          musicBtn.classList.add("playing");
        })
        .catch(() => {});
    }
  });
}); // END DOMContentLoaded
