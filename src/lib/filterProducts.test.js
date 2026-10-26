import { describe, expect, it } from 'vitest'
import { filterProducts } from './filterProducts.js'

const products = [
  { id: '1', brand: 'Acer', model: 'Iconia Talk S' },
  { id: '2', brand: 'Alcatel', model: 'Pixi 4' },
  { id: '3', brand: 'Apple', model: 'iPhone 7' },
  { id: '4', brand: 'Acer', model: 'Liquid Z630' },
]

const ids = (list) => list.map((p) => p.id)

describe('filterProducts', () => {
  it('devuelve todo si la búsqueda está vacía', () => {
    expect(filterProducts(products, '')).toHaveLength(4)
    expect(filterProducts(products, '   ')).toHaveLength(4)
  })

  it('filtra por marca', () => {
    expect(ids(filterProducts(products, 'acer'))).toEqual(['1', '4'])
  })

  it('filtra por modelo', () => {
    expect(ids(filterProducts(products, 'pixi'))).toEqual(['2'])
  })

  it('ignora mayúsculas y acentos', () => {
    expect(ids(filterProducts(products, 'IPHONE'))).toEqual(['3'])
    expect(ids(filterProducts([{ id: '9', brand: 'Sony', model: 'Xpería' }], 'xperia'))).toEqual(['9'])
  })

  it('combina marca y modelo en la misma búsqueda', () => {
    expect(ids(filterProducts(products, 'acer liquid'))).toEqual(['4'])
  })

  it('devuelve vacío si no hay coincidencias', () => {
    expect(filterProducts(products, 'nokia')).toEqual([])
  })
})
