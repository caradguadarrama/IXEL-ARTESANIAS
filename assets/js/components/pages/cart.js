// ========================================
// CART-PAGE.JS - Página completa del carrito (car.html)
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. Obtener datos de localStorage
    let listCarts = JSON.parse(localStorage.getItem('cart')) || [];
    let allProducts = JSON.parse(localStorage.getItem('products')) || [];

    // 2. Elementos del DOM
    const cartHeader = document.querySelector('.card-header h5'); // "Carrito (X productos)"
    const cartBody = document.querySelector('.card-body'); // Contenedor de productos
    const productCountElement = document.getElementById('products-info'); // "Productos (X)"
    const subtotalElement = document.querySelector('.list-group-item:nth-child(1) span'); // Precio subtotal
    const totalElement = document.querySelector('.list-group-item:nth-child(3) span strong'); // Total
    const checkoutBtn = document.getElementById('finalizar-compra'); // Botón "Continuar compra"

    // ========================================
    // 3. FUNCIÓN PRINCIPAL - RENDERIZAR CARRITO
    // ========================================
    function renderCart() {
        if (!cartBody) return;

        // Limpiar contenedor
        cartBody.innerHTML = '';

        // Si el carrito está vacío
        if (listCarts.length === 0) {
            cartBody.innerHTML = `
                <div class="text-center py-5">
                    <div style="font-size: 80px; color: #ddd;">🛒</div>
                    <h4 class="mt-4 text-muted">Tu carrito está vacío</h4>
                    <p class="text-muted">Agrega productos para continuar con tu compra</p>
                    <a href="../../../pages/public/products.html" class="btn button-ixel-cafe mt-3">
                        Ver catálogo
                    </a>
                </div>
            `;
            updateTotals(0, 0);
            return;
        }

        // Renderizar cada producto
        listCarts.forEach((item, index) => {
            const product = allProducts.find(p => p.id === item.productId);
            if (!product) return;

            const productHTML = `
                <div class="row align-items-center product-item" data-product-id="${product.id}">
                    <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
                        <div class="bg-image hover-overlay hover-zoom ripple rounded">
                            <img src="${product.imagen || '/assets/img/products/default.png'}" 
                                 class="w-100 rounded" 
                                 alt="${product.name}" 
                                 style="object-fit: cover; height: 150px;" />
                        </div>
                    </div>

                    <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
                        <p class="fw-bold mb-1">${product.name}</p>
                        <p class="text-muted small mb-2">${product.description || 'Vendido por IXEL Artesanías'}</p>
                        <p class="text-success small mb-0">
                            <i class="bi bi-truck"></i> Envío gratis
                        </p>

                        <div class="mt-3">
                            <button type="button" 
                                    class="btn btn-link px-0 me-2 text-decoration-none text-muted small btn-remove"
                                    data-id="${product.id}">
                                <p class="text-danger">Eliminar</p>
                            </button>
                            
                        </div>
                    </div>

                    <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <div class="d-flex mb-4 justify-content-center" style="max-width: 300px">
                            
                                <button class="btn btn-outline-secondary px-3 me-2 qty-minus" 
                                    data-id="${product.id}"
                                    ${item.quantity === 1 ? 'disabled' : ''}>
                                    <i class="bi bi-dash fs-5"></i>
                                </button>
                            
                            <div class="form-outline">
                                <input type="number" 
                                       min="1" 
                                       value="${item.quantity}" 
                                       class="form-control text-center qty-input" 
                                       data-id="${product.id}"
                                       style="width: 70px;" readonly />
                            </div>
                            
                                <button class="btn btn-outline-secondary px-3 ms-2 qty-plus" 
                                    data-id="${product.id}">
                                <i class="bi bi-plus-lg">
                                </i>
                                </button>
                                
                        </div>

                        <p class="text-start text-md-center">
                            <strong class="fs-5 product-total" data-id="${product.id}">
                                $${(product.price * item.quantity).toFixed(2)}
                            </strong>
                        </p>
                    </div>
                </div>
                ${index < listCarts.length - 1 ? '<hr class="my-4" />' : ''}
            `;

            cartBody.insertAdjacentHTML('beforeend', productHTML);
        });

        // Calcular totales
        calculateTotals();

        // Agregar eventos a los botones
        addEventListeners();
    }

    // ========================================
    // 4. CALCULAR TOTALES
    // ========================================
    function calculateTotals() {
        let count = 0;
        let subtotal = 0;

        listCarts.forEach(item => {
            const product = allProducts.find(p => p.id === item.productId);
            if (product) {
                count += item.quantity;
                subtotal += product.price * item.quantity;
            }
        });

        updateTotals(count, subtotal);
    }

    // ========================================
    // 5. ACTUALIZAR UI DE TOTALES
    // ========================================
    function updateTotals(count, subtotal) {
        // Actualizar header
        if (cartHeader) {
            cartHeader.textContent = `Carrito (${count} producto${count !== 1 ? 's' : ''})`;
        }

        // Actualizar subtotal en resumen
        if (productCountElement) {
            productCountElement.innerHTML = `
                Productos (${count})
                <span>$${subtotal.toFixed(2)}</span>
            `;
        }

        // Actualizar solo el span del subtotal (si existe un elemento separado)
        if (subtotalElement && !productCountElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }

        // Actualizar total
        if (totalElement) {
            totalElement.textContent = `$${subtotal.toFixed(2)}`;
        }

        // Deshabilitar botón si carrito vacío
        if (checkoutBtn) {
            if (count === 0) {
                checkoutBtn.disabled = true;
                checkoutBtn.style.opacity = '0.5';
            } else {
                checkoutBtn.disabled = false;
                checkoutBtn.style.opacity = '1';
            }
        }
    }

    // ========================================
    // 6. EVENT LISTENERS
    // ========================================
    function addEventListeners() {
        // Botones de incrementar
        document.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                updateQuantity(productId, 1);
            });
        });

        // Botones de decrementar
        document.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                updateQuantity(productId, -1);
            });
        });

        // Inputs de cantidad (cambio manual)
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.dataset.id);
                const newQty = parseInt(e.target.value);

                if (newQty < 1) {
                    e.target.value = 1;
                    return;
                }

                setQuantity(productId, newQty);
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                removeProduct(productId);
            });
        });
    }

    // ========================================
    // 7. ACTUALIZAR CANTIDAD
    // ========================================
    function updateQuantity(productId, change) {
        const cartItem = listCarts.find(item => item.productId === productId);

        if (!cartItem) return;

        cartItem.quantity += change;

        // Si llega a 0, eliminar
        if (cartItem.quantity <= 0) {
            removeProduct(productId);
            return;
        }

        saveCart();
        renderCart();
    }

    // ========================================
    // 8. ESTABLECER CANTIDAD ESPECÍFICA
    // ========================================
    function setQuantity(productId, quantity) {
        const cartItem = listCarts.find(item => item.productId === productId);

        if (!cartItem) return;

        cartItem.quantity = quantity;
        saveCart();
        renderCart();
    }

    // ========================================
    // 9. ELIMINAR PRODUCTO
    // ========================================
    function removeProduct(productId) {

        listCarts = listCarts.filter(item => item.productId !== productId);
        saveCart();
        renderCart();

    }

    // ========================================
    // 10. GUARDAR EN LOCALSTORAGE
    // ========================================
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(listCarts));

        // Actualizar contador del navbar si existe
        updateNavbarCounter();
    }

    // ========================================
    // 11. ACTUALIZAR CONTADOR DEL NAVBAR
    // ========================================
    function updateNavbarCounter() {
        const navQty = document.querySelector('.quantity');
        if (navQty) {
            const totalItems = listCarts.reduce((sum, item) => sum + item.quantity, 0);
            navQty.textContent = totalItems;
        }
    }

    // ========================================
    // 13. BOTÓN DE CONTINUAR COMPRA
    // ========================================
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (listCarts.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }

            // Redirigir a la página de productos
            window.location.href = '../../../pages/public/products.html';
        });
    }

    // ========================================
    // INICIALIZAR
    // ========================================
    renderCart();
    updateNavbarCounter();
});