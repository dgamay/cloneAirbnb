const roomList = document.getElementById("roomList");
const roomDetail = document.getElementById("roomDetail");
const roomInfo = document.getElementById("roomInfo");
const btnBack = document.getElementById("btnBack");
const searchBar = document.getElementById("searchBar");
const searchButton = document.getElementById("searchButton");
const roomSearch = document.getElementById("roomSearch");
const roomSearch1 = document.getElementById("roomSearch1");
const roomSearchInfo = document.getElementById("roomSearchInfo");
const btnBack1 = document.getElementById("btnBack1");

// 🔁 Obtener todas las habitaciones
async function getRoomData() {
  try {
    const res = await fetch("http://localhost:3005/api/habitaciones"); // Asegúrate que usas /api si lo montaste así
    const habitaciones = await res.json();
    console.log(habitaciones);
    console.log(habitaciones.imageUrl);
    return habitaciones;
  } catch (error) {
    console.error("Error al obtener habitaciones:", error.message);
  }
}

// 🔍 Buscar habitación por nombre
async function searchRoomByName(nombre) {
  try {
    const habitaciones = await getRoomData();
    return habitaciones.find(room => room.nombre.toLowerCase() === nombre.toLowerCase());
  } catch (error) {
    console.error("Error al buscar habitación:", error.message);
  }
}

// 🖼️ Mostrar todas las habitaciones
function displayRooms(habitaciones) {
  roomList.innerHTML = "";
  habitaciones.forEach(habitacion => {
   
    const roomCard = document.createElement("div");
    roomCard.classList.add("room-card");

    const imageUrlToDisplay = habitacion.imageUrl || 'http://localhost:3005/uploads/reparacion.jpg'; // Usa imagen por defecto si imageUrl es null o vacío
        const roomNumberForAlt = habitacion.numero || 'No Disponible'; // Usa el número para el texto alternativo


    roomCard.innerHTML = `
      <img src="${imageUrlToDisplay }" alt="${roomNumberForAlt}" />
      <h3>${habitacion.numero}</h3>
      <p>Tipo: ${habitacion.tipo}</p>
      <p>Precio: $${habitacion.precio}</p>
    `;

    roomCard.addEventListener("click", () => showRoomDetail(habitacion));
    roomList.appendChild(roomCard);
  });
}

// 🔎 Mostrar detalles al hacer clic
function showRoomDetail(habitacion) {
  roomList.style.display = "none";
  roomDetail.style.display = "flex";
  roomSearch.style.display = "none";
  roomSearch1.style.display = "none";

  roomInfo.innerHTML = `
    <h2>${habitacion.numero}</h2>
    <img src="${habitacion.imageUrl}" alt="${habitacion.nombre}" />
    <p><strong>Tipo:</strong> ${habitacion.tipo}</p>
    <p><strong>Precio:</strong> $${habitacion.precio}</p>
    <p><strong>Descripción:</strong> ${habitacion.descripcion}</p>
    <p><strong>Disponible:</strong> ${habitacion.disponible ? "Sí" : "No"}
      <button onclick="actualizarDisponibilidad('${habitacion._id}', ${!habitacion.disponible})">
        Cambiar
      </button>
    </p>
  `;
}

// 🔎 Mostrar resultado de búsqueda
function showRoomSearchResult(habitacion) {
  roomList.style.display = "none";
  roomDetail.style.display = "none";
  roomSearch.style.display = "none";
  roomSearch1.style.display = "block";

  roomSearchInfo.innerHTML = `
    <div class="room-card">
      <img src="http://localhost:3005/uploads/${habitacion.imagen}" alt="${habitacion.nombre}" />
      <h3>${habitacion.nombre}</h3>
      <p>Tipo: ${habitacion.tipo}</p>
      <p>Precio: $${habitacion.precio}</p>
    </div>
  `;

  roomSearchInfo.onclick = function () {
    showRoomDetail(habitacion);
  };
}

// 🔁 Cargar habitaciones al iniciar
async function loadRoom() {
  const habitaciones = await getRoomData();
  if (habitaciones && habitaciones.length > 0) {
    displayRooms(habitaciones);
  }
}



// 🔙 Botón volver del detalle
btnBack.addEventListener("click", () => {
  roomList.style.display = "flex";
  roomDetail.style.display = "none";
  roomSearch.style.display = "block";
  roomSearch1.style.display = "none";
});

// 🔙 Botón volver del resultado de búsqueda
btnBack1.addEventListener("click", () => {
  roomList.style.display = "flex";
  roomDetail.style.display = "none";
  roomSearch.style.display = "block";
  roomSearch1.style.display = "none";
});

// 🔍 Buscar habitación por nombre
searchButton.addEventListener("click", async () => {
  const nombre = searchBar.value.trim();
  if (!nombre) {
    alert("Por favor, ingresa el nombre de una habitación.");
    return;
  }

  const habitacion = await searchRoomByName(nombre);
  if (!habitacion) {
    alert("Habitación no encontrada.");
    return;
  }

  showRoomSearchResult(habitacion);
});

// 🛠️ Función para actualizar disponibilidad
async function actualizarDisponibilidad(id, disponible) {
  try {
    const response = await fetch(`http://localhost:3005/api/habitaciones/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ disponible }),
    });

    const data = await response.json();
    console.log("Disponibilidad actualizada:", data);
    loadRoom(); // Refresca el listado
    alert("Disponibilidad actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar disponibilidad:", error);
  }
}

// 🚀 Inicia todo
loadRoom();
