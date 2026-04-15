import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { handleImageError, FALLBACK_IMAGE_URI } from '../utils/imageUtils'

export default function Cart() {
  const { user } = useAuth()
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  const shipping = cartTotal > 0 ? 5.00 : 0
  const total    = cartTotal + shipping

  const handleRemove = (item) => {
    removeFromCart(item.id)
    toast.info(`${item.name} removed from cart.`)
  }

  const proceedToCheckout = () => {
    if (!user) { navigate('/login'); return }
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state__icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything yet. Start browsing to fill it up!</p>
            <Link to="/products" className="btn btn-primary btn-lg">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="container">
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '2rem' }}>
          Shopping Cart
          <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
            ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2rem', alignItems: 'start' }}>

          {/* Cart Items */}
          <div>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item animate-fade-up">
                <img
                  src={item.imagePath || item.imageUrl || FALLBACK_IMAGE_URI}
                  alt={item.name}
                  className="cart-item__image"
                  onError={handleImageError}
                />
                <div className="cart-item__info">
                  <div className="cart-item__name">{item.name}</div>
                  {item.category && <div className="cart-item__cat">{item.category}</div>}
                  <div className="cart-item__price">${Number(item.price).toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <div className="qty-stepper">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleRemove(item)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--danger)', borderColor: 'var(--danger-alpha)' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '1rem' }}>
              <Link to="/products" className="btn btn-ghost">← Continue Shopping</Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary animate-fade-up">
            <h3>Order Summary</h3>

            {cartItems.map(item => (
              <div key={item.id} className="summary-row" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--bg-secondary)' }}>
                <span style={{ flex: 1, marginRight: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {item.name} × {item.quantity}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div style={{ marginTop: '1rem' }}>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={proceedToCheckout}
              className="btn btn-primary btn-full"
              style={{ marginTop: '1.5rem', fontSize: '1rem', padding: '0.95rem' }}
            >
              {user ? 'Proceed to Checkout →' : 'Login to Checkout'}
            </button>

            {!user && (
              <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link> to complete your purchase
              </p>
            )}

            <div className="trust-strip" style={{ marginTop: '1.5rem', flexDirection: 'column', gap: '0.6rem', padding: '1rem', fontSize: '0.8rem' }}>
              {['🔒 Secure Checkout', '🚚 Fast Delivery', '↩️ Easy Returns'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>{t}</div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}