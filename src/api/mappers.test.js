import { describe, expect, it } from 'vitest'
import { mapProductDetail, mapProductSummary, toPrice } from './mappers.js'

const rawDetail = {
  id: 'p1',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
  imgUrl: 'http://img/p1.jpg',
  cpu: 'Quad-core 1.3 GHz',
  ram: '2 GB RAM',
  os: 'Android 6.0',
  displayResolution: '7.0 inches',
  displaySize: '720 x 1280 pixels',
  battery: 'Li-Ion 3400 mAh',
  primaryCamera: ['13 MP', 'autofocus'],
  secondaryCmera: ['2 MP', '720p'],
  dimentions: '191.7 x 101 x 9.4 mm',
  weight: '260',
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [{ code: 2000, name: '16 GB' }],
  },
}

describe('toPrice', () => {
  it('convierte strings numéricos', () => {
    expect(toPrice('170')).toBe(170)
    expect(toPrice('99,5')).toBe(99.5)
  })

  it('devuelve null si está vacío o no es un número', () => {
    expect(toPrice('')).toBeNull()
    expect(toPrice('   ')).toBeNull()
    expect(toPrice(undefined)).toBeNull()
    expect(toPrice('abc')).toBeNull()
  })
})

describe('mapProductSummary', () => {
  it('mapea los campos del listado', () => {
    expect(mapProductSummary(rawDetail)).toEqual({
      id: 'p1',
      brand: 'Acer',
      model: 'Iconia Talk S',
      price: 170,
      imgUrl: 'http://img/p1.jpg',
    })
  })
})

describe('mapProductDetail', () => {
  it('corrige las erratas del API y normaliza arrays a texto', () => {
    const detail = mapProductDetail(rawDetail)

    expect(detail.dimensions).toBe('191.7 x 101 x 9.4 mm')
    expect(detail.secondaryCamera).toBe('2 MP, 720p')
    expect(detail.primaryCamera).toBe('13 MP, autofocus')
    expect(detail.weight).toBe('260 g')
  })

  it('acepta las cámaras como string', () => {
    expect(mapProductDetail({ ...rawDetail, secondaryCmera: '8 MP' }).secondaryCamera).toBe('8 MP')
  })

  it('detecta la resolución aunque pulgadas y píxeles lleguen intercambiados', () => {
    const normal = mapProductDetail(rawDetail)
    const swapped = mapProductDetail({
      ...rawDetail,
      displayResolution: '720 x 1280 pixels',
      displaySize: '7.0 inches',
    })

    expect(normal.screenResolution).toBe('720 x 1280 pixels')
    expect(normal.screenSize).toBe('7.0 inches')
    expect(swapped.screenResolution).toBe('720 x 1280 pixels')
    expect(swapped.screenSize).toBe('7.0 inches')
  })

  it('une con comas los textos que llegan como array', () => {
    expect(mapProductDetail({ ...rawDetail, cpu: ['Hexa-core', '4x1.4 GHz'] }).cpu).toBe('Hexa-core, 4x1.4 GHz')
  })

  it('trata un guion como valor vacío', () => {
    expect(mapProductDetail({ ...rawDetail, dimentions: '-' }).dimensions).toBe('')
  })

  it('deja el precio a null si viene vacío', () => {
    expect(mapProductDetail({ ...rawDetail, price: '' }).price).toBeNull()
  })

  it('devuelve las opciones de color y almacenamiento con sus códigos', () => {
    const detail = mapProductDetail(rawDetail)

    expect(detail.colors).toEqual([{ code: 1000, name: 'Black' }])
    expect(detail.storages).toEqual([{ code: 2000, name: '16 GB' }])
  })

  it('tolera un producto sin opciones', () => {
    const detail = mapProductDetail({ ...rawDetail, options: undefined })

    expect(detail.colors).toEqual([])
    expect(detail.storages).toEqual([])
  })
})
