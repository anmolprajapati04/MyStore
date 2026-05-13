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
      <div className="page-content">
        <div className="container">
          <h2>My Wishlist</h2>
          <div className="products-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ height: 350 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="page-content">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💖</div>
          <h2>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Save items that you like in your wishlist. Review them anytime and easily move them to the cart.
          </p>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>My Wishlist ({wishlist.length})</h1>
        </div>

        <div className="products-grid">
          {wishlist.map(item => {
            const product = item.product;
            const cartItem = cartItems.find(ci => ci.id === product.id);
            return (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  isWishlisted: true,
                  onToggleWishlist: handleToggleWishlist
                }}
                onAddToCart={addToCart}
                cartQuantity={cartItem?.quantity || 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
