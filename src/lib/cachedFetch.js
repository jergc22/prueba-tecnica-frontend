import { safeStorage } from './storage.js'

export const ONE_HOUR = 60 * 60 * 1000
const PREFIX = 'cache:'

// Peticiones en curso por clave: dos componentes que piden lo mismo a la vez comparten una sola.
const inFlight = new Map()

function readEntry(storage, key) {
  const raw = storage.getItem(PREFIX + key)
  if (!raw) return null
  try {
    const entry = JSON.parse(raw)
    return typeof entry?.timestamp === 'number' ? entry : null
  } catch {
    return null
  }
}

/**
 * Devuelve el JSON de `url`, usando una copia en cliente mientras no haya pasado `ttl`.
 * Pasado ese tiempo se vuelve a pedir al API y se guarda la nueva respuesta con su marca de tiempo.
 * Las respuestas con error no se guardan.
 */
export async function cachedFetch(
  key,
  url,
  { ttl = ONE_HOUR, storage = safeStorage, now = Date.now, fetchFn = (...args) => fetch(...args) } = {},
) {
  const entry = readEntry(storage, key)
  if (entry && now() - entry.timestamp < ttl) return entry.data

  if (inFlight.has(key)) return inFlight.get(key)

  const request = fetchFn(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Error ${response.status} al pedir ${url}`)
      return response.json()
    })
    .then((data) => {
      storage.setItem(PREFIX + key, JSON.stringify({ timestamp: now(), data }))
      return data
    })
    .finally(() => inFlight.delete(key))

  inFlight.set(key, request)
  return request
}
