/**
 * IXEL Artesanías — Admin Dashboard
 * Ruta: assets/js/admin/dashboard.js
 *
 * Módulo principal del panel de administración.
 * Maneja: navegación, sidebar, topbar, y delegación a sub-módulos.
 */

import { ProductosService }   from './services/productos.service.js';
import { OrdenesService }     from './services/ordenes.service.js';
import { renderDashboardView,
         renderInventoryView,
         renderCategoriesView,
         renderReportsView,
         renderClientsView }  from './views/allViews.js';
import { renderProductsView }  from './views/productsView.js';
import { renderOrdersView }    from './views/ordersView.js';
import { showToast }           from './utils/helpers.js';
// ── Títulos de vistas ──
const VIEW_TITLES = {
  dashboard:  'Dashboard',
  orders:     'Órdenes de Compra',
  products:   'Productos',
  inventory:  'Inventario',
  categories: 'Categorías',
  reports:    'Ventas',
  clients:    'Clientes',
};

// ── Estado global del admin ──
let currentView = 'dashboard';

// ════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  await ProductosService.init();
  await OrdenesService.init();

  setupSidebar();
  setupNavLinks();
  setupSearch();
  updateOrderBadge();

  navigateTo('dashboard');
});

// ════════════════════════════════════════════════════════
// SIDEBAR — toggle mobile
// ════════════════════════════════════════════════════════
function setupSidebar() {
  const sidebar  = document.getElementById('adminSidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const hamBtn   = document.getElementById('hamburgerBtn');
  const closeBtn = document.getElementById('sidebarCloseBtn');

  const open  = () => { sidebar.classList.add('open');  overlay.classList.add('show'); };
  const close = () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); };

  hamBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);

  // Cerrar al cambiar a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) close();
  });
}

// ════════════════════════════════════════════════════════
// NAVEGACIÓN
// ════════════════════════════════════════════════════════
function setupNavLinks() {
  document.querySelectorAll('.nav-link[data-view]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.view);
      // Cerrar sidebar en mobile
      if (window.innerWidth <= 900) {
        document.getElementById('adminSidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('show');
      }
    });
  });
}

export function navigateTo(view) {
  currentView = view;

  // Actualizar nav activo
  document.querySelectorAll('.nav-link[data-view]').forEach(l =>
    l.classList.toggle('active', l.dataset.view === view)
  );

  // Título topbar
  document.getElementById('topbarTitle').textContent = VIEW_TITLES[view] || view;

  // Renderizar vista
  renderView(view);
}

async function renderView(view) {
  const content = document.getElementById('adminContent');
  content.innerHTML = '<div class="loading-screen"><div class="loading-spinner"></div><p>Cargando…</p></div>';

  // Pequeño delay para que el spinner sea visible
  await new Promise(r => setTimeout(r, 80));

  switch (view) {
    case 'dashboard':  renderDashboardView(content); break;
    case 'products':   renderProductsView(content);  break;
    case 'orders':     renderOrdersView(content);    break;
    case 'inventory':  renderInventoryView(content); break;
    case 'categories': renderCategoriesView(content);break;
    case 'reports':    renderReportsView(content);   break;
    case 'clients':    renderClientsView(content);   break;
    default:
      content.innerHTML = `<div style="padding:40px;text-align:center;color:var(--ixel-muted)">Vista no encontrada: <strong>${view}</strong></div>`;
  }

  updateOrderBadge();
}

// ════════════════════════════════════════════════════════
// BADGE órdenes pendientes
// ════════════════════════════════════════════════════════
export function updateOrderBadge() {
  const pending = OrdenesService.getAll().filter(o => o.estado === 'pendiente').length;
  const badge = document.getElementById('badge-orders');
  if (badge) badge.textContent = pending;
}

// ════════════════════════════════════════════════════════
// BÚSQUEDA GLOBAL
// ════════════════════════════════════════════════════════
function setupSearch() {
  const input = document.getElementById('globalSearchInput');
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const q = input.value.trim();
    if (!q) return;

    const matches = ProductosService.getAll()
      .filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

    if (matches.length > 0) {
      navigateTo('products');
      // Esperar a que la vista se renderice y pasar el query
      setTimeout(() => {
        const searchBox = document.getElementById('prod-search');
        if (searchBox) {
          searchBox.value = q;
          searchBox.dispatchEvent(new Event('input'));
        }
      }, 200);
      showToast(`${matches.length} producto(s) encontrado(s) para "${q}"`);
    } else {
      showToast(`Sin resultados para "${q}"`, 'error');
    }
  });
}
