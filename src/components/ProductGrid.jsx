import ProductCard from './ProductCard'
import styles from './ProductGrid.module.css'

export default function ProductGrid({ products, prices }) {
  if (!products.length) {
    return (
      <div className={styles.empty}>
        <span>📦</span>
        <p>No products found</p>
        <small>Try adjusting your search or category filter</small>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} price={prices[product.id]} />
      ))}
    </div>
  )
}
