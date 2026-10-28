import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

// Sin mocks de módulos: se ejercita fetch → cachedFetch → mappers → UI con el API simulado.
const list = [
  { id: 'a', brand: 'Acer', model: 'Iconia', price: '170', imgUrl: 'a.jpg' },
  { id: 'b', brand: 'alcatel', model: 'Pixi', price: '', imgUrl: 'b.jpg' },
]
const detail = {
  ...list[0],
  cpu: 'Quad-core',
  ram: '2 GB RAM',
  os: 'Android 6.0',
  displayResolution: '7.0 inches',
  displaySize: '720 x 1280 pixels',
  battery: '3400 mAh',
  primaryCamera: ['13 MP', 'autofocus'],
  secondaryCmera: '2 MP',
  dimentions: '191 x 101 mm',
  weight: '260',
  options: { colors: [{ code: 1000, name: 'Black' }], storages: [{ code: 2000, name: '16 GB' }] },
}

function json(body, ok = true) {
  return Promise.resolve({ ok, status: ok ? 200 : 500, json: () => Promise.resolve(body) })
}

function requestsTo(path) {
  return fetch.mock.calls.filter(([url]) => url.endsWith(path)).length
}

describe('integración con el API simulado', () => {
  let failDetail

  beforeEach(() => {
    failDetail = false
    window.history.pushState({}, '', '/')
    vi.stubGlobal(
      'fetch',
      vi.fn((url, options) => {
        if (options?.method === 'POST') return json({ count: 1 })
        if (url.endsWith('/api/product')) return json(list)
        if (url.endsWith('/api/product/a')) return failDetail ? json({}, false) : json(detail)
        return json({}, false)
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('normaliza los datos del API y no repite peticiones gracias a la caché', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByText('Alcatel')).toBeInTheDocument()
    expect(screen.getByText('Precio no disponible')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /iconia/i }))
    expect(await screen.findByText('720 x 1280 pixels')).toBeInTheDocument()
    expect(screen.getByText('13 MP, autofocus')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /volver al listado/i }))
    await screen.findByText('Alcatel')
    await user.click(screen.getByRole('link', { name: /iconia/i }))
    await screen.findByText('720 x 1280 pixels')

    expect(requestsTo('/api/product')).toBe(1)
    expect(requestsTo('/api/product/a')).toBe(1)
  })

  it('actualiza el breadcrumb cuando el detalle carga tras un reintento', async () => {
    const user = userEvent.setup()
    failDetail = true
    window.history.pushState({}, '', '/product/a')
    render(<App />)

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    const breadcrumbs = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(within(breadcrumbs).getByText('Detalle')).toBeInTheDocument()

    failDetail = false
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await within(breadcrumbs).findByText('Acer Iconia')).toBeInTheDocument()
    expect(document.title).toBe('Acer Iconia · Tienda de móviles')
  })

  it('envía los códigos seleccionados al añadir al carrito', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/product/a')
    render(<App />)

    await user.click(await screen.findByRole('button', { name: 'Añadir' }))

    await screen.findByText('Producto añadido al carrito.')
    const [, options] = fetch.mock.calls.find(([, opts]) => opts?.method === 'POST')
    expect(JSON.parse(options.body)).toEqual({ id: 'a', colorCode: 1000, storageCode: 2000 })
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
  })
})
