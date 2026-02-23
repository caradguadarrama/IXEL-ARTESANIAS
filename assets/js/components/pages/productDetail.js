// assets/js/components/pages/productDetail.js — ES Module
//
// Integra el script.js del modelo de referencia (Parota):
//   - Fade de imagen principal (initGallery → aquí: initImageFade)
//   - IntersectionObserver para animaciones de entrada (initScrollAnimations)
//   - Smooth scroll para links internos de la página
//
// La galería con thumbnails del modelo requiere múltiples imágenes.
// El JSON de Ixel tiene una imagen por producto, así que:
//   - El fade se aplica en la carga inicial de la imagen
//   - La estructura HTML está preparada para añadir thumbnails
//     cuando el backend provea imágenes adicionales (data-images=[])
//
// Sincronización del carrito: StorageEvent manual — ver products.js.

import { getProductById, getRelatedProducts } from '../../services/product.service.js';
import { createProductCard }                   from '../ui/ProductCard.js';
import { addToCart }                           from '../../utils/storage.js';

const priceFormatter = new Intl.NumberFormat('es-MX', {
  style:                 'currency',
  currency:              'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// ─── DOM ─────────────────────────────────────────────────────

const elImage         = document.getElementById('pd-image');
const elName          = document.getElementById('pd-name');
const elCollection    = document.getElementById('pd-collection');
const elPrice         = document.getElementById('pd-price');
const elDescription   = document.getElementById('pd-description');
const elStock         = document.getElementById('pd-stock');
const elAddBtn        = document.getElementById('pd-add-btn');
const elQuantity      = document.getElementById('pd-quantity');
const elBreadcrumb    = document.getElementById('pd-breadcrumb-name');
const elNarrativeText = document.getElementById('pd-narrative-text');
const elSpecsList     = document.getElementById('pd-specs-list');
const elRelTrack      = document.getElementById('pd-related-track');
const elRelSection    = document.getElementById('pd-related-section');

// ─── RENDER PRODUCTO ──────────────────────────────────────────

function renderProduct(product) {
  document.title = `${product.name} | IXEL Artesanías`;

  if (elBreadcrumb)    elBreadcrumb.textContent   = product.name;
  if (elName)          elName.textContent          = product.name;
  if (elPrice)         elPrice.textContent         = priceFormatter.format(product.price);
  if (elDescription)   elDescription.textContent   = product.description ?? '';
  if (elNarrativeText) elNarrativeText.textContent = product.description ?? '';
  if (elCollection)    elCollection.textContent    = `${product.collection} · ${product.category}`;

  if (elImage) {
    // Fade in de imagen al cargar — tomado de initGallery del modelo
    elImage.style.opacity    = '0';
    elImage.style.transition = 'opacity 0.4s ease';
    elImage.src = product.imagen;
    elImage.alt = product.name;

    elImage.onload = () => { elImage.style.opacity = '1'; };
    elImage.onerror = () => {
      elImage.src     = '/assets/img/products/Tortillero Martina Grises.png';
      elImage.style.opacity = '1';
      elImage.onerror = null;
    };
  }

  renderStock(product.stock);
  renderSpecs(product);
}

function renderStock(stock) {
  if (!elStock) return;
  if (stock === 0)       elStock.textContent = 'Agotado';
  else if (stock <= 5)   elStock.textContent = `Últimas ${stock} unidades`;
  else                   elStock.textContent = `${stock} disponibles`;
}

function renderSpecs(product) {
  if (!elSpecsList) return;

  const specs = [
    { label: 'Colección',   value: product.collection },
    { label: 'Categoría',   value: product.category   },
    { label: 'Precio',      value: priceFormatter.format(product.price) },
    { label: 'Stock',       value: product.stock === 0 ? 'Agotado' : `${product.stock} unidades` },
    { label: 'Origen',      value: 'Jalisco, México'  },
    { label: 'Material',    value: 'Madera de Parota' },
    { label: 'Acabado',     value: 'Pintado a mano'   },
    { label: 'Código',      value: `IXL-${String(product.id).padStart(4, '0')}` },
  ];

  const fragment = document.createDocumentFragment();
  specs.forEach(({ label, value }) => {
    const item = document.createElement('div');
    item.className = 'pd__spec-item';
    item.innerHTML = `
      <dt class="pd__spec-label">${label}</dt>
      <dd class="pd__spec-value">${value}</dd>
    `;
    fragment.appendChild(item);
  });
  elSpecsList.appendChild(fragment);
}

// ─── GALERÍA (FADE ENTRE IMÁGENES) ───────────────────────────
// Adaptación de initGallery() del script.js del modelo.
// Con una sola imagen en el JSON no hay thumbnails activos,
// pero la función está lista para cuando el backend devuelva
// product.images: ['url1', 'url2', ...].
//
// Uso futuro: llamar renderThumbnails(product.images) y la lógica
// de fade funciona sin cambios adicionales.

function initImageFade() {
  if (!elImage) return;

  // Delegar en los thumbnails si en el futuro existen
  const thumbnails = document.querySelectorAll('.pd__thumbnail');
  if (!thumbnails.length) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('pd__thumbnail--active'));
      thumb.classList.add('pd__thumbnail--active');

      const newSrc = thumb.querySelector('img')?.src;
      if (!newSrc || newSrc === elImage.src) return;

      // Fade out → cambio de src → fade in
      elImage.style.opacity = '0';
      setTimeout(() => {
        elImage.src   = newSrc;
        elImage.onload = () => { elImage.style.opacity = '1'; };
      }, 200);
    });
  });
}

// ─── ANIMACIONES DE SCROLL ───────────────────────────────────
// Tomado directamente de initScrollAnimations() del modelo.
// Aplica fade-in + translateY a los bloques narrativos y tarjetas
// cuando entran al viewport.
// Se llama DESPUÉS de que el contenido esté renderizado.

function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll(
    '.pd__narrative-block, .pd__spec-item, .pd__related-grid .product-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // cada elemento solo anima una vez
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

// ─── SMOOTH SCROLL ───────────────────────────────────────────
// Tomado de initSmoothScroll() del modelo.
// Maneja links internos (#) con offset del navbar.

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

// ─── CANTIDAD ────────────────────────────────────────────────

function setupQuantity(maxStock) {
  if (!elQuantity) return;
  elQuantity.min   = 1;
  elQuantity.max   = maxStock;
  elQuantity.value = 1;

  elQuantity.addEventListener('change', () => {
    const val = Number(elQuantity.value);
    if (val < 1)        elQuantity.value = 1;
    if (val > maxStock) elQuantity.value = maxStock;
  });

  document.getElementById('pd-qty-minus')?.addEventListener('click', () => {
    const v = Number(elQuantity.value);
    if (v > 1) elQuantity.value = v - 1;
  });

  document.getElementById('pd-qty-plus')?.addEventListener('click', () => {
    const v = Number(elQuantity.value);
    if (v < maxStock) elQuantity.value = v + 1;
  });
}

// ─── BOTÓN AGREGAR ───────────────────────────────────────────
// Feedback visual tomado del handler del modelo —
// pero integrado al sistema de carrito de Ixel (addToCart + StorageEvent).

function setupAddButton(product) {
  if (!elAddBtn) return;

  if (product.stock === 0) {
    elAddBtn.textContent = 'Agotado';
    elAddBtn.disabled    = true;
    elAddBtn.classList.add('pd__add-btn--disabled');
    return;
  }

  elAddBtn.addEventListener('click', () => {
    const quantity = elQuantity ? Math.max(1, Number(elQuantity.value) || 1) : 1;
    addToCart({ ...product, quantity });
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));

    // Feedback visual del modelo (texto + color temporal)
    const originalText = elAddBtn.textContent;
    elAddBtn.textContent = 'Agregado ✓';
    elAddBtn.classList.add('pd__add-btn--added');

    setTimeout(() => {
      elAddBtn.textContent = originalText;
      elAddBtn.classList.remove('pd__add-btn--added');
    }, 2000);
  });
}

// ─── RELACIONADOS ────────────────────────────────────────────

let _relatedProducts = [];

function renderRelated(products) {
  if (!elRelTrack) return;

  if (!products.length) {
    elRelSection?.style && (elRelSection.style.display = 'none');
    return;
  }

  _relatedProducts  = products;
  const fragment    = document.createDocumentFragment();
  products.forEach(p => fragment.appendChild(createProductCard(p)));
  elRelTrack.appendChild(fragment);

  // Inicializar animaciones DESPUÉS de insertar los elementos al DOM
  initScrollAnimations();
}

function setupRelatedDelegation() {
  if (!elRelTrack) return;

  elRelTrack.addEventListener('click', e => {
    const btn = e.target.closest('.product-card__add-btn');
    if (btn) {
      if (btn.disabled) return;
      const product = _relatedProducts.find(p => p.id === Number(btn.dataset.id));
      if (!product) return;

      addToCart(product);
      window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));

      btn.textContent = '✓';
      btn.classList.add('product-card__add-btn--added');
      setTimeout(() => {
        btn.textContent = '+';
        btn.classList.remove('product-card__add-btn--added');
      }, 1000);
      return;
    }

    const card = e.target.closest('.product-card');
    if (card?.dataset.href) window.location.href = card.dataset.href;
  });
}

// ─── ERROR ───────────────────────────────────────────────────

function renderError(msg = 'Producto no encontrado.') {
  document.querySelector('.pd__hero')?.replaceWith((() => {
    const el = document.createElement('div');
    el.className = 'pd__error container';
    el.innerHTML = `
      <p class="pd__error-msg">${msg}</p>
      <a href="products.html" class="pd__error-link">← Ver todos los productos</a>
    `;
    return el;
  })());
}

// ─── INIT ────────────────────────────────────────────────────

async function init() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { renderError('No se especificó ningún producto.'); return; }

  try {
    const product = await getProductById(id);
    if (!product) { renderError('Producto no encontrado.'); return; }

    renderProduct(product);
    setupQuantity(product.stock);
    setupAddButton(product);
    setupRelatedDelegation();
    initImageFade();
    initSmoothScroll();

    // Las animaciones de narrativa/specs se init aquí
    // (elementos ya están en el DOM en este punto)
    initScrollAnimations();

    const related = await getRelatedProducts(product, 4);
    renderRelated(related);

  } catch (err) {
    console.error('[productDetail] Error:', err);
    renderError('No se pudo cargar el producto.');
  }
}

document.addEventListener('DOMContentLoaded', init);