import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    category: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState('')
  const { user } = useAuth()

  // Function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/api/placeholder/200/200';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path, prepend the backend base URL
    // Since we're using the gateway on port 8080, we can use relative paths
    return imagePath;
  }

  useEffect(() => {
    if (user && user.role === 'ROLE_ADMIN') {
      if (activeTab === 'products') {
        fetchProducts()
      } else if (activeTab === 'orders') {
        fetchOrders()
      }
    }
  }, [activeTab, user])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      // Process products to ensure image URLs are correct
      const processedProducts = response.data.map(product => ({
        ...product,
        imagePath: getImageUrl(product.imagePath)
      }))
      setProducts(processedProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProductForm({
        ...productForm,
        image: file
      })
      // Create preview URL
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', productForm.name)
      formData.append('description', productForm.description)
      formData.append('price', productForm.price)
      formData.append('stockQuantity', productForm.stockQuantity)
      formData.append('category', productForm.category)
      if (productForm.image) {
        formData.append('image', productForm.image)
      }

      await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      // Reset form
      setProductForm({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        category: '',
        image: null
      })
      setImagePreview('')
      setShowProductForm(false)
      fetchProducts()
      alert('Product created successfully!')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`)
        fetchProducts()
        alert('Product deleted successfully!')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product')
      }
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status?status=${newStatus}`)
      fetchOrders()
      alert('Order status updated successfully!')
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const clearImage = () => {
    setProductForm({
      ...productForm,
      image: null
    })
    setImagePreview('')
  }

  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 style={{ margin: '2rem 0' }}>Admin Dashboard</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('products')}
          className={`btn ${activeTab === 'products' ? 'btn-primary' : ''}`}
          style={{ marginRight: '1rem' }}
        >
          Manage Products
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : ''}`}
        >
          Manage Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Products Management</h2>
            <button 
              onClick={() => setShowProductForm(true)}
              className="btn btn-success"
            >
              Add New Product
            </button>
          </div>

          {showProductForm && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h3>Add New Product</h3>
              <form onSubmit={handleProductSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                  {imagePreview && (
                    <div style={{ marginTop: '1rem', position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ 
                          width: '150px', 
                          height: '150px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          border: '2px solid var(--border)'
                        }}
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: 'var(--danger)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <small style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.5rem' }}>
                    Supported formats: JPG, PNG, GIF, WEBP. Max size: 10MB
                  </small>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Product'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => {
                      setShowProductForm(false)
                      setProductForm({
                        name: '',
                        description: '',
                        price: '',
                        stockQuantity: '',
                        category: '',
                        image: null
                      })
                      setImagePreview('')
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {products.map(product => (
              <div key={product.id} style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <img 
                    src={getImageUrl(product.imagePath)}
                    alt={product.name}
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '1px solid var(--border)'
                    }}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/80/80'
                      console.error('Image failed to load in Admin:', product.imagePath)
                    }}
                  />
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{product.name}</h4>
                    <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>
                      {product.category} • ${product.price} • Stock: {product.stockQuantity}
                    </p>
                    {product.description && (
                      <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {product.description.length > 100 
                          ? `${product.description.substring(0, 100)}...` 
                          : product.description
                        }
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="btn"
                  style={{ 
                    background: 'var(--danger)', 
                    color: 'white',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {products.length === 0 && !showProductForm && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <h3>No Products Yet</h3>
              <p>Get started by adding your first product!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Orders Management</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Order #{order.id}</h4>
                    <p style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                      Customer: {order.customerName} ({order.customerEmail})
                    </p>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                      Placed on {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                    </p>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
                      Payment: {order.paymentMethod} • Shipping: {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      ${order.totalAmount?.toFixed(2)}
                    </div>
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      <option value="PENDING">⏳ Pending</option>
                      <option value="CONFIRMED">✅ Confirmed</option>
                      <option value="SHIPPED">🚚 Shipped</option>
                      <option value="DELIVERED">📦 Delivered</option>
                      <option value="CANCELLED">❌ Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Order Items:</strong>
                  <div style={{ marginTop: '0.75rem' }}>
                    {order.orderItems?.map(item => (
                      <div key={item.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid var(--border)'
                      }}>
                        <div>
                          <span style={{ fontWeight: '500' }}>{item.productName}</span>
                          <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                            (Qty: {item.quantity})
                          </span>
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--primary)' }}>
                          ${item.subtotal?.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <h3>No Orders Yet</h3>
              <p>Orders will appear here when customers make purchases.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Admin