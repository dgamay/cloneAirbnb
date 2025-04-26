import Habitacion from "../models/habitacion.model.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Definir __dirname en un entorno ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const listarImagenes= (req, res) => {
    const directoryPath = path.join(__dirname, '..', 'uploads'); // Ruta absoluta de la carpeta
    console.log(directoryPath);
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'No se pudieron listar las imágenes' });
        }
        // Filtrar solo los archivos que son imágenes (opcional)
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.status(200).json({ images: imageFiles });
    });
};

// Mostrar todas las habitaciones disponibles
const mostrarHabitaciones = async (req, res) => {
  try {
    const habitaciones = await Habitacion.find({ disponible: true }); // Solo habitaciones disponibles
    const habitacionesConImagen = habitaciones.map(habitacion => ({
      ...habitacion.toObject(),
      imagenUrl: `/uploads/${habitacion.imagen}` // Genera la URL de la imagen
    }));
    res.status(200).json(habitacionesConImagen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mostrar una habitación por su ID
const mostrarHabitacionPorId = async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.id); // Busca habitación por ID
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    const habitacionConImagen = {
      ...habitacion.toObject(),
      imagenUrl: `/uploads/${habitacion.imagen}` // Genera la URL de la imagen
    };

    res.status(200).json(habitacionConImagen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar la disponibilidad de una habitación
const actualizarDisponibilidad = async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.id); // Busca la habitación por ID
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    // Actualizar el estado de disponibilidad
    habitacion.disponible = req.body.disponible; // Se espera un valor booleano en el cuerpo de la solicitud
    await habitacion.save(); // Guardar los cambios en la base de datos

    res.status(200).json({
      message: "Disponibilidad de habitación actualizada exitosamente",
      habitacion: habitacion,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  listarImagenes,
  mostrarHabitaciones,
  mostrarHabitacionPorId,
  actualizarDisponibilidad, // Asegúrate de exportarlo
};
