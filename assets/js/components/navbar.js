// assets/js/components/navbar.js

/**
 * Genera el HTML del navbar con SVGs inline
 * @returns {string} HTML del navbar completo
 */
export function createNavbar() {
  return `
    <!-- Cenefa decorativa superior -->
    <div class="navbar-border">
      <img src="/assets/img/icons/cenefa.png" alt="Cenefa decorativa" class="navbar-border__image">
    </div>

    <!-- Header principal -->
    <header class="navbar">
      <!-- Logo a la izquierda -->
      <div class="navbar__logo">
        <a href="/index.html" aria-label="Ir a inicio">
          <img 
            src="/assets/img/icons/Marca-de-agua2_negro.png" 
            alt="IXEL Artesanías" 
            class="navbar__logo-image navbar__logo-image--desktop"
          >
          <img 
            src="/assets/img/icons/x.png" 
            alt="IXEL" 
            class="navbar__logo-image navbar__logo-image--mobile"
          >
        </a>
      </div>

      <!-- Botón hamburguesa (solo móvil) -->
      <button class="navbar__hamburger" aria-label="Menú" aria-expanded="false">
        <span class="navbar__hamburger-line"></span>
        <span class="navbar__hamburger-line"></span>
        <span class="navbar__hamburger-line"></span>
      </button>

      <!-- Navegación principal (centro) -->
      <nav class="navbar__nav" aria-label="Navegación principal">
        <ul class="navbar__links">
          <li><a href="/index.html" class="navbar__link">Inicio</a></li>
          <li><a href="/pages/public/products.html" class="navbar__link">Productos</a></li>
          <li><a href="/pages/public/about.html" class="navbar__link">Nosotros</a></li>
          <li><a href="/pages/public/contact.html" class="navbar__link">Contacto</a></li>
        </ul>
      </nav>

      <!-- Íconos de acción (derecha) -->
      <div class="navbar__actions">
        <!-- Ícono de perfil -->
        <a href="/pages/user/profile.html" class="navbar__bubble" aria-label="Mi perfil">
          <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <!-- Ícono de carrito con badge -->
        <a href="/pages/user/cart.html" class="navbar__bubble navbar__bubble--cart" aria-label="Carrito de compras">
          <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2L7 6M17 2L19 6M7 6H19M19 6L20 20H4L5 6M10 10V16M14 10V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span id="cart-count" class="navbar__badge">0</span>
        </a>

        <!-- Ícono de teléfono -->
        <a href="tel:+523312345678" class="navbar__bubble" aria-label="Llamar">
          <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </header>
  `;
}

/**
 * Inicializa la funcionalidad del navbar después de inyectarlo
 */
export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const nav = document.querySelector('.navbar__nav');

  // Efecto de transparencia al hacer scroll
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar--transparent');
      } else {
        navbar.classList.remove('navbar--transparent');
      }
    });
  }

  // Toggle menú hamburguesa
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      
      hamburger.setAttribute('aria-expanded', !isExpanded);
      hamburger.classList.toggle('navbar__hamburger--active');
      nav.classList.toggle('navbar__nav--open');
    });

    // Cerrar menú al hacer click en un link
    const links = nav.querySelectorAll('.navbar__link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('navbar__hamburger--active');
        nav.classList.remove('navbar__nav--open');
      });
    });
  }

  // Resaltar enlace activo según la página actual
  highlightActiveLink();
}

/**
 * Resalta el enlace del navbar correspondiente a la página actual
 */
function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.navbar__link');
  
  links.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    if (currentPath === linkPath || currentPath.includes(linkPath)) {
      link.classList.add('navbar__link--active');
    }
  });
}