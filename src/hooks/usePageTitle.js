import { useEffect, useSyncExternalStore } from 'react'
import { pageTitle } from '../lib/pageTitle.js'

/** Publica el título de la página actual (pestaña del navegador y breadcrumb). */
export function usePageTitle(title) {
  useEffect(() => {
    pageTitle.set(title)
  }, [title])
}

export function useCurrentPageTitle() {
  return useSyncExternalStore(pageTitle.subscribe, pageTitle.get)
}
