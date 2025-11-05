<template>
  <div>
    <!-- Barra de navegación -->
    <nav class="navbar">
      <div class="navbar-container">
        <NuxtLink to="/" class="navbar-logo" title="Inicio - Tu Candidato">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="#1D4ED8"/>
            <path d="M12 2.5L14.6942 9.20124H21.8042L16.055 13.5975L18.7492 20.2988L12 15.9025L5.25078 20.2988L7.94501 13.5975L2.19579 9.20124H9.30582L12 2.5Z" fill="white"/>
          </svg>
          <span class="navbar-title">Tu <span class="navbar-title-blue">Candidato</span></span>
        </NuxtLink>
        <div class="navbar-menu">
          <NuxtLink to="/" :class="{ active: isActive('/') }">Inicio</NuxtLink>
          <NuxtLink to="/filtroCandidatos" :class="{ active: isActive('/filtroCandidatos') }">Candidatos</NuxtLink>
          <NuxtLink to="/cadem" :class="{ active: isActive('/cadem') }">Encuestas</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Contenido de la página -->
    <slot />

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-card">
        <p>&copy; 2025 Tu Candidato. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRoute } from '#app'

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;800&display=swap');

/* Estilos globales */
body {
  font-family: 'Roboto', Arial, sans-serif !important;
  /* background-image: url('/candidatos.avif'); */
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  min-height: 100vh;
  color: #333;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
  font-family: 'Roboto', Arial, sans-serif !important;
}
</style>

<style scoped>
/* Navbar */
.navbar {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-container {
  max-width: 1100px;
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
  font-family: 'Roboto', Arial, sans-serif !important;
}

.navbar-title-blue {
  color: #1D4ED8;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
}

.navbar-menu a {
  color: #555;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
}

.navbar-menu a:hover {
  color: #1D4ED8;
}

.navbar-menu a.active {
  color: #1D4ED8;
  border-bottom-color: #1D4ED8;
}

/* Footer */
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

/* Responsive */
@media (max-width: 900px) {
  .navbar-container {
    padding: 1rem;
  }
}

@media (max-width: 600px) {
  .navbar-title {
    font-size: 1.3rem;
  }
  
  .navbar-menu {
    gap: 1rem;
  }
  
  .navbar-menu a {
    font-size: 0.9rem;
  }
}
</style>
