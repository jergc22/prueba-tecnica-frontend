import { fetchProducts } from '../api/products.js'
import { ErrorMessage, Loading } from '../components/AsyncState.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useAsync } from '../hooks/useAsync.js'

export default function ProductListPage() {
  const { data: products, error, loading, reload } = useAsync(fetchProducts)

  if (loading) return <Loading message="Cargando productos…" />
  if (error) return <ErrorMessage onRetry={reload} />

  return (
    <section>
      <ul className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </section>
  )
}
