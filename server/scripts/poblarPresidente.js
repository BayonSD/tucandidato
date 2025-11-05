import 'dotenv/config';
import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Candidato from "../models/candidato.js";


dotenv.config({ path: "./server/.env" }); 




console.log("📄 Archivo .env cargado desde:", process.cwd());
console.log("🔑 API Key detectada:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 10) + "..." : "❌ No encontrada");



dotenv.config();

// ✅ Configuración
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";
const MONGO_URI = "mongodb://127.0.0.1:27017/elecciones_chile_2025"; // ajusta si tu BD es distinta

async function generarDescripcion(candidato) {
  // Construir nombre completo desde los campos separados
  const nombreCompleto = `${candidato.Nombre || ''} ${candidato['Primer  Apellido'] || ''} ${candidato['Segundo  Apellido'] || ''}`.trim();
  
  const prompt = `
  Eres un asistente que genera descripciones objetivas sobre candidatos políticos chilenos.
  Resume en 3 o 4 líneas la información más relevante del candidato:
  Nombre completo: ${nombreCompleto}
  Partido: ${candidato['Lista/Nómina'] || candidato['Nombre  Partido'] || "Independiente"}
  Región: ${candidato['Región'] || candidato.region || "Chile"}
  Cargo al que postula: ${candidato['Tipo  Eleccion'] || candidato.tipo_eleccion || "PRESIDENTE"}

  Incluye tono neutral, sin opiniones, y menciona su afiliación política si existe.
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
  } catch (error) {
    console.error(`❌ Error con ${nombreCompleto}:`, error.response?.data || error.message);
    return null;
  }
}

async function poblarPresidentes() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Conectado a MongoDB");

  // Buscar por el campo con espacios
  const presidentes = await Candidato.find({ "Tipo  Eleccion": "PRESIDENTE" });

  console.log(`🧾 Se encontraron ${presidentes.length} candidatos a presidente.\n`);

  for (const candidato of presidentes) {
    const nombreCompleto = `${candidato.Nombre || ''} ${candidato['Primer  Apellido'] || ''} ${candidato['Segundo  Apellido'] || ''}`.trim();
    
    if (!candidato.descripcion_auto) {
      console.log(`🧠 Generando descripción para ${nombreCompleto}...`);
      const descripcion = await generarDescripcion(candidato);

      if (descripcion) {
        candidato.descripcion_auto = descripcion;
        await candidato.save();
        console.log(`✅ Guardado: ${nombreCompleto}`);
      } else {
        console.log(`⚠️ No se generó descripción para ${nombreCompleto}`);
      }

      // pequeño delay para no saturar la API
      await new Promise((r) => setTimeout(r, 1500));
    } else {
      console.log(`⏭️ ${nombreCompleto} ya tiene descripción, saltando...`);
    }
  }

  console.log("\n🎉 Proceso completado.");
  mongoose.disconnect();
}

poblarPresidentes();
