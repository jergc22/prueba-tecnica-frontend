import { cachedFetch } from '../lib/cachedFetch.js'
import { mapProductDetail, mapProductSummary } from './mappers.js'

export const API_BASE_URL = 'https://itx-frontend-test.onrender.com'

export async function fetchProducts() {
  const raw = await cachedFetch('products', `${API_BASE_URL}/api/product`)
  return raw.map(mapProductSummary)
}

export async function fetchProduct(id) {
  const raw = await cachedFetch(`product:${id}`, `${API_BASE_URL}/api/product/${encodeURIComponent(id)}`)
  return mapProductDetail(raw)
}
