import mongoose from "mongoose";

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    
    nombre: {
        type: String,
        required: true,
    },

    correo: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Por favor ingrese un correo válido'],
    },

    telefono: {
        type: Number,
        required: true,
    },

    comentario: {
        type: String,
        required: true,
    }
});

export default mongoose.model("Usuario", usuarioSchema);