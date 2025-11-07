import dotenv from "dotenv";
dotenv.config({ path: "./server/.env" }); 

import fs from 'fs'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'
import mongoose from 'mongoose'
import Candidato from '../models/candidato.js'

console.log("📄 Archivo .env cargado desde:", process.cwd());
console.log("🔑 API Key detectada:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 10) + "..." : "❌ No encontrada");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1"
})

async function procesarCV(cvPath, nombreCandidato) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  // Leer archivo como buffer
  const buffer = fs.readFileSync(cvPath)
  const ext = path.extname(cvPath).toLowerCase()
  const mimeType = 'application/pdf'
  const base64 = buffer.toString('base64')

  const prompt = `
Analiza el CV de ${nombreCandidato} contenido en este archivo.
Extrae y estructura la información en las siguientes secciones:
- formación
- experiencia
- logros
- fuentes (si hay referencias, enlaces, bibliografía o sitios mencionados en el CV)
Responde SOLO con JSON válido en este formato:
{
  "formacion": "...",
  "experiencia": ["...", "..."],
  "logros": ["...", "..."],
  "fuentes": ["...", "..."]
}
`

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64
        }
      },
      { text: prompt }
    ])
    const response = await result.response
    const texto = response.text()
    const jsonLimpio = texto.replace(/```json\n?/g, '').replace(/```/g, '').trim()
    return JSON.parse(jsonLimpio)
  } catch (error) {
    console.error(`Error procesando CV de ${nombreCandidato}:`, error)
    return null
  }
}

async function procesarCVsFaltantes() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elecciones_chile_2025')
  console.log('✅ Conectado a MongoDB\n')

  const cvDir = path.join(process.cwd(), 'public', 'cv')

  // Solo los candidatos que faltaron
  const candidatosCV = {
    'kast.pdf': 'JOSE ANTONIO KAST RIST',
    'MEO.pdf': 'MARCO ANTONIO ENRIQUEZ-OMINAMI GUMUCIO',
    'Artes.pdf': 'EDUARDO ANTONIO ARTES BRICHETTI'
  }

  // Cargar todos los presidentes una sola vez
  const presidentes = await Candidato.find({
    $or: [
      { 'Tipo  Eleccion': 'PRESIDENTE' },
      { tipo_eleccion: 'PRESIDENTE' }
    ]
  })

  for (const [archivo, nombreCompleto] of Object.entries(candidatosCV)) {
    console.log(`\n📄 Procesando CV de ${nombreCompleto}...`)
    const cvPath = path.join(cvDir, archivo)

    if (!fs.existsSync(cvPath)) {
      console.log(`⚠️  Archivo no encontrado: ${archivo}`)
      continue
    }

    // Buscar candidato comparando nombre completo
    const candidato = presidentes.find(c => {
      const nombreBD = `${c.Nombre || ''} ${c['Primer  Apellido'] || ''} ${c['Segundo  Apellido'] || ''}`.replace(/\s+/g, ' ').trim().toUpperCase()
      return nombreBD === nombreCompleto
    })

    if (!candidato) {
      console.log(`⚠️  Candidato no encontrado en BD: ${nombreCompleto}`)
      console.log(`   Candidatos disponibles en BD:`)
      presidentes.forEach(p => {
        const nombreBD = `${p.Nombre || ''} ${p['Primer  Apellido'] || ''} ${p['Segundo  Apellido'] || ''}`.replace(/\s+/g, ' ').trim().toUpperCase()
        console.log(`   - ${nombreBD}`)
      })
      continue
    }

    // Procesar CV con Gemini
    const cvContenido = await procesarCV(cvPath, nombreCompleto)

    if (cvContenido) {
      candidato.cvContenido = {
        formacion: cvContenido.formacion || '',
        experiencia: cvContenido.experiencia || [],
        logros: cvContenido.logros || []
      }
      candidato.fuentes = cvContenido.fuentes || []
      await candidato.save()
      console.log(`✅ CV estructurado y fuentes guardadas para ${nombreCompleto}`)
    } else {
      console.log(`❌ Error procesando CV`)
    }

    await new Promise(r => setTimeout(r, 3000))
  }

  console.log('\n🎉 Proceso completado')
  mongoose.disconnect()
}

procesarCVsFaltantes()