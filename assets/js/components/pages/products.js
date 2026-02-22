// assets/js/components/pages/products.js — ES Module
//
// CAMBIO vs archivo subido:
//   products.js ya disparaba StorageEvent({key:'cart'}) tras addToCart().
//   slidingCart.js ahora escucha ese mismo evento y se abre automáticamente.
//   No se necesita ninguna importación cruzada entre los dos módulos.
//   El único ajuste: el evento sigue siendo StorageEvent (no Event genérico)
//   para que main.js y slidingCart.js filtren por e.key === 'cart'.

import { getProducts }       from '../../services/product.service.js';
import { createProductCard } from '../ui/ProductCard.js';
import { addToCart }         from '../../utils/storage.js';

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

// ─── INIT ────────────────────────────────────────────────────

async function init() {
  try {
    allProducts      = await getProducts();
    filteredProducts = [...allProducts];
    renderProducts();
    updateSidebar();
  } catch (err) {
    console.error('[products] init:', err);
    if (cardsContainer) {
      cardsContainer.innerHTML =
        '<p class="products__error">Error al cargar productos.</p>';
    }
  }
}

// ─── RENDER ───────────────────────────────────────────────────

function renderProducts() {
  if (!cardsContainer) return;
  cardsContainer.innerHTML = '';

  list.slice(0, count).forEach(product => {
    
    const hasStock = product.stock > 0;

    const col = document.createElement("div");
    col.className = "col-12 col-md-4";

    col.innerHTML = `
      <div class="product-card ${!hasStock ? 'out-of-stock' : ''}">
        <div class="product-image favorite">
          <img src="${product.imagen}" alt="${product.name}">
          ${!hasStock ? '<div class="no-stock-tag"></div>' : ''}
        </div>
        <h5 class="product-name">${product.name}</h5>
        <p class="product-price">$${product.price}</p>
        <button class="button-ixel-products addCart" data-id=${product.id} ${!hasStock ? 'disabled' : ''}>
          ${!hasStock ? 'Agotado' : '+'}
        </button>
      </div>
    `;

    container.appendChild(col);
  });

  if(loadMoreBtn) loadMoreBtn.style.display = count >= list.length ? "none" : "block";
}

function applyFilters() {
  filteredProducts = allProducts.filter(p => {
    const matchCol = !activeCollection || p.collection === activeCollection;
    const matchCat = !activeCategory   || p.category   === activeCategory;
    return matchCol && matchCat;
  });
  visibleCount = PAGE_SIZE;
  renderProducts();
}

// ─── SIDEBAR ─────────────────────────────────────────────────

function updateSidebar() {
  const links = document.querySelectorAll('.selectable-list a');

  if (!activeCollection) {
    links.forEach(l => l.closest('li').style.display = 'list-item');
    return;
  }

  const validCats = new Set(
    allProducts
      .filter(p => p.collection === activeCollection)
      .map(p => p.category)
  );

  links.forEach(link => {
    const cat = link.dataset.subcategory;
    const li  = link.closest('li');
    if (validCats.has(cat)) {
      li.style.display = 'list-item';
    } else {
      li.style.display = 'none';
      link.classList.remove('active');
      if (activeCategory === cat) activeCategory = null;
    }
  });
}

// ─── DELEGACIÓN PRINCIPAL ────────────────────────────────────
//
// Un listener en #cards cubre dos casos:
//   → .product-card__add-btn → addToCart + StorageEvent → slidingCart abre
//   → .product-card (resto)  → navegar al detalle

if (cardsContainer) {
  cardsContainer.addEventListener('click', e => {

    // Caso 1: agregar al carrito
    const btn = e.target.closest('.product-card__add-btn');
    if (btn) {
      if (btn.disabled) return;

      const rawId   = btn.dataset.id;
      const product = allProducts.find(p => String(p.id) === String(rawId));
      if (!product) {
        console.warn('[products] Producto no encontrado:', rawId);
        return;
      }

      addToCart(product);

      // StorageEvent con key:'cart' → lo escuchan main.js (badge)
      // y slidingCart.js (render + apertura automática)
      window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));

      // Feedback visual
      btn.textContent = '✓';
      btn.classList.add('product-card__add-btn--added');
      setTimeout(() => {
        btn.textContent = '+';
        btn.classList.remove('product-card__add-btn--added');
      }, 1000);

      return;
    }

    // Caso 2: navegar al detalle
    const card = e.target.closest('.product-card');
    if (card?.dataset.href) {
      window.location.href = card.dataset.href;
    }
  });
}

// ─── COLECCIONES ─────────────────────────────────────────────

document.querySelectorAll('.category').forEach(banner => {
  banner.addEventListener('click', () => {
    const col = banner.dataset.category;

    if (activeCollection === col) {
      activeCollection = null;
      banner.classList.remove('active');
    } else {
      activeCollection = col;
      document.querySelectorAll('.category').forEach(b => b.classList.remove('active'));
      banner.classList.add('active');
    }

    activeCategory = null;
    document.querySelectorAll('.selectable-list a').forEach(l => l.classList.remove('active'));

    updateSidebar();
    applyFilters();
  });
});

// ─── SIDEBAR CATEGORÍAS ──────────────────────────────────────

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

// ─── FLECHAS ─────────────────────────────────────────────────

const listNav  = document.getElementById('subCategoryList');
const btnLeft  = document.getElementById('prevBtn');
const btnRight = document.getElementById('nextBtn');

if (listNav && btnLeft && btnRight) {
  btnRight.addEventListener('click', () => listNav.scrollBy({ left: 250, behavior: 'smooth' }));
  btnLeft.addEventListener('click',  () => listNav.scrollBy({ left: -250, behavior: 'smooth' }));
}

// ─── CARGAR MÁS ──────────────────────────────────────────────

loadMoreBtn?.addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderProducts();
});

// ─── PUNTO DE ENTRADA ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', init);