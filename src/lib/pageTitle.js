// Título de la página actual, compartido entre la página (que lo conoce) y la cabecera
// (breadcrumb). Es un store mínimo para useSyncExternalStore: así el breadcrumb no tiene
// que volver a pedir el producto y se actualiza también tras un reintento.
const BASE_TITLE = 'Tienda de móviles'
const listeners = new Set()
let current = ''

export const pageTitle = {
  get: () => current,
  set(title) {
    if (title === current) return
    current = title
    document.title = title ? `${title} · ${BASE_TITLE}` : BASE_TITLE
    listeners.forEach((listener) => listener())
  },
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
