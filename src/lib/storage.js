// localStorage puede no estar disponible (modo privado, cuota llena, SSR de tests...).
// Todo acceso va envuelto en try/catch y, si falla, se usa una copia en memoria.
const memory = new Map()

export const safeStorage = {
  getItem(key) {
    try {
      const value = window.localStorage.getItem(key)
      if (value !== null) return value
    } catch {
      // se ignora: se intenta la copia en memoria
    }
    return memory.has(key) ? memory.get(key) : null
  },

  setItem(key, value) {
    memory.set(key, value)
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // sin persistencia: la copia en memoria sigue valiendo durante la sesión
    }
  },

  clear() {
    memory.clear()
    try {
      window.localStorage.clear()
    } catch {
      // nada que hacer
    }
  },

  removeItem(key) {
    memory.delete(key)
    try {
      window.localStorage.removeItem(key)
    } catch {
      // nada que hacer
    }
  },
}
