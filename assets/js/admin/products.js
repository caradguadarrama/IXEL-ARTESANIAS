// assets/js/admin/products.js
/**
 * Administración de Productos
 * Gestión CRUD de productos artesanales
 */

import { getProducts, saveProducts } from '../services/product.service.js';

/* ========================================
   ESTADO DE LA APLICACIÓN
   ======================================== */

const STATE = {
  products: [],
  filteredProducts: [],
  currentPage: 1,
  itemsPerPage: 10,
  editingProductId: null,
  filters: {
    search: '',
    category: '',
    subcategory: ''
  }
};

/* ========================================
   ELEMENTOS DEL DOM
   ======================================== */

const DOM = {
  // Tabla
  tableBody: document.getElementById('products-table-body'),
  emptyState: document.getElementById('empty-state'),
  loadingState: document.getElementById('loading-state'),
  
  // Filtros
  searchInput: document.getElementById('search-input'),
  filterCategory: document.getElementById('filter-category'),
  filterSubcategory: document.getElementById('filter-subcategory'),
  btnClearFilters: document.getElementById('btn-clear-filters'),
  
  // Botones principales
  btnAddProduct: document.getElementById('btn-add-product'),
  selectAll: document.getElementById('select-all'),
  
  // Modal producto
  productModal: document.getElementById('product-modal'),
  modalOverlay: document.getElementById('modal-overlay'),
  modalClose: document.getElementById('modal-close'),
  modalTitle: document.getElementById('modal-title'),
  productForm: document.getElementById('product-form'),
  btnCancel: document.getElementById('btn-cancel'),
  btnSubmit: document.getElementById('btn-submit'),
  
  // Modal eliminar
  deleteModal: document.getElementById('delete-modal'),
  deleteModalOverlay: document.getElementById('delete-modal-overlay'),
  deleteProductName: document.getElementById('delete-product-name'),
  btnCancelDelete: document.getElementById('btn-cancel-delete'),
  btnConfirmDelete: document.getElementById('btn-confirm-delete'),
  
  // Paginación
  paginationShowing: document.getElementById('pagination-showing'),
  paginationTotal: document.getElementById('pagination-total'),
  paginationNav: document.getElementById('pagination-nav')
};

/* ========================================
   INICIALIZACIÓN
   ======================================== */

async function init() {
  showLoading();
  await loadProducts();
  setupEventListeners();
  hideLoading();
}

/* ========================================
   CARGA DE PRODUCTOS
   ======================================== */

async function loadProducts() {
  try {
    STATE.products = await getProducts();
    STATE.filteredProducts = [...STATE.products];
    renderProducts();
  } catch (error) {
    console.error('Error cargando productos:', error);
    showError('Error al cargar los productos');
  }
}

/* ========================================
   EVENT LISTENERS
   ======================================== */

function setupEventListeners() {
  // Filtros
  DOM.searchInput?.addEventListener('input', handleSearch);
  DOM.filterCategory?.addEventListener('change', handleCategoryFilter);
  DOM.filterSubcategory?.addEventListener('change', handleSubcategoryFilter);
  DOM.btnClearFilters?.addEventListener('click', clearFilters);
  
  // Botones principales
  DOM.btnAddProduct?.addEventListener('click', openAddProductModal);
  DOM.selectAll?.addEventListener('change', handleSelectAll);
  
  // Modal producto
  DOM.modalOverlay?.addEventListener('click', closeProductModal);
  DOM.modalClose?.addEventListener('click', closeProductModal);
  DOM.btnCancel?.addEventListener('click', closeProductModal);
  DOM.productForm?.addEventListener('submit', handleProductSubmit);
  
  // Modal eliminar
  DOM.deleteModalOverlay?.addEventListener('click', closeDeleteModal);
  DOM.btnCancelDelete?.addEventListener('click', closeDeleteModal);
  
  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeDeleteModal();
    }
  });
}

/* ========================================
   RENDERIZADO
   ======================================== */

function renderProducts() {
  if (!DOM.tableBody) return;

  const start = (STATE.currentPage - 1) * STATE.itemsPerPage;
  const end = start + STATE.itemsPerPage;
  const pageProducts = STATE.filteredProducts.slice(start, end);

  // Mostrar estado vacío si no hay productos
  if (STATE.filteredProducts.length === 0) {
    DOM.tableBody.innerHTML = '';
    showEmptyState();
    return;
  }

  hideEmptyState();

  // Renderizar filas
  DOM.tableBody.innerHTML = pageProducts.map(product => `
    <tr data-product-id="${product.id}">
      <td class="admin-table__td">
        <input type="checkbox" class="admin-checkbox product-checkbox" value="${product.id}">
      </td>
      <td class="admin-table__td">
        <img src="${product.image}" alt="${product.name}" class="admin-table__image">
      </td>
      <td class="admin-table__td">
        <div class="admin-table__name">${product.name}</div>
      </td>
      <td class="admin-table__td">
        <span class="admin-table__category">${formatCategory(product.category)}</span>
      </td>
      <td class="admin-table__td">
        <span class="admin-table__price">$${product.currentPrice.toFixed(2)}</span>
        ${product.originalPrice ? `<br><small style="text-decoration: line-through; color: #6c757d;">$${product.originalPrice.toFixed(2)}</small>` : ''}
      </td>
      <td class="admin-table__td">
        <span class="admin-table__stock ${product.stock < 5 ? 'admin-table__stock--low' : ''}">${product.stock}</span>
      </td>
      <td class="admin-table__td">
        <span class="admin-badge ${product.active ? 'admin-badge--active' : 'admin-badge--inactive'}">
          ${product.active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      <td class="admin-table__td">
        <div class="admin-table__actions">
          <button class="admin-action-button admin-action-button--edit" 
                  onclick="window.editProduct('${product.id}')"
                  aria-label="Editar">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="admin-action-button admin-action-button--delete" 
                  onclick="window.deleteProduct('${product.id}')"
                  aria-label="Eliminar">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updatePagination();
}

function updatePagination() {
  const totalProducts = STATE.filteredProducts.length;
  const start = (STATE.currentPage - 1) * STATE.itemsPerPage + 1;
  const end = Math.min(STATE.currentPage * STATE.itemsPerPage, totalProducts);
  
  if (DOM.paginationShowing) {
    DOM.paginationShowing.textContent = `${start}-${end}`;
  }
  if (DOM.paginationTotal) {
    DOM.paginationTotal.textContent = totalProducts;
  }

  renderPaginationButtons();
}

function renderPaginationButtons() {
  if (!DOM.paginationNav) return;

  const totalPages = Math.ceil(STATE.filteredProducts.length / STATE.itemsPerPage);
  
  if (totalPages <= 1) {
    DOM.paginationNav.innerHTML = '';
    return;
  }

  const buttons = [];

  // Botón anterior
  buttons.push(`
    <button class="admin-pagination__button" 
            onclick="window.changePage(${STATE.currentPage - 1})"
            ${STATE.currentPage === 1 ? 'disabled' : ''}>
      Anterior
    </button>
  `);

  // Botones de página
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= STATE.currentPage - 1 && i <= STATE.currentPage + 1)
    ) {
      buttons.push(`
        <button class="admin-pagination__button ${i === STATE.currentPage ? 'admin-pagination__button--active' : ''}"
                onclick="window.changePage(${i})">
          ${i}
        </button>
      `);
    } else if (i === STATE.currentPage - 2 || i === STATE.currentPage + 2) {
      buttons.push('<span style="padding: 0 0.5rem;">...</span>');
    }
  }

  // Botón siguiente
  buttons.push(`
    <button class="admin-pagination__button" 
            onclick="window.changePage(${STATE.currentPage + 1})"
            ${STATE.currentPage === totalPages ? 'disabled' : ''}>
      Siguiente
    </button>
  `);

  DOM.paginationNav.innerHTML = buttons.join('');
}

/* ========================================
   FILTROS
   ======================================== */

function handleSearch(event) {
  STATE.filters.search = event.target.value.toLowerCase();
  applyFilters();
}

function handleCategoryFilter(event) {
  STATE.filters.category = event.target.value;
  applyFilters();
}

function handleSubcategoryFilter(event) {
  STATE.filters.subcategory = event.target.value;
  applyFilters();
}

function applyFilters() {
  STATE.filteredProducts = STATE.products.filter(product => {
    const matchSearch = !STATE.filters.search || 
                       product.name.toLowerCase().includes(STATE.filters.search) ||
                       product.description.toLowerCase().includes(STATE.filters.search);
    
    const matchCategory = !STATE.filters.category || 
                         product.category === STATE.filters.category;
    
    const matchSubcategory = !STATE.filters.subcategory || 
                            product.subcategory === STATE.filters.subcategory;

    return matchSearch && matchCategory && matchSubcategory;
  });

  STATE.currentPage = 1;
  renderProducts();
}

function clearFilters() {
  STATE.filters = { search: '', category: '', subcategory: '' };
  
  if (DOM.searchInput) DOM.searchInput.value = '';
  if (DOM.filterCategory) DOM.filterCategory.value = '';
  if (DOM.filterSubcategory) DOM.filterSubcategory.value = '';
  
  applyFilters();
}

/* ========================================
   MODAL PRODUCTO
   ======================================== */

function openAddProductModal() {
  STATE.editingProductId = null;
  
  if (DOM.modalTitle) {
    DOM.modalTitle.textContent = 'Agregar Producto';
  }
  if (DOM.btnSubmit) {
    DOM.btnSubmit.textContent = 'Guardar Producto';
  }
  
  DOM.productForm?.reset();
  clearFormErrors();
  openModal(DOM.productModal);
}

function openEditProductModal(productId) {
  const product = STATE.products.find(p => p.id === productId);
  if (!product) return;

  STATE.editingProductId = productId;
  
  if (DOM.modalTitle) {
    DOM.modalTitle.textContent = 'Editar Producto';
  }
  if (DOM.btnSubmit) {
    DOM.btnSubmit.textContent = 'Actualizar Producto';
  }

  // Llenar formulario
  fillForm(product);
  clearFormErrors();
  openModal(DOM.productModal);
}

function fillForm(product) {
  const form = DOM.productForm;
  if (!form) return;

  form.elements.name.value = product.name;
  form.elements.category.value = product.category;
  form.elements.subcategory.value = product.subcategory;
  form.elements.description.value = product.description;
  form.elements.currentPrice.value = product.currentPrice;
  form.elements.originalPrice.value = product.originalPrice || '';
  form.elements.stock.value = product.stock;
  form.elements.image.value = product.image;
  form.elements.active.checked = product.active;
}

function closeProductModal() {
  closeModal(DOM.productModal);
  DOM.productForm?.reset();
  clearFormErrors();
  STATE.editingProductId = null;
}

/* ========================================
   SUBMIT FORMULARIO
   ======================================== */

async function handleProductSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const formData = getFormData();
  
  try {
    if (STATE.editingProductId) {
      await updateProduct(STATE.editingProductId, formData);
    } else {
      await createProduct(formData);
    }
    
    closeProductModal();
    await loadProducts();
    showSuccess(STATE.editingProductId ? 'Producto actualizado' : 'Producto creado');
  } catch (error) {
    console.error('Error guardando producto:', error);
    showError('Error al guardar el producto');
  }
}

function getFormData() {
  const form = DOM.productForm;
  
  return {
    name: form.elements.name.value.trim(),
    category: form.elements.category.value,
    subcategory: form.elements.subcategory.value,
    description: form.elements.description.value.trim(),
    currentPrice: parseFloat(form.elements.currentPrice.value),
    originalPrice: form.elements.originalPrice.value ? parseFloat(form.elements.originalPrice.value) : null,
    stock: parseInt(form.elements.stock.value),
    image: form.elements.image.value.trim(),
    active: form.elements.active.checked
  };
}

function validateForm() {
  const form = DOM.productForm;
  let isValid = true;

  clearFormErrors();

  // Validar nombre
  if (!form.elements.name.value.trim()) {
    showFieldError('name', 'El nombre es obligatorio');
    isValid = false;
  }

  // Validar categoría
  if (!form.elements.category.value) {
    showFieldError('category', 'Selecciona una categoría');
    isValid = false;
  }

  // Validar subcategoría
  if (!form.elements.subcategory.value) {
    showFieldError('subcategory', 'Selecciona una subcategoría');
    isValid = false;
  }

  // Validar descripción
  if (!form.elements.description.value.trim()) {
    showFieldError('description', 'La descripción es obligatoria');
    isValid = false;
  }

  // Validar precio
  const price = parseFloat(form.elements.currentPrice.value);
  if (!price || price <= 0) {
    showFieldError('currentPrice', 'Ingresa un precio válido');
    isValid = false;
  }

  // Validar precio original si existe
  const originalPrice = form.elements.originalPrice.value;
  if (originalPrice && parseFloat(originalPrice) <= price) {
    showFieldError('originalPrice', 'El precio original debe ser mayor al precio actual');
    isValid = false;
  }

  // Validar stock
  const stock = parseInt(form.elements.stock.value);
  if (stock < 0 || isNaN(stock)) {
    showFieldError('stock', 'Ingresa un stock válido');
    isValid = false;
  }

  // Validar imagen
  if (!form.elements.image.value.trim()) {
    showFieldError('image', 'La URL de la imagen es obligatoria');
    isValid = false;
  }

  return isValid;
}

function showFieldError(fieldName, message) {
  const errorElement = DOM.productForm?.querySelector(`[data-error="${fieldName}"]`);
  const inputElement = DOM.productForm?.elements[fieldName];
  
  if (errorElement) {
    errorElement.textContent = message;
  }
  if (inputElement) {
    inputElement.classList.add('admin-form__input--error');
  }
}

function clearFormErrors() {
  const errors = DOM.productForm?.querySelectorAll('.admin-form__error');
  errors?.forEach(error => error.textContent = '');
  
  const inputs = DOM.productForm?.querySelectorAll('.admin-form__input, .admin-form__textarea, .admin-form__select');
  inputs?.forEach(input => input.classList.remove('admin-form__input--error'));
}

/* ========================================
   CRUD OPERATIONS
   ======================================== */

async function createProduct(productData) {
  const newProduct = {
    id: generateId(),
    ...productData,
    createdAt: new Date().toISOString()
  };

  STATE.products.push(newProduct);
  await saveProducts(STATE.products);
}

async function updateProduct(productId, productData) {
  const index = STATE.products.findIndex(p => p.id === productId);
  if (index === -1) return;

  STATE.products[index] = {
    ...STATE.products[index],
    ...productData,
    updatedAt: new Date().toISOString()
  };

  await saveProducts(STATE.products);
}

async function deleteProductById(productId) {
  STATE.products = STATE.products.filter(p => p.id !== productId);
  await saveProducts(STATE.products);
}

/* ========================================
   MODAL ELIMINAR
   ======================================== */

function openDeleteProductModal(productId) {
  const product = STATE.products.find(p => p.id === productId);
  if (!product) return;

  STATE.editingProductId = productId;
  
  if (DOM.deleteProductName) {
    DOM.deleteProductName.textContent = product.name;
  }

  // Event listener para confirmar
  DOM.btnConfirmDelete.onclick = async () => {
    try {
      await deleteProductById(productId);
      closeDeleteModal();
      await loadProducts();
      showSuccess('Producto eliminado');
    } catch (error) {
      console.error('Error eliminando producto:', error);
      showError('Error al eliminar el producto');
    }
  };

  openModal(DOM.deleteModal);
}

function closeDeleteModal() {
  closeModal(DOM.deleteModal);
  STATE.editingProductId = null;
}

/* ========================================
   UTILIDADES
   ======================================== */

function openModal(modal) {
  if (modal) {
    modal.classList.add('admin-modal--open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('admin-modal--open');
    document.body.style.overflow = '';
  }
}

function showLoading() {
  if (DOM.loadingState) DOM.loadingState.style.display = 'block';
  if (DOM.emptyState) DOM.emptyState.style.display = 'none';
  if (DOM.tableBody) DOM.tableBody.innerHTML = '';
}

function hideLoading() {
  if (DOM.loadingState) DOM.loadingState.style.display = 'none';
}

function showEmptyState() {
  if (DOM.emptyState) DOM.emptyState.style.display = 'block';
}

function hideEmptyState() {
  if (DOM.emptyState) DOM.emptyState.style.display = 'none';
}

function showSuccess(message) {
  // TODO: Implementar notificación toast
  alert(message);
}

function showError(message) {
  // TODO: Implementar notificación toast
  alert(message);
}

function formatCategory(category) {
  const categories = {
    olinala: 'Olinalá',
    martina: 'Martina',
    jaguares: 'Jaguares',
    panal: 'Panal'
  };
  return categories[category] || category;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function handleSelectAll(event) {
  const checkboxes = document.querySelectorAll('.product-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.checked = event.target.checked;
  });
}

function changePage(page) {
  const totalPages = Math.ceil(STATE.filteredProducts.length / STATE.itemsPerPage);
  if (page < 1 || page > totalPages) return;
  
  STATE.currentPage = page;
  renderProducts();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ========================================
   EXPONER FUNCIONES GLOBALES
   (para onclick en HTML)
   ======================================== */

window.editProduct = openEditProductModal;
window.deleteProduct = openDeleteProductModal;
window.changePage = changePage;

/* ========================================
   INIT
   ======================================== */

document.addEventListener('DOMContentLoaded', init);