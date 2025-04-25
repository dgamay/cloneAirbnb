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
  



  
// Manejo del envío del formulario de contacto (registro)
if (registroForm) {
  registroForm.addEventListener('submit', function(event) {
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

    fetch('/api/usuarios', { // La ruta para crear usuarios en tu backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del backend:', data);
      alert('¡Tu solicitud ha sido enviada!');
      registroForm.reset(); // Limpia el formulario
    })
    .catch(error => {
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
    });
  });
}
