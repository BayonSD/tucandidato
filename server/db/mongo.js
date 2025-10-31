const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elecciones_chile_2025';

async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectada: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectada, intentando reconectar...');
      setTimeout(connectDB, 5000);
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexión a MongoDB cerrada');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDB;