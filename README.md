# Enterbridge Products

A React product catalog and ordering app for building/construction supplies. Displays live product and pricing data, and saves customer orders to a local SQLite database.

## Prerequisites

- **Node.js** v22 or higher (built-in `node:sqlite` is required)
- **npm** v8 or higher

## Setup

```bash
npm install
```

## Running the App

Two servers need to run together — Vite (frontend) and Express (order API). The easiest way is:

```bash
npm run dev:all
```

This starts both concurrently:

| Server | URL | Purpose |
|---|---|---|
| Vite (frontend) | http://localhost:5173 | React app |
| Express (backend) | http://localhost:3001 | Order API + SQLite |

Alternatively, run them in separate terminals:

```bash
# Terminal 1 — backend
npm run dev:server

# Terminal 2 — frontend
npm run dev
```

## Project Structure

```
enterbridge/
├── server/
│   ├── index.js        # Express API server
│   ├── orders.db       # SQLite database (created on first run)
│   └── package.json    # Forces CommonJS for the server
├── src/
│   ├── components/
│   │   ├── ProductCard.jsx     # Individual product with price + add-to-order button
│   │   ├── ProductGrid.jsx     # Responsive product grid
│   │   ├── Pagination.jsx      # Page navigation
│   │   └── SearchFilter.jsx    # Search input + category chips
│   ├── pages/
│   │   └── OrderPage.jsx       # Order form, cart review, confirmation
│   ├── App.jsx                 # Root — fetches products/prices, manages cart
│   └── main.jsx
├── vite.config.js      # Proxies /local-api → localhost:3001
└── package.json
```

## External APIs

Product and pricing data is fetched from:

- **Products** — `https://api.casestudy.enterbridge.com/api/products`
- **Prices** — `https://api.casestudy.enterbridge.com/api/prices`

Both APIs support pagination and filtering. The app fetches the 12 most recent prices per product on each page load.

## Placing Orders

1. Browse the product catalog and click **+ Add to Order** on any priced product
2. Click the **🛒 Order** button in the header
3. Adjust quantities, fill in contact and delivery information, and click **Place Order**

Orders are saved to `server/orders.db` with two tables:

- **`orders`** — customer info, subtotal, and timestamp
- **`order_items`** — per-line snapshot of product, price, quantity, and line total

### Viewing saved orders

```bash
# List all orders as JSON
curl http://localhost:3001/api/orders
```

Or open `server/orders.db` in any SQLite viewer (e.g. [DB Browser for SQLite](https://sqlitebrowser.org/)).

## Building for Production

```bash
npm run build
```

The compiled frontend is output to `dist/`. The Express server must still be running separately to handle order submissions.
