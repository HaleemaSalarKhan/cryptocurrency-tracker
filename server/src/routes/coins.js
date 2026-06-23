import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getCoinHistory, getMarkets } from '../services/coingecko.js';

const router = Router();

router.get('/markets', asyncHandler(async (req, res) => {
  const query = z.object({
    currency: z.string().default('usd'),
    page: z.coerce.number().int().positive().default(1),
    perPage: z.coerce.number().int().min(10).max(100).default(50),
    order: z.enum(['market_cap_desc', 'market_cap_asc', 'volume_desc', 'id_asc', 'id_desc']).default('market_cap_desc')
  }).parse(req.query);

  const markets = await getMarkets(query);
  return res.json({ markets });
}));

router.get('/:coinId/history', asyncHandler(async (req, res) => {
  const params = z.object({ coinId: z.string().min(1).max(120) }).parse(req.params);
  const query = z.object({
    currency: z.string().default('usd'),
    days: z.coerce.number().int().min(1).max(365).default(30)
  }).parse(req.query);

  const history = await getCoinHistory(params.coinId, query.currency, query.days);
  return res.json({ history });
}));

export default router;
