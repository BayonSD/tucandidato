import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const inputDir = path.join(process.cwd(), 'public', 'presidentes')
const outputDir = path.join(process.cwd(), 'public', 'presidentes_redimensionadas')

// Crea la carpeta de salida si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

// Medidas deseadas
const width = 809
const height = 902

fs.readdirSync(inputDir).forEach(file => {
  const inputPath = path.join(inputDir, file)
  const outputPath = path.join(outputDir, file)

  sharp(inputPath)
    .resize(width, height, { fit: 'cover' })
    .toFile(outputPath)
    .then(() => {
      console.log(`✅ Redimensionada: ${file}`)
    })
    .catch(err => {
      console.error(`❌ Error con ${file}:`, err)
    })
})