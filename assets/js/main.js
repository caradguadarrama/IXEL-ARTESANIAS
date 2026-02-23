// assets/js/main.js
// Orquestador global: inyecta navbar/footer, sincroniza carrito, parallax guard.

import { createNavbar, initNavbar } from './components/navbar.js';
import { createFooter }             from './components/footer.js';
import { getCart }                  from './utils/storage.js';
import { initSlidingCart }          from './components/pages/cart.js';

// ─── INYECCIÓN ────────────────────────────────────────────────

function injectNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;
  container.innerHTML = createNavbar();
  initNavbar();
  initSlidingCart();
  updateCartCount();
}

function injectFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;
  container.innerHTML = createFooter();
}

// ─── BADGE DEL CARRITO ────────────────────────────────────────
// Exportada para que slidingCart.js la importe sin duplicar lógica.
// Actualiza desktop (#cart-count) Y mobile (#cart-count-mobile).

export function updateCartCount() {
  const cart       = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const desktopBadge = document.getElementById('cart-count');
  const mobileBadge  = document.getElementById('cart-count-mobile');

  if (desktopBadge) desktopBadge.textContent = totalItems;
  if (mobileBadge)  mobileBadge.textContent  = totalItems;
}

// ─── PARALLAX DEL HERO ───────────────────────────────────────
// Guard explícito: solo corre si .hero existe.
// El original lanzaba TypeError en todas las páginas sin hero.

function initHeroParallax() {
  const hero   = document.querySelector('.hero');
  const button = document.querySelector('.btn-ver-mas');
  if (!hero || !button) return;

  window.addEventListener('scroll', () => {
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.top > 0 || heroRect.bottom < 0) return;

    const scrollInside = Math.abs(heroRect.top);
    const maxMove      = hero.offsetHeight * 0.4;
    const move         = Math.min(scrollInside * 0.3, maxMove);

    button.style.transform = `translateY(calc(-50% - ${move}px))`;
  }, { passive: true });
}

// ─── INIT ─────────────────────────────────────────────────────

function init() {
  injectNavbar();
  injectFooter();
  updateCartCount();
  initHeroParallax();
}

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('storage', e => {
  if (e.key === 'cart') updateCartCount();
});
