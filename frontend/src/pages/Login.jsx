import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function Login() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
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
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', paddingTop: 'var(--nav-height)' }}>
      <div className="auth-layout">

        {/* Brand Panel */}
        <div className="auth-brand-panel">
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '1rem' }}>
              MyStore
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Your favourite<br />store awaits
            </h2>
            <p style={{ opacity: 0.75, lineHeight: 1.7, maxWidth: 340, fontSize: '1rem' }}>
              Sign in to access your cart, track orders, and enjoy personalised shopping recommendations.
            </p>
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {['50,000+ products', '120K+ happy customers', '30-day easy returns'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: 0.85, fontSize: '0.9rem' }}>
                  <span style={{ color: '#a5b4fc' }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="auth-panel">
          <div className="auth-form-wrap">
            <h1 style={{ fontSize: '1.875rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up free</Link>
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{
                      position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600,
                    }}
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ fontSize: '1rem', padding: '0.95rem', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? '⏳ Signing In…' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}