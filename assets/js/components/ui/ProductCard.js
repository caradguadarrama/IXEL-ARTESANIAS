// assets/js/components/ui/ProductCard.js
//
// Función pura: recibe un producto, retorna un HTMLElement.
// NO agrega event listeners. NO toca el DOM global.
// La delegación de eventos vive en products.js.
//
// BEM: .product-card como bloque raíz.
// El botón lleva data-id para que el delegador pueda leer el ID
// sin necesidad de traversal costoso al producto completo.

/**
 * Crea y retorna el elemento DOM de una tarjeta de producto.
 * @param {Object} product - Objeto del JSON
 * @param {number}  product.id
 * @param {string}  product.name
 * @param {number}  product.price
 * @param {string}  product.imagen  — ruta absoluta desde raíz
 * @param {number}  product.stock
 * @returns {HTMLElement}
 */
export function createProductCard(product) {
  const isOutOfStock = product.stock === 0;

  const priceFormatted = Number(product.price).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Ruta de la imagen: el JSON usa /assets/img/... (absoluta desde raíz).
  // Con Live Server esto funciona directamente.
  const imgSrc = product.imagen;

  // Fallback de imagen: si falla la carga, muestra placeholder.
  const fallback = '../../assets/img/products/Tortillero Martina Grises.png';

  const card = document.createElement('div');
  card.className = 'product-card';

  card.innerHTML = `
    <a
      href="product-detail.html?id=${product.id}"
      class="product-card__image-link"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="product-card__img-wrapper">
        <img
          src="${imgSrc}"
          alt="${product.name}"
          class="product-card__img"
          loading="lazy"
          onerror="this.src='${fallback}'"
        >
      </div>
    </a>

    <div class="product-card__body">
      <a href="product-detail.html?id=${product.id}" class="product-card__title-link">
        <h3 class="product-card__title">${product.name}</h3>
      </a>
      <p class="product-card__price">$${priceFormatted}</p>
    </div>

    <button
      class="product-card__add-btn${isOutOfStock ? ' product-card__add-btn--disabled' : ''}"
      data-id="${product.id}"
      ${isOutOfStock ? 'disabled aria-disabled="true"' : ''}
      aria-label="${isOutOfStock ? 'Agotado' : `Agregar ${product.name} al carrito`}"
      type="button"
    >
      ${isOutOfStock ? 'Agotado' : '+'}
    </button>
  `;

  return card;
}