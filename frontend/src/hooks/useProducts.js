import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { getImageUrl } from '../utils/imageUtils'

/**
 * useProducts — fetches the product list exactly once per mount.
 *
 * Uses a hasFetched ref guard so the fetch is never re-triggered by
 * parent re-renders, StrictMode double-invocations, or context updates.
 */
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasFetched = useRef(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/api/products')

      const processed = response.data.map(p => ({
        ...p,
        // resolve image path once — plain function, no hook
        imagePath: getImageUrl(p.imagePath || p.imageUrl) || null,
      }))

      setProducts(processed)
    } catch (err) {
      console.error('useProducts: fetch failed', err)
      setError(err.response?.data?.message || 'Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }, []) // stable — no dependencies

  useEffect(() => {
    if (hasFetched.current) return // guard against StrictMode double-invoke
    hasFetched.current = true
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}
