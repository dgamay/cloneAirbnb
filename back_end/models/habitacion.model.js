import mongoose from "mongoose";

const Schema = mongoose.Schema;

const habitacionSchema = new Schema ({
    numero:{
        type:Number,
        require: true,
        unique: true,
    },
    
    tipo:{
        type:String,
        enum: ['Deluxe','compartida'],
        require: true,
    },

    precio :{
        type :Number,
        require : true,
    },
    
    imageUrl :{
        type    : String, // Arreglo dinámico para agregar las imagenes de las habitaciones
        require : true
    }

});

export default mongoose.model("Habitacione", habitacionSchema)

/* - nombre de la habitación
- capacidad (cantidad de personas por habitación)
- baño (privado o compartido)
- servicios incluidos (desayuno, internet, tv, lavandería)
- precio
- foto principal
- fotos auxiliares */