import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../api/products.js'
import { ErrorMessage, Loading } from '../components/AsyncState.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { filterProducts } from '../lib/filterProducts.js'

export default function ProductListPage() {
  const { data: products, error, loading, reload } = useAsync(fetchProducts)
  // La búsqueda vive en la URL (?q=): sobrevive a la navegación al detalle y al volver.
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  usePageTitle('Productos')

  const visible = useMemo(() => (products ? filterProducts(products, query) : []), [products, query])

  function handleSearch(value) {
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  return (
    <section>
      <h1 className="visually-hidden">Productos</h1>
      <div className="toolbar">
        <SearchBar value={query} onChange={handleSearch} />
      </div>

      {loading && <Loading message="Cargando productos…" />}
      {error && <ErrorMessage onRetry={reload} />}
      {products && visible.length === 0 && (
        <p className="state" role="status">
          No hay productos que coincidan con «{query}».
        </p>
      )}
      {products && visible.length > 0 && (
        <ul className="grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ul>
      )}
    </section>
  )
}
