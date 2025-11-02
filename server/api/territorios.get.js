import Territorio from '../models/territorios'
import { connectDB } from '../db/mongo'

export default defineEventHandler(async (event) => {
  await connectDB()
  return await Territorio.find()
})
