import Habitacion from "../models/airbnb.model.js";


    const getHabitacion =async (req,res )=>{
        try {
            res.status (200).send("Hola desde controlador get habitacion");

        } catch (error) {
            res.status (500).json({error: error.message})            
        }
    }