# Objetivos de la página

La base de datos ya está preparada. Los objetivos principales del sitio son:

1. **Mostrar candidatos presidenciales**
   - Listar todos los candidatos a la presidencia con su información principal.

2. **Encuestas Cadem**
   - Presentar los resultados y evolución de las encuestas Cadem relacionadas a los candidatos presidenciales.

3. **Ver a qué candidatos corresponde por región y comuna (senadores y diputados)**
   - Permitir al usuario seleccionar una región y comuna para ver los candidatos a senador y diputado que corresponden a esa zona.

4. **Información principal de cada candidato (presidente)**
   - Al seleccionar un candidato presidencial, mostrar su información principal (biografía, propuestas, partido político, etc.).

5. **Filtrar búsquedas por partido político**
   - Permitir filtrar la lista de candidatos por partido político para facilitar la búsqueda y comparación.

---

## Página principal (Landing Page)

En la página principal se mostrarán:

- El listado de los candidatos presidenciales.
- Resultados y evolución de las encuestas Cadem.
- Un contrarreloj que muestre los meses, días y horas que faltan para la elección presidencial.
- Información sobre la página, aclarando que es un sitio independiente.

## Página general de candidatos

Tendremos una página dedicada a los candidatos, que funcionará como buscador y filtrador:

- Filtros por partido político, por lista/nomina y por tipo de candidatura.
- Permite buscar y comparar candidatos fácilmente.

## Página de los candidatos presidenciales

En la página dedicada a cada candidato presidencial se mostrará:

- Foto del candidato.
- Información principal del candidato (extraída de la base de datos).

En un bloque adicional de la misma página:

- Resultados de la encuesta Cadem relacionados al candidato.
- Currículum vitae (CV) del candidato.
- Propuesta de gobierno.
- Sección de últimas noticias del candidato (obtenidas mediante una API externa).
