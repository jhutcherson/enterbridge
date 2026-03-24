const { DatabaseSync } = require('node:sqlite')
const express = require('express')
const path = require('path')

const app = express()
app.use(express.json())

// Database setup
const db = new DatabaseSync(path.join(__dirname, 'orders.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    company     TEXT,
    email       TEXT    NOT NULL,
    phone       TEXT,
    address     TEXT    NOT NULL,
    city        TEXT    NOT NULL,
    state       TEXT    NOT NULL,
    zip         TEXT    NOT NULL,
    notes       TEXT,
    subtotal    REAL    NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id              INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id            INTEGER NOT NULL,
    product_name          TEXT    NOT NULL,
    product_sku           TEXT    NOT NULL,
    price_amount          REAL    NOT NULL,
    price_unit_of_measure TEXT    NOT NULL,
    price_quantity        REAL    NOT NULL,
    quantity              INTEGER NOT NULL,
    line_total            REAL    NOT NULL
  );
`)

const insertOrder = db.prepare(`
  INSERT INTO orders (name, company, email, phone, address, city, state, zip, notes, subtotal)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const insertItem = db.prepare(`
  INSERT INTO order_items
    (order_id, product_id, product_name, product_sku, price_amount, price_unit_of_measure, price_quantity, quantity, line_total)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const { customer, items } = req.body

  if (!customer || !items?.length) {
    return res.status(400).json({ error: 'customer and items are required' })
  }

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)

  try {
    const { lastInsertRowid } = insertOrder.run(
      customer.name,
      customer.company ?? null,
      customer.email,
      customer.phone ?? null,
      customer.address,
      customer.city,
      customer.state,
      customer.zip,
      customer.notes ?? null,
      subtotal
    )

    for (const item of items) {
      insertItem.run(
        lastInsertRowid,
        item.productId,
        item.productName,
        item.productSku,
        item.priceAmount,
        item.unitOfMeasure,
        item.priceQuantity,
        item.quantity,
        item.lineTotal
      )
    }

    res.status(201).json({ id: Number(lastInsertRowid) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save order' })
  }
})

// GET /api/orders
app.get('/api/orders', (_req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?')
  const result = orders.map((o) => ({ ...o, items: getItems.all(o.id) }))
  res.json(result)
})

const PORT = 3001
app.listen(PORT, () => console.log(`Order server running on http://localhost:${PORT}`))
