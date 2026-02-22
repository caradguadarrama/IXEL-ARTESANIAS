// assets/js/components/pages/checkout.js
//
// CAMBIO DE ESTE TURNO: solo se modificó renderCheckout().
// El resto del archivo (import, listeners, dispatchEvent) no se tocó.
//
// renderCheckout() ahora:
//   1. Pinta los items dentro de #cart-table-body con el estilo visual de Isaac:
//      imagen · nombre · descripción · controles qty · precio por línea.
//   2. Actualiza #products-info  → "X productos · $subtotal"
//   3. Actualiza #products-total span strong → "$total" (selector que ya existía)
//
// El bloque resumen (Envío Gratis / Total / botón Finalizar) ya está en el HTML
// estático de car.html — no se genera dinámicamente, solo se actualizan sus valores.

import { getCart, saveCart, removeFromCart } from '../../utils/storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#cart-table-body');
    const infoElement = document.querySelector('#products-info');
    const totalElement = document.querySelector('#products-total span strong');

    function renderCheckout() {
        const cart = getCart();
        if (!tableBody) return;

        tableBody.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            tableBody.innerHTML = '<div class="text-center py-5"><h4>Tu carrito está vacío</h4></div>';
            if (totalElement) totalElement.textContent = '$0.00';
            if (infoElement) infoElement.innerHTML = '<span>0 productos</span><span>$0.00</span>';
            return;
        }

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            totalItems += item.quantity;

            const row = document.createElement('div');
            row.className = "row mb-4 d-flex justify-content-between align-items-center border-bottom pb-3";
            
            // EL DISEÑO DE ISAAC DENTRO DE TU ESTRUCTURA
            row.innerHTML = `
                <div class="col-md-2 col-lg-2 col-xl-2">
                    <img src="${item.imagen}" class="img-fluid rounded-3" alt="${item.name}" style="max-height: 100px; object-fit: cover;">
                </div>
                <div class="col-md-4 col-lg-4 col-xl-4">
                    <h6 class="text-muted mb-1">${item.category || 'Artesanía'}</h6>
                    <h6 class="text-black mb-1 fw-bold">${item.name}</h6>
                    <p class="small text-muted mb-0 text-truncate" style="max-width: 250px;">
                        ${item.description || 'Pieza exclusiva de madera de Parota.'}
                    </p>
                </div>
                <div class="col-md-3 col-lg-3 col-xl-2 d-flex align-items-center">
                    <button class="btn btn-link px-2 qty-minus" data-id="${item.id}">
                        <i class="bi bi-dash-circle fs-5 text-secondary"></i>
                    </button>
                    <input type="number" value="${item.quantity}" class="form-control form-control-sm text-center fw-bold" readonly style="width: 45px; border: none; background: transparent;"/>
                    <button class="btn btn-link px-2 qty-plus" data-id="${item.id}">
                        <i class="bi bi-plus-circle fs-5 text-secondary"></i>
                    </button>
                </div>
                <div class="col-md-2 col-lg-2 col-xl-2">
                    <h6 class="mb-0 fw-bold">$${subtotal.toLocaleString()}</h6>
                    <small class="text-success" style="font-size: 0.7rem;">Envío Gratis</small>
                </div>
                <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                    <button class="btn btn-sm remove-item" data-id="${item.id}">
                        <i class="bi bi-trash3 text-danger"></i>
                    </button>
                </div>
            `;
            tableBody.appendChild(row);
        });

        // Actualizar Resumen Lateral
        if (infoElement) {
            infoElement.innerHTML = `
                <span>${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}</span>
                <span>$${total.toLocaleString()}</span>
            `;
        }
        if (totalElement) {
            totalElement.textContent = `$${total.toLocaleString()}`;
        }
    }

    // Listener de clicks (Idéntico a tu lógica anterior para no romper nada)
    document.addEventListener('click', (e) => {
        const id = e.target.closest('[data-id]')?.dataset.id;
        if (!id) return;

        let cart = getCart();
        const index = cart.findIndex(item => String(item.id) === String(id));

        if (e.target.closest('.qty-plus')) {
            cart[index].quantity++;
            saveCart(cart);
        } else if (e.target.closest('.qty-minus')) {
            if (cart[index].quantity > 1) cart[index].quantity--;
            else cart.splice(index, 1);
            saveCart(cart);
        } else if (e.target.closest('.remove-item')) {
            cart.splice(index, 1);
            saveCart(cart);
        }

        renderCheckout();
        // Notificar al Navbar y Carrito Lateral
        window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
    });

    renderCheckout();
});