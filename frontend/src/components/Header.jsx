import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { cartCount }    = useCart()
  const navigate         = useNavigate()
  const location         = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  const isActive = (path) => location.pathname === path

  const handleLogout = () => { logout(); navigate('/') }

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : ''

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav">

          {/* ── Left: Brand ───────────────────────────────── */}
          <Link to="/" className="nav-brand">
            <span className="nav-brand-icon">🛍️</span>
            <span>MyStore</span>
          </Link>

          {/* ── Center: Navigation Links ──────────────────── */}
          <nav className="nav-center" aria-label="Main navigation">
            <Link to="/" className={`nav-link${isActive('/') ? ' nav-link--active' : ''}`}>Home</Link>
            <Link to="/products" className={`nav-link${isActive('/products') ? ' nav-link--active' : ''}`}>Products</Link>
            {user && (
              <>
                <Link to="/orders" className={`nav-link${isActive('/orders') ? ' nav-link--active' : ''}`}>My Orders</Link>
                <Link to="/wishlist" className={`nav-link${isActive('/wishlist') ? ' nav-link--active' : ''}`}>Wishlist</Link>
              </>
            )}
            {user && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_SUPER_ADMIN') && (
              <Link to="/admin" className={`nav-link${isActive('/admin') ? ' nav-link--active' : ''}`}>Admin</Link>
            )}
          </nav>

          {/* ── Right: Actions ────────────────────────────── */}
          <div className="nav-actions">
            {user ? (
              <>
                {/* Cart Button */}
                <Link to="/cart" className="nav-action-btn nav-action-btn--cart" title="Cart">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {cartCount > 0 && (
                    <span className="nav-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                  )}
                </Link>

                {/* User + Logout */}
                <div className="nav-user-group">
                  <div className="user-avatar" title={user.username}>{initials}</div>
                  <span className="nav-username">{user.username}</span>
                  <button className="nav-logout-btn" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link nav-link--action">Login</Link>
                <Link to="/register" className="nav-signup-btn">Get Started</Link>
              </>
            )}

            {/* Hamburger */}
            <button
              className={`nav-hamburger${drawerOpen ? ' open' : ''}`}
              onClick={() => setDrawerOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Drawer ────────────────────────────────── */}
      {drawerOpen && (
        <div className="nav-drawer open" onClick={e => { if (e.target === e.currentTarget) setDrawerOpen(false) }}>
          <div className="nav-drawer__panel">
            <div className="nav-drawer__header">
              <span className="nav-brand">🛍️ MyStore</span>
              <button className="nav-drawer__close" onClick={() => setDrawerOpen(false)}>✕</button>
            </div>
            <nav className="nav-drawer__links">
              <Link to="/">🏠 Home</Link>
              <Link to="/products">🛒 Products</Link>
              {user ? (
                <>
                  <Link to="/cart">🛍️ Cart {cartCount > 0 && `(${cartCount})`}</Link>
                  <Link to="/wishlist">💖 Wishlist</Link>
                  <Link to="/orders">📦 My Orders</Link>
                  {user && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_SUPER_ADMIN') && <Link to="/admin">⚙️ Admin</Link>}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                    <button onClick={handleLogout} className="nav-drawer__logout">
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register" className="nav-signup-btn" style={{ display: 'block', textAlign: 'center', marginTop: '0.5rem' }}>Get Started</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}