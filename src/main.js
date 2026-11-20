import './styles/main.css';
import { initScrollReveal } from './modules/scrollReveal.js';
import { initLoginModal } from './modules/loginModal.js';
import { initChatWidget } from './modules/chatWidget.js';
import { initLeadForm } from './modules/leadForm.js';

document.documentElement.classList.remove('no-js');
document.body.classList.remove('no-js');

initScrollReveal();
initLoginModal();
initChatWidget();
initLeadForm();
