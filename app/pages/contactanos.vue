<template>
  <div class="contacto-container">
    <h1>Contáctanos</h1>
    <p>
      ¿Tienes una sugerencia, quieres reportar información errónea o aportar datos?
      Escríbenos directamente a nuestro correo:
    </p>
    <div class="correo-contacto">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;margin-right:8px;">
        <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.5-.5a.5.5 0 0 0-.5.5v.217l8 5.333 8-5.333V6.5a.5.5 0 0 0-.5-.5h-15Zm15.5 2.383-7.646 5.096a1 1 0 0 1-1.108 0L3.5 8.383V17.5a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V8.383Z" fill="#1D4ED8"/>
      </svg>
      <a href="mailto:bayonsd.dev@gmail.com">bayonsd.dev@gmail.com</a>
    </div>
    <p style="margin-top:1.5rem;">¡Gracias por ayudarnos a mejorar!</p>
  </div>
</template>

<style scoped>
.contacto-container {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  text-align: center;
}
.correo-contacto {
  margin: 1.5rem 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
a {
  color: #1D4ED8;
  font-weight: 700;
  text-decoration: underline;
}
</style>