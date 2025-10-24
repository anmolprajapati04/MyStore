
import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Amazing Products</h1>
          <p>Shop the latest trends with unbeatable prices and fast delivery</p>
          <Link to="/products" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            🛍️ Start Shopping
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-grid">
        <div className="feature-card">
          <span className="feature-icon">🚀</span>
          <h3>Lightning Fast</h3>
          <p>Same-day shipping on thousands of products with express delivery options</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🛡️</span>
          <h3>Secure Shopping</h3>
          <p>Your data is protected with bank-level security and encrypted transactions</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">💎</span>
          <h3>Premium Quality</h3>
          <p>Carefully curated products from trusted brands and verified sellers</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🎯</span>
          <h3>Best Prices</h3>
          <p>Price match guarantee and exclusive deals for our loyal customers</p>
        </div>
      </section>

      {/* Trending Categories */}
      <section style={{ margin: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Shop by Category</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>Explore our wide range of product categories</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {[
            { name: 'Electronics', icon: '📱', color: '#3b82f6' },
            { name: 'Fashion', icon: '👕', color: '#8b5cf6' },
            { name: 'Home & Garden', icon: '🏠', color: '#10b981' },
            { name: 'Sports', icon: '⚽', color: '#f59e0b' },
            { name: 'Beauty', icon: '💄', color: '#ec4899' },
            { name: 'Books', icon: '📚', color: '#6366f1' }
          ].map((category, index) => (
            <Link 
              key={index}
              to="/products" 
              className="feature-card"
              style={{ 
                textDecoration: 'none',
                background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)`,
                borderColor: `${category.color}20`
              }}
            >
              <span className="feature-icon" style={{ fontSize: '2.5rem' }}>{category.icon}</span>
              <h3 style={{ color: 'var(--text-primary)' }}>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        color: 'white',
        padding: '4rem 2rem',
        borderRadius: 'var(--radius)',
        textAlign: 'center',
        margin: '4rem 0'
      }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>
          Ready to Transform Your Shopping Experience?
        </h2>
        <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
          Join thousands of satisfied customers who shop with confidence
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn" style={{ 
            background: 'rgba(255,255,255,0.2)', 
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            Browse Products
          </Link>
          <Link to="/register" className="btn btn-success">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home