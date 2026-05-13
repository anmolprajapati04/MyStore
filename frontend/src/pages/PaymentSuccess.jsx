import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { formatINR } from '../utils/currencyUtils';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, paymentId } = location.state || {};

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem', textAlign: 'center', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ 
          width: '80px', height: '80px', background: '#10B981', color: 'white', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '40px', margin: '0 auto 2rem', animation: 'scaleUp 0.5s ease-out' 
        }}>
          ✓
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Order Confirmed!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Your payment was successful and your order is being processed.
        </p>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Order ID</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>#{order.id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Payment ID</span>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{paymentId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Amount Paid</span>
            <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{formatINR(order.totalAmount)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/orders" className="btn btn-primary btn-lg" style={{ width: '100%' }}>View My Orders</Link>
          <Link to="/" className="btn btn-ghost" style={{ width: '100%' }}>Continue Shopping</Link>
        </div>
      </div>

      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
