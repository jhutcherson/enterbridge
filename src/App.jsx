import { useState, useEffect, useCallback } from 'react'
import ProductGrid from './components/ProductGrid'
import Pagination from './components/Pagination'
import SearchFilter from './components/SearchFilter'
import styles from './App.module.css'

const API_BASE = 'https://api.casestudy.enterbridge.com/api/products'
const PRICES_API = 'https://api.casestudy.enterbridge.com/api/prices'

export default function App() {
  const [products, setProducts] = useState([])
  const [prices, setPrices] = useState({}) // keyed by productId
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ pageNumber: page, pageSize: 12 })
      if (search) params.set('search', search)
      if (category) params.set('category', category)

      const res = await fetch(`${API_BASE}?${params}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const items = data.items ?? data.data ?? data
      setProducts(items)
      if (data.pageNumber !== undefined) setPagination(data)

      // Fetch most recent price for each product on this page
      const ids = items.map((p) => p.id).join(',')
      if (ids) {
        const priceRes = await fetch(
          `${PRICES_API}?productIds=${ids}&pageSize=100&sortBy=dateTime&sortDesc=true`
        )
        if (priceRes.ok) {
          const priceData = await priceRes.json()
          const priceItems = priceData.items ?? []
          // Keep only the most recent price per product
          const latestByProduct = {}
          for (const p of priceItems) {
            const existing = latestByProduct[p.productId]
            if (!existing || new Date(p.dateTime) > new Date(existing.dateTime)) {
              latestByProduct[p.productId] = p
            }
          }
          setPrices(latestByProduct)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, search, category])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  const handleCategory = (value) => {
    setCategory(value)
    setPage(1)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🏗️</span>
            <h1>Enterbridge Products</h1>
          </div>
          <span className={styles.count}>
            {pagination.totalCount > 0 && `${pagination.totalCount} products`}
          </span>
        </div>
      </header>

      <main className={styles.main}>
        <SearchFilter
          search={search}
          category={category}
          onSearch={handleSearch}
          onCategory={handleCategory}
        />

        {error && (
          <div className={styles.error}>
            Failed to load products: {error}
            <button onClick={fetchProducts}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading products…</p>
          </div>
        ) : (
          <>
            <ProductGrid products={products} prices={prices} />
            {pagination.totalPages > 1 && (
              <Pagination
                current={pagination.pageNumber}
                total={pagination.totalPages}
                hasPrev={pagination.hasPreviousPage}
                hasNext={pagination.hasNextPage}
                onChange={setPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
