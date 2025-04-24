import express from "express";

import airbnbController from "../controller/airbnb.controller.js";

const router = express.Router();

router.get("/habitaciones", airbnbController.mostrarHabitaciones);

/* Rutas usuarios */
router.post("/usuarios", airbnbController.agregarUsuario); // Crear usuario
router.get("/usuarios", airbnbController.mostrarUsuarios); // Leer usuarios
router.get("/usuarios/:id", airbnbController.mostrarUsuarioPorId); // Leer usuario por ID
router.put("/usuarios/:id", airbnbController.actualizarUsuario); // Actualizar usuario
router.delete("/usuarios/:id", airbnbController.eliminarUsuario); // Eliminar usuario

export default router;
