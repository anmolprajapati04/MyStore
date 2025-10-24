import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      // In real app, use actual user ID
      const response = await axios.get('/api/orders/user/1')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return '#27ae60'
      case 'SHIPPED': return '#3498db'
      case 'CONFIRMED': return '#f39c12'
      case 'PENDING': return '#95a5a6'
      case 'CANCELLED': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Loading orders...</h2>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>No Orders Found</h2>
          <p>You haven't placed any orders yet.</p>
          <button 
            onClick={() => window.location.href = '/products'}
            className="btn btn-primary"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 style={{ margin: '2rem 0' }}>My Orders</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map(order => (
          <div key={order.id} style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: `4px solid ${getStatusColor(order.status)}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Order #{order.id}</h3>
                <p style={{ margin: '0.5rem 0', color: '#666' }}>
                  Placed on {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  background: getStatusColor(order.status), 
                  color: 'white', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  {order.status}
                </div>
                <p style={{ margin: '0.5rem 0 0 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  ${order.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4>Shipping Address</h4>
              <p style={{ margin: 0 }}>
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </p>
            </div>
            
            <div>
              <h4>Items</h4>
              {order.orderItems?.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div>
                      <strong>{item.productName}</strong>
                      <p style={{ margin: 0, color: '#666' }}>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    ${item.subtotal?.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
              <div>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </div>
              <button 
                className="btn"
                style={{ background: '#3498db', color: 'white' }}
                onClick={() => alert(`Order details for order #${order.id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders