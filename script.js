// ============================================================
// DATOS WEBSITE — script.js
// Nav · Mobile menu · Scroll reveal · FAQ · Forms · Newsletter
// Back to top · Active nav link · Hamburger animation
// ============================================================

// ── NAV shadow on scroll ─────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.08)' : '';
});

// ── Hamburger + mobile menu ──────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ── Active nav link from current page ───────────────────────
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
})();

// ── Scroll reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── FAQ accordion ────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer   = item.querySelector('.faq-answer');
  if (!question || !answer) return;
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-answer').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ── Contact form — mailto ────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn     = this.querySelector('button[type="submit"]');
    const success = document.getElementById('formSuccess');
    const get = (n) => { const el = this.querySelector(`[name="${n}"]`); return el ? el.value.trim() : ''; };
    const name     = get('name');
    const email    = get('email');
    const phone    = get('phone');
    const interest = get('interest');
    const message  = get('message');
    const subject  = encodeURIComponent(`DatOS Enquiry: ${interest}`);
    const body     = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interest}\n\nMessage:\n${message}`);
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      window.location.href = `mailto:datoshub.ng@gmail.com?subject=${subject}&body=${body}`;
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      if (success) {
        success.classList.add('visible');
        contactForm.reset();
        setTimeout(() => success.classList.remove('visible'), 5000);
      }
    }, 600);
  });
}

// ── Newsletter form ──────────────────────────────────────────
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email   = this.querySelector('[name="email"]').value.trim();
    const success = document.getElementById('newsletterSuccess');
    const btn     = this.querySelector('button[type="submit"]');
    btn.textContent = 'Subscribing…';
    btn.disabled = true;
    // mailto fallback — sends email to DatOS with the subscriber's address
    const subject = encodeURIComponent('New newsletter subscriber');
    const body    = encodeURIComponent(`New subscriber: ${email}`);
    setTimeout(() => {
      window.location.href = `mailto:datoshub.ng@gmail.com?subject=${subject}&body=${body}`;
      btn.textContent = 'Subscribe';
      btn.disabled = false;
      if (success) { success.classList.add('show'); newsletterForm.reset(); }
    }, 600);
  });
}

// ── Back to top ──────────────────────────────────────────────
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Smooth anchor scroll ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── Dynamic next batch date ──────────────────────────────────
// Always shows the 1st of next month, so the site never goes stale.
// Logic: if today is the 1st–10th of the month, show THIS month
// (batch just opened). After the 10th, show NEXT month.
(function setNextBatchDate() {
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  const today = new Date();
  const day   = today.getDate();
  // If we're past the 10th, the current batch is filling — show next month
  const offset = day > 10 ? 1 : 0;
  const target = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const label  = `${months[target.getMonth()]} ${target.getFullYear()}`;
  document.querySelectorAll('.next-batch-date').forEach(el => {
    el.textContent = label;
  });
})();

// ── Hero bar animations — restart on first viewport entry ───
const heroBars = document.querySelectorAll('.hero__bar-fill');
if (heroBars.length) {
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'none';
        void entry.target.offsetWidth;
        entry.target.style.animation = '';
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  heroBars.forEach(b => barObserver.observe(b));
}
