import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Al entrar en una página nueva se empieza arriba. Al volver (POP) no se toca nada:
// el navegador restaura el scroll donde estaba el usuario en el listado.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}
