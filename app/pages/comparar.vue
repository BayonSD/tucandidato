<template>
  <div class="comparativa-container">
    <h2 class="comparar-titulo">Comparar Candidatos Presidenciales</h2>
    <div class="comparador-selectores">
      <div class="candidates-scroll-container">
        <div
          v-for="candidato in presidenciales"
          :key="candidato._id"
          :class="['candidate-card-horizontal', id1 === candidato._id ? 'selected' : '']"
          @click="id1 = candidato._id"
        >
          <img :src="candidato.fotoUrl || defaultFoto" class="candidate-img" />
          <div class="candidate-info-gradient">
            <h3>{{ candidato.Nombre }} {{ candidato['Primer  Apellido'] }} {{ candidato['Segundo  Apellido'] }}</h3>
            <p class="candidate-partido"><strong>Lista/Nómina:</strong> {{ candidato['Lista/Nómina'] }}</p>
            <p class="candidate-partido"><strong>Partido:</strong> {{ candidato['Nombre  Partido'] }}</p>
            <span v-if="id1 === candidato._id" class="selected-label">Candidato 1</span>
          </div>
        </div>
      </div>
      <div class="candidates-scroll-container">
        <div
          v-for="candidato in presidenciales"
          :key="candidato._id"
          :class="['candidate-card-horizontal', id2 === candidato._id ? 'selected' : '']"
          @click="id2 = candidato._id"
        >
          <img :src="candidato.fotoUrl || defaultFoto" class="candidate-img" />
          <div class="candidate-info-gradient">
            <h3>{{ candidato.Nombre }} {{ candidato['Primer  Apellido'] }} {{ candidato['Segundo  Apellido'] }}</h3>
            <p class="candidate-partido"><strong>Lista/Nómina:</strong> {{ candidato['Lista/Nómina'] }}</p>
            <p class="candidate-partido"><strong>Partido:</strong> {{ candidato['Nombre  Partido'] }}</p>
            <span v-if="id2 === candidato._id" class="selected-label">Candidato 2</span>
          </div>
        </div>
      </div>
      <button @click="comparar" :disabled="!id1 || !id2 || id1 === id2" class="candidate-btn">Comparar</button>
    </div>
    <div v-if="candidato1 && candidato2" class="comparador-datos">
      <div class="candidato-col">
        <h2>{{ candidato1.Nombre }} {{ candidato1['Primer  Apellido'] }} {{ candidato1['Segundo  Apellido'] }}</h2>
        <img :src="candidato1.fotoUrl || defaultFoto" alt="Foto" class="perfil-foto" />
        <p><strong>Partido:</strong> {{ candidato1['Nombre  Partido'] }}</p>
        <p><strong>Lista/Nómina:</strong> {{ candidato1['Lista/Nómina'] }}</p>
        <p><strong>Región:</strong> {{ candidato1['Región'] }}</p>
        <section v-if="candidato1.cvContenido">
        <div v-if="candidato1.cvContenido.formacion && candidato1.cvContenido.formacion.length > 0" class="cv-section">
            <h3>🎓 Formación</h3>
            <ul v-if="Array.isArray(candidato1.cvContenido.formacion)">
            <li v-for="(item, index) in candidato1.cvContenido.formacion" :key="index">
                {{ item }}
            </li>
            </ul>
            <p v-else class="cv-single-item">
            {{ candidato1.cvContenido.formacion }}
            </p>
        </div>
          <h3>💼 Experiencia</h3>
          <ul>
            <li v-for="(item, index) in candidato1.cvContenido.experiencia" :key="index">{{ item }}</li>
          </ul>
          <h3>🏆 Logros</h3>
          <ul>
            <li v-for="(item, index) in candidato1.cvContenido.logros" :key="index">{{ item }}</li>
          </ul>
          <h3>📚 Fuentes</h3>
          <ul>
            <li v-for="(fuente, index) in candidato1.fuentes" :key="index">
              <a v-if="fuente.startsWith('http')" :href="fuente" target="_blank" rel="noopener">{{ fuente }}</a>
              <span v-else>{{ fuente }}</span>
            </li>
          </ul>
        </section>
      </div>
      <div class="candidato-col">
        <h2>{{ candidato2.Nombre }} {{ candidato2['Primer  Apellido'] }} {{ candidato2['Segundo  Apellido'] }}</h2>
        <img :src="candidato2.fotoUrl || defaultFoto" alt="Foto" class="perfil-foto" />
        <p><strong>Partido:</strong> {{ candidato2['Nombre  Partido'] }}</p>
        <p><strong>Lista/Nómina:</strong> {{ candidato2['Lista/Nómina'] }}</p>
        <p><strong>Región:</strong> {{ candidato2['Región'] }}</p>
        <section v-if="candidato2.cvContenido">
            <div v-if="candidato2.cvContenido.formacion && candidato2.cvContenido.formacion.length > 0" class="cv-section">
                <h3>🎓 Formación</h3>
                <ul v-if="Array.isArray(candidato2.cvContenido.formacion)">
                <li v-for="(item, index) in candidato2.cvContenido.formacion" :key="index">
                    {{ item }}
                </li>
                </ul>
                <p v-else class="cv-single-item">
                {{ candidato2.cvContenido.formacion }}
                </p>
            </div>
          <h3>💼 Experiencia</h3>
          <ul>
            <li v-for="(item, index) in candidato2.cvContenido.experiencia" :key="index">{{ item }}</li>
          </ul>
          <h3>🏆 Logros</h3>
          <ul>
            <li v-for="(item, index) in candidato2.cvContenido.logros" :key="index">{{ item }}</li>
          </ul>
          <h3>📚 Fuentes</h3>
          <ul>
            <li v-for="(fuente, index) in candidato2.fuentes" :key="index">
              <a v-if="fuente.startsWith('http')" :href="fuente" target="_blank" rel="noopener">{{ fuente }}</a>
              <span v-else>{{ fuente }}</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const candidatos = ref([])
const id1 = ref('')
const id2 = ref('')
const candidato1 = ref(null)
const candidato2 = ref(null)
const defaultFoto = 'https://picsum.photos/seed/presidente/400/600'

const fetchCandidatos = async () => {
  const res = await fetch('/api/candidatos')
  candidatos.value = await res.json()
}

const presidenciales = computed(() =>
  candidatos.value.filter(c => c["Tipo  Eleccion"] === "PRESIDENTE")
)

const comparar = async () => {
  if (id1.value && id2.value && id1.value !== id2.value) {
    const res1 = await fetch(`/api/candidatos/${id1.value}`)
    candidato1.value = await res1.json()
    const res2 = await fetch(`/api/candidatos/${id2.value}`)
    candidato2.value = await res2.json()
  }
}

onMounted(fetchCandidatos)
</script>

<style scoped>
.comparativa-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.comparar-titulo {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}
.comparador-selectores {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: stretch;
  margin-bottom: 2rem;
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
  border: 3px solid transparent;
}
.candidate-card-horizontal.selected {
  border: 3px solid #1d4ed8;
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
.selected-label {
  background: #1d4ed8;
  color: #fff;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  position: absolute;
  top: 10px;
  right: 10px;
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
  margin-top: 1rem;
}
.candidate-btn:disabled {
  background: #a5b4fc;
  cursor: not-allowed;
}
.comparador-datos {
  display: flex;
  gap: 2rem;
}
.candidato-col {
  flex: 1;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px #0001;
  padding: 1rem;
}
.perfil-foto {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e0e0e0;
  margin-bottom: 1rem;
}
.candidato-col h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.candidato-col section {
  margin-top: 1.5rem;
}
.candidato-col h3 {
  color: #1d4ed8;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px solid #e5e7eb;
}
.candidato-col ul {
  list-style: none;
  padding-left: 0;
}
.candidato-col ul li {
  padding: 0.5rem 0;
  padding-left: 1.2rem;
  position: relative;
  line-height: 1.5;
  color: #374151;
}
.candidato-col ul li::before {
  content: "▸";
  position: absolute;
  left: 0;
  color: #1d4ed8;
  font-weight: bold;
}
.candidato-col a {
  color: #1d4ed8;
  text-decoration: none;
  word-break: break-all;
}
.candidato-col a:hover {
  text-decoration: underline;
}
</style>