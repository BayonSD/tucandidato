<template>
  <div class="perfil-container">
    <div v-if="error" class="perfil-error">
      <h2>No se encontró el candidato</h2>
      <p>Verifica el enlace o vuelve a la página de candidatos.</p>
    </div>
    <!-- Sección principal: datos desde MongoDB -->
    <header class="content-card perfil-header">
      <img
        :src="candidato.fotoUrl || defaultFoto"
        alt="Foto del Candidato"
        class="perfil-foto"
      >
      <div class="perfil-info">
        <h1>{{ candidato.nombre_completo }}</h1>
        <p class="perfil-partido">{{ candidato.lista_nomina }}</p>
        <p class="perfil-lema" v-if="candidato.lema">"{{ candidato.lema }}"</p>
        <div class="perfil-redes">
          <a v-if="candidato.twitter" :href="candidato.twitter" target="_blank" title="Twitter">
            <svg><!-- icono Twitter --></svg>
          </a>
          <a v-if="candidato.facebook" :href="candidato.facebook" target="_blank" title="Facebook">
            <svg><!-- icono Facebook --></svg>
          </a>
          <a v-if="candidato.instagram" :href="candidato.instagram" target="_blank" title="Instagram">
            <svg><!-- icono Instagram --></svg>
          </a>
          <a v-if="candidato.web" :href="candidato.web" target="_blank" title="Sitio Web">
            <svg><!-- icono Web --></svg>
          </a>
        </div>
      </div>
    </header>

    <!-- Secciones manuales (solo presidentes) -->
    <main>
      <section class="content-card perfil-biografia">
        <h2>Biografía</h2>
        <p>{{ candidato.biografia }}</p>
      </section>

      <section class="content-card perfil-cv">
        <h2>Trayectoria y Experiencia</h2>
        <!-- Aquí puedes mostrar candidato.cv o un timeline manual -->
      </section>

      <section class="content-card perfil-propuestas">
        <h2>Propuestas de Gobierno</h2>
        <ul>
          <li v-for="(propuesta, i) in candidato.propuestas" :key="i">{{ propuesta }}</li>
        </ul>
      </section>

      <section class="content-card perfil-noticias">
        <h2>Noticias Relevantes</h2>
        <ul>
          <li v-for="(noticia, i) in candidato.noticias" :key="i">{{ noticia }}</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const candidato = ref({})
const error = ref(false)
const defaultFoto = 'https://placehold.co/150x150/E0E0E0/7F7F7F?text=Candidato'

onMounted(async () => {
  try {
    const res = await fetch(`/api/candidatos/${route.params.id}`)
    if (!res.ok) throw new Error('No encontrado')
    const data = await res.json()
    if (!data || Object.keys(data).length === 0) throw new Error('No encontrado')
    candidato.value = data
  } catch (e) {
    error.value = true
  }
})
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
  font-size: 1.2rem;
  color: #1d4ed8;
  font-weight: 600;
  margin-bottom: 0.5rem;
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