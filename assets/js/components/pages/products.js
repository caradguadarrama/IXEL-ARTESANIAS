// assets/js/components/pages/products.js — ES Module
//
// Controlador de la página de catálogo. Responsabilidades:
//   1. Cargar productos vía product.service.js
//   2. Renderizar con createProductCard()
//   3. Filtrar por colección (banners) y categoría (sidebar)
//   4. Paginar con "Cargar más" (6 por carga)
//   5. Manejar agregar al carrito con UN solo listener (delegación)
//
// Por qué delegación en #cards y no listeners individuales:
//   Las tarjetas se crean dinámicamente con renderProducts().
//   Si se pusiera un listener por botón, cada llamada a renderProducts()
//   requeriría re-registrar todos los listeners — O(n) listeners acumulados
//   con memory leaks garantizados. Con delegación: 1 listener total,
//   sin importar cuántas tarjetas se rendericen o cuántas veces.
//
// Por qué dispatchEvent('storage') al agregar al carrito:
//   main.js escucha window 'storage' para sincronizar el badge del navbar.
//   Ese evento solo dispara entre pestañas distintas en condiciones normales.
//   Lo disparamos manualmente para que main.js::updateCartCount() se ejecute
//   en la misma pestaña sin necesidad de importar updateCartCount aquí,
//   que crearía una dependencia circular (main → products, products → main).

import { getProducts }        from '../../services/product.service.js';
import { createProductCard }  from '../ui/ProductCard.js';
import { addToCart }          from '../../utils/storage.js';

// ─── ESTADO ───────────────────────────────────────────────────

let allProducts      = [];
let filteredProducts = [];
let visibleCount     = 6;
const PAGE_SIZE      = 6;

let activeCollection = null;
let activeCategory   = null;

// ─── DOM ─────────────────────────────────────────────────────

const cardsContainer = document.querySelector('#cards');
const loadMoreBtn    = document.querySelector('#loadMore');

// ─── CARGA INICIAL ────────────────────────────────────────────

async function init() {
  try {
    allProducts      = await getProducts();
    filteredProducts = [...allProducts];
    renderProducts();
    updateCategorySidebar();
  } catch (err) {
    console.error('[products] Error al inicializar:', err);
    if (cardsContainer) {
      cardsContainer.innerHTML =
        '<p class="products__error">No se pudieron cargar los productos. Intenta de nuevo.</p>';
    }
  }
}

// ─── RENDER ───────────────────────────────────────────────────

function renderProducts() {
  if (!cardsContainer) return;
  cardsContainer.innerHTML = '';

  const slice = filteredProducts.slice(0, visibleCount);

  // DocumentFragment: un solo reflow para todos los elementos
  const fragment = document.createDocumentFragment();

  slice.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-4';
    col.appendChild(createProductCard(product));
    fragment.appendChild(col);
  });

  cardsContainer.appendChild(fragment);

  if (loadMoreBtn) {
    loadMoreBtn.style.display = visibleCount >= filteredProducts.length ? 'none' : 'block';
  }
}

// ─── FILTROS ──────────────────────────────────────────────────

function applyFilters() {
  filteredProducts = allProducts.filter(p => {
    const matchCollection = !activeCollection || p.collection === activeCollection;
    const matchCategory   = !activeCategory   || p.category   === activeCategory;
    return matchCollection && matchCategory;
  });

  visibleCount = PAGE_SIZE;
  renderProducts();
}

// ─── SIDEBAR ──────────────────────────────────────────────────

function updateCategorySidebar() {
  const links = document.querySelectorAll('.selectable-list a');

  if (!activeCollection) {
    links.forEach(link => link.closest('li').style.display = 'list-item');
    return;
  }

  const validCategories = new Set(
    allProducts
      .filter(p => p.collection === activeCollection)
      .map(p => p.category)
  );

  links.forEach(link => {
    const cat = link.dataset.subcategory;
    const li  = link.closest('li');

    if (validCategories.has(cat)) {
      li.style.display = 'list-item';
    } else {
      li.style.display = 'none';
      link.classList.remove('active');
      if (activeCategory === cat) activeCategory = null;
    }
  });
}

// ─── DELEGACIÓN DE EVENTOS: CARRITO ──────────────────────────
// Un solo listener sobre #cards. Detecta clicks en .product-card__add-btn
// independientemente de cuántas tarjetas haya en el DOM.
// addToCart() espera un objeto producto; lo buscamos en allProducts
// por ID para pasar el objeto completo (nombre, precio, imagen)
// al carrito, no solo el ID.

if (cardsContainer) {
  cardsContainer.addEventListener('click', e => {
    const btn = e.target.closest('.product-card__add-btn');
    if (!btn || btn.disabled) return;

    const id      = Number(btn.dataset.id);
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    addToCart(product);

    // Notifica a main.js::updateCartCount() sin importación directa.
    // Ver comentario al inicio del archivo sobre por qué se hace así.
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));

    // Feedback visual temporal en el botón
    btn.textContent = '✓';
    btn.classList.add('product-card__add-btn--added');
    setTimeout(() => {
      btn.textContent = '+';
      btn.classList.remove('product-card__add-btn--added');
    }, 1000);
  });
}

// ─── EVENTOS: COLECCIONES ─────────────────────────────────────

document.querySelectorAll('.category').forEach(card => {
  card.addEventListener('click', () => {
    const collection = card.dataset.category;

    if (activeCollection === collection) {
      activeCollection = null;
      card.classList.remove('active');
    } else {
      activeCollection = collection;
      document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    }

    activeCategory = null;
    document.querySelectorAll('.selectable-list a').forEach(l => l.classList.remove('active'));

    updateCategorySidebar();
    applyFilters();
  });
});

// ─── EVENTOS: CATEGORÍAS (SIDEBAR) ───────────────────────────

document.querySelectorAll('.selectable-list a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const cat = link.dataset.subcategory;

    if (activeCategory === cat) {
      activeCategory = null;
      link.classList.remove('active');
    } else {
      activeCategory = cat;
      document.querySelectorAll('.selectable-list a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }

    applyFilters();
  });
});

// ─── EVENTOS: FLECHAS SIDEBAR ─────────────────────────────────

const listNav  = document.getElementById('subCategoryList');
const btnLeft  = document.getElementById('prevBtn');
const btnRight = document.getElementById('nextBtn');

if (listNav && btnLeft && btnRight) {
  btnRight.addEventListener('click', () => listNav.scrollBy({ left: 250, behavior: 'smooth' }));
  btnLeft.addEventListener('click',  () => listNav.scrollBy({ left: -250, behavior: 'smooth' }));
}

// ─── EVENTOS: CARGAR MÁS ─────────────────────────────────────

loadMoreBtn?.addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderProducts();
});

// ─── PUNTO DE ENTRADA ─────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);