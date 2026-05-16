-- Fix tourists_select_all policy to allow anon key (dashboard reads tourists without auth)
DROP POLICY IF EXISTS "tourists_select_all" ON tourists;
CREATE POLICY "tourists_select_all" ON tourists FOR SELECT USING (TRUE);

-- Also make incidents readable by anon (dashboard live map needs this)
DROP POLICY IF EXISTS "incidents_select_all" ON incidents;
CREATE POLICY "incidents_select_all" ON incidents FOR SELECT USING (TRUE);

-- Geofences already allow public SELECT — confirm it's correct
DROP POLICY IF EXISTS "geofences_select_all" ON geofences;
CREATE POLICY "geofences_select_all" ON geofences FOR SELECT USING (TRUE);
