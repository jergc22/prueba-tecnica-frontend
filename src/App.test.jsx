import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

vi.mock('./api/products.js', () => ({
  fetchProducts: vi.fn().mockResolvedValue([
    { id: 'a', brand: 'Acer', model: 'Iconia', price: 170, imgUrl: 'a.jpg' },
    { id: 'b', brand: 'Alcatel', model: 'Pixi', price: null, imgUrl: 'b.jpg' },
  ]),
}))

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('muestra el listado de productos con su precio o aviso de precio no disponible', async () => {
    render(<App />)

    expect(await screen.findByText('Iconia')).toBeInTheDocument()
    expect(screen.getByText('Pixi')).toBeInTheDocument()
    expect(screen.getByText('Precio no disponible')).toBeInTheDocument()
  })
})
