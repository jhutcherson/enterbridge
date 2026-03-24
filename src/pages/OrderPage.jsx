import { useState } from 'react'
import styles from './OrderPage.module.css'

const EMPTY_FORM = {
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  notes: '',
}

export default function OrderPage({ cart, onUpdateQty, onClearCart, onBack }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const items = Object.values(cart)

  const subtotal = items.reduce((sum, { price, quantity }) => {
    return sum + Number(price.amount) * quantity
  }, 0)

  const handleField = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email.trim()) errs.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.address.trim()) errs.address = 'Required'
    if (!form.city.trim()) errs.city = 'Required'
    if (!form.state.trim()) errs.state = 'Required'
    if (!form.zip.trim()) errs.zip = 'Required'
    if (items.length === 0) errs.cart = 'Your order is empty'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitted(true)
    onClearCart()
  }

  if (submitted) {
    return (
      <div className={styles.main}>
        <div className={styles.success}>
          <div className={styles.successIcon}>✅</div>
          <h2>Order Placed!</h2>
          <p>
            Thank you, <strong>{form.name}</strong>. Your order has been received and a
            confirmation will be sent to <strong>{form.email}</strong>.
          </p>
          <button className={styles.primaryBtn} onClick={onBack}>
            ← Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.main}>
      <div className={styles.pageHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Back to Products
        </button>
        <h2 className={styles.pageTitle}>Place an Order</h2>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyCart}>
          <span>🛒</span>
          <p>Your order is empty</p>
          <small>Go back and add products to get started</small>
          <button className={styles.primaryBtn} onClick={onBack}>
            Browse Products
          </button>
        </div>
      ) : (
        <form className={styles.layout} onSubmit={handleSubmit} noValidate>
          {/* Left column — cart items + contact form */}
          <div className={styles.left}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Order Items</h3>
              <div className={styles.itemList}>
                {items.map(({ product, price, quantity }) => (
                  <div key={product.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{product.name}</span>
                      <span className={styles.itemMeta}>
                        {product.sku} · ${Number(price.amount).toFixed(2)} per {price.quantity} {price.unitOfMeasure}
                      </span>
                    </div>
                    <div className={styles.itemControls}>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => onUpdateQty(product.id, quantity - 1)}
                      >
                        −
                      </button>
                      <span className={styles.qty}>{quantity}</span>
                      <button
                        type="button"
                        className={styles.qtyBtn}
                        onClick={() => onUpdateQty(product.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className={styles.itemTotal}>
                      ${(Number(price.amount) * quantity).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => onUpdateQty(product.id, 0)}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Contact Information</h3>
              <div className={styles.formGrid}>
                <Field label="Full Name *" error={errors.name}>
                  <input name="name" value={form.name} onChange={handleField} placeholder="Jane Smith" />
                </Field>
                <Field label="Company" error={errors.company}>
                  <input name="company" value={form.company} onChange={handleField} placeholder="Acme Corp" />
                </Field>
                <Field label="Email *" error={errors.email}>
                  <input name="email" type="email" value={form.email} onChange={handleField} placeholder="jane@example.com" />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <input name="phone" type="tel" value={form.phone} onChange={handleField} placeholder="(555) 000-0000" />
                </Field>
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Delivery Address</h3>
              <div className={styles.formGrid}>
                <Field label="Street Address *" error={errors.address} fullWidth>
                  <input name="address" value={form.address} onChange={handleField} placeholder="123 Main St" />
                </Field>
                <Field label="City *" error={errors.city}>
                  <input name="city" value={form.city} onChange={handleField} placeholder="Springfield" />
                </Field>
                <Field label="State *" error={errors.state}>
                  <input name="state" value={form.state} onChange={handleField} placeholder="IL" maxLength={2} />
                </Field>
                <Field label="ZIP Code *" error={errors.zip}>
                  <input name="zip" value={form.zip} onChange={handleField} placeholder="62701" />
                </Field>
                <Field label="Order Notes" error={errors.notes} fullWidth>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleField}
                    placeholder="Special delivery instructions, job site access, etc."
                    rows={3}
                  />
                </Field>
              </div>
            </section>
          </div>

          {/* Right column — order summary */}
          <aside className={styles.summary}>
            <h3 className={styles.sectionTitle}>Order Summary</h3>
            <div className={styles.summaryLines}>
              {items.map(({ product, price, quantity }) => (
                <div key={product.id} className={styles.summaryLine}>
                  <span className={styles.summaryLineLabel}>
                    {product.name}
                    <span className={styles.summaryQty}>×{quantity}</span>
                  </span>
                  <span>${(Number(price.amount) * quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryTotal}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <p className={styles.taxNote}>Taxes and shipping calculated at confirmation.</p>
            {errors.cart && <p className={styles.cartError}>{errors.cart}</p>}
            <button type="submit" className={styles.submitBtn}>
              Place Order →
            </button>
          </aside>
        </form>
      )}
    </div>
  )
}

function Field({ label, error, fullWidth, children }) {
  return (
    <div
      className={`${styles.field} ${fullWidth ? styles.fieldFull : ''} ${error ? styles.fieldError : ''}`}
    >
      <label className={styles.label}>{label}</label>
      {children}
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  )
}
