// main.js

const lightbox = document.getElementById("lightbox"); // Si #lightbox existe en index.html
const lightboxImg = document.getElementById("lightbox-img"); // Si #lightbox-img existe en index.html
const closeBtn = document.querySelector(".lightbox-close"); // Si .lightbox-close existe en index.html
const galleryImages = document.querySelectorAll(".gallery-grid img");
const registroForm = document.getElementById("registro-form")

let currentIndex = 0;

// Funciones de Lightbox (asumen que lightbox, lightboxImg, galleryImages existen cuando se llaman)
function openLightbox(index) {
  // Asegúrate de que galleryImages no sea null/undefined o vacío antes de acceder a index
   if (galleryImages && galleryImages.length > index) {
       currentIndex = index;
       if (lightbox) lightbox.style.display = "block"; // Verifica si lightbox existe
       if (lightboxImg) lightboxImg.src = galleryImages[index].src; // Verifica si lightboxImg existe
   }
}

function closeLightbox() {
  if (lightbox) lightbox.style.display = "none";
}

function showNextImage() {
  if (galleryImages && galleryImages.length > 0) {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      if (lightboxImg) lightboxImg.src = galleryImages[currentIndex].src;
  }
}

function showPrevImage() {
  if (galleryImages && galleryImages.length > 0) {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      if (lightboxImg) lightboxImg.src = galleryImages[currentIndex].src;
  }
}

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => openLightbox(index));
});

closeBtn.addEventListener("click", closeLightbox);

// Navegación con teclado (puede estar fuera si window siempre existe, pero los elementos referenciados deben existir)
window.addEventListener("keydown", (e) => {
  if (lightbox && lightbox.style.display === "block") { // Verifica si lightbox existe
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
  console.log("DOM completamente cargado en main.js. Inicializando listeners y elementos.");

  // --- Definiciones de elementos AHORA, dentro del listener ---
  // (Si estos elementos existen en index.html)
  const galleryImages = document.querySelectorAll(".gallery-grid img"); // <- Definir aquí
  const registroForm = document.getElementById("registro-form"); // <-- ¡CORRECCIÓN! Usar getElementById
  // ---------------------------------------------------------


  // Agregar botones Prev / Next al lightbox (si #lightbox existe)
  const lightboxElement = document.getElementById("lightbox"); // O usar la variable 'lightbox' definida arriba si no la borraste
  if (lightboxElement) { // Verificar que el lightbox existe antes de añadir botones
       const prevBtn = document.createElement("button");
       const nextBtn = document.createElement("button");

       prevBtn.textContent = "◀";
       nextBtn.textContent = "▶";

       prevBtn.classList.add("lightbox-prev");
       nextBtn.classList.add("lightbox-next");

       lightboxElement.appendChild(prevBtn);
       lightboxElement.appendChild(nextBtn);

       prevBtn.addEventListener("click", showPrevImage);
       nextBtn.addEventListener("click", showNextImage);
  }

  if (registroForm) { // <--- Ahora, esta verificación SÍ se hace sobre un elemento o null
    registroForm.addEventListener('submit', function(event) { // <--- Esta línea ya NO debería dar error
      event.preventDefault(); // Evita la recarga de la página

      const formData = new FormData(this);
      const telefono = formData.get('telefono');

      // Validación del campo de teléfono
      const soloNumeros = /^\d+$/.test(telefono);
      const tieneDiezDigitos = telefono.length === 10;

      if (!soloNumeros || !tieneDiezDigitos) {
        alert('Por favor, ingresa un número de teléfono válido de 10 dígitos.');
        return; // Detiene el envío del formulario si la validación falla
      }

      const userData = {
        nombre: formData.get('nombre'),
        email: formData.get('email'),
        telefono: telefono, // Usamos el valor validado
        habitacion_interes: formData.get('habitacion_interes'),
        mensaje: formData.get('mensaje')
      };

      fetch('http://localhost:3005/api/usuarios', { // La ruta para crear usuarios en tu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(response => {
           if (!response.ok) {
               // Si la respuesta no es OK (ej: 400, 500), lanza un error
               return response.json().then(errorData => { throw new Error(errorData.message || 'Error al registrar usuario'); });
           }
           return response.json(); // Si la respuesta es OK, parsea el JSON
       })
      .then(data => {
        console.log('Respuesta del backend:', data);
        alert('¡Tu solicitud ha sido enviada!');
        registroForm.reset(); // Limpia el formulario
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        alert(`Hubo un error al enviar tu solicitud: ${error.message}`);
      });
    });
  } else {
      console.warn("Formulario de registro con ID 'registro-form' no encontrado. El listener no se asignará.");
  }

  // Asignar listeners a las imágenes de la galería AHORA que existen
  // const galleryImages = document.querySelectorAll(".gallery-grid img"); // <- Ya definida arriba dentro del listener
  if (galleryImages && galleryImages.length > 0) { // Verificar que se encontraron imágenes
       galleryImages.forEach((img, index) => {
         img.addEventListener("click", () => openLightbox(index));
       });
  } else {
       console.warn("No se encontraron imágenes de galería con selector '.gallery-grid img'. No se asignarán listeners.");
  }

  // Asignar listener al botón de cerrar lightbox si existe
  const closeBtnElement = document.querySelector(".lightbox-close"); // O usar la variable 'closeBtn' definida arriba
  if (closeBtnElement) {
      closeBtnElement.addEventListener("click", closeLightbox);
  } else {
       console.warn("Botón de cerrar lightbox con selector '.lightbox-close' no encontrado. Listener no asignado.");
  }
});
