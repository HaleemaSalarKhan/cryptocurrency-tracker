import { env } from '../config/env.js';

const cache = new Map();

function cacheKey(path, params) {
  return `${path}?${new URLSearchParams(params).toString()}`;
}

async function getJson(path, params = {}, ttlMs = 60_000) {
  const key = cacheKey(path, params);
  const cached = cache.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const url = new URL(`${env.coingeckoApiBase}${path}`);
  Object.entries(params).forEach(([param, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(param, value);
    }
  });

  const headers = { accept: 'application/json' };
  if (env.coingeckoApiKey) {
    headers['x-cg-demo-api-key'] = env.coingeckoApiKey;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`CoinGecko request failed (${response.status}): ${detail}`);
  }

  const data = await response.json();
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
  return data;
}

export function getMarkets({ currency = 'usd', page = 1, perPage = 50, order = 'market_cap_desc' }) {
  return getJson('/coins/markets', {
    vs_currency: currency,
    order,
    per_page: perPage,
    page,
    sparkline: true,
    price_change_percentage: '1h,24h,7d'
  }, 45_000);
}

export function getCoinHistory(coinId, currency = 'usd', days = 30) {
  return getJson(`/coins/${coinId}/market_chart`, {
    vs_currency: currency,
    days,
    interval: 'daily'
  }, 10 * 60_000);
}
