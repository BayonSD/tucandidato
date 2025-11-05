import Parser from 'rss-parser'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const nombre = query.nombre
  const tipo = query.tipo

  if (!nombre || !tipo) {
    throw createError({ statusCode: 400, message: 'Faltan parámetros' })
  }

  // Construir búsqueda
  const busqueda = `${nombre} ${tipo} Chile`
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(busqueda)}&hl=es-CL&gl=CL&ceid=CL:es-419`

  const parser = new Parser()
  const feed = await parser.parseURL(url)

  // Filtrar solo noticias de los últimos 7 días
  const unaSemanaMs = 7 * 24 * 60 * 60 * 1000
  const ahora = Date.now()

  let noticias = feed.items
    .filter(item => {
      const fecha = new Date(item.pubDate).getTime()
      return ahora - fecha <= unaSemanaMs
    })
    .slice(0, 5)
    .map(item => ({
      titulo: item.title,
      medio: item.source?.name || 'Desconocido',
      fecha: item.pubDate,
      resumen: item.contentSnippet || '',
      url: item.link
    }))

  // Si no hay noticias de la última semana, mostrar las 5 más recientes sin filtrar
  if (noticias.length === 0) {
    noticias = feed.items
      .slice(0, 5)
      .map(item => ({
        titulo: item.title,
        medio: item.source?.name || 'Desconocido',
        fecha: item.pubDate,
        resumen: item.contentSnippet || '',
        url: item.link
      }))
  }

  return { noticias }
})