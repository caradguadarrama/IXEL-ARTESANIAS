// assets/js/components/navbar.js

export function createNavbar() {
  return `
    <!-- CENEFA SUPERIOR -->
    <div class="top-border">
      <img src="assets/images/cenefa.png" alt="Decoración caracoles">
    </div>

    <header class="header">
      <!-- BURBUJAS DERECHA -->
      <div class="right-icons">
        <!-- BUSCADOR -->
        <div class="bubble" id="search-btn">
          <svg aria-hidden="true" focusable="false" fill="white" role="presentation" class="icon icon-search" viewBox="0 0 16 16">
            <path d="M16 14.864L14.863 16l-4.24-4.241a6.406 6.406 0 01-4.048 1.392 6.61 6.61 0 01-4.65-1.925A6.493 6.493 0 01.5 9.098 6.51 6.51 0 010 6.575a6.536 6.536 0 011.922-4.652A6.62 6.62 0 014.062.5 6.52 6.52 0 016.575 0 6.5 6.5 0 019.1.5c.8.332 1.51.806 2.129 1.423a6.454 6.454 0 011.436 2.13 6.54 6.54 0 01.498 2.522c0 1.503-.468 2.853-1.4 4.048L16 14.864zM3.053 10.091c.973.972 2.147 1.461 3.522 1.461 1.378 0 2.551-.489 3.525-1.461.968-.967 1.45-2.138 1.45-3.514 0-1.37-.482-2.545-1.45-3.524-.981-.968-2.154-1.45-3.525-1.45-1.376 0-2.547.483-3.513 1.45-.973.973-1.46 2.146-1.46 3.523 0 1.375.483 2.548 1.45 3.515z"></path>
          </svg>
        </div>
        
        <!-- CARRITO -->
        <div class="bubble" id="cart-btn">
          <a href="pages/public/cart.html" style="display: flex; align-items: center; justify-content: center;">
            <svg aria-hidden="true" focusable="false" role="presentation" fill="white" class="icon icon-cart" viewBox="0 0 25 25">
              <path d="M5.058 23a2 2 0 104.001-.001A2 2 0 005.058 23zm12.079 0c0 1.104.896 2 2 2s1.942-.896 1.942-2-.838-2-1.942-2-2 .896-2 2zM0 1a1 1 0 001 1h1.078l.894 3.341L5.058 13c0 .072.034.134.042.204l-1.018 4.58A.997.997 0 005.058 19h16.71a1 1 0 000-2H6.306l.458-2.061c.1.017.19.061.294.061h12.31c1.104 0 1.712-.218 2.244-1.5l3.248-6.964C25.423 4.75 24.186 4 23.079 4H5.058c-.157 0-.292.054-.438.088L3.844.772A1 1 0 002.87 0H1a1 1 0 00-1 1zm5.098 5H22.93l-3.192 6.798c-.038.086-.07.147-.094.19-.067.006-.113.012-.277.012H7.058v-.198l-.038-.195L5.098 6z"></path>
            </svg>
            <span id="cart-count" class="cart-badge">0</span>
          </a>
        </div>
        
        <!-- USUARIO -->
        <div class="bubble" id="user-btn">
          <svg aria-hidden="true" focusable="false" role="presentation" fill="white" class="icon icon-account" viewBox="0 0 16 16">
            <path d="M10.713 8.771c.31.112.53.191.743.27.555.204.985.372 1.367.539 1.229.535 1.993 1.055 2.418 1.885.464.937.722 1.958.758 2.997.03.84-.662 1.538-1.524 1.538H1.525c-.862 0-1.554-.697-1.524-1.538a7.36 7.36 0 01.767-3.016c.416-.811 1.18-1.33 2.41-1.866a25.25 25.25 0 011.366-.54l.972-.35a1.42 1.42 0 00-.006-.072c-.937-1.086-1.369-2.267-1.369-4.17C4.141 1.756 5.517 0 8.003 0c2.485 0 3.856 1.755 3.856 4.448 0 2.03-.492 3.237-1.563 4.386.169-.18.197-.253.207-.305a1.2 1.2 0 00-.019.16l.228.082zm-9.188 5.742h12.95a5.88 5.88 0 00-.608-2.402c-.428-.835-2.214-1.414-4.46-2.224-.608-.218-.509-1.765-.24-2.053.631-.677 1.166-1.471 1.166-3.386 0-1.934-.782-2.96-2.33-2.96-1.549 0-2.336 1.026-2.336 2.96 0 1.915.534 2.709 1.165 3.386.27.288.369 1.833-.238 2.053-2.245.81-4.033 1.389-4.462 2.224a5.88 5.88 0 00-.607 2.402z"></path>
          </svg>
        </div>
        
        <!-- CONTACTO -->
        <div class="bubble" id="contact-btn">
          <svg class="icon icon--medium icon--type-chat_bubble" stroke-width="1" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path fill="white" d="M11.3 13.02a6 6 0 111.72-1.72L14 14l-2.7-.98zm2.82-1.62a7 7 0 10-2.72 2.72l2.26.82a1 1 0 001.28-1.28l-.82-2.26z"></path>
            <path fill="currentColor" d="M4.9 9.16c.52 0 .86-.36.86-.85 0-.5-.34-.85-.87-.85-.52 0-.86.36-.86.85 0 .5.34.85.86.85zM7.88 9.16c.53 0 .87-.36.87-.85 0-.5-.34-.85-.87-.85-.52 0-.87.36-.87.85 0 .5.35.85.87.85zM10.87 9.16c.52 0 .87-.36.87-.85 0-.5-.35-.85-.87-.85s-.87.36-.87.85c0 .5.35.85.87.85z"></path>
          </svg>
        </div>
      </div>

      <!-- LOGO CENTRADO -->
      <div class="logo">
        <a href="/index.html">
          <img src="assets/images/Marca-de-agua2.png" alt="Logo de la marca">
        </a>
      </div>

      <!-- MENÚ DE NAVEGACIÓN -->
      <nav class="nav-links">
        <a href="/index.html">Home</a>
        <a href="/pages/public/about.html">About Us</a>
        <a href="/pages/public/products.html">Products</a>
      </nav>
    </header>
  `;
}

// Función para inicializar la funcionalidad del navbar
export function initNavbar() {
  // Efecto de transparencia al hacer scroll
  window.addEventListener("scroll", function() {
    const header = document.querySelector(".header");
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("transparent");
      } else {
        header.classList.remove("transparent");
      }
    }
  });

  // Aquí puedes agregar más funcionalidad (búsqueda, etc.)
  // Por ejemplo:
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      console.log('Búsqueda clickeada');
      // Aquí irá tu lógica de búsqueda
    });
  }
}