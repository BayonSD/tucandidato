<template>
  <div class="quienes-container">
    <section class="content-card quienes-somos">
      <h2>🗳️ ¿Quiénes Somos?</h2>
      <p>
        TuCandidato nació de una necesidad real y personal: no saber con claridad por quién votar en las próximas elecciones, ni contar con una fuente confiable para conocer a los candidatos de mi zona (San Bernardo). En medio de tanta información dispersa y, a veces, poco transparente, decidí crear una herramienta que reuniera toda la información electoral en un solo lugar, de forma accesible, objetiva y fácil de entender.
      </p>
      <p>
        Este proyecto fue desarrollado de manera independiente y autogestionada, sin financiamiento ni vínculos con partidos políticos, medios o instituciones. Todo el trabajo —desde la recopilación de datos hasta la programación y el diseño del sitio— lo realicé personalmente, con el compromiso de que la información publicada sea transparente, verificable y sin manipulación.
      </p>
      <p>
        El objetivo principal de TuCandidato es facilitar el acceso a la información pública sobre quienes aspiran a cargos de elección popular. Queremos que cualquier persona, sin importar su nivel de conocimiento político o tecnológico, pueda conocer quiénes son los candidatos, qué representan, cuáles son sus trayectorias y qué proponen para el país.
      </p>
      <p>
        A través de esta plataforma, los usuarios pueden explorar perfiles, comparar propuestas y acceder a noticias recientes provenientes de diversas fuentes, abarcando distintos enfoques y corrientes de opinión. La idea es fomentar una mirada crítica e informada, permitiendo que cada ciudadano forme su propia opinión con base en hechos y no en sesgos.
      </p>
      <p>
        Además, uno de los pilares del proyecto es la accesibilidad. Se ha puesto especial cuidado en que el sitio sea funcional para todos los públicos, adaptado a diferentes dispositivos y pensado para personas con distintas capacidades. La información política debe ser un derecho ciudadano, no un privilegio de unos pocos.
      </p>
      <p>
        Creemos que una democracia fuerte se construye con información clara y accesible. Por eso, TuCandidato busca ser un aporte ciudadano, una herramienta de consulta útil y transparente que promueva la participación informada y consciente en cada proceso electoral.
      </p>
    </section>

    <section class="content-card como-armamos">
      <h2>¿Cómo se armó la base de datos?</h2>
      <p>
        La base de datos se creó a partir de los archivos Excel publicados por el <strong>Servel</strong>, que recopilan los candidatos inscritos y los territorios electorales. Los archivos utilizados están en la carpeta <code>public</code> del proyecto:
      </p>
      <ul>
        <li><code>public/candidatos_inscritos_2025.xlsx</code> – Listado oficial de candidatos</li>
        <li><code>public/Territorios Electorales.xlsx</code> – Distritos, comunas y circunscripciones</li>
      </ul>
      <p>
        Para importar los datos y armar la base de datos, utilicé los siguientes scripts:
      </p>

      <div class="code-block">
        <div class="code-title">importar_datos.js</div>
        <pre><code>import xlsx from 'xlsx'
import mongoose from 'mongoose'
import Candidato from './server/models/candidato.js'

// --- Configuración ---
const archivoExcel = './public/candidatos_inscritos_2025.xlsx'
const mongoURI = 'mongodb://127.0.0.1:27017/elecciones_chile_2025'

async function importarDatos() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(mongoURI)
    console.log('✅ Conectado a MongoDB')

    // Leer el archivo Excel
    const workbook = xlsx.readFile(archivoExcel)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet)

    console.log(`📄 Registros encontrados: ${data.length}`)

    // Insertar en MongoDB
    await Candidato.insertMany(data)
    console.log('✅ Datos importados exitosamente')

    mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error:', error)
    mongoose.disconnect()
  }
}

importarDatos()</code></pre>
      </div>

      <div class="code-block">
        <div class="code-title">importar_territorios.js</div>
        <pre><code>import xlsx from 'xlsx'
import mongoose from 'mongoose'
import Territorio from './server/models/territorio.js'

// --- Configuración ---
const archivoExcel = './public/Territorios Electorales.xlsx'
const mongoURI = 'mongodb://127.0.0.1:27017/elecciones_chile_2025'

async function importarTerritorios() {
  try {
    await mongoose.connect(mongoURI)
    console.log('✅ Conectado a MongoDB')

    const workbook = xlsx.readFile(archivoExcel)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet)

    console.log(`📄 Territorios encontrados: ${data.length}`)

    await Territorio.insertMany(data)
    console.log('✅ Territorios importados exitosamente')

    mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error:', error)
    mongoose.disconnect()
  }
}

importarTerritorios()</code></pre>
      </div>

      <div class="code-block">
        <div class="code-title">mongodbshell.js</div>
        <pre><code>// Actualiza territorios para DIPUTADOS
db.candidatos.updateMany(
  { "Tipo  Eleccion": "DIPUTADO" },
  [{
    $lookup: {
      from: "territorios",
      localField: "Territorio  Electoral",
      foreignField: "Distrito",
      as: "territorio_info"
    }
  },
  {
    $set: {
      "Región": { $arrayElemAt: ["$territorio_info.Región", 0] },
      "Territorio  Electoral": { $arrayElemAt: ["$territorio_info.Distrito", 0] }
    }
  },
  {
    $unset: "territorio_info"
  }]
)

// Actualiza territorios para SENADORES
db.candidatos.updateMany(
  { "Tipo  Eleccion": "SENADOR" },
  [{
    $lookup: {
      from: "territorios",
      localField: "Territorio  Electoral",
      foreignField: "Circunscripción Senatorial",
      as: "territorio_info"
    }
  },
  {
    $set: {
      "Región": { $arrayElemAt: ["$territorio_info.Región", 0] }
    }
  },
  {
    $unset: "territorio_info"
  }]
)</code></pre>
      </div>

      <div class="code-block">
        <div class="code-title">poblarPresidente.js</div>
        <pre><code>import dotenv from "dotenv"
dotenv.config({ path: "./server/.env" })

import { GoogleGenerativeAI } from '@google/generative-ai'
import mongoose from 'mongoose'
import Candidato from '../models/candidato.js'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1"
})

async function poblarPresidentes() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Conectado a MongoDB')

  const presidentes = await Candidato.find({ 'Tipo  Eleccion': 'PRESIDENTE' })
  
  for (const presidente of presidentes) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const prompt = `Información del candidato presidencial ${presidente.Nombre}...`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    // ... procesar respuesta y actualizar base de datos
  }

  mongoose.disconnect()
}

poblarPresidentes()</code></pre>
      </div>

      <div class="code-block">
        <div class="code-title">automatizacionCV.js</div>
        <pre><code>import dotenv from "dotenv"
dotenv.config({ path: "./server/.env" })

import fs from 'fs'
import path from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'
import mongoose from 'mongoose'
import Candidato from '../models/candidato.js'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY, {
  apiEndpoint: "https://generativelanguage.googleapis.com/v1"
})

async function procesarCV(cvPath, nombreCandidato) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const buffer = fs.readFileSync(cvPath)
  const base64 = buffer.toString('base64')

  const prompt = `
Analiza el CV de ${nombreCandidato} contenido en este archivo.
Extrae y estructura la información en las siguientes secciones:
- formación
- experiencia
- logros
- fuentes
Responde SOLO con JSON válido.
`

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'application/pdf',
        data: base64
      }
    },
    { text: prompt }
  ])
  
  const response = await result.response
  const texto = response.text()
  const jsonLimpio = texto.replace(/\`\`\`json\n?/g, '').replace(/\`\`\`/g, '').trim()
  return JSON.parse(jsonLimpio)
}

async function procesarTodosLosCVs() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Conectado a MongoDB')

  const cvDir = path.join(process.cwd(), 'public', 'cv')
  const candidatosCV = {
    'jara.pdf': 'JEANNETTE JARA ROMAN',
    'kast.pdf': 'JOSE ANTONIO KAST RIST',
    // ... más candidatos
  }

  for (const [archivo, nombreCompleto] of Object.entries(candidatosCV)) {
    const cvPath = path.join(cvDir, archivo)
    const cvContenido = await procesarCV(cvPath, nombreCompleto)
    
    // Actualizar candidato en BD con cvContenido
    await candidato.save()
    await new Promise(r => setTimeout(r, 3000)) // Delay para API
  }

  mongoose.disconnect()
}

procesarTodosLosCVs()</code></pre>
      </div>

      <p>
        Los datos de los presidentes se generaron con la API de IA de Gemini, usando los CV en PDF de cada candidato. Esta información fue autogenerada y validada manualmente para asegurar relevancia y precisión.
      </p>
    </section>

    <section class="content-card como-funciona">
      <h2>¿Cómo funciona la información?</h2>
      <p>
        Las noticias se obtienen automáticamente con la API de Google News RSS, buscando noticias de los últimos 7 días según el nombre y tipo de candidato. Si no hay noticias recientes, se realiza una búsqueda general.
      </p>

      <div class="code-block">
        <div class="code-title">API de Noticias</div>
        <pre><code>export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const nombre = query.nombre
  const tipo = query.tipo || 'presidente'
  
  const hace7dias = new Date()
  hace7dias.setDate(hace7dias.getDate() - 7)
  
  const searchQuery = `${nombre} ${tipo} Chile`
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=es-CL&gl=CL&ceid=CL:es-419`
  
  const response = await fetch(rssUrl)
  const xml = await response.text()
  
  // Parsear XML y filtrar noticias de últimos 7 días
  const noticias = parseXML(xml).filter(n => new Date(n.fecha) >= hace7dias)
  
  return { noticias }
})</code></pre>
      </div>

      <p>
        Todas las propuestas fueron extraídas de las páginas oficiales de los candidatos, asegurando que la fuente sea confiable y pública.
      </p>
      <p>
        Aunque las fuentes son automatizadas, recomiendo siempre verificar la información por tu cuenta. La automatización ayuda a centralizar y facilitar el acceso, pero la revisión personal es fundamental para evitar errores o sesgos.
      </p>
    </section>
  </div>
</template>

<style scoped>
.quienes-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.content-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 2rem;
}
.content-card h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1d4ed8;
}
.content-card p {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 1rem;
  line-height: 1.8;
}
.content-card ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}
.content-card ul li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}
.code-block {
  background: #18181b;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  overflow: hidden;
  border: 1px solid #27272a;
}
.code-title {
  background: #23272f;
  color: #93c5fd;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #27272a;
  font-family: 'Fira Mono', 'Consolas', monospace;
}
.code-block pre {
  margin: 0;
  padding: 1.5rem;
  font-family: 'Fira Mono', 'Consolas', 'Monaco', monospace;
  font-size: 0.95rem;
  color: #e5e7eb;
  background: transparent;
  overflow-x: auto;
  line-height: 1.6;
}
.code-block code {
  background: none;
  color: inherit;
  font-family: inherit;
  padding: 0;
}
code {
  background: #f3f4f6;
  color: #1d4ed8;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Fira Mono', 'Consolas', monospace;
  font-size: 0.95rem;
}
</style>