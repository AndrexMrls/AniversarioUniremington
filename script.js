const confettiLayer = document.querySelector('#confetti-layer');
const particlesLayer = document.querySelector('#particles');
const imageFallbacks = document.querySelectorAll('img[data-fallback]');
const revealItems = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const header = document.querySelector('.site-header');
const imageLightbox = document.querySelector('.image-lightbox');
const lightboxImage = imageLightbox?.querySelector('img');
const lightboxClose = imageLightbox?.querySelector('.lightbox-close');

// Cambia estas rutas si decides usar otra carpeta para las fotografías reales.
const localPhotoFolder = 'img/';

const colors = ['#123f68', '#24516d', '#72d2ff', '#d7f4ff'];
const shapes = ['', 'circle', 'triangle'];

function createConfetti(amount = 42) {
  if (!confettiLayer) return;
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement('span');
    piece.className = `confetti ${shapes[index % shapes.length]}`;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty('--size', `${Math.floor(Math.random() * 7) + 5}px`);
    piece.style.setProperty('--color', colors[index % colors.length]);
    piece.style.setProperty('--duration', `${Math.floor(Math.random() * 16) + 18}s`);
    piece.style.setProperty('--delay', `${Math.random() * -20}s`);
    piece.style.setProperty('--sway', `${Math.floor(Math.random() * 150) - 75}px`);
    piece.style.setProperty('--rotation', `${Math.floor(Math.random() * 360)}deg`);
    fragment.appendChild(piece);
  }
  confettiLayer.appendChild(fragment);
}

function createParticles(amount = 24) {
  if (!particlesLayer) return;
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < amount; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * -9}s`;
    particle.style.animationDuration = `${Math.floor(Math.random() * 6) + 7}s`;
    particle.style.transform = `scale(${Math.random() * .7 + .5})`;
    fragment.appendChild(particle);
  }
  particlesLayer.appendChild(fragment);
}

function setupImageFallbacks() {
  imageFallbacks.forEach((image) => {
    image.addEventListener('error', () => {
      const fallback = image.dataset.fallback;
      if (!fallback || image.src === fallback) return;
      image.src = fallback;
    });
  });
}

function setupReveal() {
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  revealItems.forEach((item) => observer.observe(item));
}

function setupActiveNav() {
  const sections = [...document.querySelectorAll('main section[id]')];
  const updateActiveLink = () => {
    const current = sections.reduce((activeSection, section) => {
      if (window.scrollY + 180 >= section.offsetTop) return section;
      return activeSection;
    }, sections[0]);
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`));
    header.classList.toggle('scrolled', window.scrollY > 35);
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

function setupMobileMenu() {
  menuToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.forEach((link) => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));
}

function setupPhotoLightbox() {
  if (!imageLightbox || !lightboxImage) return;

  document.querySelectorAll('.evidence-photo').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const image = trigger.querySelector('img');
      if (!image) return;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      imageLightbox.showModal();
    });
  });

  lightboxClose?.addEventListener('click', () => imageLightbox.close());
  imageLightbox.addEventListener('click', (event) => {
    if (event.target === imageLightbox) imageLightbox.close();
  });
  imageLightbox.addEventListener('close', () => {
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
  });
}

createConfetti(window.matchMedia('(max-width: 650px)').matches ? 25 : 42);
createParticles(window.matchMedia('(max-width: 650px)').matches ? 14 : 24);
setupImageFallbacks();
setupReveal();
setupActiveNav();
setupMobileMenu();
setupPhotoLightbox();
