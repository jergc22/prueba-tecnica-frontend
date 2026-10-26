import { useCallback } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { fetchProduct } from '../api/products.js'
import { useAsync } from '../hooks/useAsync.js'

function ProductCrumb({ id }) {
  // fetchProduct pasa por la caché: el detalle ya pedido por la página no se vuelve a pedir.
  const load = useCallback(() => fetchProduct(id), [id])
  const { data: product } = useAsync(load)
  return <span aria-current="page">{product ? `${product.brand} ${product.model}` : 'Detalle'}</span>
}

export default function Breadcrumbs() {
  const productMatch = useMatch('/product/:id')

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>{productMatch ? <Link to="/">Inicio</Link> : <span aria-current="page">Inicio</span>}</li>
        {productMatch && (
          <li>
            <ProductCrumb id={productMatch.params.id} />
          </li>
        )}
      </ol>
    </nav>
  )
}
