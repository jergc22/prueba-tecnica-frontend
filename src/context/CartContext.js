import { createContext } from 'react'

// Sin valor por defecto: usar el carrito fuera de CartProvider es un error de programación.
export const CartContext = createContext(null)
