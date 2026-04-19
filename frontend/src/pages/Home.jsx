import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

/* ── Data ─────────────────────────────────────────────────────── */
const categories = [
  { name: 'Electronics', icon: '📱', color: '#6366f1', gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80' },
  { name: 'Fashion', icon: '👗', color: '#ec4899', gradient: 'linear-gradient(135deg,#ec4899,#f43f5e)', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80' },
  { name: 'Home', icon: '🏠', color: '#10b981', gradient: 'linear-gradient(135deg,#10b981,#06b6d4)', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80' },
  { name: 'Sports', icon: '⚽', color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80' },
  { name: 'Beauty', icon: '💄', color: '#e879f9', gradient: 'linear-gradient(135deg,#e879f9,#ec4899)', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80' },
  { name: 'Books', icon: '📚', color: '#3b82f6', gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)', img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80' },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'Verified Buyer', rating: 5, text: 'Absolutely love shopping here! The delivery is lightning fast and everything arrived perfectly packaged.', avatar: 'PS' },
  { name: 'Rahul Mehta', role: 'Premium Member', rating: 5, text: 'Best e-commerce experience I have had. The product quality is always top-notch and returns are hassle-free.', avatar: 'RM' },
  { name: 'Ananya Singh', role: 'Verified Buyer', rating: 5, text: 'Found exactly what I was looking for at a price I could not believe. Will definitely be shopping here again!', avatar: 'AS' },
  { name: 'Vikram Nair', role: 'Premium Member', rating: 5, text: 'The 24/7 support team is incredible. Resolved my issue within minutes. True customer-first company.', avatar: 'VN' },
]

const brands = ['Samsung', 'Apple', 'Nike', 'Sony', 'Adidas', 'LG', 'Boat', 'Puma', 'HP', 'Lenovo', 'Canon', 'Philips']

const featuredProducts = [
  { id: 1, name: 'Premium Wireless Earbuds', price: 2999, original: 5999, img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', tag: '50% OFF', rating: 4.8, cat: 'Electronics' },
  { id: 2, name: 'Designer Silk Saree', price: 3499, original: 6999, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80', tag: 'HOT', rating: 4.9, cat: 'Fashion' },
  { id: 3, name: 'Smart LED Desk Lamp', price: 1299, original: 2499, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80', tag: 'NEW', rating: 4.7, cat: 'Home' },
  { id: 4, name: 'Running Shoes Pro', price: 4299, original: 7999, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', tag: '46% OFF', rating: 4.8, cat: 'Sports' },
]

/* ── Hooks ─────────────────────────────────────────────────────── */
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function useIntersection(ref, threshold = 0.2) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return visible
}

/* ── Sub-components ────────────────────────────────────────────── */
function FloatingParticle({ style }) {
  return <div className="hv2-particle" style={style} />
}

function StarRating({ rating }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: '#94a3b8', marginLeft: 4, fontSize: '0.78rem' }}>{rating}</span>
    </span>
  )
}

/* ── Main Component ────────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const statsVis = useIntersection(statsRef)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [hoveredCard, setHoveredCard] = useState(null)

  const c1 = useCountUp(50000, 2000, statsVis)
  const c2 = useCountUp(120000, 2200, statsVis)
  const c3 = useCountUp(98, 1800, statsVis)
  const c4 = useCountUp(4900, 2400, statsVis)

  /* Mouse parallax on hero */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    hero.addEventListener('mousemove', onMove)
    return () => hero.removeEventListener('mousemove', onMove)
  }, [])

  /* Auto-rotate testimonials */
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(a => (a + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  /* Parallax values */
  const px = (mousePos.x - 0.5) * 30
  const py = (mousePos.y - 0.5) * 20

  /* Particles */
  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${(i * 37 + 5) % 100}%`,
    top: `${(i * 53 + 10) % 100}%`,
    animationDelay: `${(i * 0.4) % 8}s`,
    animationDuration: `${6 + (i % 5)}s`,
    width: `${4 + (i % 4) * 3}px`,
    height: `${4 + (i % 4) * 3}px`,
    opacity: 0.15 + (i % 4) * 0.07,
  }))

  return (
    <div style={{ overflowX: 'hidden', background: '#ffffff' }}>

      {/* ══════════════ HERO ══════════════════════════════════════ */}
      <section ref={heroRef} className="hv2-hero">
        {/* Animated gradient orbs */}
        <div className="hv2-orb hv2-orb-1" />
        <div className="hv2-orb hv2-orb-2" />
        <div className="hv2-orb hv2-orb-3" />

        {/* Grid overlay */}
        <div className="hv2-grid" />

        {/* Particles */}
        {particles.map((p, i) => <FloatingParticle key={i} style={p} />)}

        {/* Content */}
        <div className="hv2-hero-inner">
          <div className="hv2-hero-text">
            <div className="hv2-badge">
              <span className="hv2-badge-dot" />
              ✨ New Season Sale — Up to 70% Off
            </div>

            <h1 className="hv2-headline">
              Shop the Future
              <br />
              <span className="hv2-headline-gradient">Live Better</span>
              <br />
              <span className="hv2-headline-outline">Every Day</span>
            </h1>

            <p className="hv2-subtext">
              Discover millions of premium products — from cutting-edge electronics
              to timeless fashion. Unbeatable prices, lightning delivery, zero compromise.
            </p>

            <div className="hv2-hero-cta">
              <Link to="/products" className="hv2-btn-primary">
                <span>Shop Now</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link to="/register" className="hv2-btn-ghost">
                Join Free — It's Quick
              </Link>
            </div>

            {/* Avatars trust */}
            <div className="hv2-social-proof">
              <div className="hv2-avatars">
                {['A', 'B', 'C', 'D'].map((l, i) => (
                  <div key={i} className="hv2-avatar" style={{ left: i * 22, background: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'][i] }}>{l}</div>
                ))}
              </div>
              <div>
                <div className="hv2-stars">★★★★★ <span>4.9/5</span></div>
                <div className="hv2-social-text">Trusted by 120,000+ shoppers</div>
              </div>
            </div>
          </div>

          {/* 3D floating product card */}
          <div className="hv2-hero-visual"
            style={{ transform: `perspective(1000px) rotateY(${-px * 0.3}deg) rotateX(${py * 0.2}deg)` }}>

            {/* Main card */}
            <div className="hv2-product-card-3d">
              <div className="hv2-card-glow" />
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=90"
                alt="Premium Watch"
                className="hv2-card-img"
              />
              <div className="hv2-card-content">
                <div className="hv2-card-tag">⚡ Flash Deal</div>
                <div className="hv2-card-name">Premium Smart Watch</div>
                <div className="hv2-card-price">
                  <span className="hv2-price-now">₹4,299</span>
                  <span className="hv2-price-old">₹8,999</span>
                  <span className="hv2-price-off">52% OFF</span>
                </div>
                <div className="hv2-card-meta">
                  <StarRating rating={4.9} />
                  <span style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 700 }}>✓ In Stock</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="hv2-float-badge hv2-fb-1" style={{ transform: `translate(${px * 0.5}px,${py * 0.3}px)` }}>
              🚚 Free Delivery
            </div>
            <div className="hv2-float-badge hv2-fb-2" style={{ transform: `translate(${-px * 0.4}px,${py * 0.4}px)` }}>
              🔒 Secure Pay
            </div>
            <div className="hv2-float-badge hv2-fb-3" style={{ transform: `translate(${px * 0.3}px,${-py * 0.5}px)` }}>
              ↩️ 30-Day Return
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hv2-scroll-cue">
          <div className="hv2-scroll-mouse"><div className="hv2-scroll-wheel" /></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ══════════════ BRAND MARQUEE ═════════════════════════════ */}
      <section className="hv2-marquee-section">
        <div className="hv2-marquee-label">Trusted Brands</div>
        <div className="hv2-marquee-track">
          <div className="hv2-marquee-inner">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="hv2-marquee-item">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ════════════════════════════════════ */}
      <section ref={statsRef} className="hv2-stats-section">
        {[
          { value: c1.toLocaleString() + '+', label: 'Products', icon: '📦', color: '#6366f1' },
          { value: c2.toLocaleString() + '+', label: 'Happy Customers', icon: '😊', color: '#10b981' },
          { value: c3 + '%', label: 'Satisfaction', icon: '⭐', color: '#f59e0b' },
          { value: (c4 / 1000).toFixed(1) + '★', label: 'Avg Rating', icon: '🏆', color: '#ec4899' },
        ].map((s, i) => (
          <div key={i} className="hv2-stat-card">
            <div className="hv2-stat-icon" style={{ color: s.color }}>{s.icon}</div>
            <div className="hv2-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="hv2-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ══════════════ CATEGORIES ════════════════════════════════ */}
      <section className="hv2-section">
        <div className="hv2-section-head">
          <div className="hv2-section-eyebrow">Explore</div>
          <h2 className="hv2-section-title">Shop by Category</h2>
          <p className="hv2-section-sub">Find exactly what you're looking for across our curated categories</p>
        </div>

        <div className="hv2-cat-grid">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="hv2-cat-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="hv2-cat-img-wrap">
                <img src={cat.img} alt={cat.name} className="hv2-cat-img" loading="lazy" />
                <div className="hv2-cat-overlay" style={{ background: cat.gradient + '99' }} />
              </div>
              <div className="hv2-cat-body">
                <span className="hv2-cat-icon">{cat.icon}</span>
                <span className="hv2-cat-name">{cat.name}</span>
                <span className="hv2-cat-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════ FEATURED PRODUCTS ════════════════════════ */}
      <section className="hv2-section hv2-section-dark">
        <div className="hv2-section-head">
          <div className="hv2-section-eyebrow">Trending Now</div>
          <h2 className="hv2-section-title">Hot Picks 🔥</h2>
          <p className="hv2-section-sub">Hand-picked deals changing every day — grab them before they're gone</p>
        </div>

        <div className="hv2-products-grid">
          {featuredProducts.map((p, i) => (
            <Link
              key={p.id}
              to="/products"
              className="hv2-prod-card"
              style={{ animationDelay: `${i * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(p.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="hv2-prod-img-wrap">
                <img src={p.img} alt={p.name} className="hv2-prod-img" loading="lazy"
                  style={{ transform: hoveredCard === p.id ? 'scale(1.1)' : 'scale(1)' }} />
                <div className="hv2-prod-tag">{p.tag}</div>
                <div className="hv2-prod-wishlist">🤍</div>
              </div>
              <div className="hv2-prod-body">
                <div className="hv2-prod-cat">{p.cat}</div>
                <div className="hv2-prod-name">{p.name}</div>
                <StarRating rating={p.rating} />
                <div className="hv2-prod-pricing">
                  <span className="hv2-prod-price">₹{p.price.toLocaleString()}</span>
                  <span className="hv2-prod-original">₹{p.original.toLocaleString()}</span>
                </div>
                <button className="hv2-prod-btn">Add to Cart 🛒</button>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/products" className="hv2-btn-primary" style={{ display: 'inline-flex' }}>
            View All Products
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* ══════════════ PROMO BANNERS ═════════════════════════════ */}
      <section className="hv2-section">
        <div className="hv2-promo-grid">
          <div className="hv2-promo-card hv2-promo-large" style={{ background: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' }}>
            <div className="hv2-promo-blob" />
            <div className="hv2-promo-content">
              <div className="hv2-promo-eyebrow">🎯 Members Exclusive</div>
              <h3 className="hv2-promo-title">Get 20% Off<br />Your First Order</h3>
              <p className="hv2-promo-desc">Create your free account and unlock exclusive member pricing instantly.</p>
              <Link to="/register" className="hv2-btn-accent">Claim Now →</Link>
            </div>
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80"
              alt="promo" className="hv2-promo-img" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="hv2-promo-card hv2-promo-small" style={{ background: 'linear-gradient(135deg,#064e3b,#065f46)' }}>
              <div className="hv2-promo-content">
                <div className="hv2-promo-eyebrow">🚚 Free Shipping</div>
                <h3 className="hv2-promo-title" style={{ fontSize: '1.4rem' }}>On Orders Above ₹499</h3>
                <Link to="/products" className="hv2-btn-ghost-sm">Shop Now →</Link>
              </div>
              <span style={{ fontSize: '3.5rem', position: 'absolute', right: '1.5rem', bottom: '1rem', opacity: 0.3 }}>📦</span>
            </div>

            <div className="hv2-promo-card hv2-promo-small" style={{ background: 'linear-gradient(135deg,#4c1d95,#5b21b6)' }}>
              <div className="hv2-promo-content">
                <div className="hv2-promo-eyebrow">⚡ Flash Sale</div>
                <h3 className="hv2-promo-title" style={{ fontSize: '1.4rem' }}>Electronics Up to 60% Off</h3>
                <Link to="/products?category=Electronics" className="hv2-btn-ghost-sm">Grab Deals →</Link>
              </div>
              <span style={{ fontSize: '3.5rem', position: 'absolute', right: '1.5rem', bottom: '1rem', opacity: 0.3 }}>📱</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ═════════════════════════════════ */}
      <section className="hv2-section hv2-section-dark">
        <div className="hv2-features-grid">
          {[
            { icon: '🚀', title: 'Same-Day Delivery', desc: 'Get your order the same day in select cities', color: '#6366f1' },
            { icon: '🔒', title: 'Secure Checkout', desc: '256-bit SSL encryption on every transaction', color: '#10b981' },
            { icon: '↩️', title: '30-Day Returns', desc: 'Not happy? Return hassle-free, no questions', color: '#f59e0b' },
            { icon: '🎧', title: '24/7 Support', desc: 'Our team is here around the clock for you', color: '#ec4899' },
          ].map((f, i) => (
            <div key={i} className="hv2-feature-card">
              <div className="hv2-feature-icon" style={{ background: f.color + '22', color: f.color }}>{f.icon}</div>
              <h3 className="hv2-feature-title">{f.title}</h3>
              <p className="hv2-feature-desc">{f.desc}</p>
              <div className="hv2-feature-line" style={{ background: f.color }} />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════════════════════ */}
      <section className="hv2-section">
        <div className="hv2-section-head">
          <div className="hv2-section-eyebrow">Social Proof</div>
          <h2 className="hv2-section-title">What Our Customers Say</h2>
        </div>

        <div className="hv2-testimonials">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`hv2-testimonial-card ${i === activeTestimonial ? 'hv2-testimonial-active' : ''}`}
              onClick={() => setActiveTestimonial(i)}
            >
              <div className="hv2-testimonial-stars">{'★'.repeat(t.rating)}</div>
              <p className="hv2-testimonial-text">"{t.text}"</p>
              <div className="hv2-testimonial-author">
                <div className="hv2-testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="hv2-testimonial-name">{t.name}</div>
                  <div className="hv2-testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hv2-testimonial-dots">
          {testimonials.map((_, i) => (
            <button key={i} className={`hv2-dot ${i === activeTestimonial ? 'hv2-dot-active' : ''}`}
              onClick={() => setActiveTestimonial(i)} />
          ))}
        </div>
      </section>

      {/* ══════════════ FINAL CTA ═════════════════════════════════ */}
      <section className="hv2-final-cta">
        <div className="hv2-cta-orb hv2-cta-orb-1" />
        <div className="hv2-cta-orb hv2-cta-orb-2" />
        <div className="hv2-cta-orb hv2-cta-orb-3" />
        <div className="hv2-cta-content">
          <div className="hv2-cta-eyebrow">🎊 Join the MyStore Family</div>
          <h2 className="hv2-cta-title">Start Shopping Smarter Today</h2>
          <p className="hv2-cta-sub">Millions of products. Unbeatable prices. Delivered to your door.</p>
          <div className="hv2-cta-btns">
            <Link to="/products" className="hv2-btn-primary hv2-btn-glow">
              Explore Products
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/register" className="hv2-btn-outline-white">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}