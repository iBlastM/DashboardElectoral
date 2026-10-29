# Propuestas de nuevos módulos y funcionalidades

Este documento resume el análisis del proyecto Dashboard Electoral y evalúa cuatro propuestas de nuevas funcionalidades, indicando cuáles conviene incorporar directamente a ese proyecto y cuáles conviene desarrollar como un módulo o sistema independiente. Cada propuesta se presenta con su problema, su descripción y una propuesta de solución.

---

## 1. Matriz de rentabilidad electoral por sección (Bastión / Oportunidad / Crítica / Riesgo)

**Ubicación recomendada:** Incorporar al Dashboard Electoral actual, como una nueva vista de análisis.

### Problema
Hoy el dashboard muestra resultados electorales por sección (votos, participación, partido ganador), pero no ofrece una lectura estratégica que indique dónde conviene enfocar el esfuerzo de campaña o de estructura territorial. Ver que una sección tiene, por ejemplo, 40% de votos para un partido no dice si esa sección es fácil de retener, si está en riesgo de perderse, o si representa una oportunidad de crecimiento. Sin esta clasificación, la asignación de recursos (visitas, promotores, gasto) se decide de forma intuitiva y no con base en información comparativa histórica.

### Descripción
Una gráfica y un mapa que clasifican cada sección, para un partido específico y un tipo de elección, en una de cuatro categorías:

- **Bastión / Estrella:** buen resultado y con tendencia al alza. Se recomienda mantener la inversión.
- **Oportunidad:** resultado todavía bajo, pero con tendencia positiva. Se recomienda invertir recursos ahora.
- **Crítica:** resultado bajo y con tendencia a la baja. Se recomienda evaluar una reconstrucción de estructura.
- **Riesgo:** buen resultado actual, pero con tendencia a la baja. Se recomienda defender la posición antes de perderla.

La clasificación se calcula comparando el resultado actual contra el resultado de la elección anterior del mismo tipo, y se muestra tanto en una gráfica de comparación como en un mapa donde cada sección se colorea según su categoría.

### Propuesta de solución
- Aprovechar la información electoral que ya existe en el proyecto (resultados por sección de Ayuntamientos, Diputaciones y Gubernatura, en distintos años).
- Definir para cada sección dos valores: el resultado actual del partido y el cambio respecto a la elección anterior comparable. Con esos dos valores se determina en cuál de las cuatro categorías cae la sección.
- Agregar una nueva vista en el panel (similar a las secciones de análisis territorial ya existentes) que incluya:
  - Una gráfica de comparación con las secciones distribuidas en los cuatro cuadrantes.
  - Un mapa donde cada sección se pinta según su categoría.
  - Un resumen con el número de secciones en cada categoría.
  - Filtros por partido, tipo de elección, municipio, distrito y sección, usando los mismos filtros que ya existen en el panel.

---

## 2. Índice de Afinidad Partidista con pesos configurables entre tipos de elección

**Ubicación recomendada:** Incorporar al Dashboard Electoral actual, como complemento de la vista anterior.

### Problema
Un mismo partido puede tener resultados distintos en la misma sección según el tipo de elección (gubernatura, ayuntamiento, diputación), porque hay electores que votan de forma diferenciada según el cargo. Analizar cada elección por separado no permite ver la tendencia real y consolidada de un partido en una sección, ni distinguir entre una zona de afinidad ideológica (voto a gobernador) y una de vínculo territorial (voto a alcalde, normalmente más ligado a estructura y cercanía). Hoy no existe una forma de combinar estas señales en un solo indicador que además se pueda ajustar según el criterio de análisis.

### Descripción
Un índice compuesto que combina, con pesos que el usuario puede ajustar, el resultado del partido en tres tipos de elección:

- Gubernatura (afinidad ideológica), con un peso sugerido de 40%.
- Ayuntamiento (vínculo territorial), con un peso sugerido de 35%.
- Diputación local o federal por distrito, con un peso sugerido de 25%.

El índice se calcula por sección y se compara entre dos años electorales (por ejemplo 2021 contra 2024) para detectar si la posición del partido en esa sección está mejorando o empeorando. Con el resultado, cada sección se clasifica en categorías como Bastión, Competitiva, Adversa, Adversa profunda, Oportunidad o Sin datos, y se colorea en un mapa.

### Propuesta de solución
- Tomar los resultados por sección de los tres tipos de elección que ya están disponibles en el proyecto.
- Calcular el margen de ventaja del partido en cada tipo de elección y combinarlo usando los pesos definidos.
- Incluir en el panel controles deslizantes para que el usuario ajuste los tres pesos (que deben sumar 100%), con un botón para restaurar los valores por defecto y otro para recalcular y volver a colorear el mapa.
- Mostrar un resumen con el número de secciones por categoría y un indicador que muestre cómo cambió el índice global entre los dos años comparados.
- Permitir filtrar por municipio, distrito, sección y categoría, y exportar el resultado a un archivo descargable.
- Considerar que no todas las secciones tendrán información disponible para los tres tipos de elección en todos los años, por lo que se debe contemplar una categoría de "sin datos" para esos casos.

---

## 3. Generador de dashboards a partir de una base de datos subida por el usuario, con mapa y filtros automáticos

**Ubicación recomendada:** Desarrollar como un módulo o sistema independiente, no dentro del Dashboard Electoral.

### Problema
Cada vez que se cuenta con una nueva base de datos con información geográfica (por ejemplo, beneficiarios de un programa social, apoyos entregados, padrones, etc.), se requiere construir manualmente un dashboard a la medida: definir columnas, filtros, mapa y resúmenes. Esto genera dependencia de trabajo de desarrollo para cada nueva base y tiempos de entrega largos, cuando lo que realmente se necesita muchas veces es simplemente "ver estos datos en un mapa y poder filtrarlos" de forma inmediata. Además, este tipo de bases (programas sociales, censos, padrones) no tiene relación directa con el contenido electoral del proyecto actual, por lo que integrarlas ahí generaría una mezcla de temas que no corresponde.

### Descripción
Una herramienta donde el usuario:

1. Sube un archivo con información (por ejemplo un Excel o CSV) que incluya datos de ubicación, ya sea coordenadas o una dirección/colonia que se pueda ubicar en el mapa.
2. El sistema identifica automáticamente las columnas de la base (texto, número, fecha, categoría) y genera filtros para cada una, sin que alguien tenga que programarlos.
3. Se genera de inmediato un dashboard con:
   - Un mapa central que puede mostrarse agrupado por zonas, como mapa de calor (densidad), o coloreado por categoría.
   - Indicadores generales (total de registros, cuántos tienen ubicación, cuántos no, principales categorías).
   - Una tabla de registros que se puede exportar.
4. El dashboard se genera al momento, sin necesidad de desarrollo adicional para cada base nueva.

### Propuesta de solución
- Construir una herramienta separada, pensada para recibir cualquier base con datos de ubicación, no solo información electoral.
- Incluir un proceso de carga de archivos que detecte automáticamente qué tipo de dato tiene cada columna, y que identifique cuáles corresponden a ubicación (coordenadas o dirección/colonia). Si la base no trae coordenadas pero sí dirección o colonia, contemplar un proceso de ubicación automática en el mapa a partir de esos datos.
- Generar los filtros de forma automática según las columnas detectadas, permitiendo combinarlos.
- Construir el mapa con las mismas capacidades ya usadas en el proyecto electoral (agrupación por zoom, mapa de calor, coloreado por categoría), de modo que la experiencia sea consistente.
- Si la información que se sube contiene datos personales o sensibles (por ejemplo, beneficiarios de programas sociales), este módulo debe contar con control de acceso y usuarios autorizados, igual que ya existe en el panel electoral, y evitar que quede disponible sin restricción.
- Se recomienda que sea un módulo aparte porque sirve para cualquier tipo de base con ubicación (programas sociales, salud, infraestructura, etc.), no solo para información electoral, y su forma de trabajar (cargar archivos con estructura variable cada vez) es distinta a la del panel electoral, que maneja una estructura de datos fija y conocida.

---

## 4. Agrupación de incidencias y generación de rutas para atención en campo

**Ubicación recomendada:** Desarrollar como un módulo o sistema independiente, no dentro del Dashboard Electoral.

### Problema
Un sistema que recibe reportes ciudadanos de incidencias (baches, alumbrado defectuoso, fugas, etc.) con su ubicación, acumula con el tiempo un volumen alto de reportes dispersos geográficamente. Atenderlos uno por uno sin agruparlos por cercanía hace que los operadores pierdan tiempo trasladándose de un punto a otro sin un orden lógico, y no se prioriza correctamente considerando urgencia o antigüedad del reporte. Se necesita convertir una lista de incidencias sueltas en un plan de trabajo ordenado y eficiente para cada operador.

### Descripción
Considerando el ejemplo revisado (parámetros como hora de inicio de jornada, minutos de atención por reporte, velocidad promedio de traslado, prioridad por antigüedad del reporte, bonificación si está vencido o es urgente, y la posibilidad de generar la ruta de forma automática o seleccionando manualmente una zona en el mapa), la solución consiste en:

1. **Agrupación:** juntar los reportes que están geográficamente cerca entre sí y/o que son del mismo tipo de incidencia.
2. **Priorización:** dentro de cada grupo, ordenar los reportes según su urgencia, antigüedad y otros criterios configurables.
3. **Generación de ruta:** calcular el orden más eficiente para visitar los puntos de un grupo, partiendo de una ubicación inicial (por ejemplo, la base del operador), respetando el tiempo disponible de la jornada laboral.
4. El resultado es un plan de ruta por operador, con el orden de visitas y el tiempo estimado para completarlas.

### Propuesta de solución
- Construir un sistema separado, enfocado en la gestión de incidencias y atención en campo, con su propio registro de reportes (descripción, tipo, ubicación, fecha, estatus).
- Incorporar un proceso de agrupación automática de incidencias por cercanía geográfica y tipo, de forma que el sistema identifique "zonas de atención" en lugar de puntos aislados.
- A partir de cada zona, calcular el orden de visita más eficiente considerando el punto de partida del operador, el tiempo de traslado estimado y el tiempo de atención por reporte, respetando las horas disponibles de la jornada.
- Incluir en el panel los mismos parámetros configurables vistos en el ejemplo: hora de inicio de jornada, minutos de atención por reporte, velocidad promedio de traslado, criterios de prioridad (antigüedad, urgencia) y la opción de generar la ruta de forma automática o eligiendo manualmente una zona en el mapa.
- Mostrar el resultado como un plan de ruta claro y exportable, que el operador pueda seguir en campo.
- Se recomienda que este desarrollo sea independiente porque atiende un problema operativo distinto (mantenimiento urbano y atención ciudadana), con su propia información (reportes, operadores, rutas, estatus de atención) y un ciclo de vida distinto al de los datos electorales, que son históricos y no cambian una vez capturados.

---

## Resumen

| Propuesta | Dónde se recomienda ubicarla | Motivo |
|---|---|---|
| 1. Matriz de rentabilidad electoral (Bastión / Oportunidad / Crítica / Riesgo) | Dashboard Electoral | Usa la misma información electoral por sección que ya existe en el proyecto; es una nueva forma de analizarla. |
| 2. Índice de Afinidad Partidista con pesos ajustables | Dashboard Electoral | Combina las mismas fuentes de información electoral (ayuntamiento, gubernatura, diputaciones) ya presentes en el proyecto. |
| 3. Generador de dashboards desde una base subida con datos de ubicación | Módulo independiente | Es una herramienta genérica, útil para cualquier base con datos de ubicación, no exclusiva del tema electoral. |
| 4. Agrupación de incidencias y generación de rutas de atención | Módulo independiente | Atiende un problema operativo distinto (gestión de incidencias urbanas), sin relación con los resultados electorales. |
