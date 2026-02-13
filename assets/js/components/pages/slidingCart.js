document.addEventListener('DOMContentLoaded', () => {
    // Seleccionando elementos del DOM que interactúan con el carrito
    let openShopping = document.querySelector('.header-cart'); // botón para abrir carrito
    let closeShopping = document.querySelector('.closeShopping'); // botón para cerrar carrito
    let listCart = document.querySelector('.listCart'); // contenedor de los items en el carrito
    let total = document.querySelector('.total'); // total del carrito

    
    const getProducts = [
  { id: 1, name: "Red Shirt oli", category: "olinala", subcategory:"tortillero", price: 25, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { id: 2, name: "Blue Jeans oli", category: "olinala", subcategory:"servilletero", price: 40, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { id: 3, name: "Running Shoes mart", category: "martina", subcategory:"charola", price: 60, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { id: 4, name: "Boots mart", category: "martina", subcategory:"nicho", price: 80, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { id: 5, name: "Cap mart", category: "martina", subcategory:"caja-te", price: 15, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { id: 6, name: "Watch oli", category: "olinala", subcategory:"charola", price: 120, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { id: 7, name: "Jacket jag", category: "jaguares", subcategory:"servilletero", price: 90, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
  { id: 8, name: "Sandals panal", category: "panal", subcategory:"tortillero", price: 30, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit" },
    ];

    // Array interno que guarda los items que se agregan al carrito
    let listCarts = [];
    // Evento para abrir el carrito
    openShopping.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.cart').classList.add('active');
    });

    // Evento para cerrar el carrito
    closeShopping.addEventListener('click', () => {
        document.querySelector('.cart').classList.remove('active');
    });

    // Delegación de eventos para cualquier botón con clase 'addCart'
    document.addEventListener('click', (e) => {
        const addCartBtn = e.target.closest('.addCart');
        if (!addCartBtn) return; // ignorar clicks que no sean botones de agregar
        e.preventDefault(); // prevenir comportamiento por defecto (links o botones)

        const productId = Number(addCartBtn.dataset.id); // obtenemos el id del producto desde el atributo data-id
        if (!productId) return; // si no hay id válido, ignorar

        addToCart(productId);
    });

    // Función para agregar un producto al carrito
    function addToCart(productId) {
        // Verificamos si el producto ya está en el carrito
        let position = listCarts.findIndex(v => v.productId === productId);

        if (position < 0) {
            // Si no está, lo agregamos con cantidad 1
            listCarts.push({ productId, quantity: 1 });
        } else {
            // Si ya estaba, aumentamos la cantidad
            listCarts[position].quantity += 1;
        }

        // Actualizamos el carrito en pantalla
        reloadCart();
        document.querySelector('.cart').classList.add('active');
    }
    

    // Función para actualizar la lista del carrito y el total
    function reloadCart() {

    
    let quantity = document.querySelector('.quantity');
    let count = 0;
    let totalPrice = 0;

    listCarts.forEach(item => {
        const product = getProducts.find(p => p.id === item.productId);
        if (!product) return;

        totalPrice += product.price * item.quantity;
        count += item.quantity;
    });

    // Render cart ONLY if cart DOM exists
    if (!listCart || !total) return;

    listCart.innerHTML = '';

    listCarts.forEach(item => {
        const product = getProducts.find(p => p.id === item.productId);
        if (!product) return;

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
        total.innerText = `Pagar: ${totalPrice} $`;

   

    });
    
    total.innerText = `Pagar: ${totalPrice} $`;
    quantity.innerText = count;

}


    // Delegación de eventos para botones de aumentar o disminuir cantidad
    document.addEventListener('click', (e) => {
        if (e.target.matches('.qty-plus, .qty-minus')) {
            const productId = Number(e.target.dataset.id);
            const delta = e.target.classList.contains('qty-plus') ? 1 : -1;
            changeQuantity(productId, delta);
        }
    });

    // Función para modificar la cantidad de un producto en el carrito
    function changeQuantity(productId, value) {
        let pos = listCarts.findIndex(v => v.productId === productId);
        if (pos >= 0) {
            listCarts[pos].quantity += value;
            // Si la cantidad llega a cero, eliminamos el producto del carrito
            if (listCarts[pos].quantity <= 0) listCarts.splice(pos, 1);
            reloadCart(); // actualizamos el carrito
        }
    }

});

