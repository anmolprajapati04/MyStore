import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const toast = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/products/wishlist');
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (product) => {
    try {
      await axios.delete(`/api/products/wishlist/${product.id}`);
      setWishlist(prev => prev.filter(item => item.product.id !== product.id));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="page-content" style={{ paddingTop: 'var(--nav-height)' }}>
        <div className="container">
          <div className="skeleton" style={{ width: 250, height: '2.5rem', marginBottom: '2rem' }} />
          <div className="products-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="page-content" style={{ paddingTop: 'var(--nav-height)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 20px rgba(255,107,107,0.3))' }}>💖</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: 500, marginInline: 'auto' }}>
            Save items that you like in your wishlist. Review them anytime and easily move them to the cart for a quick checkout.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">Explore Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh', background: '#fcfcfd' }}>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
              My Wishlist
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved for later
            </p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">Add More</Link>
        </div>

        <div className="products-grid">
          {wishlist.map(item => {
            const product = item.product;
            const cartItem = cartItems.find(ci => ci.id === product.id);
            return (
              <div key={product.id} className="animate-fade-up">
                <ProductCard
                  product={{
                    ...product,
                    isWishlisted: true,
                    onToggleWishlist: () => handleToggleWishlist(product)
                  }}
                  onAddToCart={addToCart}
                  cartQuantity={cartItem?.quantity || 0}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
