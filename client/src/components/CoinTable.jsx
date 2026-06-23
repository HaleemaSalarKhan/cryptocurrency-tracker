import { Star } from 'lucide-react';
import { classNames, formatCompact, formatCurrency, formatPercent } from '../utils.js';

export function CoinTable({ coins, selectedCoin, watchlistIds, onSelect, onToggleWatchlist, user }) {
  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Asset</th>
            <th>Price</th>
            <th>1h</th>
            <th>24h</th>
            <th>7d</th>
            <th>Market Cap</th>
            <th aria-label="Watchlist"></th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const watched = watchlistIds.has(coin.id);
            return (
              <tr key={coin.id} className={selectedCoin?.id === coin.id ? 'selected-row' : ''} onClick={() => onSelect(coin)}>
                <td>{coin.market_cap_rank || '-'}</td>
                <td>
                  <div className="asset-cell">
                    <img src={coin.image} alt="" />
                    <div>
                      <strong>{coin.name}</strong>
                      <small>{coin.symbol.toUpperCase()}</small>
                    </div>
                  </div>
                </td>
                <td>{formatCurrency(coin.current_price, 'USD', coin.current_price < 1 ? 6 : 2)}</td>
                <td className={classNames('change', coin.price_change_percentage_1h_in_currency >= 0 ? 'positive' : 'negative')}>
                  {formatPercent(coin.price_change_percentage_1h_in_currency)}
                </td>
                <td className={classNames('change', coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative')}>
                  {formatPercent(coin.price_change_percentage_24h)}
                </td>
                <td className={classNames('change', coin.price_change_percentage_7d_in_currency >= 0 ? 'positive' : 'negative')}>
                  {formatPercent(coin.price_change_percentage_7d_in_currency)}
                </td>
                <td>{formatCompact(coin.market_cap)}</td>
                <td>
                  <button
                    className={classNames('icon-button', watched && 'watched')}
                    disabled={!user}
                    title={user ? 'Toggle watchlist' : 'Sign in to manage watchlist'}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleWatchlist(coin);
                    }}
                  >
                    <Star size={17} fill={watched ? 'currentColor' : 'none'} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
