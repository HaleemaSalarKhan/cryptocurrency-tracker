import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../utils.js';

export function CoinChart({ coin, history, loading }) {
  const prices = history?.prices || [];
  const lineColor = coin?.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444';

  const data = {
    labels: prices.map(([timestamp]) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: `${coin?.name || 'Coin'} price`,
        data: prices.map(([, price]) => price),
        borderColor: lineColor,
        backgroundColor: `${lineColor}22`,
        fill: true,
        borderWidth: 2,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => formatCurrency(context.parsed.y, 'USD', 6)
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 7 } },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.18)' },
        ticks: { callback: (value) => formatCurrency(value, 'USD', 2) }
      }
    }
  };

  return (
    <section className="chart-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">30-day history</span>
          <h2>{coin ? coin.name : 'Select a cryptocurrency'}</h2>
        </div>
        {coin && <strong>{formatCurrency(coin.current_price, 'USD', coin.current_price < 1 ? 6 : 2)}</strong>}
      </div>
      <div className="chart-wrap">
        {loading ? <div className="empty-state">Loading chart data...</div> : <Line data={data} options={options} />}
      </div>
    </section>
  );
}
