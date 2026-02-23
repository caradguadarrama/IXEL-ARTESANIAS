export function createProductCard(product) {
  // Convertimos a número por si acaso viene como string del JSON
  const stock = Number(product.stock ?? 0);
  const isOutOfStock = stock <= 0;

  const priceFormatted = Number(product.price).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const card = document.createElement('div');
  // La clase 'out-of-stock' activa el filtro de la imagen y posición relativa
  card.className = `product-card ${isOutOfStock ? 'out-of-stock' : ''}`;

  card.innerHTML = `
    ${isOutOfStock ? '<div class="no-stock-tag"></div>' : ''}

    <a href="product-detail.html?id=${product.id}" class="product-card__image-link">
      <div class="product-card__img-wrapper">
        <img
          src="${product.imagen}"
          alt="${product.name}"
          class="product-card__img"
          loading="lazy"
          onerror="this.src='/assets/img/products/fallback.png'"
        >
      </div>
    </a>

    <div class="product-card__body">
      <h3 class="product-card__title">${product.name}</h3>
      <p class="product-card__price">$${priceFormatted}</p>
      
      <button
        class="product-card__add-btn"
        data-id="${product.id}"
        ${isOutOfStock ? 'disabled' : ''}
      >
        ${isOutOfStock ? 'AGOTADO' : '+'}
      </button>
    </div>
  `;

  return card;
}