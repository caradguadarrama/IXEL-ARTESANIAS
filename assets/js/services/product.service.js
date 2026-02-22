// assets/js/services/product.service.js
//
// CAMBIO: getMockProducts() eliminada completamente.
// Única fuente de verdad: productos_final.json vía fetch real.

const DATA_URL = '../../productos_final.json';

let _cache = null;

export async function getProducts() {
  if (_cache) return _cache;

  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`[product.service] HTTP ${res.status}`);
    _cache = await res.json();
    return _cache;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find(p => String(p.id) === String(id)) ?? null;
}

export async function getRelatedProducts(product, limit = 6) {
  const products = await getProducts();
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}