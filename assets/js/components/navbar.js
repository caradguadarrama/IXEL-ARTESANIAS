// assets/js/components/navbar.js
// Puro: retorna HTML string. No toca DOM. No ejecuta código al importar.
// initNavbar() se llama desde main.js DESPUÉS de inyectar el HTML.
//
// CAMBIOS vs versión rota:
//   1. Rutas absolutas desde raíz (/assets/...) en imágenes y hrefs de nav.
//      Las rutas relativas (../../) fallan cuando el navbar se inyecta
//      desde páginas a distintas profundidades. Las absolutas funcionan
//      igual desde /index.html, /pages/public/products.html, etc.
//   2. Bug HTML corregido: el botón de carrito abría con <button> y
//      cerraba con </a> — DOM inválido que el parser repara de forma
//      impredecible, rompiendo el layout y los event listeners.

export function createNavbar() {
  return `
    <div class="navbar-border" role="presentation" aria-hidden="true">
      <img src="./assets/img/icons/cenefa.png" alt="" class="navbar-border__image">
    </div>

    <header class="navbar" role="banner">

      <div class="navbar__logo">
        <a href="/index.html" aria-label="Ir al inicio">
          <img
            src="./assets/img/icons/Marca-de-agua2_negro.png"
            alt="IXEL Artesanías"
            class="navbar__logo-image navbar__logo-image--desktop"
          >
          <img
            src="./assets/img/icons/x.png"
            alt="IXEL"
            class="navbar__logo-image navbar__logo-image--mobile"
          >
        </a>
      </div>

      <button
        class="navbar__hamburger"
        aria-label="Abrir menú"
        aria-expanded="false"
        aria-controls="navbar-nav"
        type="button"
      >
        <span class="navbar__hamburger-line"></span>
        <span class="navbar__hamburger-line"></span>
        <span class="navbar__hamburger-line"></span>
      </button>

      <nav class="navbar__nav" id="navbar-nav" aria-label="Navegación principal">
        <ul class="navbar__links" role="list">
          <li><a href="/index.html"                 class="navbar__link">Inicio</a></li>
          <li><a href="/pages/public/products.html" class="navbar__link">Productos</a></li>
          <li><a href="/pages/public/about.html"    class="navbar__link">Nosotros</a></li>
          <li><a href="/pages/public/contact.html"  class="navbar__link">Contacto</a></li>

          <li class="navbar__mobile-actions" role="none">
            <button class="navbar__mobile-action" data-action="search" aria-label="Buscar" type="button">
              <svg class="navbar__mobile-action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="navbar__mobile-action-text">Buscar</span>
            </button>

            <a href="/pages/public/car.html" class="navbar__mobile-action" aria-label="Mi carrito">
              <svg class="navbar__mobile-action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="navbar__mobile-action-text">Mi carrito</span>
              <span id="cart-count-mobile" class="navbar__mobile-badge" aria-label="artículos en el carrito">0</span>
            </a>

            <a href="/pages/public/profile.html" class="navbar__mobile-action" aria-label="Mi perfil">
              <svg class="navbar__mobile-action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="navbar__mobile-action-text">Mi perfil</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="navbar__actions navbar__actions--desktop" role="group" aria-label="Acciones">

        <button
          class="navbar__bubble navbar__bubble--search"
          aria-label="Buscar producto"
          data-action="search"
          type="button"
        >
          <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!--
          CORRECCIÓN CRÍTICA: este elemento era <button> que cerraba con </a>.
          DOM inválido → el parser movía nodos de forma impredecible →
          el badge quedaba fuera del botón y los listeners se perdían.
          Ahora es <button> que cierra con </button>.
        -->
        <button
          class="navbar__bubble navbar__bubble--cart header-cart"
          aria-label="Abrir carrito de compras"
          type="button"
        >
          <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span id="cart-count" class="navbar__badge quantity">0</span>
        </button>

        <a href="/pages/public/profile.html" class="navbar__bubble" aria-label="Mi perfil">
          <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

      </div>
    </header>

    <div class="navbar__search-modal" id="search-modal" role="dialog" aria-modal="true" aria-label="Buscar productos">
      <div class="navbar__search-modal-content">
        <input
          type="search"
          class="navbar__search-input"
          placeholder="Buscar productos…"
          id="search-input"
          autocomplete="off"
        >
        <button class="navbar__search-close" aria-label="Cerrar búsqueda" type="button">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

/**
 * Inicializa comportamiento del navbar.
 * Se llama desde main.js DESPUÉS de inyectar createNavbar() en el DOM.
 */
export function initNavbar() {
  const navbar         = document.querySelector('.navbar');
  const hamburger      = document.querySelector('.navbar__hamburger');
  const nav            = document.querySelector('.navbar__nav');
  const searchModal    = document.getElementById('search-modal');
  const searchInput    = document.getElementById('search-input');
  const searchClose    = document.querySelector('.navbar__search-close');
  const searchTriggers = document.querySelectorAll('[data-action="search"]');

  // ── Scroll ───────────────────────────────────────────────────
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Hamburguesa ──────────────────────────────────────────────
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      hamburger.classList.toggle('navbar__hamburger--active');
      nav.classList.toggle('navbar__nav--open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    nav.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  function closeMenu() {
    hamburger?.setAttribute('aria-expanded', 'false');
    hamburger?.classList.remove('navbar__hamburger--active');
    nav?.classList.remove('navbar__nav--open');
    document.body.style.overflow = '';
  }

  // ── Búsqueda ─────────────────────────────────────────────────
  function openSearch(e) {
    e?.preventDefault();
    searchModal?.classList.add('navbar__search-modal--open');
    searchInput?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchModal?.classList.remove('navbar__search-modal--open');
    document.body.style.overflow = '';
    if (searchInput) searchInput.value = '';
  }

  searchTriggers.forEach(t => t.addEventListener('click', openSearch));
  searchClose?.addEventListener('click', closeSearch);
  searchModal?.addEventListener('click', e => { if (e.target === searchModal) closeSearch(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  // ── Link activo ──────────────────────────────────────────────
  highlightActiveLink();
}

function highlightActiveLink() {
  const current = window.location.pathname;
  document.querySelectorAll('.navbar__link').forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    const isRoot   = linkPath === '/' || linkPath.endsWith('/index.html');
    const isActive = isRoot
      ? current === '/' || current.endsWith('/index.html')
      : current === linkPath;
    link.classList.toggle('navbar__link--active', isActive);
  });
}