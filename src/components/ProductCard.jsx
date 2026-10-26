import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../lib/format.js'

export default function ProductCard({ product }) {
  const location = useLocation()

  return (
    <li className="card">
      <Link to={`/product/${product.id}`} state={{ from: location.pathname + location.search }} className="card__link">
        <img className="card__image" src={product.imgUrl} alt={`${product.brand} ${product.model}`} loading="lazy" />
        <p className="card__brand">{product.brand}</p>
        <p className="card__model">{product.model}</p>
        <p className="card__price">{formatPrice(product.price)}</p>
      </Link>
    </li>
  )
}
