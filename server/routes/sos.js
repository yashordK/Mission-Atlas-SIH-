import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // service role key — bypasses RLS safely on server
);

// POST /api/sos
// Body: { latitude, longitude, user_id?, tourist_id?, message? }
router.post('/', async (req, res) => {
  const { latitude, longitude, user_id, tourist_id, message } = req.body;

  if (latitude == null || longitude == null) {
    return res.status(400).json({ error: 'latitude and longitude are required' });
  }

  const insertData = {
    latitude: Number(latitude),
    longitude: Number(longitude),
    message: message ?? 'SOS activated from mobile app',
    status: 'active',
    ...(user_id && { user_id }),
    ...(tourist_id && { tourist_id }),
  };

  const { data, error } = await supabase
    .from('sos_alerts')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('SOS insert error:', error);
    return res.status(500).json({ error: error.message });
  }

  console.log(`SOS ALERT: ${latitude}, ${longitude} — ${message}`);
  res.status(201).json({ id: data.id, message: 'SOS alert recorded', alert: data });
});

// PATCH /api/sos/:id/respond — mark as responded
router.patch('/:id/respond', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('sos_alerts')
    .update({ status: 'responded', responded_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Marked as responded', alert: data });
});

export default router;
