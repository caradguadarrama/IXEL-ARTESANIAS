// assets/js/components/pages/slidingCart.js — ES Module

import { getCart } from '../../utils/storage.js'; // Solo importamos lo necesario

// Agregamos ASYNC aquí para poder usar await adentro
document.addEventListener('DOMContentLoaded', async () => {

    // ─── DOM ─────────────────────────────────────────────────────
    // Usamos los nombres exactos de las variables para evitar errores
    const cartDrawer    = document.querySelector('.cart');
    const openBtn       = document.querySelector('.header-cart');
    const closeBtn      = document.querySelector('.closeShopping');
    const listCartEl    = document.querySelector('.listCart');
    const totalEl       = document.querySelector('.total');
    const quantityBadge = document.querySelector('.quantity');

    let allProducts = [];
    let listCarts = [];

    // ========================================
    // 1. CARGAR PRODUCTOS DESDE JSON
    // ========================================
    async function loadProductsData() {
        try {
            const response = await fetch("../../../../productos_final.json");
            if (!response.ok) throw new Error("JSON error");
            allProducts = await response.json();
            
            // Guardar para car.html
            localStorage.setItem('products', JSON.stringify(allProducts));
        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    }

    // Ahora sí funciona el await porque la función padre es async
    await loadProductsData();

    // ========================================
    // 2. LÓGICA DE PERSISTENCIA (LOCAL)
    // ========================================
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            listCarts = JSON.parse(savedCart);
            reloadCart();
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(listCarts));
        // Disparamos evento para que el Navbar se entere (si usa otro script)
        window.dispatchEvent(new Event('storage'));
    }

    // ========================================
    // 3. EVENTOS DE ABRIR/CERRAR (CORREGIDO)
    // ========================================
    if (openBtn) {
        openBtn.addEventListener('click', e => {
            e.preventDefault();
            cartDrawer?.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            cartDrawer?.classList.remove('active');
        });
    }

    // ========================================
    // 4. AGREGAR AL CARRITO (DELEGACIÓN)
    // ========================================
    document.addEventListener('click', e => {
        const addCartBtn = e.target.closest('.addCart');
        if (!addCartBtn) return;

        const productId = Number(addCartBtn.dataset.id);
        if (!productId) return;

        addToCart(productId);
    });

    function addToCart(productId) {
        let position = listCarts.findIndex(v => v.productId === productId);

        if (position < 0) {
            listCarts.push({ productId, quantity: 1 });
        } else {
            listCarts[position].quantity += 1;
        }

        saveCart();
        reloadCart();
        cartDrawer?.classList.add('active'); // Abrir automáticamente
    }

    // ========================================
    // 5. RENDERIZAR CARRITO
    // ========================================
    function reloadCart() {
        let count = 0;
        let totalPrice = 0;

        if (!listCartEl || !totalEl) return;

        listCartEl.innerHTML = '';

        if (listCarts.length === 0) {
            listCartEl.innerHTML = `<li style="text-align: center; padding: 20px; color: #999;">Carrito vacío</li>`;
            totalEl.innerHTML = `<button class="button-ixel-beige" disabled>PAGAR: $0.00</button>`;
            if (quantityBadge) quantityBadge.innerText = 0;
            return;
        }

        listCarts.forEach(item => {
            const product = allProducts.find(p => p.id === item.productId);
            if (!product) return;

            totalPrice += product.price * item.quantity;
            count += item.quantity;

            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${product.imagen}" alt="${product.name}" style="width: 50px">
                <div>${product.name}</div>
                <div class="price">$${product.price.toFixed(2)}</div>
                <div>
                    <button data-id="${product.id}" class="qty-minus">-</button>
                    <span class="count">${item.quantity}</span>
                    <button data-id="${product.id}" class="qty-plus">+</button>
                </div>
            `;
            listCartEl.appendChild(li);
        });

        totalEl.innerHTML = `
            <a href="car.html" class="button-ixel-beige" style="text-decoration:none; display:block; text-align:center;">
                PAGAR: $${totalPrice.toFixed(2)}
            </a>
        `;
        if (quantityBadge) quantityBadge.innerText = count;
    }

    // ========================================
    // 6. CONTROL DE CANTIDADES
    // ========================================
    document.addEventListener('click', e => {
        if (!e.target.matches('.qty-plus, .qty-minus')) return;

        const productId = Number(e.target.dataset.id);
        const value = e.target.classList.contains('qty-plus') ? 1 : -1;

        let pos = listCarts.findIndex(v => v.productId === productId);
        if (pos >= 0) {
            listCarts[pos].quantity += value;
            if (listCarts[pos].quantity <= 0) listCarts.splice(pos, 1);
            
            saveCart();
            reloadCart();
        }
    });

    // Iniciar el carrito al cargar la página
    loadCart();

});