// assets/js/components/pages/slidingCart.js — ES Module
//
// CORRECCIÓN DE TIMING:
//   Los querySelector del navbar (.header-cart, .quantity) se ejecutaban
//   en el top-level del módulo, ANTES de que main.js inyectara el navbar.
//   Resultado: openBtn === null → el listener nunca se registraba →
//   el click en el ícono del carrito no hacía nada.
//
//   Solución: todo el código se ejecuta dentro de DOMContentLoaded,
//   que dispara después de que main.js ya inyectó navbar y footer.

import { getCart, saveCart } from '../../utils/storage.js';

document.addEventListener('DOMContentLoaded', () => {

  // ─── DOM ─────────────────────────────────────────────────────
  // Se consultan AQUÍ, después de que main.js inyectó el navbar.

  const cartDrawer    = document.querySelector('.cart');
  const openBtn       = document.querySelector('.header-cart');
  const closeBtn      = document.querySelector('.closeShopping');
  const listCartEl    = document.querySelector('.listCart');
  const totalEl       = document.querySelector('.total');
  const quantityBadge = document.querySelector('.quantity');

  // ─── ABRIR / CERRAR ─────────────────────────────────────────

  function openCart()  { cartDrawer?.classList.add('active'); }
  function closeCart() { cartDrawer?.classList.remove('active'); }

  openBtn?.addEventListener('click',  e => { e.preventDefault(); openCart(); });
  closeBtn?.addEventListener('click', closeCart);

  // ─── RENDER ──────────────────────────────────────────────────
  // Lee getCart() en cada llamada — fuente única de verdad.
  // Usa product.imagen (campo real del JSON, no image ni img).

  function renderCart() {
    const cart = getCart();

    if (!listCartEl || !totalEl) return;

    listCartEl.innerHTML = '';

    if (!cart.length) {
      listCartEl.innerHTML = '<li class="cart__empty">Tu carrito está vacío</li>';
      totalEl.textContent  = 'Total: $0';
      if (quantityBadge) quantityBadge.textContent = '0';
      return;
    }

    let totalPrice = 0;
    let totalCount = 0;

    cart.forEach(item => {
      totalPrice += (item.price    || 0) * (item.quantity || 1);
      totalCount += (item.quantity || 1);

      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerHTML = `
        <img
          class="cart__item-img"
          src="${item.imagen || ''}"
          alt="${item.name  || 'Producto'}"
          onerror="this.src='/assets/img/products/Tortillero Martina Grises.png';this.onerror=null"
        >
        <div class="cart__item-info">
          <p class="cart__item-name">${item.name  || '—'}</p>
          <p class="cart__item-price">$${(item.price || 0).toLocaleString('es-MX')}</p>
        </div>
        <div class="cart__item-controls">
          <button class="cart__qty-btn cart__qty-btn--minus" data-id="${item.id}" type="button" aria-label="Reducir cantidad">−</button>
          <span class="cart__qty-count">${item.quantity || 1}</span>
          <button class="cart__qty-btn cart__qty-btn--plus"  data-id="${item.id}" type="button" aria-label="Aumentar cantidad">+</button>
        </div>
      `;
      listCartEl.appendChild(li);
    });

    totalEl.textContent = `Pagar: $${totalPrice.toLocaleString('es-MX')}`;
    if (quantityBadge) quantityBadge.textContent = String(totalCount);
  }

  // ─── CONTROLES DE CANTIDAD ───────────────────────────────────
  // Delegación en .listCart — un solo listener para todos los botones.

  listCartEl?.addEventListener('click', e => {
    const btn = e.target.closest('.cart__qty-btn');
    if (!btn) return;

    const rawId = btn.dataset.id;
    const cart  = getCart();
    const index = cart.findIndex(item => String(item.id) === String(rawId));
    if (index < 0) return;

    if (btn.classList.contains('cart__qty-btn--plus')) {
      cart[index].quantity += 1;
    } else {
      cart[index].quantity -= 1;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
    }

    saveCart(cart);
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
    renderCart();
  });

  // ─── SINCRONIZACIÓN ──────────────────────────────────────────
  // Escucha el StorageEvent que products.js dispara tras addToCart().
  // Abre el drawer automáticamente al agregar.

  window.addEventListener('storage', e => {
    if (e.key !== 'cart') return;
    renderCart();
    openCart();
  });

  // ─── INIT ────────────────────────────────────────────────────
  renderCart();

}); // fin DOMContentLoaded