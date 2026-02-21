// assets/js/services/product.service.js
//
// Capa de datos: fetch real a productos_final.json.
// SIN lógica de UI. SIN localStorage como fuente de productos.
// SIN mock data.
//
// Caché en memoria: el JSON se descarga una vez por sesión.
// Todas las funciones de filtrado operan sobre el array en memoria,
// evitando múltiples fetches para el mismo dato.
//
// Ruta del JSON: productos_final.json está en la raíz del proyecto.
// Este módulo vive en assets/js/services/ → hay que subir 4 niveles.
// Pero como el servidor sirve desde la raíz, la ruta relativa correcta
// depende del origen del fetch, no de la ubicación del archivo.
// Con Live Server / servidor estático → usar ruta relativa al HTML:
// products.html está en pages/public/ → ../../.. sube a raíz.
// Se expone DATA_URL como constante para facilitar el cambio a
// una URL de API cuando llegue Spring Boot.

const DATA_URL = '../../productos_final.json';

/** @type {Array|null} Caché en memoria — null = no cargado aún */
let _cache = null;

/**
 * Carga todos los productos.
 * Segunda llamada devuelve la caché sin hacer fetch.
 * @returns {Promise<Array>}
 */
export async function getProducts() {
  if (_cache) return _cache;

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} al cargar productos`);
    _cache = await res.json();
    return _cache;
  } catch (err) {
    console.error('[product.service] Error:', err);
    return [];
  }
}

/**
 * Obtiene un producto por ID.
 * El JSON usa IDs numéricos — se normaliza la entrada con Number().
 * @param {string|number} id
 * @returns {Promise<Object|null>}
 */
export async function getProductById(id) {
  const products = await getProducts();
  return products.find(p => p.id === Number(id)) ?? null;
}

/**
 * Devuelve productos de la misma categoría, excluyendo el actual.
 * Útil para la sección de relacionados en product-detail.
 * @param {Object} product - Producto de referencia
 * @param {number} [limit=6]
 * @returns {Promise<Array>}
 */
export async function getRelatedProducts(product, limit = 6) {
  const products = await getProducts();
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}