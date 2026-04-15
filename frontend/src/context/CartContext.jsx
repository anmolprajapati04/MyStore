import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'

const CartContext = createContext()

// ------- Reducer -------
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return action.payload

    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.payload.id)
      if (existing) {
        return state.map(i =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }

    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.payload)

    case 'UPDATE_QTY':
      if (action.payload.qty < 1) return state
      return state.map(i =>
        i.id === action.payload.id ? { ...i, quantity: action.payload.qty } : i
      )

    case 'CLEAR':
      return []

    default:
      return state
  }
}

// ------- Provider -------
export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [])

  // Hydrate from localStorage on mount (runs once)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart')
      if (saved) dispatch({ type: 'INIT', payload: JSON.parse(saved) })
    } catch {
      /* corrupted storage — start fresh */
    }
  }, [])

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
    // Notify other parts of the UI (e.g., Header) in the same tab
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cartItems }))
  }, [cartItems])

  const addToCart = useCallback((product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }, [])

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }, [])

  const updateQuantity = useCallback((productId, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id: productId, qty } })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
