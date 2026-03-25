import { useState, useEffect, useCallback } from 'react'
import ProductGrid from './components/ProductGrid'
import Pagination from './components/Pagination'
import SearchFilter from './components/SearchFilter'
import OrderPage from './pages/OrderPage'
import styles from './App.module.css'

const API_BASE = 'https://api.casestudy.enterbridge.com/api/products'
const PRICES_API = 'https://api.casestudy.enterbridge.com/api/prices'

export default function App() {
  const [page, setPage] = useState('products') // 'products' | 'order'
  const [cart, setCart] = useState({}) // { [productId]: { product, price, quantity } }

  const [products, setProducts] = useState([])
  const [prices, setPrices] = useState({})
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
  const [productPage, setProductPage] = useState(1)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ pageNumber: productPage, pageSize: 12 })
      if (search) params.set('name', search)
      if (category) params.set('category', category)

      const res = await fetch(`${API_BASE}?${params}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const items = data.items ?? data.data ?? data
      setProducts(items)
      if (data.pageNumber !== undefined) setPagination(data)

      if (items.length) {
        const priceResults = await Promise.all(
          items.map((p) =>
            fetch(`${PRICES_API}?productIds=${p.id}&pageSize=1&sortBy=dateTime&sortDesc=true`)
              .then((r) => (r.ok ? r.json() : null))
          )
        )
        const latestByProduct = {}
        priceResults.forEach((data, i) => {
          const item = data?.items?.[0]
          if (item) latestByProduct[items[i].id] = item
        })
        setPrices(latestByProduct)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [productPage, search, category])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = (value) => {
    setSearch(value)
    setProductPage(1)
  }

  const handleCategory = (value) => {
    setCategory(value)
    setProductPage(1)
  }

  const addToCart = (product, price) => {
    setCart((prev) => {
      const existing = prev[product.id]
      return {
        ...prev,
        [product.id]: {
          product,
          price,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      }
    })
  }

  const updateCartQty = (productId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const next = { ...prev }
        delete next[productId]
        return next
      }
      return { ...prev, [productId]: { ...prev[productId], quantity } }
    })
  }

  const clearCart = () => setCart({})

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            className={styles.brand}
            onClick={() => setPage('products')}
          >
            <span className={styles.brandIcon}>🏗️</span>
            <span className={styles.brandName}>Enterbridge Products</span>
          </button>

          <div className={styles.headerRight}>
            {page === 'products' && (
              <span className={styles.count}>
                {pagination.totalCount > 0 && `${pagination.totalCount} products`}
              </span>
            )}
            <button
              className={`${styles.cartBtn} ${page === 'order' ? styles.cartBtnActive : ''}`}
              onClick={() => setPage('order')}
            >
              🛒 Order
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {page === 'products' ? (
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
              <ProductGrid
                products={products}
                prices={prices}
                cart={cart}
                onAddToCart={addToCart}
              />
              {pagination.totalPages > 1 && (
                <Pagination
                  current={pagination.pageNumber}
                  total={pagination.totalPages}
                  hasPrev={pagination.hasPreviousPage}
                  hasNext={pagination.hasNextPage}
                  onChange={setProductPage}
                />
              )}
            </>
          )}
        </main>
      ) : (
        <OrderPage
          cart={cart}
          onUpdateQty={updateCartQty}
          onClearCart={clearCart}
          onBack={() => setPage('products')}
        />
      )}
    </div>
  )
}
