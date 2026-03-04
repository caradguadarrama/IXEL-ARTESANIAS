/**
 * IXEL Artesanías — Vistas restantes del Admin
 * Archivo: assets/js/admin/views/dashboardView.js
 *         assets/js/admin/views/inventoryView.js
 *         assets/js/admin/views/categoriesView.js
 *         assets/js/admin/views/reportsView.js
 *         assets/js/admin/views/clientsView.js
 *
 * Todos los exports están en este único archivo para simplificar imports.
 */

import { ProductosService } from '../services/productos.service.js';
import { OrdenesService }   from '../services/ordenes.service.js';
import { navigateTo }       from '../dashboard.js';
import { openStockModal }   from './productsView.js';
import { CAT_COLORS, stockBar, ESTADO_BADGE, formatMXN, showToast, createModal, closeModal } from '../utils/helpers.js';

// ════════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ════════════════════════════════════════════════════════════════
export function renderDashboardView(container) {
  const ps   = ProductosService.getStats();
  const os   = OrdenesService.getStats();
  const cats = Object.entries(ps.byCat).sort((a,b) => b[1]-a[1]);
  const maxC = Math.max(...cats.map(c => c[1]));

  container.innerHTML = `
  <div class="admin-view active">
    <div class="page-header">
      <div>
        <div class="page-title">Bienvenido 👋</div>
        <div class="page-subtitle">Resumen general de IXEL Artesanías</div>
      </div>
      <button class="btn-admin btn-primary-admin" id="dash-new-prod">
        <i class='bx bx-plus'></i> Nuevo Producto
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card" style="--card-accent:var(--green)">
        <i class='bx bx-grid-alt stat-card-icon'></i>
        <div class="stat-label">Productos Activos</div>
        <div class="stat-value">${ps.total - ps.agotado}</div>
        <div class="stat-change up"><i class='bx bx-store'></i> ${ps.total} en catálogo total</div>
      </div>
      <div class="stat-card" style="--card-accent:var(--ixel-accent)">
        <i class='bx bx-package stat-card-icon'></i>
        <div class="stat-label">Órdenes Pendientes</div>
        <div class="stat-value">${os.pendiente}</div>
        <div class="stat-change down"><i class='bx bx-time'></i> ${os.procesando} en proceso</div>
      </div>
      <div class="stat-card" style="--card-accent:var(--blue)">
        <i class='bx bx-dollar stat-card-icon'></i>
        <div class="stat-label">Ingresos del Mes</div>
        <div class="stat-value">${formatMXN(os.ingresosMes || 48200)}</div>
        <div class="stat-change up"><i class='bx bx-up-arrow-alt'></i> +12% vs mes anterior</div>
      </div>
      <div class="stat-card" style="--card-accent:var(--red)">
        <i class='bx bx-cube stat-card-icon'></i>
        <div class="stat-label">Stock Bajo / Agotado</div>
        <div class="stat-value">${ps.bajo + ps.agotado}</div>
        <div class="stat-change down"><i class='bx bx-error'></i> ${ps.agotado} sin stock</div>
      </div>
    </div>

    <!-- 2 columnas -->
    <div class="admin-grid-2">
      <!-- Distribución categorías -->
      <div class="admin-card">
        <div class="admin-card-header">
          <span class="admin-card-title">Distribución por Categoría</span>
        </div>
        <div class="admin-card-body">
          ${cats.map(([cat, count]) => `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <div style="font-size:.78rem;width:150px;text-align:right;color:var(--ixel-muted)">${cat}</div>
              <div style="flex:1;height:20px;background:var(--ixel-surface-2);border-radius:4px;overflow:hidden">
                <div style="width:${(count/maxC*100)}%;height:100%;background:${CAT_COLORS[cat]||'#888'};border-radius:4px"></div>
              </div>
              <div style="font-size:.82rem;font-weight:600;width:28px;text-align:right">${count}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Órdenes recientes -->
      <div class="admin-card">
        <div class="admin-card-header">
          <span class="admin-card-title">Órdenes Recientes</span>
          <button class="btn-admin btn-outline-admin btn-admin-sm" id="dash-ver-ordenes">Ver todas</button>
        </div>
        <div class="table-scroll">
          <table class="admin-table">
            <thead><tr><th>Orden</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              ${OrdenesService.getAll().slice(0,6).map(o => `
                <tr>
                  <td><strong style="color:var(--ixel-accent)">${o.id}</strong></td>
                  <td>${o.cliente}</td>
                  <td><strong>${formatMXN(o.total)}</strong></td>
                  <td>${ESTADO_BADGE[o.estado] || ''}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Alertas stock -->
    <div class="admin-card">
      <div class="admin-card-header">
        <span class="admin-card-title">⚠️ Alertas de Inventario</span>
        <button class="btn-admin btn-outline-admin btn-admin-sm" id="dash-ver-inv">Gestionar inventario</button>
      </div>
      <div class="admin-card-body" id="dash-stock-alerts">
        ${ProductosService.getAll()
          .filter(p => p.stock <= 5)
          .sort((a,b) => a.stock - b.stock)
          .slice(0, 8)
          .map(p => `
          <div class="inv-alert ${p.stock===0?'inv-alert-danger':'inv-alert-warning'}">
            <i class='bx ${p.stock===0?"bx-error-circle":"bx-error"}'
               style="font-size:1.2rem;color:${p.stock===0?'var(--red)':'var(--yellow)'}"></i>
            <div style="flex:1">
              <strong>#${p.id} ${p.name}</strong>
              <div style="font-size:.75rem;color:var(--ixel-muted)">${p.category} · ${p.collection}</div>
            </div>
            <span class="badge-admin ${p.stock===0?'badge-red':'badge-yellow'}">${p.stock===0?'Agotado':p.stock+' uds.'}</span>
            <button class="btn-admin btn-outline-admin btn-admin-sm" data-stockid="${p.id}">Ajustar</button>
          </div>`).join('') || '<p style="color:var(--ixel-muted)">¡Sin alertas de inventario! Todo en orden.</p>'}
      </div>
    </div>
  </div>`;

  document.getElementById('dash-new-prod')?.addEventListener('click', () => navigateTo('products'));
  document.getElementById('dash-ver-ordenes')?.addEventListener('click', () => navigateTo('orders'));
  document.getElementById('dash-ver-inv')?.addEventListener('click', () => navigateTo('inventory'));
  document.querySelectorAll('[data-stockid]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo('inventory');
      setTimeout(() => openStockModal(parseInt(btn.dataset.stockid)), 200);
    });
  });
}

// ════════════════════════════════════════════════════════════════
// INVENTORY VIEW
// ════════════════════════════════════════════════════════════════
export function renderInventoryView(container) {
  const ps = ProductosService.getStats();
  container.innerHTML = `
  <div class="admin-view active">
    <div class="page-header">
      <div>
        <div class="breadcrumb-admin">Catálogo › <span>Inventario</span></div>
        <div class="page-title">Control de Inventario</div>
      </div>
      <button class="btn-admin btn-outline-admin" id="inv-export-btn">
        <i class='bx bx-export'></i> Exportar CSV
      </button>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card" style="--card-accent:var(--green)">
        <div class="stat-label">En Stock</div>
        <div class="stat-value">${ps.ok}</div>
        <div class="stat-change up">Stock suficiente</div>
      </div>
      <div class="stat-card" style="--card-accent:var(--yellow)">
        <div class="stat-label">Stock Bajo</div>
        <div class="stat-value">${ps.bajo}</div>
        <div class="stat-change down">1–5 unidades</div>
      </div>
      <div class="stat-card" style="--card-accent:var(--red)">
        <div class="stat-label">Sin Stock</div>
        <div class="stat-value">${ps.agotado}</div>
        <div class="stat-change down">Requiere reposición</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Valor Inventario</div>
        <div class="stat-value">$${Math.round(ps.valorInventario/1000)}k</div>
        <div class="stat-change up">Precio × Stock</div>
      </div>
    </div>

    <div class="admin-card">
      <div class="filters-bar">
        <input class="filter-control" id="inv-search" placeholder="🔍 Buscar producto…" style="width:220px">
        <select class="filter-control" id="inv-filter">
          <option value="">Todo el inventario</option>
          <option value="agotado">Solo agotados</option>
          <option value="bajo">Solo stock bajo</option>
        </select>
      </div>
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr><th>ID</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Nivel</th><th>Ajustar</th></tr>
          </thead>
          <tbody id="inv-tbody"></tbody>
        </table>
      </div>
    </div>
  </div>`;

  const renderRows = () => {
    const q = document.getElementById('inv-search')?.value.toLowerCase() || '';
    const f = document.getElementById('inv-filter')?.value || '';
    const data = ProductosService.getAll().filter(p => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (f === 'agotado' && p.stock !== 0) return false;
      if (f === 'bajo' && !(p.stock > 0 && p.stock <= 5)) return false;
      return true;
    });

    document.getElementById('inv-tbody').innerHTML = data.map(p => `
      <tr>
        <td style="color:var(--ixel-muted);font-size:.78rem">#${p.id}</td>
        <td><div class="td-name">${p.name}</div></td>
        <td><span class="badge-admin badge-gray">
          <span class="cat-dot" style="background:${CAT_COLORS[p.category]||'#888'}"></span>
          ${p.category}
        </span></td>
        <td>${formatMXN(p.price)}</td>
        <td><strong>${p.stock}</strong></td>
        <td>${stockBar(p.stock)}</td>
        <td>
          <button class="btn-admin btn-outline-admin btn-admin-sm" data-stockid="${p.id}">
            <i class='bx bx-edit'></i> Ajustar
          </button>
        </td>
      </tr>`).join('');

    document.querySelectorAll('[data-stockid]').forEach(btn => {
      btn.addEventListener('click', () => {
        openStockModal(parseInt(btn.dataset.stockid));
        // Tras guardar re-renderizar inventario
        setTimeout(() => {
          if (!document.getElementById('modal-stock')?.classList.contains('open')) renderRows();
        }, 3500);
      });
    });
  };

  renderRows();
  document.getElementById('inv-search')?.addEventListener('input', renderRows);
  document.getElementById('inv-filter')?.addEventListener('change', renderRows);

  document.getElementById('inv-export-btn')?.addEventListener('click', () => {
    const rows = ['ID,Nombre,Categoría,Colección,Precio,Stock,Estado'];
    ProductosService.getAll().forEach(p => {
      const estado = p.stock===0?'Agotado':p.stock<=5?'Stock Bajo':'En Stock';
      rows.push(`${p.id},"${p.name}","${p.category}","${p.collection}",${p.price},${p.stock},${estado}`);
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ixel_inventario.csv';
    a.click();
    showToast('CSV exportado ✓');
  });
}

// ════════════════════════════════════════════════════════════════
// CATEGORIES VIEW
// ════════════════════════════════════════════════════════════════
export function renderCategoriesView(container) {
  const catMap = {};
  ProductosService.getAll().forEach(p => {
    if (!catMap[p.category]) catMap[p.category] = { count:0, stock:0, value:0, collections: new Set() };
    catMap[p.category].count++;
    catMap[p.category].stock += p.stock;
    catMap[p.category].value += p.price * p.stock;
    catMap[p.category].collections.add(p.collection);
  });

  const cards = Object.entries(catMap).sort((a,b) => b[1].count - a[1].count).map(([cat, d]) => `
    <div class="admin-card" style="border-top:3px solid ${CAT_COLORS[cat]||'#888'}">
      <div class="admin-card-body">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
          <div style="width:38px;height:38px;border-radius:8px;background:${CAT_COLORS[cat]||'#888'}22;display:flex;align-items:center;justify-content:center">
            <span class="cat-dot" style="background:${CAT_COLORS[cat]||'#888'};width:12px;height:12px"></span>
          </div>
          <div>
            <div style="font-weight:700;font-size:.95rem">${cat}</div>
            <div style="font-size:.74rem;color:var(--ixel-muted)">${[...d.collections].join(', ')}</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <div style="background:var(--ixel-cream);border-radius:6px;padding:10px;text-align:center">
            <div style="font-family:'Fraunces','Nunito',serif;font-size:1.5rem;font-weight:700">${d.count}</div>
            <div style="font-size:.72rem;color:var(--ixel-muted)">Productos</div>
          </div>
          <div style="background:var(--ixel-cream);border-radius:6px;padding:10px;text-align:center">
            <div style="font-family:'Fraunces','Nunito',serif;font-size:1.5rem;font-weight:700">${d.stock}</div>
            <div style="font-size:.72rem;color:var(--ixel-muted)">En stock</div>
          </div>
        </div>
        <div style="font-size:.8rem;color:var(--ixel-muted);padding-top:10px;border-top:1px solid var(--ixel-border)">
          Valor inventario: <strong style="color:var(--ixel-brown)">${formatMXN(d.value)}</strong>
        </div>
        <button class="btn-admin btn-outline-admin btn-admin-sm" style="margin-top:12px;width:100%"
                data-cat="${cat}">Ver productos →</button>
      </div>
    </div>`).join('');

  container.innerHTML = `
  <div class="admin-view active">
    <div class="page-header">
      <div>
        <div class="breadcrumb-admin">Catálogo › <span>Categorías</span></div>
        <div class="page-title">Categorías</div>
      </div>
    </div>
    <div class="admin-grid-3">${cards}</div>
  </div>`;

  container.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo('products');
      setTimeout(() => {
        const sel = document.getElementById('prod-cat');
        if (sel) { sel.value = btn.dataset.cat; sel.dispatchEvent(new Event('change')); }
      }, 200);
    });
  });
}

// ════════════════════════════════════════════════════════════════
// REPORTS VIEW
// ════════════════════════════════════════════════════════════════
export function renderReportsView(container) {
  const months     = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const salesData  = [28400,31200,29800,35600,42100,38900,44200,51300,47800,43600,48200,52400];
  const maxSale    = Math.max(...salesData);
  const currentMo  = new Date().getMonth();

  const barsHTML = salesData.map((v, i) => `
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
      <div style="font-size:.62rem;color:var(--ixel-muted)">$${Math.round(v/1000)}k</div>
      <div style="width:100%;background:${i===currentMo?'var(--ixel-accent)':'var(--ixel-accent-2)cc'};
                  border-radius:4px 4px 0 0;height:${(v/maxSale*100)}px;opacity:${i<=currentMo?1:.45}"></div>
    </div>`).join('');

  const labelsHTML = months.map(m => `<div style="flex:1;text-align:center;font-size:.62rem;color:var(--ixel-muted)">${m}</div>`).join('');

  // Top 10 simulados
  const topProds = [...ProductosService.getAll()]
    .map(p => ({ p, units: Math.floor(Math.random()*30+5) }))
    .sort((a,b) => (b.p.price * b.units) - (a.p.price * a.units))
    .slice(0, 10);

  container.innerHTML = `
  <div class="admin-view active">
    <div class="page-header">
      <div>
        <div class="breadcrumb-admin">Reportes › <span>Ventas</span></div>
        <div class="page-title">Reporte de Ventas</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Ventas Totales</div><div class="stat-value">$312k</div><div class="stat-change up"><i class='bx bx-up-arrow-alt'></i> +8% este año</div></div>
      <div class="stat-card"><div class="stat-label">Órdenes Totales</div><div class="stat-value">${OrdenesService.getAll().length}</div><div class="stat-change up"><i class='bx bx-up-arrow-alt'></i> entregadas: ${OrdenesService.getStats().entregada}</div></div>
      <div class="stat-card"><div class="stat-label">Ticket Promedio</div><div class="stat-value">$1,100</div><div class="stat-change up"><i class='bx bx-up-arrow-alt'></i> +4%</div></div>
      <div class="stat-card"><div class="stat-label">Productos en Cat.</div><div class="stat-value">${ProductosService.getAll().length}</div><div class="stat-change up">10 categorías</div></div>
    </div>

    <div class="admin-card" style="margin-bottom:20px">
      <div class="admin-card-header"><span class="admin-card-title">Ventas por mes — 2024/2025</span></div>
      <div class="admin-card-body">
        <div style="display:flex;align-items:flex-end;gap:5px;height:120px;padding-top:10px">${barsHTML}</div>
        <div style="display:flex;gap:5px;margin-top:5px">${labelsHTML}</div>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-card-header"><span class="admin-card-title">Top 10 Productos</span></div>
      <div class="table-scroll">
        <table class="admin-table">
          <thead><tr><th>#</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Unidades</th><th>Total</th></tr></thead>
          <tbody>
            ${topProds.map(({p, units}, i) => `
              <tr>
                <td><strong style="color:${i<3?'var(--ixel-accent)':'var(--ixel-muted)'}">#${i+1}</strong></td>
                <td><div class="td-name">${p.name}</div></td>
                <td><span class="badge-admin badge-gray">${p.category}</span></td>
                <td>${formatMXN(p.price)}</td>
                <td><strong>${units}</strong></td>
                <td><strong>${formatMXN(p.price * units)}</strong></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

// ════════════════════════════════════════════════════════════════
// CLIENTS VIEW
// ════════════════════════════════════════════════════════════════
const STORAGE_CLIENTS = 'ixel_clientes';
function getClients() {
  const saved = localStorage.getItem(STORAGE_CLIENTS);
  if (saved) return JSON.parse(saved);
  const defaults = [
    {id:1,nombre:'María García',    email:'maria@ejemplo.com',  ordenes:3,total:8420, ultima:'2026-02-28'},
    {id:2,nombre:'Carlos López',    email:'carlos@ejemplo.com', ordenes:2,total:4325, ultima:'2026-02-27'},
    {id:3,nombre:'Ana Martínez',    email:'ana@ejemplo.com',    ordenes:5,total:15200,ultima:'2026-02-26'},
    {id:4,nombre:'Roberto Sánchez', email:'rob@ejemplo.com',    ordenes:1,total:2800, ultima:'2026-02-25'},
    {id:5,nombre:'Sofía Torres',    email:'sofia@ejemplo.com',  ordenes:4,total:11340,ultima:'2026-02-24'},
  ];
  localStorage.setItem(STORAGE_CLIENTS, JSON.stringify(defaults));
  return defaults;
}
function saveClients(clients) {
  localStorage.setItem(STORAGE_CLIENTS, JSON.stringify(clients));
}

export function renderClientsView(container) {
  const render = () => {
    const clients = getClients();
    document.getElementById('clients-tbody').innerHTML = clients.map(c => `
      <tr>
        <td style="color:var(--ixel-muted)">#${c.id}</td>
        <td><strong>${c.nombre}</strong></td>
        <td>${c.email}</td>
        <td><span class="badge-admin badge-blue">${c.ordenes}</span></td>
        <td><strong>${formatMXN(c.total)}</strong></td>
        <td>${c.ultima}</td>
        <td>
          <div class="action-row">
            <button class="act-btn del" data-delclient="${c.id}" title="Eliminar"><i class='bx bx-trash'></i></button>
          </div>
        </td>
      </tr>`).join('');

    document.querySelectorAll('[data-delclient]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('¿Eliminar este cliente?')) return;
        const updated = getClients().filter(c => c.id !== parseInt(btn.dataset.delclient));
        saveClients(updated);
        showToast('Cliente eliminado', 'error');
        render();
      });
    });
  };

  container.innerHTML = `
  <div class="admin-view active">
    <div class="page-header">
      <div>
        <div class="page-title">Clientes</div>
        <div class="page-subtitle">${getClients().length} clientes registrados</div>
      </div>
      <button class="btn-admin btn-primary-admin" id="btn-add-client">
        <i class='bx bx-plus'></i> Nuevo Cliente
      </button>
    </div>

    <div class="admin-card">
      <div class="table-scroll">
        <table class="admin-table">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Órdenes</th><th>Total gastado</th><th>Última compra</th><th>Acciones</th></tr>
          </thead>
          <tbody id="clients-tbody"></tbody>
        </table>
      </div>
    </div>
  </div>`;

  render();

  document.getElementById('btn-add-client')?.addEventListener('click', () => {
    const bodyHTML = `
      <div class="form-row-admin form-row-2">
        <div class="form-group-admin"><label>Nombre *</label><input class="form-control-admin" id="nc-nombre" placeholder="Nombre completo"></div>
        <div class="form-group-admin"><label>Email</label><input class="form-control-admin" id="nc-email" type="email" placeholder="correo@ejemplo.com"></div>
      </div>`;

    createModal({
      id: 'modal-new-client',
      title: 'Nuevo Cliente',
      bodyHTML,
      footerHTML: `
        <button class="btn-admin btn-outline-admin" onclick="document.getElementById('modal-new-client').classList.remove('open')">Cancelar</button>
        <button class="btn-admin btn-primary-admin" id="btn-save-client">Guardar</button>`,
    });

    document.getElementById('btn-save-client')?.addEventListener('click', () => {
      const nombre = document.getElementById('nc-nombre').value.trim();
      const email  = document.getElementById('nc-email').value.trim();
      if (!nombre) { showToast('Ingresa el nombre', 'error'); return; }
      const clients = getClients();
      clients.push({ id: clients.length + 1, nombre, email, ordenes: 0, total: 0, ultima: '—' });
      saveClients(clients);
      closeModal('modal-new-client');
      showToast('Cliente agregado ✓');
      render();
    });
  });
}
