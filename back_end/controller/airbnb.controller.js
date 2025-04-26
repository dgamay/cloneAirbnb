import Habitacion from "../models/habitacion.model.js";
import Usuario from "../models/user.model.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Definir __dirname en un entorno ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const listarImagenes = (req, res) => {
  const directoryPath = path.join(__dirname, '..', 'uploads'); // Ruta absoluta de la carpeta
  console.log(directoryPath);

  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          return res.status(500).json({ error: 'No se pudieron listar las imágenes' });
      }

      // Filtrar solo los archivos que son imágenes (opcional)
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

      // Generar rutas completas de cada imagen
      const imagePaths = imageFiles.map(file => {
          return `${req.protocol}://${req.get('host')}/uploads/${file}`;
      });

      res.status(200).json({ images: imagePaths });
  });
};

const mostrarHabitaciones = async (req, res) => {
  try {
    const habitaciones = await Habitacion.find(); // Busca todos los usuarios en la base de datos
    res.status(200).json(habitaciones);
    habitaciones.forEach((habitacion) => {
      console.log(habitacion.numero); // Imprime el nombre de cada usuario
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearHabitacion = async (req, res) => {
  try {
    const nuevaHabitacion = new Habitacion(req.body); // Crea una nueva habitación con los datos recibidos
    await nuevaHabitacion.save(); // Guarda la habitación en la base de datos

    res.status(201).json({
      message: "Habitación creada exitosamente",
      habitacion: nuevaHabitacion,
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Maneja errores y envía respuesta
  }
};

const mostrarHabitcionPorId = async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.id); // Busca habitacion por ID
    if (!habitacion) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(habitacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarHabitacion = async (req, res) => {
  try {
    const habitacionActualizado = await Habitacion.findByIdAndUpdate(
      req.params.id, // ID del usuario que se actualizará
      req.body, // Nuevos datos para el usuario
      { new: true } // Devuelve el documento actualizado
    );
    if (!habitacionActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({
      message: "Usuario actualizado exitosamente",
      habitacion: habitaciActualizado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarHabitacion = async (req, res) => {
  try {
    const habitcionEliminada = await Habitacion.findByIdAndDelete(
      req.params.id
    ); // Elimina por ID
    if (!habitcionEliminada) {
      return res.status(404).json({ message: "Habitacio no encontrado" });
    }
    res.status(200).json({ message: "Habitacio eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const mostrarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // Busca todos los usuarios en la base de datos
    res.status(200).json(usuarios);
    usuarios.forEach((usuario) => {
      console.log(usuario.nombre, usuario.correo); // Imprime el nombre de cada usuario
    });
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
      usuario: nuevoUsuario,
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

export default {
  listarImagenes,
  mostrarHabitaciones,
  mostrarHabitcionPorId,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion,
  mostrarUsuarios,
  mostrarUsuarioPorId,
  agregarUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
