import 'dotenv/config'
import mongoose from 'mongoose'
import Candidato from '../models/candidato.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elecciones_chile_2025'

// Mapea el nombre completo al archivo de imagen correspondiente
const fotosPresidentes = {
  'JEANNETTE JARA ROMAN': 'Jara.webp',
  'JOSE ANTONIO KAST RIST': 'Kast.png',
  'EVELYN MATTHEI FORNET': 'Mattei.png',
  'JOHANNES KAISER BARENTS-VON HOHENHAGEN': 'Kaiser.webp',
  'FRANCO PARISI FERNANDEZ': 'Parisi.png',
  'HAROLD MAYNE-NICHOLLS SECUL': 'Harold.jpg',
  'MARCO ANTONIO ENRIQUEZ-OMINAMI GUMUCIO': 'Meo.jpg',
  'EDUARDO ANTONIO ARTES BRICHETTI': 'Artes.jpg'
}

function normalizarNombre(nombre, apellido1, apellido2) {
  return `${nombre} ${apellido1} ${apellido2}`.replace(/\s+/g, ' ').trim().toUpperCase()
}

async function asociarFotos() {
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

    let archivoFoto = fotosPresidentes[nombreCompleto]
    if (archivoFoto) {
      candidato.fotoUrl = `/presidentes/${archivoFoto}`
      await candidato.save()
      console.log(`✅ Asociada foto a ${nombreCompleto}`)
    } else {
      console.log(`⚠️ No se encontró foto para: ${nombreCompleto}`)
    }
  }

  mongoose.disconnect()
  console.log('\n🎉 Proceso completado')
}

asociarFotos()