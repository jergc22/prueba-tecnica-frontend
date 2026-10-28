import { Link, useMatch } from 'react-router-dom'
import { useCurrentPageTitle } from '../hooks/usePageTitle.js'

export default function Breadcrumbs() {
  const productMatch = useMatch('/product/:id')
  const title = useCurrentPageTitle()

  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>{productMatch ? <Link to="/">Inicio</Link> : <span aria-current="page">Inicio</span>}</li>
        {productMatch && (
          <li>
            <span aria-current="page">{title || 'Detalle'}</span>
          </li>
        )}
      </ol>
    </nav>
  )
}
