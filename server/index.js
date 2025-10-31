require('dotenv').config();
const express = require('express');
const connectDB = require('./db/mongo');

const app = express();

app.use(express.json());

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/api/candidatos', require('./routes/candidatoRoutes'));
app.use('/api/partidos', require('./routes/partidoRoutes'));
app.use('/api/territorios', require('./routes/territorioRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});