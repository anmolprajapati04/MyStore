import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

function PasswordStrength({ password }) {
  if (!password) return null
  let score = 0
  if (password.length >= 8)          score++
  if (/[A-Z]/.test(password))        score++
  if (/[0-9]/.test(password))        score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  const labels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong']
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#059669']
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: '0.3rem' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= score ? colors[score] : '#e2e8f0',
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
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)
  const { register } = useAuth()
  const toast         = useToast()
  const navigate      = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.warning('Passwords do not match.'); return }
    if (form.password.length < 6) { toast.warning('Password must be at least 6 characters.'); return }
    setLoading(true)
    const result = await register(form.username, form.password, form.email)
    setLoading(false)
    if (result.success) {
      toast.success('Account created! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1800)
    } else {
      toast.error(typeof result.message === 'string' ? result.message : 'Registration failed.')
    }
  }

  return (
    <div className="auth2-page">
      {/* Left — branding */}
      <div className="auth2-left" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
        <div className="auth2-left-orb auth2-orb-1" style={{ background: 'rgba(236,72,153,0.3)' }} />
        <div className="auth2-left-orb auth2-orb-2" style={{ background: 'rgba(99,102,241,0.25)' }} />
        <div className="auth2-left-content">
          <div className="auth2-logo">🛍️ MyStore</div>
          <h2 className="auth2-brand-title">Join millions of<br />happy shoppers</h2>
          <p className="auth2-brand-sub">
            Create your free account and unlock exclusive deals, fast checkout, and order tracking.
          </p>
          <ul className="auth2-perks">
            {['Free to sign up — always', 'Exclusive member pricing', 'Real-time order tracking', 'Personalised recommendations'].map(t => (
              <li key={t}>
                <span className="auth2-perk-check">✓</span>{t}
              </li>
            ))}
          </ul>
          <div className="auth2-steps">
            {[{n:'1', t:'Create account'},{n:'2', t:'Browse 50K+ products'},{n:'3', t:'Checkout in seconds'}].map(s => (
              <div key={s.n} className="auth2-step">
                <span className="auth2-step-num">{s.n}</span>
                <span className="auth2-step-text">{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="auth2-right">
        <div className="auth2-card">
          <div className="auth2-card-header">
            <h1 className="auth2-title">Create Account 🚀</h1>
            <p className="auth2-subtitle">
              Already have one?{' '}
              <Link to="/login" className="auth2-link">Sign in here</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="auth2-form">
            <div className="auth2-field">
              <label className="auth2-label">Username</label>
              <div className="auth2-input-wrap">
                <span className="auth2-input-icon">👤</span>
                <input type="text" name="username" className="auth2-input"
                       placeholder="Pick a username" value={form.username}
                       onChange={handleChange} required autoFocus />
              </div>
            </div>

            <div className="auth2-field">
              <label className="auth2-label">Email Address</label>
              <div className="auth2-input-wrap">
                <span className="auth2-input-icon">✉️</span>
                <input type="email" name="email" className="auth2-input"
                       placeholder="you@example.com" value={form.email}
                       onChange={handleChange} required />
              </div>
            </div>

            <div className="auth2-field">
              <label className="auth2-label">Password</label>
              <div className="auth2-input-wrap">
                <span className="auth2-input-icon">🔒</span>
                <input type={showPw ? 'text' : 'password'} name="password" className="auth2-input"
                       placeholder="Min. 6 characters" value={form.password}
                       onChange={handleChange} required />
                <button type="button" className="auth2-pw-toggle" onClick={() => setShowPw(v => !v)}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <div className="auth2-field">
              <label className="auth2-label">Confirm Password</label>
              <div className="auth2-input-wrap">
                <span className="auth2-input-icon">🔐</span>
                <input
                  type={showPw ? 'text' : 'password'} name="confirmPassword" className="auth2-input"
                  placeholder="Repeat your password" value={form.confirmPassword}
                  onChange={handleChange} required
                  style={{ borderColor: form.confirmPassword && form.password !== form.confirmPassword ? '#ef4444' : undefined }}
                />
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <span style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: '0.3rem', display: 'block' }}>
                  ⚠️ Passwords don't match
                </span>
              )}
            </div>

            <button type="submit" className="auth2-submit" disabled={loading}>
              {loading
                ? <><span className="auth2-spinner" />Creating Account…</>
                : <>Create Account <span>→</span></>
              }
            </button>

            <p className="auth2-terms">
              By signing up you agree to our{' '}
              <a href="#" className="auth2-link">Terms of Service</a> and{' '}
              <a href="#" className="auth2-link">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}