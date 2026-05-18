const phone = "51961951302";
const regularPrice = 100;
const promoPrice = 50;
let promoActive = true;

const books = [
  {
    id: "familias",
    title: "Familias que perduran",
    theme: "Familia, legado y unidad",
    coverImage: "img/FAMILIAS QUE PERDURAN .png",
    description: "Una lectura para quienes quieren construir hogares firmes, relaciones sanas y decisiones que dejen huella.",
    intro: "Lee completo el capítulo de regalo extraído del libro. Si conecta contigo, puedes pedir el ejemplar completo por WhatsApp.",
  },
  {
    id: "hombre-mujer",
    title: "El valor de ser hombre y mujer",
    theme: "Identidad y propósito",
    coverImage: "img/EL VALOR DE SER HOMBRE Y MUJER EN EL SIGLO XXI.png",
    description: "Una propuesta directa para reflexionar sobre identidad, valor personal y propósito en la vida diaria.",
    intro: "Este capítulo completo abre una mirada clara sobre la dignidad, la diferencia y la responsabilidad de vivir con propósito.",
  },
  {
    id: "comiendo",
    title: "Comiendo para vivir en el siglo XXI",
    theme: "Salud y hábitos",
    coverImage: "img/COMIENDO VIVIR EN EL SIGLO XXI.png",
    description: "Una guía para mirar la alimentación como una decisión diaria de bienestar, energía y disciplina.",
    intro: "Lee el capítulo completo de regalo y descubre el vínculo entre hábitos, cuerpo y decisiones prácticas para vivir con más conciencia.",
  },
  {
    id: "juventud",
    title: "Guía para la juventud del siglo XXI",
    theme: "Juventud y decisiones",
    coverImage: "img/JUVENTUD DEL SIGLO XXI.png",
    description: "Un libro pensado para jóvenes que necesitan dirección, criterio y carácter frente a los desafíos actuales.",
    intro: "Este capítulo completo ofrece una entrada práctica a decisiones que marcan la juventud: amistades, propósito, disciplina y futuro.",
  },
  {
    id: "lideres",
    title: "Más que líderes, siervos",
    theme: "Liderazgo y servicio",
    coverImage: "img/Mas que líderes, Siervos.png",
    description: "Una lectura para líderes que quieren influir desde el servicio, la humildad y la responsabilidad.",
    intro: "El capítulo completo de regalo muestra la diferencia entre dirigir por posición y servir con autoridad moral.",
  },
];

const grid = document.querySelector("#booksGrid");
const modal = document.querySelector("#previewModal");
const modalTitle = document.querySelector("#modalTitle");
const modalIntro = document.querySelector("#modalIntro");
const chapterTitle = document.querySelector("#chapterTitle");
const chapterText = document.querySelector("#chapterText");
const modalBuy = document.querySelector("#modalBuy");

const currentPrice = () => (promoActive ? promoPrice : regularPrice);
const priceLabel = () => (promoActive ? `PRECIO PROMO S/ ${promoPrice}` : `PRECIO REGULAR S/ ${regularPrice}`);
const buyUrl = (title) => `https://wa.me/${phone}?text=${encodeURIComponent(`QUIERO COMPRAR EL LIBRO ${title} - ${priceLabel()}`)}`;

function refreshBuyLinks() {
  document.querySelectorAll("[data-buy-title]").forEach((link) => {
    link.href = buyUrl(link.dataset.buyTitle);
  });
  if (modalBuy.dataset.buyTitle) {
    modalBuy.href = buyUrl(modalBuy.dataset.buyTitle);
    modalBuy.textContent = `Comprar "${modalBuy.dataset.buyTitle}" por WhatsApp - S/ ${currentPrice()}`;
  }
}

function startCountdown() {
  let remaining = 10 * 60;
  const countdowns = document.querySelectorAll("[data-countdown]");

  const render = () => {
    const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const seconds = String(remaining % 60).padStart(2, "0");
    countdowns.forEach((node) => {
      node.textContent = `${minutes}:${seconds}`;
    });

    if (remaining <= 0) {
      promoActive = false;
      document.body.classList.add("promo-ended");
      countdowns.forEach((node) => {
        node.textContent = "00:00";
      });
      refreshBuyLinks();
      return;
    }

    remaining -= 1;
    window.setTimeout(render, 1000);
  };

  render();
}

books.forEach((book, index) => {
  const card = document.createElement("article");
  card.className = "book-card";
  card.innerHTML = `
    <figure class="book-cover">
      <img src="${book.coverImage}" alt="Portada del libro ${book.title}" loading="lazy">
    </figure>
    <div class="book-body">
      <span class="tag">${book.theme}</span>
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      <div class="price-box">
        <span class="regular-price">S/ ${regularPrice}</span>
        <strong>S/ ${promoPrice}</strong>
        <small>50% de descuento por <span data-countdown>10:00</span></small>
      </div>
      <div class="card-actions">
        <button class="preview-btn" type="button" data-preview="${index}">Leer capítulo completo gratis</button>
        <a class="buy-btn" href="${buyUrl(book.title)}" data-buy-title="${book.title}" target="_blank" rel="noopener">Comprar por WhatsApp</a>
      </div>
    </div>
  `;
  grid.appendChild(card);
});

function openPreview(index) {
  const book = books[index];
  const fullChapter = window.freeChapters?.[book.id] || "Capítulo no disponible. Agrega el texto completo en chapters.js.";
  const firstLine = fullChapter.split("\n").find(Boolean) || "Capítulo completo";

  modalTitle.textContent = book.title;
  modalIntro.textContent = book.intro;
  chapterTitle.textContent = firstLine;
  chapterText.textContent = fullChapter;
  modalBuy.dataset.buyTitle = book.title;
  modalBuy.href = buyUrl(book.title);
  modalBuy.textContent = `Comprar "${book.title}" por WhatsApp - S/ ${currentPrice()}`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.querySelector(".modal-panel").scrollTop = 0;
}

function closePreview() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("click", (event) => {
  const previewButton = event.target.closest("[data-preview]");
  if (previewButton) {
    openPreview(Number(previewButton.dataset.preview));
  }

  if (event.target.closest("[data-close]")) {
    closePreview();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closePreview();
  }
});

startCountdown();
