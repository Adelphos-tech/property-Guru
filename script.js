// Simple interactivity for tabs and mobile nav

const tabs = document.querySelectorAll('.tab');
const searchInput = document.getElementById('search-input');
const placeholders = {
  buy: 'Search homes for sale by location, MRT, or project',
  rent: 'Search rentals by location, MRT, or project',
  new: 'Search new launches by project or location'
};

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const key = tab.getAttribute('data-tab');
    if (searchInput && placeholders[key]) {
      searchInput.placeholder = placeholders[key];
    }
    // Update ARIA
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    tabs.forEach((t, i) => t.setAttribute('tabindex', t === tab ? '0' : '-1'));
  });
});

// Keyboard arrow navigation for tabs
document.querySelector('.search-tabs')?.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const currentIndex = Array.from(tabs).findIndex(t => t.classList.contains('active'));
  if (currentIndex < 0) return;
  e.preventDefault();
  const nextIndex = e.key === 'ArrowRight' ? (currentIndex + 1) % tabs.length : (currentIndex - 1 + tabs.length) % tabs.length;
  tabs[nextIndex].click();
  tabs[nextIndex].focus();
});

const navToggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.getAttribute('data-open') === 'true';
    navList.setAttribute('data-open', String(!isOpen));
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

// Footer year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Mobile carousel controls
const cardsGrid = document.getElementById('cards-grid');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

function scrollCards(direction = 1) {
  if (!cardsGrid) return;
  const amount = Math.round(cardsGrid.clientWidth * 0.8) * direction;
  cardsGrid.scrollBy({ left: amount, behavior: 'smooth' });
}

if (prevBtn && nextBtn && cardsGrid) {
  prevBtn.addEventListener('click', () => scrollCards(-1));
  nextBtn.addEventListener('click', () => scrollCards(1));
}

// Hero carousel
const hero = document.querySelector('.hero-carousel');
const heroSlides = document.querySelectorAll('.hero-carousel .slide');
const heroDots = document.querySelectorAll('.hero-dot');
let heroIndex = 0;
let heroTimer;

function showHeroSlide(i) {
  heroSlides.forEach((s, idx) => s.classList.toggle('active', idx === i));
  heroDots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  heroIndex = i;
}

function nextHeroSlide() {
  const next = (heroIndex + 1) % heroSlides.length;
  showHeroSlide(next);
}

function startHeroTimer() {
  stopHeroTimer();
  heroTimer = setInterval(nextHeroSlide, 5000);
}
function stopHeroTimer() { if (heroTimer) clearInterval(heroTimer); }

heroDots.forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = Number(dot.getAttribute('data-hero-slide')) || 0;
    showHeroSlide(idx);
    startHeroTimer();
  });
});

if (heroSlides.length > 0) {
  startHeroTimer();
  if (hero) {
    hero.addEventListener('mouseenter', stopHeroTimer);
    hero.addEventListener('mouseleave', startHeroTimer);
  }
}

// Sticky header shadow on scroll
const onScroll = () => {
  if (window.scrollY > 8) document.body.classList.add('scrolled');
  else document.body.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Quick filters (visual toggle only)
document.querySelectorAll('.quick-filters .chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('active'));
});

// Favorite buttons toggle
document.querySelectorAll('.fav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const active = btn.classList.toggle('active');
    btn.setAttribute('aria-pressed', String(active));
    btn.textContent = active ? '❤' : '♡';
  });
});

// Sales enquiry widget
const launcher = document.getElementById('sales-launcher');
const dialog = document.getElementById('sales-dialog');
const overlay = document.getElementById('sales-overlay');
const closeBtn = document.getElementById('sales-close');
const form = document.getElementById('sales-form');
const nameInput = document.getElementById('sales-name');
const phoneInput = document.getElementById('sales-phone');
const countrySelect = document.getElementById('sales-country');
const questionInput = document.getElementById('sales-question');
const WEBHOOK_URL = 'https://dsadcdc.app.n8n.cloud/webhook/e6ca4a69-d3bd-433a-b3a6-9f36f1ab9bd6';

// Toasts
function showToast(message, type = 'success') {
  const root = document.getElementById('toast-root');
  if (!root) return alert(message);
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.role = 'status';
  el.innerHTML = `<span>${message}</span><button class="toast-close" aria-label="Close">×</button>`;
  root.appendChild(el);
  const close = () => { el.remove(); };
  el.querySelector('.toast-close')?.addEventListener('click', close);
  setTimeout(close, 3500);
}

// Notification dot on side toggle
function setNotify(flag) {
  const t = document.getElementById('sales-side-toggle');
  if (!t) return;
  t.classList.toggle('notify', !!flag);
  if (flag) localStorage.setItem('salesSideNotify', '1');
  else localStorage.removeItem('salesSideNotify');
}

function openSales() {
  if (!dialog || !overlay) return;
  dialog.hidden = false; overlay.hidden = false;
  dialog.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => nameInput?.focus(), 0);
}
function closeSales() {
  if (!dialog || !overlay) return;
  dialog.hidden = true; overlay.hidden = true;
  dialog.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  launcher?.focus();
}
launcher?.addEventListener('click', openSales);
document.getElementById('sales-hero-cta')?.addEventListener('click', openSales);
document.getElementById('sales-nav-cta')?.addEventListener('click', openSales);
document.getElementById('sales-sticky-btn')?.addEventListener('click', openSales);
closeBtn?.addEventListener('click', closeSales);
overlay?.addEventListener('click', closeSales);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !dialog?.hidden) closeSales(); });

// Suggestion chips fill the textarea
document.querySelectorAll('.sales-dialog .suggest-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const q = chip.getAttribute('data-question');
    if (q && questionInput) questionInput.value = q;
  });
});

// Mock submit handling
function toE164(countryCode, local) {
  const cc = String(countryCode || '').replace(/\D/g,'');
  const digits = String(local || '').replace(/\D/g,'');
  return '+' + cc + digits;
}

function validPhone(countryCode, local) {
  const digits = String(local || '').replace(/\D/g,'');
  const cc = String(countryCode);
  const rules = {
    '65': { min: 8, max: 8, pattern: /^[3689]\d{7}$/ }, // SG: 8 digits, common starts
    '60': { min: 9, max: 11 }, // MY
    '62': { min: 9, max: 13 }, // ID
    '63': { min: 9, max: 11 }, // PH
    '66': { min: 9, max: 9 },  // TH
    '84': { min: 9, max: 10 }, // VN
    '91': { min: 10, max: 10 }, // IN
  };
  const rule = rules[cc] || { min: 7, max: 15 };
  if (digits.length < rule.min || digits.length > rule.max) return false;
  if (rule.pattern && !rule.pattern.test(digits)) return false;
  return true;
}

function getUTM() {
  const params = new URLSearchParams(location.search || '');
  const pick = k => params.get(k) || undefined;
  return {
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
    utm_term: pick('utm_term'),
    utm_content: pick('utm_content'),
  };
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = nameInput?.value.trim();
  const country = countrySelect?.value || '65';
  const local = phoneInput?.value.trim();
  const question = questionInput?.value.trim();
  if (!name || !local || !question) { showToast('Please fill in name, phone, and your question.', 'error'); return; }
  if (!validPhone(country, local)) {
    phoneInput?.classList.add('invalid');
    phoneInput?.focus();
    showToast('Please enter a valid phone number for the selected country.', 'error');
    return;
  }
  phoneInput?.classList.remove('invalid');

  const phoneE164 = toE164(country, local);
  const submitBtn = dialog?.querySelector('.sales-submit');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

  try {
    const payload = {
      name,
      phone: phoneE164,
      question,
      countryCode: '+' + String(country),
      timestamp: new Date().toISOString(),
      source: 'propertyguru-home-clone',
      page: location.href,
      referrer: document.referrer || undefined,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: { w: window.screen.width, h: window.screen.height },
      tzOffsetMinutes: new Date().getTimezoneOffset(),
      utm: getUTM(),
    };
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Webhook error ' + res.status);
    showToast('Thanks! Our sales team will contact you soon.', 'success');
    closeSales();
    form.reset();
    setNotify(true);
  } catch (err) {
    console.error(err);
    showToast('Could not submit. Please try again.', 'error');
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Ask sales'; }
  }
});

// Side enquiry form (desktop floating)
const sideForm = document.getElementById('sales-side-form');
const sideName = document.getElementById('sales-side-name');
const sideCountry = document.getElementById('sales-side-country');
const sidePhone = document.getElementById('sales-side-phone');
const sideQuestion = document.getElementById('sales-side-question');
const sidePanel = document.getElementById('sales-side');
const sideToggle = document.getElementById('sales-side-toggle');

// Slide-in animation for side panel (desktop/tablet)
function maybeEnterSidePanel() {
  if (!sidePanel) return;
  const wide = window.matchMedia('(min-width: 641px)').matches;
  if (wide) {
    sidePanel.classList.add('enter');
    // Apply saved collapsed state
    const saved = localStorage.getItem('salesSideCollapsed');
    setCollapsed(saved === '1');
    if (localStorage.getItem('salesSideNotify') === '1') sideToggle?.classList.add('notify');
  } else {
    sidePanel.classList.remove('enter');
    setCollapsed(false);
  }
}
window.addEventListener('load', () => setTimeout(maybeEnterSidePanel, 250));
window.addEventListener('resize', () => maybeEnterSidePanel());

function setCollapsed(collapsed) {
  if (!sidePanel || !sideToggle) return;
  sidePanel.classList.toggle('collapsed', collapsed);
  sideToggle.setAttribute('aria-expanded', String(!collapsed));
  sideToggle.textContent = collapsed ? '‹' : '›';
  if (!collapsed) { sideToggle.classList.remove('notify'); localStorage.removeItem('salesSideNotify'); }
}

sideToggle?.addEventListener('click', () => {
  const nowCollapsed = !sidePanel.classList.contains('collapsed');
  setCollapsed(nowCollapsed);
  localStorage.setItem('salesSideCollapsed', nowCollapsed ? '1' : '0');
});

document.querySelectorAll('.sales-side .suggest-chips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const q = chip.getAttribute('data-question');
    if (q && sideQuestion) sideQuestion.value = q;
  });
});

sideForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = sideName?.value.trim();
  const country = sideCountry?.value || '65';
  const local = sidePhone?.value.trim();
  const question = sideQuestion?.value.trim();
  if (!name || !local || !question) { showToast('Please fill in name, phone, and your question.', 'error'); return; }
  if (!validPhone(country, local)) {
    sidePhone?.classList.add('invalid');
    sidePhone?.focus();
    showToast('Please enter a valid phone number for the selected country.', 'error');
    return;
  }
  sidePhone?.classList.remove('invalid');

  const payload = {
    name,
    phone: toE164(country, local),
    question,
    countryCode: '+' + String(country),
    timestamp: new Date().toISOString(),
    source: 'propertyguru-home-clone:side',
    page: location.href,
    referrer: document.referrer || undefined,
    userAgent: navigator.userAgent,
    language: navigator.language,
    screen: { w: window.screen.width, h: window.screen.height },
    tzOffsetMinutes: new Date().getTimezoneOffset(),
    utm: getUTM(),
  };

  const submitBtn = document.getElementById('sales-side-submit');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
  try {
    const res = await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Webhook error ' + res.status);
    showToast('Thanks! Our sales team will contact you soon.', 'success');
    sideForm.reset();
    setNotify(true);
  } catch (err) {
    console.error(err);
    showToast('Could not submit. Please try again.', 'error');
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Ask sales'; }
  }
});

// Auto-expand when focusing within the collapsed panel
sidePanel?.addEventListener('focusin', () => {
  if (sidePanel.classList.contains('collapsed')) setCollapsed(false);
});

// Show launcher earlier and on light scroll interaction
setTimeout(() => launcher?.classList.remove('hidden'), 3000);
let launcherShown = false;
window.addEventListener('scroll', () => {
  if (launcherShown) return;
  if (window.scrollY > 100) {
    launcher?.classList.remove('hidden');
    launcherShown = true;
  }
}, { passive: true });
