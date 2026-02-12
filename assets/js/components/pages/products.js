// Estado general de la aplicación
let allProducts = [];      // productos (local)
let filteredProducts = []; // productos filtrados que se van a renderizar
let visibleCount = 4;     // productos mostrados inicialmente
const PAGE_SIZE = 4; // paso de recarga (cuántos productos se cargan por vez)
let activeCategory = null; // categoría activa seleccionada
let activeSubcategory = null; // subcategoría activa seleccionada
const loadMoreBtn = document.querySelector("#loadMore");


async function loadProductsData() {
  try {
    const response = await fetch('../../../../productos_final.json'); // Ajusta la ruta a tu archivo
    if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");

    allProducts = await response.json();

    // Inicializamos la vista
    filteredProducts = [...allProducts];
    renderProducts(filteredProducts, visibleCount);

  } catch (error) {
    console.error("Error en el Backend/Fetch:", error);
    container.innerHTML = `<p class="text-danger">Error al cargar productos. Intente más tarde.</p>`;
  }
}


// Contenedor donde se insertan dinámicamente las cards de productos
const container = document.querySelector("#cards");


// Función encargada de renderizar productos en el DOM
// Recibe una lista (ya filtrada) y cuántos productos mostrar
function renderProducts(list, count) {
  // Limpia el contenedor antes de renderizar nuevamente
  container.innerHTML = "";

  // Se toman solo los productos necesarios según la paginación
  list.slice(0, count).forEach(product => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-4";

    // cambiar imagen por el valor de la imagen de cada producto parecido a product.image
    col.innerHTML = `
      <div class="product-card">
        <div class="product-image">
          <img src="../../assets/img/products/onilala.jpeg" alt="${product.name}">
        </div>
        <h5 class="product-name">${product.name}</h5>
        <p class="product-price">$${product.price}</p>
        <p class="product-description">${product.description}</p>
        <button class="btn btn-dark btn-sm w-100 addCart" data-id=${product.id}>
          Ver detalle
        </button>
      </div>
    `;

    // Se añade la columna al contenedor principal
    container.appendChild(col);
  });
  // Oculta o muestra el botón "Cargar más" según si hay más productos
  if (count >= list.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}


// Aplica todos los filtros activos (categoría y subcategoría)
// y vuelve a renderizar los productos
function applyFilters() {
  filteredProducts = allProducts.filter(p => {
    // Si no hay categoría activa, se aceptan todas
    const matchCategory =
      !activeCategory || p.category === activeCategory;

    // Si no hay subcategoría activa, se aceptan todas
    const matchSubcategory =
      !activeSubcategory || p.subcategory === activeSubcategory;

    // El producto debe cumplir ambas condiciones
    return matchCategory && matchSubcategory;
  });

  // Se reinicia la paginación al aplicar filtros
  visibleCount = PAGE_SIZE;
  renderProducts(filteredProducts, visibleCount);
}


// Inicialización cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  loadProductsData();
});



// Botón "Cargar más": muestra más productos respetando los filtros activos
document.querySelector("#loadMore").addEventListener("click", () => {
  visibleCount += PAGE_SIZE;

  renderProducts(filteredProducts, visibleCount);
});


// Filtro por categoría (tarjetas superiores)
document.querySelectorAll(".category").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;

    // Si se hace click en la categoría activa, se desactiva el filtro
    if (activeCategory === category) {
      activeCategory = null;
      card.classList.remove("active");
    } else {
      // Se activa una nueva categoría
      activeCategory = category;

      // Se limpia el estado visual de las demás categorías
      document
        .querySelectorAll(".category")
        .forEach(c => c.classList.remove("active"));

      card.classList.add("active");
    }

    // Se reaplican los filtros
    applyFilters();
  });
});


// Filtro por subcategoría (sidebar)
document.querySelectorAll(".selectable-list a").forEach(link => {
  link.addEventListener("click", e => {
    // Evita que el enlace navegue o recargue la página
    e.preventDefault();

    const subcategory = link.dataset.subcategory;
    console.log("Subcategory clicked:", subcategory); // keep for now

    // Toggle de subcategoría
    if (activeSubcategory === subcategory) {
      activeSubcategory = null;
      link.classList.remove("active");
    } else {
      activeSubcategory = subcategory;

      // Se limpia el estado visual de las demás subcategorías
      document
        .querySelectorAll(".selectable-list a")
        .forEach(l => l.classList.remove("active"));

      link.classList.add("active");
    }

    // Se reaplican los filtros combinados
    applyFilters();
  });
  
});