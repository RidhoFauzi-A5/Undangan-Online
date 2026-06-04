/* ============================================
   LUXURY WEDDING INVITATION — INTERACTIONS
   Ihsan Louise Firdaus & Arachu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element References ---
  const introCover    = document.getElementById('intro-cover');
  const btnOpen       = document.getElementById('btn-open-invitation');
  const mainContent   = document.getElementById('main-content');
  const heroBg        = document.getElementById('hero-bg');
  const musicPlayer   = document.getElementById('music-player');
  const bgMusic       = document.getElementById('bg-music');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  // --- State ---
  let isPlaying = false;
  let hasOpened = false;

  /* ============================================
     1. OPEN INVITATION
     ============================================ */
  btnOpen.addEventListener('click', () => {
    if (hasOpened) return;
    hasOpened = true;

    // Hide intro cover
    introCover.classList.add('hidden');

    // Show main content
    mainContent.style.display = 'block';

    // Trigger hero Ken Burns effect
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroBg.classList.add('loaded');
      });
    });

    // Show music player after a moment
    setTimeout(() => {
      musicPlayer.classList.add('visible');
    }, 1500);

    // Try auto-playing music
    tryPlayMusic();

    // Prevent body scroll during transition
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      document.body.style.overflow = '';
      // Scroll to hero
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1100);
  });

  /* ============================================
     2. MUSIC PLAYER
     ============================================ */
  function tryPlayMusic() {
    if (!bgMusic.src && bgMusic.querySelectorAll('source').length === 0) {
      // No music source provided — still animate the button
      return;
    }
    bgMusic.play().then(() => {
      isPlaying = true;
      musicPlayer.classList.add('playing');
    }).catch(() => {
      // Auto-play blocked — user can click the button
      isPlaying = false;
      musicPlayer.classList.remove('playing');
    });
  }

  musicPlayer.addEventListener('click', () => {
    if (!bgMusic.src && bgMusic.querySelectorAll('source').length === 0) {
      // Toggle visual state even without music
      isPlaying = !isPlaying;
      musicPlayer.classList.toggle('playing', isPlaying);
      return;
    }

    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      musicPlayer.classList.remove('playing');
    } else {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicPlayer.classList.add('playing');
      }).catch(() => {});
    }
  });

  // Keyboard support for music player
  musicPlayer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      musicPlayer.click();
    }
  });

  /* ============================================
     3. SCROLL REVEAL (Intersection Observer)
     ============================================ */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  /* ============================================
     4. GALLERY LIGHTBOX
     ============================================ */
  const galleryItems = document.querySelectorAll('.gallery-item img');

  galleryItems.forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      lightboxImg.src = '';
    }, 600);
  }

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ============================================
     5. COPY TO CLIPBOARD
     ============================================ */
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.dataset.copy;
      const label = btn.querySelector('span');

      try {
        await navigator.clipboard.writeText(textToCopy);
        btn.classList.add('copied');
        label.textContent = 'Tersalin!';

        setTimeout(() => {
          btn.classList.remove('copied');
          label.textContent = 'Salin Nomor';
        }, 2500);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          btn.classList.add('copied');
          label.textContent = 'Tersalin!';
          setTimeout(() => {
            btn.classList.remove('copied');
            label.textContent = 'Salin Nomor';
          }, 2500);
        } catch (err) {
          label.textContent = 'Gagal menyalin';
          setTimeout(() => {
            label.textContent = 'Salin Nomor';
          }, 2000);
        }
        document.body.removeChild(textarea);
      }
    });
  });

  /* ============================================
     6. SUBTLE PARALLAX ON SCROLL
     ============================================ */
  let ticking = false;

  function handleParallax() {
    const scrollY = window.scrollY;

    // Hero parallax — slow image movement
    if (heroBg) {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        if (scrollY < heroBottom) {
          heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
        }
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleParallax);
      ticking = true;
    }
  }, { passive: true });

  /* ============================================
     7. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================
     8. HIDE SCROLL HINT ON SCROLL
     ============================================ */
  const scrollHint = document.querySelector('.hero-scroll-hint');
  let scrollHintHidden = false;

  window.addEventListener('scroll', () => {
    if (!scrollHintHidden && window.scrollY > 100) {
      scrollHintHidden = true;
      if (scrollHint) {
        scrollHint.style.transition = 'opacity 0.6s ease';
        scrollHint.style.opacity = '0';
      }
    }
  }, { passive: true });

});
