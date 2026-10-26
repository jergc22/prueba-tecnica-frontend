import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart.js'
import Breadcrumbs from './Breadcrumbs.jsx'

export default function Header() {
  const { count } = useCart()

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__title">
          Tienda de móviles
        </Link>
        <Breadcrumbs />
        <p className="header__cart" aria-label={`Productos en el carrito: ${count}`}>
          <span aria-hidden="true">🛒</span> <span data-testid="cart-count">{count}</span>
        </p>
      </div>
    </header>
  )
}
