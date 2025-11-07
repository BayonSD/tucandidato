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
        
        <!-- Botón hamburguesa -->
        <button class="menu-toggle" @click="menuAbierto = !menuAbierto" aria-label="Menú">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <div class="navbar-menu" :class="{ 'menu-abierto': menuAbierto }">
         <NuxtLink to="/" :class="{ active: isActive('/') }" @click="menuAbierto = false">Inicio</NuxtLink>
         <NuxtLink to="/filtroCandidatos" :class="{ active: isActive('/filtroCandidatos') }" @click="menuAbierto = false">Candidatos</NuxtLink>
         <NuxtLink to="/comparar" :class="{ active: isActive('/filtrarCandidato') }" @click="menuAbierto = false">Comparar Candidato</NuxtLink>
         <NuxtLink to="/cadem" :class="{ active: isActive('/cadem') }" @click="menuAbierto = false">Encuestas</NuxtLink>
         <NuxtLink to="/quienesSomos" :class="{ active: isActive('/quienesSomos') }" @click="menuAbierto = false">Quiénes Somos</NuxtLink>
         <NuxtLink to="/contactanos" :class="{ active: isActive('/contactanos') }" @click="menuAbierto = false">Contáctanos</NuxtLink>
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
import { ref } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const menuAbierto = ref(false)

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
  position: relative;
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

/* Botón hamburguesa - oculto en desktop */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 0.5rem;
}

.menu-toggle:hover {
  color: #1D4ED8;
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

@media (max-width: 768px) {
  .navbar-container {
    padding: 1rem 1.5rem;
  }
  
  .navbar-title {
    font-size: 1.5rem;
  }
  
  .menu-toggle {
    display: block;
    margin-left: auto;
    flex-shrink: 0;
  }
  
  .navbar-logo {
    flex-shrink: 0;
  }
  
  .navbar-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    gap: 0;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .navbar-menu.menu-abierto {
    max-height: 400px;
  }
  
  .navbar-menu a {
    padding: 1rem 2rem;
    border-bottom: 1px solid #f0f0f0;
    border-left: none;
  }
  
  .navbar-menu a.active {
    border-bottom: 1px solid #f0f0f0;
    border-left: 4px solid #1D4ED8;
  }
}

@media (max-width: 600px) {
  .navbar-container {
    padding: 0.75rem 1rem;
  }
  
  .navbar-title {
    font-size: 1.2rem;
  }
}
</style>
