/* =========================================
   JOURNEY — "Show more" toggle
========================================= */
document.querySelectorAll('.toggle-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const list = btn.previousElementSibling;
    if (!list || !list.classList.contains('milestone-desc')) return;

    const isOpen = list.classList.toggle('open');
    btn.textContent = isOpen ? 'Show less' : 'Show more';
    btn.setAttribute('aria-expanded', String(isOpen));
  });
});

/* =========================================
   JOURNEY — Scroll-triggered reveal
========================================= */
(() => {
  const milestones = document.querySelectorAll('.milestone');
  if (!milestones.length) return;

  if (!('IntersectionObserver' in window)) {
    milestones.forEach((item) => item.classList.add('reveal', 'visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  milestones.forEach((item) => {
    item.classList.add('reveal');
    observer.observe(item);
  });
})();

/* =========================================
   HERO — Scroll-driven gum bubble
========================================= */
(() => {
  const hero = document.getElementById('hero');
  const dino = document.getElementById('dinoStage');
  if (!hero || !dino) return;

  const POP_AT = 0.9;
  const POP_RESET = 0.86;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let target = 0;
  let shown = 0;
  let running = false;

  function progress() {
    const travel = hero.offsetHeight - window.innerHeight;
    if (travel <= 0) return 0;
    return Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / travel));
  }

  function draw(p) {
    const grow = Math.min(p / POP_AT, 1);
    const eased = grow * grow * (3 - 2 * grow); // smoothstep
    dino.style.setProperty('--bubble', (0.04 + 0.96 * eased).toFixed(3));

    if (p >= POP_AT) {
      dino.classList.add('popped');
    } else if (p < POP_RESET) {
      dino.classList.remove('popped');
    }
  }

  function tick() {
    shown += (target - shown) * 0.15;
    if (Math.abs(target - shown) < 0.0005) shown = target;
    draw(shown);
    if (shown !== target) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  function onScroll() {
    target = progress();
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  if (!reduceMotion) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    target = shown = progress();
    draw(shown);
  } else {
    dino.style.setProperty('--bubble', '0.8');
  }
})();

/* =========================================
   FAMILY — Scroll reveal
========================================= */
(() => {
  const familyElements = document.querySelectorAll('#family .family-reveal');
  if (!familyElements.length) return;

  if (!('IntersectionObserver' in window)) {
    familyElements.forEach((el) => el.classList.add('family-visible'));
    return;
  }

  const familyObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('family-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  familyElements.forEach((el) => familyObserver.observe(el));
})();

/* =========================================
   PHOTOGRAPHY — Lightbox
========================================= */
(() => {
  const galleryImages = Array.from(document.querySelectorAll('.photo-item img'));
  const lightbox = document.getElementById('photoLightbox');
  const lightboxImage = document.getElementById('photoLightboxImage');
  const lightboxCounter = document.getElementById('photoCounter');
  const closeButton = document.querySelector('.photo-close');
  const prevButton = document.querySelector('.photo-prev');
  const nextButton = document.querySelector('.photo-next');

  if (
    !galleryImages.length ||
    !lightbox ||
    !lightboxImage ||
    !lightboxCounter ||
    !closeButton ||
    !prevButton ||
    !nextButton
  ) {
    return;
  }

  let currentIndex = 0;
  let previousFocus = null;

  function updateLightbox() {
    const image = galleryImages[currentIndex];
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || 'Expanded photograph';
    lightboxCounter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(galleryImages.length).padStart(2, '0')}`;
  }

  function openLightbox(index) {
    currentIndex = index;
    previousFocus = document.activeElement;
    updateLightbox();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.removeAttribute('src');
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightbox();
  }

  function showPrevious() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }

  galleryImages.forEach((image, index) => {
    const item = image.closest('.photo-item');
    if (!item) return;
    item.addEventListener('click', () => openLightbox(index));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View photograph ${index + 1}`);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  nextButton.addEventListener('click', showNext);
  prevButton.addEventListener('click', showPrevious);
  closeButton.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('active')) return;

    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        showNext();
        break;
      case 'ArrowLeft':
        showPrevious();
        break;
      default:
        break;
    }
  });
})();

/* =========================================
   NAV — Active link highlighting
========================================= */
(() => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link a');
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      linkMap.set(href.slice(1), link);
    }
  });

  function setActive(id) {
    navLinks.forEach((link) => link.classList.remove('active'));
    const active = linkMap.get(id);
    if (active) active.classList.add('active');
  }

  if (!('IntersectionObserver' in window)) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
})();
