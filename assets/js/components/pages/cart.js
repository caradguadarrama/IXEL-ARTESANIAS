// assets/js/components/pages/cart.js — ES Module
//
// BUGS CORREGIDOS (persisten del turno anterior):
//
//   BUG 1 — DOMContentLoaded anidado (raíz del problema en about/contact/todas las páginas):
//     initSlidingCart() es invocada por injectNavbar() en main.js, que ya corre
//     dentro del DOMContentLoaded de main.js. Al registrar OTRO DOMContentLoaded
//     aquí adentro, ese evento ya disparó — el callback nunca se ejecuta,
//     openBtn queda null, ningún listener se registra → el carrito no abre
//     en ninguna página (index, about, contact, products, todas).
//     FIX: eliminar completamente el DOMContentLoaded interno.
//     Los querySelector corren directamente al invocar initSlidingCart() —
//     en ese momento el navbar ya existe porque main.js lo inyectó antes.
//
//   BUG 2 — window.location.origin = '...' (botón Pagar no redirigía):
//     .origin es una propiedad read-only de Location. Asignarle un valor
//     falla silenciosamente — sin error en consola, sin redirección.
//     El comentario decía .href pero el código usaba .origin.
//     FIX: window.location.href = '/pages/public/car.html'

import { getCart, saveCart } from '../../utils/storage.js';

export function initSlidingCart() {

  // Todos los querySelector corren aquí — SIN DOMContentLoaded adicional.
  // Cuando main.js llama initSlidingCart(), el navbar ya fue inyectado:
  //   DOMContentLoaded → init() → injectNavbar() [inyecta HTML + llama initSlidingCart()]
  // En este punto .header-cart, .cart, .listCart, etc. ya existen en el DOM.

  const cartDrawer    = document.querySelector('.cart');
  const openBtn       = document.querySelector('.header-cart');
  const closeBtn      = document.querySelector('.closeShopping');
  const listCartEl    = document.querySelector('.listCart');
  const totalEl       = document.querySelector('.total');
  const quantityBadge = document.querySelector('.quantity');

  // ─── ABRIR / CERRAR ──────────────────────────────────────────

  function openCart()  { cartDrawer?.classList.add('active');    }
  function closeCart() { cartDrawer?.classList.remove('active'); }

  openBtn?.addEventListener('click',  e => { e.preventDefault(); openCart(); });
  closeBtn?.addEventListener('click', closeCart);

  // ─── RENDER ──────────────────────────────────────────────────
  // Lee getCart() en cada llamada — sin estado propio.
  // item.imagen = campo real del JSON (verificado).

  function renderCart() {
    const cart = getCart();
    if (!listCartEl || !totalEl) return;

    listCartEl.innerHTML = '';

    if (!cart.length) {
      listCartEl.innerHTML = `
        <li style="text-align:center;padding:40px 20px;color:#999;">
          <p>Tu carrito está vacío</p>
          <small>Agrega productos para continuar</small>
        </li>
      `;
      totalEl.innerHTML = `
        <div style="opacity:0.5;padding:1rem;text-align:center;">
          PAGAR: $0.00
        </div>
      `;
      if (quantityBadge) quantityBadge.textContent = '0';
      return;
    }

    let totalPrice = 0;
    let totalCount = 0;

    cart.forEach(item => {
      totalPrice += (item.price    || 0) * (item.quantity || 1);
      totalCount += (item.quantity || 1);

      const li = document.createElement('li');
      li.innerHTML = `
        <img
          src="${item.imagen || ''}"
          alt="${item.name  || 'Producto'}"
          onerror="this.src='/assets/img/products/Tortillero Martina Grises.png';this.onerror=null"
        >
        <div>${item.name || '—'}</div>
        <div class="price">$${(item.price || 0).toFixed(2)}</div>
        <div>
          <button class="qty-minus" data-id="${item.id}" type="button" ${item.quantity === 1 ? 'disabled' : ''}>−</button>
          <div class="count">${item.quantity || 1}</div>
          <button class="qty-plus"  data-id="${item.id}" type="button">+</button>
        </div>
      `;
      listCartEl.appendChild(li);
    });

    // FIX BUG 2: .href (no .origin — .origin es read-only y no hace nada)
    totalEl.innerHTML = `
      <div class="total__pay" data-action="pay" style="cursor:pointer;">
        PAGAR: $${totalPrice.toFixed(2)}
      </div>
    `;
    totalEl.querySelector('[data-action="pay"]')?.addEventListener('click', () => {
      window.location.href = '/pages/public/car.html';
    });

    if (quantityBadge) quantityBadge.textContent = String(totalCount);
  }

  // ─── CONTROLES +/− ───────────────────────────────────────────
  // Delegación en listCartEl. String() en ambos lados.
  // FIX: No permite que quantity baje de 1

  listCartEl?.addEventListener('click', e => {
    const btn = e.target.closest('.qty-minus, .qty-plus');
    if (!btn) return;

    const cart  = getCart();
    const index = cart.findIndex(
      item => String(item.id) === String(btn.dataset.id)
    );
    if (index < 0) return;

    if (btn.classList.contains('qty-plus')) {
      cart[index].quantity += 1;
      saveCart(cart);
      window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
      renderCart();
    } else if (btn.classList.contains('qty-minus')) {
      //  Solo decrementar si quantity > 1
      // Si quantity === 1, simplemente no hacer nada
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCart(cart);
        window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
        renderCart();
      }
      // Si quantity === 1, salir sin hacer nada (no guarda, no renderiza)
    }
  });

  // ─── SINCRONIZACIÓN ──────────────────────────────────────────
  // Escucha StorageEvent({key:'cart'}) que products.js y landingPage.js
  // disparan tras addToCart(). Re-renderiza y abre el carrito.

  window.addEventListener('storage', e => {
    if (e.key !== 'cart') return;
    renderCart();
    openCart();
  });

  // Render inicial
  renderCart();
}