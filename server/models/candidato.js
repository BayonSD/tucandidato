import mongoose from 'mongoose'

const categoriasPropuestas = {
  "Agricultura": "",
  "Cultura": "",
  "Deporte": "",
  "Descentralización": "",
  "Economía / Crecimiento": "",
  "Educación": "",
  "Empleo y Trabajo": "",
  "Energía": "",
  "Igualdad y Género": "",
  "Infraestructura": "",
  "Innovación Social": "",
  "Innovación y Ciencia": "",
  "Integridad / Anticorrupción": "",
  "Justicia": "",
  "Medio Ambiente": "",
  "Migración": "",
  "Participación Ciudadana": "",
  "Pensiones": "",
  "Pueblos Originarios": "",
  "Recursos Hídricos": "",
  "Reducción de Pobreza": "",
  "Reforma Tributaria": "",
  "Relaciones Exteriores": "",
  "Salud": "",
  "Seguridad Pública": "",
  "Sistema Penitenciario": "",
  "Transformación Digital": "",
  "Transporte": "",
  "Turismo": "",
  "Vivienda": ""
}

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
  fuentes: { type: [String], default: [] },

  propuestas: { type: Object, default: categoriasPropuestas }
  
}, { 
  timestamps: true,
  strict: false // Permite guardar campos adicionales no definidos
})

export default mongoose.model('Candidato', candidatoSchema)