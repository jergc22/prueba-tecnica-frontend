import { Link } from 'react-router-dom'
import { formatPrice } from '../lib/format.js'

export default function ProductCard({ product }) {
  return (
    <li className="card">
      <Link to={`/product/${product.id}`} className="card__link">
        <img className="card__image" src={product.imgUrl} alt={`${product.brand} ${product.model}`} loading="lazy" />
        <p className="card__brand">{product.brand}</p>
        <p className="card__model">{product.model}</p>
        <p className="card__price">{formatPrice(product.price)}</p>
      </Link>
    </li>
  )
}
