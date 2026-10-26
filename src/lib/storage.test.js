import { afterEach, describe, expect, it, vi } from 'vitest'
import { safeStorage } from './storage.js'

describe('safeStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('guarda y lee valores', () => {
    safeStorage.setItem('a', '1')
    expect(safeStorage.getItem('a')).toBe('1')
  })

  it('sigue funcionando en memoria si localStorage lanza excepciones', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('cuota llena')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })

    expect(() => safeStorage.setItem('b', '2')).not.toThrow()
    expect(safeStorage.getItem('b')).toBe('2')
  })
})
