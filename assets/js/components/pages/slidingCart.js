document.addEventListener('DOMContentLoaded', async () => {

    let openShopping = document.querySelector('.header-cart');
    let closeShopping = document.querySelector('.closeShopping');
    let listCart = document.querySelector('.listCart');
    let total = document.querySelector('.total');
    let container = document.querySelector('.checkout');
    let quantity = document.querySelector('.quantity');

    let allProducts = [];
    let listCarts = [];

    // ========================================
    // 1. CARGAR PRODUCTOS DESDE JSON
    // ========================================
    async function loadProductsData() {
        const response = await fetch("../../../../productos_final.json");
        if (!response.ok) throw new Error("JSON error");
        allProducts = await response.json();
        
        //GUARDAR productos en localStorage para usarlos en car.html
        localStorage.setItem('products', JSON.stringify(allProducts));
    }

    await loadProductsData();

    // ========================================
    // 2. CARGAR CARRITO DESDE LOCALSTORAGE
    // ========================================
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            listCarts = JSON.parse(savedCart);
            reloadCart(); // Actualizar UI con los datos guardados
        }
    }

    //  Cargar el carrito al iniciar
    loadCart();

    // ========================================
    // 3. GUARDAR CARRITO EN LOCALSTORAGE
    // ========================================
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(listCarts));
    }

    // ========================================
    // 4. EVENTOS DE ABRIR/CERRAR CARRITO
    // ========================================
    openShopping.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.cart').classList.add('active');
    });

    closeShopping.addEventListener('click', () => {
        document.querySelector('.cart').classList.remove('active');
    });

    // ========================================
    // 5. AGREGAR AL CARRITO
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

        // ✅ GUARDAR en localStorage cada vez que se agrega
        saveCart();
        reloadCart();
        document.querySelector('.cart').classList.add('active');
    }

    // ========================================
    // 6. RENDERIZAR CARRITO
    // ========================================
    function reloadCart() {
        let count = 0;
        let totalPrice = 0;

        if (!listCart || !total) return;

        listCart.innerHTML = '';

        // Si el carrito está vacío
        if (listCarts.length === 0) {
            listCart.innerHTML = `
                <li style="text-align: center; padding: 40px 20px; color: #999;">
                    <p>Tu carrito está vacío</p>
                    <small>Agrega productos para continuar</small>
                </li>
            `;
            total.innerHTML = `
                <button class="button-ixel-beige" disabled style="opacity: 0.5;">
                    PAGAR: $0.00
                </button>
            `;
            quantity.innerText = 0;
            return;
        }

        // Renderizar productos
        listCarts.forEach(item => {
            const product = allProducts.find(p => p.id === item.productId);
            if (!product) return;

            totalPrice += product.price * item.quantity;
            count += item.quantity;

            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${product.imagen}" alt="${product.name}">
                <div>${product.name}</div>
                <div class="price">$${product.price.toFixed(2)}</div>
                <div>
                    <button data-id="${product.id}" class="qty-minus">-</button>
                    <div class="count">${item.quantity}</div>
                    <button data-id="${product.id}" class="qty-plus">+</button>
                </div>
            `;
            listCart.appendChild(li);
        });

        //  Botón de pagar con enlace a car.html
        total.innerHTML = `
            <a href="car.html">
                PAGAR: $${totalPrice.toFixed(2)}
            </a>
        `;
        quantity.innerText = count;
    }

    // ========================================
    // 7. INCREMENTAR/DECREMENTAR CANTIDAD
    // ========================================
    document.addEventListener('click', e => {
        if (!e.target.matches('.qty-plus, .qty-minus')) return;

        const productId = Number(e.target.dataset.id);
        const value = e.target.classList.contains('qty-plus') ? 1 : -1;

        let pos = listCarts.findIndex(v => v.productId === productId);
        if (pos >= 0) {
            listCarts[pos].quantity += value;
            
            // Si la cantidad llega a 0, eliminar del carrito
            if (listCarts[pos].quantity <= 0) {
                listCarts.splice(pos, 1);
            }
            
            // ✅ GUARDAR en localStorage cada vez que se modifica
            saveCart();
            reloadCart();
        }
    });

});