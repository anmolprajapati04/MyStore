import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { handleImageError, FALLBACK_IMAGE_URI } from '../utils/imageUtils'
import axios from 'axios'

const STEPS = ['Shipping', 'Payment', 'Review']

function Stepper({ current }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => {
        const done   = i < current
        const active = i === current
        return (
          <React.Fragment key={label}>
            <div className="step">
              <div className={`step__dot ${done ? 'done' : active ? 'active' : 'pending'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className="step__label">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step__line${done ? ' done' : ''}`} />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function Checkout() {
  const { user } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const toast    = useToast()
  const navigate = useNavigate()
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)

  const [shipping, setShipping] = useState({
    customerName: user?.username || '',
    street: '', city: '', state: '', zipCode: '', country: 'India',
  })
  const [payment, setPayment] = useState({ method: 'CREDIT_CARD' })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (cartItems.length === 0) navigate('/cart')
  }, [user, cartItems, navigate])

  const handleShippingChange = e =>
    setShipping(s => ({ ...s, [e.target.name]: e.target.value }))

  const shippingFee = 5.00
  const grandTotal  = cartTotal + shippingFee

  const placeOrder = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const orderData = {
        userId:         user.username,   // use username as userId string
        customerName:   shipping.customerName,
        customerEmail:  user.email || `${user.username}@mystore.com`,
        paymentMethod:  payment.method,
        shippingAddress: {
          street:  shipping.street,
          city:    shipping.city,
          state:   shipping.state,
          zipCode: shipping.zipCode,
          country: shipping.country,
        },
        orderItems: cartItems.map(item => ({
          productId: item.id,
          quantity:  item.quantity,
        })),
      }
      await axios.post('/api/orders', orderData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      clearCart()
      toast.success('🎉 Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      console.error('Order failed:', err)
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Failed to place order'
      toast.error(`Order failed: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  // ── Side panel: Order Summary ──────────────────────────────────
  const OrderSummaryPanel = () => (
    <div className="order-summary">
      <h3>Order Summary</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1rem' }}>
        {cartItems.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <img
              src={item.imagePath || item.imageUrl || FALLBACK_IMAGE_URI}
              alt={item.name}
              onError={handleImageError}
              style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0, background: 'var(--bg-secondary)' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0 }}>
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
      <div className="summary-row"><span>Delivery</span><span>${shippingFee.toFixed(2)}</span></div>
      <div className="summary-row total"><span>Total</span><span>${grandTotal.toFixed(2)}</span></div>
    </div>
  )

  return (
    <div className="page-content">
      <div className="container">
        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '2rem' }}>
          Checkout
        </h1>

        <Stepper current={step} />

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '2rem', alignItems: 'start' }}>

          {/* ── Step 0: Shipping ─────────────────────────── */}
          {step === 0 && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Shipping Information</h2>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input name="customerName" className="form-control" value={shipping.customerName} onChange={handleShippingChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input name="street" className="form-control" placeholder="123 Main St" value={shipping.street} onChange={handleShippingChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input name="city" className="form-control" value={shipping.city} onChange={handleShippingChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input name="state" className="form-control" value={shipping.state} onChange={handleShippingChange} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">ZIP / PIN Code *</label>
                  <input name="zipCode" className="form-control" value={shipping.zipCode} onChange={handleShippingChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select name="country" className="form-control" value={shipping.country} onChange={handleShippingChange}>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
              <button
                className="btn btn-primary btn-lg"
                style={{ marginTop: '0.5rem' }}
                onClick={() => {
                  if (!shipping.customerName || !shipping.street || !shipping.city || !shipping.state || !shipping.zipCode) {
                    toast.warning('Please fill all required fields.')
                    return
                  }
                  setStep(1)
                }}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {/* ── Step 1: Payment ──────────────────────────── */}
          {step === 1 && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Payment Method</h2>
              {[
                { value: 'CREDIT_CARD', label: '💳 Credit Card' },
                { value: 'DEBIT_CARD',  label: '💳 Debit Card' },
                { value: 'PAYPAL',      label: '🅿️ PayPal' },
                { value: 'COD',         label: '💵 Cash on Delivery' },
              ].map(opt => (
                <label key={opt.value} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem', marginBottom: '0.75rem',
                  border: `2px solid ${payment.method === opt.value ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  background: payment.method === opt.value ? 'var(--primary-alpha)' : 'var(--surface)',
                  transition: 'var(--transition)',
                }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={payment.method === opt.value}
                    onChange={() => setPayment({ method: opt.value })}
                    style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{opt.label}</span>
                </label>
              ))}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => setStep(2)}>
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Review ───────────────────────────── */}
          {step === 2 && (
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Review Your Order</h2>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Deliver to</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{shipping.customerName}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                  {shipping.street}, {shipping.city}, {shipping.state} — {shipping.zipCode}, {shipping.country}
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Payment</div>
                <div style={{ fontWeight: 600 }}>
                  {{ CREDIT_CARD: '💳 Credit Card', DEBIT_CARD: '💳 Debit Card', PAYPAL: '🅿️ PayPal', COD: '💵 Cash on Delivery' }[payment.method]}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button
                  className="btn btn-success btn-lg"
                  style={{ flex: 1 }}
                  onClick={placeOrder}
                  disabled={loading}
                >
                  {loading ? '⏳ Placing Order…' : `✓ Place Order — $${grandTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}

          <OrderSummaryPanel />
        </div>
      </div>
    </div>
  )
}