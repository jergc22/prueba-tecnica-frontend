const priceFormat = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })

export function formatPrice(price) {
  return price === null || price === undefined ? 'Precio no disponible' : priceFormat.format(price)
}
