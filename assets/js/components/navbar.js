// assets/js/components/navbar.js
// Puro: retorna HTML string. No toca DOM. No ejecuta código al importar.
// initNavbar() se llama desde main.js DESPUÉS de inyectar el HTML.

/**
 * Genera el HTML completo del navbar.
 * Rutas relativas porque el proyecto usa rutas relativas en todo.
 * El footer usa la misma convención.
 */
export function createNavbar() {
  return `
    <div class="navbar-border" role="presentation" aria-hidden="true">
      <img src="../../assets/img/icons/cenefa.png" alt="" class="navbar-border__image">
    </div>

    <header class="navbar" role="banner">

      <div class="navbar__logo">
        <a href="../../index.html" aria-label="Ir al inicio">
          <img
            src="../../assets/img/icons/Marca-de-agua2_negro.png"
            alt="IXEL Artesanías"
            class="navbar__logo-image navbar__logo-image--desktop"
          >
          <img
            src="../../assets/img/icons/x.png"
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
          <li><a href="../../index.html"                  class="navbar__link">Inicio</a></li>
          <li><a href="../../pages/public/products.html"  class="navbar__link">Productos</a></li>
          <li><a href="../../pages/public/about.html"     class="navbar__link">Nosotros</a></li>
          <li><a href="../../pages/public/contact.html"   class="navbar__link">Contacto</a></li>

          <li class="navbar__mobile-actions" role="none">
            <a href="#" class="navbar__mobile-action" data-action="search" aria-label="Buscar">
              <svg class="navbar__mobile-action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
                <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="navbar__mobile-action-text">Buscar</span>
            </a>

            <a href="../../pages/public/car.html" class="navbar__mobile-action" aria-label="Mi carrito">
              <svg class="navbar__mobile-action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="navbar__mobile-action-text">Mi carrito</span>
              <span id="cart-count-mobile" class="navbar__mobile-badge" aria-label="artículos en el carrito">0</span>
            </a>

            <a href="#" class="navbar__mobile-action" aria-label="Mi perfil">
              <svg class="navbar__mobile-action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
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
          <span id="cart-count" class="navbar__badge" aria-live="polite" aria-label="artículos en el carrito">0</span>
        </button>

        <a href="#" class="navbar__bubble" aria-label="Mi perfil">
          <svg class="navbar__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
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

  // ── Scroll: clase modificadora BEM ──────────────────────────
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Estado inicial
  }

  // ── Menú hamburguesa ────────────────────────────────────────
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

  // ── Búsqueda ────────────────────────────────────────────────
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

  // ── Link activo ─────────────────────────────────────────────
  highlightActiveLink();
}

function highlightActiveLink() {
  const current = window.location.pathname;
  document.querySelectorAll('.navbar__link').forEach(link => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    // Evita que '/' o '/index.html' marquen todos los links como activos
    const isRoot   = linkPath === '/' || linkPath.endsWith('/index.html');
    const isActive = isRoot
      ? current === linkPath || current === '/' || current.endsWith('/index.html')
      : current === linkPath;
    link.classList.toggle('navbar__link--active', isActive);
  });
}