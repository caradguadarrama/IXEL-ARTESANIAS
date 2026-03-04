/**
 * IXEL Artesanías — Utilidades compartidas del Admin
 * Ruta: assets/js/admin/utils/
 */

// ════════════════════════════════════════
// toast.js
// ════════════════════════════════════════
let _toastTimer = null;

export function showToast(message, type = 'success') {
  const toast = document.getElementById('adminToast');
  if (!toast) return;
  clearTimeout(_toastTimer);
  toast.textContent = message;
  toast.className = `admin-toast show toast-${type}`;
  _toastTimer = setTimeout(() => { toast.className = 'admin-toast'; }, 3200);
}

// ════════════════════════════════════════
// modal.js
// ════════════════════════════════════════
export function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
export function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

/**
 * Crea e inyecta un modal dinámico en #modal-container.
 * @param {object} opts - { id, title, bodyHTML, footerHTML, wide }
 */
export function createModal({ id, title, bodyHTML, footerHTML, wide = false }) {
  // Remover modal previo con mismo id
  document.getElementById(id)?.remove();

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="modal-backdrop-admin" id="${id}">
      <div class="modal-admin ${wide ? 'modal-admin-wide' : ''}">
        <div class="modal-admin-header">
          <div class="modal-admin-title">${title}</div>
          <button class="modal-close-btn" onclick="document.getElementById('${id}').classList.remove('open')">
            <i class='bx bx-x'></i>
          </button>
        </div>
        <div class="modal-admin-body">${bodyHTML}</div>
        <div class="modal-admin-footer">${footerHTML}</div>
      </div>
    </div>`;

  document.getElementById('modal-container').appendChild(div.firstElementChild);

  // Cerrar al click en backdrop
  document.getElementById(id).addEventListener('click', (e) => {
    if (e.target.id === id) closeModal(id);
  });

  openModal(id);
}

// ════════════════════════════════════════
// badges.js
// ════════════════════════════════════════
export const ESTADO_BADGE = {
  pendiente:   '<span class="badge-admin badge-yellow">Pendiente</span>',
  procesando:  '<span class="badge-admin badge-blue">Procesando</span>',
  enviada:     '<span class="badge-admin badge-gray">Enviada</span>',
  entregada:   '<span class="badge-admin badge-green">Entregada</span>',
  cancelada:   '<span class="badge-admin badge-red">Cancelada</span>',
};

export const ESTADO_LABEL = {
  pendiente: 'Pendiente', procesando: 'Procesando',
  enviada: 'Enviada', entregada: 'Entregada', cancelada: 'Cancelada',
};

export const CAT_COLORS = {
  'Tortilleros':          '#b8460a',
  'Tablas':               '#8d6e63',
  'Charolas':             '#a1887f',
  'Cajas':                '#795548',
  'Servilleteros':        '#6d4c41',
  'Salseras':             '#bf8040',
  'Individuales':         '#c8a97a',
  'Mezcaleros/Tequileros':'#d4700f',
  'Molcajetes':           '#9e9d24',
  'Originales':           '#558b2f',
};

export function stockBadge(stock) {
  if (stock === 0)        return '<span class="badge-admin badge-red">Agotado</span>';
  if (stock <= 5)         return '<span class="badge-admin badge-yellow">Stock bajo</span>';
  return                         '<span class="badge-admin badge-green">OK</span>';
}

export function stockBar(stock) {
  const pct   = Math.min((stock / 20) * 100, 100);
  const color = stock === 0 ? 'var(--red)' : stock <= 5 ? 'var(--yellow)' : 'var(--green)';
  return `
    <div class="stock-bar-wrap">
      <div class="stock-bar">
        <div class="stock-bar-fill" style="width:${pct}%;background:${color}"></div>
      </div>
      ${stockBadge(stock)}
      <span style="font-size:.82rem;font-weight:600">${stock}</span>
    </div>`;
}

export function formatMXN(n) {
  return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 });
}

// ════════════════════════════════════════
// pagination.js
// ════════════════════════════════════════
/**
 * Genera HTML de paginación y lo inyecta en `containerId`.
 * Llama `onPageChange(page)` al hacer click.
 */
export function renderPagination(containerId, total, perPage, currentPage, onPageChange) {
  const pages = Math.ceil(total / perPage);
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '';
  for (let i = 1; i <= pages; i++) {
    // Compactación
    if (pages > 8 && i > 3 && i < pages - 1 && Math.abs(i - currentPage) > 1) {
      if (i === 4) html += `<span style="padding:0 4px;color:var(--ixel-muted)">…</span>`;
      continue;
    }
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}"
               onclick="(${onPageChange.toString()})(${i})">${i}</button>`;
  }
  html += `<span class="pagination-info">Página ${currentPage} de ${pages} · ${total} registros</span>`;
  container.innerHTML = html;
}
