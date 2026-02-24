// assets/js/components/pages/landingPage.js
//
// BUGS CORREGIDOS:
//
//   BUG 3 — Sin flujo de carrito (badge no subía, carrito no abría desde index):
//     Los botones generados usaban class="addCart" pero no existía ningún
//     import de addToCart, ningún listener de click y ningún dispatchEvent.
//     El badge no se actualizaba y el carrito lateral no se abría.
//     FIX: import de addToCart desde storage.js + listener delegado en document
//     que llama addToCart(product) y dispara StorageEvent({key:'cart'}).
//     Mismo flujo exacto que products.js — canal unificado.
//
//   BUG adicional — fetch con ruta relativa "productos_final.json":
//     Funciona desde /index.html pero falla si la página estuviera en un
//     subdirectorio. FIX: ruta absoluta '/productos_final.json'.
//
//   BUG adicional — scroll listener sin guard:
//     window.addEventListener('scroll') se registra aunque .hero o .btn-ver-mas
//     no existan → TypeError en cualquier página que cargue este módulo sin hero.
//     FIX: guard explícito antes de registrar el listener.

import { addToCart } from '../../utils/storage.js';
// ─── PARALLAX DEL HERO ─────────────────────────────────────────
// Guard: no registra el listener si los elementos no existen.

const hero   = document.querySelector('.hero');
const button = document.querySelector('.btn-ver-mas');

if (hero && button) {
  window.addEventListener('scroll', () => {
    const heroRect    = hero.getBoundingClientRect();
    const heroHeight  = hero.offsetHeight;

    if (heroRect.top <= 0 && heroRect.bottom >= 0) {
      const scrollInsideHero = Math.abs(heroRect.top);
      const maxMove          = heroHeight * 0.4;
      const move             = Math.min(scrollInsideHero * 0.3, maxMove);
      button.style.transform = `translateY(-${move}px)`;
    }
  }, { passive: true });
}

// ─── CARRUSEL DE TOP PRODUCTS ──────────────────────────────────

const topTrack = document.querySelector('.top-carousel-track');
let topCards = Array.from(document.querySelectorAll('.top-card'));

const totalRealCards = topCards.length;
const cardWidthPercent = 33.3333;

const cards = Array.from(document.querySelectorAll('.top-card'));

let positions = ['left', 'center', 'right', 'hidden'];

/* ---------------- RENDER ---------------- */

function renderCarousel() {
  cards.forEach(card => {
    card.classList.remove('left', 'center', 'right', 'hidden');
  });

  if (cards[0]) cards[0].classList.add('left');
  if (cards[1]) cards[1].classList.add('center');
  if (cards[2]) cards[2].classList.add('right');
  if (cards[3]) cards[3].classList.add('hidden');
}

/* ---------------- ROTATE ---------------- */

function rotateCarousel() {
  const first = cards.shift();
  cards.push(first);
  renderCarousel();
}

/* ---------------- INTERVAL CONTROL (FIXED) ---------------- */

let carouselInterval = null;

function startAutoRotate() {
  if (carouselInterval !== null) return; // already running
  carouselInterval = setInterval(rotateCarousel, 2500);
}

function stopAutoRotate() {
  if (carouselInterval === null) return; // already stopped
  clearInterval(carouselInterval);
  carouselInterval = null;
}

/* ---------------- INIT ---------------- */

renderCarousel();
startAutoRotate();

/* ---------------- DESKTOP HOVER ---------------- */

function isMobile() {
  return window.innerWidth <= 768;
}

if (!isMobile()) {
  topTrack.addEventListener('mouseenter', stopAutoRotate);
  topTrack.addEventListener('mouseleave', startAutoRotate);
}

/* ---------------- MOBILE CLICK ---------------- */

cards.forEach(card => {
  card.addEventListener('click', () => {
    if (!isMobile()) return;

    const isFlipped = card.classList.contains('flipped');

    // First: unflip everything
    cards.forEach(c => c.classList.remove('flipped'));

    if (isFlipped) {
      // It was flipped → now everything is unflipped → resume
      startAutoRotate();
    } else {
      // It was not flipped → flip this one → pause
      card.classList.add('flipped');
      stopAutoRotate();
    }
  });
});

// ─── PRODUCTOS DESTACADOS ──────────────────────────────────────
// Ruta absoluta para que funcione desde cualquier profundidad de URL.
// Guarda el catálogo en localStorage['products'] para que checkout.js
// y cart.js puedan cruzar datos de imagen/nombre por ID.

document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.getElementById('cards');
  if (!cardsContainer) return;

  fetch('/productos_final.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(products => {
      localStorage.setItem('products', JSON.stringify(products));

      const selectedIds      = [1, 3, 4];
      const selectedProducts = products.filter(p => selectedIds.includes(p.id));

      selectedProducts.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-4';
        col.innerHTML = `
          <div class="product-card-landing">
      <div class="product-image-container favorite">
        <img src="${product.imagen}" alt="${product.name}">
      </div>
      <h5 class="product-name">${product.name}</h5>
      <p class="product-price">$${product.price}</p>
       <p class="desc">${product.description}</p>
      <button class="button-ixel-rojo addCart" data-id="${product.id}">
        Comprar
      </button>
      <a href="#" class="learn-more">→ Learn More</a>
    </div>
        `;
        cardsContainer.appendChild(col);
      });
    })
    .catch(err => console.error('[landingPage] Error cargando productos:', err));
});

// ─── DELEGACIÓN: AGREGAR AL CARRITO ────────────────────────────
// Listener único en document para todos los botones .addCart.
// Mismo canal que products.js:
//   addToCart(product) → StorageEvent({key:'cart'})
//   → main.js actualiza badge del navbar
//   → cart.js re-renderiza y abre el carrito lateral

document.addEventListener('click', e => {
  const btn = e.target.closest('.addCart');
  if (!btn) return;

  // Leer el catálogo que se guardó al cargar los productos
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const product  = products.find(p => String(p.id) === String(btn.dataset.id));

  if (!product) {
    console.warn('[landingPage] Producto no encontrado:', btn.dataset.id);
    return;
  }

  addToCart(product);

  // Canal unificado — main.js y cart.js escuchan este evento
  window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
  // Feedback visual breve
  const original = btn.textContent.trim();
  btn.textContent = '✓';
  setTimeout(() => { btn.textContent = original; }, 1000);

});