import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'development-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  coingeckoApiBase: process.env.COINGECKO_API_BASE || 'https://api.coingecko.com/api/v3',
  coingeckoApiKey: process.env.COINGECKO_API_KEY || ''
};

if (!env.databaseUrl) {
  console.warn('DATABASE_URL is not set. Database-backed routes will fail until it is configured.');
}
