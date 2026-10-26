import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchProducts } from '../api/products.js'
import ProductListPage from './ProductListPage.jsx'

vi.mock('../api/products.js', () => ({ fetchProducts: vi.fn() }))

const catalog = [
  { id: 'a', brand: 'Acer', model: 'Iconia', price: 170, imgUrl: 'a.jpg' },
  { id: 'b', brand: 'Alcatel', model: 'Pixi', price: 90, imgUrl: 'b.jpg' },
  { id: 'c', brand: 'Apple', model: 'iPhone 7', price: 500, imgUrl: 'c.jpg' },
]

beforeEach(() => {
  fetchProducts.mockReset()
  fetchProducts.mockResolvedValue(catalog)
})

function renderList(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ProductListPage />
    </MemoryRouter>,
  )
}

describe('ProductListPage', () => {
  it('filtra en tiempo real por marca y por modelo', async () => {
    const user = userEvent.setup()
    renderList()
    await screen.findByText('Iconia')

    await user.type(screen.getByRole('searchbox'), 'al')
    expect(screen.queryByText('Iconia')).not.toBeInTheDocument()
    expect(screen.getByText('Pixi')).toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox'))
    await user.type(screen.getByRole('searchbox'), 'iphone')
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByText('iPhone 7')).toBeInTheDocument()
  })

  it('avisa cuando no hay resultados', async () => {
    const user = userEvent.setup()
    renderList()
    await screen.findByText('Iconia')

    await user.type(screen.getByRole('searchbox'), 'nokia')

    expect(screen.getByText(/no hay productos que coincidan/i)).toBeInTheDocument()
  })

  it('muestra un error y permite reintentar si falla la carga', async () => {
    const user = userEvent.setup()
    fetchProducts.mockRejectedValueOnce(new Error('500'))
    renderList()

    expect(await screen.findByRole('alert')).toHaveTextContent(/no se han podido cargar/i)

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('Iconia')).toBeInTheDocument()
  })

  it('recupera la búsqueda desde la URL', async () => {
    renderList('/?q=acer')
    await screen.findByText('Iconia')

    expect(screen.getByRole('searchbox')).toHaveValue('acer')
    expect(screen.queryByText('Pixi')).not.toBeInTheDocument()
  })
})
