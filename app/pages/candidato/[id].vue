<template>
  <div class="perfil-container">
    <div v-if="error" class="perfil-error">
      <h2>No se encontró el candidato</h2>
      <p>Verifica el enlace o vuelve a la página de candidatos.</p>
    </div>
    
    <div v-else-if="candidato && candidato._id">
      <!-- Sección principal: datos desde MongoDB -->
      <header class="content-card perfil-header">
        <img
          :src="candidato.fotoUrl || defaultFoto"
          alt="Foto del Candidato"
          class="perfil-foto"
        >
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

const fetchCandidato = async () => {
  error.value = false
  try {
    const res = await fetch(`/api/candidatos/${route.params.id}`)
    if (!res.ok) throw new Error('No encontrado')
    const data = await res.json()
    if (!data || Object.keys(data).length === 0) throw new Error('No encontrado')
    candidato.value = data
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