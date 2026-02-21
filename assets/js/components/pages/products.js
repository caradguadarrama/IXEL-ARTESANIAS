let allProducts = [];
let filteredProducts = [];
let visibleCount = 6;
const PAGE_SIZE = 6;

let activeCollection = null; // cards grandes
let activeCategory = null;   // sidebar (subcategory en HTML)

const container = document.querySelector("#cards");
const loadMoreBtn = document.querySelector("#loadMore");


// ===============================
// Carga de datos
// ===============================
async function loadProductsData() {
  try {
    const response = await fetch("../../../../productos_final.json");
    if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");

    allProducts = await response.json();

    filteredProducts = [...allProducts];
    renderProducts(filteredProducts, visibleCount);
    updateCategorySidebar();

  } catch (error) {
    console.error("Error al cargar productos:", error);
    container.innerHTML =
      `<p class="text-danger">Error al cargar productos.</p>`;
  }
}


// ===============================
// Renderizado
// ===============================
function renderProducts(list, count) {
  container.innerHTML = "";

  list.slice(0, count).forEach(product => {
    
    const hasStock = product.stock > 0;

    const col = document.createElement("div");
    col.className = "col-12 col-md-4";

    col.innerHTML = `
      <div class="product-card ${!hasStock ? 'out-of-stock' : ''}">
        <div class="product-image favorite">
          <img src="${product.imagen}" alt="${product.name}">
          ${!hasStock ? '<div class="no-stock-tag"></div>' : ''}
        </div>
        <h5 class="product-name">${product.name}</h5>
        <p class="product-price">$${product.price}</p>
        <button class="button-ixel-products addCart" data-id=${product.id} ${!hasStock ? 'disabled' : ''}>
          ${!hasStock ? 'Agotado' : '+'}
        </button>
      </div>
    `;

    container.appendChild(col);
  });

  if(loadMoreBtn) loadMoreBtn.style.display = count >= list.length ? "none" : "block";
}

// ===============================
// Filtros
// ===============================
function applyFilters() {
  console.log("activeCollection:", activeCollection);
  console.log("activeCategory:", activeCategory);

  filteredProducts = allProducts.filter(p => {
    console.log("Producto:", p);

    const matchCollection =
      !activeCollection || p.collection === activeCollection;

    const matchCategory =
      !activeCategory || p.category === activeCategory;

    console.log(
      "matchCollection:", matchCollection,
      "matchCategory:", matchCategory
    );

    return matchCollection && matchCategory;
  });

  console.log("Resultado filtrado:", filteredProducts);

  visibleCount = PAGE_SIZE;
  renderProducts(filteredProducts, visibleCount);
}



// ===============================
// Sidebar por colección
// ===============================
function updateCategorySidebar() {
  const links = document.querySelectorAll(".selectable-list a");

  if (!activeCollection) {
    links.forEach(link => {
      link.parentElement.style.display = "list-item";
    });
    return;
  }

  const validCategories = new Set(
    allProducts
      .filter(p => p.collection === activeCollection)
      .map(p => p.category)
  );

  links.forEach(link => {
    const category = link.dataset.subcategory; // 🔥 FIX

    if (validCategories.has(category)) {
      link.parentElement.style.display = "list-item";
    } else {
      link.parentElement.style.display = "none";
      link.classList.remove("active");

      if (activeCategory === category) {
        activeCategory = null;
      }
    }
  });
}


// ===============================
// Eventos
// ===============================
document.addEventListener("DOMContentLoaded", loadProductsData);

// Load more
loadMoreBtn.addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderProducts(filteredProducts, visibleCount);
});

// Cards grandes (colecciones)
document.querySelectorAll(".category").forEach(card => {
  card.addEventListener("click", () => {
    const collection = card.dataset.category;

    if (activeCollection === collection) {
      activeCollection = null;
      card.classList.remove("active");
    } else {
      activeCollection = collection;

      document
        .querySelectorAll(".category") // 🔥 FIX
        .forEach(c => c.classList.remove("active"));

      card.classList.add("active");
    }

    activeCategory = null;
    document
      .querySelectorAll(".selectable-list a")
      .forEach(l => l.classList.remove("active"));

    updateCategorySidebar();
    applyFilters();
  });
});

// Sidebar categorías FILTRAR CATEGORIAS DEPENDIENDO DEL CASO
document.querySelectorAll(".selectable-list a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const category = link.dataset.subcategory; //FIX

    if (activeCategory === category) {
      activeCategory = null;
      link.classList.remove("active");
    } else {
      activeCategory = category;

      document
        .querySelectorAll(".selectable-list a")
        .forEach(l => l.classList.remove("active"));

      link.classList.add("active");
    }

    applyFilters();
  });
});




//!funcionalidad de flechas de seccion de productos
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('subCategoryList');
  const btnLeft = document.getElementById('prevBtn');
  const btnRight = document.getElementById('nextBtn');

  if (list && btnLeft && btnRight) {
    // Desplaza 200px hacia la derecha
    btnRight.onclick = () => {
      list.scrollBy({ left: 250, behavior: 'smooth' });
    };

    // Desplaza 200px hacia la izquierda
    btnLeft.onclick = () => {
      list.scrollBy({ left: -250, behavior: 'smooth' });
    };



  }
});


//! dejar fijo el hover de catedoria y funcion para seleccionar y deselecionar 
document.addEventListener('click', (e) => {
  const card = e.target.closest('.category');

  if (card) {
    const isAlreadySelected = card.classList.contains('selected');

    document.querySelectorAll('.category').forEach(c => c.classList.remove('selected'));


    if (!isAlreadySelected) {
      card.classList.add('selected');
    }
  }
});