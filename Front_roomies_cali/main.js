// main.js

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox-close");
const galleryImages = document.querySelectorAll(".gallery-grid img");

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  lightbox.style.display = "block";
  lightboxImg.src = galleryImages[index].src;
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentIndex].src;
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => openLightbox(index));
});

closeBtn.addEventListener("click", closeLightbox);

// Navegación con teclado
window.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "block") {
    if (e.key === "ArrowRight") {
      showNextImage();
    } else if (e.key === "ArrowLeft") {
      showPrevImage();
    } else if (e.key === "Escape") {
      closeLightbox();
    }
  }
});

// Agregar botones Prev / Next al lightbox
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");

  prevBtn.textContent = "◀";
  nextBtn.textContent = "▶";

  prevBtn.classList.add("lightbox-prev");
  nextBtn.classList.add("lightbox-next");

  lightbox.appendChild(prevBtn);
  lightbox.appendChild(nextBtn);

  prevBtn.addEventListener("click", showPrevImage);
  nextBtn.addEventListener("click", showNextImage);
});

// Cerrar lightbox al hacer clic fuera de la imagen
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  