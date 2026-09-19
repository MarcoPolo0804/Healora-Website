const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Smooth scroll for in-page nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        navMenu?.classList.remove('is-open');
        navToggle?.classList.remove('is-open');
        navToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Toast notifications (replaces alert())
const toastStack = document.getElementById('toast-stack');
function showToast(message) {
  if (!toastStack) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastStack.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('is-visible'));

  setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3500);
}

// Contact form (front-end only, no backend wired up yet)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thanks for reaching out! We will get back to you shortly.');
    contactForm.reset();
  });
}

// Newsletter form (front-end only, no backend wired up yet)
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('You are subscribed to Healora updates!');
    newsletterForm.reset();
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('main-nav');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Sticky header shrink/shadow on scroll
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

// Back-to-top button
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

// Scroll-reveal animations for content blocks
const revealTargets = document.querySelectorAll('.reveal');
if (revealTargets.length) {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((el) => revealObserver.observe(el));
  }
}

// Animated stat counters (e.g. 3.5k+, 120k+, 200+)
const counters = document.querySelectorAll('[data-count-to]');
if (counters.length) {
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || '';
    const isDecimal = el.dataset.countTo.includes('.');
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    if (prefersReducedMotion) {
      el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
    } else {
      requestAnimationFrame(step);
    }
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }
}

