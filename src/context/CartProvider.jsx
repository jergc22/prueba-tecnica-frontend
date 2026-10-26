import { useCallback, useMemo, useState } from 'react'
import { addToCart } from '../api/cart.js'
import { safeStorage } from '../lib/storage.js'
import { CartContext } from './CartContext.js'

const STORAGE_KEY = 'cart:count'

function readCount() {
  const stored = Number(safeStorage.getItem(STORAGE_KEY))
  return Number.isInteger(stored) && stored > 0 ? stored : 0
}

// El contador es el que devuelve el API al añadir, y se persiste para que sobreviva a recargas.
export function CartProvider({ children }) {
  const [count, setCount] = useState(readCount)

  const addItem = useCallback(async (item) => {
    const newCount = await addToCart(item)
    setCount(newCount)
    safeStorage.setItem(STORAGE_KEY, String(newCount))
  }, [])

  const value = useMemo(() => ({ count, addItem }), [count, addItem])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
