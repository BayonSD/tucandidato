const mongoose = require('mongoose')

const territorioSchema = new mongoose.Schema({
    nombre_territorio: { type: String, required: true},
    tipo: { type: String, required: true},
    region: { type: String, required: true},
    comunas: [{ type: String, required: true }],
}, { timestamps: true});

module.exports = mongoose.model('Territorio', territorioSchema);