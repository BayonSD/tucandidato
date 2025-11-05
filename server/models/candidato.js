import mongoose from 'mongoose'

const candidatoSchema = new mongoose.Schema({
  // Ejemplo de campos principales (ajusta según tu estructura real)
  Nombre: String,
  'Primer  Apellido': String,
  'Segundo  Apellido': String,
  Sexo: String,
  Rango: String,
  'Tipo  Eleccion': String,
  'Territorio  Electoral': String,
  'Lista/Nómina': String,
  'Nombre  Partido': String,
  'Región': String,
  descripcion_auto: { type: String, default: null },
  fotoUrl: { type: String, default: null },

  // Campo para la propuesta de gobierno (PDF)
  propuestaPDF: { type: String, default: null }
}, { 
  timestamps: true,
  strict: false // Permite guardar campos adicionales no definidos
})

export default mongoose.model('Candidato', candidatoSchema)