export function initMobileNav() {
  const toggle = document.getElementById('mobile-nav-toggle');
  const panel = document.getElementById('mobile-nav-panel');
  const icon = document.getElementById('mobile-nav-icon');
  if (!toggle || !panel || !icon) return;

  function setOpen(open) {
    panel.classList.toggle('hidden', !open);
    panel.classList.toggle('flex', open);
    toggle.setAttribute('aria-expanded', String(open));
    icon.textContent = open ? 'close' : 'menu';
  }

  toggle.addEventListener('click', () => {
    setOpen(panel.classList.contains('hidden'));
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.classList.contains('hidden')) setOpen(false);
  });

  window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}
