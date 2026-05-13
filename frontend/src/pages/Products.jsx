import React, { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import { useProducts } from '../hooks/useProducts'
import axios from 'axios'
import { ProductCard } from '../components/ProductCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import { formatINR } from '../utils/currencyUtils'

const SORT_OPTIONS = [
  { value: 'default',    label: '✨ Featured' },
  { value: 'price-asc',  label: '💰 Price: Low → High' },
  { value: 'price-desc', label: '💎 Price: High → Low' },
  { value: 'name-asc',   label: '🔤 Name: A → Z' },
]

const CATEGORY_ICONS = {
  Electronics: '📱', Fashion: '👗', Home: '🏠', Sports: '⚽',
  Beauty: '💄', Books: '📚', Toys: '🧸', Groceries: '🥦',
}

export default function Products() {
  const { user }               = useAuth()
  const { addToCart, cartItems } = useCart()
  const toast                  = useToast()
  const location               = useLocation()
  const navigate               = useNavigate()

  const urlParams      = new URLSearchParams(location.search)
  const urlQuery       = urlParams.get('q') || ''
  const urlCategory    = urlParams.get('category') || ''

  const [searchTerm,       setSearchTerm]       = useState(urlQuery)
  const [selectedCategory, setSelectedCategory] = useState(urlCategory)
  const [sort,             setSort]             = useState('default')
  const [priceMin,         setPriceMin]         = useState('')
  const [priceMax,         setPriceMax]         = useState('')
  const [showFilters,      setShowFilters]      = useState(false)
  const [wishlistIds,      setWishlistIds]      = useState([])

  const { products, loading, error, refetch } = useProducts()

  useEffect(() => {
    setSearchTerm(urlQuery)
    setSelectedCategory(urlCategory)
  }, [urlQuery, urlCategory])

  useEffect(() => {
    if (user) fetchWishlistIds()
    else setWishlistIds([])
  }, [user])

  const fetchWishlistIds = async () => {
    try {
      const res = await axios.get('/api/products/wishlist')
      setWishlistIds(res.data.map(item => item.product.id))
    } catch (err) {
      console.error('Failed to fetch wishlist', err)
    }
  }

  const handleToggleWishlist = async (product) => {
    if (!user) {
      navigate('/login')
      toast.info('Please login to use wishlist')
      return
    }

    const isWishlisted = wishlistIds.includes(product.id)
    try {
      if (isWishlisted) {
        await axios.delete(`/api/products/wishlist/${product.id}`)
        setWishlistIds(prev => prev.filter(id => id !== product.id))
        toast.success('Removed from wishlist')
      } else {
        await axios.post(`/api/products/wishlist/${product.id}`)
        setWishlistIds(prev => [...prev, product.id])
        toast.success('Added to wishlist')
      }
    } catch (err) {
      toast.error('Failed to update wishlist')
    }
  }

  const categories = useMemo(
    () => [...new Set(products.map(p => p.category).filter(Boolean))],
    [products]
  )

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
    if (selectedCategory) list = list.filter(p => p.category === selectedCategory)
    if (priceMin)         list = list.filter(p => Number(p.price) >= Number(priceMin))
    if (priceMax)         list = list.filter(p => Number(p.price) <= Number(priceMax))
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break
      default: break
    }
    return list
  }, [products, searchTerm, selectedCategory, sort, priceMin, priceMax])

  const handleAddToCart = (product) => {
    addToCart(product)
    toast.success(`${product.name} added to cart! 🛒`)
  }

  const clearFilters = () => {
    setSearchTerm(''); setSelectedCategory(''); setSort('default')
    setPriceMin(''); setPriceMax(''); navigate('/products')
  }

  const hasFilters = searchTerm || selectedCategory || sort !== 'default' || priceMin || priceMax

  return (
    <div className="page-content" style={{ background: '#f8fafc', minHeight: '100vh' }}>

      {/* ── Page Hero Banner ──────────────────────────────────────── */}
      <div className="prd-banner">
        <div className="prd-banner-orb prd-banner-orb-1" />
        <div className="prd-banner-orb prd-banner-orb-2" />
        <div className="prd-banner-inner">
          <div className="prd-banner-eyebrow">🛍️ MyStore Catalogue</div>
          <h1 className="prd-banner-title">Discover Amazing Products</h1>
          <p className="prd-banner-sub">Browse {loading ? '…' : products.length}+ products across all categories</p>

          {/* Inline search */}
          <div className="prd-search-bar">
            <span className="prd-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products, brands, categories…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="prd-search-input"
            />
            {searchTerm && (
              <button className="prd-search-clear" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

        {/* ── Toolbar ───────────────────────────────────────────── */}
        <div className="prd-toolbar">
          <div className="prd-count">
            {loading
              ? <span className="prd-count-loader">Loading products…</span>
              : <><strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''} found</>
            }
          </div>

          <div className="prd-toolbar-right">
            <button
              className={`prd-filter-toggle ${showFilters ? 'prd-filter-toggle--active' : ''}`}
              onClick={() => setShowFilters(v => !v)}
            >
              ⚙️ Filters {showFilters ? '▲' : '▼'}
            </button>

            <div className="prd-sort-wrap">
              <select
                className="prd-sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {user?.role === 'ROLE_ADMIN' && (
              <a href="/admin" className="prd-admin-link">⚙️ Manage</a>
            )}
          </div>
        </div>

        {/* ── Advanced Filters Panel ────────────────────────────── */}
        {showFilters && (
          <div className="prd-filters-panel">
            <div className="prd-filter-item">
              <label className="prd-filter-label">Min Price (₹)</label>
              <input type="number" className="prd-filter-input" placeholder="0"
                     value={priceMin} onChange={e => setPriceMin(e.target.value)} min="0" />
            </div>
            <div className="prd-filter-item">
              <label className="prd-filter-label">Max Price (₹)</label>
              <input type="number" className="prd-filter-input" placeholder="100000"
                     value={priceMax} onChange={e => setPriceMax(e.target.value)} min="0" />
            </div>
            {hasFilters && (
              <button className="prd-clear-btn" onClick={clearFilters}>✕ Clear All</button>
            )}
          </div>
        )}

        {/* ── Category Pills ────────────────────────────────────── */}
        {categories.length > 0 && (
          <div className="prd-cats">
            <button
              className={`prd-cat-pill ${!selectedCategory ? 'prd-cat-pill--active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              🏪 All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`prd-cat-pill ${selectedCategory === cat ? 'prd-cat-pill--active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              >
                {CATEGORY_ICONS[cat] || '📦'} {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Active Filter Tags ────────────────────────────────── */}
        {hasFilters && (
          <div className="prd-active-tags">
            <span className="prd-active-label">Active filters:</span>
            {searchTerm && (
              <span className="prd-tag">
                🔍 "{searchTerm}" <button onClick={() => setSearchTerm('')}>×</button>
              </span>
            )}
            {selectedCategory && (
              <span className="prd-tag">
                {CATEGORY_ICONS[selectedCategory]} {selectedCategory}
                <button onClick={() => setSelectedCategory('')}>×</button>
              </span>
            )}
            {(priceMin || priceMax) && (
              <span className="prd-tag">
                {formatINR(priceMin||0)} – {formatINR(priceMax||'∞')}
                <button onClick={() => { setPriceMin(''); setPriceMax('') }}>×</button>
              </span>
            )}
            {sort !== 'default' && (
              <span className="prd-tag">
                {SORT_OPTIONS.find(o => o.value === sort)?.label}
                <button onClick={() => setSort('default')}>×</button>
              </span>
            )}
          </div>
        )}

        {/* ── States ───────────────────────────────────────────── */}
        {error && !loading && (
          <div className="prd-empty">
            <div className="prd-empty-icon">⚠️</div>
            <h2>Failed to Load Products</h2>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={refetch}>Try Again</button>
          </div>
        )}

        {loading && <SkeletonGrid count={8} />}

        {!loading && !error && filtered.length === 0 && (
          <div className="prd-empty">
            <div className="prd-empty-icon">🔍</div>
            <h2>{products.length === 0 ? 'No Products Yet' : 'No Results Found'}</h2>
            <p>{products.length === 0
              ? 'Products will appear here once they are added.'
              : 'Try adjusting your search or clearing your filters.'}
            </p>
            {products.length > 0 && (
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="products-grid">
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  isWishlisted: wishlistIds.includes(product.id),
                  onToggleWishlist: handleToggleWishlist
                }}
                onAddToCart={handleAddToCart}
                cartQuantity={cartItems.find(i => i.id === product.id)?.quantity || 0}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}