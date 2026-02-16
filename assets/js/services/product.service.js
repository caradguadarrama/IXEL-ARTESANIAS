// assets/js/services/product.service.js
/**
 * Servicio de Productos
 * Gestiona la persistencia de productos en localStorage
 */

const STORAGE_KEY = 'ixel_products';

/**
 * Obtiene todos los productos
 * @returns {Promise<Array>} Array de productos
 */
export async function getProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      // Si no hay productos, inicializar con mock data
      const mockProducts = getMockProducts();
      await saveProducts(mockProducts);
      return mockProducts;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return [];
  }
}

/**
 * Obtiene un producto por ID
 * @param {string} productId - ID del producto
 * @returns {Promise<Object|null>} Producto o null
 */
export async function getProductById(productId) {
  const products = await getProducts();
  return products.find(p => p.id === productId) || null;
}

/**
 * Guarda todos los productos
 * @param {Array} products - Array de productos
 * @returns {Promise<void>}
 */
export async function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Error guardando productos:', error);
    throw new Error('No se pudo guardar los productos');
  }
}

/**
 * Crea un nuevo producto
 * @param {Object} productData - Datos del producto
 * @returns {Promise<Object>} Producto creado
 */
export async function createProduct(productData) {
  const products = await getProducts();
  
  const newProduct = {
    id: generateId(),
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  products.push(newProduct);
  await saveProducts(products);
  
  return newProduct;
}

/**
 * Actualiza un producto existente
 * @param {string} productId - ID del producto
 * @param {Object} productData - Datos actualizados
 * @returns {Promise<Object|null>} Producto actualizado o null
 */
export async function updateProduct(productId, productData) {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === productId);
  
  if (index === -1) {
    return null;
  }

  products[index] = {
    ...products[index],
    ...productData,
    updatedAt: new Date().toISOString()
  };

  await saveProducts(products);
  return products[index];
}

/**
 * Elimina un producto
 * @param {string} productId - ID del producto
 * @returns {Promise<boolean>} true si se eliminó
 */
export async function deleteProduct(productId) {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== productId);
  
  if (filtered.length === products.length) {
    return false; // No se encontró el producto
  }

  await saveProducts(filtered);
  return true;
}

/**
 * Busca productos por término
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Array>} Productos encontrados
 */
export async function searchProducts(searchTerm) {
  const products = await getProducts();
  const term = searchTerm.toLowerCase();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term) ||
    product.subcategory.toLowerCase().includes(term)
  );
}

/**
 * Filtra productos por categoría
 * @param {string} category - Categoría
 * @returns {Promise<Array>} Productos filtrados
 */
export async function getProductsByCategory(category) {
  const products = await getProducts();
  return products.filter(p => p.category === category);
}

/**
 * Filtra productos por subcategoría
 * @param {string} subcategory - Subcategoría
 * @returns {Promise<Array>} Productos filtrados
 */
export async function getProductsBySubcategory(subcategory) {
  const products = await getProducts();
  return products.filter(p => p.subcategory === subcategory);
}

/**
 * Obtiene productos activos
 * @returns {Promise<Array>} Productos activos
 */
export async function getActiveProducts() {
  const products = await getProducts();
  return products.filter(p => p.active);
}

/* ========================================
   UTILIDADES
   ======================================== */

/**
 * Genera un ID único
 * @returns {string} ID único
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Datos mock iniciales
 * @returns {Array} Productos de ejemplo
 */
function getMockProducts() {
  return [
    {
      id: '1',
      name: 'Tortillero Olinalá',
      category: 'olinala',
      subcategory: 'tortillero',
      description: 'Tortillero artesanal de madera con diseño oaxaqueño tradicional',
      currentPrice: 240,
      originalPrice: 300,
      stock: 15,
      image: '../../assets/img/products/Tortillero Olinala.png',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Servilletero Jaguar',
      category: 'jaguares',
      subcategory: 'servilletero',
      description: 'Servilletero con diseño de jaguar chiapaneco tallado a mano',
      currentPrice: 180,
      originalPrice: null,
      stock: 8,
      image: '../../assets/img/products/Servilletero Jaguar.png',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Tortillero Martina Color',
      category: 'martina',
      subcategory: 'tortillero',
      description: 'Tortillero decorativo con colores vibrantes de la colección Martina',
      currentPrice: 350,
      originalPrice: 450,
      stock: 5,
      image: '../../assets/img/products/Tortillero Martina Color.png',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Caja para Té Martina',
      category: 'martina',
      subcategory: 'caja-te',
      description: 'Caja organizadora para bolsitas de té con diseño artesanal',
      currentPrice: 280,
      originalPrice: null,
      stock: 12,
      image: '../../assets/img/products/Caja te Martina Color.png',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Tortillero Panal',
      category: 'panal',
      subcategory: 'tortillero',
      description: 'Tortillero con diseño de panal, tallado artesanalmente',
      currentPrice: 260,
      originalPrice: null,
      stock: 3,
      image: '../../assets/img/products/Tortillero Panal.png',
      active: true,
      createdAt: new Date().toISOString()
    }
  ];
}