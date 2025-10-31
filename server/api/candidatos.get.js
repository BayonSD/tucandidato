import Candidato from '../models/candidato'
import { connectDB } from '../db/mongo'

export default defineEventHandler(async (event) => {
  await connectDB()
  return await Candidato.find()
})
