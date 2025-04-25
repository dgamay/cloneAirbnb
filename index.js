import express from "express"; // Importa la librería Express para crear y gestionar el servidor y las rutas
import dotenv from"dotenv"; // Importa la librería dotenv para cargar variables de entorno desde un archivo .env
import mongoose from "mongoose"; // Importa la librería Mongoose para interactuar con la base de datos MongoDB
import airbnbRoutes from "./back_end/routes/airbnb.routes.js"
import multer from "multer";
import router from "./back_end/controller/airbnb.controller.js"; // Ajusta la ruta según tu proyecto



dotenv.config(); // Carga las variables de entorno desde el archivo .env
const app=express(); // Crea una instancia de la aplicación Express
const PORT =(process.env.PORT|| 3000); // Define el puerto del servidor, utilizando la variable de entorno PORT o 3000 como valor por defecto


app.set("port",PORT); // Establece el puerto que la aplicación Express utilizará
app.use(express.json()); // Habilita el middleware para analizar cuerpos de solicitud JSON
app.use("/api",airbnbRoutes); // Monta las rutas relacionadas con airbnb bajo el prefijo "/api/habitacion"
app.use('/uploads', express.static('uploads'));// para servir la carpeta uploads de forma pública


// Ruta de ejemplo para la raíz del servidor
app.get("/",(req,res)=> {
    console.log("hola entrenador"); // Imprime un mensaje en la consola del servidor
    res.send('Hola entrenador1'); // Envía la respuesta 'Hola entrenador1' al cliente que accede a la raíz
});

 

/* ########################  METODOS DE CARGA DE IMAGENES ######################################*/

// Configuración de multer para controlar el almacenamiento de archivos en el servidor
const storage = multer.diskStorage({
    // Define la carpeta de destino donde se almacenarán los archivos
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Los archivos serán guardados en la carpeta "uploads"
    },
    // Define el nombre único de cada archivo almacenado
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // El nombre del archivo incluirá un timestamp y su nombre original
    },
});

// Configuración avanzada de multer para limitar el tamaño del archivo y validar su tipo
const upload = multer({
    storage, // Utiliza la configuración de almacenamiento definida anteriormente
    limits: { fileSize: 2 * 1024 * 1024 }, // Establece un límite de tamaño para los archivos (2 MB como máximo)
    fileFilter: (req, file, cb) => {
        // Validación del tipo de archivo: solo se aceptan imágenes
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // Acepta el archivo si es una imagen
        } else {
            cb(new Error('Solo se permiten imágenes'), false); // Rechaza el archivo si no es una imagen
        }
    },
});

// Ruta para manejar la carga de archivos
app.post('/upload', upload.single('imagen'), (req, res) => {
    // Imprime la información del archivo cargado en la consola
    console.log(req.file);
    // Responde al cliente con un mensaje de éxito y detalles sobre el archivo cargado
    res.status(200).json({
        message: "Imagen cargada exitosamente", // Mensaje de éxito
        file: req.file, // Incluye información detallada del archivo en la respuesta
    });
});

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI) // Intenta conectar a la base de datos MongoDB utilizando la URI definida en las variables de entorno
.then(()=>console.log("CONECTADO A LA DB")) // Se ejecuta si la conexión a la base de datos es exitosa
.catch((Error)=> console.error("ERROR AL CONECTAR A LA DB:", Error)); // Se ejecuta si ocurre un error durante la conexión a la base de datos

// Inicio del servidor Express
app.listen(PORT,()=>{ // Inicia el servidor y lo hace escuchar en el puerto especificado
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app; // Exporta `app` para que esté disponible en otros archivos
