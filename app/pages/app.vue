<template>
  <div class="card-container">
    <div
      class="card"
      v-for="candidato in candidatos"
      :key="candidato.id"
      @click="irAPresidente(candidato.id)"
    >
      <img :src="candidato.foto" :alt="'Foto ' + candidato.nombre" class="card-image" />
      <div class="card-content">
        <h3 class="card-title">{{ candidato.nombre }}</h3>
        <p class="card-description">{{ candidato.partido }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PresidenteSelector",
  data() {
    return {
      candidatos: [
        {
          id: 1,
          nombre: "Candidato A",
          partido: "Partido de la Innovación",
          foto: "https://picsum.photos/seed/candidato1/400/600",
        },
        {
          id: 2,
          nombre: "Candidato B",
          partido: "Partido Social Verde",
          foto: "https://picsum.photos/seed/candidato2/400/600",
        },
        {
          id: 3,
          nombre: "Candidato C",
          partido: "Movimiento Futuro",
          foto: "https://picsum.photos/seed/candidato3/400/600",
        },
      ],
    };
  },
  methods: {
    irAPresidente(id) {
      // Reemplaza esto por tu lógica de navegación (por ejemplo, Vue Router)
      this.$router.push({ name: "PresidenteInfo", params: { id } });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f0f2f5;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 0;
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