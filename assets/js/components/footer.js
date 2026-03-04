// assets/js/components/footer.js
// Puro: retorna HTML string. No toca DOM. No ejecuta código al importar.

export function createFooter() {
  return `
    <footer class="footer" role="contentinfo">
      <div class="footer__container">

        <div class="footer__left">
          <section class="footer__section">
            <h4 class="footer__title">Enlaces Rápidos</h4>
            <ul class="footer__list" role="list">
              <li class="footer__list-item"><a href="../../index.html"                 class="footer__link">Inicio</a></li>
              <li class="footer__list-item"><a href="../../pages/public/products.html" class="footer__link">Productos</a></li>
              <li class="footer__list-item"><a href="../../pages/public/about.html"    class="footer__link">Nosotros</a></li>
              <li class="footer__list-item"><a href="../../pages/public/contact.html"  class="footer__link">Contacto</a></li>
            </ul>
          </section>

          <section class="footer__section">
            <h4 class="footer__title">Información</h4>
            <ul class="footer__list" role="list">
              <li class="footer__list-item"><a href="../../pages/public/about.html" class="footer__link">Sobre nosotros</a></li>
              <li class="footer__list-item"><a href="#" class="footer__link">Términos y condiciones</a></li>
              <li class="footer__list-item"><a href="#" class="footer__link">Política de privacidad</a></li>
            </ul>
          </section>

          <section class="footer__section">
            <h4 class="footer__title">Contacto</h4>
            <ul class="footer__list" role="list">
              <li class="footer__list-item"><a href="tel:+523346675957"                   class="footer__link">+52 1 33 4667 5957</a></li>
              <li class="footer__list-item"><a href="mailto:ixelartesanias@gmail.com"  class="footer__link">ixelartesanias@gmail.com</a></li>
              <li class="footer__list-item"><span class="footer__link">Jalisco, México</span></li>
            </ul>
          </section>
        </div>

        <div class="footer__right">
          <nav class="footer__social" aria-label="Redes sociales">
            <a href="https://www.facebook.com/profile.php?id=61578116663335"
               target="_blank" rel="noopener noreferrer"
               class="footer__social-link" aria-label="Facebook">
              <svg width="36" height="36" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path fill="#F2D5C1" d="M15 8a7 7 0 00-7-7 7 7 0 00-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0015 8z"/>
              </svg>
            </a>

            <a href="https://www.instagram.com/ixel.mx/"
               target="_blank" rel="noopener noreferrer"
               class="footer__social-link" aria-label="Instagram">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#F2D5C1" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" stroke="#F2D5C1" stroke-width="2"/>
                <circle cx="17.5" cy="6.5" r="1" fill="#F2D5C1"/>
              </svg>
            </a>

            <a href="mailto:contacto@ixelartesanias.com"
               class="footer__social-link" aria-label="Correo electrónico">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="#F2D5C1" stroke-width="2"/>
                <path d="M2 7l10 7 10-7" stroke="#F2D5C1" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </a>

            <a href="http://wa.me/523330336808"
                target="_blank" rel="noopener noreferrer"
                class="footer__social-link" aria-label="WhatsApp">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.435 5.163L2 22l4.837-1.435A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
                    stroke="#F2D5C1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.5 9.5c.5 1 1.5 3 3.5 4.5s3.5 1.5 4.5 1"
                    stroke="#F2D5C1" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </a>

          </nav>

          <div class="footer__monogram" aria-hidden="true">
            <img src="../../assets/img/icons/x.png" alt="ixel_monogram" class="footer__monogram-image">
          </div>
        </div>

      </div>
    </footer>

    <div class="footer__border" role="presentation" aria-hidden="true">
      <img src="../../assets/img/icons/cenefa.png" alt="" class="footer__border-image">
    </div>
  `;
}