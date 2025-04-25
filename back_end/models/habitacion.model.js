import mongoose from "mongoose";

// Definir el esquema para las habitaciones
const habitacionSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true, 
    trim: true  // Elimina espacios al inicio y final del string
  },
  tipo: { 
    type: String, 
    enum: ['deluxe', 'compartida'], // Solo se permiten estos valores
    required: true 
  },
  precio: { 
    type: Number, 
    required: true 
  },
  disponible: { 
    type: Boolean, 
    default: true // Por defecto, las habitaciones están disponibles
  },
  descripcion: { 
    type: String, 
    required: false 
  },
  imagen: { 
    type: String, 
    required: false 
  }, 
  // Otros campos que puedas necesitar, como la ubicación, capacidad, etc.
});

// Crear el modelo de la habitación basado en el esquema
const Habitacion = mongoose.model("Habitacion", habitacionSchema);

export default Habitacion;
