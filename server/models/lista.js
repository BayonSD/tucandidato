import mongoose from 'mongoose'

const listaSchema = new mongoose.Schema({
    lista: { type: String, required: true },
    partidos: [{ type: String, required: true }]
}, { timestamps: true })

export default mongoose.model('Lista', listaSchema, 'listas')