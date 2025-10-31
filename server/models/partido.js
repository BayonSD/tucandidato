const mongoose = require('mongoose')

const partidoSchema = new mongoose.Schema({
    nombre: { type: String, required: true},
    slug: { type: String, required: true},
    lista_nomina_texto: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Partido', partidoSchema);