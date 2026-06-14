'use strict';

const $ = id => document.getElementById(id);

/* ── Loader ─────────────────────────────────────────────────────── */
window.addEventListener('load', () =>
  setTimeout(() => $('loader').classList.add('hidden'), 1700)
);

/* ── Hero floating dots ─────────────────────────────────────────── */
(function() {
  const c = $('hero-dots');
  const pos = [
    [8,15],[82,22],[15,65],[90,70],[50,10],[35,80],[70,45],[5,90]
  ];
  pos.forEach(([l,t],i) => {
    const d = document.createElement('div');
    d.className = 'hdot';
    const sz = 6 + (i % 4) * 4;
    d.style.cssText = `width:${sz}px;height:${sz}px;left:${l}%;top:${t}%;animation-duration:${4+i*0.8}s;animation-delay:-${i*1.1}s`;
    c.appendChild(d);
  });
})();

/* ── Header scroll ──────────────────────────────────────────────── */
const header = $('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 40);
  $('btn-top').classList.toggle('visible', scrollY > 350);
}, { passive: true });

/* ── Back to top ────────────────────────────────────────────────── */
$('btn-top').addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

/* ── Hamburger sidebar ──────────────────────────────────────────── */
const ham = $('hamburger');
const menu = $('mob-menu');
const ovl  = $('mob-overlay');

function closeSidebar() {
  ham.classList.remove('open');
  menu.classList.remove('open');
  ovl.classList.remove('open');
  document.body.style.overflow = '';
  ham.setAttribute('aria-expanded', 'false');
}
ham.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  ham.classList.toggle('open', open);
  ovl.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  ham.setAttribute('aria-expanded', open);
});
ovl.addEventListener('click', closeSidebar);
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeSidebar));

/* ── Active nav on scroll ───────────────────────────────────────── */
const sIds = ['hero','about','skills','projects','education','contact'];
const navAs = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
      );
    }
  });
}, { threshold: .35 });
sIds.forEach(id => { const el = document.getElementById(id); if (el) secObs.observe(el); });

/* ── Scroll reveal ──────────────────────────────────────────────── */
let countersRun = false;
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Run skill bars
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      // Run counters once
      if (e.target.querySelector('.counter') && !countersRun) {
        countersRun = true;
        document.querySelectorAll('.counter').forEach(el => {
          const target = +el.dataset.target;
          const dur = 1600;
          const start = Date.now();
          const tick = setInterval(() => {
            const p = Math.min((Date.now() - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(target * eased) + (target > 10 ? '' : '+');
            if (p >= 1) { el.textContent = target + '+'; clearInterval(tick); }
          }, 16);
        });
      }
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revObs.observe(el));

/* ── Contact form ───────────────────────────────────────────────── */
$('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  let ok = true;
  const v = (id, errId, fn) => {
    const el = $(id), err = $(errId);
    const pass = fn(el.value.trim());
    err.style.display = pass ? 'none' : 'block';
    el.style.borderColor = pass ? '' : 'var(--red)';
    if (!pass) ok = false;
  };
  v('c-name',    'err-name',    s => s.length >= 2);
  v('c-email',   'err-email',   s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
  v('c-subject', 'err-subject', s => s.length >= 2);
  v('c-message', 'err-msg',     s => s.length >= 10);
  if (ok) {
    $('form-ok').style.display = 'block';
    this.reset();
    setTimeout(() => $('form-ok').style.display = 'none', 5000);
  }
});

/* ── Keyboard: category cards ───────────────────────────────────── */
document.querySelectorAll('[role="button"]').forEach(el =>
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
  })
);