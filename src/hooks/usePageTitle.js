import { useEffect } from 'react'

const BASE_TITLE = 'Tienda de móviles'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE_TITLE}` : BASE_TITLE
  }, [title])
}
