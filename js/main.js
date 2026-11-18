// "Show more" toggle
document.querySelectorAll('.toggle-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const list = btn.previousElementSibling;
    const isOpen = list.classList.toggle('open');
    btn.textContent = isOpen ? 'Show less' : 'Show more';
  });
});

// Scroll-triggered reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.milestone').forEach((item) => {
  item.classList.add('reveal');
  observer.observe(item);
});

// Hero: the dino stands still while the gum inflates and bursts as you scroll
(() => {
  const hero = document.getElementById('hero');
  const dino = document.getElementById('dinoStage');
  if (!hero || !dino) return;

  const POP_AT = 0.9;     // the gum bursts at 90% of the hero's scroll distance
  const POP_RESET = 0.86; // scrolling back up un-bursts a little earlier, so it never flickers
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
    const eased = grow * grow * (3 - 2 * grow);
    dino.style.setProperty('--bubble', (0.04 + 0.96 * eased).toFixed(3));
    if (p >= POP_AT) dino.classList.add('popped');
    else if (p < POP_RESET) dino.classList.remove('popped');
  }

  // glide toward the scroll position, so a mouse-wheel notch never makes the bubble jump
  function tick() {
    shown += (target - shown) * 0.15;
    if (Math.abs(target - shown) < 0.0005) shown = target;
    draw(shown);
    if (shown !== target) requestAnimationFrame(tick);
    else running = false;
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
    window.addEventListener('resize', onScroll);
    target = shown = progress();
    draw(shown);
  }
})();


/* =========================================
   FAMILY SECTION INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const familyElements = document.querySelectorAll(
        "#family .family-reveal"
    );

    // Reveal elements when they enter the viewport
    if ("IntersectionObserver" in window) {

        const familyObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("family-visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        familyElements.forEach((element) => {
            familyObserver.observe(element);
        });

    } else {

        // Fallback for older browsers
        familyElements.forEach((element) => {
            element.classList.add("family-visible");
        });

    }

});


document.addEventListener("DOMContentLoaded", () => {

    const galleryImages = Array.from(
        document.querySelectorAll(".photo-item img")
    );

    const lightbox = document.getElementById("photoLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCounter = document.getElementById("lightboxCounter");

    const closeButton = document.querySelector(".lightbox-close");
    const prevButton = document.querySelector(".lightbox-prev");
    const nextButton = document.querySelector(".lightbox-next");

    let currentIndex = 0;
    let previousFocus = null;

    function updateLightbox() {
        const image = galleryImages[currentIndex];

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightboxCounter.textContent =
            `${String(currentIndex + 1).padStart(2, "0")} / ${String(galleryImages.length).padStart(2, "0")}`;
    }

    function openLightbox(index) {
        currentIndex = index;
        previousFocus = document.activeElement;

        updateLightbox();

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");

        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        lightboxImage.src = "";

        if (previousFocus) {
            previousFocus.focus();
        }
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateLightbox();
    }

    function showPrevious() {
        currentIndex =
            (currentIndex - 1 + galleryImages.length) % galleryImages.length;

        updateLightbox();
    }

    // Open clicked photograph
    galleryImages.forEach((image, index) => {
        image.closest(".photo-item").addEventListener("click", () => {
            openLightbox(index);
        });
    });

    // Navigation
    nextButton.addEventListener("click", showNext);
    prevButton.addEventListener("click", showPrevious);

    // Close
    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard controls
    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            showNext();
        }

        if (event.key === "ArrowLeft") {
            showPrevious();
        }
    });

});
