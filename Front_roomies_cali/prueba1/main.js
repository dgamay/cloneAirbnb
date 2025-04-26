const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox-close");
const galleryImages = document.querySelectorAll(".Power");

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  lightbox.style.display = "block";
  lightboxImg.src = galleryImages[index].src;
}

function closeLightbox() {
  lightbox.style.display = "none";
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => openLightbox(index));
});

closeBtn.addEventListener("click", closeLightbox);

// Navegación con teclado
window.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "block") {

    if (e.key === "Escape") {
      closeLightbox();
    }
  }
});

// Agregar botones Prev / Next al lightbox
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");

});

// Cerrar lightbox al hacer clic fuera de la imagen
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  

