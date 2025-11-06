<template>
  <div class="perfil-container">
    <div v-if="error" class="perfil-error">
      <h2>No se encontró el candidato</h2>
      <p>Verifica el enlace o vuelve a la página de candidatos.</p>
    </div>
    
    <div v-else-if="candidato && candidato._id">
      <!-- Sección principal: datos desde MongoDB -->
      <header class="content-card perfil-header">
        <img :src="candidato.fotoUrl || defaultFoto" alt="Foto del Candidato" class="perfil-foto">
        <div class="perfil-info">
          <h1>{{ candidato.Nombre }} {{ candidato['Primer  Apellido'] }} {{ candidato['Segundo  Apellido'] }}</h1>
          <p class="perfil-partido"><strong>Lista/Nómina:</strong> {{ candidato['Lista/Nómina'] }}</p>
          <p class="perfil-partido"><strong>Partido:</strong> {{ candidato['Nombre  Partido'] || 'Sin partido' }}</p>
          <p class="perfil-info-extra"><strong>Sexo:</strong> {{ candidato.Sexo === 'H' ? 'Hombre' : 'Mujer' }}</p>
          <p class="perfil-info-extra"><strong>Rango:</strong> {{ candidato.Rango }}</p>
          <p class="perfil-info-extra"><strong>Región:</strong> {{ candidato['Región'] }}</p>
        </div>
      </header>

      <!-- Secciones adicionales -->
      <main>
        <section class="content-card perfil-biografia">
          <h2>Información del Candidato</h2>
          <p>Tipo de elección: {{ candidato['Tipo  Eleccion'] }}</p>
          <p>Territorio Electoral: {{ candidato['Territorio  Electoral'] }}</p>
        </section>

        <section
          v-if="candidato.propuestaPDF"
          class="content-card perfil-propuestas"
        >
          <h2>📋 Propuesta de Gobierno</h2>
          <div class="pdf-controls">
            <a
              :href="candidato.propuestaPDF"
              target="_blank"
              class="btn-abrir"
            >
              🔗 Abrir en nueva pestaña
            </a>
            <a
              :href="candidato.propuestaPDF"
              download
              class="btn-descargar"
            >
              📥 Descargar PDF
            </a>
          </div>
          <div class="pdf-viewer">
            <iframe
              :src="candidato.propuestaPDF"
              width="100%"
              height="800px"
              frameborder="0"
            />
          </div>
        </section>

      <section v-if="candidato.cvContenido" class="content-card perfil-cv">
        <h2>📋 Curriculum Vitae</h2>
        
        <div v-if="candidato.cvContenido.formacion && candidato.cvContenido.formacion.length > 0" class="cv-section">
          <h3>🎓 Formación</h3>
          <ul v-if="Array.isArray(candidato.cvContenido.formacion)">
            <li v-for="(item, index) in candidato.cvContenido.formacion" :key="index">
              {{ item }}
            </li>
          </ul>
          <p v-else class="cv-single-item">
            {{ candidato.cvContenido.formacion }}
          </p>
        </div>

        <div v-if="candidato.cvContenido.experiencia && candidato.cvContenido.experiencia.length > 0" class="cv-section">
          <h3>💼 Experiencia</h3>
          <ul>
            <li v-for="(exp, index) in candidato.cvContenido.experiencia" :key="index">
              {{ exp }}
            </li>
          </ul>
        </div>

        <div v-if="candidato.cvContenido.logros && candidato.cvContenido.logros.length > 0" class="cv-section">
          <h3>🏆 Logros</h3>
          <ul>
            <li v-for="(logro, index) in candidato.cvContenido.logros" :key="index">
              {{ logro }}
            </li>
          </ul>
        </div>

        <div v-if="candidato.fuentes && candidato.fuentes.length > 0" class="cv-section">
          <h3>📚 Fuentes</h3>
          <ul>
            <li v-for="(fuente, index) in candidato.fuentes" :key="index">
              <a v-if="fuente.startsWith('http')" :href="fuente" target="_blank" rel="noopener">{{ fuente }}</a>
              <span v-else>{{ fuente }}</span>
            </li>
          </ul>
        </div>
      </section>

        <section class="content-card perfil-noticias">
          <h2>📰 Últimas Noticias</h2>
          <div v-if="loadingNoticias">Cargando noticias...</div>
          <ul v-else>
            <li v-for="noticia in noticias" :key="noticia.url" class="noticia-item">
              <a :href="noticia.url" target="_blank" rel="noopener">
                <strong>{{ noticia.titulo }}</strong>
              </a>
              <div class="noticia-meta">
                <span>{{ noticia.medio }}</span> ·
                <span>{{ noticia.fecha }}</span>
              </div>
              <p>{{ noticia.resumen }}</p>
            </li>
          </ul>
          <div v-if="!loadingNoticias && noticias.length === 0">
            <em>No se encontraron noticias recientes.</em>
          </div>
        </section>
      </main>
    </div>
    
    <div v-else class="perfil-loading">
      <p>Cargando información del candidato...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const candidato = ref({})
const error = ref(false)
const defaultFoto = 'https://placehold.co/150x150/E0E0E0/7F7F7F?text=Candidato'

// Noticias
const noticias = ref([])
const loadingNoticias = ref(false)

const fetchNoticias = async () => {
  loadingNoticias.value = true
  noticias.value = []
  try {
    const nombreCompleto = `${candidato.value.Nombre} ${candidato.value['Primer  Apellido']} ${candidato.value['Segundo  Apellido']}`.trim()
    const tipo = candidato.value['Tipo  Eleccion'] || candidato.value.tipo_eleccion || 'presidente'
    if (!nombreCompleto) throw new Error('Nombre vacío')
    const res = await fetch(`/api/noticias?nombre=${encodeURIComponent(nombreCompleto)}&tipo=${encodeURIComponent(tipo)}`)
    if (!res.ok) throw new Error('Error noticias')
    const data = await res.json()
    noticias.value = data.noticias
  } catch (e) {
    noticias.value = []
  } finally {
    loadingNoticias.value = false
  }
}

const fetchCandidato = async () => {
  error.value = false
  try {
    const res = await fetch(`/api/candidatos/${route.params.id}`)
    if (!res.ok) throw new Error('No encontrado')
    const data = await res.json()
    if (!data || Object.keys(data).length === 0) throw new Error('No encontrado')
    candidato.value = data
    await fetchNoticias() // <-- Llama a noticias después de cargar candidato
  } catch (e) {
    error.value = true
  }
}

onMounted(fetchCandidato)
watch(() => route.params.id, fetchCandidato)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.perfil-error {
  background: #fee2e2;
  color: #b91c1c;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  text-align: center;
}

.perfil-loading {
  background: #e0f2fe;
  color: #0369a1;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.2rem;
}

body, html, * {
  font-family: 'Roboto', Arial, sans-serif !important;
}

.perfil-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.content-card {
  background-color: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
}

.perfil-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.perfil-foto {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.perfil-info h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.perfil-partido {
  font-size: 1.1rem;
  color: #1d4ed8;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.perfil-info-extra {
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.3rem;
}

.perfil-lema {
  font-size: 1rem;
  color: #555;
  font-style: italic;
  margin-bottom: 1rem;
}

.perfil-redes a {
  margin-right: 1rem;
  color: #555;
  transition: color 0.2s;
}
.perfil-redes a:hover {
  color: #1d4ed8;
}

.perfil-biografia, .perfil-cv, .perfil-propuestas, .perfil-noticias {
  padding: 2rem;
}

.perfil-biografia h2,
.perfil-cv h2,
.perfil-propuestas h2,
.perfil-noticias h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}


.pdf-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-abrir,
.btn-descargar {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-abrir {
  background: #1d4ed8;
  color: white;
}

.btn-abrir:hover {
  background: #1e40af;
  transform: translateY(-2px);
}

.btn-descargar {
  background: #10b981;
  color: white;
}

.btn-descargar:hover {
  background: #059669;
  transform: translateY(-2px);
}

.pdf-viewer {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #f9fafb;
  margin-bottom: 1rem;
}

.pdf-viewer iframe {
  display: block;
}

.perfil-cv {
  margin-top: 2rem;
}

.cv-section {
  margin-bottom: 2rem;
}

.cv-section h3 {
  color: #1d4ed8;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.cv-section p {
  line-height: 1.8;
  color: #4b5563;
}

.cv-section ul {
  list-style: none;
  padding-left: 0;
}

.cv-section ul li {
  padding: 0.75rem 0;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.6;
  color: #374151;
}

.cv-section ul li::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: #1d4ed8;
  font-weight: bold;
}

.cv-section a {
  color: #1d4ed8;
  text-decoration: none;
  word-break: break-all;
}

.cv-section a:hover {
  text-decoration: underline;
}

.cv-single-item {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  color: #374151;
  margin-bottom: 1rem;
  font-style: italic;
}

@media (max-width: 700px) {
  .perfil-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
  .perfil-biografia, .perfil-cv, .perfil-propuestas, .perfil-noticias {
    padding: 1rem;
  }
}
</style>