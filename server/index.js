import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import itineraryRouter from './routes/itinerary.js';
import sosRouter from './routes/sos.js';
import safetyRouter from './routes/safety.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'mission-atlas-server' }));

app.use('/api/itinerary', itineraryRouter);
app.use('/api/sos', sosRouter);
app.use('/api/safety-score', safetyRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message ?? 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Mission Atlas server running on http://localhost:${PORT}`);
});
