<template>
  <div class="comparativa-container">
    <h2 class="comparar-titulo">Comparar Candidatos Presidenciales</h2>
    
    <!-- Fila de selección de candidatos -->
    <div class="seleccion-candidatos">
      <h3>Selecciona los candidatos a comparar:</h3>
      <div class="candidates-scroll-container">
        <div
          v-for="candidato in presidenciales"
          :key="candidato._id"
          :class="['candidate-card-horizontal', candidatosSeleccionados.includes(candidato._id) ? 'selected' : '']"
          @click="toggleCandidato(candidato._id)"
        >
          <img :src="candidato.fotoUrl || defaultFoto" class="candidate-img" />
          <div class="candidate-info-gradient">
            <h3>{{ candidato.Nombre }} {{ candidato['Primer  Apellido'] }} {{ candidato['Segundo  Apellido'] }}</h3>
            <p class="candidate-partido"><strong>Partido:</strong> {{ candidato['Nombre  Partido'] }}</p>
            <span v-if="candidatosSeleccionados.includes(candidato._id)" class="selected-label">✓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtro de categorías -->
    <div v-if="candidatosSeleccionados.length > 0" class="filtro-categorias">
      <h3>Selecciona las categorías a comparar:</h3>
      <div class="categorias-chips">
        <button
          :class="['chip', categoriasSeleccionadas.length === 0 ? 'active' : '']"
          @click="categoriasSeleccionadas = []"
        >
          Todas
        </button>
        <button
          v-for="cat in categoriasDisponibles"
          :key="cat"
          :class="['chip', categoriasSeleccionadas.includes(cat) ? 'active' : '']"
          @click="toggleCategoria(cat)"
        >
          {{ getEmojiCategoria(cat) }} {{ cat }}
        </button>
      </div>
    </div>

    <!-- Comparación por categorías -->
    <div v-if="candidatosSeleccionados.length > 0" class="comparador-categorias">
      <!-- Acordeón por categoría -->
      <div
        v-for="categoria in categoriasFiltradas"
        :key="categoria"
        class="categoria-accordion"
      >
        <button
          class="categoria-header"
          @click="toggleCategoriaAccordion(categoria)"
        >
          <span class="categoria-titulo">{{ getEmojiCategoria(categoria) }} {{ categoria }}</span>
          <span class="accordion-chevron" :class="{ open: categoriasAbiertas[categoria] }">▼</span>
        </button>
        
        <!-- Contenido: candidatos en fila horizontal con swipe -->
        <div v-show="categoriasAbiertas[categoria]" class="categoria-content">
          <div class="candidatos-scroll-wrapper">
            <div class="candidatos-row-swipe">
              <div
                v-for="idCandidato in candidatosSeleccionados"
                :key="idCandidato"
                class="candidato-card"
              >
                <div class="candidato-header">
                  <img :src="getCandidato(idCandidato)?.fotoUrl || defaultFoto" class="foto-candidato" />
                  <div class="candidato-info">
                    <h4>{{ getCandidato(idCandidato)?.Nombre }} {{ getCandidato(idCandidato)?.['Primer  Apellido'] }}</h4>
                    <p class="partido-label">{{ getCandidato(idCandidato)?.['Nombre  Partido'] }}</p>
                  </div>
                </div>
                
                <!-- Propuestas del candidato para esta categoría -->
                <div class="propuestas-content">
                  <ul v-if="getPropuestas(idCandidato, categoria).length > 0">
                    <li v-for="(propuesta, index) in getPropuestas(idCandidato, categoria)" :key="index">
                      {{ propuesta }}
                    </li>
                  </ul>
                  <p v-else class="sin-propuestas">Sin propuestas registradas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="mensaje-vacio">
      <p>� Selecciona uno o más candidatos para comparar sus propuestas</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const candidatos = ref([])
const candidatosSeleccionados = ref([])
const categoriasSeleccionadas = ref([])
const categoriasAbiertas = ref({})
const defaultFoto = 'https://picsum.photos/seed/presidente/400/600'

const categoriasDisponibles = [
  "Agricultura", "Cultura", "Deporte", "Descentralización", "Economía / Crecimiento",
  "Educación", "Empleo y Trabajo", "Energía", "Igualdad y Género", "Infraestructura",
  "Innovación Social", "Innovación y Ciencia", "Integridad / Anticorrupción", "Justicia",
  "Medio Ambiente", "Migración", "Participación Ciudadana", "Pensiones", "Pueblos Originarios",
  "Recursos Hídricos", "Reducción de Pobreza", "Reforma Tributaria", "Relaciones Exteriores",
  "Salud", "Seguridad Pública", "Sistema Penitenciario", "Transformación Digital",
  "Transporte", "Turismo", "Vivienda"
]

const emojisCategoria = {
  "Agricultura": "🌾", "Cultura": "🎭", "Deporte": "🏅", "Descentralización": "🗺️",
  "Economía / Crecimiento": "📈", "Educación": "📘", "Empleo y Trabajo": "🧑‍💼",
  "Energía": "⚡", "Igualdad y Género": "⚧️", "Infraestructura": "🧱",
  "Innovación Social": "🤝", "Innovación y Ciencia": "🔬", "Integridad / Anticorrupción": "🚫",
  "Justicia": "⚖️", "Medio Ambiente": "🌿", "Migración": "🧭",
  "Participación Ciudadana": "🗳️", "Pensiones": "💰", "Pueblos Originarios": "🪶",
  "Recursos Hídricos": "💧", "Reducción de Pobreza": "📉", "Reforma Tributaria": "🧾",
  "Relaciones Exteriores": "🌐", "Salud": "🩺", "Seguridad Pública": "🛡️",
  "Sistema Penitenciario": "🏛️", "Transformación Digital": "💻", "Transporte": "🚉",
  "Turismo": "🧳", "Vivienda": "🏠"
}

const fetchCandidatos = async () => {
  const res = await fetch('/api/candidatos')
  candidatos.value = await res.json()
}

const presidenciales = computed(() =>
  candidatos.value.filter(c => c["Tipo  Eleccion"] === "PRESIDENTE")
)

const categoriasFiltradas = computed(() => {
  return categoriasSeleccionadas.value.length > 0 ? categoriasSeleccionadas.value : categoriasDisponibles
})

const toggleCategoria = (categoria) => {
  const index = categoriasSeleccionadas.value.indexOf(categoria)
  if (index > -1) {
    categoriasSeleccionadas.value.splice(index, 1)
  } else {
    categoriasSeleccionadas.value.push(categoria)
  }
}

const toggleCandidato = (id) => {
  const index = candidatosSeleccionados.value.indexOf(id)
  if (index > -1) {
    candidatosSeleccionados.value.splice(index, 1)
  } else {
    candidatosSeleccionados.value.push(id)
  }
}

const getCandidato = (id) => {
  return candidatos.value.find(c => c._id === id)
}

const getPropuestas = (idCandidato, categoria) => {
  const candidato = getCandidato(idCandidato)
  if (!candidato || !candidato.propuestas || !candidato.propuestas[categoria]) {
    return []
  }
  return Array.isArray(candidato.propuestas[categoria]) ? candidato.propuestas[categoria] : []
}

const toggleCategoriaAccordion = (categoria) => {
  categoriasAbiertas.value[categoria] = !categoriasAbiertas.value[categoria]
}

const getEmojiCategoria = (categoria) => {
  return emojisCategoria[categoria] || "📌"
}

onMounted(fetchCandidatos)
</script>

<style scoped>
.comparativa-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.comparar-titulo {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1f2937;
}

/* Selección de candidatos */
.seleccion-candidatos {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.seleccion-candidatos h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.candidates-scroll-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
}

.candidate-card-horizontal {
  flex: 0 0 auto;
  width: 250px;
  height: 380px;
  position: relative;
  background: #fff;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  scroll-snap-align: center;
  transition: all 0.3s;
  cursor: pointer;
  border: 3px solid transparent;
}

.candidate-card-horizontal:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.candidate-card-horizontal.selected {
  border: 3px solid #1d4ed8;
  box-shadow: 0 8px 24px rgba(29,78,216,0.3);
}

.candidate-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.candidate-info-gradient {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%);
  color: #fff;
}

.candidate-info-gradient h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.candidate-partido {
  font-size: 0.9rem;
  font-weight: 500;
  color: #cce3ff;
}

.selected-label {
  background: #10b981;
  color: #fff;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 1.2rem;
  font-weight: 700;
  position: absolute;
  top: 10px;
  right: 10px;
  box-shadow: 0 2px 8px rgba(16,185,129,0.5);
}

/* Filtro de categorías */
.filtro-categorias {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.filtro-categorias h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
}

.categorias-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  background: #f3f4f6;
  border: 2px solid transparent;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
}

.chip:hover {
  background: #e5e7eb;
}

.chip.active {
  background: #1d4ed8;
  color: #fff;
  border-color: #1d4ed8;
}

/* Comparador por categorías */
.comparador-categorias {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categoria-accordion {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.categoria-header {
  width: 100%;
  background: #1d4ed8;
  color: #fff;
  border: none;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
}

.categoria-header:hover {
  background: #1e40af;
}

.categoria-titulo {
  font-size: 1.2rem;
  font-weight: 700;
}

.categoria-content {
  padding: 1.5rem;
  background: #fff;
}

.candidatos-scroll-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: #1d4ed8 #e5e7eb;
}

.candidatos-scroll-wrapper::-webkit-scrollbar {
  height: 8px;
}

.candidatos-scroll-wrapper::-webkit-scrollbar-track {
  background: #e5e7eb;
  border-radius: 4px;
}

.candidatos-scroll-wrapper::-webkit-scrollbar-thumb {
  background: #1d4ed8;
  border-radius: 4px;
}

.candidatos-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: #1e40af;
}

.candidatos-row-swipe {
  display: flex;
  gap: 1.5rem;
  min-width: min-content;
  padding-bottom: 0.5rem;
}

.candidato-card {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.3s;
  flex: 0 0 auto;
  width: 320px;
  scroll-snap-align: start;
}

.candidato-card:hover {
  border-color: #1d4ed8;
  box-shadow: 0 4px 12px rgba(29,78,216,0.15);
}

.candidato-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.foto-candidato {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #1d4ed8;
  flex-shrink: 0;
}

.candidato-info {
  flex: 1;
  min-width: 0;
}

.candidato-info h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.partido-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.2;
}

.propuestas-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.propuestas-content ul li {
  padding: 0.5rem 0 0.5rem 1.2rem;
  position: relative;
  line-height: 1.5;
  color: #374151;
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
}

.propuestas-content ul li:last-child {
  border-bottom: none;
}

.propuestas-content ul li::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: #1d4ed8;
  font-weight: bold;
}

.accordion-chevron {
  font-size: 1rem;
  color: #fff;
  transition: transform 0.3s;
}

.accordion-chevron.open {
  transform: rotate(180deg);
}

.sin-propuestas {
  color: #9ca3af;
  font-style: italic;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.85rem;
}

.mensaje-vacio {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.mensaje-vacio p {
  font-size: 1.2rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .candidate-card-horizontal {
    width: 200px;
    height: 300px;
  }
  
  .categorias-chips {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .categoria-header {
    padding: 0.75rem 1rem;
  }
  
  .categoria-titulo {
    font-size: 1rem;
  }
  
  .candidato-card {
    width: 280px;
  }
  
  .categoria-content {
    padding: 1rem;
  }
}
</style>