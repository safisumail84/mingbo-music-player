import cors from 'cors';
import express from 'express';

import playerRouter from './routes/player';

const app = express();
app.disable('x-powered-by');

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const corsOrigin = process.env.CORS_ORIGIN;

app.use(
  cors({
    origin: corsOrigin ? corsOrigin.split(',').map((v) => v.trim()) : true
  })
);

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api', playerRouter);

app.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`[backend] listening on :${port}`);
});
