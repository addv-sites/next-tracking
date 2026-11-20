/**
 * UI-only login mockup — no real authentication. Demonstrates the future
 * monitoring console entry point for sales/demo purposes.
 */
export function initLoginModal() {
  const modal = document.getElementById('login-modal');
  if (!modal) return;

  const openTriggers = document.querySelectorAll('[data-open-login]');
  const closeTriggers = modal.querySelectorAll('[data-close-login]');
  const form = document.getElementById('login-form');
  const status = document.getElementById('login-form-status');
  const togglePassBtn = document.getElementById('login-toggle-pass');
  const togglePassIcon = document.getElementById('login-toggle-pass-icon');
  const passInput = document.getElementById('login-pass');
  let lastFocused = null;

  function open() {
    lastFocused = document.activeElement;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    const firstField = document.getElementById('login-user');
    if (firstField) firstField.focus();
  }

  function close() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  openTriggers.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  }));
  closeTriggers.forEach((btn) => btn.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) close();
  });

  if (togglePassBtn && passInput && togglePassIcon) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passInput.type === 'password';
      passInput.type = isPassword ? 'text' : 'password';
      togglePassIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
      togglePassBtn.setAttribute('aria-label', isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
  }

  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = 'Esta es una vista de demostración. Contrata un plan para recibir tus accesos reales a la consola.';
      status.classList.remove('hidden');
    });
  }
}
