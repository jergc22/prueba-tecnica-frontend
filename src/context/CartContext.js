import { createContext } from 'react'

export const CartContext = createContext({ count: 0, addItem: async () => {} })
