import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const cart = JSON.parse(savedCart)
        const count = cart.reduce((total, item) => total + item.quantity, 0)
        setCartCount(count)
      }
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)
    
    return () => {
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="nav-brand">
            🛍️ MyStore
          </Link>
          
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                style={isActiveRoute('/') ? { color: 'var(--primary)' } : {}}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/products"
                style={isActiveRoute('/products') ? { color: 'var(--primary)' } : {}}
              >
                Products
              </Link>
            </li>
            
            {user ? (
              <>
                <li>
                  <Link 
                    to="/cart"
                    style={isActiveRoute('/cart') ? { color: 'var(--primary)' } : {}}
                  >
                    🛒 Cart
                    {cartCount > 0 && (
                      <span className="cart-counter">{cartCount}</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/orders"
                    style={isActiveRoute('/orders') ? { color: 'var(--primary)' } : {}}
                  >
                    📦 Orders
                  </Link>
                </li>
                {user.role === 'ROLE_ADMIN' && (
                  <li>
                    <Link 
                      to="/admin"
                      style={isActiveRoute('/admin') ? { color: 'var(--primary)' } : {}}
                    >
                      ⚙️ Admin
                    </Link>
                  </li>
                )}
                <li className="user-section">
                  <span className="user-greeting">Hi, {user.username}!</span>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login"
                    style={isActiveRoute('/login') ? { color: 'var(--primary)' } : {}}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register"
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header