import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const updateCart = (items) => {
    setCartItems(items)
    localStorage.setItem('cart', JSON.stringify(items))
  }

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId)
    updateCart(updatedCart)
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    )
    updateCart(updatedCart)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const proceedToCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Your Cart is Empty</h2>
          <p>Add some products to your cart to see them here.</p>
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 style={{ margin: '2rem 0' }}>Shopping Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img 
                  src={item.imageUrl || '/api/placeholder/80/80'} 
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div>
                  <h4>{item.name}</h4>
                  <p style={{ color: '#666' }}>${item.price}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="btn"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 1rem' }}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="btn"
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    +
                  </button>
                </div>
                
                <div style={{ minWidth: '80px', textAlign: 'center' }}>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="btn"
                  style={{ background: '#e74c3c', color: 'white' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>Order Summary</h3>
          <div style={{ margin: '1.5rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Shipping:</span>
              <span>$5.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span>${(getTotalPrice() + 5).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={proceedToCheckout}
            className="btn btn-success"
            style={{ width: '100%', fontSize: '1.1rem' }}
            disabled={!user}
          >
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          
          {!user && (
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
              Please login to complete your purchase
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart