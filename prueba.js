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