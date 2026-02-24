// assets/js/utils/storage.js
//
// CAMBIOS:
//   - addToCart: comparación normalizada a String() en ambos lados.
//     El JSON entrega IDs como number, el DOM como string.
//     item.id === product.id fallaba silenciosamente en edge cases.
//   - removeFromCart: ídem, String() en ambos lados.
//   - El resto del archivo no se toca.

const STORAGE_KEYS = {
  CART:      'cart',
  USER:      'user',
  FAVORITES: 'favorites'
};

function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error al leer ${key} del storage:`, error);
    return defaultValue;
  }
}

function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error al guardar ${key} en storage:`, error);
    return false;
  }
}

function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error al eliminar ${key} del storage:`, error);
  }
}

function clearStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error al limpiar el storage:', error);
  }
}

// ── CARRITO ───────────────────────────────────────────────────

export function getCart() {
  return getFromStorage(STORAGE_KEYS.CART, []);
}

export function saveCart(cart) {
  return setToStorage(STORAGE_KEYS.CART, cart);
}

/**
 * Agrega un producto al carrito.
 * CORRECCIÓN: String(item.id) === String(product.id)
 * Normaliza ambos lados para evitar fallos number vs string.
 */
export function addToCart(product) {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    item => String(item.id) === String(product.id)
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += product.quantity || 1;
  } else {
    cart.push({ ...product, quantity: product.quantity || 1 });
  }

  saveCart(cart);
window.dispatchEvent(new StorageEvent('storage', { key: 'cart' }));
return true;
}

/**
 * Elimina un producto del carrito.
 * CORRECCIÓN: String(item.id) !== String(productId)
 * Mismo motivo que addToCart.
 */
export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(
    item => String(item.id) !== String(productId)
  );
  return saveCart(updatedCart);
}

export function clearCart() {
  return saveCart([]);
}

// ── USUARIO ───────────────────────────────────────────────────

export function getUser() {
  return getFromStorage(STORAGE_KEYS.USER, null);
}

export function saveUser(user) {
  return setToStorage(STORAGE_KEYS.USER, user);
}

export function removeUser() {
  removeFromStorage(STORAGE_KEYS.USER);
}

// ── FAVORITOS ─────────────────────────────────────────────────

export function getFavorites() {
  return getFromStorage(STORAGE_KEYS.FAVORITES, []);
}

export function addToFavorites(productId) {
  const favorites = getFavorites();
  if (!favorites.includes(productId)) {
    favorites.push(productId);
    return setToStorage(STORAGE_KEYS.FAVORITES, favorites);
  }
  return true;
}

export function removeFromFavorites(productId) {
  const favorites = getFavorites();
  const updated = favorites.filter(id => id !== productId);
  return setToStorage(STORAGE_KEYS.FAVORITES, updated);
}