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
        {/* role="status": los lectores de pantalla anuncian el cambio del contador */}
        <p className="header__cart" role="status">
          <span className="visually-hidden">Productos en el carrito: </span>
          <span aria-hidden="true">🛒</span> <span data-testid="cart-count">{count}</span>
        </p>
      </div>
    </header>
  )
}
