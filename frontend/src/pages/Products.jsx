import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const { user } = useAuth()

  // Function to get full image URL - FIXED with useCallback
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return '/api/placeholder/200/200';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path, prepend the backend base URL
    return imagePath;
  }, [])

  // Memoized fetch function to prevent infinite loops
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/products')
      console.log('Products API response:', response.data)
      
      // Process products to ensure image URLs are correct
      const processedProducts = response.data.map(product => ({
        ...product,
        // Ensure imagePath is properly formatted
        imagePath: getImageUrl(product.imagePath || product.imageUrl)
      }))
      
      setProducts(processedProducts)
      setFilteredProducts(processedProducts)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(processedProducts.map(product => product.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [getImageUrl]) // Only depend on getImageUrl

  useEffect(() => {
    console.log('Products component mounted, fetching products...')
    fetchProducts()
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [fetchProducts]) // Only depend on fetchProducts

  useEffect(() => {
    console.log('Filtering products...', products.length, searchTerm, selectedCategory)
    // Filter products based on search and category
    let filtered = products
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }
    
    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    let newCart
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      newCart = [...cart, { ...product, quantity: 1 }]
    }
    
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    
    // Show success message with better UX
    alert(`${product.name} added to cart!`)
    
    // Dispatch event for cart updates
    const event = new CustomEvent('cartUpdated', { detail: newCart })
    window.dispatchEvent(event)
  }

  const getCartQuantity = (productId) => {
    const item = cart.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', class: 'badge-danger' }
    if (quantity < 10) return { text: 'Low Stock', class: 'badge-warning' }
    return { text: 'In Stock', class: 'badge-success' }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
  }

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
          <h2>Loading Products...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Discovering amazing products for you</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Debug Info - Remove after fixing */}
      <div style={{ 
        background: 'rgba(59, 130, 246, 0.1)', 
        padding: '1rem', 
        marginBottom: '1rem', 
        borderRadius: '8px',
        border: '1px solid #3b82f6',
        fontSize: '0.875rem'
      }}>
        <strong>Debug:</strong> Products: {products.length} | Loading: {loading.toString()} | Search: "{searchTerm}" | Category: "{selectedCategory}"
      </div>

      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        margin: '2rem 0 1.5rem 0',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Our Products
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            {filteredProducts.length} amazing products waiting for you
          </p>
        </div>
        
        {user && user.role === 'ROLE_ADMIN' && (
          <button 
            onClick={() => window.location.href = '/admin'}
            className="btn btn-primary"
          >
            ⚙️ Manage Products
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div style={{ 
        background: 'var(--surface)', 
        padding: '1.5rem', 
        borderRadius: 'var(--radius)',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label className="form-label">Search Products</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'var(--background)' }}
            />
          </div>
          
          <div>
            <label className="form-label">Filter by Category</label>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ background: 'var(--background)', minWidth: '150px' }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Active Filters */}
        {(searchTerm || selectedCategory) && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Active filters:</span>
            {searchTerm && (
              <span className="badge badge-primary" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                Search: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="badge badge-primary" style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                Category: {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory('')}
                  style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ×
                </button>
              </span>
            )}
            <button 
              onClick={clearFilters}
              className="btn btn-outline"
              style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
            >
              Clear All
            </button>
          </div>
        )}
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
          <h2>No Products Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {products.length === 0 ? 'No products available.' : 'Try adjusting your search or filter criteria'}
          </p>
          {products.length > 0 && (
            <button 
              onClick={clearFilters}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => {
            const stockStatus = getStockStatus(product.stockQuantity)
            const cartQuantity = getCartQuantity(product.id)
            const imageUrl = getImageUrl(product.imagePath || product.imageUrl)
            
            return (
              <div key={product.id} className="product-card">
                <div style={{ position: 'relative' }}>
                  <img 
                    src={imageUrl}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      console.warn(`Image failed to load: ${imageUrl}, using fallback`)
                      e.target.src = '/api/placeholder/200/200'
                    }}
                    onLoad={() => console.log(`Image loaded: ${imageUrl}`)}
                  />
                  <span className={`badge ${stockStatus.class}`} style={{ position: 'absolute', top: '0.5rem', left: '0.5rem' }}>
                    {stockStatus.text}
                  </span>
                  {cartQuantity > 0 && (
                    <span className="badge" style={{ 
                      position: 'absolute', 
                      top: '0.5rem', 
                      right: '0.5rem',
                      background: 'var(--accent)',
                      color: 'white'
                    }}>
                      In Cart: {cartQuantity}
                    </span>
                  )}
                </div>
                
                <div className="product-meta">
                  <span className="product-category">{product.category}</span>
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: '1.3' }}>
                  {product.name}
                </h3>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {product.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="product-price">${product.price}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {product.stockQuantity} available
                  </div>
                </div>
                
                <button 
                  onClick={() => addToCart(product)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={product.stockQuantity === 0}
                >
                  {product.stockQuantity === 0 ? 'Out of Stock' : 
                   cartQuantity > 0 ? `Add to Cart (${cartQuantity})` : 'Add to Cart'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Products