/**
 * IXEL Artesanías — Servicio de Productos
 * Ruta: assets/js/admin/services/productos.service.js
 *
 * Maneja el CRUD de productos con persistencia en localStorage.
 * Lee los datos iniciales del JSON del proyecto.
 */

const STORAGE_KEY = 'ixel_productos';
let _productos = [];
let _nextId = 1;

export const ProductosService = {

  // ── Inicializa cargando desde localStorage o JSON ──
  async init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      _productos = JSON.parse(saved);
      _nextId = Math.max(..._productos.map(p => p.id)) + 1;
      return;
    }
    // Primera carga: intentar desde el JSON del proyecto
    try {
      const res = await fetch('/productos_final.json');
      if (res.ok) {
        _productos = await res.json();
        _nextId = Math.max(..._productos.map(p => p.id)) + 1;
        this._persist();
        return;
      }
    } catch (_) { /* offline o ruta diferente */ }

    // Fallback: datos embebidos mínimos (los primeros 10 como muestra)
    _productos = FALLBACK_PRODUCTOS;
    _nextId = FALLBACK_PRODUCTOS.length + 1;
    this._persist();
  },

  _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_productos));
  },

  // ── Leer ──
  getAll()       { return [..._productos]; },
  getById(id)    { return _productos.find(p => p.id === id) || null; },

  // ── Filtrar ──
  filter({ search = '', category = '', collection = '', stock = '' } = {}) {
    return _productos.filter(p => {
      if (search     && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (category   && p.category   !== category)   return false;
      if (collection && p.collection !== collection) return false;
      if (stock === 'agotado' && p.stock !== 0)          return false;
      if (stock === 'bajo'    && !(p.stock > 0 && p.stock <= 5)) return false;
      if (stock === 'ok'      && p.stock <= 5)            return false;
      return true;
    });
  },

  // ── Categorías / Colecciones únicas ──
  getCategories()  { return [...new Set(_productos.map(p => p.category))].sort(); },
  getCollections() { return [...new Set(_productos.map(p => p.collection))].sort(); },

  // ── Crear ──
  create(data) {
    const prod = {
      id:          _nextId++,
      name:        data.name.trim(),
      price:       parseFloat(data.price),
      category:    data.category,
      collection:  data.collection || 'General',
      stock:       parseInt(data.stock) || 0,
      imagen:      data.imagen || '/assets/img/products/default.png',
      description: data.description || `${data.name}. Pieza artesanal de madera Parota, Jalisco.`,
    };
    _productos.push(prod);
    this._persist();
    return prod;
  },

  // ── Actualizar ──
  update(id, data) {
    const idx = _productos.findIndex(p => p.id === id);
    if (idx === -1) return null;
    _productos[idx] = { ..._productos[idx], ...data };
    this._persist();
    return _productos[idx];
  },

  // ── Actualizar solo stock ──
  updateStock(id, newStock) {
    return this.update(id, { stock: parseInt(newStock) || 0 });
  },

  // ── Eliminar ──
  delete(id) {
    const before = _productos.length;
    _productos = _productos.filter(p => p.id !== id);
    this._persist();
    return _productos.length < before;
  },

  // ── Stats para el dashboard ──
  getStats() {
    const total = _productos.length;
    const agotado = _productos.filter(p => p.stock === 0).length;
    const bajo    = _productos.filter(p => p.stock > 0 && p.stock <= 5).length;
    const ok      = _productos.filter(p => p.stock > 5).length;
    const valorInventario = _productos.reduce((s, p) => s + p.price * p.stock, 0);
    const byCat   = _productos.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    return { total, agotado, bajo, ok, valorInventario, byCat };
  },
};

// ── Datos de respaldo si no hay JSON ni localStorage ──
const FALLBACK_PRODUCTOS = [
  { id:1,  category:'Tortilleros', name:'Tortillero Jaguar',             price:2137.5, collection:'Jaguar',  description:'Tortillero Jaguar. Pieza exclusiva fabricada en madera de Parota del estado de Jalisco.',           imagen:'/assets/img/products/Tortillero Jaguar.png',             stock:14 },
  { id:2,  category:'Tortilleros', name:'Tortillero Jaguar minimalista', price:2037.5, collection:'Jaguar',  description:'Tortillero Jaguar minimalista.',                                                                    imagen:'/assets/img/products/Tortillero Jaguar Minimalista.png', stock:0  },
  { id:3,  category:'Tortilleros', name:'Tortillero Panal',              price:1887.5, collection:'Panal',   description:'Tortillero Panal.',                                                                                 imagen:'/assets/img/products/Tortillero Panal.png',              stock:18 },
  { id:4,  category:'Tortilleros', name:'Tortillero Martina Grises',     price:2037.5, collection:'Martina', description:'Tortillero Martina Grises.',                                                                        imagen:'/assets/img/products/Tortillero Martina Grises.png',     stock:5  },
  { id:5,  category:'Tablas',      name:'Tabla rustica chica',           price:737.5,  collection:'General', description:'Tabla rustica chica.',                                                                              imagen:'/assets/img/products/Tortillero Martina Grises.png',     stock:12 },
  { id:6,  category:'Charolas',    name:'Charola Jaguar grande',         price:2337.5, collection:'Jaguar',  description:'Charola Jaguar grande.',                                                                            imagen:'/assets/img/products/Tortillero Martina Grises.png',     stock:6  },
  { id:7,  category:'Cajas',       name:'Caja Jaguar chica',             price:1487.5, collection:'Jaguar',  description:'Caja Jaguar chica.',                                                                                imagen:'/assets/img/products/Tortillero Martina Grises.png',     stock:8  },
  { id:8,  category:'Servilleteros',name:'Servilletero Jaguar',          price:887.5,  collection:'Jaguar',  description:'Servilletero Jaguar.',                                                                              imagen:'/assets/img/products/Servilletero Jaguar.png',           stock:14 },
  { id:9,  category:'Salseras',    name:'Salsera Jaguar chica',          price:687.5,  collection:'Jaguar',  description:'Salsera Jaguar chica.',                                                                             imagen:'/assets/img/products/Tortillero Martina Grises.png',     stock:10 },
  { id:10, category:'Molcajetes',  name:'Molcajete Jaguar',              price:2237.5, collection:'Jaguar',  description:'Molcajete Jaguar.',                                                                                 imagen:'/assets/img/products/Tortillero Martina Grises.png',     stock:6  },
];
