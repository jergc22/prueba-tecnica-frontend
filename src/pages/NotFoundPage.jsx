import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function NotFoundPage() {
  usePageTitle('Página no encontrada')

  return (
    <section className="state">
      <h1 className="visually-hidden">Página no encontrada</h1>
      <p>Página no encontrada.</p>
      <Link to="/">Ir al listado</Link>
    </section>
  )
}
