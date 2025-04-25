import mongoose from "mongoose";

// Definir el esquema para los usuarios
const usuarioSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true, 
    trim: true  // Elimina espacios al inicio y final del string
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, // No puede haber dos usuarios con el mismo email
    trim: true
  },
  telefono: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Validar que el teléfono tenga 10 dígitos numéricos
      },
      message: props => `${props.value} no es un número de teléfono válido!`
    }
  },
  habitacion_interes: { 
    type: String, 
    enum: ['deluxe', 'compartida'], 
    required: true 
  },
  mensaje: { 
    type: String, 
    required: false 
  },
  fechaRegistro: { 
    type: Date, 
    default: Date.now 
  }
});

// Crear el modelo del usuario basado en el esquema
const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
