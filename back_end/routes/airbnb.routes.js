import express from 'express';
import habitacionController from '../controller/habitacion.controller.js';
import usuarioController from '../controller/usuario.controller.js';

const router = express.Router();

// Rutas para las habitaciones
router.get('/habitaciones', habitacionController.mostrarHabitaciones);
router.get('/habitaciones/:id', habitacionController.mostrarHabitacionPorId);
router.put('/habitaciones/:id', habitacionController.actualizarDisponibilidad);

// Rutas para los usuarios
router.get('/usuarios', usuarioController.mostrarUsuarios);
router.get('/usuarios/:id', usuarioController.mostrarUsuarioPorId);
router.post('/usuarios', usuarioController.agregarUsuario);

export default router;
