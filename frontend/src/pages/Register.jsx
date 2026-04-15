import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

function PasswordStrength({ password }) {
  const getStrength = (p) => {
    let score = 0
    if (p.length >= 8)            score++
    if (/[A-Z]/.test(p))          score++
    if (/[0-9]/.test(p))          score++
    if (/[^A-Za-z0-9]/.test(p))   score++
    return score
  }
  if (!password) return null
  const score = getStrength(password)
  const labels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong']
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#059669']
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '0.3rem' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= score ? colors[score] : 'var(--border)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
      <span style={{ fontSize: '0.75rem', color: colors[score], fontWeight: 600 }}>
        {labels[score]}
      </span>
    </div>
  )
}

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const { register } = useAuth()
  const toast         = useToast()
  const navigate      = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.warning('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      toast.warning('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const result = await register(form.username, form.password, form.email)
    setLoading(false)
    if (result.success) {
      toast.success('Account created! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1800)
    } else {
      toast.error(typeof result.message === 'string' ? result.message : 'Registration failed. Try again.')
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
              Join millions of<br />happy shoppers
            </h2>
            <p style={{ opacity: 0.75, lineHeight: 1.7, maxWidth: 340, fontSize: '1rem' }}>
              Create your free account and unlock exclusive deals, fast checkout, and order tracking.
            </p>
            <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {['Free to sign up', 'Exclusive member deals', 'Order tracking dashboard'].map(t => (
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
              Create Account
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Already have one?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Pick a username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    className="form-control"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
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
                <PasswordStrength password={form.password} />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    borderColor: form.confirmPassword && form.password !== form.confirmPassword
                      ? 'var(--danger)' : undefined,
                  }}
                />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '0.3rem', display: 'block' }}>
                    Passwords don't match
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ fontSize: '1rem', padding: '0.95rem', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? '⏳ Creating Account…' : 'Create Account →'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}