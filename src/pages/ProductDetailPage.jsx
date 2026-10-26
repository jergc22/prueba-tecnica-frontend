import { useCallback } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchProduct } from '../api/products.js'
import { ErrorMessage, Loading } from '../components/AsyncState.jsx'
import ProductActions from '../components/ProductActions.jsx'
import ProductDescription from '../components/ProductDescription.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { useAsync } from '../hooks/useAsync.js'

export default function ProductDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const load = useCallback(() => fetchProduct(id), [id])
  const { data: product, error, loading, reload } = useAsync(load)

  // Si se llegó desde el listado, se vuelve a él con la búsqueda que había.
  const backTo = location.state?.from ?? '/'

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
            <ProductActions key={product.id} colors={product.colors} storages={product.storages} onAdd={() => {}} />
          </div>
        </div>
      )}
    </section>
  )
}
