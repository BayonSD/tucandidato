import Parser from 'rss-parser'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const nombre = query.nombre // Ejemplo: "José Antonio Kast"
  const tipo = query.tipo     // Ejemplo: "presidente"

  if (!nombre || !tipo) {
    throw createError({ statusCode: 400, message: 'Faltan parámetros' })
  }

  // Construir búsqueda
  const busqueda = `${nombre} ${tipo} Chile`

  // Usar Google News RSS (gratis)
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(busqueda)}&hl=es-CL&gl=CL&ceid=CL:es-419`

  const parser = new Parser()
  const feed = await parser.parseURL(url)

  // Formatear noticias
  const noticias = feed.items.slice(0, 5).map(item => ({
    titulo: item.title,
    medio: item.source?.name || 'Desconocido',
    fecha: item.pubDate,
    resumen: item.contentSnippet || '',
    url: item.link
  }))

  return { noticias }
})