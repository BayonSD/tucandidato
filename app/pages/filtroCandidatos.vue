<template>
  <div>
    <div class="main-container">
      <div class="content-card">
        <h1>Filtrar Candidatos</h1>
        
        <div class="filtros-container">
          <!-- Fila 1: Filtros principales -->
          <div class="filtros-row">
            <!-- Filtro por Tipo de Elección -->
            <div class="filtro-group">
              <label for="tipo-eleccion">Tipo de Elección:</label>
              <select id="tipo-eleccion" v-model="filtros.tipoEleccion">
                <option value="">Todos</option>
                <option value="DIPUTADO">Diputado</option>
                <option value="SENADOR">Senador</option>
                <option value="PRESIDENTE">Presidente</option>
              </select>
            </div>

            <!-- Filtro por Distrito/Circunscripción (solo número) -->
            <div class="filtro-group" v-if="filtros.tipoEleccion && filtros.tipoEleccion !== 'PRESIDENTE'">
              <label for="distrito">{{ filtros.tipoEleccion === 'DIPUTADO' ? 'Distrito' : 'Circunscripción' }}:</label>
              <select id="distrito" v-model="filtros.distrito">
                <option value="">Todos</option>
                <option 
                  v-for="num in numerosDistrito" 
                  :key="num" 
                  :value="num"
                >
                  {{ filtros.tipoEleccion === 'DIPUTADO' ? 'Distrito' : 'Circunscripción' }} {{ num }}
                </option>
              </select>
            </div>

            <!-- Filtro por Región -->
            <div class="filtro-group">
              <label for="region">Región:</label>
              <select id="region" v-model="filtros.region">
                <option value="">Todas</option>
                <option v-for="region in regiones" :key="region" :value="region">
                  {{ region }}
                </option>
              </select>
            </div>

            <!-- Filtro por Comuna -->
            <div class="filtro-group">
              <label for="comuna">Comuna:</label>
              <select id="comuna" v-model="filtros.comuna">
                <option value="">Todas</option>
                <option v-for="comuna in comunas" :key="comuna" :value="comuna">
                  {{ comuna }}
                </option>
              </select>
            </div>
          </div>

          <!-- Fila 2: Filtros secundarios -->
          <div class="filtros-row">
            <!-- Filtro por Territorio -->
            <div class="filtro-group">
              <label for="territorio">Territorio Electoral:</label>
              <select id="territorio" v-model="filtros.territorio">
                <option value="">Todos</option>
                <option 
                  v-for="territorio in territoriosFiltrados" 
                  :key="territorio._id" 
                  :value="territorio.nombre_territorio"
                >
                  {{ territorio.nombre_territorio }} - {{ territorio.region }}
                </option>
              </select>
            </div>

            <!-- Filtro por Partido -->
            <div class="filtro-group">
              <label for="partido">Partido:</label>
              <select id="partido" v-model="filtros.partido">
                <option value="">Todos</option>
                <option v-for="partido in partidos" :key="partido._id" :value="partido.nombre">
                  {{ partido.nombre }}
                </option>
              </select>
            </div>

            <!-- Filtro por Lista -->
            <div class="filtro-group">
              <label for="lista">Lista/Nómina:</label>
              <select id="lista" v-model="filtros.lista">
                <option value="">Todas</option>
                <option v-for="lista in listas" :key="lista._id" :value="lista.lista">
                  {{ lista.lista }}
                </option>
              </select>
            </div>

            <!-- Filtro por Sexo -->
            <div class="filtro-group">
              <label for="sexo">Sexo:</label>
              <select id="sexo" v-model="filtros.sexo">
                <option value="">Todos</option>
                <option value="H">Hombre</option>
                <option value="M">Mujer</option>
              </select>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="filtro-actions">
            <button @click="limpiarFiltros" class="btn-limpiar">Limpiar Filtros</button>
          </div>
        </div>

        <!-- Resultados -->
        <div class="resultados-container">
          <div class="resultados-header">
            <h2>Resultados</h2>
            <span class="contador">{{ candidatosFiltrados.length }} candidatos encontrados</span>
          </div>

          <div v-if="loading" class="loading">
            Cargando datos...
          </div>

          <div v-else-if="candidatosFiltrados.length === 0" class="no-resultados">
            No se encontraron candidatos con los filtros aplicados.
          </div>

          <div v-else class="candidatos-grid">
            <div 
              v-for="candidato in candidatosFiltrados" 
              :key="candidato._id" 
              class="candidato-card"
              @click="verDetalle(candidato._id)"
            >
              <h3>{{ candidato.Nombre }} {{ candidato['Primer  Apellido'] }} {{ candidato['Segundo  Apellido'] }}</h3>
              <div class="candidato-info">
                <p><strong>Tipo:</strong> {{ candidato['Tipo  Eleccion'] }}</p>
                <p><strong>Territorio:</strong> {{ candidato['Territorio  Electoral'] }}</p>
                <p><strong>Región:</strong> {{ candidato['Región'] }}</p>
                <p><strong>Partido:</strong> {{ candidato['Nombre  Partido'] }}</p>
                <p><strong>Lista:</strong> {{ candidato['Lista/Nómina'] }}</p>
                <p><strong>Sexo:</strong> {{ candidato.Sexo === 'H' ? 'Hombre' : 'Mujer' }}</p>
                <p><strong>Rango:</strong> {{ candidato.Rango }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estados
const loading = ref(true)
const candidatos = ref([])
const territorios = ref([])
const partidos = ref([])
const listas = ref([])

// Filtros
const filtros = ref({
  tipoEleccion: '',
  distrito: '',
  territorio: '',
  region: '',
  comuna: '',
  partido: '',
  lista: '',
  sexo: ''
})

// Computed: Regiones únicas
const regiones = computed(() => {
  const regionesSet = new Set()
  territorios.value.forEach(t => {
    if (t.region) regionesSet.add(t.region)
  })
  return Array.from(regionesSet).sort()
})

// Computed: Comunas únicas de todos los territorios
const comunas = computed(() => {
  const comunasSet = new Set()
  territorios.value.forEach(t => {
    if (t.comunas && Array.isArray(t.comunas)) {
      t.comunas.forEach(comuna => comunasSet.add(comuna))
    }
  })
  return Array.from(comunasSet).sort()
})

// Computed: Números de distrito/circunscripción según tipo de elección
const numerosDistrito = computed(() => {
  if (!filtros.value.tipoEleccion || filtros.value.tipoEleccion === 'PRESIDENTE') {
    return []
  }
  
  // Filtrar territorios por tipo de elección
  const territoriosDelTipo = territorios.value.filter(t => 
    t.tipo && t.tipo.toUpperCase() === filtros.value.tipoEleccion
  )
  
  // Extraer números de los nombres de territorio (DISTRITO 1, CIRCUNSCRIPCIÓN 2, etc.)
  const numeros = new Set()
  territoriosDelTipo.forEach(t => {
    const match = t.nombre_territorio.match(/\d+/)
    if (match) {
      numeros.add(parseInt(match[0]))
    }
  })
  
  return Array.from(numeros).sort((a, b) => a - b)
})

// Computed: Territorios filtrados según tipo de elección, región, distrito y comuna
const territoriosFiltrados = computed(() => {
  let resultado = territorios.value

  // Filtrar por tipo de elección
  if (filtros.value.tipoEleccion) {
    resultado = resultado.filter(t => 
      t.tipo && t.tipo.toUpperCase() === filtros.value.tipoEleccion
    )
  }

  // Filtrar por número de distrito/circunscripción
  if (filtros.value.distrito) {
    resultado = resultado.filter(t => {
      const match = t.nombre_territorio.match(/\d+/)
      return match && parseInt(match[0]) === parseInt(filtros.value.distrito)
    })
  }

  // Filtrar por región
  if (filtros.value.region) {
    resultado = resultado.filter(t => 
      t.region === filtros.value.region
    )
  }

  // Filtrar por comuna
  if (filtros.value.comuna) {
    resultado = resultado.filter(t => 
      t.comunas && Array.isArray(t.comunas) && t.comunas.includes(filtros.value.comuna)
    )
  }

  return resultado
})

// Computed: Candidatos filtrados
const candidatosFiltrados = computed(() => {
  let resultado = candidatos.value

  // Filtro por tipo de elección (soporta ambos formatos)
  if (filtros.value.tipoEleccion) {
    resultado = resultado.filter(c => {
      const tipo = c['Tipo  Eleccion'] || c.tipo_eleccion || ''
      return tipo.toUpperCase() === filtros.value.tipoEleccion
    })
  }

  // Filtro por número de distrito/circunscripción
  if (filtros.value.distrito) {
    resultado = resultado.filter(c => {
      const territorio = c['Territorio  Electoral'] || c.territorio || ''
      const match = territorio.match(/\d+/)
      return match && parseInt(match[0]) === parseInt(filtros.value.distrito)
    })
  }

  // Filtro por territorio específico
  if (filtros.value.territorio) {
    resultado = resultado.filter(c => {
      const territorio = c['Territorio  Electoral'] || c.territorio || ''
      return territorio === filtros.value.territorio
    })
  }

  // Filtro por región
  if (filtros.value.region) {
    resultado = resultado.filter(c => {
      const region = c['Región'] || c.region || ''
      return region === filtros.value.region
    })
  }

  // Filtro por comuna - busca territorios que contengan la comuna
  // IMPORTANTE: Debe considerar el tipo de elección también
  if (filtros.value.comuna) {
    // Obtener territorios que contengan esta comuna
    let territoriosConComuna = territorios.value.filter(t => 
      t.comunas && Array.isArray(t.comunas) && t.comunas.includes(filtros.value.comuna)
    )

    // Si hay filtro de tipo de elección, aplicarlo a los territorios
    if (filtros.value.tipoEleccion) {
      territoriosConComuna = territoriosConComuna.filter(t => 
        t.tipo && t.tipo.toUpperCase() === filtros.value.tipoEleccion
      )
    }

    // Obtener nombres de territorios válidos
    const nombresTerritorios = territoriosConComuna.map(t => t.nombre_territorio)
    
    resultado = resultado.filter(c => {
      const territorio = c['Territorio  Electoral'] || c.territorio || ''
      return nombresTerritorios.includes(territorio)
    })
  }

  // Filtro por partido (soporta ambos formatos)
  if (filtros.value.partido) {
    resultado = resultado.filter(c => {
      const partido = c['Nombre  Partido'] || c.partido || ''
      return partido === filtros.value.partido
    })
  }

  // Filtro por lista (soporta ambos formatos)
  if (filtros.value.lista) {
    resultado = resultado.filter(c => {
      const lista = c['Lista/Nómina'] || c.lista_nomina || ''
      return lista === filtros.value.lista
    })
  }

  // Filtro por sexo (soporta ambos formatos)
  if (filtros.value.sexo) {
    resultado = resultado.filter(c => {
      const sexo = c.Sexo || c.sexo || ''
      return sexo.toUpperCase() === filtros.value.sexo
    })
  }

  return resultado
})

// Métodos
const cargarDatos = async () => {
  try {
    loading.value = true
    
    // Cargar datos en paralelo
    const [candidatosData, territoriosData, partidosData, listasData] = await Promise.all([
      $fetch('/api/candidatos'),
      $fetch('/api/territorios'),
      $fetch('/api/partidos'),
      $fetch('/api/listas')
    ])

    candidatos.value = candidatosData
    territorios.value = territoriosData
    partidos.value = partidosData
    listas.value = listasData

    loading.value = false
  } catch (error) {
    console.error('Error al cargar datos:', error)
    loading.value = false
  }
}

const limpiarFiltros = () => {
  filtros.value = {
    tipoEleccion: '',
    distrito: '',
    territorio: '',
    region: '',
    comuna: '',
    partido: '',
    lista: '',
    sexo: ''
  }
}

const verDetalle = (id) => {
  router.push(`/candidato/${id}`)
}

// Lifecycle
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body, html, * {
  font-family: 'Roboto', Arial, sans-serif !important;
}

body {
  background-image: url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.content-card {
  background-color: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 2.5rem;
  margin-bottom: 2rem;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 2rem;
}

.filtros-container {
  margin-bottom: 2rem;
}

.filtros-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filtro-group {
  display: flex;
  flex-direction: column;
}

.filtro-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #495057;
  font-size: 0.95rem;
}

.filtro-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filtro-group select:focus {
  outline: none;
  border-color: #1D4ED8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
}

.filtro-group select:hover {
  border-color: #1D4ED8;
}

.filtro-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.filtro-actions button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-limpiar {
  background-color: #6c757d;
  color: white;
}

.btn-limpiar:hover {
  background-color: #545b62;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.resultados-container {
  margin-top: 2rem;
}

.resultados-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #dee2e6;
}

.resultados-header h2 {
  margin: 0;
  color: #222;
  font-size: 2rem;
  font-weight: 700;
}

.contador {
  font-size: 1.1rem;
  color: #1D4ED8;
  font-weight: 600;
}

.loading, .no-resultados {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.2rem;
}

.candidatos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.candidato-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.candidato-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  transform: translateY(-5px);
  border-color: #1D4ED8;
}

.candidato-card h3 {
  margin: 0 0 1rem 0;
  color: #1D4ED8;
  font-size: 1.3rem;
  font-weight: 700;
}

.candidato-info p {
  margin: 0.5rem 0;
  color: #495057;
  font-size: 0.95rem;
}

.candidato-info strong {
  color: #222;
}

.footer {
  text-align: center;
  color: #fff;
  font-size: 1rem;
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.footer-card {
  background: rgba(0,0,0,0.3);
  padding: 1.2rem 2rem;
  border-radius: 1rem;
  display: inline-block;
}

/* Responsive */
@media (max-width: 1024px) {
  .filtros-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .navbar-container, .main-container {
    padding: 1rem;
  }

  .navbar-title {
    font-size: 1.3rem;
  }

  .content-card {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .filtros-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .filtro-actions {
    flex-direction: column;
  }

  .candidatos-grid {
    grid-template-columns: 1fr;
  }

  .resultados-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
