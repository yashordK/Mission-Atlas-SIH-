-- Mission Atlas / SevenShield — Initial Schema
-- Phase 1: Core tables for tourist safety monitoring

-- ─── PROFILES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                 UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name          TEXT,
  phone              TEXT,
  nationality        TEXT,
  emergency_contact  TEXT,
  emergency_phone    TEXT,
  blockchain_id      TEXT,
  wallet_address     TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at         TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── TOURISTS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tourists (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  location      TEXT,
  latitude      FLOAT,
  longitude     FLOAT,
  safety_score  INTEGER DEFAULT 100,
  status        TEXT DEFAULT 'safe',
  current_state TEXT,
  last_seen     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  blockchain_id TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── INCIDENTS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS incidents (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT NOT NULL,
  description    TEXT,
  severity       TEXT DEFAULT 'low',
  alert_type     TEXT DEFAULT 'warning',
  latitude       FLOAT,
  longitude      FLOAT,
  location       TEXT,
  reported_by    TEXT,
  status         TEXT DEFAULT 'active',
  tourist_id     UUID REFERENCES tourists(id) ON DELETE SET NULL,
  blockchain_hash TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── SOS ALERTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sos_alerts (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,
  tourist_id      UUID REFERENCES tourists(id) ON DELETE SET NULL,
  latitude        FLOAT NOT NULL,
  longitude       FLOAT NOT NULL,
  message         TEXT,
  status          TEXT DEFAULT 'active',
  blockchain_hash TEXT,
  responded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── GEOFENCES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS geofences (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  state       TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  risk_level  TEXT DEFAULT 'low',
  description TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at  BEFORE UPDATE ON profiles  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourists  ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE geofences ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own row
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Tourists: authenticated users can read all, insert/update own
CREATE POLICY "tourists_select_all" ON tourists FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "tourists_insert_own" ON tourists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tourists_update_own" ON tourists FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Incidents: authenticated users can read all, insert any (authorities + tourists), update own
CREATE POLICY "incidents_select_all" ON incidents FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "incidents_insert_auth" ON incidents FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "incidents_update_auth" ON incidents FOR UPDATE TO authenticated USING (TRUE);

-- SOS Alerts: authenticated users can read all, insert own
CREATE POLICY "sos_select_all" ON sos_alerts FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "sos_insert_own" ON sos_alerts FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "sos_update_auth" ON sos_alerts FOR UPDATE TO authenticated USING (TRUE);

-- Geofences: public read (needed for anonymous tourist app), authenticated insert
CREATE POLICY "geofences_select_all" ON geofences FOR SELECT USING (TRUE);
CREATE POLICY "geofences_insert_auth" ON geofences FOR INSERT TO authenticated WITH CHECK (TRUE);

-- ─── SEED: NE INDIA GEOFENCES ─────────────────────────────────────────────────
INSERT INTO geofences (name, state, coordinates, risk_level, description) VALUES
(
  'Arunachal Pradesh Border Zone',
  'Arunachal Pradesh',
  '{"type":"Polygon","coordinates":[[[91.5,26.6],[97.5,26.6],[97.5,29.5],[91.5,29.5],[91.5,26.6]]]}',
  'medium',
  'Restricted zone near international border — permit required'
),
(
  'Tawang Monastery Zone',
  'Arunachal Pradesh',
  '{"type":"Polygon","coordinates":[[[91.82,27.55],[91.90,27.55],[91.90,27.63],[91.82,27.63],[91.82,27.55]]]}',
  'low',
  'Popular tourist destination, generally safe'
),
(
  'Kaziranga National Park',
  'Assam',
  '{"type":"Polygon","coordinates":[[[93.08,26.53],[93.50,26.53],[93.50,26.78],[93.08,26.78],[93.08,26.53]]]}',
  'medium',
  'Wildlife zone — do not venture off designated paths'
),
(
  'Guwahati City Zone',
  'Assam',
  '{"type":"Polygon","coordinates":[[[91.55,26.05],[91.85,26.05],[91.85,26.25],[91.55,26.25],[91.55,26.05]]]}',
  'low',
  'Urban tourist zone, well-monitored'
),
(
  'Loktak Lake Zone',
  'Manipur',
  '{"type":"Polygon","coordinates":[[[93.72,24.45],[93.88,24.45],[93.88,24.62],[93.72,24.62],[93.72,24.45]]]}',
  'low',
  'Scenic lake and phumdis — boat rides available'
),
(
  'Imphal Valley',
  'Manipur',
  '{"type":"Polygon","coordinates":[[[93.85,24.70],[94.00,24.70],[94.00,24.90],[93.85,24.90],[93.85,24.70]]]}',
  'low',
  'Capital region, historical sites'
),
(
  'Shillong Peak Zone',
  'Meghalaya',
  '{"type":"Polygon","coordinates":[[[91.85,25.52],[91.95,25.52],[91.95,25.62],[91.85,25.62],[91.85,25.52]]]}',
  'low',
  'Popular viewpoint, safe for tourists'
),
(
  'Cherrapunji Zone',
  'Meghalaya',
  '{"type":"Polygon","coordinates":[[[91.70,25.25],[91.80,25.25],[91.80,25.35],[91.70,25.35],[91.70,25.25]]]}',
  'low',
  'Wettest place zone — heavy rains, slippery paths'
),
(
  'Aizawl City Zone',
  'Mizoram',
  '{"type":"Polygon","coordinates":[[[92.67,23.68],[92.78,23.68],[92.78,23.78],[92.67,23.78],[92.67,23.68]]]}',
  'low',
  'Capital city, peaceful environment'
),
(
  'Phawngpui Blue Mountain',
  'Mizoram',
  '{"type":"Polygon","coordinates":[[[92.90,22.55],[93.05,22.55],[93.05,22.70],[92.90,22.70],[92.90,22.55]]]}',
  'medium',
  'Remote mountain area — carry emergency kit'
),
(
  'Dzukou Valley Zone',
  'Nagaland',
  '{"type":"Polygon","coordinates":[[[93.98,25.48],[94.08,25.48],[94.08,25.56],[93.98,25.56],[93.98,25.48]]]}',
  'medium',
  'Trekking zone — weather can change rapidly'
),
(
  'Kohima City Zone',
  'Nagaland',
  '{"type":"Polygon","coordinates":[[[94.08,25.65],[94.15,25.65],[94.15,25.72],[94.08,25.72],[94.08,25.65]]]}',
  'low',
  'State capital, war memorial, cultural sites'
),
(
  'Agartala City Zone',
  'Tripura',
  '{"type":"Polygon","coordinates":[[[91.24,23.80],[91.32,23.80],[91.32,23.88],[91.24,23.88],[91.24,23.80]]]}',
  'low',
  'Capital city, Ujjayanta Palace nearby'
),
(
  'Neermahal Water Palace Zone',
  'Tripura',
  '{"type":"Polygon","coordinates":[[[91.42,23.47],[91.50,23.47],[91.50,23.55],[91.42,23.55],[91.42,23.47]]]}',
  'low',
  'Scenic lake palace, popular tourist spot'
);
