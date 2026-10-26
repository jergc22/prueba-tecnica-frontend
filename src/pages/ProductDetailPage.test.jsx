import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addToCart } from '../api/cart.js'
import { fetchProduct } from '../api/products.js'
import { CartProvider } from '../context/CartProvider.jsx'
import ProductDetailPage from './ProductDetailPage.jsx'

vi.mock('../api/products.js', () => ({ API_BASE_URL: 'http://api.test', fetchProduct: vi.fn() }))
vi.mock('../api/cart.js', () => ({ addToCart: vi.fn() }))

const product = {
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
  secondaryCamera: '',
  dimensions: '191 x 101 mm',
  weight: '260 g',
  colors: [{ code: 1000, name: 'Black' }],
  storages: [{ code: 2000, name: '16 GB' }],
}

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/product/a']}>
      <CartProvider>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </CartProvider>
    </MemoryRouter>,
  )
}

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el nombre del producto, su descripción y pone el título de la página', async () => {
    fetchProduct.mockResolvedValue(product)
    renderDetail()

    expect(await screen.findByRole('heading', { level: 1, name: 'Acer Iconia' })).toBeInTheDocument()
    expect(screen.getByText('Quad-core')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(document.title).toBe('Acer Iconia · Tienda de móviles')
  })

  it('avisa si el producto no se puede cargar y permite reintentar', async () => {
    const user = userEvent.setup()
    fetchProduct.mockRejectedValueOnce(new Error('500')).mockResolvedValueOnce(product)
    renderDetail()

    expect(await screen.findByRole('alert')).toHaveTextContent(/puede que no exista/i)

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Acer Iconia' })).toBeInTheDocument()
  })

  it('muestra un error y no cambia el contador si falla añadir al carrito', async () => {
    const user = userEvent.setup()
    fetchProduct.mockResolvedValue(product)
    addToCart.mockRejectedValue(new Error('fallo'))
    renderDetail()

    await user.click(await screen.findByRole('button', { name: 'Añadir' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no se ha podido añadir/i)
    expect(screen.getByRole('button', { name: 'Añadir' })).toBeEnabled()
  })
})
