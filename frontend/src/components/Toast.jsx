import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

// ---- Context ----
const ToastContext = createContext()

let toastId = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), duration)
    return id
  }, [removeToast])

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error:   (msg, dur) => addToast(msg, 'error', dur),
    info:    (msg, dur) => addToast(msg, 'info', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

// ---- UI ----
const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

const COLORS = {
  success: { bg: '#ecfdf5', border: '#10b981', icon: '#10b981', text: '#065f46' },
  error:   { bg: '#fef2f2', border: '#ef4444', icon: '#ef4444', text: '#7f1d1d' },
  info:    { bg: '#eff6ff', border: '#3b82f6', icon: '#3b82f6', text: '#1e3a8a' },
  warning: { bg: '#fffbeb', border: '#f59e0b', icon: '#f59e0b', text: '#78350f' },
}

function ToastItem({ toast, onRemove }) {
  const c = COLORS[toast.type] || COLORS.info
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      background: c.bg, border: `1px solid ${c.border}`, borderLeft: `4px solid ${c.border}`,
      borderRadius: '10px', padding: '0.875rem 1rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      animation: 'toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      maxWidth: '380px', width: '100%',
    }}>
      <span style={{
        flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%',
        background: c.icon, color: 'white', fontSize: '0.75rem', fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {ICONS[toast.type]}
      </span>
      <span style={{ flex: 1, color: c.text, fontSize: '0.9rem', lineHeight: 1.5 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: c.text, opacity: 0.6, fontSize: '1rem', padding: '0', lineHeight: 1,
        }}
      >×</button>
    </div>
  )
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.625rem',
    }}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
