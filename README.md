# Cryptocurrency Tracker

A full-stack cryptocurrency tracker built with React, Node.js, Express, PostgreSQL, Chart.js, and the CoinGecko REST API.

## Features

- JWT authentication with password hashing
- PostgreSQL persistence for users and watchlists
- CoinGecko market data for 50+ cryptocurrencies
- Search, category-style filters, sorting, and watchlist-only views
- 30-day price history charts using Chart.js
- Responsive dashboard UI with dark mode
- API-side market-data caching to reduce CoinGecko rate pressure

## Tech Stack

- Frontend: React, Vite, Chart.js, react-chartjs-2, lucide-react
- Backend: Node.js, Express, PostgreSQL, JWT, bcrypt
- External API: CoinGecko REST API

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the server environment file:

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. Create a PostgreSQL database and update `server/.env`.

   A local Docker option is included:

   ```bash
   docker compose up -d postgres
   ```

4. Run migrations:

   ```bash
   npm run db:migrate
   ```

5. Start both apps:

   ```bash
   npm run dev
   ```

The API runs on `http://localhost:5000` and the React app runs on `http://localhost:5173`.

## Environment

See [server/.env.example](server/.env.example).

CoinGecko works without an API key for public demo usage. If you have a demo/pro key, set `COINGECKO_API_KEY`.
