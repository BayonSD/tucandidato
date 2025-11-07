import Partido from '../models/partido'
import { connectDB } from '../db/mongo'

export default defineEventHandler(async (event) => {
  await connectDB()
  return await Partido.find()
})
