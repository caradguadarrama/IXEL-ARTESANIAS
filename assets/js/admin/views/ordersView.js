/**
 * IXEL Artesanías — Vista de Órdenes de Compra
 * Ruta: assets/js/admin/views/ordersView.js
 */

import { OrdenesService }   from '../services/ordenes.service.js';
import { ProductosService } from '../services/productos.service.js';
import { showToast, ESTADO_BADGE, ESTADO_LABEL, formatMXN, createModal, closeModal } from '../utils/helpers.js';
import { updateOrderBadge } from '../dashboard.js';

let _currentTab = 'todas';

export function renderOrdersView(container) {
  _currentTab = 'todas';
  container.innerHTML = buildShell();
  attachTabEvents();
  attachNewOrderBtn();
  renderOrders();
}

function buildShell() {
  return `
  <div class="admin-view active" id="view-orders">
    <div class="page-header">
      <div>
        <div class="breadcrumb-admin">Principal › <span>Órdenes de Compra</span></div>
        <div class="page-title">Órdenes de Compra</div>
      </div>
      <button class="btn-admin btn-primary-admin" id="btn-new-order">
        <i class='bx bx-plus'></i> Nueva Orden
      </button>
    </div>

    <div class="admin-tabs" id="order-tabs">
      <button class="admin-tab-btn active" data-tab="todas">Todas</button>
      <button class="admin-tab-btn" data-tab="pendiente">Pendientes</button>
      <button class="admin-tab-btn" data-tab="procesando">Procesando</button>
      <button class="admin-tab-btn" data-tab="enviada">Enviadas</button>
      <button class="admin-tab-btn" data-tab="entregada">Entregadas</button>
      <button class="admin-tab-btn" data-tab="cancelada">Canceladas</button>
    </div>

    <div id="orders-list"></div>
  </div>`;
}

function attachTabEvents() {
  document.querySelectorAll('#order-tabs .admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#order-tabs .admin-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _currentTab = btn.dataset.tab;
      renderOrders();
    });
  });
}

function attachNewOrderBtn() {
  document.getElementById('btn-new-order')?.addEventListener('click', openNewOrderModal);
}

function renderOrders() {
  const all      = OrdenesService.getAll();
  const filtered = _currentTab === 'todas' ? all : all.filter(o => o.estado === _currentTab);
  const list     = document.getElementById('orders-list');
  if (!list) return;

  if (!filtered.length) {
    list.innerHTML = `
      <div style="text-align:center;padding:56px;color:var(--ixel-muted)">
        <i class='bx bx-package' style="font-size:2.5rem"></i>
        <p style="margin-top:10px">No hay órdenes en esta categoría</p>
      </div>`;
    return;
  }

  const productos = ProductosService.getAll();

  list.innerHTML = filtered.map(o => {
    const itemsHTML = o.items.map(i => {
      const p = productos.find(x => x.id === i.id);
      if (!p) return '';
      return `<div class="order-line">
        <span class="badge-admin badge-gray" style="font-size:.7rem">#${p.id}</span>
        <span style="flex:1;font-weight:500">${p.name}</span>
        <span style="color:var(--ixel-muted)">×${i.qty}</span>
        <span style="font-weight:600">${formatMXN(p.price * i.qty)}</span>
      </div>`;
    }).join('');

    const actionBtns = [
      o.estado === 'pendiente'   ? `<button class="btn-admin btn-admin-sm" style="background:var(--blue-bg);color:var(--blue);border:1px solid #bbdefb" data-id="${o.id}" data-newstado="procesando">Procesar</button>` : '',
      o.estado === 'procesando'  ? `<button class="btn-admin btn-admin-sm" style="background:#e8f5e9;color:var(--green);border:1px solid #c8e6c9"        data-id="${o.id}" data-newstado="enviada">Marcar enviada</button>` : '',
      o.estado === 'enviada'     ? `<button class="btn-admin btn-admin-sm" style="background:var(--green-bg);color:var(--green);border:1px solid #c8e6c9"  data-id="${o.id}" data-newstado="entregada">Confirmar entrega</button>` : '',
      (o.estado === 'pendiente' || o.estado === 'procesando') ? `<button class="btn-admin btn-admin-sm btn-danger-admin" data-id="${o.id}" data-newstado="cancelada">Cancelar</button>` : '',
      `<button class="btn-admin btn-outline-admin btn-admin-sm" data-id="${o.id}" data-action="ver"><i class='bx bx-show'></i> Ver</button>`,
    ].filter(Boolean).join('');

    return `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <div class="order-id">${o.id}</div>
          <div style="font-size:.74rem;color:var(--ixel-muted)">${o.fecha} · ${o.direccion}</div>
        </div>
        <div class="order-card-items">
          <div style="font-weight:600;font-size:.9rem">${o.cliente}</div>
          <div class="order-items-label">${o.email} · ${o.items.length} producto${o.items.length!==1?'s':''}</div>
        </div>
        <div class="order-total">${formatMXN(o.total)}</div>
        ${ESTADO_BADGE[o.estado] || ''}
        <div style="display:flex;gap:6px;flex-wrap:wrap">${actionBtns}</div>
      </div>
      <div class="order-card-body">${itemsHTML}</div>
    </div>`;
  }).join('');

  // Eventos de botones
  list.querySelectorAll('[data-newstado]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id         = btn.dataset.id;
      const nuevoEstado = btn.dataset.newstado;
      OrdenesService.cambiarEstado(id, nuevoEstado);
      showToast(`Orden ${id}: ${ESTADO_LABEL[nuevoEstado]}`);
      updateOrderBadge();
      renderOrders();
    });
  });

  list.querySelectorAll('[data-action="ver"]').forEach(btn => {
    btn.addEventListener('click', () => openOrderDetail(btn.dataset.id));
  });
}

// ── Detalle de orden ──
function openOrderDetail(id) {
  const o        = OrdenesService.getById(id);
  if (!o) return;
  const productos = ProductosService.getAll();

  const rows = o.items.map(i => {
    const p = productos.find(x => x.id === i.id);
    if (!p) return '';
    return `<tr>
      <td>#${p.id}</td>
      <td>${p.name}</td>
      <td>${i.qty}</td>
      <td>${formatMXN(p.price)}</td>
      <td><strong>${formatMXN(p.price * i.qty)}</strong></td>
    </tr>`;
  }).join('');

  const bodyHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div><div style="font-size:.75rem;color:var(--ixel-muted);margin-bottom:2px">Cliente</div><strong>${o.cliente}</strong></div>
      <div><div style="font-size:.75rem;color:var(--ixel-muted);margin-bottom:2px">Email</div>${o.email}</div>
      <div><div style="font-size:.75rem;color:var(--ixel-muted);margin-bottom:2px">Fecha</div>${o.fecha}</div>
      <div><div style="font-size:.75rem;color:var(--ixel-muted);margin-bottom:2px">Estado</div>${ESTADO_BADGE[o.estado]||''}</div>
      <div style="grid-column:1/-1"><div style="font-size:.75rem;color:var(--ixel-muted);margin-bottom:2px">Dirección</div>${o.direccion}</div>
    </div>
    <div class="table-scroll">
      <table class="admin-table">
        <thead><tr><th>ID</th><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div style="text-align:right;padding:12px 0 0;font-size:1rem;font-weight:700">
      Total: ${formatMXN(o.total)}
    </div>`;

  createModal({
    id: 'modal-order-detail',
    title: `Detalle: ${o.id}`,
    bodyHTML,
    footerHTML: `<button class="btn-admin btn-outline-admin" onclick="document.getElementById('modal-order-detail').classList.remove('open')">Cerrar</button>`,
    wide: true,
  });
}

// ── Nueva orden ──
let _newOrderItems = [];

function openNewOrderModal() {
  _newOrderItems = [];

  const productos = ProductosService.getAll().filter(p => p.stock > 0);

  const bodyHTML = `
    <div class="form-row-admin form-row-2">
      <div class="form-group-admin">
        <label>Cliente *</label>
        <input class="form-control-admin" id="no-cliente" placeholder="Nombre completo">
      </div>
      <div class="form-group-admin">
        <label>Email</label>
        <input class="form-control-admin" id="no-email" type="email" placeholder="correo@ejemplo.com">
      </div>
    </div>
    <div class="form-group-admin" style="margin-bottom:14px">
      <label>Dirección de entrega</label>
      <input class="form-control-admin" id="no-dir" placeholder="Calle, número, colonia, ciudad">
    </div>

    <div style="display:flex;gap:8px;margin-bottom:14px;align-items:flex-end">
      <div class="form-group-admin" style="flex:1;margin:0">
        <label>Producto</label>
        <select class="form-control-admin" id="no-prod">
          ${productos.map(p => `<option value="${p.id}">#${p.id} ${p.name} — ${formatMXN(p.price)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group-admin" style="width:80px;margin:0">
        <label>Cant.</label>
        <input class="form-control-admin" id="no-qty" type="number" value="1" min="1">
      </div>
      <button class="btn-admin btn-outline-admin" id="no-add-btn" style="white-space:nowrap">
        <i class='bx bx-plus'></i> Agregar
      </button>
    </div>

    <div id="no-items-list" style="margin-bottom:8px"></div>
    <div style="font-weight:700;text-align:right;font-size:.95rem" id="no-total">Total: ${formatMXN(0)}</div>`;

  const footerHTML = `
    <button class="btn-admin btn-outline-admin" onclick="document.getElementById('modal-new-order').classList.remove('open')">Cancelar</button>
    <button class="btn-admin btn-primary-admin" id="btn-confirm-order"><i class='bx bx-save'></i> Crear Orden</button>`;

  createModal({ id: 'modal-new-order', title: 'Nueva Orden de Compra', bodyHTML, footerHTML, wide: true });

  document.getElementById('no-add-btn').addEventListener('click', noAddItem);
  document.getElementById('btn-confirm-order').addEventListener('click', saveNewOrder);
}

function noAddItem() {
  const pid = parseInt(document.getElementById('no-prod').value);
  const qty = parseInt(document.getElementById('no-qty').value) || 1;
  const p   = ProductosService.getById(pid);
  if (!p) return;

  const existing = _newOrderItems.find(i => i.id === pid);
  if (existing) existing.qty += qty;
  else _newOrderItems.push({ id: pid, qty });

  renderNewOrderItems();
}

function renderNewOrderItems() {
  const list = document.getElementById('no-items-list');
  if (!list) return;

  list.innerHTML = _newOrderItems.map(i => {
    const p = ProductosService.getById(i.id);
    if (!p) return '';
    return `
      <div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--ixel-border)">
        <span style="flex:1;font-size:.84rem;font-weight:500">${p.name}</span>
        <span class="badge-admin badge-gray">×${i.qty}</span>
        <span style="font-weight:700;font-size:.84rem">${formatMXN(p.price * i.qty)}</span>
        <button style="border:none;background:none;color:var(--red);cursor:pointer;font-size:1.1rem"
                data-removeid="${i.id}"><i class='bx bx-x'></i></button>
      </div>`;
  }).join('');

  list.querySelectorAll('[data-removeid]').forEach(btn => {
    btn.addEventListener('click', () => {
      _newOrderItems = _newOrderItems.filter(i => i.id !== parseInt(btn.dataset.removeid));
      renderNewOrderItems();
    });
  });

  const total = _newOrderItems.reduce((s, i) => {
    const p = ProductosService.getById(i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
  document.getElementById('no-total').textContent = `Total: ${formatMXN(total)}`;
}

function saveNewOrder() {
  const cliente   = document.getElementById('no-cliente').value.trim();
  const email     = document.getElementById('no-email').value.trim();
  const direccion = document.getElementById('no-dir').value.trim();

  if (!cliente) { showToast('Ingresa el nombre del cliente', 'error'); return; }
  if (!_newOrderItems.length) { showToast('Agrega al menos un producto', 'error'); return; }

  const orden = OrdenesService.create({ cliente, email, direccion, items: _newOrderItems });
  closeModal('modal-new-order');
  updateOrderBadge();
  showToast(`Orden ${orden.id} creada ✓`);
  renderOrders();
}
