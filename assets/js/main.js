// assets/js/main.js

import { createFooter } from './components/footer.js';
import { createNavbar, initNavbar } from './components/navbar.js';

// Inyectar el navbar en todas las páginas
document.addEventListener('DOMContentLoaded', () => {
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = createNavbar();
    // Inicializar funcionalidad del navbar DESPUÉS de inyectarlo
    initNavbar();
  }
  
  // Inyectar el footer en todas las páginas
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = createFooter();
  }

  // Actualizar contador del carrito si existe
  updateCartCount();
});

// Función para actualizar el contador del carrito
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
  }
}