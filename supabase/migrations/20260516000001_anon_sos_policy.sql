-- Allow unauthenticated (anon) mobile clients to insert SOS alerts.
-- Emergency SOS must work even before a user authenticates.
CREATE POLICY "sos_insert_anon"
    ON sos_alerts
    FOR INSERT
    TO anon
    WITH CHECK (TRUE);

-- Also allow anon to insert incidents (tourist reporting without auth)
CREATE POLICY "incidents_insert_anon"
    ON incidents
    FOR INSERT
    TO anon
    WITH CHECK (TRUE);
