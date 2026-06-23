import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';

const router = Router();

const authSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().email().max(255).transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(128)
});

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.created_at };
}

router.post('/register', asyncHandler(async (req, res) => {
  const parsed = authSchema.extend({ name: z.string().trim().min(2).max(120) }).parse(req.body);
  const passwordHash = await bcrypt.hash(parsed.password, 12);

  try {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [parsed.name, parsed.email, passwordHash]
    );
    const user = rows[0];
    return res.status(201).json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }
    throw error;
  }
}));

router.post('/login', asyncHandler(async (req, res) => {
  const parsed = authSchema.omit({ name: true }).parse(req.body);
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [parsed.email]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(parsed.password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json({ user: publicUser(user), token: signToken(user) });
}));

export default router;
