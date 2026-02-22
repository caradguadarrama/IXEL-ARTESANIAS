//boton de ver mas que sigue el scroll
const hero = document.querySelector('.hero');
const button = document.querySelector('.btn-ver-mas');

window.addEventListener('scroll', () => {
    const heroRect = hero.getBoundingClientRect();
    const heroHeight = hero.offsetHeight;

    // If hero is in viewport
    if (heroRect.top <= 0 && heroRect.bottom >= 0) {

        // how much we scrolled inside hero
        const scrollInsideHero = Math.abs(heroRect.top);

        // limit movement so it stops before hero ends
        const maxMove = heroHeight * 0.4; 

        const move = Math.min(scrollInsideHero * 0.3, maxMove);

        button.style.transform = `translateY(-${move}px)`;
    }
});

//carrusel de top products
const topTrack = document.querySelector('.top-carousel-track');
let topCards = Array.from(document.querySelectorAll('.top-card'));

const totalRealCards = topCards.length;
const cardWidthPercent = 33.3333;

// Clone first and last TWO cards for stability
const cards = Array.from(document.querySelectorAll('.top-card'));

let positions = ['left', 'center', 'right', 'hidden'];

function renderCarousel() {
    cards.forEach((card, i) => {
        card.classList.remove('left', 'center', 'right', 'hidden');
        card.classList.add(positions[i]);
    });
}

function rotateCarousel() {
    positions.push(positions.shift());
    renderCarousel();
}

renderCarousel();
setInterval(rotateCarousel, 3000);

document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("cards");

  fetch("productos_final.json")
    .then(response => response.json())
    .then(products => {

      // Select specific products
      const selectedIds = [1, 3, 4];
      const selectedProducts = products.filter(product =>
        selectedIds.includes(product.id)
      );

      // Render them
      selectedProducts.forEach(product => {
  const col = document.createElement("div");
  col.className = "col-12 col-md-4";

  col.innerHTML = `
    <div class="product-card">
      <div class="product-image favorite">
        <img src="${product.imagen}" alt="${product.name}">
      </div>
      <h5 class="product-name">${product.name}</h5>
      <p class="product-price">$${product.price}</p>
      <button class="button-ixel-products addCart" data-id="${product.id}">
        +
      </button>
    </div>
  `;

  cardsContainer.appendChild(col);
});

    })
    .catch(error => console.error("Error loading products:", error));
});



