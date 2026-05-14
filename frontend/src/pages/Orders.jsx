import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import axios from 'axios'
import { formatINR } from '../utils/currencyUtils'

const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   icon: '⏳', cls: 'status-PENDING'   },
  CONFIRMED: { label: 'Confirmed', icon: '✅', cls: 'status-CONFIRMED' },
  SHIPPED:   { label: 'Shipped',   icon: '🚚', cls: 'status-SHIPPED'   },
  DELIVERED: { label: 'Delivered', icon: '📦', cls: 'status-DELIVERED' },
  CANCELLED: { label: 'Cancelled', icon: '❌', cls: 'status-CANCELLED' },
}

function OrderSkeleton() {
  return (
    <div className="order-card">
      <div className="order-card__header">
        <div>
          <div className="skeleton skeleton-text" style={{ width: 120, height: '1rem' }} />
          <div className="skeleton skeleton-text" style={{ width: 180, height: '0.8rem', marginTop: 8 }} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="skeleton skeleton-text" style={{ width: 80, height: '1.5rem' }} />
          <div className="skeleton skeleton-text" style={{ width: 60, height: '1rem', marginTop: 8 }} />
        </div>
      </div>
      <div className="order-card__body">
        <div className="skeleton skeleton-text" style={{ width: '60%', height: '0.85rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '40%', height: '0.85rem' }} />
      </div>
    </div>
  )
}

export default function Orders() {
  const { user }   = useAuth()
  const toast      = useToast()
  const navigate   = useNavigate()
  const [orders, setOrders]   = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (hasFetched.current) return
    hasFetched.current = true
    fetchOrders()
    fetchPayments()
  }, [user, navigate])

  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('token')
    if (!token) return

    const source = new EventSource(`/api/order-events/stream?userId=${encodeURIComponent(user.username)}&token=${encodeURIComponent(token)}`)

    source.addEventListener('order_created', event => {
      const order = JSON.parse(event.data)
      setOrders(current => current.some(item => item.id === order.id) ? current : [order, ...current])
    })

    source.addEventListener('order_status_updated', event => {
      const order = JSON.parse(event.data)
      setOrders(current => current.map(item => item.id === order.id ? order : item))
      toast.info(`Order #${order.id} is now ${order.status}`)
    })

    source.addEventListener('payment_success', event => {
      const payment = JSON.parse(event.data)
      toast.success(`Payment confirmed for order #${payment.orderId}`)
      fetchPayments()
    })

    return () => source.close()
  }, [user, toast])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(`/api/orders/user/${user.username}`, { headers })
      setOrders(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      if (err.response?.status === 404) {
        setOrders([])
      } else {
        console.error('Orders fetch failed:', err)
        setError('Failed to load orders. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(`/api/payment/user/${user.username}`, { headers })
      setPayments(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Payments fetch failed:', err)
    }
  }

  const paymentForOrder = (orderId) => payments.find(payment => payment.orderId === orderId)

  if (!user) return null

  if (loading) {
    return (
      <div className="page-content">
        <div className="container">
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '2rem' }}>
            My Orders
          </h1>
          {[1, 2, 3].map(i => <OrderSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state__icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => { hasFetched.current = false; fetchOrders() }}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state__icon">📦</div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders. Start exploring our products!</p>
            <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="container">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>
              My Orders
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">+ Continue Shopping</Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order, idx) => {
            const cfg    = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING
            const date   = order.orderDate ? new Date(order.orderDate) : null
            const payment = paymentForOrder(order.id)
            const timeline = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
            const currentStatusIndex = timeline.indexOf(order.status)
            return (
              <div key={order.id} className="order-card animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>

                {/* Header */}
                <div className="order-card__header">
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Order #{order.id}
                    </div>
                    {date && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        Placed on {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}{date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    {order.shippingAddress && (
                      <div style={{ marginTop: '0.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        📍 {order.shippingAddress.city}, {order.shippingAddress.state}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <span className={`status-badge ${cfg.cls}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
                      {order.totalAmount ? formatINR(order.totalAmount) : '—'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      via {order.paymentMethod?.replace(/_/g, ' ')}
                    </div>
                    {payment && (
                      <span className={`status-badge ${payment.status === 'SUCCESS' ? 'status-DELIVERED' : payment.status === 'FAILED' ? 'status-CANCELLED' : 'status-PENDING'}`}>
                        Payment {payment.status}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', margin: '1rem 0' }}>
                  {['Ordered', 'Confirmed', 'Shipped', 'Delivered'].map((label, statusIndex) => (
                    <div key={label} style={{
                      height: 6,
                      borderRadius: 999,
                      background: statusIndex <= Math.max(currentStatusIndex, 0) ? 'var(--primary)' : 'var(--border)',
                    }} title={label} />
                  ))}
                </div>

                {/* Items */}
                <div className="order-card__body">
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Items
                  </div>
                  {order.orderItems?.map(item => (
                    <div key={item.id} className="order-card__item">
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.productName}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginLeft: '0.5rem' }}>× {item.quantity}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatINR(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
