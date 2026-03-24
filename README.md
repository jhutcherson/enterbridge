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

| Server            | URL                   | Purpose            |
| ----------------- | --------------------- | ------------------ |
| Vite (frontend)   | http://localhost:5173 | React app          |
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

---

# Design Decisions:

- I opted to go with a card based approach to products as it felt more modern and would (hopefully) translate better to mobile devices.

- I used a grid approach to layout to make it easier to use via a mobile device and be able to see more items at a glance from a desktop perspective.

- I tried to put as much info per card as made sense

- I based the order page on most ordering pages I've seen in hopes that keeping it familiar would be easier to use.

# Things I didn't get to do:

## Unit testing

This is something I would normally stand on as a requirement, but given the time frame I opted to not. As a time saver I could have them AI generated, and then review them.

## Mobile View

I didn't get a chance to thoroughly test how this looks in a mobile app environment. I believe it should look okay based off the CSS used, however I didn't get a chance to verify it so I can't say for certain.

## Implement any of the customers suggestions

Which is a real bummer because they had some good ones. Given enough time, I would have:

- Done a price comparison to previous day and then set the color of the price either red (price went up) or green (price went down) along with an arrow of the same color to let the user see how the price is trending.

- Create a text message notification that goes to the foreman with a link to the order that allows them to edit it before approval.

- Create an order history feature that shows what has been previously ordered and allow for quick reordering of the same items.

# AI prompts I used:

```

Add pricing data to each Product Card from the api: https://api.casestudy.enterbridge.com/api/prices

Create an order page where customers can order products based off their current pricing.

```
