
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
// Hero: the dino walks and blows a bubble as you scroll
const hero = document.getElementById('hero');
const dino = document.getElementById('dinoStage');
const BURST_AT = 0.9; // pops at 90% of the hero's scroll distance
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let settleTimer;
let ticking = false;

function updateDino() {
  const travel = hero.offsetHeight - window.innerHeight;
  if (travel <= 0) return;

  const p = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / travel));
  const grow = Math.min(p / BURST_AT, 1);
  const eased = grow * grow * (3 - 2 * grow);
  const phase = p * Math.PI * 16; // 8 steps over the whole scroll
  const shake = grow > 0.8 ? Math.sin(phase * 6) * 0.02 * ((grow - 0.8) / 0.2) : 0;

  dino.classList.remove('settle');
  dino.style.setProperty('--p', p);
  dino.style.setProperty('--bubble', (0.04 + 0.96 * eased + shake).toFixed(3));
  dino.style.setProperty('--bob', (Math.abs(Math.sin(phase)) * 12).toFixed(1));
  dino.style.setProperty('--tilt', (Math.sin(phase) * 3).toFixed(1));
  dino.classList.toggle('popped', p >= BURST_AT);

  // when scrolling stops, he stops mid-step and settles back to the ground
  clearTimeout(settleTimer);
  settleTimer = setTimeout(() => {
    dino.classList.add('settle');
    dino.style.setProperty('--bob', 0);
    dino.style.setProperty('--tilt', 0);
  }, 150);
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateDino();
    ticking = false;
  });
}

if (!reduceMotion) {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateDino();
}