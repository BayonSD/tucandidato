
import mongoose from 'mongoose'

const candidatoSchema = new mongoose.Schema({
  // Campos opcionales en formato snake_case (para compatibilidad futura)
  nombre_completo: { type: String, required: false },
  slug: { type: String, required: false },
  sexo: { type: String, required: false },
  tipo_eleccion: { type: String, required: false }, // DIPUTADO, SENADOR, PRESIDENTE, etc.
  region: { type: String, required: false },
  territorio: { type: String, required: false }, // DISTRITO o CIRCUNSCRIPCIÓN
  rango_lista: { type: String },
  lista_nomina: { type: String },
  independiente_asociado: { type: String, default: null },
  partido_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Partido', required: false },
  
  // Campos adicionales que permiten los nombres con espacios de MongoDB
  descripcion_auto: { type: String, default: null },
  fotoUrl: { type: String },
}, { 
  timestamps: true,
  strict: false // Permite campos adicionales no definidos en el esquema (como "Tipo  Eleccion", "Nombre", etc.)
})

export default mongoose.model('Candidato', candidatoSchema)