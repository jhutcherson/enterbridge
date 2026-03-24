import styles from './ProductCard.module.css'

const CATEGORY_COLORS = {
  Electrical: { bg: '#fef3c7', color: '#d97706' },
  Insulation:  { bg: '#dbeafe', color: '#2563eb' },
  Hardware:    { bg: '#f3f4f6', color: '#374151' },
  Tools:       { bg: '#dcfce7', color: '#16a34a' },
  Paint:       { bg: '#fce7f3', color: '#db2777' },
  Lumber:      { bg: '#fed7aa', color: '#c2410c' },
  Concrete:    { bg: '#e5e7eb', color: '#4b5563' },
}

export default function ProductCard({ product, price }) {
  const { name, description, sku, category } = product
  const badge = CATEGORY_COLORS[category] ?? { bg: '#ede9fe', color: '#7c3aed' }

  const formattedPrice = price
    ? `$${Number(price.amount).toFixed(2)}`
    : null

  const priceDate = price
    ? new Date(price.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span
          className={styles.badge}
          style={{ background: badge.bg, color: badge.color }}
        >
          {category}
        </span>
        <span className={styles.sku}>{sku}</span>
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.priceRow}>
        {formattedPrice ? (
          <>
            <span className={styles.price}>{formattedPrice}</span>
            <span className={styles.priceUnit}>
              per {price.quantity} {price.unitOfMeasure}
            </span>
            <span className={styles.priceDate}>{priceDate}</span>
          </>
        ) : (
          <span className={styles.noPrice}>No pricing data</span>
        )}
      </div>
    </div>
  )
}
