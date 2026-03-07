/**
 * IXEL Artesanías — Vista de Productos
 * Ruta: assets/js/admin/views/productsView.js
 */

import { ProductosService } from '../services/productos.service.js';
import { showToast }        from '../utils/helpers.js';
import { CAT_COLORS, stockBar, stockBadge, formatMXN, createModal, closeModal } from '../utils/helpers.js';

const PER_PAGE = 20;
let _page      = 1;
let _filters   = { search: '', category: '', collection: '', stock: '' };

export function renderProductsView(container) {
  _page = 1;
  container.innerHTML = buildShell();
  populateFilterSelects();
  attachFilterEvents();
  renderTable();
}

// ── HTML del esqueleto ──
function buildShell() {
  const cats = ProductosService.getCategories();
  const cols = ProductosService.getCollections();

  return `
  <div class="admin-view active" id="view-products">
    <div class="page-header">
      <div>
        <div class="breadcrumb-admin">Catálogo › <span>Productos</span></div>
        <div class="page-title">Productos</div>
        <div class="page-subtitle">${ProductosService.getAll().length} productos en catálogo</div>
      </div>
      <button class="btn-admin btn-primary-admin" id="btn-new-product">
        <i class='bx bx-plus'></i> Agregar Producto
      </button>
    </div>

    <div class="admin-card">
      <!-- Filtros -->
      <div class="filters-bar">
        <input class="filter-control" id="prod-search"
               placeholder="🔍 Buscar por nombre…" style="width:220px"
               value="${_filters.search}">

        <select class="filter-control" id="prod-cat">
          <option value="">Todas las categorías</option>
          ${cats.map(c => `<option value="${c}" ${_filters.category===c?'selected':''}>${c}</option>`).join('')}
        </select>

        <select class="filter-control" id="prod-col">
          <option value="">Todas las colecciones</option>
          ${cols.map(c => `<option value="${c}" ${_filters.collection===c?'selected':''}>${c}</option>`).join('')}
        </select>

        <select class="filter-control" id="prod-stock">
          <option value="">Cualquier stock</option>
          <option value="agotado" ${_filters.stock==='agotado'?'selected':''}>Agotado</option>
          <option value="bajo"    ${_filters.stock==='bajo'?'selected':''}>Stock bajo (≤5)</option>
          <option value="ok"      ${_filters.stock==='ok'?'selected':''}>En stock (&gt;5)</option>
        </select>

        <span class="filter-count" id="prod-count"></span>
      </div>

      <!-- Tabla -->
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Colección</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="products-tbody"></tbody>
        </table>
      </div>

      <div class="pagination-bar" id="prod-pagination"></div>
    </div>
  </div>`;
}

function populateFilterSelects() { /* ya incluidos en buildShell */ }

function attachFilterEvents() {
  document.getElementById('btn-new-product')?.addEventListener('click', () => openProductModal());
  ['prod-search','prod-cat','prod-col','prod-stock'].forEach(id => {
    document.getElementById(id)?.addEventListener('input',  onFilterChange);
    document.getElementById(id)?.addEventListener('change', onFilterChange);
  });
}

function onFilterChange() {
  _filters.search     = document.getElementById('prod-search')?.value || '';
  _filters.category   = document.getElementById('prod-cat')?.value    || '';
  _filters.collection = document.getElementById('prod-col')?.value    || '';
  _filters.stock      = document.getElementById('prod-stock')?.value  || '';
  _page = 1;
  renderTable();
}

function renderTable() {
  const filtered = ProductosService.filter(_filters);
  const start    = (_page - 1) * PER_PAGE;
  const pageData = filtered.slice(start, start + PER_PAGE);

  document.getElementById('prod-count').textContent =
    `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;

  document.getElementById('products-tbody').innerHTML = pageData.map(p => `
    <tr>
      <td style="color:var(--ixel-muted);font-size:.78rem">#${p.id}</td>
      <td>
        <div class="td-name">${p.name}</div>
        <div class="td-secondary">${p.description.substring(0, 55)}…</div>
      </td>
      <td>
        <span class="badge-admin badge-gray">
          <span class="cat-dot" style="background:${CAT_COLORS[p.category] || '#888'}"></span>
          ${p.category}
        </span>
      </td>
      <td><span class="badge-admin badge-accent">${p.collection}</span></td>
      <td><strong>${formatMXN(p.price)}</strong></td>
      <td>${stockBar(p.stock)}</td>
      <td>
        <div class="action-row">
          <button class="act-btn edit"  data-id="${p.id}" data-action="edit"  title="Editar"><i class='bx bx-edit'></i></button>
          <button class="act-btn stock" data-id="${p.id}" data-action="stock" title="Ajustar stock"><i class='bx bx-cube'></i></button>
          <button class="act-btn del"   data-id="${p.id}" data-action="del"   title="Eliminar"><i class='bx bx-trash'></i></button>
        </div>
      </td>
    </tr>`).join('') || `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--ixel-muted)">Sin resultados</td></tr>`;

  // Paginación
  renderPaginationBar(filtered.length);

  // Eventos de botones de acción
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      if (btn.dataset.action === 'edit')  openProductModal(id);
      if (btn.dataset.action === 'stock') openStockModal(id);
      if (btn.dataset.action === 'del')   deleteProduct(id);
    });
  });
}

function renderPaginationBar(total) {
  const pages = Math.ceil(total / PER_PAGE);
  const bar   = document.getElementById('prod-pagination');
  if (!bar) return;
  let html = '';
  for (let i = 1; i <= pages; i++) {
    if (pages > 8 && i > 3 && i < pages - 1 && Math.abs(i - _page) > 1) {
      if (i === 4) html += `<span style="padding:0 4px;color:var(--ixel-muted)">…</span>`;
      continue;
    }
    html += `<button class="page-btn ${i === _page ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += `<span class="pagination-info">Página ${_page} de ${pages || 1} · ${total} productos</span>`;
  bar.innerHTML = html;
  bar.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => { _page = parseInt(btn.dataset.page); renderTable(); });
  });
}

// ── Modal Producto ──
function openProductModal(id = null) {
  const prod = id ? ProductosService.getById(id) : null;
  const cats = ProductosService.getCategories();
  const cols = ProductosService.getCollections();

  const bodyHTML = `
    <input type="hidden" id="mp-id" value="${prod?.id || ''}">
    <div class="form-row-admin form-row-2">
      <div class="form-group-admin">
        <label>Nombre *</label>
        <input class="form-control-admin" id="mp-name" placeholder="Ej. Tortillero Jaguar" value="${prod?.name || ''}">
      </div>
      <div class="form-group-admin">
        <label>Precio (MXN) *</label>
        <input class="form-control-admin" id="mp-price" type="number" step="0.5" value="${prod?.price || ''}">
      </div>
    </div>
    <div class="form-row-admin form-row-2">
      <div class="form-group-admin">
        <label>Categoría *</label>
        <select class="form-control-admin" id="mp-cat">
          <option value="">Seleccionar…</option>
          ${cats.map(c => `<option value="${c}" ${prod?.category===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group-admin">
        <label>Colección</label>
        <select class="form-control-admin" id="mp-col">
          ${cols.map(c => `<option value="${c}" ${(prod?.collection||'General')===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row-admin form-row-2">
      <div class="form-group-admin">
        <label>Stock *</label>
        <input class="form-control-admin" id="mp-stock" type="number" min="0" value="${prod?.stock ?? ''}">
      </div>
      <div class="form-group-admin">
        <label>Ruta de imagen</label>
        <input class="form-control-admin" id="mp-img" placeholder="/assets/img/products/…" value="${prod?.imagen || ''}">
      </div>
    </div>
    <div class="form-group-admin">
      <label>Descripción</label>
      <textarea class="form-control-admin" id="mp-desc" rows="3">${prod?.description || ''}</textarea>
    </div>`;

  const footerHTML = `
    <button class="btn-admin btn-outline-admin" onclick="document.getElementById('modal-product').classList.remove('open')">Cancelar</button>
    <button class="btn-admin btn-primary-admin" id="btn-save-product"><i class='bx bx-save'></i> Guardar</button>`;

  createModal({ id: 'modal-product', title: prod ? 'Editar Producto' : 'Nuevo Producto', bodyHTML, footerHTML });

  document.getElementById('btn-save-product').addEventListener('click', saveProduct);
}

function saveProduct() {
  const id    = document.getElementById('mp-id').value;
  const data  = {
    name:        document.getElementById('mp-name').value.trim(),
    price:       document.getElementById('mp-price').value,
    category:    document.getElementById('mp-cat').value,
    collection:  document.getElementById('mp-col').value,
    stock:       document.getElementById('mp-stock').value,
    imagen:      document.getElementById('mp-img').value.trim(),
    description: document.getElementById('mp-desc').value.trim(),
  };

  if (!data.name || !data.price || !data.category) {
    showToast('Completa los campos requeridos (*)', 'error');
    return;
  }

  if (id) {
    ProductosService.update(parseInt(id), data);
    showToast('Producto actualizado ✓');
  } else {
    ProductosService.create(data);
    showToast('Producto creado ✓');
  }

  closeModal('modal-product');
  renderTable();
}

function deleteProduct(id) {
  const p = ProductosService.getById(id);
  if (!p) return;
  if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
  ProductosService.delete(id);
  showToast('Producto eliminado', 'error');
  renderTable();
}

// ── Modal Stock ──
export function openStockModal(id) {
  const p = ProductosService.getById(id);
  if (!p) return;

  const bodyHTML = `
    <p style="font-weight:600;margin-bottom:14px">#${p.id} — ${p.name}</p>
    <div class="form-row-admin form-row-2">
      <div class="form-group-admin">
        <label>Stock actual</label>
        <input class="form-control-admin" value="${p.stock}" readonly>
      </div>
      <div class="form-group-admin">
        <label>Nuevo stock *</label>
        <input class="form-control-admin" id="ms-new" type="number" min="0" value="${p.stock}">
      </div>
    </div>
    <input type="hidden" id="ms-id" value="${p.id}">`;

  const footerHTML = `
    <button class="btn-admin btn-outline-admin" onclick="document.getElementById('modal-stock').classList.remove('open')">Cancelar</button>
    <button class="btn-admin btn-primary-admin" id="btn-save-stock">Actualizar Stock</button>`;

  createModal({ id: 'modal-stock', title: 'Ajustar Stock', bodyHTML, footerHTML });

  document.getElementById('btn-save-stock').addEventListener('click', () => {
    const prodId   = parseInt(document.getElementById('ms-id').value);
    const newStock = parseInt(document.getElementById('ms-new').value);
    if (isNaN(newStock) || newStock < 0) { showToast('Stock inválido', 'error'); return; }
    const prev = ProductosService.getById(prodId).stock;
    ProductosService.updateStock(prodId, newStock);
    showToast(`Stock actualizado: ${prev} → ${newStock} ✓`);
    closeModal('modal-stock');
    renderTable();
  });
}
