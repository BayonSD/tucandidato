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
  propuestaPDF: { type: String, default: null },
  cvContenido: { type: Object, default: null },
  fuentes: { type: [String], default: [] }
  
}, { 
  timestamps: true,
  strict: false // Permite guardar campos adicionales no definidos
})

export default mongoose.model('Candidato', candidatoSchema)