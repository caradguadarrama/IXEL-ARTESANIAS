/**
 * IXEL Artesanías — Servicio de Órdenes de Compra
 * Ruta: assets/js/admin/services/ordenes.service.js
 */

import { ProductosService } from './productos.service.js';

const STORAGE_KEY = 'ixel_ordenes';
let _ordenes = [];
let _nextNum  = 1;

const ESTADOS_VALIDOS = ['pendiente','procesando','enviada','entregada','cancelada'];

export const OrdenesService = {

  async init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      _ordenes = JSON.parse(saved);
      _nextNum  = _ordenes.length + 1;
      return;
    }
    // Datos demo
    _ordenes = buildDemoOrders();
    _nextNum  = _ordenes.length + 1;
    this._persist();
  },

  _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_ordenes));
  },

  _generateId() {
    return 'ORD-' + String(_nextNum++).padStart(3, '0');
  },

  // ── Leer ──
  getAll()           { return [..._ordenes]; },
  getById(id)        { return _ordenes.find(o => o.id === id) || null; },
  getByEstado(estado){ return _ordenes.filter(o => o.estado === estado); },

  // ── Crear ──
  create({ cliente, email, direccion, items }) {
    const productos = ProductosService.getAll();
    const total = items.reduce((sum, i) => {
      const p = productos.find(x => x.id === i.id);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);

    const orden = {
      id:        this._generateId(),
      cliente,
      email:     email || '',
      direccion: direccion || '',
      fecha:     new Date().toISOString().slice(0, 10),
      estado:    'pendiente',
      items:     [...items],
      total,
    };

    _ordenes.unshift(orden);
    this._persist();
    return orden;
  },

  // ── Cambiar estado ──
  cambiarEstado(id, nuevoEstado) {
    if (!ESTADOS_VALIDOS.includes(nuevoEstado)) return null;
    const orden = _ordenes.find(o => o.id === id);
    if (!orden) return null;
    orden.estado = nuevoEstado;
    this._persist();
    return orden;
  },

  // ── Stats ──
  getStats() {
    return {
      total:      _ordenes.length,
      pendiente:  _ordenes.filter(o => o.estado === 'pendiente').length,
      procesando: _ordenes.filter(o => o.estado === 'procesando').length,
      enviada:    _ordenes.filter(o => o.estado === 'enviada').length,
      entregada:  _ordenes.filter(o => o.estado === 'entregada').length,
      cancelada:  _ordenes.filter(o => o.estado === 'cancelada').length,
      ingresosMes: _ordenes
        .filter(o => o.estado === 'entregada' && o.fecha.startsWith(new Date().toISOString().slice(0,7)))
        .reduce((s, o) => s + o.total, 0),
    };
  },
};

// ── Datos demo ──
function buildDemoOrders() {
  return [
    { id:'ORD-001', cliente:'María García',    email:'maria@ejemplo.com',  direccion:'Av. Chapultepec 123, Guadalajara',      fecha:'2026-02-28', estado:'pendiente',   items:[{id:1,qty:1},{id:8,qty:2}],   total:4912.5  },
    { id:'ORD-002', cliente:'Carlos López',    email:'carlos@ejemplo.com', direccion:'Calle Reforma 456, Zapopan',            fecha:'2026-02-27', estado:'procesando',  items:[{id:6,qty:1},{id:5,qty:1}],   total:3075.0  },
    { id:'ORD-003', cliente:'Ana Martínez',    email:'ana@ejemplo.com',    direccion:'Blvd. Puerta de Hierro 789, GDL',       fecha:'2026-02-26', estado:'enviada',     items:[{id:7,qty:1},{id:9,qty:1}],   total:2175.0  },
    { id:'ORD-004', cliente:'Roberto Sánchez', email:'rob@ejemplo.com',    direccion:'Calle Morelos 321, Tlaquepaque',        fecha:'2026-02-25', estado:'entregada',   items:[{id:3,qty:2},{id:8,qty:1}],   total:4662.5  },
    { id:'ORD-005', cliente:'Sofía Torres',    email:'sofia@ejemplo.com',  direccion:'Av. Patria 654, Guadalajara',           fecha:'2026-02-24', estado:'entregada',   items:[{id:10,qty:1},{id:6,qty:1}],  total:4575.0  },
    { id:'ORD-006', cliente:'Diego Ramírez',   email:'diego@ejemplo.com',  direccion:'Hidalgo 88, Tonalá',                   fecha:'2026-03-01', estado:'pendiente',   items:[{id:4,qty:1}],                total:2037.5  },
    { id:'ORD-007', cliente:'Valeria Flores',  email:'val@ejemplo.com',    direccion:'Juárez 200, Guadalajara',              fecha:'2026-03-01', estado:'pendiente',   items:[{id:7,qty:1},{id:6,qty:1}],   total:3825.0  },
    { id:'ORD-008', cliente:'Fernando Díaz',   email:'fer@ejemplo.com',    direccion:'López Mateos 900, Zapopan',            fecha:'2026-02-23', estado:'cancelada',   items:[{id:1,qty:2}],                total:4275.0  },
  ];
}
