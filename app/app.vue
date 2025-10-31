<template>
  <section class="presidenciales">
    <h2>Candidatos Presidenciales</h2>
    <div class="card-container">
      <div
        class="card"
        v-for="candidato in presidenciales"
        :key="candidato._id"
        @click="irAPresidente(candidato._id)"
      >
        <img :src="candidato.fotoUrl || defaultFoto" :alt="'Foto ' + candidato.nombre_completo" class="card-image" />
        <div class="card-content">
          <h3 class="card-title">{{ candidato.nombre_completo }}</h3>
          <p class="card-description">{{ candidato.lista_nomina }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const candidatos = ref([])
const defaultFoto = 'https://picsum.photos/seed/presidente/400/600'

const fetchCandidatos = async () => {
  const res = await fetch('/api/candidatos')
  candidatos.value = await res.json()
}

const presidenciales = computed(() =>
  candidatos.value.filter(c => c.tipo_eleccion === 'PRESIDENTE')
)

const irAPresidente = (id) => {
  // Reemplaza por tu lógica de navegación
  // Ejemplo: navigateTo(`/presidente/${id}`)
}

fetchCandidatos()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f0f2f5;
}

.presidenciales {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 0;
}

.presidenciales h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
}

.card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease-in-out;
  height: 450px;
  cursor: pointer;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease-in-out;
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
  color: white;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.4s ease-in-out;
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.card-description {
  font-size: 1rem;
  margin: 0;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.card:hover .card-image {
  transform: scale(1.1);
}

.card:hover .card-content {
  transform: translateY(0);
  opacity: 1;
}

.card-container:hover > .card:not(:hover) {
  opacity: 0.6;
  transform: scale(0.95);
}
</style>