import { API_BASE_URL } from './products.js'

/** Añade un producto a la cesta y devuelve el número de productos que informa el API. */
export async function addToCart({ id, colorCode, storageCode }) {
  const response = await fetch(`${API_BASE_URL}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, colorCode, storageCode }),
  })
  if (!response.ok) throw new Error(`Error ${response.status} al añadir al carrito`)

  const { count } = await response.json()
  if (!Number.isFinite(count)) throw new Error('Respuesta del carrito inválida')
  return count
}
