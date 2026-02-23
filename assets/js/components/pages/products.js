import { getProducts }       from '../../services/product.service.js';
import { createProductCard } from '../ui/ProductCard.js';

let allProducts      = [];
let filteredProducts = [];
let visibleCount     = 6;
const PAGE_SIZE      = 6;
let activeCollection = null;
let activeCategory   = null;

const cardsContainer = document.querySelector('#cards');
const loadMoreBtn    = document.querySelector('#loadMore');


// ===============================
// Carga de datos
// ===============================
async function loadProductsData() {
  try {
    allProducts = await getProducts();
    filteredProducts = [...allProducts];
    renderProducts(); // Ya no necesita pasarle parámetros si usamos las globales
  } catch (error) {
    console.error("Error al cargar productos:", error);
    if (cardsContainer) cardsContainer.innerHTML = `<p class="text-danger">Error al cargar productos.</p>`;
  }
}


// ===============================
// Renderizado
// ===============================
function renderProducts() {
  if (!cardsContainer) return;
  cardsContainer.innerHTML = "";

  const toRender = filteredProducts.slice(0, visibleCount);

  toRender.forEach(product => {
    // IMPORTANTE: Usamos el componente para que el HTML sea el mismo siempre
    const cardElement = createProductCard(product);
    
    // Creamos la columna de Bootstrap
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.appendChild(cardElement);
    
    cardsContainer.appendChild(col);
  });
  // Control del botón Cargar más
  if (visibleCount >= filteredProducts.length) {
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
  } else {
    if (loadMoreBtn) loadMoreBtn.style.display = 'block';
  }
}

// Inicializar
loadProductsData();


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

// --- DELEGACIÓN DE EVENTOS PARA AGREGAR AL CARRITO ---
if (cardsContainer) {
  cardsContainer.addEventListener('click', async (e) => {
    // Detectamos si se hizo clic en el botón de agregar
    const btn = e.target.closest('.product-card__add-btn');
    
    // Si no es el botón o está deshabilitado (sin stock), no hacemos nada
    if (!btn || btn.classList.contains('product-card__add-btn--disabled')) return;

    const productId = btn.dataset.id;
    
    // Buscamos el producto en nuestra lista global
    const product = allProducts.find(p => String(p.id) === String(productId));

    if (product) {
      // 1. Agregamos al storage
      import('../../utils/storage.js').then(module => {
        module.addToCart(product);

        // 2. Disparamos evento para que el carrito lateral se actualice/abra
        window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));

        // 3. FEEDBACK VISUAL: La palomita (✓)
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓'; // Cambiamos el texto a una palomita
        btn.classList.add('btn-success-anim'); // Opcional: clase para color verde

        // 4. Regresamos al estado original tras 2 segundos
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-success-anim');
        }, 2000);
      });
    }
  });
}
