# Tienda de móviles

SPA en React para comprar dispositivos móviles. Tiene dos vistas:

- **Listado:** todos los productos y un buscador en tiempo real.
- **Detalle:** descripción del producto, selección de almacenamiento y color, y añadir a la cesta.

Consume el API de `https://itx-frontend-test.onrender.com`.

## Arranque rápido

Solo hace falta Docker (y `make`):

```bash
make up
```

Construye la aplicación y la sirve con nginx en http://localhost:8080. Para pararla: `make down`.

El API está en un plan gratuito de Render. Si lleva un rato sin uso, la primera petición puede tardar unos 50 segundos mientras el servidor arranca, y la aplicación lo avisa en pantalla.

`make help` lista todos los comandos. Sin `make`: `docker compose up -d --build`.

### Scripts

Con Node 22+:

```bash
npm ci          # instalar dependencias
npm start       # desarrollo en http://localhost:5173
npm run build   # build de producción en dist/
npm test        # tests
npm run lint    # linter
```

`make test-docker` pasa el lint y los tests dentro de Docker, sin tener Node instalado.

## Stack

- React 19, React Router 7 y Vite.
- Vitest y Testing Library.
- ESLint.
- CSS propio, sin librerías de componentes.

## Estructura

```
src/
  api/         llamadas al API y mappers que traducen sus datos a un modelo propio
  lib/         caché en cliente, almacenamiento seguro, filtro, formato
  hooks/       useAsync (datos asíncronos) y usePageTitle
  context/     carrito (Context + Provider)
  components/  Header, Breadcrumbs, SearchBar, ProductCard, ProductImage, ProductDescription, ProductActions
  pages/       ProductListPage y ProductDetailPage
```

## Decisiones

### Una capa que traduce los datos del API

El API tiene varias particularidades, y los mappers de `src/api/mappers.js` las traducen a un modelo limpio. El resto de la aplicación no las conoce:

- Erratas en los nombres de campo: `dimentions` y `secondaryCmera`.
- `displayResolution` y `displaySize` llegan intercambiados (uno trae las pulgadas y otro los píxeles). Decido cuál es cuál por el contenido: la resolución es la que tiene la forma `720 x 1280`. Así sigue funcionando si algún día lo corrigen.
- El precio es un string y en 6 productos llega vacío. Se guarda como `null` y se muestra "Precio no disponible".
- Algunos textos llegan unas veces como string y otras como array (cámaras, CPU, sistema operativo). Se unen con comas.
- Algún texto trae entidades HTML literales, que se decodifican, y alguna marca viene en minúsculas.
- `-` o un campo vacío se muestran como "—".

### Caché en cliente

`cachedFetch(key, url)` en `src/lib/cachedFetch.js` guarda cada respuesta (el listado y cada detalle) con su marca de tiempo en `localStorage`. Durante una hora se sirve desde ahí; pasado ese tiempo se vuelve a pedir al API.

- Las respuestas con error no se guardan.
- Una entrada corrupta, sin datos o con una marca de tiempo en el futuro (reloj cambiado) se descarta.
- Si dos componentes piden lo mismo a la vez, se hace una sola petición.
- El reloj, el almacenamiento y `fetch` se pueden inyectar, así que la expiración se prueba con tiempo simulado.

`localStorage` puede fallar (modo privado, cuota llena), por eso todo acceso pasa por `safeStorage`: va envuelto en `try/catch` y, si falla, usa una copia en memoria.

### Carrito con Context

El estado global es un solo número, así que basta un Context con su Provider y no hace falta Redux. El contador que se muestra es el que devuelve el API al añadir, como pide el enunciado. Se persiste en `localStorage` para que sobreviva a recargas.

El API de pruebas devuelve siempre `count: 1`. He preferido mostrar fielmente lo que responde en vez de sumar en cliente y tener dos fuentes de verdad.

### Búsqueda en la URL

El texto del buscador vive en la URL (`?q=`). Así se conserva al ir al detalle y volver, se puede compartir y funciona con atrás y adelante. Se actualiza con `replace` para no llenar el historial.

El filtro busca todas las palabras escritas en "marca modelo", sin distinguir mayúsculas ni acentos.

### Detalle

- Los selectores de almacenamiento y color son radios estilizados, así que se usan con teclado. Si solo hay una opción, se muestra seleccionada. Si hay varias, el botón "Añadir" explica que hay que elegir.
- Mientras se añade, el botón no pierde el foco. Si el API falla, se muestra un error y el contador no cambia.
- "Volver al listado" retrocede en el historial si se llegó desde la aplicación, con lo que se recuperan la búsqueda y el scroll. Con acceso directo a la URL, lleva al listado.

### Otros detalles

- Grid de un máximo de 4 columnas, adaptable: 2 en móvil y una sola columna en el detalle.
- Estados de carga (avisando de la posible espera de Render), de error con reintento y de "sin resultados".
- Breadcrumbs, título de la pestaña según la página y scroll arriba al entrar en una página nueva.
- Accesibilidad: un `h1` por página, landmarks, `fieldset`/`legend` en los selectores y el contador del carrito anunciado a lectores de pantalla.

## Tests

53 tests:

- Caché con tiempo simulado: expiración a la hora, errores, entradas corruptas o del futuro y peticiones simultáneas.
- Mappers con las particularidades del API.
- Filtro del buscador.
- Selección por defecto con una sola opción.
- Contador del carrito y su persistencia.
- Páginas con carga, error y reintento.
- Un test de integración que recorre listado, detalle y carrito con el API simulado y comprueba que la caché evita repetir peticiones.

## Mejoras futuras

- TypeScript: los mappers ya marcan la frontera de tipos con el API.
- *Stale-while-revalidate* en la caché, y una purga de las entradas caducadas al arrancar.
- Pruebas end-to-end con Playwright contra el API real.
- Debounce al actualizar la URL desde el buscador.
