import { useCallback, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/products.js'
import { ErrorMessage, Loading } from '../components/AsyncState.jsx'
import ProductActions from '../components/ProductActions.jsx'
import ProductDescription from '../components/ProductDescription.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { useCart } from '../context/useCart.js'
import { useAsync } from '../hooks/useAsync.js'

export default function ProductDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const { addItem } = useCart()
  const load = useCallback(() => fetchProduct(id), [id])
  const { data: product, error, loading, reload } = useAsync(load)
  const [cartStatus, setCartStatus] = useState({ adding: false, message: '', failed: false })

  // Si se llegó desde el listado, se vuelve a él con la búsqueda que había.
  const backTo = location.state?.from ?? '/'

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
      <Link to={backTo} className="back-link">
        ← Volver al listado
      </Link>

      {loading && <Loading message="Cargando producto…" />}
      {error && <ErrorMessage onRetry={reload} />}
      {product && (
        <div className="detail">
          <ProductImage product={product} />
          <div className="detail__info">
            <ProductDescription product={product} />
            <ProductActions
              key={product.id}
              colors={product.colors}
              storages={product.storages}
              onAdd={handleAdd}
              adding={cartStatus.adding}
            />
            {cartStatus.message && (
              <p className={cartStatus.failed ? 'feedback feedback--error' : 'feedback'} role={cartStatus.failed ? 'alert' : 'status'}>
                {cartStatus.message}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
