import Habitacion from "../models/habitacion.model.js";
import Usuario from "../models/user.model.js";


    const mostrarHabitaciones =async (req,res )=>{
        try {
            res.status (200).send("Hola desde controlador get habitacion");

        } catch (error) {
            res.status (500).json({error: error.message})            
        }
    };

    const mostrarUsuarios =async (req,res )=>{
        try {
                const usuarios = await Usuario.find(); // Busca todos los usuarios en la base de datos
                res.status(200).json(usuarios);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };

    const agregarUsuario = async (req, res) => {
        try {
            const nuevoUsuario = new Usuario(req.body); // Crea un nuevo usuario con los datos del cuerpo de la solicitud
            await nuevoUsuario.save(); // Guarda el usuario en la base de datos
    
            res.status(201).json({
                message: "Usuario agregado exitosamente",
                usuario: nuevoUsuario
            });
        } catch (error) {
            res.status(500).json({ error: error.message }); // Maneja errores y envía respuesta
        }
    };
    const mostrarUsuarioPorId = async (req, res) => {
        try {
            const usuario = await Usuario.findById(req.params.id); // Busca usuario por ID
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const actualizarUsuario = async (req, res) => {
        try {
            const usuarioActualizado = await Usuario.findByIdAndUpdate(
                req.params.id, // ID del usuario que se actualizará
                req.body, // Nuevos datos para el usuario
                { new: true } // Devuelve el documento actualizado
            );
            if (!usuarioActualizado) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json({
                message: "Usuario actualizado exitosamente",
                usuario: usuarioActualizado,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    
    const eliminarUsuario = async (req, res) => {
        try {
            const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id); // Elimina por ID
            if (!usuarioEliminado) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            res.status(200).json({ message: "Usuario eliminado exitosamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    export default{
        mostrarHabitaciones,
        mostrarUsuarios,
        mostrarUsuarioPorId,
        agregarUsuario,
        actualizarUsuario,
        eliminarUsuario
    }