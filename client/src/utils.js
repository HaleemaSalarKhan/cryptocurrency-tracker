export function formatCurrency(value, currency = 'USD', maximumFractionDigits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits
  }).format(value);
}

export function formatCompact(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '-';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function classNames(...values) {
  return values.filter(Boolean).join(' ');
}
