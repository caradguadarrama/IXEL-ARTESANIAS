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
import { getCart, saveCart } from '/assets/js/utils/storage.js';

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#cart-table-body');
    const totalElement = document.querySelector('#products-total span strong');
    const infoElement = document.querySelector('#products-info');
    const finalizarElement = document.querySelector('#finalizar-compra');

    function renderCheckout() {
        const cart = getCart();
        if (!tableBody) return;

        tableBody.innerHTML = ''; // Limpiamos
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            tableBody.innerHTML = '<div class="text-center py-4"><p>Tu carrito está vacío.</p></div>';

            //  Deshabilitar botón correctamente
            if (finalizarElement) {
                finalizarElement.disabled = true;
                finalizarElement.style.opacity = '0.5'; // ← Cambiado
                finalizarElement.style.cursor = 'not-allowed';
            }

            // Actualizar resumen a $0
            if (infoElement) {
                infoElement.innerHTML = `<span>0 productos</span> <span>$0.00</span>`;
            }
            if (totalElement) {
                totalElement.textContent = '$0.00';
            }

            return;

        }

        if (finalizarElement) {
            finalizarElement.disabled = false;
            finalizarElement.style.opacity = '1';
            finalizarElement.style.cursor = 'pointer';
        }


        cart.forEach(item => {
            const subtotal = item.price * (item.quantity || 1);
            total += subtotal;
            totalItems += (item.quantity || 1);

            // Creamos el elemento con el diseño visual de Isaac
            const productRow = document.createElement('div');
            productRow.className = "row py-3 border-bottom align-items-center";
            productRow.innerHTML = `
                <div class="col-3 col-md-2">
                    <img src="${item.imagen}" class="img-fluid rounded shadow-sm" alt="${item.name}" style="max-height: 80px; object-fit: cover;">
                </div>
                <div class="col-9 col-md-4">
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <small class="text-muted d-block">${item.description || 'Pieza artesanal de alta calidad.'}</small>
                    <small class="text-success fw-bold">Envío Gratis</small>
                </div>
                <div class="col-6 col-md-3 d-flex align-items-center justify-content-center mt-2 mt-md-0">
                    <button class="btn btn-sm btn-outline-secondary qty-minus" data-id="${item.id}" ${item.quantity === 1 ? 'disabled' : ''}>-</button>
                    <span class="mx-3 fw-bold">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary qty-plus" data-id="${item.id}">+</button>
                </div>
                <div class="col-6 col-md-3 text-end mt-2 mt-md-0">
                    <div class="fw-bold fs-5">$${subtotal.toFixed(2)}</div>
                    <button class="btn btn-sm text-danger remove-item" data-id="${item.id}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </div>
            `;
            tableBody.appendChild(productRow);
        });

        // Actualizamos los números del resumen lateral (Isaac style)
        if (infoElement) {
            infoElement.innerHTML = `<span>${totalItems} productos</span> <span>$${total.toFixed(2)}</span>`;
        }
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }

    }


    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-id]');
        if (!btn) return;

        const id = btn.dataset.id;
        let cart = getCart();
        const index = cart.findIndex(i => String(i.id) === String(id));

        if (e.target.closest('.qty-plus')) {
            cart[index].quantity += 1;
            saveCart(cart);
            window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }))
            renderCheckout();
        } else if (e.target.closest('.qty-minus')) {

            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                saveCart(cart);
                window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }))
                renderCheckout();
            }

        }
        else if (e.target.closest('.remove-item')) {
            const productName = cart[index].name || 'este producto';
            cart.splice(index, 1);
            saveCart(cart);
            window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }))
            renderCheckout();
        }
    });

    renderCheckout();
});