// Capa anticorrupción: el API trae erratas (dimentions, secondaryCmera), campos intercambiados
// (displayResolution / displaySize), precios como string, a veces vacíos, y textos que
// unas veces llegan como string y otras como array. Aquí se traduce todo a un modelo propio.

const EMPTY = ''
const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

// Algún texto llega con entidades HTML literales (p. ej. "upgrad&#1072;ble").
function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const number = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1))
      return Number.isFinite(number) ? String.fromCodePoint(number) : match
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match
  })
}

function toText(value) {
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(', ')
  if (value === null || value === undefined) return EMPTY
  const text = decodeEntities(String(value).trim())
  return text === '-' ? EMPTY : text
}

// El API trae alguna marca en minúsculas ("alcatel").
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function toPrice(value) {
  const text = toText(value)
  if (text === EMPTY) return null
  const number = Number(text.replace(',', '.'))
  return Number.isFinite(number) ? number : null
}

// En el API displayResolution trae a veces las pulgadas y displaySize los píxeles (y al revés).
// Se decide por el contenido: la resolución es la que tiene forma "720 x 1280 pixels".
function splitDisplay(a, b) {
  const first = toText(a)
  const second = toText(b)
  const looksLikeResolution = (text) => /\d+\s*x\s*\d+/i.test(text)
  if (looksLikeResolution(first) && !looksLikeResolution(second)) return { resolution: first, size: second }
  return { resolution: second, size: first }
}

export function mapProductSummary(raw) {
  return {
    id: raw.id,
    brand: capitalize(toText(raw.brand)),
    model: toText(raw.model),
    price: toPrice(raw.price),
    imgUrl: raw.imgUrl,
  }
}

export function mapProductDetail(raw) {
  const { resolution, size } = splitDisplay(raw.displayResolution, raw.displaySize)
  const weight = toText(raw.weight)
  return {
    ...mapProductSummary(raw),
    cpu: toText(raw.cpu),
    ram: toText(raw.ram),
    os: toText(raw.os),
    screenSize: size,
    screenResolution: resolution,
    battery: toText(raw.battery),
    primaryCamera: toText(raw.primaryCamera),
    secondaryCamera: toText(raw.secondaryCmera),
    dimensions: toText(raw.dimentions),
    weight: weight && /^\d+(\.\d+)?$/.test(weight) ? `${weight} g` : weight,
    colors: (raw.options?.colors ?? []).map(({ code, name }) => ({ code, name })),
    storages: (raw.options?.storages ?? []).map(({ code, name }) => ({ code, name })),
  }
}
