// assets/js/utils/storage.js

/**
 * Módulo para manejar localStorage de forma segura y encapsulada
 */

const STORAGE_KEYS = {
  CART: 'cart',
  USER: 'user',
  FAVORITES: 'favorites'
};

/**
 * Obtiene datos del localStorage
 * @param {string} key - Clave del storage
 * @param {*} defaultValue - Valor por defecto si no existe
 * @returns {*} Datos parseados o valor por defecto
 */
function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error al leer ${key} del storage:`, error);
    return defaultValue;
  }
}

/**
 * Guarda datos en localStorage
 * @param {string} key - Clave del storage
 * @param {*} value - Valor a guardar
 * @returns {boolean} true si se guardó correctamente
 */
function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error al guardar ${key} en storage:`, error);
    return false;
  }
}

/**
 * Elimina un item del localStorage
 * @param {string} key - Clave a eliminar
 */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error al eliminar ${key} del storage:`, error);
  }
}

/**
 * Limpia todo el localStorage
 */
function clearStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error al limpiar el storage:', error);
  }
}

// ============================================
// FUNCIONES ESPECÍFICAS PARA CARRITO
// ============================================

/**
 * Obtiene el carrito actual
 * @returns {Array} Array de productos en el carrito
 */
export function getCart() {
  return getFromStorage(STORAGE_KEYS.CART, []);
}

/**
 * Guarda el carrito
 * @param {Array} cart - Array de productos
 * @returns {boolean} true si se guardó correctamente
 */
export function saveCart(cart) {
  return setToStorage(STORAGE_KEYS.CART, cart);
}

/**
 * Agrega un producto al carrito
 * @param {Object} product - Producto a agregar
 * @returns {boolean} true si se agregó correctamente
 */
export function addToCart(product) {
  const cart = getCart();
  const existingProductIndex = cart.findIndex(item => item.id === product.id);

  if (existingProductIndex > -1) {
    // Incrementar cantidad si ya existe
    cart[existingProductIndex].quantity += product.quantity || 1;
  } else {
    // Agregar nuevo producto
    cart.push({ ...product, quantity: product.quantity || 1 });
  }

  return saveCart(cart);
}

/**
 * Elimina un producto del carrito
 * @param {string|number} productId - ID del producto a eliminar
 * @returns {boolean} true si se eliminó correctamente
 */
export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  return saveCart(updatedCart);
}

/**
 * Limpia el carrito
 * @returns {boolean} true si se limpió correctamente
 */
export function clearCart() {
  return saveCart([]);
}

// ============================================
// FUNCIONES ESPECÍFICAS PARA USUARIO
// ============================================

/**
 * Obtiene el usuario actual
 * @returns {Object|null} Datos del usuario o null
 */
export function getUser() {
  return getFromStorage(STORAGE_KEYS.USER, null);
}

/**
 * Guarda los datos del usuario
 * @param {Object} user - Datos del usuario
 * @returns {boolean} true si se guardó correctamente
 */
export function saveUser(user) {
  return setToStorage(STORAGE_KEYS.USER, user);
}

/**
 * Elimina los datos del usuario (logout)
 */
export function removeUser() {
  removeFromStorage(STORAGE_KEYS.USER);
}

// ============================================
// FUNCIONES ESPECÍFICAS PARA FAVORITOS
// ============================================

/**
 * Obtiene los productos favoritos
 * @returns {Array} Array de IDs de productos favoritos
 */
export function getFavorites() {
  return getFromStorage(STORAGE_KEYS.FAVORITES, []);
}

/**
 * Agrega un producto a favoritos
 * @param {string|number} productId - ID del producto
 * @returns {boolean} true si se agregó correctamente
 */
export function addToFavorites(productId) {
  const favorites = getFavorites();
  
  if (!favorites.includes(productId)) {
    favorites.push(productId);
    return setToStorage(STORAGE_KEYS.FAVORITES, favorites);
  }
  
  return true;
}

/**
 * Elimina un producto de favoritos
 * @param {string|number} productId - ID del producto
 * @returns {boolean} true si se eliminó correctamente
 */
export function removeFromFavorites(productId) {
  const favorites = getFavorites();
  const updated = favorites.filter(id => id !== productId);
  return setToStorage(STORAGE_KEYS.FAVORITES, updated);
}