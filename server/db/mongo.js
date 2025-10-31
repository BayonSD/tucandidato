
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elecciones_chile_2025'

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}