import Candidato from '../../models/candidato'
import { connectDB } from '../../db/mongo'

export default defineEventHandler(async (event) => {
  await connectDB()
  const id = event.context.params.id
  return await Candidato.findById(id)
})
