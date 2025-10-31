<template>
  <div class="card-container">
    <div v-for="candidato in candidatos" :key="candidato._id" class="card">
      <div class="card-content">
        <h2 class="card-title">{{ candidato.nombre_completo }}</h2>
        <p class="card-description">{{ candidato.tipo_eleccion }} - {{ candidato.region }}</p>
        <p>{{ candidato.lista_nomina }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const candidatos = ref([])

onMounted(async () => {
  const res = await fetch('/api/candidatos')
  candidatos.value = await res.json()
})
</script>

<style scoped>
/* Puedes copiar tus estilos de app.vue aquí */
</style>ss