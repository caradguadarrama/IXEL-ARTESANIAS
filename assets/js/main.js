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

// Agrega esto a tu función initInteractions()
const cards = document.querySelectorAll('.origenes-card');

cards.forEach(card => {
    card.addEventListener('click', function() {
        // Opcional: Cerrar otras tarjetas antes de abrir esta
        // cards.forEach(c => { if(c !== card) c.classList.remove('is-flipped'); });
        
        this.classList.toggle('is-flipped');
    });
});
