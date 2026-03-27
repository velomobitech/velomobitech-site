
// --- i18n: language handling and DOM binding ---
const availableLangs = ['tr','en','hi'];
function resolveTranslation(lang, key) {
  if (!window.TRANSLATION_HELPER || !window.TRANSLATION_HELPER.get) return undefined;
  return window.TRANSLATION_HELPER.get(lang, key);
}

function applyTranslations(lang) {
  if (!availableLangs.includes(lang)) lang = 'tr';
  document.documentElement.lang = lang;

  // meta
  const title = resolveTranslation(lang, 'meta.title');
  if (title) document.title = title;
  const desc = resolveTranslation(lang, 'meta.description');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && desc) metaDesc.setAttribute('content', desc);

  // data-i18n (text)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = resolveTranslation(lang, key);
    if (val !== undefined) el.textContent = val;
  });

  // data-i18n-html (innerHTML)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = resolveTranslation(lang, key);
    if (val !== undefined) el.innerHTML = val;
  });

  // aria labels
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    const val = resolveTranslation(lang, key);
    if (val !== undefined) el.setAttribute('aria-label', val);
  });

  // placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = resolveTranslation(lang, key);
    if (val !== undefined) el.setAttribute('placeholder', val);
  });

  // update active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function setLanguage(lang) {
  localStorage.setItem('site_lang', lang);
  applyTranslations(lang);
}

function initLanguage() {
  const saved = localStorage.getItem('site_lang');
  if (saved && availableLangs.includes(saved)) return applyTranslations(saved);
  const nav = (navigator.language || navigator.userLanguage || 'tr').slice(0,2).toLowerCase();
  const pick = availableLangs.includes(nav) ? nav : 'tr';
  applyTranslations(pick);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  initLanguage();
});

// --- end i18n ---

const revealItems = document.querySelectorAll('.reveal');
const phoneStage = document.getElementById('phone-stage');
const showcaseStage = document.querySelector('.showcase-stage');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14 });

revealItems.forEach(item => revealObserver.observe(item));

function attachTilt(stageSelector, innerSelector, defaultTransform) {
  const stage = document.querySelector(stageSelector);
  const inner = document.querySelector(innerSelector);
  if (!stage || !inner || !window.matchMedia('(min-width: 861px)').matches) return;

  stage.addEventListener('mousemove', (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    inner.style.transform = `rotateY(${x * 12}deg) rotateX(${-(y * 8)}deg)`;
  });

  stage.addEventListener('mouseleave', () => {
    inner.style.transform = defaultTransform;
  });
}

attachTilt('.phone-stage', '.phone', 'rotateY(-10deg) rotateX(5deg)');
attachTilt('.showcase-stage', '.hero-panel', 'rotateY(0deg) rotateX(0deg)');
