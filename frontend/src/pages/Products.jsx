import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { SkeletonGrid } from '../components/SkeletonCard'

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc',   label: 'Name: A → Z' },
]

export default function Products() {
  const { user } = useAuth()
  const { addToCart, cartItems } = useCart()
  const toast = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  // Read URL params for search + category (set by Hero/Header)
  const urlParams = new URLSearchParams(location.search)
  const urlQuery    = urlParams.get('q') || ''
  const urlCategory = urlParams.get('category') || ''

  const [searchTerm, setSearchTerm]         = useState(urlQuery)
  const [selectedCategory, setSelectedCategory] = useState(urlCategory)
  const [sort, setSort]                     = useState('default')

  const { products, loading, error, refetch } = useProducts()

  // Sync URL changes into state
  useEffect(() => {
    setSearchTerm(urlQuery)
    setSelectedCategory(urlCategory)
  }, [urlQuery, urlCategory])

  // Unique categories list
  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  )

  // Filter + sort — fully derived from state, no extra useEffect
  const filtered = useMemo(() => {
    let list = [...products]

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) {
      list = list.filter(p => p.category === selectedCategory)
    }

    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price);         break
      case 'price-desc': list.sort((a, b) => b.price - a.price);         break
      case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break
      default: break
    }

    return list
  }, [products, searchTerm, selectedCategory, sort])

  const getCartQty = (id) => {
    const item = cartItems.find(i => i.id === id)
    return item ? item.quantity : 0
  }

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success(`${product.name} added to cart! 🛒`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSort('default')
    navigate('/products')
  }

  const hasActiveFilters = searchTerm || selectedCategory || sort !== 'default'

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="page-content">
      <div className="container">

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>
              Our Products
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          {user?.role === 'ROLE_ADMIN' && (
            <a href="/admin" className="btn btn-outline btn-sm">⚙️ Manage Products</a>
          )}
        </div>

        {/* Search + sort bar */}
        <div className="filters-panel">
          <div className="filter-group" style={{ flex: '2', minWidth: '240px' }}>
            <label>Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search products…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Sort By</label>
            <select
              className="form-control"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ alignSelf: 'flex-end' }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="category-pills">
            <button
              className={`category-pill${!selectedCategory ? ' active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-pill${selectedCategory === cat ? ' active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Active filter tags */}
        {hasActiveFilters && (
          <div className="active-filters">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active:</span>
            {searchTerm && (
              <span className="filter-tag">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')}>×</button>
              </span>
            )}
            {selectedCategory && (
              <span className="filter-tag">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')}>×</button>
              </span>
            )}
            {sort !== 'default' && (
              <span className="filter-tag">
                {SORT_OPTIONS.find(o => o.value === sort)?.label}
                <button onClick={() => setSort('default')}>×</button>
              </span>
            )}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="empty-state">
            <div className="empty-state__icon">⚠️</div>
            <h2>Failed to Load Products</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={refetch}>Try Again</button>
          </div>
        )}

        {/* Skeleton loader */}
        {loading && <SkeletonGrid count={8} />}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h2>{products.length === 0 ? 'No Products Yet' : 'No Results Found'}</h2>
            <p>
              {products.length === 0
                ? 'Products will appear here once they are added.'
                : 'Try adjusting your search or clearing your filters.'}
            </p>
            {products.length > 0 && (
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            )}
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="products-grid">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                cartQuantity={getCartQty(product.id)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}