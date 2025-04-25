import Usuario from "../models/user.model.js";

// Mostrar todos los usuarios
const mostrarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // Busca todos los usuarios en la base de datos
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mostrar un usuario por su ID
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

// Crear un nuevo usuario desde el formulario
const agregarUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body); // Crea un nuevo usuario con los datos del formulario
    await nuevoUsuario.save(); // Guarda el usuario en la base de datos

    res.status(201).json({
      message: "Usuario agregado exitosamente",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  mostrarUsuarios,
  mostrarUsuarioPorId,
  agregarUsuario,
};
