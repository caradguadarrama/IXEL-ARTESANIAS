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

      <!-- Navegación principal (centro en desktop, dentro del menú en mobile) -->
      <nav class="navbar__nav" aria-label="Navegación principal">
        <ul class="navbar__links">
          <li><a href="/index.html" class="navbar__link">Inicio</a></li>
          <li><a href="/pages/public/products.html" class="navbar__link">Productos</a></li>
          <li><a href="/pages/public/about.html" class="navbar__link">Nosotros</a></li>
          <li><a href="/pages/public/contact.html" class="navbar__link">Contacto</a></li>
          
          <!-- Íconos de acción SOLO en móvil (dentro del menú) -->
          <li class="navbar__mobile-actions">
            <!-- Búsqueda -->
            <a href="#" class="navbar__mobile-action" data-action="search">
              <svg class="navbar__mobile-action-icon" viewBox="0,0,256,256" xmlns="http://www.w3.org/2000/svg">
                <g fill="currentColor" fill-rule="nonzero" stroke="none">
                  <g transform="scale(10.66667,10.66667)">
                    <path d="M10,2c-4.4094,0 -8,3.59061 -8,8c0,4.40939 3.5906,8 8,8c1.92974,0 3.63578,-0.77488 5.01953,-1.91797l5.69922,5.69922c0.18979,0.18983 0.46644,0.26399 0.72573,0.19452c0.25929,-0.06947 0.46182,-0.27199 0.53129,-0.53129c0.06947,-0.25929 -0.00469,-0.53594 -0.19452,-0.72573l-5.69922,-5.69922c1.14309,-1.38375 1.91797,-3.08979 1.91797,-5.01953c0,-4.40939 -3.5906,-8 -8,-8zM10,3.5c3.59874,0 6.5,2.90127 6.5,6.5c0,3.59873 -2.90126,6.5 -6.5,6.5c-3.59874,0 -6.5,-2.90127 -6.5,-6.5c0,-3.59873 2.90126,-6.5 6.5,-6.5z"></path>
                  </g>
                </g>
              </svg>
              <span class="navbar__mobile-action-text">Buscar producto</span>
            </a>

            <!-- Carrito -->
            <a href="/pages/user/cart.html" class="navbar__mobile-action">
              <svg class="navbar__mobile-action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2L7 6M17 2L19 6M7 6H19M19 6L20 20H4L5 6M10 10V16M14 10V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="navbar__mobile-action-text">Mi carrito</span>
              <span id="cart-count-mobile" class="navbar__mobile-badge">0</span>
            </a>

            <!-- Perfil -->
            <a href="/pages/user/profile.html" class="navbar__mobile-action">
              <svg class="navbar__mobile-action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="navbar__mobile-action-text">Mi perfil</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Íconos de acción (derecha - SOLO DESKTOP) -->
      <div class="navbar__actions navbar__actions--desktop">
        <!-- Ícono de búsqueda -->
        <a href="#" class="navbar__bubble navbar__bubble--search" aria-label="Buscar" data-action="search">
          <svg class="navbar__icon" viewBox="0,0,256,256" xmlns="http://www.w3.org/2000/svg">
            <g fill="currentColor" fill-rule="nonzero" stroke="none">
              <g transform="scale(10.66667,10.66667)">
                <path d="M10,2c-4.4094,0 -8,3.59061 -8,8c0,4.40939 3.5906,8 8,8c1.92974,0 3.63578,-0.77488 5.01953,-1.91797l5.69922,5.69922c0.18979,0.18983 0.46644,0.26399 0.72573,0.19452c0.25929,-0.06947 0.46182,-0.27199 0.53129,-0.53129c0.06947,-0.25929 -0.00469,-0.53594 -0.19452,-0.72573l-5.69922,-5.69922c1.14309,-1.38375 1.91797,-3.08979 1.91797,-5.01953c0,-4.40939 -3.5906,-8 -8,-8zM10,3.5c3.59874,0 6.5,2.90127 6.5,6.5c0,3.59873 -2.90126,6.5 -6.5,6.5c-3.59874,0 -6.5,-2.90127 -6.5,-6.5c0,-3.59873 2.90126,-6.5 6.5,-6.5z"></path>
              </g>
            </g>
          </svg>
        </a>
        
        <!-- Ícono de carrito con badge -->
        <a class="navbar__bubble navbar__bubble--cart header-cart" aria-label="Carrito de compras">
          <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2L7 6M17 2L19 6M7 6H19M19 6L20 20H4L5 6M10 10V16M14 10V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span id="cart-count" class="navbar__badge quantity">0</span>
        </a>
        
        <!-- Ícono de perfil -->
        <a href="/pages/user/profile.html" class="navbar__bubble" aria-label="Mi perfil">
          <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </header>

    <!-- Barra de búsqueda modal (compartida) -->
    <div class="navbar__search-modal" id="search-modal">
      <div class="navbar__search-modal-content">
        <input 
          type="search" 
          class="navbar__search-input" 
          placeholder="Buscar productos..." 
          id="search-input"
        >
        <button class="navbar__search-close" aria-label="Cerrar búsqueda">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

/**
 * Inicializa la funcionalidad del navbar después de inyectarlo
 */
export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const nav = document.querySelector('.navbar__nav');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchClose = document.querySelector('.navbar__search-close');
  const searchTriggers = document.querySelectorAll('[data-action="search"]');

  // Efecto de scroll
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
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
      
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Cerrar menú al hacer click en un link
    const links = nav.querySelectorAll('.navbar__link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('navbar__hamburger--active');
        nav.classList.remove('navbar__nav--open');
        document.body.style.overflow = '';
      });
    });
  }

  // Modal de búsqueda
  if (searchModal && searchInput && searchClose) {
    // Abrir modal
    searchTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.classList.add('navbar__search-modal--open');
        searchInput.focus();
        document.body.style.overflow = 'hidden';
      });
    });

    // Cerrar modal
    searchClose.addEventListener('click', () => {
      searchModal.classList.remove('navbar__search-modal--open');
      document.body.style.overflow = '';
      searchInput.value = '';
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchModal.classList.contains('navbar__search-modal--open')) {
        searchModal.classList.remove('navbar__search-modal--open');
        document.body.style.overflow = '';
        searchInput.value = '';
      }
    });

    // Cerrar al hacer click fuera
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        searchModal.classList.remove('navbar__search-modal--open');
        document.body.style.overflow = '';
        searchInput.value = '';
      }
    });
  }

  // Resaltar enlace activo
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
    
    if (currentPath === linkPath || (linkPath !== '/index.html' && currentPath.includes(linkPath))) {
      link.classList.add('navbar__link--active');
    }
  });
}