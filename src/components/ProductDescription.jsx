import { formatPrice } from '../lib/format.js'

const EMPTY = '—'

export default function ProductDescription({ product }) {
  const rows = [
    ['Marca', product.brand],
    ['Modelo', product.model],
    ['Precio', formatPrice(product.price)],
    ['CPU', product.cpu],
    ['RAM', product.ram],
    ['Sistema operativo', product.os],
    ['Tamaño de pantalla', product.screenSize],
    ['Resolución de pantalla', product.screenResolution],
    ['Batería', product.battery],
    ['Cámara principal', product.primaryCamera],
    ['Cámara secundaria', product.secondaryCamera],
    ['Dimensiones', product.dimensions],
    ['Peso', product.weight],
  ]

  return (
    <section aria-labelledby="description-title">
      <h2 id="description-title" className="visually-hidden">
        Descripción
      </h2>
      <dl className="description">
        {rows.map(([label, value]) => (
          <div key={label} className="description__row">
            <dt>{label}</dt>
            <dd>{value || EMPTY}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
