import { createNavbar } from './components/navbar.js';

// Inyectar el navbar en todas las páginas
document.addEventListener('DOMContentLoaded', () => {
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = createNavbar();
  }
});