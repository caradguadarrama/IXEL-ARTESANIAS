// assets/js/components/pages/products.js — ES Module
//
// CAMBIOS vs versión anterior:
//   1. Comparación de IDs robusta: String(p.id) === String(id)
//      El JSON tiene IDs numéricos pero dataset.id siempre es string.
//      Number(id) fallaba si el JSON devolviera IDs con ceros iniciales
//      o strings no numéricas. toString() en ambos lados es el contrato
//      correcto entre HTML y datos, independiente del tipo subyacente.
//
//   2. El dispatchEvent ya estaba bien en la rama con StorageEvent.
//      main.js escucha: if (e.key === 'cart') → StorageEvent({key:'cart'})
//      lo satisface correctamente. No se cambia.
//
//   3. Delegación unificada (carrito + navegación al detalle) sin cambios:
//      click en botón → addToCart; click en card → product-detail.html?id=

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

  const fragment = document.createDocumentFragment();

  filteredProducts.slice(0, visibleCount).forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-4';
    col.appendChild(createProductCard(product));
    fragment.appendChild(col);
  });

  cardsContainer.appendChild(fragment);

  if (loadMoreBtn) {
    loadMoreBtn.style.display =
      visibleCount >= filteredProducts.length ? 'none' : 'block';
  }
}

// ─── FILTROS ─────────────────────────────────────────────────

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
// Un solo listener en #cards cubre dos casos:
//   → Click en .product-card__add-btn : agregar al carrito
//   → Click en .product-card (resto)  : navegar al detalle
//
// CORRECCIÓN DE ID:
//   dataset.id siempre llega como string desde el HTML.
//   p.id en el JSON es number (ej: 14).
//   La comparación String(p.id) === String(btn.dataset.id) normaliza
//   ambos lados sin asumir el tipo, eliminando el bug silencioso
//   donde Number("14") === 14 funcionaba pero "14a" === NaN fallaba.

if (cardsContainer) {
  cardsContainer.addEventListener('click', e => {

    // ── Caso 1: agregar al carrito ────────────────────────
    const btn = e.target.closest('.product-card__add-btn');
    if (btn) {
      if (btn.disabled) return;

      // Comparación robusta: String en ambos lados
      const rawId   = btn.dataset.id;
      const product = allProducts.find(p => String(p.id) === String(rawId));
      if (!product) {
        console.warn('[products] Producto no encontrado para id:', rawId);
        return;
      }

      addToCart(product);

      // StorageEvent manual para que main.js::updateCartCount() reaccione
      // en la misma pestaña (el evento 'storage' nativo no se dispara
      // en la misma pestaña). main.js filtra por e.key === 'cart'.
      window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));

      // Feedback visual
      btn.textContent = '✓';
      btn.classList.add('product-card__add-btn--added');
      setTimeout(() => {
        btn.textContent = '+';
        btn.classList.remove('product-card__add-btn--added');
      }, 1000);

      return; // No propagar a navegación
    }

    // ── Caso 2: navegar al detalle ────────────────────────
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