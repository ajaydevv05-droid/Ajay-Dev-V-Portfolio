/* ── HELPERS ── */
function id(name) { return document.getElementById(name); }

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* ── ALL DOM REFS DECLARED UP FRONT ── */
const cursorDot = id('cursorDot');
const cursorOutline = id('cursorOutline');
const heroSection = document.querySelector('[data-hero-section]');
const heroContent = id('heroContent');
const heroVisual = id('heroVisual');
const progressBar = id('scrollProgress');
const projectCards = document.querySelectorAll('[data-project-card]');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const floatingWidget = id('floatingAvatarWidget');
const scrollSectionLabel = id('scrollSectionLabel');
const backToTopBtn = id('backToTop');
const hamburgerBtn = id('hamburgerBtn');
const navMenu = id('navMenu');

const sectionLabelsMap = {
  home: '👋 Ajay Dev V', about: '📖 About Me', skills: '⚡ Technical Skills',
  projects: '🚀 Projects', journey: '⏳ My Journey', education: '🎓 Education',
  contact: "💬 Let's Connect"
};

/* ── PREMIUM CURSOR (smooth follow ring, glow, contextual label) ── */
const cursorGlow = id('cursorGlow');
const cursorLabel = id('cursorLabel');
if (cursorDot && cursorOutline && !isTouchDevice && !prefersReducedMotion) {
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let ox = mx, oy = my, gx = mx, gy = my;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    document.body.classList.add('cursor-active');
    cursorDot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
    const labelled = e.target.closest && e.target.closest('[data-cursor]');
    if (labelled && cursorLabel) {
      cursorLabel.textContent = labelled.dataset.cursor;
      document.body.classList.add('cursor-label-on');
    } else {
      document.body.classList.remove('cursor-label-on');
    }
    const interactive = e.target.closest && e.target.closest('a, button, input, textarea, [data-tilt], .skill-category-card, .project-featured-card');
    document.body.classList.toggle('cursor-hover', !!interactive);
  });
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  (function loop() {
    ox += (mx - ox) * 0.18; oy += (my - oy) * 0.18;
    gx += (mx - gx) * 0.07; gy += (my - gy) * 0.07;
    cursorOutline.style.transform = `translate3d(${ox}px, ${oy}px, 0) translate(-50%, -50%)`;
    if (cursorGlow) cursorGlow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
}

/* ── CARD SPOTLIGHT ── */
document.querySelectorAll('.skill-category-card, .edu-card, .info-card, .project-featured-card, .timeline-card').forEach(el => {
  el.classList.add('spotlight');
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ── COUNT-UP NUMBERS ── */
const countObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = parseInt(el.dataset.count, 10) || 0;
    obs.unobserve(el);
    if (prefersReducedMotion) { el.textContent = target; return; }
    const start = performance.now(), dur = 1400;
    (function step(now) {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    })(start);
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

/* ── MASKED TEXT REVEAL SETUP ── */
function initTextReveals() {
  document.querySelectorAll('[data-text-reveal]').forEach(el => {
    const text = el.textContent.trim();
    if (!text) return;
    el.textContent = '';
    el.classList.add('reveal-text-mask');
    text.split(/\s+/).forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word-reveal-span';
      span.textContent = word;
      span.style.transitionDelay = `${i * 0.05}s`;
      el.appendChild(span);
    });
  });
}
initTextReveals();

/* ── SCROLL ENGINE ── */
let latestScrollTop = window.scrollY || 0;
let ticking = false;

function onScroll() {
  latestScrollTop = window.scrollY || document.documentElement.scrollTop;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateScrollAnimations);
  }
}

function updateActiveSection() {
  let current = '';
  const pos = latestScrollTop + 160;
  sections.forEach(sec => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href').replace('#', '') === current);
  });

  if (floatingWidget && scrollSectionLabel) {
    const show = latestScrollTop > 300;
    floatingWidget.classList.toggle('show', show);
    if (show) scrollSectionLabel.textContent = sectionLabelsMap[current] || 'Ajay Dev V';
  }
  if (backToTopBtn) backToTopBtn.classList.toggle('show', latestScrollTop > 400);
}

function updateScrollAnimations() {
  ticking = false;
  const wh = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight - wh;
  const ratio = docHeight > 0 ? Math.min(1, Math.max(0, latestScrollTop / docHeight)) : 0;

  if (progressBar) progressBar.style.width = `${ratio * 100}%`;
  updateActiveSection();

  // Heading word reveals
  document.querySelectorAll('[data-text-reveal]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < wh * 0.88 && r.bottom > 0) {
      el.querySelectorAll('.word-reveal-span').forEach(w => w.classList.add('word-revealed'));
    }
  });

  // Project cards + tech tags (fire once)
  projectCards.forEach(card => {
    const r = card.getBoundingClientRect();
    if (r.top < wh * 0.88 && r.bottom > 0 && !card.classList.contains('card-focused')) {
      card.classList.add('card-focused');
      card.querySelectorAll('[data-tech-tag]').forEach((tag, i) => {
        setTimeout(() => tag.classList.add('tag-visible'), i * 80);
      });
    }
  });

  if (prefersReducedMotion) return;

  // Hero fade / scale on scroll
  if (heroSection && heroContent) {
    const heroHeight = heroSection.offsetHeight || wh;
    const p = Math.min(1, Math.max(0, latestScrollTop / (heroHeight * 0.85)));
    const opacity = Math.max(0, 1 - p * 1.15);
    heroContent.style.transform = `translate3d(0, ${-p * 70}px, 0) scale(${1 - p * 0.08})`;
    heroContent.style.opacity = opacity;
    heroContent.style.filter = p * 6 > 0.1 ? `blur(${p * 6}px)` : 'none';
    if (heroVisual) {
      heroVisual.style.transform = `translate3d(0, ${-p * 100}px, 0) scale(${1 - p * 0.06})`;
      heroVisual.style.opacity = opacity;
    }
  }

  // Image parallax inside project cards
  projectCards.forEach(card => {
    const r = card.getBoundingClientRect();
    const img = card.querySelector('[data-parallax-image]');
    if (img && r.top < wh && r.bottom > 0) {
      const offset = (r.top + r.height / 2 - wh / 2) * -0.08;
      img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

/* ── SCROLL-TO-TOP ── */
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
if (floatingWidget) floatingWidget.addEventListener('click', toTop);
if (backToTopBtn) backToTopBtn.addEventListener('click', toTop);

/* ── MOBILE MENU ── */
if (hamburgerBtn && navMenu) {
  hamburgerBtn.addEventListener('click', () => navMenu.classList.toggle('open'));
  navLinks.forEach(l => l.addEventListener('click', () => navMenu.classList.remove('open')));
}

/* ── GENERAL REVEAL OBSERVER ── */
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
    setTimeout(() => el.classList.add('visible'), delay);
    observer.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal-item').forEach(el => revealObserver.observe(el));

/* ── 3D TILT + MAGNETIC BUTTONS ── */
if (!isTouchDevice && !prefersReducedMotion) {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -12;
      const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 12;
      el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    });
  });

  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate3d(${x * 0.18}px, ${y * 0.18}px, 0)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate3d(0,0,0)'; });
  });
}

/* ── CONTACT FORM (opens visitor's email app) ── */
function handleFormSubmit(event) {
  event.preventDefault();
  const name = id('userName').value.trim();
  const email = id('userEmail').value.trim();
  const message = id('userMessage').value.trim();
  const responseDiv = id('formResponse');

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:ajaydevv05@gmail.com?subject=${subject}&body=${body}`;

  if (responseDiv) {
    responseDiv.className = 'form-response success';
    responseDiv.textContent = '✓ Opening your email app. Just press send to deliver the message.';
  }
}

/* ── PROJECTS SLIDER ── */
(function initSlider() {
  const track = id('sliderTrack');
  if (!track) return;
  const slides = Array.from(track.children);
  const prev = id('sliderPrev'), next = id('sliderNext'), dotsWrap = id('sliderDots');
  let index = 0;

  const dots = slides.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'slider-dot';
    d.setAttribute('aria-label', `Go to project ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    return d;
  });

  function goTo(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[index].offsetLeft, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  function sync() {
    const step = slides[0].offsetWidth + (parseFloat(getComputedStyle(track).columnGap) || 0);
    index = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / step)));
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === slides.length - 1;
  }

  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', () => { goTo(index); sync(); });
  if (prev) prev.addEventListener('click', () => goTo(index - 1));
  if (next) next.addEventListener('click', () => goTo(index + 1));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
  });

  // mouse drag (touch uses native swipe)
  let down = false, startX = 0, startLeft = 0, moved = false;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.target.closest('a, button')) return;
    down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) { moved = true; track.classList.add('dragging'); }
    track.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false;
    track.classList.remove('dragging');
    if (moved) goTo(index);
  });


  // auto-slide
  const DELAY = 4500;
  let timer = null, inView = false;
  const stopAuto = () => { clearInterval(timer); timer = null; };
  const startAuto = () => {
    stopAuto();
    if (prefersReducedMotion || !inView || slides.length < 2) return;
    timer = setInterval(() => goTo(index >= slides.length - 1 ? 0 : index + 1), DELAY);
  };
  [track, track.closest('.projects-slider').querySelector('.slider-controls')].forEach(el => {
    el.addEventListener('mouseenter', stopAuto);
    el.addEventListener('mouseleave', startAuto);
    el.addEventListener('focusin', stopAuto);
    el.addEventListener('focusout', startAuto);
  });
  track.addEventListener('touchstart', stopAuto, { passive: true });
  track.addEventListener('touchend', () => setTimeout(startAuto, 3000), { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? stopAuto() : startAuto());
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? startAuto() : stopAuto(); }, { threshold: 0.35 }).observe(track);

  sync();
})();

/* ── THEME SWITCHER ── */
(function initTheme() {
  const btn = id('themeBtn'), menu = id('themeMenu');
  if (!btn || !menu) return;
  const opts = Array.from(menu.querySelectorAll('[data-theme-pick]'));
  function apply(t, save) {
    document.documentElement.setAttribute('data-theme', t);
    opts.forEach(o => o.classList.toggle('active', o.dataset.themePick === t));
    if (save) { try { localStorage.setItem('portfolio-theme-v2', t); } catch (e) {} }
  }
  let saved = 'blush';
  try { saved = localStorage.getItem('portfolio-theme-v2') || 'blush'; } catch (e) {}
  if (!opts.some(o => o.dataset.themePick === saved)) saved = 'blush';
  apply(saved, false);
  const close = () => { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  opts.forEach(o => o.addEventListener('click', () => { apply(o.dataset.themePick, true); close(); }));
  document.addEventListener('click', (e) => { if (!menu.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

/* ── INITIAL RUN: must stay LAST, after every const above exists ── */
updateScrollAnimations();