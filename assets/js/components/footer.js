// assets/js/components/footer.js

/**
 * Genera el HTML del footer con estructura semántica y BEM
 * @returns {string} HTML del footer completo
 */
export function createFooter() {
  return `
    <div class="footer">
      <div class="footer__container">
        <!-- Sección: Enlaces rápidos -->
        <section class="footer__section">
          <h4 class="footer__title">Enlaces Rápidos</h4>
          <ul class="footer__list">
            <li class="footer__list-item">
              <a href="/index.html" class="footer__link">Inicio</a>
            </li>
            <li class="footer__list-item">
              <a href="/pages/public/products.html" class="footer__link">Productos</a>
            </li>
            <li class="footer__list-item">
              <a href="/pages/public/about.html" class="footer__link">Nosotros</a>
            </li>
            <li class="footer__list-item">
              <a href="/pages/public/contact.html" class="footer__link">Contacto</a>
            </li>
          </ul>
        </section>

        <!-- Sección: Información -->
        <section class="footer__section">
          <h4 class="footer__title">Información</h4>
          <ul class="footer__list">
            <li class="footer__list-item">
              <a href="/pages/public/about.html" class="footer__link">Sobre nosotros</a>
            </li>
            <li class="footer__list-item">
              <a href="#" class="footer__link">Términos y condiciones</a>
            </li>
            <li class="footer__list-item">
              <a href="#" class="footer__link">Política de privacidad</a>
            </li>
          </ul>
        </section>

        <!-- Sección: Contacto -->
        <section class="footer__section">
          <h4 class="footer__title">Contacto</h4>
          <ul class="footer__list">
            <li class="footer__list-item">
              <a href="tel:+523312345678" class="footer__link">+52 33 1234 5678</a>
            </li>
            <li class="footer__list-item">
              <a href="mailto:contacto@ixelartesanias.com" class="footer__link">contacto@ixelartesanias.com</a>
            </li>
            <li class="footer__list-item">
              <span class="footer__link">Jalisco, México</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- Cenefa decorativa -->
      <div class="footer__border" role="presentation" aria-hidden="true"></div>
    </div>
  `;
}