import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function PaymentFailure() {
  const location = useLocation();
  const { error } = location.state || { error: 'Something went wrong with your payment.' };

  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem', textAlign: 'center', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ 
          width: '80px', height: '80px', background: '#EF4444', color: 'white', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '40px', margin: '0 auto 2rem' 
        }}>
          !
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Payment Failed</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {error}
        </p>

        <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '16px', padding: '1.25rem', marginBottom: '2rem', color: '#991B1B', fontSize: '0.9rem' }}>
          Please check your card details, UPI ID, or internet connection and try again. No money has been deducted if the transaction failed.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Retry Payment</Link>
          <Link to="/cart" className="btn btn-ghost" style={{ width: '100%' }}>Back to Cart</Link>
        </div>
      </div>
    </div>
  );
}
