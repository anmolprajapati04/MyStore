import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function Login() {
  const [form,    setForm]    = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)
  const { login }  = useAuth()
  const toast      = useToast()
  const navigate   = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const result = await login(form.username, form.password)
    setLoading(false)
    if (result.success) {
      toast.success(`Welcome back, ${form.username}! 👋`)
      navigate('/products')
    } else {
      toast.error(result.message || 'Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="auth2-page">
      {/* Left — branding */}
      <div className="auth2-left">
        <div className="auth2-left-orb auth2-orb-1" />
        <div className="auth2-left-orb auth2-orb-2" />
        <div className="auth2-left-content">
          <div className="auth2-logo">🛍️ MyStore</div>
          <h2 className="auth2-brand-title">Your favourite<br />store awaits</h2>
          <p className="auth2-brand-sub">
            Sign in to access your cart, track orders, and enjoy personalised shopping recommendations.
          </p>
          <ul className="auth2-perks">
            {['50,000+ curated products', '120K+ happy customers', '30-day easy returns', '24/7 live support'].map(t => (
              <li key={t}>
                <span className="auth2-perk-check">✓</span>{t}
              </li>
            ))}
          </ul>
          <div className="auth2-review">
            <div className="auth2-review-stars">★★★★★</div>
            <p className="auth2-review-text">"Fastest delivery I've ever experienced. Love this store!"</p>
            <span className="auth2-review-author">— Priya S., Verified Buyer</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="auth2-right">
        <div className="auth2-card">
          <div className="auth2-card-header">
            <h1 className="auth2-title">Welcome back 👋</h1>
            <p className="auth2-subtitle">
              New here?{' '}
              <Link to="/register" className="auth2-link">Create a free account</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="auth2-form">
            <div className="auth2-field">
              <label className="auth2-label">Username or Email</label>
              <div className="auth2-input-wrap">
                <span className="auth2-input-icon">👤</span>
                <input
                  type="text" name="username"
                  className="auth2-input"
                  placeholder="Enter username or email"
                  value={form.username}
                  onChange={handleChange}
                  required autoFocus autoComplete="username"
                />
              </div>
            </div>

            <div className="auth2-field">
              <label className="auth2-label">Password</label>
              <div className="auth2-input-wrap">
                <span className="auth2-input-icon">🔒</span>
                <input
                  type={showPw ? 'text' : 'password'} name="password"
                  className="auth2-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required autoComplete="current-password"
                />
                <button type="button" className="auth2-pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="auth2-submit" disabled={loading}>
              {loading
                ? <><span className="auth2-spinner" />Signing In…</>
                : <>Sign In <span>→</span></>
              }
            </button>
          </form>

          <div className="auth2-divider"><span>or continue with</span></div>
          <div className="auth2-social">
            <button className="auth2-social-btn">🌐 Google</button>
            <button className="auth2-social-btn">📘 Facebook</button>
          </div>
        </div>
      </div>
    </div>
  )
}