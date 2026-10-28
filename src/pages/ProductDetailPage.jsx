import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/products.js'
import { ErrorMessage, Loading } from '../components/AsyncState.jsx'
import ProductActions from '../components/ProductActions.jsx'
import ProductDescription from '../components/ProductDescription.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { useCart } from '../context/useCart.js'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function ProductDetailPage() {
  const { id } = useParams()
  // key: al cambiar de producto se descarta todo el estado de la página anterior.
  return <ProductDetail key={id} id={id} />
}

function ProductDetail({ id }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const load = useCallback(() => fetchProduct(id), [id])
  const { data: product, error, loading, reload } = useAsync(load)
  const [cartStatus, setCartStatus] = useState({ adding: false, message: '', failed: false })
  usePageTitle(product ? `${product.brand} ${product.model}` : 'Detalle')

  // Si se llegó desde la propia app, "volver" retrocede en el historial: el listado
  // recupera su búsqueda (?q=) y su scroll. Con acceso directo a la URL lleva al listado.
  function handleBack(event) {
    if (location.key !== 'default') {
      event.preventDefault()
      navigate(-1)
    }
  }

  async function handleAdd({ colorCode, storageCode }) {
    setCartStatus({ adding: true, message: '', failed: false })
    try {
      await addItem({ id: product.id, colorCode, storageCode })
      setCartStatus({ adding: false, message: 'Producto añadido al carrito.', failed: false })
    } catch {
      setCartStatus({ adding: false, message: 'No se ha podido añadir al carrito. Inténtalo de nuevo.', failed: true })
    }
  }

  return (
    <section>
      <Link to="/" onClick={handleBack} className="back-link">
        ← Volver al listado
      </Link>

      {loading && <Loading message="Cargando producto…" />}
      {error && <ErrorMessage message="No se ha podido cargar el producto." onRetry={reload} />}
      {product && (
        <div className="detail">
          <ProductImage product={product} />
          <div className="detail__info">
            <h1 className="detail__title">
              {product.brand} {product.model}
            </h1>
            <ProductDescription product={product} />
            <ProductActions colors={product.colors} storages={product.storages} onAdd={handleAdd} adding={cartStatus.adding} />
            {/* La región live existe siempre: así los lectores de pantalla anuncian el mensaje al rellenarse. */}
            <p className="feedback" role="status">
              {!cartStatus.failed && cartStatus.message}
            </p>
            {cartStatus.failed && (
              <p className="feedback feedback--error" role="alert">
                {cartStatus.message}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
