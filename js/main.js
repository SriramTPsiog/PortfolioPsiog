
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