import { useState } from 'react'
import styles from './SearchFilter.module.css'

const CATEGORIES = [
  'Electrical',
  'Insulation',
  'Hardware',
  'Tools',
  'Paint',
  'Lumber',
  'Concrete',
]

export default function SearchFilter({ search, category, onSearch, onCategory }) {
  const [input, setInput] = useState(search)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch(input)
  }

  const handleClear = () => {
    setInput('')
    onSearch('')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search by name or SKU…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        {input && (
          <button className={styles.clearBtn} onClick={handleClear}>✕</button>
        )}
        <button className={styles.searchBtn} onClick={() => onSearch(input)}>
          Search
        </button>
      </div>

      <div className={styles.categories}>
        <button
          className={`${styles.chip} ${category === '' ? styles.active : ''}`}
          onClick={() => onCategory('')}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.chip} ${category === cat ? styles.active : ''}`}
            onClick={() => onCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
