import Lista from '../models/lista'
import { connectDB } from '../db/mongo'

export default defineEventHandler(async (event) => {
  await connectDB()
  return await Lista.find()
})
