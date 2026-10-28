import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

vi.mock('./api/products.js', () => ({
  API_BASE_URL: 'http://api.test',
  fetchProducts: vi.fn().mockResolvedValue([
    { id: 'a', brand: 'Acer', model: 'Iconia', price: 170, imgUrl: 'a.jpg' },
    { id: 'b', brand: 'Alcatel', model: 'Pixi', price: null, imgUrl: 'b.jpg' },
  ]),
  fetchProduct: vi.fn().mockResolvedValue({
    id: 'a',
    brand: 'Acer',
    model: 'Iconia',
    price: 170,
    imgUrl: 'a.jpg',
    cpu: 'Quad-core',
    ram: '2 GB',
    os: 'Android',
    screenSize: '7.0 inches',
    screenResolution: '720 x 1280',
    battery: '3400 mAh',
    primaryCamera: '13 MP',
    secondaryCamera: '2 MP',
    dimensions: '191 x 101 mm',
    weight: '260 g',
    colors: [{ code: 1000, name: 'Black' }],
    storages: [{ code: 2000, name: '16 GB' }],
  }),
}))

vi.mock('./api/cart.js', () => ({ addToCart: vi.fn().mockResolvedValue(1) }))

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('muestra el listado con su precio o el aviso de precio no disponible', async () => {
    render(<App />)

    expect(await screen.findByText('Iconia')).toBeInTheDocument()
    expect(screen.getByText('Pixi')).toBeInTheDocument()
    expect(screen.getByText('Precio no disponible')).toBeInTheDocument()
  })

  it('navega al detalle, muestra el breadcrumb y añade al carrito', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByRole('link', { name: /iconia/i }))

    expect(await screen.findByRole('button', { name: 'Añadir' })).toBeEnabled()
    const breadcrumbs = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(within(breadcrumbs).getByText('Acer Iconia')).toBeInTheDocument()
    expect(within(breadcrumbs).getByRole('link', { name: 'Inicio' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Añadir' }))

    expect(await screen.findByText('Producto añadido al carrito.')).toBeInTheDocument()
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
  })

  it('muestra un aviso en una ruta que no existe', () => {
    window.history.pushState({}, '', '/no-existe')
    render(<App />)

    expect(screen.getByText('Página no encontrada.')).toBeInTheDocument()
    expect(document.title).toBe('Página no encontrada · Tienda de móviles')
  })

  it('vuelve al listado conservando la búsqueda', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/?q=acer')
    render(<App />)

    await user.click(await screen.findByRole('link', { name: /iconia/i }))
    await user.click(await screen.findByRole('link', { name: /volver al listado/i }))

    expect(await screen.findByRole('searchbox')).toHaveValue('acer')
  })
})
