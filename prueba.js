const path = require('path'); // Necesario para manejar rutas de archivos
const mostrarHabitaciones = async (req, res) => {
    try {
        // Buscar habitaciones en la base de datos
        const habitaciones = await Habitacion.find(); // Supongamos que el modelo Habitacion tiene un campo "imagenes"
        
        // Agregar las rutas completas para las imágenes
        const habitacionesConImagenes = habitaciones.map((habitacion) => {
            const imagenesCompletas = habitacion.imagenes.map((imagenPath) => {
                return `${req.protocol}://${req.get('host')}/uploads/${imagenPath}`;
            });

            return {
                ...habitacion._doc, // Extract data from the MongoDB document
                imagenes: imagenesCompletas // Reemplaza las imágenes con las URLs completas
            };
        });

        // Enviar la respuesta con datos y rutas de imágenes
        res.status(200).json(habitacionesConImagenes);

        // Imprimir en consola los números de las habitaciones
        habitacionesConImagenes.forEach((habitacion) => {
            console.log(habitacion.numero); // Suponiendo que "numero" es un campo del modelo Habitacion
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Servir la carpeta "uploads" públicamente
app.use('/uploads', express.static(path.join(__dirname, 'back_end', 'uploads')));

# Abre PowerShell en la carpeta con los archivos

import Habitacion from '../models/habitacion.model.js'; // Importa tu modelo
import fs from 'fs/promises'; // Importa el módulo fs con soporte para promesas (para async/await)
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname LOCALMENTE si esta función está en un archivo controlador
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mostrarHabitaciones = async (req, res) => { // La función debe ser async
    console.log('--- Entrando a mostrarHabitaciones ---');
    try {
        // 1. Obtener todas las habitaciones desde la base de datos
        const habitaciones = await Habitacion.find({});
        console.log('Habitaciones obtenidas de DB (sin formatear):', habitaciones);

        // 2. Obtener la lista de URLs de TODAS las imágenes disponibles en la carpeta uploads
        const directoryPath = path.join(__dirname, "..", "uploads"); // Ajusta esta ruta si la función no está 2 niveles por debajo de 'back_end'
        let imageUrls = [];
        try {
            const files = await fs.readdir(directoryPath); // Lee el contenido de la carpeta de forma asíncrona
            const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file)); // Filtra solo archivos de imagen

            // Construir las URLs completas para todas las imágenes encontradas
            imageUrls = imageFiles.map(file => {
                // Usa req.protocol y req.get('host') para construir la URL base dinámicamente
                // Esto es más robusto que usar localhost:3005 directamente
                return `${req.protocol}://${req.get("host")}/uploads/${file}`;
            });
            console.log('URLs de imágenes disponibles en /uploads:', imageUrls);

        } catch (fsError) {
             console.error("Error leyendo el directorio uploads:", fsError);
             // Si hay un error leyendo la carpeta, imageUrls se quedará como [],
             // lo cual hará que las habitaciones aparezcan sin imagen, lo cual es aceptable.
        }

        // 3. Formatear habitaciones, añadirles el campo 'imageUrl' y formatear el número
        const habitacionesConImagen = habitaciones.map((habitacion) => {
            const habitacionObject = habitacion.toObject(); // Convertir a objeto plano

            // --- Formatear el número de habitación (si sigue siendo Number en DB) ---
            // Esto es necesario para que coincida con el posible nombre de archivo ("001" vs 1)
            let numeroFormateado = null;
            if (habitacionObject.numero != null && typeof habitacionObject.numero === "number") {
                numeroFormateado = habitacionObject.numero.toString().padStart(3, "0");
                habitacionObject.numero = numeroFormateado; // Actualiza el objeto con el número formateado
            } else if (habitacionObject.numero != null) {
                 // Si 'numero' ya es string en la DB (ej: si migraste antes), solo asegúrate de tener el valor
                 numeroFormateado = habitacionObject.numero;
            }
            // ----------------------------------------------------------------------


            // --- ENCONTRAR UNA ÚNICA IMAGEN QUE COINCIDA ---
            let matchedImageUrl = null;
            if (numeroFormateado) {
                // Buscar la primera URL de imagen cuyo nombre de archivo empiece con el número de habitación formateado
                // Esto implementa la convención "se llaman como la habitacion" (ej: "001-principal.jpg", "001.png")
                matchedImageUrl = imageUrls.find(url => {
                    // Extraer solo el nombre del archivo de la URL completa
                    const fileName = url.split('/').pop();
                    // Verificar si el nombre del archivo existe y comienza con el número formateado
                    return fileName && fileName.startsWith(numeroFormateado);
                });

                // Si la búsqueda por 'startsWith' no encontró nada,
                // puedes intentar una coincidencia exacta para extensiones comunes (ej: "001.jpg", "001.png")
                 if (!matchedImageUrl) {
                     matchedImageUrl = imageUrls.find(url => {
                       const fileName = url.split('/').pop();
                       return fileName && (
                           fileName === `${numeroFormateado}.jpg` ||
                           fileName === `${numeroFormateado}.png` ||
                            fileName === `${numeroFormateado}.gif` || // Agrega otras extensiones si es necesario
                            fileName === `${numeroFormateado}.jpeg` ||
                            fileName === `${numeroFormateado}.webp`
                       );
                   });
                 }
            }

            // Añadir la URL de la imagen encontrada (o null si no se encontró ninguna coincidencia)
            // al objeto de la habitación, bajo un nuevo campo (ej: 'imageUrl')
            habitacionObject.imageUrl = matchedImageUrl || null; // Usa null o una URL a una imagen por defecto si quieres mostrar algo siempre

            // Si tenías un campo 'imagen' en el esquema antes que era un array, y ya no lo necesitas o confunde, puedes eliminarlo del objeto que envías:
            // delete habitacionObject.imagen;

            return habitacionObject; // Devolver el objeto de la habitación con la URL de imagen añadida
        });

        console.log('Habitaciones DESPUÉS del formateo y con imageUrl:', habitacionesConImagen); // VERIFICA ESTO!

        // 4. Enviar la respuesta al cliente
        res.status(200).json(habitacionesConImagen);

        // Ya no necesitas este log individual aquí
        // habitacionesConImagen.forEach((habitacion) => {
        //   console.log("Habitación enviada:", habitacion.numero, habitacion.imageUrl);
        // });

    } catch (error) {
        console.error("Error general en mostrarHabitaciones:", error); // Loggea el error completo del servidor
        res.status(500).json({ error: 'Error interno del servidor al obtener habitaciones' }); // Envía una respuesta de error genérica al cliente
    }
};

// Asegúrate de exportar esta función si está en un archivo de módulo
// export const mostrarHabitaciones = ... ;