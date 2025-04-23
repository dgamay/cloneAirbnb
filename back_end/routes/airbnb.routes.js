import express  from "express";

import habitacionController from "../controller/airbnb.controller.js";

const router = express.Router();
 router.get ("/", habitacionController.mostrarHabitaciones);

 export default router;