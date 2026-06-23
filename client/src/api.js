const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('crypto_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  markets: (params = {}) => request(`/coins/markets?${new URLSearchParams(params).toString()}`),
  history: (coinId, params = {}) => request(`/coins/${coinId}/history?${new URLSearchParams(params).toString()}`),
  watchlist: () => request('/watchlist'),
  addWatchlist: (coin) => request('/watchlist', { method: 'POST', body: JSON.stringify(coin) }),
  removeWatchlist: (coinId) => request(`/watchlist/${coinId}`, { method: 'DELETE' })
};
