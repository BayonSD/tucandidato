import xlsx from 'xlsx';
import { MongoClient } from 'mongodb';

// --- Configuración ---
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'elecciones_chile_2025';

const CANDIDATOS_FILE = './candidatos_inscritos_2025.xlsx';
const CANDIDATOS_SHEET = 'Candidatos';
const CANDIDATOS_COL_REGION = 'Región';
const CANDIDATOS_COL_TERRITORIO = 'Territorio Electoral';
const CANDIDATOS_COL_TIPO = 'Tipo Eleccion';

const TERRITORIOS_FILE = './Territorios Electorales.xlsx';
const TERRITORIOS_SHEET = 'Sheet1';
const TERRITORIOS_COL_COMUNA = 'Comuna';
const TERRITORIOS_COL_DISTRITO = 'Distrito';
const TERRITORIOS_COL_SENATORIAL = 'Circunscripción Senatorial';

// --- Función Principal ---
async function importarTerritorios() {
  const client = new MongoClient(MONGO_URI);
  console.log(`Conectando a MongoDB en ${MONGO_URI}...`);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    console.log(`Conectado a la base de datos "${DB_NAME}".`);

    // --- PASO A: Leer archivo de candidatos ---
    console.log(`Leyendo archivo de candidatos: ${CANDIDATOS_FILE}`);
    const candidatosWorkbook = xlsx.readFile(CANDIDATOS_FILE);
    const candidatosData = xlsx.utils.sheet_to_json(candidatosWorkbook.Sheets[CANDIDATOS_SHEET]);

    // Mapa de distrito a región (Diputados)
    const distritoRegionMap = new Map();
    // Mapa de circunscripción senatorial a región (Senadores)
    const senatorialRegionMap = new Map();

    for (const row of candidatosData) {
      const territorio = row[CANDIDATOS_COL_TERRITORIO];
      const tipo = row[CANDIDATOS_COL_TIPO];
      const region = row[CANDIDATOS_COL_REGION];
      if (tipo && territorio && region) {
        if (tipo.toUpperCase() === 'DIPUTADO') {
          const num = territorio.match(/\d+$/);
          if (num) distritoRegionMap.set(num[0], region);
        }
        if (tipo.toUpperCase() === 'SENADOR') {
          const match = territorio.match(/(\d+)/);
          if (match) senatorialRegionMap.set(match[1], region);
        }
      }
    }

    // --- PASO B: Leer archivo de territorios ---
    console.log(`Leyendo archivo de territorios: ${TERRITORIOS_FILE}`);
    const territoriosWorkbook = xlsx.readFile(TERRITORIOS_FILE);
    const territoriosData = xlsx.utils.sheet_to_json(territoriosWorkbook.Sheets[TERRITORIOS_SHEET]);

    // Agrupar comunas por distrito y circunscripción senatorial
    const distritosComunasMap = new Map();
    const senatorialesComunasMap = new Map();

    for (const row of territoriosData) {
      const comuna = row[TERRITORIOS_COL_COMUNA];
      const distrito = row[TERRITORIOS_COL_DISTRITO];
      const senatorial = row[TERRITORIOS_COL_SENATORIAL];

      if (distrito) {
        if (!distritosComunasMap.has(distrito)) distritosComunasMap.set(distrito, []);
        distritosComunasMap.get(distrito).push(comuna);
      }
      if (senatorial) {
        if (!senatorialesComunasMap.has(senatorial)) senatorialesComunasMap.set(senatorial, []);
        senatorialesComunasMap.get(senatorial).push(comuna);
      }
    }

    // --- PASO C: Crear documentos de territorios ---
    const territoriosDocs = [];

    // 1. Insertar Distritos (Diputados)
    for (const [distrito, comunas] of distritosComunasMap.entries()) {
      const num = distrito.match(/\d+$/);
      const regionNombre = num ? distritoRegionMap.get(num[0]) || `Región Desconocida (Distrito ${num[0]})` : `Región Desconocida (${distrito})`;
      const comunasLimpias = [...new Set(comunas.map(c => c.trim()))];

      territoriosDocs.push({
        nombre_territorio: `DISTRITO ${num ? num[0] : distrito}`,
        tipo: "Diputado",
        region: regionNombre,
        comunas: comunasLimpias
      });
    }

    // 2. Insertar Circunscripciones Senatoriales (Senadores)
    for (const [numeroSenatorial, comunas] of senatorialesComunasMap.entries()) {
      const nombreCircunscripcion = `CIRCUNSCRIPCIÓN SENATORIAL ${numeroSenatorial}`;
      const regionNombre = senatorialRegionMap.get(numeroSenatorial) || `Región Desconocida (${nombreCircunscripcion})`;
      const comunasLimpias = [...new Set(comunas.map(c => c.trim()))];

      territoriosDocs.push({
        nombre_territorio: nombreCircunscripcion,
        tipo: "Senador",
        region: regionNombre,
        comunas: comunasLimpias
      });
    }

    // --- PASO D: Insertar en MongoDB ---
    await db.collection('territorios').deleteMany({});
    await db.collection('territorios').insertMany(territoriosDocs);
    console.log('Territorios insertados correctamente.');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Conexión cerrada.');
  }
}

// --- Ejecutar el script ---
importarTerritorios();