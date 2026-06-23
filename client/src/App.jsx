import { Moon, RefreshCw, Search, SlidersHorizontal, Star, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from './api.js';
import { AuthPanel } from './components/AuthPanel.jsx';
import { CoinChart } from './components/CoinChart.jsx';
import { CoinTable } from './components/CoinTable.jsx';
import { formatCompact, formatCurrency } from './utils.js';

const sortOptions = [
  ['market_cap_desc', 'Market cap'],
  ['volume_desc', 'Volume'],
  ['market_cap_asc', 'Small caps'],
  ['id_asc', 'Name A-Z']
];

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('crypto_theme') || 'dark');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('crypto_user') || 'null'));
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [history, setHistory] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('market_cap_desc');
  const [watchOnly, setWatchOnly] = useState(false);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');

  const watchlistIds = useMemo(() => new Set(watchlist.map((item) => item.coinId)), [watchlist]);

  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => {
      const matchesQuery = `${coin.name} ${coin.symbol}`.toLowerCase().includes(query.toLowerCase());
      const matchesWatch = !watchOnly || watchlistIds.has(coin.id);
      return matchesQuery && matchesWatch;
    });
  }, [coins, query, watchOnly, watchlistIds]);

  const stats = useMemo(() => {
    const marketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
    const volume = coins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
    const gainers = coins.filter((coin) => coin.price_change_percentage_24h > 0).length;
    return { marketCap, volume, gainers };
  }, [coins]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('crypto_theme', theme);
  }, [theme]);

  useEffect(() => {
    loadMarkets();
  }, [sort]);

  useEffect(() => {
    if (user) {
      loadWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [user]);

  useEffect(() => {
    if (selectedCoin) {
      loadHistory(selectedCoin.id);
    }
  }, [selectedCoin]);

  async function loadMarkets() {
    setLoadingCoins(true);
    setError('');
    try {
      const data = await api.markets({ perPage: 60, order: sort });
      setCoins(data.markets);
      setSelectedCoin((current) => current || data.markets[0]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingCoins(false);
    }
  }

  async function loadHistory(coinId) {
    setLoadingHistory(true);
    try {
      const data = await api.history(coinId, { days: 30 });
      setHistory(data.history);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingHistory(false);
    }
  }

  async function loadWatchlist() {
    try {
      const data = await api.watchlist();
      setWatchlist(data.watchlist);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleAuth(mode, form) {
    setAuthError('');
    try {
      const data = mode === 'login' ? await api.login(form) : await api.register(form);
      localStorage.setItem('crypto_token', data.token);
      localStorage.setItem('crypto_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (requestError) {
      setAuthError(requestError.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('crypto_token');
    localStorage.removeItem('crypto_user');
    setUser(null);
  }

  async function toggleWatchlist(coin) {
    if (!user) return;
    const watched = watchlistIds.has(coin.id);
    if (watched) {
      await api.removeWatchlist(coin.id);
      setWatchlist((items) => items.filter((item) => item.coinId !== coin.id));
    } else {
      const payload = { coinId: coin.id, symbol: coin.symbol, name: coin.name, image: coin.image };
      const data = await api.addWatchlist(payload);
      setWatchlist((items) => [data.item, ...items.filter((item) => item.coinId !== coin.id)]);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">Live market workspace</span>
          <h1>Cryptocurrency Tracker</h1>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" onClick={loadMarkets} title="Refresh prices">
            <RefreshCw size={18} />
          </button>
          <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle dark mode">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <div><span>Tracked assets</span><strong>{coins.length || '-'}</strong></div>
        <div><span>Total market cap</span><strong>{formatCurrency(stats.marketCap, 'USD', 0)}</strong></div>
        <div><span>24h volume</span><strong>{formatCompact(stats.volume)}</strong></div>
        <div><span>24h gainers</span><strong>{stats.gainers}</strong></div>
      </section>

      <div className="layout-grid">
        <aside className="sidebar">
          <AuthPanel user={user} onAuth={handleAuth} onLogout={handleLogout} authError={authError} />

          <section className="watch-panel">
            <div className="panel-heading compact">
              <div>
                <span className="eyebrow">Watchlist</span>
                <h2>{watchlist.length} saved</h2>
              </div>
              <Star size={18} />
            </div>
            {watchlist.length === 0 ? (
              <p className="muted">Sign in and star coins to keep a persistent watchlist.</p>
            ) : (
              <div className="watch-list">
                {watchlist.map((item) => (
                  <button key={item.coinId} onClick={() => setSelectedCoin(coins.find((coin) => coin.id === item.coinId) || selectedCoin)}>
                    {item.image && <img src={item.image} alt="" />}
                    <span>{item.name}</span>
                    <small>{item.symbol.toUpperCase()}</small>
                  </button>
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className="workspace">
          <CoinChart coin={selectedCoin} history={history} loading={loadingHistory} />

          <section className="market-panel">
            <div className="toolbar">
              <div className="search-box">
                <Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search 50+ cryptocurrencies" />
              </div>
              <div className="filter-row">
                <label className="select-wrap">
                  <SlidersHorizontal size={16} />
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="toggle-pill">
                  <input type="checkbox" checked={watchOnly} onChange={(event) => setWatchOnly(event.target.checked)} />
                  Watchlist
                </label>
              </div>
            </div>

            {error && <div className="error-banner">{error}</div>}
            {loadingCoins ? (
              <div className="empty-state">Loading live market data...</div>
            ) : (
              <CoinTable
                coins={filteredCoins}
                selectedCoin={selectedCoin}
                watchlistIds={watchlistIds}
                onSelect={setSelectedCoin}
                onToggleWatchlist={toggleWatchlist}
                user={user}
              />
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
