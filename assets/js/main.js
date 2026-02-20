// assets/js/main.js

import { createNavbar, initNavbar } from './components/navbar.js';
import { createFooter } from './components/footer.js';
import { getCart } from './utils/storage.js';

/**
 * Inicializa la aplicación
 */
function init() {
  injectNavbar();
  injectFooter();
  updateCartCount();
}

/**
 * Inyecta el navbar en el contenedor
 */
function injectNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  
  if (navbarContainer) {
    navbarContainer.innerHTML = createNavbar();
    initNavbar();
  }
}

/**
 * Inyecta el footer en el contenedor
 */
function injectFooter() {
  const footerContainer = document.getElementById('footer-container');
  
  if (footerContainer) {
    footerContainer.innerHTML = createFooter();
  }
}

/**
 * Actualiza el contador del carrito
 */
function updateCartCount() {
  const cartBadge = document.getElementById('cart-count');
  
  if (cartBadge) {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartBadge.textContent = totalItems;
  }
}

/**
 * Expone función para actualizar carrito globalmente
 * Útil cuando se agrega un producto desde otra página
 */
window.updateCartCount = updateCartCount;

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

// Actualizar contador cuando se modifique el localStorage desde otra pestaña
window.addEventListener('storage', (event) => {
  if (event.key === 'cart') {
    updateCartCount();
  }
});

//LANDING PAGE
const hero = document.querySelector('.hero');
const button = document.querySelector('.btn-ver-mas');

window.addEventListener('scroll', () => {
    const heroRect = hero.getBoundingClientRect();
    const heroHeight = hero.offsetHeight;

    // If hero is in viewport
    if (heroRect.top <= 0 && heroRect.bottom >= 0) {

        // how much we scrolled inside hero
        const scrollInsideHero = Math.abs(heroRect.top);

        // limit movement so it stops before hero ends
        const maxMove = heroHeight * 0.4; 

        const move = Math.min(scrollInsideHero * 0.3, maxMove);

        button.style.transform = `translateY(-${move}px)`;
    }
});
