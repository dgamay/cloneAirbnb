import fs from 'fs/promises'; // <-- ¡Importa 'fs/promises' para usar await!
import path from "path";
import { fileURLToPath } from "url";
import Habitacion from "../models/habitacion.model.js";
import Usuario from "../models/user.model.js";
//import fs from "fs";
// Definir __dirname en un entorno ESModule
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listarImagenes = (req, res) => {
  const directoryPath = path.join(__dirname, "..", "uploads"); // Ruta absoluta de la carpeta
  console.log(directoryPath);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "No se pudieron listar las imágenes" });
    }

    // Filtrar solo los archivos que son imágenes (opcional)
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    // Generar rutas completas de cada imagen
    const imagePaths = imageFiles.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/${file}`;
    });

    res.status(200).json({ images: imagePaths });
  });
};

const mostrarHabitaciones = async (req, res) => {
  console.log('--- Entrando a mostrarHabitaciones (Depurando búsqueda de imagen) ---');
  try {
      const habitaciones = await Habitacion.find({});
      console.log('Habitaciones obtenidas de DB (sin formatear):', habitaciones);

      const directoryPath = path.join(__dirname, "..", "uploads");
      let allImageUrls = [];
      try {
          const files = await fs.readdir(directoryPath);
          const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file));

          allImageUrls = imageFiles.map(file => {
              return `${req.protocol}://${req.get("host")}/uploads/${file}`;
          });
          console.log('URLs de imágenes DISPONIBLES generadas (verificar si incluye 003.jpg):', allImageUrls); // <-- ¡VERIFICA ESTO!

      } catch (fsError) {
           console.error("Error leyendo el directorio uploads:", fsError);
      }

      const habitacionesConImagen = habitaciones.map((habitacion) => {
          const habitacionObject = habitacion.toObject();

          let numeroParaBusqueda = null;
          if (habitacionObject.numero != null) {
               if (typeof habitacionObject.numero === "number") {
                   numeroParaBusqueda = habitacionObject.numero.toString().padStart(3, "0");
               } else if (typeof habitacionObject.numero === "string") {
                    numeroParaBusqueda = habitacionObject.numero.padStart(3, "0");
               }
          }
           if (numeroParaBusqueda) {
               habitacionObject.numero = numeroParaBusqueda;
           }

          // --- Depurando la búsqueda para habitación 3 ---
          if (numeroParaBusqueda === "003") { // <-- Agrega este IF para depurar solo la habitación 3
               console.log(`--- Procesando habitación ${numeroParaBusqueda} ---`);
               console.log("Número para búsqueda (formateado):", numeroParaBusqueda); // ¿Es "003"?
               console.log("Lista completa de URLs de imágenes:", allImageUrls); // ¿Aparece http://.../uploads/003.jpg aquí?

               const fileNameCheck = '003.jpg'; // Asumiendo que el archivo es 003.jpg
               const isFileInList = allImageUrls.some(url => url.endsWith('/' + fileNameCheck));
               console.log(`¿El archivo ${fileNameCheck} está en la lista de URLs generadas?`, isFileInList); // ¿Aparece como TRUE?

               // Ahora la búsqueda find...
               const foundUrl = allImageUrls.find(url => {
                   const fileName = url.split('/').pop();
                   // Verifica la condición exacta de búsqueda
                   const isMatchStartsWith = fileName && fileName.startsWith(numeroParaBusqueda);
                   const isMatchExact = fileName && (fileName === `${numeroParaBusqueda}.jpg` || fileName === `${numeroParaBusqueda}.png` || fileName === `${numeroParaBusqueda}.gif` || fileName === `${numeroParaBusqueda}.jpeg` || fileName === `${numeroParaBusqueda}.webp`); // Verifica coincidencias exactas

                   if (numeroParaBusqueda === "003") { // Logs detallados solo para 003
                        console.log(`  - Comparando ${fileName} con ${numeroParaBusqueda}: startsWith=${isMatchStartsWith}, exact=${isMatchExact}`);
                   }

                   return isMatchStartsWith || isMatchExact; // Condición de búsqueda original
               });

               console.log("Resultado de la búsqueda para habitación 003:", foundUrl); // ¿Es la URL esperada o null?
               habitacionObject.imageUrl = foundUrl || null; // Asigna el resultado de la búsqueda

          } else { // --- Lógica de búsqueda normal para otras habitaciones ---
               let matchedImageUrl = null;
               if (numeroParaBusqueda) {
                    matchedImageUrl = allImageUrls.find(url => {
                        const fileName = url.split('/').pop();
                        return fileName && (
                            fileName.startsWith(numeroParaBusqueda) ||
                            fileName === `${numeroParaBusqueda}.jpg` || // Considera agregar estas coincidencias exactas si no estaban antes
                            fileName === `${numeroParaBusqueda}.png` ||
                             fileName === `${numeroParaBusqueda}.gif` ||
                             fileName === `${numeroParaBusqueda}.jpeg` ||
                             fileName === `${numeroParaBusqueda}.webp`
                         );
                     });
                }
                habitacionObject.imageUrl = matchedImageUrl || null;
          }
          // -------------------------------------------------------------

          // delete habitacionObject.imagen; // Eliminar si ya no se usa

          return habitacionObject;
      });

      console.log('Habitaciones preparadas para enviar (con imageUrl dinámico):', habitacionesConImagen);

      res.status(200).json(habitacionesConImagen);

  } catch (error) {
      console.error("Error general en mostrarHabitaciones:", error);
      res.status(500).json({ error: 'Error interno del servidor.' });
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
