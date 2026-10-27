import { business } from './data.js';
import './style.css';

const serviceList = document.querySelector('#service-list');
const serviceSelect = document.querySelector('#service-select');
serviceList.innerHTML = business.services.map((service) => `
  <article class="service-row">
    <div><h3>${service.name}</h3><p>${service.detail}</p><small>${service.duration} min · duración provisional</small></div>
    <div class="service-price"><span>${service.price} €</span><small>precio provisional</small></div>
    <button class="select-service" type="button" data-service="${service.id}" aria-label="Elegir ${service.name}">Elegir <span>↗</span></button>
  </article>`).join('');
serviceSelect.innerHTML = '<option value="">Elige un servicio</option>' + business.services.map((s) => `<option value="${s.id}">${s.name} · ${s.price} € (demo)</option>`).join('');

const dateSelect = document.querySelector('#date-select');
for (let offset = 2; offset <= 8; offset += 1) {
  const date = new Date(); date.setDate(date.getDate() + offset);
  const value = date.toISOString().slice(0, 10);
  const label = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  dateSelect.add(new Option(`${label} · demostración`, value));
}
document.querySelector('#year').textContent = new Date().getFullYear();

let step = 1;
let busy = false;
const formError = document.querySelector('#form-error');
const steps = [...document.querySelectorAll('.booking-step')];
document.querySelector('#booking-form').addEventListener('submit', (event) => event.preventDefault());
function showStep(next) {
  step = next;
  steps.forEach((element) => element.classList.toggle('active', element.dataset.step === String(next)));
  document.querySelectorAll('[data-step-dot]').forEach((dot) => {
    dot.classList.toggle('active', Number(dot.dataset.stepDot) <= (next === 'done' ? 3 : next));
  });
  formError.hidden = true;
  if (next !== 'done') document.querySelector(`#booking-form [data-step="${next}"] h3`)?.focus?.();
}
function selectedService() { return business.services.find((s) => s.id === serviceSelect.value); }
function validateStep() {
  let message = '';
  if (step === 1) {
    if (!selectedService()) message = 'Elige un servicio para continuar.';
    else if (!dateSelect.value || !document.querySelector('#time-select').value) message = 'Elige una fecha y una hora de demostración.';
  } else if (step === 2) {
    const name = document.querySelector('#name-input');
    const email = document.querySelector('#email-input');
    const phone = document.querySelector('#phone-input');
    if (!name.value.trim()) message = 'Escribe un nombre de ejemplo.';
    else if (!email.validity.valid || !email.value.trim()) message = 'Escribe un correo de ejemplo válido.';
    else if (!/^\+?[\d\s().-]{7,20}$/.test(phone.value.trim()) || phone.value.replace(/\D/g, '').length < 7) message = 'Escribe un teléfono de ejemplo con al menos 7 dígitos.';
  }
  if (message) { formError.textContent = message; formError.hidden = false; return false; }
  return true;
}
function fillSummary() {
  const service = selectedService();
  const date = new Date(`${dateSelect.value}T12:00:00`);
  document.querySelector('#summary-service').textContent = service.name;
  document.querySelector('#summary-datetime').textContent = `${new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(date)} · ${document.querySelector('#time-select').value}`;
  document.querySelector('#summary-name').textContent = document.querySelector('#name-input').value.trim();
  document.querySelector('#summary-price').textContent = `${service.price} € · provisional`;
}
document.querySelectorAll('.next-step').forEach((button) => button.addEventListener('click', () => {
  if (busy || !validateStep()) return;
  if (step === 1) showStep(2); else { fillSummary(); showStep(3); }
}));
document.querySelectorAll('.back-step').forEach((button) => button.addEventListener('click', () => { if (!busy) showStep(step - 1); }));
document.querySelectorAll('.select-service').forEach((button) => button.addEventListener('click', () => {
  serviceSelect.value = button.dataset.service;
  document.querySelector('#reserva').scrollIntoView({ behavior: 'smooth' });
  serviceSelect.focus({ preventScroll: true });
}));
document.querySelector('#confirm-demo').addEventListener('click', async () => {
  if (busy || !validateStep()) return;
  busy = true;
  const button = document.querySelector('#confirm-demo'); button.disabled = true; button.textContent = 'Completando…';
  await new Promise((resolve) => window.setTimeout(resolve, 350));
  showStep('done'); busy = false;
});
document.querySelector('#reset-booking').addEventListener('click', () => {
  document.querySelector('#booking-form').reset();
  showStep(1);
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { menuButton.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }));

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const animateWhenIdle = async () => {
    try {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('.reveal, .service-row').forEach((element) => {
        // Keep above-the-fold content untouched; animate only content not visible yet.
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        gsap.from(element, {
          opacity: 0,
          y: 18,
          duration: 0.65,
          ease: 'power2.out',
          onStart: () => { element.style.willChange = 'transform, opacity'; },
          onComplete: () => { element.style.willChange = ''; },
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
    } catch { /* Content remains visible and functional if animation chunks fail. */ }
  };
  if ('requestIdleCallback' in window) window.requestIdleCallback(animateWhenIdle, { timeout: 1800 });
  else window.setTimeout(animateWhenIdle, 600);
}
