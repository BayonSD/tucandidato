<template>
  <div>
    <!-- Barra de navegación -->
    <nav class="navbar">
      <div class="navbar-container">
        <a href="/" class="navbar-logo" title="Inicio - Tu Candidato">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="#1D4ED8"/>
            <path d="M12 2.5L14.6942 9.20124H21.8042L16.055 13.5975L18.7492 20.2988L12 15.9025L5.25078 20.2988L7.94501 13.5975L2.19579 9.20124H9.30582L12 2.5Z" fill="white"/>
          </svg>
          <span class="navbar-title">Tu <span class="navbar-title-blue">Candidato</span></span>
        </a>
        <div class="navbar-menu">
          <a href="/">Inicio</a>
          <a href="/filtroCandidatos">Filtrar</a>
          <a href="/cadem">Encuestas</a>
        </div>
      </div>
    </nav>

    <div class="main-container">
      <div class="content-card">
        <h1>📊 Dashboard de Encuestas CADEM</h1>
        
        <div v-if="loading" class="loading">
          Cargando datos de encuestas...
        </div>

        <div v-else>
          <!-- Metadata y controles -->
          <div class="dashboard-header">
            <div class="metadata-card">
              <p><strong>Fuente:</strong> {{ encuestas.metadata.fuente }}</p>
              <p><strong>Fecha:</strong> {{ encuestas.metadata.fecha }} (Semana {{ encuestas.metadata.semana }})</p>
            </div>

            <!-- Controles del Dashboard -->
            <div class="dashboard-controls">
              <div class="control-group">
                <label>Sección:</label>
                <select v-model="seccionActiva" class="control-select">
                  <option value="primera">Primera Vuelta</option>
                  <option value="expectativa">Expectativa</option>
                  <option value="segunda">Segunda Vuelta</option>
                  <option value="comparar">Comparar</option>
                </select>
              </div>

              <div class="control-group" v-if="seccionActiva !== 'segunda' && seccionActiva !== 'comparar'">
                <label>Tipo de Gráfico:</label>
                <div class="btn-group">
                  <button 
                    @click="tipoGrafico = 'barras'" 
                    :class="['btn-chart', { active: tipoGrafico === 'barras' }]"
                  >
                    📊 Barras
                  </button>
                  <button 
                    @click="tipoGrafico = 'circular'" 
                    :class="['btn-chart', { active: tipoGrafico === 'circular' }]"
                  >
                    🥧 Circular
                  </button>
                  <button 
                    @click="tipoGrafico = 'tabla'" 
                    :class="['btn-chart', { active: tipoGrafico === 'tabla' }]"
                  >
                    📋 Tabla
                  </button>
                </div>
              </div>

              <div class="control-group" v-if="seccionActiva === 'comparar'">
                <label>Comparar candidatos:</label>
                <div class="checkbox-group">
                  <label v-for="candidato in encuestas.primeraVuelta.candidatos" :key="candidato.nombre" class="checkbox-label">
                    <input type="checkbox" v-model="candidatosSeleccionados" :value="candidato.nombre">
                    {{ candidato.nombre }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Primera Vuelta -->
          <section v-if="seccionActiva === 'primera'" class="encuesta-section">
            <h2>{{ encuestas.primeraVuelta.titulo }}</h2>
            <p class="section-description">{{ encuestas.primeraVuelta.descripcion }}</p>
            
            <!-- Gráfico de Barras Horizontales -->
            <div v-if="tipoGrafico === 'barras'" class="chart-container">
              <div class="barras-list">
                <div 
                  v-for="(candidato, index) in encuestas.primeraVuelta.candidatos" 
                  :key="index"
                  class="barra-item"
                >
                  <div class="barra-header">
                    <span class="barra-nombre">{{ candidato.nombre }}</span>
                    <span class="barra-info">
                      <span class="barra-porcentaje" :style="{ color: candidato.color }">{{ candidato.porcentaje }}%</span>
                      <span class="barra-variacion" :class="getVariacionClass(candidato.variacion)">{{ candidato.variacion }}</span>
                    </span>
                  </div>
                  <div class="barra-bg">
                    <div 
                      class="barra-fill" 
                      :style="{ width: candidato.porcentaje + '%', backgroundColor: candidato.color }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gráfico Circular -->
            <div v-if="tipoGrafico === 'circular'" class="chart-container">
              <div class="pie-chart-container">
                <svg viewBox="0 0 400 400" class="pie-chart">
                  <g v-for="(segment, index) in pieChartSegments" :key="index">
                    <path 
                      :d="segment.path" 
                      :fill="segment.color"
                      class="pie-segment"
                    />
                  </g>
                </svg>
                <div class="pie-legend">
                  <div 
                    v-for="candidato in encuestas.primeraVuelta.candidatos" 
                    :key="candidato.nombre"
                    class="legend-item"
                  >
                    <span class="legend-color" :style="{ backgroundColor: candidato.color }"></span>
                    <span class="legend-text">{{ candidato.nombre }} ({{ candidato.porcentaje }}%)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla -->
            <div v-if="tipoGrafico === 'tabla'" class="chart-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Posición</th>
                    <th>Candidato</th>
                    <th>Porcentaje</th>
                    <th>Variación</th>
                    <th>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(candidato, index) in encuestas.primeraVuelta.candidatos" :key="index">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td><strong>{{ candidato.nombre }}</strong></td>
                    <td class="text-center" :style="{ color: candidato.color }">
                      <strong>{{ candidato.porcentaje }}%</strong>
                    </td>
                    <td class="text-center" :class="getVariacionClass(candidato.variacion)">
                      {{ candidato.variacion }}pts
                    </td>
                    <td>
                      <div class="mini-bar">
                        <div class="mini-bar-fill" :style="{ width: candidato.porcentaje + '%', backgroundColor: candidato.color }"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Expectativa -->
          <section v-if="seccionActiva === 'expectativa'" class="encuesta-section">
            <h2>{{ encuestas.expectativa.titulo }}</h2>
            <p class="section-description">{{ encuestas.expectativa.descripcion }}</p>
            
            <!-- Gráfico de Barras -->
            <div v-if="tipoGrafico === 'barras'" class="chart-container">
              <div class="barras-list">
                <div 
                  v-for="(candidato, index) in encuestas.expectativa.candidatos" 
                  :key="index"
                  class="barra-item"
                >
                  <div class="barra-header">
                    <span class="barra-nombre">{{ candidato.nombre }}</span>
                    <span class="barra-info">
                      <span class="barra-porcentaje" :style="{ color: candidato.color }">{{ candidato.porcentaje }}%</span>
                      <span class="barra-variacion" :class="getVariacionClass(candidato.variacion)">{{ candidato.variacion }}</span>
                    </span>
                  </div>
                  <div class="barra-bg">
                    <div 
                      class="barra-fill" 
                      :style="{ width: candidato.porcentaje + '%', backgroundColor: candidato.color }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gráfico Circular -->
            <div v-if="tipoGrafico === 'circular'" class="chart-container">
              <div class="pie-chart-container">
                <svg viewBox="0 0 400 400" class="pie-chart">
                  <g v-for="(segment, index) in pieChartSegmentsExpectativa" :key="index">
                    <path 
                      :d="segment.path" 
                      :fill="segment.color"
                      class="pie-segment"
                    />
                  </g>
                </svg>
                <div class="pie-legend">
                  <div 
                    v-for="candidato in encuestas.expectativa.candidatos" 
                    :key="candidato.nombre"
                    class="legend-item"
                  >
                    <span class="legend-color" :style="{ backgroundColor: candidato.color }"></span>
                    <span class="legend-text">{{ candidato.nombre }} ({{ candidato.porcentaje }}%)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla -->
            <div v-if="tipoGrafico === 'tabla'" class="chart-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Posición</th>
                    <th>Candidato</th>
                    <th>Porcentaje</th>
                    <th>Variación</th>
                    <th>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(candidato, index) in encuestas.expectativa.candidatos" :key="index">
                    <td class="text-center">{{ index + 1 }}</td>
                    <td><strong>{{ candidato.nombre }}</strong></td>
                    <td class="text-center" :style="{ color: candidato.color }">
                      <strong>{{ candidato.porcentaje }}%</strong>
                    </td>
                    <td class="text-center" :class="getVariacionClass(candidato.variacion)">
                      {{ candidato.variacion }}pts
                    </td>
                    <td>
                      <div class="mini-bar">
                        <div class="mini-bar-fill" :style="{ width: candidato.porcentaje + '%', backgroundColor: candidato.color }"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Segunda Vuelta -->
          <section v-if="seccionActiva === 'segunda'" class="encuesta-section">
            <h2>{{ encuestas.segundaVuelta.titulo }}</h2>
            <p class="section-description">{{ encuestas.segundaVuelta.descripcion }}</p>
            
            <div class="segunda-vuelta-grid">
              <div 
                v-for="(escenario, index) in encuestas.segundaVuelta.escenarios" 
                :key="index"
                class="segunda-vuelta-card"
              >
                <h3>{{ escenario.nombre }}</h3>
                
                <div class="versus-container">
                  <div class="candidato-vs">
                    <div class="candidato-vs-nombre">{{ escenario.candidato1.nombre }}</div>
                    <div class="candidato-vs-porcentaje" :style="{ color: escenario.candidato1.color }">
                      {{ escenario.candidato1.porcentaje }}%
                    </div>
                    <div class="candidato-vs-barra">
                      <div 
                        class="candidato-vs-barra-fill" 
                        :style="{ width: escenario.candidato1.porcentaje + '%', backgroundColor: escenario.candidato1.color }"
                      ></div>
                    </div>
                  </div>

                  <div class="vs-divider">
                    <span v-if="escenario.empate" class="empate-badge">EMPATE</span>
                    <span v-else class="diferencia-badge">{{ escenario.diferencia }}pts</span>
                  </div>

                  <div class="candidato-vs">
                    <div class="candidato-vs-nombre">{{ escenario.candidato2.nombre }}</div>
                    <div class="candidato-vs-porcentaje" :style="{ color: escenario.candidato2.color }">
                      {{ escenario.candidato2.porcentaje }}%
                    </div>
                    <div class="candidato-vs-barra">
                      <div 
                        class="candidato-vs-barra-fill" 
                        :style="{ width: escenario.candidato2.porcentaje + '%', backgroundColor: escenario.candidato2.color }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Comparar Candidatos -->
          <section v-if="seccionActiva === 'comparar'" class="encuesta-section">
            <h2>Comparación de Candidatos</h2>
            <p class="section-description">Selecciona candidatos para comparar sus resultados</p>
            
            <div v-if="candidatosSeleccionados.length === 0" class="empty-state">
              <p>Selecciona al menos un candidato en el filtro superior para comparar</p>
            </div>

            <div v-else class="comparison-container">
              <!-- Comparación Primera Vuelta vs Expectativa -->
              <div class="comparison-chart">
                <h3>Primera Vuelta vs Expectativa</h3>
                <div class="comparison-bars">
                  <div v-for="nombre in candidatosSeleccionados" :key="nombre" class="comparison-item">
                    <div class="comparison-header">{{ nombre }}</div>
                    <div class="comparison-row">
                      <span class="comparison-label">Primera Vuelta:</span>
                      <div class="comparison-bar-container">
                        <div 
                          class="comparison-bar" 
                          :style="{ 
                            width: getCandidatoPorcentaje(nombre, 'primera') + '%',
                            backgroundColor: getCandidatoColor(nombre)
                          }"
                        >
                          {{ getCandidatoPorcentaje(nombre, 'primera') }}%
                        </div>
                      </div>
                    </div>
                    <div class="comparison-row">
                      <span class="comparison-label">Expectativa:</span>
                      <div class="comparison-bar-container">
                        <div 
                          class="comparison-bar" 
                          :style="{ 
                            width: getCandidatoPorcentaje(nombre, 'expectativa') + '%',
                            backgroundColor: getCandidatoColor(nombre),
                            opacity: 0.7
                          }"
                        >
                          {{ getCandidatoPorcentaje(nombre, 'expectativa') }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Gráfico de Barras Agrupadas -->
              <div class="comparison-chart">
                <h3>Comparación Visual</h3>
                <div class="grouped-bars">
                  <div class="grouped-bars-container">
                    <div v-for="nombre in candidatosSeleccionados" :key="nombre" class="grouped-bar-group">
                      <div class="grouped-bar-name">{{ getNombreCorto(nombre) }}</div>
                      <div class="grouped-bars-wrapper">
                        <div 
                          class="grouped-bar primera"
                          :style="{ 
                            height: getCandidatoPorcentaje(nombre, 'primera') * 3 + 'px',
                            backgroundColor: getCandidatoColor(nombre)
                          }"
                          :title="'Primera Vuelta: ' + getCandidatoPorcentaje(nombre, 'primera') + '%'"
                        >
                          <span class="grouped-bar-value">{{ getCandidatoPorcentaje(nombre, 'primera') }}%</span>
                        </div>
                        <div 
                          class="grouped-bar expectativa"
                          :style="{ 
                            height: getCandidatoPorcentaje(nombre, 'expectativa') * 3 + 'px',
                            backgroundColor: getCandidatoColor(nombre),
                            opacity: 0.7
                          }"
                          :title="'Expectativa: ' + getCandidatoPorcentaje(nombre, 'expectativa') + '%'"
                        >
                          <span class="grouped-bar-value">{{ getCandidatoPorcentaje(nombre, 'expectativa') }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="grouped-legend">
                    <div class="grouped-legend-item">
                      <span class="grouped-legend-box primera"></span>
                      <span>Primera Vuelta</span>
                    </div>
                    <div class="grouped-legend-item">
                      <span class="grouped-legend-box expectativa"></span>
                      <span>Expectativa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer class="footer">
        <div class="footer-card">
          <p>Este es un sitio web independiente y no afiliado a ningún partido político.</p>
          <p>&copy; 2025 Tu Candidato. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loading = ref(true)
const encuestas = ref({
  metadata: {},
  primeraVuelta: { candidatos: [] },
  expectativa: { candidatos: [] },
  segundaVuelta: { escenarios: [] }
})

// Controles del dashboard
const seccionActiva = ref('primera')
const tipoGrafico = ref('barras')
const candidatosSeleccionados = ref([])

const cargarEncuestas = async () => {
  try {
    loading.value = true
    const response = await fetch('/data/encuestas.json')
    encuestas.value = await response.json()
    loading.value = false
  } catch (error) {
    console.error('Error al cargar encuestas:', error)
    loading.value = false
  }
}

const getVariacionClass = (variacion) => {
  if (variacion.startsWith('+')) return 'variacion-positiva'
  if (variacion.startsWith('-')) return 'variacion-negativa'
  return 'variacion-neutral'
}

// Funciones para gráfico circular (pie chart)
const createPieSegments = (candidatos) => {
  const total = candidatos.reduce((sum, c) => sum + c.porcentaje, 0)
  let currentAngle = 0
  
  return candidatos.map(candidato => {
    const angle = (candidato.porcentaje / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    const start = polarToCartesian(200, 200, 150, endAngle)
    const end = polarToCartesian(200, 200, 150, startAngle)
    const largeArc = angle > 180 ? 1 : 0
    
    const path = [
      `M 200 200`,
      `L ${start.x} ${start.y}`,
      `A 150 150 0 ${largeArc} 0 ${end.x} ${end.y}`,
      `Z`
    ].join(' ')
    
    currentAngle = endAngle
    
    return {
      path,
      color: candidato.color
    }
  })
}

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

const pieChartSegments = computed(() => {
  if (!encuestas.value.primeraVuelta.candidatos.length) return []
  return createPieSegments(encuestas.value.primeraVuelta.candidatos)
})

const pieChartSegmentsExpectativa = computed(() => {
  if (!encuestas.value.expectativa.candidatos.length) return []
  return createPieSegments(encuestas.value.expectativa.candidatos)
})

// Funciones para comparación
const getCandidatoPorcentaje = (nombre, seccion) => {
  const candidatos = seccion === 'primera' 
    ? encuestas.value.primeraVuelta.candidatos 
    : encuestas.value.expectativa.candidatos
  
  const candidato = candidatos.find(c => c.nombre === nombre)
  return candidato ? candidato.porcentaje : 0
}

const getCandidatoColor = (nombre) => {
  const candidato = encuestas.value.primeraVuelta.candidatos.find(c => c.nombre === nombre)
  return candidato ? candidato.color : '#6b7280'
}

const getNombreCorto = (nombre) => {
  const partes = nombre.split(' ')
  return partes.length > 2 ? `${partes[0]} ${partes[partes.length - 1]}` : nombre
}

onMounted(() => {
  cargarEncuestas()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700;800&display=swap');

body, html, * {
  font-family: 'Roboto', Arial, sans-serif !important;
}

body {
  background-image: url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.navbar-title {
  font-size: 2rem;
  font-weight: 800;
  color: #222;
}

.navbar-title-blue {
  color: #1D4ED8;
}

.navbar-menu a {
  margin-left: 1.5rem;
  color: #555;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.navbar-menu a:hover {
  color: #1D4ED8;
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

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #6b7280;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.metadata-card {
  background: #f3f4f6;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-around;
  gap: 2rem;
}

.metadata-card p {
  margin: 0;
  color: #374151;
}

.dashboard-controls {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.control-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.control-select:focus {
  outline: none;
  border-color: #1D4ED8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.btn-chart {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-chart:hover {
  border-color: #1D4ED8;
  background: #eff6ff;
}

.btn-chart.active {
  border-color: #1D4ED8;
  background: #1D4ED8;
  color: white;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.checkbox-label input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}

.chart-container {
  margin-top: 1.5rem;
}

.encuesta-section {
  margin-bottom: 3rem;
}

.encuesta-section h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

/* Primera Vuelta - Grid de candidatos */
.candidatos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}

.candidato-stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
}

.candidato-stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.candidato-nombre {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.candidato-porcentaje {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.candidato-variacion {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.variacion-positiva {
  color: #16a34a;
}

.variacion-negativa {
  color: #dc2626;
}

.variacion-neutral {
  color: #6b7280;
}

.candidato-barra {
  background: #e5e7eb;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
}

.candidato-barra-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

/* Expectativa - Barras horizontales */
.barras-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.barra-item {
  background: white;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
}

.barra-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.barra-nombre {
  font-weight: 600;
  color: #374151;
  font-size: 1.1rem;
}

.barra-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.barra-porcentaje {
  font-size: 1.5rem;
  font-weight: 800;
}

.barra-variacion {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.barra-bg {
  background: #e5e7eb;
  height: 2rem;
  border-radius: 999px;
  overflow: hidden;
}

.barra-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

/* Segunda Vuelta - Grid */
.segunda-vuelta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.segunda-vuelta-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s;
}

.segunda-vuelta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.segunda-vuelta-card h3 {
  text-align: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1.5rem;
}

.versus-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.candidato-vs {
  flex: 1;
}

.candidato-vs-nombre {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.candidato-vs-porcentaje {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.candidato-vs-barra {
  background: #e5e7eb;
  height: 1.5rem;
  border-radius: 999px;
  overflow: hidden;
}

.candidato-vs-barra-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

.vs-divider {
  text-align: center;
  padding: 0.5rem 0;
}

.empate-badge, .diferencia-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
}

.empate-badge {
  background: #fbbf24;
  color: #78350f;
}

.diferencia-badge {
  background: #dbeafe;
  color: #1e40af;
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

/* Gráfico Circular (Pie Chart) */
.pie-chart-container {
  display: flex;
  gap: 3rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.pie-chart {
  max-width: 400px;
  width: 100%;
  height: auto;
}

.pie-segment {
  transition: opacity 0.3s;
}

.pie-segment:hover {
  opacity: 0.8;
  cursor: pointer;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend-color {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
}

.legend-text {
  font-size: 1rem;
  color: #374151;
}

/* Tabla de Datos */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
}

.data-table thead {
  background: #f3f4f6;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.text-center {
  text-align: center !important;
}

.mini-bar {
  background: #e5e7eb;
  height: 1.5rem;
  border-radius: 999px;
  overflow: hidden;
  width: 100%;
}

.mini-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

/* Comparación */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.1rem;
}

.comparison-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.comparison-chart {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.comparison-chart h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1.5rem;
  text-align: center;
}

.comparison-bars {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.comparison-item {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1.5rem;
}

.comparison-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.comparison-header {
  font-weight: 700;
  font-size: 1.1rem;
  color: #222;
  margin-bottom: 1rem;
}

.comparison-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.comparison-label {
  font-size: 0.95rem;
  color: #6b7280;
}

.comparison-bar-container {
  background: #e5e7eb;
  height: 2rem;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.comparison-bar {
  height: 100%;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  transition: width 0.6s ease;
  min-width: 50px;
}

/* Barras Agrupadas */
.grouped-bars {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.grouped-bars-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-end;
  min-height: 250px;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.grouped-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.grouped-bar-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
  max-width: 100px;
}

.grouped-bars-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.grouped-bar {
  width: 40px;
  min-height: 30px;
  border-radius: 0.25rem 0.25rem 0 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.25rem;
  transition: all 0.3s;
  position: relative;
  cursor: pointer;
}

.grouped-bar:hover {
  transform: translateY(-5px);
}

.grouped-bar-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.grouped-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.grouped-legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.grouped-legend-box {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
}

.grouped-legend-box.primera {
  background: linear-gradient(to bottom, #1d4ed8, #3b82f6);
}

.grouped-legend-box.expectativa {
  background: linear-gradient(to bottom, #1d4ed8, #3b82f6);
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 1024px) {
  .candidatos-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 1024px) {
  .comparison-container {
    grid-template-columns: 1fr;
  }

  .grouped-bars-container {
    flex-wrap: wrap;
    min-height: auto;
  }

  .pie-chart-container {
    flex-direction: column;
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

  .metadata-card {
    flex-direction: column;
    gap: 0.5rem;
  }

  .dashboard-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-group {
    flex-wrap: wrap;
  }

  .candidatos-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .segunda-vuelta-grid {
    grid-template-columns: 1fr;
  }

  .comparison-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .comparison-label {
    font-size: 0.85rem;
  }

  .data-table {
    font-size: 0.85rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
