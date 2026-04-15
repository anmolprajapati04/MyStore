import React from 'react'
import { Link } from 'react-router-dom'

const categories = [
  { name: 'Electronics', icon: '📱', color: '#4f46e5', bg: 'rgba(79,70,229,0.07)'  },
  { name: 'Fashion',     icon: '👗', color: '#8b5cf6', bg: 'rgba(139,92,246,0.07)' },
  { name: 'Home',        icon: '🏠', color: '#10b981', bg: 'rgba(16,185,129,0.07)' },
  { name: 'Sports',      icon: '⚽', color: '#f59e0b', bg: 'rgba(245,158,11,0.07)' },
  { name: 'Beauty',      icon: '💄', color: '#ec4899', bg: 'rgba(236,72,153,0.07)' },
  { name: 'Books',       icon: '📚', color: '#3b82f6', bg: 'rgba(59,130,246,0.07)' },
  { name: 'Toys',        icon: '🧸', color: '#f97316', bg: 'rgba(249,115,22,0.07)' },
  { name: 'Groceries',   icon: '🥦', color: '#22c55e', bg: 'rgba(34,197,94,0.07)'  },
]

const features = [
  { icon: '🚀', title: 'Same-Day Delivery',   desc: 'Get your orders delivered the same day in select cities.' },
  { icon: '🔒', title: 'Secure Checkout',      desc: '256-bit SSL encryption on every transaction, always.' },
  { icon: '↩️', title: '30-Day Returns',       desc: 'Not happy? Return it hassle-free within 30 days.' },
  { icon: '🎧', title: '24/7 Support',         desc: 'Our team is here around the clock to help you out.' },
]

export default function Home() {
  return (
    <div className="page-content">
      <div className="container">

        {/* ── HERO ────────────────────────────────────────────────── */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div className="hero">
            {/* Dot grid overlay */}
            <div className="hero-grid-overlay" />

            <div className="hero-content">
              {/* Eyebrow badge */}
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                New Season — Up to 60% Off
              </div>

              {/* Headline */}
              <h1>
                Shop Smarter,<br />
                Live <span className="hero-highlight">Better</span>
              </h1>

              {/* Subtext */}
              <p>
                Discover millions of products — from everyday essentials to luxury finds.
                Unbeatable prices. Lightning-fast delivery. Zero compromise.
              </p>

              {/* CTAs */}
              <div className="hero-cta">
                <Link to="/products" className="btn btn-accent btn-xl" style={{ borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                  🛍️ Shop Now
                </Link>
                <Link to="/register" className="btn btn-white btn-xl" style={{ borderRadius: 'var(--radius-full)' }}>
                  Join Free →
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-stats">
                {[
                  { value: '50K+',  label: 'Products' },
                  { value: '120K+', label: 'Customers' },
                  { value: '4.9★',  label: 'Avg Rating' },
                  { value: '99%',   label: 'Satisfaction' },
                ].map(s => (
                  <div key={s.label} className="hero-stat">
                    <div className="hero-stat-value">{s.value}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP ─────────────────────────────────────────── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}>
            {[
              { icon: '🚚', text: 'Free Delivery', sub: 'On orders over ₹499' },
              { icon: '🔒', text: 'Secure Payment', sub: '256-bit encryption' },
              { icon: '↩️', text: 'Easy Returns',   sub: '30-day policy' },
              { icon: '🎧', text: '24/7 Support',   sub: 'Always here to help' },
            ].map((item, i, arr) => (
              <div key={item.text} style={{
                flex: '1',
                minWidth: '180px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '1.25rem 1.5rem',
                borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: '1.75rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.text}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ──────────────────────────────────────────── */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-heading">
            <span className="section-eyebrow">Explore</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-sub">Find exactly what you're looking for across our top categories</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '1rem',
          }}>
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="animate-fade-up"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1.5rem 1rem',
                  borderRadius: 'var(--radius-xl)',
                  background: cat.bg,
                  border: `1.5px solid ${cat.color}20`,
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                  animationDelay: `${i * 0.04}s`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: `${cat.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem',
                  border: `1.5px solid ${cat.color}25`,
                }}>
                  {cat.icon}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────── */}
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-heading">
            <span className="section-eyebrow">Why MyStore</span>
            <h2 className="section-title">Everything You Need</h2>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="feature-card animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s`, borderRadius: 'var(--radius-xl)' }}
              >
                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{f.icon}</span>
                <h3 style={{ fontWeight: 800, fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BANNER CTA ──────────────────────────────────────────── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 40%, #4338ca 100%)',
            borderRadius: 'var(--radius-2xl)',
            padding: '4rem 3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: '-30%', right: '10%',
              width: 400, height: 400,
              background: 'radial-gradient(circle, rgba(129,140,248,0.2), transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: 520 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.9rem',
                fontSize: '0.75rem', fontWeight: 700,
                color: '#a5b4fc',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}>
                🎉 Limited Time Offer
              </div>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 900, color: '#fff',
                letterSpacing: '-0.5px',
                lineHeight: 1.2, marginBottom: '0.875rem',
              }}>
                New Members Get<br />
                <span style={{ color: '#fbbf24' }}>20% Off</span> Their First Order
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, fontSize: '0.95rem' }}>
                Create your free account today and unlock exclusive deals, early access to sales, and a personalised shopping experience.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
              <Link to="/register" className="btn btn-accent btn-xl" style={{ borderRadius: 'var(--radius-full)', fontWeight: 800 }}>
                Claim Offer →
              </Link>
              <Link to="/products" className="btn btn-white btn-xl" style={{ borderRadius: 'var(--radius-full)' }}>
                Browse First
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}