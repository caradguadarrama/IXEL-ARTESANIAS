// assets/js/components/pages/checkout.js — ES Module
//
// BUGS CORREGIDOS:
//
//   BUG 1 — Import relativo '../utils/storage.js':
//     car.html carga este archivo como /assets/js/components/pages/checkout.js.
//     Desde esa ruta, '../utils/' resuelve a /assets/js/components/utils/ — no existe.
//     Módulo no encontrado → SyntaxError → checkout no corre → tabla vacía.
//     FIX: import absoluto '/assets/js/utils/storage.js'.
//
//   BUG 2 — Maquetación deficiente:
//     #cart-table-body estaba suelto fuera del container Bootstrap en car.html.
//     Las filas de checkout usaban col-xl-2 con offset que provocaba desbordamiento.
//     FIX: estructura Bootstrap compacta con imagen thumbnail (80px), nombre,
//     controles +/- alineados horizontalmente, precio a la derecha.
//     car.html actualizado: #cart-table-body movido dentro del col-md-8 correcto.

import { getCart, saveCart, removeFromCart } from '/assets/js/utils/storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const tableBody    = document.querySelector('#cart-table-body');
  const totalElement      = document.querySelector('#products-total strong');
  const totalFinalElement = document.querySelector('#products-total-final');

  // ─── RENDER ────────────────────────────────────────────────
  // Estructura Bootstrap limpia:
  //   col-2 imagen | col-4 nombre | col-3 controles | col-2 precio | col-1 eliminar

  function renderCheckout() {
    const cart = getCart();
    if (!tableBody) return;

    tableBody.innerHTML = '';
    let total = 0;

    if (!cart.length) {
      tableBody.innerHTML = `
        <div class="text-center py-5 text-muted">
          <p class="mb-3">Tu carrito está vacío</p>
          <a href="/pages/public/products.html" class="button-ixel-cafe">Ver productos</a>
        </div>
      `;
      if (totalElement) totalElement.textContent = '$0.00';
      return;
    }

    cart.forEach(item => {
      const subtotal = (item.price || 0) * (item.quantity || 1);
      total += subtotal;

      const row = document.createElement('div');
      row.className = 'row align-items-center py-3 border-bottom g-2';
      row.innerHTML = `
        <!-- Imagen thumbnail -->
        <div class="col-3 col-md-2">
          <img
            src="${item.imagen || ''}"
            alt="${item.name || 'Producto'}"
            style="width:80px;height:80px;object-fit:cover;border-radius:8px;"
            onerror="this.src='/assets/img/products/Tortillero Martina Grises.png';this.onerror=null"
          >
        </div>

        <!-- Nombre -->
        <div class="col-9 col-md-4">
          <p class="mb-0 fw-semibold" style="font-size:0.95rem;">${item.name || '—'}</p>
          <small class="text-muted">$${(item.price || 0).toFixed(2)} c/u</small>
        </div>

        <!-- Controles cantidad -->
        <div class="col-7 col-md-3 d-flex align-items-center gap-1">
          <button
            class="btn btn-sm btn-outline-secondary qty-minus"
            data-id="${item.id}"
            type="button"
            style="width:32px;height:32px;padding:0;line-height:1;"
          >−</button>
          <input
            type="number"
            value="${item.quantity || 1}"
            class="form-control form-control-sm text-center"
            readonly
            style="width:48px;height:32px;"
          >
          <button
            class="btn btn-sm btn-outline-secondary qty-plus"
            data-id="${item.id}"
            type="button"
            style="width:32px;height:32px;padding:0;line-height:1;"
          >+</button>
        </div>

        <!-- Precio subtotal -->
        <div class="col-4 col-md-2 text-end">
          <span class="fw-bold">$${subtotal.toFixed(2)}</span>
        </div>

        <!-- Eliminar -->
        <div class="col-1 text-end">
          <button
            class="btn btn-link btn-sm text-muted remove-item p-0"
            data-id="${item.id}"
            type="button"
            aria-label="Eliminar producto"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      tableBody.appendChild(row);
    });

    if (totalElement)      totalElement.textContent      = `$${total.toFixed(2)}`;
    if (totalFinalElement) totalFinalElement.textContent = `$${total.toFixed(2)}`;
  }

  // ─── CONTROLES: +/− y eliminar ─────────────────────────────
  // Delegación en document. String() en ambos lados.

  document.addEventListener('click', e => {
    const target = e.target.closest('[data-id]');
    if (!target) return;

    const id    = target.dataset.id;
    let   cart  = getCart();
    const index = cart.findIndex(item => String(item.id) === String(id));

    if (e.target.closest('.qty-plus') && index >= 0) {
      cart[index].quantity += 1;
      saveCart(cart);
    } else if (e.target.closest('.qty-minus') && index >= 0) {
      if (cart[index].quantity > 1) cart[index].quantity -= 1;
      else cart.splice(index, 1);
      saveCart(cart);
    } else if (e.target.closest('.remove-item')) {
      removeFromCart(id);
    } else {
      return; // click en otro elemento con data-id
    }

    renderCheckout();
    window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
  });

  renderCheckout();
});