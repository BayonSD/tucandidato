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

// Lista de categorías
const categorias = [
  "Agricultura", "Cultura", "Deporte", "Descentralización", "Economía / Crecimiento",
  "Educación", "Empleo y Trabajo", "Energía", "Igualdad y Género", "Infraestructura",
  "Innovación Social", "Innovación y Ciencia", "Integridad / Anticorrupción", "Justicia",
  "Medio Ambiente", "Migración", "Participación Ciudadana", "Pensiones", "Pueblos Originarios",
  "Recursos Hídricos", "Reducción de Pobreza", "Reforma Tributaria", "Relaciones Exteriores",
  "Salud", "Seguridad Pública", "Sistema Penitenciario", "Transformación Digital",
  "Transporte", "Turismo", "Vivienda"
];

async function procesarPropuestas(pdfPath, nombreCandidato) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  // Leer archivo como buffer
  const buffer = fs.readFileSync(pdfPath)
  const mimeType = 'application/pdf'
  const base64 = buffer.toString('base64')

  const prompt = `
Analiza el siguiente PDF de propuestas de gobierno de ${nombreCandidato}.
Clasifica y extrae las propuestas en las siguientes categorías:

${categorias.map(c => `- ${c}`).join('\n')}

Para cada categoría, devuelve un array de strings donde cada string es una propuesta concreta, clara y breve.
Si una categoría no tiene propuestas, devuelve un array vacío [].
Máximo 7 propuestas por categoría.

Responde SOLO con JSON válido en este formato:
{
  "Agricultura": ["propuesta 1...", "propuesta 2..."],
  "Cultura": ["propuesta 1...", "propuesta 2..."],
  "Deporte": [],
  "Descentralización": ["propuesta 1..."],
  ...
}

IMPORTANTE: Asegúrate de incluir TODAS las categorías en el JSON, incluso si están vacías.
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
    console.error(`Error procesando propuestas de ${nombreCandidato}:`, error)
    return null
  }
}

async function procesarPropuestasCandidatos() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elecciones_chile_2025')
  console.log('✅ Conectado a MongoDB\n')

  const propuestasDir = path.join(process.cwd(), 'public', 'propuestas')

  // Cargar todos los presidentes
  const presidentes = await Candidato.find({
    $or: [
      { 'Tipo  Eleccion': 'PRESIDENTE' },
      { tipo_eleccion: 'PRESIDENTE' }
    ]
  })

  for (const candidato of presidentes) {
    const nombreCompleto = `${candidato.Nombre || ''} ${candidato['Primer  Apellido'] || ''} ${candidato['Segundo  Apellido'] || ''}`.replace(/\s+/g, ' ').trim().toUpperCase()
    const pdfFile = candidato.propuestaPDF ? path.basename(candidato.propuestaPDF) : null
    
    if (!pdfFile) {
      console.log(`⚠️  Sin PDF de propuestas para: ${nombreCompleto}`)
      continue
    }

    const pdfPath = path.join(propuestasDir, pdfFile)
    if (!fs.existsSync(pdfPath)) {
      console.log(`⚠️  PDF no encontrado: ${pdfFile} para ${nombreCompleto}`)
      continue
    }

    console.log(`\n📄 Procesando propuestas de ${nombreCompleto}...`)

    // Procesar propuestas con Gemini
    const propuestas = await procesarPropuestas(pdfPath, nombreCompleto)

    if (propuestas) {
      // Asegurarse de que todas las categorías estén presentes
      const propuestasCompletas = {}
      categorias.forEach(cat => {
        propuestasCompletas[cat] = propuestas[cat] || []
      })
      
      candidato.propuestas = propuestasCompletas
      await candidato.save()
      console.log(`✅ Propuestas guardadas para ${nombreCompleto}`)
      
      // Mostrar resumen
      const totalPropuestas = Object.values(propuestasCompletas).reduce((sum, arr) => sum + arr.length, 0)
      console.log(`   📊 Total de propuestas extraídas: ${totalPropuestas}`)
    } else {
      console.log(`❌ Error procesando propuestas`)
    }

    // Esperar 3 segundos entre peticiones
    await new Promise(r => setTimeout(r, 3000))
  }

  console.log('\n🎉 Proceso completado')
  mongoose.disconnect()
}

procesarPropuestasCandidatos()