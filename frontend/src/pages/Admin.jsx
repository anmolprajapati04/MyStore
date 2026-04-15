import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { handleImageError, FALLBACK_IMAGE_URI } from '../utils/imageUtils'
import axios from 'axios'

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function Admin() {
  const { user }   = useAuth()
  const toast      = useToast()
  const navigate   = useNavigate()

  const [activeTab,       setActiveTab]       = useState('products')
  const [products,        setProducts]        = useState([])
  const [orders,          setOrders]          = useState([])
  const [loadingData,     setLoadingData]     = useState(false)
  const [showForm,        setShowForm]        = useState(false)
  const [formLoading,     setFormLoading]     = useState(false)
  const [imagePreview,    setImagePreview]    = useState('')
  const [productForm,     setProductForm]     = useState({
    name: '', description: '', price: '', stockQuantity: '', category: '', image: null,
  })
  const hasFetchedProducts = useRef(false)
  const hasFetchedOrders   = useRef(false)

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/')
      return
    }
  }, [user])

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') return
    if (activeTab === 'products' && !hasFetchedProducts.current) {
      hasFetchedProducts.current = true
      fetchProducts()
    }
    if (activeTab === 'orders' && !hasFetchedOrders.current) {
      hasFetchedOrders.current = true
      fetchOrders()
    }
  }, [activeTab, user])

  // ── Data fetchers ──────────────────────────────────────────────
  const fetchProducts = async () => {
    try { setLoadingData(true); const r = await axios.get('/api/products'); setProducts(r.data) }
    catch { toast.error('Failed to load products.') }
    finally { setLoadingData(false) }
  }

  const fetchOrders = async () => {
    try { setLoadingData(true); const r = await axios.get('/api/orders'); setOrders(r.data) }
    catch { toast.error('Failed to load orders.') }
    finally { setLoadingData(false) }
  }

  // ── Handlers ───────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProductForm(f => ({ ...f, image: file }))
    setImagePreview(URL.createObjectURL(file))
  }

  const resetForm = () => {
    setProductForm({ name: '', description: '', price: '', stockQuantity: '', category: '', image: null })
    setImagePreview('')
    setShowForm(false)
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      const fd = new FormData()
      fd.append('name',          productForm.name)
      fd.append('description',   productForm.description)
      fd.append('price',         productForm.price)
      fd.append('stockQuantity', productForm.stockQuantity)
      fd.append('category',      productForm.category)
      if (productForm.image) fd.append('image', productForm.image)

      await axios.post('/api/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Product created successfully! ✓')
      resetForm()
      hasFetchedProducts.current = false
      fetchProducts()
    } catch {
      toast.error('Failed to create product.')
    } finally {
      setFormLoading(false)
    }
  }

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await axios.delete(`/api/products/${id}`)
      toast.success(`"${name}" deleted.`)
      setProducts(p => p.filter(x => x.id !== id))
    } catch {
      toast.error('Failed to delete product.')
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status?status=${status}`)
      setOrders(o => o.map(x => x.id === orderId ? { ...x, status } : x))
      toast.success('Order status updated.')
    } catch {
      toast.error('Failed to update order status.')
    }
  }

  if (!user || user.role !== 'ROLE_ADMIN') return null

  // ── Derived stats ───────────────────────────────────────────────
  const totalRevenue  = orders.reduce((s, o) => s + (o.totalAmount || 0), 0)
  const inStock       = products.filter(p => p.stockQuantity > 0).length
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length

  const formInput = (key, label, type = 'text', extra = {}) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        value={productForm[key]}
        onChange={e => setProductForm(f => ({ ...f, [key]: e.target.value }))}
        required
        {...extra}
      />
    </div>
  )

  return (
    <div style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="container" style={{ paddingBottom: '4rem' }}>

        <div className="admin-layout">

          {/* ── Sidebar ─────────────────────────────────── */}
          <div className="admin-sidebar">
            <div style={{ padding: '0.5rem 1rem 1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Admin Panel
              </div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                {user.username}
              </div>
            </div>
            {[
              { key: 'products', icon: '📦', label: 'Products' },
              { key: 'orders',   icon: '📋', label: 'Orders'   },
            ].map(item => (
              <button
                key={item.key}
                className={`admin-nav-item${activeTab === item.key ? ' active' : ''}`}
                onClick={() => setActiveTab(item.key)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.key === 'orders' && pendingOrders > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--danger)', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                    {pendingOrders}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Main Content ─────────────────────────────── */}
          <div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Products', value: products.length, icon: '📦', color: 'var(--primary)' },
                { label: 'Total Orders',   value: orders.length,   icon: '📋', color: 'var(--success)' },
                { label: 'Revenue',        value: `$${totalRevenue.toFixed(0)}`, icon: '💰', color: 'var(--accent)' },
              ].map(stat => (
                <div key={stat.label} className="admin-stat-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                  </div>
                  <div className="admin-stat-value" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="admin-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* ── PRODUCTS TAB ─────────── */}
            {activeTab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Products ({products.length})</h2>
                  <button className="btn btn-success btn-sm" onClick={() => setShowForm(s => !s)}>
                    {showForm ? '✕ Cancel' : '+ Add Product'}
                  </button>
                </div>

                {/* Add Product Form */}
                {showForm && (
                  <div className="card animate-fade-up" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem' }}>New Product</h3>
                    <form onSubmit={handleProductSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {formInput('name',     'Product Name *')}
                        {formInput('category', 'Category *')}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={productForm.description}
                          onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {formInput('price',         'Price *',          'number', { step: '0.01', min: '0' })}
                        {formInput('stockQuantity', 'Stock Quantity *', 'number', { min: '0' })}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Product Image</label>
                        <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
                        {imagePreview && (
                          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src={imagePreview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setImagePreview(''); setProductForm(f => ({ ...f, image: null })) }}>
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="submit" className="btn btn-success" disabled={formLoading}>
                          {formLoading ? '⏳ Creating…' : '✓ Create Product'}
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Product list */}
                {loadingData ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1,2,3].map(i => (
                      <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="skeleton" style={{ width: 64, height: 64, borderRadius: 'var(--radius)', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div className="skeleton skeleton-text" style={{ width: '50%', height: '1rem' }} />
                          <div className="skeleton skeleton-text" style={{ width: '30%', height: '0.85rem' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state__icon">📦</div>
                    <h2>No Products Yet</h2>
                    <p>Click "Add Product" to create your first listing.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {products.map(product => (
                      <div key={product.id} className="card animate-fade-up" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <img
                          src={product.imagePath || FALLBACK_IMAGE_URI}
                          alt={product.name}
                          onError={handleImageError}
                          style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg-secondary)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{product.name}</div>
                          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                            {product.category} &nbsp;·&nbsp; ${Number(product.price).toFixed(2)} &nbsp;·&nbsp;
                            <span style={{ color: product.stockQuantity === 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                              {product.stockQuantity === 0 ? 'Out of stock' : `${product.stockQuantity} in stock`}
                            </span>
                          </div>
                          {product.description && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                              {product.description}
                            </div>
                          )}
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteProduct(product.id, product.name)}
                          style={{ flexShrink: 0 }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ORDERS TAB ──────────── */}
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  Orders ({orders.length})
                </h2>

                {loadingData ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1,2,3].map(i => (
                      <div key={i} className="card" style={{ padding: '1.5rem' }}>
                        <div className="skeleton skeleton-text" style={{ width: '40%', height: '1rem' }} />
                        <div className="skeleton skeleton-text" style={{ width: '60%', height: '0.85rem' }} />
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state__icon">📋</div>
                    <h2>No Orders Yet</h2>
                    <p>Orders will appear here when customers make purchases.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(order => (
                      <div key={order.id} className="card animate-fade-up" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem' }}>Order #{order.id}</div>
                            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                              {order.customerName} &nbsp;·&nbsp; {order.customerEmail}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              {order.orderDate ? new Date(order.orderDate).toLocaleString() : '—'}
                              &nbsp;·&nbsp; {order.paymentMethod?.replace(/_/g, ' ')}
                              &nbsp;·&nbsp; 📍 {order.shippingAddress?.city}, {order.shippingAddress?.state}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>
                              ${order.totalAmount?.toFixed(2)}
                            </div>
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value)}
                              className="form-control"
                              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.825rem' }}
                            >
                              {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.875rem' }}>
                          {order.orderItems?.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '0.35rem 0', color: 'var(--text-secondary)' }}>
                              <span>{item.productName} <span style={{ color: 'var(--text-muted)' }}>× {item.quantity}</span></span>
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${item.subtotal?.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}