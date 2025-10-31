
import mongoose from 'mongoose'

const candidatoSchema = new mongoose.Schema({
  nombre_completo: { type: String, required: true },
  slug: { type: String, required: true },
  sexo: { type: String, required: true },
  tipo_eleccion: { type: String, required: true }, // DIPUTADO, SENADOR, PRESIDENTE, etc.
  region: { type: String, required: true },
  territorio: { type: String, required: true }, // DISTRITO o CIRCUNSCRIPCIÓN
  rango_lista: { type: String },
  lista_nomina: { type: String },
  independiente_asociado: { type: String, default: null },
  partido_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Partido', required: true },
}, { timestamps: true })

export default mongoose.model('Candidato', candidatoSchema)