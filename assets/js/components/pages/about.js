// assets/js/components/pages/about.js
// ES Module — solo vista pública. Sin lógica de edición.
// Lee texto de localStorage (escrito por admin/about.html vía editAbout.js).
// Si no existe, muestra texto por defecto.

const ABOUT_TEXT_KEY    = 'ixel_about_text';
const ABOUT_TEXT_DEFAULT = `En honor a la artista, el puntillismo se basa en pequeños puntos de color, aplicados con precisión, colocados muy cerca unos de otros. En lugar de mezclar los colores en la paleta, los artistas colocan puntos de color puro uno al lado del otro. El ojo del espectador los mezcla ópticamente, creando una luminosidad e intensidad únicas. Al ver la obra desde lejos, los puntos se mezclan en el ojo del espectador, formando formas y colores.`;

// ─── DATOS DEL EQUIPO ────────────────────────────────────────
// Fuente única de verdad. El HTML del carrusel se genera 100% aquí.
// Para agregar un miembro: agregar un objeto a este array.

const TEAM = [
  {
    name:     'Paola Salgado',
    image:    '../../assets/img/Pao-1.png',
    github:   'https://github.com/Duque-Paola',
    linkedin: 'https://www.linkedin.com/in/paoladuquesalgado/',
  },
  {
    name:     'Axl Olvera',
    image:    '../../assets/img/Axl-1.png',
    github:   'https://github.com/AxlOlvera',
    linkedin: 'https://www.linkedin.com/in/axl-sanchez/',
  },
  {
    name:     'Liliana Sucres',
    image:    '../../assets/img/Sucres.png',
    github:   'https://github.com/mont-sucres',
    linkedin: 'https://www.linkedin.com/in/mont-sucres/',
  },
  {
    name:     'Jordy Hernández',
    image:    '../../assets/img/Jordi-1.png',
    github:   'https://github.com/jordyH54',
    linkedin: 'https://www.linkedin.com/in/jordy-hernandezz/',
  },
  {
    name:     'Diego López',
    image:    '../../assets/img/Diego.png',
    github:   'https://github.com/dlopezz97',
    linkedin: 'https://www.linkedin.com/in/diego-lopezrdz/',
  },
  {
    name:     'Genaro de León',
    image:    '../../assets/img/Genaro-1.png',
    github:   'https://github.com/AppleMH',
    linkedin: 'https://www.linkedin.com/in/genaro-corazon-developer-jr/',
  },
  {
    name:     'Isaac López',
    image:    '../../assets/img/Isaac.jpeg',
    github:   'https://github.com/IsaacLC1104',
    linkedin: 'https://www.linkedin.com/in/isaacdevjr/',
  },
  {
    name:     'Úrsula Vela',
    image:    '../../assets/img/Ursula.jpeg',
    github:   'https://github.com/UrsulaVela',
    linkedin: 'https://www.linkedin.com/in/ursulavela/',
  },
  {
    name:     'Diana Ibarra',
    image:    '../../assets/img/Diana .jpeg',
    github:   'https://github.com/dianaibarra0303-ux',
    linkedin: 'https://www.linkedin.com/in/dianaibarra0303/',
  },
  {
    name:     'Carlos Guadarrama',
    image:    '../../assets/img/Carlos-1.png',
    github:   'https://github.com/caradguadarrama',
    linkedin: 'https://www.linkedin.com/in/carlosaguadarrama/',
  },
];

// ─── TEXTO EDITABLE ────────────────────────────────────────────

function loadAboutText() {
  const el = document.getElementById('about-text');
  if (!el) return;
  el.textContent = localStorage.getItem(ABOUT_TEXT_KEY) ?? ABOUT_TEXT_DEFAULT;
}

// ─── CARRUSEL ──────────────────────────────────────────────────

/**
 * Genera el HTML de una tarjeta de miembro del equipo.
 * SVGs inline para evitar peticiones HTTP adicionales.
 */
function createCard(member) {
  return `
    <article class="team-carousel__card">
      <img
        src="${member.image}"
        alt="Foto de ${member.name}"
        class="team-carousel__photo"
        loading="lazy"
      >
      <p class="team-carousel__name">${member.name}</p>
      <div class="team-carousel__social">
        <a
          href="${member.github}"
          target="_blank"
          rel="noopener noreferrer"
          class="team-carousel__social-link"
          aria-label="GitHub de ${member.name}"
        >
          <svg class="team-carousel__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </a>
        <a
          href="${member.linkedin}"
          target="_blank"
          rel="noopener noreferrer"
          class="team-carousel__social-link"
          aria-label="LinkedIn de ${member.name}"
        >
          <svg class="team-carousel__social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </div>
    </article>
  `;
}

/**
 * Inicializa el carrusel infinito.
 *
 * Técnica: se genera un grupo original + una copia exacta.
 * La animación CSS desplaza el track el 50% (= ancho del grupo original).
 * Cuando llega al 50%, el CSS resetea a 0 de forma imperceptible
 * porque el segundo grupo es idéntico al primero.
 *
 * No se usa JS para animar — solo CSS animation con cubic-bezier.
 * JS solo genera el HTML y duplica el contenido una vez.
 */
function initCarousel() {
  const track = document.querySelector('.team-carousel__track');
  if (!track) return;

  // Renderizar un grupo con todos los miembros
  const groupHTML = TEAM.map(createCard).join('');

  // Insertar el grupo dos veces — el segundo es la copia para el loop
  track.innerHTML = `
    <div class="team-carousel__group" aria-hidden="false">${groupHTML}</div>
    <div class="team-carousel__group" aria-hidden="true">${groupHTML}</div>
  `;

  // Pausar al hover o foco dentro del carrusel
  const container = track.closest('.team-carousel');
  if (container) {
    container.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    container.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    container.addEventListener('focusin',    () => track.style.animationPlayState = 'paused');
    container.addEventListener('focusout',   () => track.style.animationPlayState = 'running');
  }
}

// ─── INIT ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadAboutText();
  initCarousel();
});