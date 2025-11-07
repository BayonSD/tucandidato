import xlsx from 'xlsx';
import { MongoClient } from 'mongodb';

// --- Configuración ---
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'elecciones_chile_2025';

const CANDIDATOS_FILE = './candidatos_inscritos_2025.xlsx';
const CANDIDATOS_SHEET = 'Candidatos';

async function importarCandidatos() {
  const client = new MongoClient(MONGO_URI);
  console.log(`Conectando a MongoDB en ${MONGO_URI}...`);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log(`Conectado a la base de datos "${DB_NAME}".`);

    // Leer archivo de candidatos
    console.log(`Leyendo archivo de candidatos: ${CANDIDATOS_FILE}`);
    const candidatosWorkbook = xlsx.readFile(CANDIDATOS_FILE);
    const candidatosData = xlsx.utils.sheet_to_json(candidatosWorkbook.Sheets[CANDIDATOS_SHEET]);

    // Limpiar colección y registrar candidatos
    await db.collection('candidatos').deleteMany({});
    await db.collection('candidatos').insertMany(candidatosData);
    console.log('Candidatos insertados correctamente.');

    // Extraer listas/nominas y sus partidos únicos
    const listasMap = {};
    candidatosData.forEach(c => {
      const lista = (c["Lista/Nómina"] || "").trim().toUpperCase();
      const partido = (c["Nombre  Partido"] || "").trim().toUpperCase();
      if (lista && partido) {
        if (!listasMap[lista]) listasMap[lista] = new Set();
        listasMap[lista].add(partido);
      }
    });

    // Preparar documentos para la colección listas
    const listaDocs = Object.entries(listasMap).map(([lista, partidosSet]) => ({
      lista,
      partidos: Array.from(partidosSet)
    }));

    // Limpiar colección listas y registrar
    await db.collection('listas').deleteMany({});
    if (listaDocs.length > 0) {
      await db.collection('listas').insertMany(listaDocs);
      console.log('Listas y partidos insertados correctamente.');
    } else {
      console.log('No se encontraron listas/nominas para insertar.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Conexión cerrada.');
  }
}

importarCandidatos();