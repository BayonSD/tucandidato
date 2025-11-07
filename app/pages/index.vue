<template>
  <div class="main-container">
      <!-- Hero y cuenta regresiva -->
      <header class="content-card hero">
        <h1>Elecciones Presidenciales 2025</h1>
        <p class="hero-subtitle">Faltan:</p>
        <div class="countdown">
          <div class="countdown-block">
            <span class="countdown-number">{{ countdown.days }}</span>
            <span class="countdown-label">Días</span>
          </div>
          <div class="countdown-block">
            <span class="countdown-number">{{ countdown.hours }}</span>
            <span class="countdown-label">Horas</span>
          </div>
          <div class="countdown-block">
            <span class="countdown-number">{{ countdown.minutes }}</span>
            <span class="countdown-label">Minutos</span>
          </div>
          <div class="countdown-block">
            <span class="countdown-number">{{ countdown.seconds }}</span>
            <span class="countdown-label">Segundos</span>
          </div>
        </div>
      </header>

      <main>
        <!-- Candidatos (scroll horizontal) -->
        <section id="candidatos" class="content-card section-candidatos">
          <h2>Conoce a los Candidatos</h2>
          <div class="candidates-scroll-container">
            <div
              v-for="candidato in presidenciales"
              :key="candidato._id"
              class="candidate-card-horizontal"
            >
            <img :src="candidato.fotoUrl || defaultFoto" class="candidate-img" />
              <div class="candidate-info-gradient">
                <h3>{{ candidato.Nombre }} {{ candidato['Primer  Apellido'] }} {{ candidato['Segundo  Apellido'] }}</h3>
                <p class="candidate-partido"><strong>Lista/Nómina:</strong> {{ candidato['Lista/Nómina'] }}</p>
                <p class="candidate-partido"><strong>Partido:</strong> {{ candidato['Nombre  Partido'] }}</p>
                <a :href="`/candidato/${candidato._id}`" class="candidate-btn">Ver Perfil</a>
              </div>
            </div>
          </div>
        </section>

                <section class="content-card section-navigation">
          <div class="nav-grid">
            <!-- Busca los candidatos -->
            <div class="nav-card">
              <h3>🔍 Busca los Candidatos</h3>
              <p>Explora todos los candidatos presidenciales y conoce sus perfiles, propuestas y trayectorias políticas.</p>
              <NuxtLink to="/filtroCandidatos" class="nav-btn">Ver Candidatos</NuxtLink>
            </div>

            <!-- Compara candidatos -->
            <div class="nav-card">
              <h3>⚖️ Compara Candidatos</h3>
              <p>Compara las propuestas y perfiles de los candidatos presidenciales para tomar una decisión informada.</p>
              <NuxtLink to="/comparar" class="nav-btn">Comparar Ahora</NuxtLink>
            </div>

            <!-- Encuestas -->
            <div class="nav-card">
              <h3>📊 Encuestas</h3>
              <p>Revisa las últimas encuestas de opinión y conoce las preferencias electorales de los chilenos.</p>
              <NuxtLink to="/cadem" class="nav-btn">Ver Encuestas</NuxtLink>
            </div>

            <!-- Quiénes somos -->
            <div class="nav-card">
              <h3>👥 Quiénes Somos</h3>
              <p>Conoce más sobre nuestro proyecto y nuestro compromiso con la transparencia electoral.</p>
              <NuxtLink to="/quienesSomos" class="nav-btn">Conocer Más</NuxtLink>
            </div>
          </div>
        </section>



        <!-- Preguntas frecuentes (FAQ) -->
        <section id="faq" class="content-card section-faq">
          <h2>Preguntas Frecuentes</h2>
          <div class="faq-list">
            <div class="faq-item" v-for="(faq, i) in faqs" :key="i">
              <button
                class="faq-question"
                :aria-expanded="faq.open"
                @click="toggleFaq(i)"
              >
                <span>{{ faq.question }}</span>
                <span class="faq-chevron" :class="{ open: faq.open }">&#9660;</span>
              </button>
              <div class="faq-answer" v-show="faq.open">
                <p v-html="faq.answer"></p>
                <a v-if="faq.link" :href="faq.link" target="_blank" rel="noopener" class="faq-link">Consultar en SERVEL</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const candidatos = ref([])
const defaultFoto = 'https://picsum.photos/seed/presidente/400/600'

const fetchCandidatos = async () => {
  const res = await fetch('/api/candidatos')
  candidatos.value = await res.json()
}

const presidenciales = computed(() =>
  candidatos.value.filter(c => c["Tipo  Eleccion"] === "PRESIDENTE")
)

const irAPresidente = (id) => {
  console.log('Navegando a candidato:', id)
  router.push(`/candidato/${id}`)
}

onMounted(() => {
  fetchCandidatos()
})

// Cuenta regresiva
const countdown = ref({
  days: '--',
  hours: '--',
  minutes: '--',
  seconds: '--'
})

const updateCountdown = () => {
  // Domingo 16 de noviembre de 2025, 8:00 AM (hora local Chile)
  const electionDate = new Date(2025, 10, 16, 8, 0, 0).getTime()
  const now = new Date().getTime()
  const distance = electionDate - now

  if (distance < 0) {
    countdown.value = { days: '00', hours: '00', minutes: '00', seconds: '00' }
    return
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  const pad = (num) => (num < 10 ? '0' + num : num)
  countdown.value = {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds)
  }
}

onMounted(() => {
  updateCountdown()
  setInterval(updateCountdown, 1000)
})

// FAQ
const faqs = ref([
  {
    question: '¿Cuándo son las elecciones?',
    answer: 'La próxima elección presidencial de Chile está programada para el <b>domingo 21 de noviembre de 2025</b>.',
    open: false
  },
  {
    question: '¿Qué necesito para votar?',
    answer: 'Para votar, solo necesitas tu <b>Cédula de Identidad (Carnet)</b> o <b>Pasaporte</b>, los cuales pueden estar vencidos hasta 12 meses antes del día de la elección. No se acepta ningún otro documento (ej. licencia de conducir, comprobante de carnet en trámite).',
    open: false
  },
  {
    question: '¿Dónde me toca votar?',
    answer: 'Puedes consultar tu local de votación y si has sido designado vocal de mesa en el sitio web oficial del SERVEL (Servicio Electoral de Chile), generalmente un mes antes de la elección. El voto es obligatorio para todos los habilitados para sufragar.',
    link: 'https://consulta.servel.cl/',
    open: false
  }
])

const toggleFaq = (i) => {
  faqs.value[i].open = !faqs.value[i].open
}
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
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.content-card {
  background-color: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  margin-bottom: 2rem;
}

.hero {
  text-align: center;
  padding: 2.5rem 1.5rem;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #222;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #1D4ED8;
  font-weight: 500;
  margin-top: 1rem;
}

.countdown {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.countdown-block {
  background: #f3f4f6;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  min-width: 80px;
}

.countdown-number {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1D4ED8;
  display: block;
}

.countdown-label {
  font-size: 1rem;
  color: #555;
  margin-top: 0.3rem;
}

.section-candidatos h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #222;
  text-align: center;
}

.candidates-scroll-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
}

.candidate-card-horizontal {
  flex: 0 0 auto;
  width: 70vw;
  max-width: 300px;
  height: 450px;
  position: relative;
  background: #fff;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  scroll-snap-align: center;
  transition: transform 0.3s;
  cursor: pointer;
}

.candidate-card-horizontal:hover {
  transform: translateY(-5px);
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
  padding: 1.2rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%);
  color: #fff;
}

.candidate-info-gradient h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.candidate-partido {
  font-size: 1rem;
  font-weight: 500;
  color: #cce3ff;
  margin-bottom: 1rem;
}

.candidate-btn {
  background: #1d4ed8;
  color: #fff;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-block;
}

.candidate-btn:hover {
  background: #2563eb;
}

.section-encuestas h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #222;
  text-align: center;
}

.encuestas-list {
  margin-bottom: 1rem;
}

.encuesta-bar {
  margin-bottom: 1.2rem;
}

.encuesta-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 1.1rem;
}

.encuesta-percent {
  font-weight: 700;
}

.encuesta-bar-bg {
  background: #e5e7eb;
  border-radius: 999px;
  height: 1.1rem;
  width: 100%;
  overflow: hidden;
}

.encuesta-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s;
}

.encuesta-bar-fill.blue {
  background: #1d4ed8;
}
.encuesta-bar-fill.red {
  background: #dc2626;
}
.encuesta-bar-fill.gray {
  background: #6b7280;
}
.encuesta-bar-fill.lightgray {
  background: #d1d5db;
}

.encuesta-source {
  text-align: right;
  font-size: 0.95rem;
  color: #666;
  margin-top: 1rem;
  font-style: italic;
}

.section-faq h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #222;
  text-align: center;
}

.faq-list {
  margin-top: 1rem;
}

.faq-item {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.faq-question {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 1.15rem;
  font-weight: 600;
  color: #222;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.2s;
}

.faq-question:hover {
  color: #1d4ed8;
}

.faq-chevron {
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.faq-chevron.open {
  transform: rotate(180deg);
}

.faq-answer {
  margin-top: 0.7rem;
  color: #444;
  font-size: 1rem;
}

.faq-link {
  color: #1d4ed8;
  text-decoration: underline;
  margin-top: 0.5rem;
  display: inline-block;
}

.faq-link {
  color: #1d4ed8;
  text-decoration: underline;
  margin-top: 0.5rem;
  display: inline-block;
}

/* Sección de navegación */
.section-navigation {
  padding: 2rem;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.nav-card {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid rgba(29, 78, 216, 0.1);
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(29, 78, 216, 0.15);
}

.nav-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1rem;
}

.nav-card p {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.nav-btn {
  background: #1d4ed8;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s, transform 0.2s;
}

.nav-btn:hover {
  background: #2563eb;
  transform: scale(1.05);
}

@media (max-width: 900px) {
  .main-container {
    padding: 1rem;
  }
  .nav-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .candidates-scroll-container {
    gap: 0.7rem;
  }
  .candidate-card-horizontal {
    height: 320px;
    max-width: 220px;
  }
}

@media (max-width: 600px) {
  .main-container {
    padding: 0.5rem;
  }
  .content-card {
    padding: 1rem;
  }
  .candidate-card-horizontal {
    height: 180px;
    max-width: 90vw;
  }
}
</style>