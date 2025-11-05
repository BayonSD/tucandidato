import 'dotenv/config'
import mongoose from 'mongoose'
import Candidato from '../models/candidato.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elecciones_chile_2025'

const propuestasPDF = {
  'JEANNETTE JARA ROMAN': 'jara.pdf',
  'JOSE ANTONIO KAST RIST': 'kast.pdf',
  'EVELYN MATTHEI FORNET': 'matthei.pdf',
  'JOHANNES KAISER BARENTS-VON HOHENHAGEN': 'kaiser.pdf',
  'FRANCO PARISI FERNANDEZ': 'parisi.pdf',
  'HAROLD MAYNE-NICHOLLS SECUL': 'mayne-nicholls.pdf',
  'MARCO ANTONIO ENRIQUEZ-OMINAMI GUMUCIO': 'enriquez-ominami.pdf',
  'EDUARDO ANTONIO ARTES BRICHETTI': 'artes.pdf'
}

function normalizarNombre(nombre, apellido1, apellido2) {
  return `${nombre} ${apellido1} ${apellido2}`.replace(/\s+/g, ' ').trim().toUpperCase()
}

async function asociarPropuestas() {
  await mongoose.connect(MONGO_URI)
  console.log('✅ Conectado a MongoDB\n')

  const presidentes = await Candidato.find({
    $or: [
      { 'Tipo  Eleccion': 'PRESIDENTE' },
      { tipo_eleccion: 'PRESIDENTE' }
    ]
  })

  for (const candidato of presidentes) {
    const nombre = candidato.Nombre || ''
    const apellido1 = candidato['Primer  Apellido'] || ''
    const apellido2 = candidato['Segundo  Apellido'] || ''
    const nombreCompleto = normalizarNombre(nombre, apellido1, apellido2)

    let archivoPDF = propuestasPDF[nombreCompleto]
    if (archivoPDF) {
      candidato.propuestaPDF = `/propuestas/${archivoPDF}`
      await candidato.save()
      console.log(`✅ Asociado PDF a ${nombreCompleto}`)
    } else {
      console.log(`⚠️ No se encontró PDF para: ${nombreCompleto}`)
    }
  }

  mongoose.disconnect()
  console.log('\n🎉 Proceso completado')
}

asociarPropuestas()