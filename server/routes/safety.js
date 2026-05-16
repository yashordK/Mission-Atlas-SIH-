import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET /api/safety-score
// Returns overall safety score + per-state breakdown
router.get('/', async (_req, res) => {
  const [incidentsRes, sosRes, touristsRes] = await Promise.all([
    supabase.from('incidents').select('severity, status, created_at').eq('status', 'active'),
    supabase.from('sos_alerts').select('status, created_at').eq('status', 'active'),
    supabase.from('tourists').select('safety_score, current_state'),
  ]);

  if (incidentsRes.error || sosRes.error || touristsRes.error) {
    return res.status(500).json({ error: 'Failed to fetch safety data' });
  }

  const incidents = incidentsRes.data ?? [];
  const sosAlerts = sosRes.data ?? [];
  const tourists = touristsRes.data ?? [];

  // Deduct points: high=-15, medium=-8, low=-3, SOS=-20
  let deductions = 0;
  for (const i of incidents) {
    if (i.severity === 'high') deductions += 15;
    else if (i.severity === 'medium') deductions += 8;
    else deductions += 3;
  }
  deductions += sosAlerts.length * 20;

  const overallScore = Math.max(0, Math.min(100, 100 - deductions));

  // Per-tourist average
  const touristAvg = tourists.length > 0
    ? Math.round(tourists.reduce((sum, t) => sum + (t.safety_score ?? 100), 0) / tourists.length)
    : 100;

  // Breakdown by NE India state
  const stateBreakdown: Record<string, { incidents: number; score: number }> = {};
  const NE_STATES = ['Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura'];
  for (const state of NE_STATES) {
    const stateTourists = tourists.filter(t => t.current_state === state);
    stateBreakdown[state] = {
      incidents: 0,
      score: stateTourists.length > 0
        ? Math.round(stateTourists.reduce((s, t) => s + (t.safety_score ?? 100), 0) / stateTourists.length)
        : 100,
    };
  }

  res.json({
    overallScore,
    touristAverageScore: touristAvg,
    activeIncidents: incidents.length,
    activeSOS: sosAlerts.length,
    totalTourists: tourists.length,
    stateBreakdown,
    calculatedAt: new Date().toISOString(),
  });
});

export default router;
