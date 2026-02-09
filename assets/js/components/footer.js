// assets/js/components/footer.js
/**
 * Genera el HTML del footer con estructura semántica y BEM
 * Diseño: Enlaces/Info/Contacto a la izquierda | Redes + Monograma a la derecha
 * @returns {string} HTML del footer completo
 */
export function createFooter() {
  return `
    <div class="footer">
      <div class="footer__container">
        
        <!-- COLUMNA IZQUIERDA: Enlaces, Información y Contacto -->
        <div class="footer__left">
          
          <!-- Enlaces Rápidos -->
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

          <!-- Información -->
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

          <!-- Contacto -->
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

        <!-- COLUMNA DERECHA: Redes Sociales + Monograma -->
        <div class="footer__right">
          
          <!-- Redes sociales en línea horizontal -->
          <div class="footer__social">
            <a href="https://www.facebook.com/profile.php?id=61578116663335" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="footer__social-link"
               aria-label="Facebook">
              <svg width="40" height="40" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none">
                <path fill="#F2D5C1" d="M15 8a7 7 0 00-7-7 7 7 0 00-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0015 8z"/>
              </svg>
            </a>

            <a href="https://www.instagram.com/ixel.mx/" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="footer__social-link"
               aria-label="Instagram">
              <svg width="40" height="40" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-340.000000, -7439.000000)" fill="#F2D5C1">
                  <g transform="translate(56.000000, 160.000000)">
                    <path d="M289.869652,7279.12273 C288.241769,7279.19618 286.830805,7279.5942 285.691486,7280.72871 C284.548187,7281.86918 284.155147,7283.28558 284.081514,7284.89653 C284.035742,7285.90201 283.768077,7293.49818 284.544207,7295.49028 C285.067597,7296.83422 286.098457,7297.86749 287.454694,7298.39256 C288.087538,7298.63872 288.809936,7298.80547 289.869652,7298.85411 C298.730467,7299.25511 302.015089,7299.03674 303.400182,7295.49028 C303.645956,7294.859 303.815113,7294.1374 303.86188,7293.08031 C304.26686,7284.19677 303.796207,7282.27117 302.251908,7280.72871 C301.027016,7279.50685 299.5862,7278.67508 289.869652,7279.12273 M289.951245,7297.06748 C288.981083,7297.0238 288.454707,7296.86201 288.103459,7296.72603 C287.219865,7296.3826 286.556174,7295.72155 286.214876,7294.84312 C285.623823,7293.32944 285.819846,7286.14023 285.872583,7284.97693 C285.924325,7283.83745 286.155174,7282.79624 286.959165,7281.99226 C287.954203,7280.99968 289.239792,7280.51332 297.993144,7280.90837 C299.135448,7280.95998 300.179243,7281.19026 300.985224,7281.99226 C301.980262,7282.98483 302.473801,7284.28014 302.071806,7292.99991 C302.028024,7293.96767 301.865833,7294.49274 301.729513,7294.84312 C300.829003,7297.15085 298.757333,7297.47145 289.951245,7297.06748 M298.089663,7283.68956 C298.089663,7284.34665 298.623998,7284.88065 299.283709,7284.88065 C299.943419,7284.88065 300.47875,7284.34665 300.47875,7283.68956 C300.47875,7283.03248 299.943419,7282.49847 299.283709,7282.49847 C298.623998,7282.49847 298.089663,7283.03248 298.089663,7283.68956 M288.862673,7288.98792 C288.862673,7291.80286 291.150266,7294.08479 293.972194,7294.08479 C296.794123,7294.08479 299.081716,7291.80286 299.081716,7288.98792 C299.081716,7286.17298 296.794123,7283.89205 293.972194,7283.89205 C291.150266,7283.89205 288.862673,7286.17298 288.862673,7288.98792 M290.655732,7288.98792 C290.655732,7287.16159 292.140329,7285.67967 293.972194,7285.67967 C295.80406,7285.67967 297.288657,7287.16159 297.288657,7288.98792 C297.288657,7290.81525 295.80406,7292.29716 293.972194,7292.29716 C292.140329,7292.29716 290.655732,7290.81525 290.655732,7288.98792"/>
                  </g>
                </g>
              </svg>
            </a>

            <a href="mailto:contacto@ixelartesanias.com" 
               class="footer__social-link"
               aria-label="Email">
              <svg width="40" height="40" viewBox="0 -4 32 32" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-412.000000, -259.000000)" fill="#F2D5C1">
                  <path d="M442,279 C442,279.203 441.961,279.395 441.905,279.578 L433,270 L442,263 L442,279 L442,279 Z M415.556,280.946 L424.58,271.33 L428,273.915 L431.272,271.314 L440.444,280.946 C440.301,280.979 415.699,280.979 415.556,280.946 L415.556,280.946 Z M414,279 L414,263 L423,270 L414.095,279.578 C414.039,279.395 414,279.203 414,279 L414,279 Z M441,261 L428,271 L415,261 L441,261 L441,261 Z M440,259 L416,259 C413.791,259 412,260.791 412,263 L412,279 C412,281.209 413.791,283 416,283 L440,283 C442.209,283 444,281.209 444,279 L444,263 C444,260.791 442.209,259 440,259 L440,259 Z"/>
                </g>
              </svg>
            </a>

            <a href="http://wa.me/523330336808" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="footer__social-link"
               aria-label="WhatsApp">
              <svg width="40" height="40" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-300.000000, -7599.000000)" fill="#F2D5C1">
                  <g transform="translate(56.000000, 160.000000)">
                    <path d="M259.821,7453.12124 C259.58,7453.80344 258.622,7454.36761 257.858,7454.53266 C257.335,7454.64369 256.653,7454.73172 254.355,7453.77943 C251.774,7452.71011 248.19,7448.90097 248.19,7446.36621 C248.19,7445.07582 248.934,7443.57337 250.235,7443.57337 C250.861,7443.57337 250.999,7443.58538 251.205,7444.07952 C251.446,7444.6617 252.034,7446.09613 252.104,7446.24317 C252.393,7446.84635 251.81,7447.19946 251.387,7447.72462 C251.252,7447.88266 251.099,7448.05372 251.27,7448.3478 C251.44,7448.63589 252.028,7449.59418 252.892,7450.36341 C254.008,7451.35771 254.913,7451.6748 255.237,7451.80984 C255.478,7451.90987 255.766,7451.88687 255.942,7451.69881 C256.165,7451.45774 256.442,7451.05762 256.724,7450.6635 C256.923,7450.38141 257.176,7450.3464 257.441,7450.44643 C257.62,7450.50845 259.895,7451.56477 259.991,7451.73382 C260.062,7451.85686 260.062,7452.43903 259.821,7453.12124 M254.002,7439 L253.997,7439 L253.997,7439 C248.484,7439 244,7443.48535 244,7449 C244,7451.18666 244.705,7453.21526 245.904,7454.86076 L244.658,7458.57687 L248.501,7457.3485 C250.082,7458.39482 251.969,7459 254.002,7459 C259.515,7459 264,7454.51465 264,7449 C264,7443.48535 259.515,7439 254.002,7439"/>
                  </g>
                </g>
              </svg>
            </a>
          </div>

          <!-- Monograma centrado debajo de redes -->
          <div class="footer__monogram">
            <img src="/assets/img/icons/x.png" alt="IXEL Monograma" class="footer__monogram-image">
          </div>

        </div>
        
      </div>
    </div>
    
    <!-- Cenefa decorativa inferior -->
    <div class="footer__border" role="presentation" aria-hidden="true">
      <img src="/assets/img/icons/cenefa.png" alt="" class="footer__border-image">
    </div>
  `;
}