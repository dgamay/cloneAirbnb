import mongoose from "mongoose";

const Schema = mongoose.Schema;

const habitacionSchema = new Schema ({
    numero:{
        type:Number,
        require: true,
        unique: true,
    },

    capacidad: {
        type:Number,
        enum:[1, 2, 4],
        require: true,
    },

    baño:{
        type:String,
        enum: ['privado','compartido'],
        require: true,
    },
    servicios:{
        type    :String,
        enum    :['desayuno', 'internet','tv','lavanderia','ninguno'],
        require :true,
    },

    precio :{
        type :Number,
        require : true,
    },
    
    fotos :{
        type : [{ type: String }], // Arreglo dinámico para agregar las imagenes de las habitaciones
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