import styles from './Pagination.module.css'

export default function Pagination({ current, total, hasPrev, hasNext, onChange }) {
  const pages = getPageRange(current, total)

  return (
    <nav className={styles.nav}>
      <button
        className={styles.btn}
        disabled={!hasPrev}
        onClick={() => onChange(current - 1)}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <div className={styles.pages}>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
          ) : (
            <button
              key={p}
              className={`${styles.page} ${p === current ? styles.active : ''}`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className={styles.btn}
        disabled={!hasNext}
        onClick={() => onChange(current + 1)}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  )
}

function getPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = []
  pages.push(1)

  if (current > 3) pages.push('…')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('…')

  pages.push(total)

  return pages
}
