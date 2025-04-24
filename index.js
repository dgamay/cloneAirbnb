import express from "express"; // Importa la librería Express para crear y gestionar el servidor y las rutas
import dotenv from"dotenv"; // Importa la librería dotenv para cargar variables de entorno desde un archivo .env
import mongoose from "mongoose"; // Importa la librería Mongoose para interactuar con la base de datos MongoDB
import airbnbRoutes from "./back_end/routes/airbnb.routes.js"

dotenv.config(); // Carga las variables de entorno desde el archivo .env
const app=express(); // Crea una instancia de la aplicación Express
const PORT =(process.env.PORT|| 3000); // Define el puerto del servidor, utilizando la variable de entorno PORT o 3000 como valor por defecto

app.set("port",PORT); // Establece el puerto que la aplicación Express utilizará
app.use(express.json()); // Habilita el middleware para analizar cuerpos de solicitud JSON
app.use("/api",airbnbRoutes); // Monta las rutas relacionadas con airbnb bajo el prefijo "/api/habitacion"

// Ruta de ejemplo para la raíz del servidor
app.get("/",(req,res)=> {
    console.log("hola entrenador"); // Imprime un mensaje en la consola del servidor
    res.send('Hola entrenador1'); // Envía la respuesta 'Hola entrenador1' al cliente que accede a la raíz
});

// Conexión a la base de datos MongoDB
mongoose.connect(process.env.MONGO_URI) // Intenta conectar a la base de datos MongoDB utilizando la URI definida en las variables de entorno
.then(()=>console.log("CONECTADO A LA DB")) // Se ejecuta si la conexión a la base de datos es exitosa
.catch((Error)=> console.error("ERROR AL CONECTAR A LA DB:", Error)); // Se ejecuta si ocurre un error durante la conexión a la base de datos

// Inicio del servidor Express
app.listen(PORT,()=>{ // Inicia el servidor y lo hace escuchar en el puerto especificado
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});