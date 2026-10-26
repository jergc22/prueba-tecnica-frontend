import { useContext } from 'react'
import { CartContext } from './CartContext.js'

export function useCart() {
  return useContext(CartContext)
}
