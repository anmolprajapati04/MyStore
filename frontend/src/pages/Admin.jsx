import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { handleImageError, FALLBACK_IMAGE_URI } from '../utils/imageUtils'
import { formatINR } from '../utils/currencyUtils'
import axios from 'axios'

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function Admin() {
  const { user }   = useAuth()
  const toast      = useToast()
  const navigate   = useNavigate()

  const [activeTab,       setActiveTab]       = useState('products')
  const [products,        setProducts]        = useState([])
  const [orders,          setOrders]          = useState([])
  const [users,           setUsers]           = useState([])
  const [loadingData,     setLoadingData]     = useState(false)
  const [showForm,        setShowForm]        = useState(false)
  const [formLoading,     setFormLoading]     = useState(false)
  const [imagePreview,    setImagePreview]    = useState('')
  const [editingProduct,  setEditingProduct]  = useState(null)
  const [productForm,     setProductForm]     = useState({
    name: '', description: '', price: '', stockQuantity: '', category: '', image: null,
  })
  const hasFetchedProducts = useRef(false)
  const hasFetchedOrders   = useRef(false)
  const hasFetchedUsers    = useRef(false)
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_SUPER_ADMIN'

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/')
      return
    }
  }, [user, isAdmin, navigate])

  useEffect(() => {
    if (!user || !isAdmin) return
    if (activeTab === 'products' && !hasFetchedProducts.current) {
      hasFetchedProducts.current = true
      fetchProducts()
    }
    if (activeTab === 'orders' && !hasFetchedOrders.current) {
      hasFetchedOrders.current = true
      fetchOrders()
    }
    if (activeTab === 'users' && user.role === 'ROLE_SUPER_ADMIN' && !hasFetchedUsers.current) {
      hasFetchedUsers.current = true
      fetchUsers()
    }
  }, [activeTab, user, isAdmin])

  useEffect(() => {
    if (!user || !isAdmin) return
    const token = localStorage.getItem('token')
    if (!token) return

    const source = new EventSource(`/api/order-events/admin/stream?token=${encodeURIComponent(token)}`)
    source.addEventListener('payment_success', event => {
      const payment = JSON.parse(event.data)
      toast.success(`New paid order #${payment.orderId}`)
      hasFetchedOrders.current = false
      fetchOrders()
    })
    source.addEventListener('order_created', () => {
      hasFetchedOrders.current = false
      fetchOrders()
    })
    return () => source.close()
  }, [user, isAdmin])

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

  const fetchUsers = async () => {
    try { setLoadingData(true); const r = await axios.get('/api/auth/users'); setUsers(r.data) }
    catch { toast.error('Failed to load users.') }
    finally { setLoadingData(false) }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setProductForm(f => ({ ...f, image: file }))
    setImagePreview(URL.createObjectURL(file))
  }

  const resetForm = () => {
    setProductForm({ name: '', description: '', price: '', stockQuantity: '', category: '', image: null })
    setImagePreview('')
    setEditingProduct(null)
    setShowForm(false)
  }

  const startEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stockQuantity: product.stockQuantity || '',
      category: product.category || '',
      image: null,
    })
    setImagePreview(product.imagePath || '')
    setShowForm(true)
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

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product updated successfully!')
      } else {
        await axios.post('/api/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Product created successfully!')
      }
      resetForm()
      hasFetchedProducts.current = false
      fetchProducts()
    } catch {
      toast.error(`Failed to ${editingProduct ? 'update' : 'create'} product.`)
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

  if (!user || !isAdmin) return null

  const totalRevenue  = orders.reduce((s, o) => s + (o.totalAmount || 0), 0)
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
    <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', background: '#f8fafc' }}>
      <div className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>

        <div className="admin-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2.5rem' }}>

          {/* Sidebar */}
          <div className="admin-sidebar" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.5rem', alignSelf: 'start', position: 'sticky', top: 'calc(var(--nav-height) + 2rem)' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Seller Central
              </div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                {user.username}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                {user.role.replace('ROLE_', '')}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { key: 'products', icon: '📦', label: 'Inventory' },
                { key: 'orders',   icon: '📋', label: 'Orders'   },
                ...(user.role === 'ROLE_SUPER_ADMIN' ? [{ key: 'users', icon: '👥', label: 'Accounts' }] : []),
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    width: '100%', padding: '0.8rem 1rem', border: 'none',
                    borderRadius: 'var(--radius)', background: activeTab === item.key ? 'var(--primary-alpha)' : 'transparent',
                    color: activeTab === item.key ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: activeTab === item.key ? 700 : 500, cursor: 'pointer',
                    transition: 'all 0.2s', textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.key === 'orders' && pendingOrders > 0 && (
                    <span style={{ marginLeft: 'auto', background: 'var(--danger)', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                      {pendingOrders}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Total Products', value: products.length, icon: '📦', color: 'var(--primary)' },
                { label: 'Total Orders',   value: orders.length,   icon: '📋', color: 'var(--success)' },
                { label: 'Gross Revenue',  value: formatINR(totalRevenue), icon: '💰', color: 'var(--accent)' },
              ].map(stat => (
                <div key={stat.label} className="card" style={{ padding: '1.5rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                      {stat.icon}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{stat.label}</div>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="animate-fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Inventory ({products.length})</h2>
                  <button className="btn btn-primary btn-sm" onClick={() => showForm ? resetForm() : setShowForm(true)}>
                    {showForm ? '✕ Cancel' : '+ Add Product'}
                  </button>
                </div>

                {showForm && (
                  <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <form onSubmit={handleProductSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {formInput('name', 'Product Name')}
                        {formInput('category', 'Category')}
                      </div>
                      <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows={3} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                        {formInput('price', 'Price', 'number', { step: '0.01' })}
                        {formInput('stockQuantity', 'Stock Quantity', 'number')}
                      </div>
                      <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label className="form-label">Product Image</label>
                        <input type="file" className="form-control" onChange={handleImageChange} />
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{ marginTop: '1rem', width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }} />}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={formLoading}>{formLoading ? 'Saving...' : 'Save Product'}</button>
                        <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {products.map(p => (
                    <div key={p.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <img src={p.imagePath || FALLBACK_IMAGE_URI} alt={p.name} onError={handleImageError} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.category} • {formatINR(p.price)} • Stock: {p.stockQuantity}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => startEditProduct(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id, p.name)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="animate-fade-up">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Customer Orders ({orders.length})</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {orders.map(o => (
                    <div key={o.id} className="card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>Order #{o.id}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{o.customerName} • {o.customerEmail}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{formatINR(o.totalAmount)}</div>
                          <select className="form-control" style={{ marginTop: '0.5rem', padding: '0.3rem' }} value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}>
                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '1rem' }}>
                        {o.orderItems?.map(item => (
                          <div key={item.id} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span>{item.productName} x {item.quantity}</span>
                            <span>{formatINR(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && user.role === 'ROLE_SUPER_ADMIN' && (
              <div className="animate-fade-up">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>User Accounts ({users.length})</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {users.map(u => (
                    <div key={u.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{u.username}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </div>
                      <div style={{ padding: '0.25rem 0.75rem', borderRadius: 'full', background: 'var(--bg-secondary)', fontSize: '0.75rem', fontWeight: 700 }}>{u.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
