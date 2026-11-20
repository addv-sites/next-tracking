/**
 * Posts the quote-request form to a Google Apps Script Web App, which
 * appends the row to a Google Sheet and emails the sales inbox.
 * See apps-script/leads-webapp.gs + apps-script/README.md for setup.
 *
 * Apps Script Web Apps don't return CORS headers for `fetch`, so the
 * request is sent with mode: 'no-cors' (fire-and-forget: the browser
 * can't read the response body, but the POST still reaches the script).
 */
const WEBAPP_URL = import.meta.env.VITE_LEADS_WEBAPP_URL || '';

export function initLeadForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const submitBtn = document.getElementById('quote-form-submit');
  const submitLabel = document.getElementById('quote-form-submit-label');
  const status = document.getElementById('quote-form-status');

  function setStatus(message, tone) {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('hidden', 'text-secondary', 'text-error', 'text-on-surface-variant');
    status.classList.add(tone === 'error' ? 'text-error' : tone === 'ok' ? 'text-secondary' : 'text-on-surface-variant');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!WEBAPP_URL) {
      setStatus('El envío a Sheets aún no está configurado (falta VITE_LEADS_WEBAPP_URL). Llámanos al 55 8649 1565 mientras tanto.', 'error');
      return;
    }

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    payload.origen = 'landing-nextracking';
    payload.pagina = window.location.href;
    payload.fecha = new Date().toISOString();

    submitBtn?.setAttribute('disabled', 'true');
    if (submitLabel) submitLabel.textContent = 'Enviando...';

    try {
      await fetch(WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      setStatus('¡Gracias! Un asesor de Nextracking se comunicará contigo en menos de 15 minutos.', 'ok');
      form.reset();
    } catch (err) {
      setStatus('No pudimos enviar tu solicitud en línea. Llámanos directo al 55 8649 1565.', 'error');
    } finally {
      submitBtn?.removeAttribute('disabled');
      if (submitLabel) submitLabel.textContent = 'Enviar solicitud inmediata';
    }
  });
}
