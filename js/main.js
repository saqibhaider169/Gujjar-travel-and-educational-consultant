/* ===================================================
   JS – MAIN SCRIPT
   Gujjar Travel & Education Consultant
   =================================================== */

/* ===== PRELOADER ===== */
let preloaderHid = false;
function hidePreloader() {
  if (preloaderHid) return;
  preloaderHid = true;
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden');
  }
  if(typeof initAOS === 'function') initAOS();
  if(typeof initCounters === 'function') initCounters();
  if(typeof createParticles === 'function') createParticles();
}

window.addEventListener('load', () => {
  setTimeout(hidePreloader, 500);
});

// Fallback if images take too long
setTimeout(hidePreloader, 2500);

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  // Scroll to top button
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks?.classList.toggle('open');
  document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
});
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== SCROLL TO TOP ===== */
document.getElementById('scrollTop')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== AOS – Simple Intersection Observer ===== */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  elements.forEach(el => observer.observe(el));
}

/* ===== COUNTER ANIMATION ===== */
function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const step = 50;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, step);
}

/* ===== PARTICLE GENERATOR ===== */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 15}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    container.appendChild(p);
  }
}

/* ===== TESTIMONIAL SLIDER ===== */
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
let currentSlide = 0;
let slideCount = 0;
let autoSlide;

if (track) {
  slideCount = track.children.length;
  // Build dots
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer?.appendChild(dot);
  }

  document.getElementById('prevTest')?.addEventListener('click', () => {
    goToSlide((currentSlide - 1 + slideCount) % slideCount);
    resetAutoSlide();
  });
  document.getElementById('nextTest')?.addEventListener('click', () => {
    goToSlide((currentSlide + 1) % slideCount);
    resetAutoSlide();
  });

  startAutoSlide();
}

function goToSlide(n) {
  currentSlide = n;
  if (track) track.style.transform = `translateX(-${n * 100}%)`;
  document.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === n);
  });
}

function startAutoSlide() {
  autoSlide = setInterval(() => {
    goToSlide((currentSlide + 1) % slideCount);
  }, 5000);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

/* ===== ACTIVE NAV LINK ===== */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else if (link !== document.querySelector('.nav-link.active')) {
    link.classList.remove('active');
  }
});

/* ===== TOAST NOTIFICATION ===== */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} toast-icon"></i>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ===== SMOOTH ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== FORM VALIDATION HELPER ===== */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#ef4444';
      field.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.12)';
      valid = false;
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.style.boxShadow = '';
      }, { once: true });
    }
  });
  return valid;
}

/* ===== LOCAL STORAGE AUTH HELPERS ===== */
const Auth = {
  isLoggedIn: () => !!localStorage.getItem('gte_user'),
  getCurrentUser: () => JSON.parse(localStorage.getItem('gte_user') || 'null'),
  login: (userData) => {
    localStorage.setItem('gte_user', JSON.stringify(userData));
    localStorage.setItem('gte_login_time', Date.now().toString());
  },
  logout: () => {
    localStorage.removeItem('gte_user');
    localStorage.removeItem('gte_login_time');
    window.location.href = 'index.html';
  },
  register: (userData) => {
    const users = JSON.parse(localStorage.getItem('gte_users') || '[]');
    const exists = users.find(u => u.email === userData.email);
    if (exists) return false;
    users.push({ ...userData, id: Date.now(), createdAt: new Date().toISOString(), applications: [] });
    localStorage.setItem('gte_users', JSON.stringify(users));
    return true;
  },
  findUser: (email, password) => {
    const users = JSON.parse(localStorage.getItem('gte_users') || '[]');
    return users.find(u => u.email === email && u.password === password) || null;
  }
};

window.Auth = Auth;
window.showToast = showToast;
window.validateForm = validateForm;
