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

import { addToCart } from '/assets/js/utils/storage.js';


//Carrusel del hero
// let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function changeSlide(direction) {
    // Quitar clase activa
    slides[currentSlide].classList.remove('active');
    
    // Calcular siguiente slide
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    // Añadir clase activa
    slides[currentSlide].classList.add('active');
}

// Opcional: Cambio automático cada 5 segundos
setInterval(() => changeSlide(1), 5000);



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

const cards     = Array.from(document.querySelectorAll('.top-card'));
let   positions = ['left', 'center', 'right', 'hidden'];

function renderCarousel() {
  cards.forEach((card, i) => {
    card.classList.remove('left', 'center', 'right', 'hidden');
    card.classList.add(positions[i % positions.length]);
  });
}

if (cards.length) {
  renderCarousel();
  setInterval(() => {
    positions.push(positions.shift());
    renderCarousel();
  }, 3000);
}

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
          <div class="product-card">
            <div class="product-image favorite">
              <img src="${product.imagen}" alt="${product.name}">
            </div>
            <h5 class="product-name">${product.name}</h5>
            <p class="product-price">$${product.price}</p>
            <button class="button-ixel-products addCart" data-id="${product.id}" type="button">
              +
            </button>
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

