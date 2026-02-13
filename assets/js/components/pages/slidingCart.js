document.addEventListener('DOMContentLoaded', async () => {

    let openShopping = document.querySelector('.header-cart');
    let closeShopping = document.querySelector('.closeShopping');
    let listCart = document.querySelector('.listCart');
    let total = document.querySelector('.total');
    let container = document.querySelector('.checkout');
    let quantity = document.querySelector('.quantity');

    let allProducts = [];
    let listCarts = [];

    async function loadProductsData() {
        const response = await fetch("../../../../productos_final.json");
        if (!response.ok) throw new Error("JSON error");
        allProducts = await response.json();
    }

    await loadProductsData();

    openShopping.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.cart').classList.add('active');
    });

    closeShopping.addEventListener('click', () => {
        document.querySelector('.cart').classList.remove('active');
    });

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

        reloadCart();
        document.querySelector('.cart').classList.add('active');
    }

    function reloadCart() {
        let count = 0;
        let totalPrice = 0;

        if (!listCart || !total) return;

        listCart.innerHTML = '';

        listCarts.forEach(item => {
            const product = allProducts.find(p => p.id === item.productId);
            if (!product) return;

            totalPrice += product.price * item.quantity;
            count += item.quantity;

            const li = document.createElement('li');
            li.innerHTML = `
                <img src="../../assets/img/products/onilala.jpeg">
                <div>${product.name}</div>
                <div>$${product.price}</div>
                <div>
                    <button data-id="${product.id}" class="qty-minus">-</button>
                    <div class="count">${item.quantity}</div>
                    <button data-id="${product.id}" class="qty-plus">+</button>
                </div>
            `;
            listCart.appendChild(li);
        });

        total.innerText = `Pagar: ${totalPrice} $`;
        quantity.innerText = count;
    }

    document.addEventListener('click', e => {
        if (!e.target.matches('.qty-plus, .qty-minus')) return;

        const productId = Number(e.target.dataset.id);
        const value = e.target.classList.contains('qty-plus') ? 1 : -1;

        let pos = listCarts.findIndex(v => v.productId === productId);
        if (pos >= 0) {
            listCarts[pos].quantity += value;
            if (listCarts[pos].quantity <= 0) listCarts.splice(pos, 1);
            reloadCart();
        }
    });

});


