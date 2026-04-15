/**
 * imageUtils.js
 *
 * Pure module-level utilities for image URL resolution.
 * Keeping these OUTSIDE React components eliminates the useCallback
 * dependency chain that was causing the image reloading bug.
 *
 * Root cause of the bug:
 *   1. onError set e.target.src to '/api/placeholder/200/200' which also
 *      doesn't exist → triggers onError again → infinite reload loop.
 *   2. getImageUrl wrapped in useCallback inside the component created a
 *      fragile dependency chain: getImageUrl → fetchProducts → useEffect,
 *      which could re-trigger fetches on parent re-renders.
 *
 * Fix: plain functions here, and always set e.target.onerror = null before
 * assigning any fallback src in image error handlers.
 */

/**
 * Resolves a product image path to a usable URL.
 * Handles null / undefined / relative / absolute paths.
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Relative backend path — served through Vite proxy → gateway
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

/**
 * Inline SVG fallback as a data URI — never causes another network request
 * so it can never trigger a second onError.
 */
export const FALLBACK_IMAGE_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%2394a3b8' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";

/**
 * Safe onError handler for img elements.
 * Call like: onError={handleImageError}
 * The critical `e.target.onerror = null` prevents the infinite reload loop.
 */
export function handleImageError(e) {
  e.target.onerror = null; // ← This is the key fix for the infinite loop
  e.target.src = FALLBACK_IMAGE_URI;
}
