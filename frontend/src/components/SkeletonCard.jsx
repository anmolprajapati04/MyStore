import React from 'react'

/**
 * Skeleton card that matches the ProductCard layout exactly.
 * Shows a shimmer animation while products are loading.
 */
export function SkeletonCard() {
  return (
    <div className="product-card skeleton-card">
      <div className="skeleton-card__image skeleton" />
      <div className="product-card__body">
        <div className="skeleton skeleton-text" style={{ width: '40%', height: '0.75rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '80%', height: '1.1rem', marginTop: '0.5rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '100%', height: '0.85rem', marginTop: '0.4rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '60%', height: '0.85rem', marginTop: '0.25rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '5rem', height: '0.75rem', marginTop: '0.5rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <div className="skeleton skeleton-text" style={{ width: '4rem', height: '1.25rem' }} />
          <div className="skeleton" style={{ width: '5rem', height: '2rem', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  )
}

/**
 * Renders a grid of N skeleton cards.
 */
export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default SkeletonCard
