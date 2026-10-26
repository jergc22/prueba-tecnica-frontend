import { describe, expect, it, vi } from 'vitest'
import { cachedFetch, ONE_HOUR } from './cachedFetch.js'

function createStorage() {
  const data = new Map()
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  }
}

function okResponse(body) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) }
}

describe('cachedFetch', () => {
  it('pide al API la primera vez y guarda la respuesta', async () => {
    const fetchFn = vi.fn().mockResolvedValue(okResponse({ a: 1 }))
    const storage = createStorage()

    const data = await cachedFetch('k1', '/url', { fetchFn, storage, now: () => 1000 })

    expect(data).toEqual({ a: 1 })
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(JSON.parse(storage.getItem('cache:k1'))).toEqual({ timestamp: 1000, data: { a: 1 } })
  })

  it('usa la copia mientras no haya pasado la hora', async () => {
    const fetchFn = vi.fn().mockResolvedValue(okResponse({ a: 1 }))
    const storage = createStorage()
    let time = 0

    await cachedFetch('k2', '/url', { fetchFn, storage, now: () => time })
    time = ONE_HOUR - 1
    const data = await cachedFetch('k2', '/url', { fetchFn, storage, now: () => time })

    expect(data).toEqual({ a: 1 })
    expect(fetchFn).toHaveBeenCalledTimes(1)
  })

  it('vuelve a pedir al API cuando se cumple la hora y actualiza la marca de tiempo', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(okResponse({ version: 1 }))
      .mockResolvedValueOnce(okResponse({ version: 2 }))
    const storage = createStorage()
    let time = 0

    await cachedFetch('k3', '/url', { fetchFn, storage, now: () => time })
    time = ONE_HOUR
    const data = await cachedFetch('k3', '/url', { fetchFn, storage, now: () => time })

    expect(data).toEqual({ version: 2 })
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(JSON.parse(storage.getItem('cache:k3')).timestamp).toBe(ONE_HOUR)
  })

  it('elimina la entrada caducada si la nueva petición falla', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(okResponse({ a: 1 }))
      .mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve({}) })
    const storage = createStorage()
    let time = 0

    await cachedFetch('k7', '/url', { fetchFn, storage, now: () => time })
    time = ONE_HOUR
    await expect(cachedFetch('k7', '/url', { fetchFn, storage, now: () => time })).rejects.toThrow()

    expect(storage.getItem('cache:k7')).toBeNull()
  })

  it('no guarda las respuestas con error', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) })
    const storage = createStorage()

    await expect(cachedFetch('k4', '/url', { fetchFn, storage })).rejects.toThrow(/500/)
    expect(storage.getItem('cache:k4')).toBeNull()
  })

  it('ignora una entrada corrupta en el almacenamiento', async () => {
    const fetchFn = vi.fn().mockResolvedValue(okResponse({ ok: true }))
    const storage = createStorage()
    storage.setItem('cache:k5', 'esto no es json')

    const data = await cachedFetch('k5', '/url', { fetchFn, storage })

    expect(data).toEqual({ ok: true })
  })

  it('comparte una sola petición si se pide lo mismo a la vez', async () => {
    const fetchFn = vi.fn().mockResolvedValue(okResponse({ a: 1 }))
    const storage = createStorage()

    await Promise.all([
      cachedFetch('k6', '/url', { fetchFn, storage }),
      cachedFetch('k6', '/url', { fetchFn, storage }),
    ])

    expect(fetchFn).toHaveBeenCalledTimes(1)
  })
})
