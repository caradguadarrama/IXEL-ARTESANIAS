// assets/js/components/pages/editAbout.js
// SOLO se carga en pages/admin/about.html — NUNCA en la vista pública.
// No es ES Module porque el admin lo carga como script clásico
// con acceso al objeto global bootstrap.
//
// Contrato: guarda en localStorage bajo ABOUT_TEXT_KEY.
// about.js (público) lee esa misma key.

(function () {
  'use strict';

  const ABOUT_TEXT_KEY = 'ixel_about_text';

  const aboutText = document.getElementById('about-text');
  const textArea  = document.getElementById('editTextArea');
  const saveBtn   = document.getElementById('saveBtn');
  const modal     = document.getElementById('editModal');

  // Guard: si algún elemento no existe, el script falla silenciosamente.
  // Previene errores si alguien incluye este archivo por error en otra página.
  if (!aboutText || !textArea || !saveBtn || !modal) {
    console.warn('[editAbout] Elementos del admin no encontrados — ¿estás en la página correcta?');
    return;
  }

  // Precargar texto actual en el textarea cuando abre el modal
  modal.addEventListener('show.bs.modal', () => {
    textArea.value = aboutText.textContent.trim();
  });

  // Guardar: actualiza DOM y persiste en localStorage
  saveBtn.addEventListener('click', () => {
    const newText = textArea.value.trim();
    if (!newText) return;

    aboutText.textContent = newText;
    localStorage.setItem(ABOUT_TEXT_KEY, newText);

    bootstrap.Modal.getInstance(modal)?.hide();
  });
})();