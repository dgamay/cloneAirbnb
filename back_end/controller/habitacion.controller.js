import Habitacion from "../models/habitacion.model.js";

// Mostrar todas las habitaciones disponibles
const mostrarHabitaciones = async (req, res) => {
  try {
    const habitaciones = await Habitacion.find({ disponible: true }); // Solo habitaciones disponibles
    res.status(200).json(habitaciones);
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
    res.status(200).json(habitacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar disponibilidad de una habitación (no se crean nuevas habitaciones)
const actualizarDisponibilidad = async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.id); // Busca la habitación por ID
    if (!habitacion) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    // Cambiar el estado de disponibilidad
    habitacion.disponible = req.body.disponible; // El valor 'disponible' debe venir en el cuerpo de la solicitud
    await habitacion.save(); // Guardar los cambios

    res.status(200).json({
      message: "Disponibilidad de habitación actualizada exitosamente",
      habitacion: habitacion,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  mostrarHabitaciones,
  mostrarHabitacionPorId,
  actualizarDisponibilidad,
};
