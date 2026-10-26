import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProductListPage from './ProductListPage.jsx'

vi.mock('../api/products.js', () => ({
  fetchProducts: vi.fn().mockResolvedValue([
    { id: 'a', brand: 'Acer', model: 'Iconia', price: 170, imgUrl: 'a.jpg' },
    { id: 'b', brand: 'Alcatel', model: 'Pixi', price: 90, imgUrl: 'b.jpg' },
    { id: 'c', brand: 'Apple', model: 'iPhone 7', price: 500, imgUrl: 'c.jpg' },
  ]),
}))

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

  it('recupera la búsqueda desde la URL', async () => {
    renderList('/?q=acer')
    await screen.findByText('Iconia')

    expect(screen.getByRole('searchbox')).toHaveValue('acer')
    expect(screen.queryByText('Pixi')).not.toBeInTheDocument()
  })
})
