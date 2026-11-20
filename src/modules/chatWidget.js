const REPLIES = [
  {
    match: /tracto|precio|cotizar/,
    text: 'El paquete para Tractocamión incluye equipo industrial 4G LTE, paro de motor y 1 año de plataforma completa por solo $7,500 MXN sin mensualidades forzosas. ¿Te gustaría agendar una instalación?',
  },
  {
    match: /paro|motor/,
    text: 'El paro de motor se activa con 1 toque desde la app móvil. Es progresivo para evitar accidentes y bloquea el encendido hasta que tú lo autorices nuevamente.',
  },
  {
    match: /humano|asesor|whatsapp/,
    text: "¡Perfecto! Puedes contactar a nuestro equipo comercial por WhatsApp dando clic en: <a href='https://wa.me/525586491565' target='_blank' rel='noopener' class='underline font-bold text-primary'>Enviar WhatsApp al 55 8649 1565</a>.",
  },
];
const DEFAULT_REPLY = 'Con gusto. Te canalizamos de inmediato con un especialista técnico de Nextracking o puedes llamarnos al 55 8649 1565.';

export function initChatWidget() {
  const chatBtn = document.getElementById('chat-toggle-btn');
  const demoOpenBtn = document.getElementById('open-demo-chat-btn');
  const chatWindow = document.getElementById('virtual-assistant-window');
  const closeBtn = document.getElementById('close-chat-btn');
  const messagesContainer = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-user-text');
  const quickOptionButtons = document.querySelectorAll('[data-quick-option]');

  if (!chatBtn || !chatWindow || !messagesContainer) return;

  function toggleChat() {
    const willOpen = chatWindow.classList.contains('hidden');
    chatWindow.classList.toggle('hidden');
    chatBtn.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) chatInput?.focus();
  }

  chatBtn.addEventListener('click', toggleChat);
  demoOpenBtn?.addEventListener('click', () => {
    chatWindow.classList.remove('hidden');
    chatBtn.setAttribute('aria-expanded', 'true');
    chatWindow.scrollIntoView({ behavior: 'smooth', block: 'end' });
    chatInput?.focus();
  });
  closeBtn?.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
    chatBtn.setAttribute('aria-expanded', 'false');
  });

  function appendUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'flex justify-end';
    const content = document.createElement('div');
    content.className = 'bg-primary-container text-on-primary p-space-sm rounded-2xl rounded-tr-none shadow-sm text-body-sm max-w-[85%]';
    content.textContent = text;
    bubble.appendChild(content);
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function respondBot(userQuery) {
    const queryLower = userQuery.toLowerCase();
    const matched = REPLIES.find((r) => r.match.test(queryLower));
    const reply = matched ? matched.text : DEFAULT_REPLY;

    const bubble = document.createElement('div');
    bubble.className = 'flex items-start gap-space-xs';
    bubble.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-primary-fixed/60 text-primary-container flex items-center justify-center shrink-0 mt-0.5">
        <span class="material-symbols-outlined text-sm" aria-hidden="true">satellite_alt</span>
      </div>
      <div class="bg-surface-container-lowest p-space-sm rounded-2xl rounded-tl-none shadow-sm text-body-sm text-on-surface max-w-[85%]">${reply}</div>
    `;
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  quickOptionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-quick-option') || '';
      appendUserMessage(text);
      setTimeout(() => respondBot(text), 500);
    });
  });

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (chatInput?.value || '').trim();
    if (!val) return;
    appendUserMessage(val);
    if (chatInput) chatInput.value = '';
    setTimeout(() => respondBot(val), 600);
  });
}
