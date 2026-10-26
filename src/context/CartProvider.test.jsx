import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addToCart } from '../api/cart.js'
import Header from '../components/Header.jsx'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from './CartProvider.jsx'
import { useCart } from './useCart.js'

vi.mock('../api/cart.js', () => ({ addToCart: vi.fn() }))

function AddButton() {
  const { addItem } = useCart()
  return (
    <button type="button" onClick={() => addItem({ id: 'p1', colorCode: 1000, storageCode: 2000 }).catch(() => {})}>
      añadir
    </button>
  )
}

function renderApp() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <Header />
        <AddButton />
      </CartProvider>
    </MemoryRouter>,
  )
}

describe('CartProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('empieza en 0 y actualiza la cabecera con el contador que devuelve el API', async () => {
    addToCart.mockResolvedValue(3)
    const user = userEvent.setup()
    renderApp()
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')

    await user.click(screen.getByRole('button', { name: 'añadir' }))

    expect(addToCart).toHaveBeenCalledWith({ id: 'p1', colorCode: 1000, storageCode: 2000 })
    expect(await screen.findByText('3')).toBeInTheDocument()
  })

  it('persiste el contador entre recargas', async () => {
    addToCart.mockResolvedValue(2)
    const user = userEvent.setup()
    const first = renderApp()
    await user.click(screen.getByRole('button', { name: 'añadir' }))
    await screen.findByText('2')
    first.unmount()

    renderApp()

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
  })

  it('no cambia el contador si el API falla', async () => {
    addToCart.mockRejectedValue(new Error('fallo'))
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('button', { name: 'añadir' }))

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
  })
})
