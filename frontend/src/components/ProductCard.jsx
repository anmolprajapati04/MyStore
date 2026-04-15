import React from 'react'
import { getImageUrl, handleImageError, FALLBACK_IMAGE_URI } from '../utils/imageUtils'

/**
 * Star rating display (static, based on a pseudo-random seed from product id)
 */
function StarRating({ productId }) {
  // deterministic "rating" based on id so it doesn't change on re-render
  const rating = ((productId * 7) % 20 + 30) / 10 // 3.0 – 4.9
  const full = Math.floor(rating)
  const half = rating - full >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return (
    <span style={{ fontSize: '0.8rem', color: '#f59e0b', letterSpacing: '-1px' }}>
      {'★'.repeat(full)}{'½'.repeat(half)}{'☆'.repeat(empty)}
      <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem', fontSize: '0.75rem' }}>
        ({Math.floor(((productId * 13) % 800) + 40)})
      </span>
    </span>
  )
}

function StockBadge({ qty }) {
  if (qty === 0) return <span className="badge badge-danger">Out of Stock</span>
  if (qty < 10)  return <span className="badge badge-warning">Only {qty} left</span>
  return <span className="badge badge-success">In Stock</span>
}

/**
 * Premium product card component.
 * Handles image load error with the fixed onerror=null guard.
 */
export function ProductCard({ product, onAddToCart, cartQuantity = 0 }) {
  const imageUrl = getImageUrl(product.imagePath || product.imageUrl) || FALLBACK_IMAGE_URI
  const isOutOfStock = product.stockQuantity === 0

  return (
    <div className="product-card">
      {/* Image Wrapper */}
      <div className="product-card__image-wrap">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-card__image"
          onError={handleImageError}
          loading="lazy"
        />
        {/* Overlay quick-add */}
        {!isOutOfStock && (
          <div className="product-card__overlay">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onAddToCart(product)}
              style={{ transform: 'translateY(0)' }}
            >
              {cartQuantity > 0 ? `+ Add More (${cartQuantity})` : 'Quick Add'}
            </button>
          </div>
        )}
        {/* Badges */}
        <div className="product-card__badges">
          <StockBadge qty={product.stockQuantity} />
        </div>
        {cartQuantity > 0 && (
          <span className="product-card__cart-dot">{cartQuantity}</span>
        )}
      </div>

      {/* Info */}
      <div className="product-card__body">
        <div className="product-card__category">{product.category}</div>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">
          {product.description?.length > 70
            ? product.description.slice(0, 70) + '…'
            : product.description}
        </p>
        <StarRating productId={product.id} />

        <div className="product-card__footer">
          <div className="product-card__price">
            <span className="product-card__price-current">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
          <button
            className={`btn ${isOutOfStock ? 'btn-disabled' : 'btn-primary'} btn-sm`}
            onClick={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Sold Out' : cartQuantity > 0 ? '+ Add' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
