import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`Crypto Tracker API listening on http://localhost:${env.port}`);
});
