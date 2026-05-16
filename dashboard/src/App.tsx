import React, { useState, useEffect, useCallback } from 'react';
import { LanguageProvider } from './components/LanguageProvider';
import TopBar from './components/TopBar';
import LiveMap from './components/LiveMap';
import PanicButton from './components/PanicButton';
import Sidebar from './components/Sidebar';
import SafetyScore from './components/SafetyScore';
import { supabase } from './lib/supabase';
import type { Tourist, Incident, Notification } from './types/index';

function App() {
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Initial data load ──────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [touristsRes, incidentsRes] = await Promise.all([
        supabase
          .from('tourists')
          .select('*')
          .order('last_seen', { ascending: false }),
        supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (touristsRes.error) throw touristsRes.error;
      if (incidentsRes.error) throw incidentsRes.error;

      const mappedTourists: Tourist[] = (touristsRes.data ?? []).map(t => ({
        id: t.id,
        name: t.name,
        digitalId: t.blockchain_id ?? t.id.slice(0, 8).toUpperCase(),
        safetyScore: t.safety_score ?? 100,
        location: { lat: t.latitude ?? 26.1445, lng: t.longitude ?? 91.7362 },
        emergencyContact: '',
        itinerary: t.current_state ?? '',
        isTracking: t.status === 'safe',
        lastSeen: new Date(t.last_seen),
      }));

      const mappedIncidents: Incident[] = (incidentsRes.data ?? []).map(i => ({
        id: i.id,
        type: (i.alert_type === 'emergency' ? 'emergency' : i.alert_type === 'info' ? 'info' : 'warning') as Incident['type'],
        title: i.title,
        description: i.description ?? '',
        location: { lat: i.latitude ?? 26.1445, lng: i.longitude ?? 91.7362 },
        severity: (i.severity ?? 'low') as Incident['severity'],
        timestamp: new Date(i.created_at),
        reportedBy: i.reported_by ?? 'Unknown',
        status: (i.status ?? 'active') as Incident['status'],
      }));

      setTourists(mappedTourists);
      setIncidents(mappedIncidents);

      // Auto-generate notifications from high/medium incidents
      const notifs: Notification[] = mappedIncidents
        .filter(i => i.severity !== 'low' && i.status === 'active')
        .slice(0, 10)
        .map(i => ({
          id: `notif-${i.id}`,
          type: i.type,
          title: i.severity === 'high' ? `HIGH ALERT: ${i.title}` : i.title,
          message: `${i.description} — Reported by ${i.reportedBy}`,
          timestamp: i.timestamp,
          read: false,
        }));
      setNotifications(notifs);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load data';
      setError(msg);
      console.error('Supabase load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Realtime subscriptions ─────────────────────────────────────────────────
  useEffect(() => {
    const touristChannel = supabase
      .channel('tourists-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tourists' }, payload => {
        if (payload.eventType === 'INSERT') {
          const t = payload.new;
          setTourists(prev => [{
            id: t.id, name: t.name,
            digitalId: t.blockchain_id ?? t.id.slice(0, 8).toUpperCase(),
            safetyScore: t.safety_score ?? 100,
            location: { lat: t.latitude ?? 26.1445, lng: t.longitude ?? 91.7362 },
            emergencyContact: '', itinerary: t.current_state ?? '',
            isTracking: t.status === 'safe', lastSeen: new Date(t.last_seen),
          }, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const t = payload.new;
          setTourists(prev => prev.map(existing =>
            existing.id === t.id
              ? { ...existing, safetyScore: t.safety_score, isTracking: t.status === 'safe', lastSeen: new Date(t.last_seen) }
              : existing
          ));
        } else if (payload.eventType === 'DELETE') {
          setTourists(prev => prev.filter(t => t.id !== payload.old.id));
        }
      })
      .subscribe();

    const incidentChannel = supabase
      .channel('incidents-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, payload => {
        if (payload.eventType === 'INSERT') {
          const i = payload.new;
          const newIncident: Incident = {
            id: i.id,
            type: (i.alert_type === 'emergency' ? 'emergency' : i.alert_type === 'info' ? 'info' : 'warning') as Incident['type'],
            title: i.title, description: i.description ?? '',
            location: { lat: i.latitude ?? 26.1445, lng: i.longitude ?? 91.7362 },
            severity: (i.severity ?? 'low') as Incident['severity'],
            timestamp: new Date(i.created_at),
            reportedBy: i.reported_by ?? 'Unknown',
            status: (i.status ?? 'active') as Incident['status'],
          };
          setIncidents(prev => [newIncident, ...prev]);
          if (i.severity !== 'low') {
            setNotifications(prev => [{
              id: `notif-${i.id}`,
              type: newIncident.type,
              title: i.severity === 'high' ? `HIGH ALERT: ${i.title}` : i.title,
              message: `${i.description ?? ''} — Reported by ${i.reported_by ?? 'Unknown'}`,
              timestamp: new Date(i.created_at),
              read: false,
            }, ...prev]);
          }
        }
      })
      .subscribe();

    const sosChannel = supabase
      .channel('sos-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sos_alerts' }, payload => {
        const s = payload.new;
        setNotifications(prev => [{
          id: `sos-${s.id}`,
          type: 'emergency' as const,
          title: 'PANIC ALERT',
          message: `Tourist SOS at ${s.latitude.toFixed(4)}, ${s.longitude.toFixed(4)} — ${s.message ?? 'No message'}`,
          timestamp: new Date(s.created_at),
          read: false,
        }, ...prev]);
        setIncidents(prev => [{
          id: s.id,
          type: 'emergency',
          title: 'PANIC ALERT',
          description: s.message ?? 'Tourist activated SOS',
          location: { lat: s.latitude, lng: s.longitude },
          severity: 'high',
          timestamp: new Date(s.created_at),
          reportedBy: 'Tourist (SOS)',
          status: 'active',
        }, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(touristChannel);
      supabase.removeChannel(incidentChannel);
      supabase.removeChannel(sosChannel);
    };
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAddIncident = async (incidentData: Omit<Incident, 'id' | 'timestamp'>) => {
    const { error } = await supabase.from('incidents').insert({
      title: incidentData.title,
      description: incidentData.description,
      severity: incidentData.severity,
      alert_type: incidentData.type,
      latitude: incidentData.location.lat,
      longitude: incidentData.location.lng,
      reported_by: incidentData.reportedBy,
      status: incidentData.status,
    });
    if (error) {
      alert(`Failed to add incident: ${error.message}`);
      console.error(error);
    }
  };

  const handlePanic = async (location: { lat: number; lng: number }) => {
    const { error } = await supabase.from('sos_alerts').insert({
      latitude: location.lat,
      longitude: location.lng,
      message: 'Dashboard panic button activated',
      status: 'active',
    });
    if (error) {
      console.error('Panic alert failed:', error);
    }
  };

  const averageSafetyScore = tourists.length > 0
    ? Math.round(tourists.reduce((sum, t) => sum + t.safetyScore, 0) / tourists.length)
    : 100;

  return (
    <LanguageProvider>
      <div style={{ minHeight: '100vh', backgroundColor: '#000000' }}>
        <TopBar userName="Admin" />

        {/* Error banner */}
        {error && (
          <div style={{
            position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 30,
            backgroundColor: 'rgba(220,38,38,0.1)', borderBottom: '1px solid #DC2626',
            color: '#EF4444', fontSize: '13px', padding: '10px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>⚠ {error}</span>
            <button onClick={loadData} style={{ marginLeft: '12px', color: '#EF4444', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Retry</button>
          </div>
        )}

        {/* Sidebar */}
        <div style={{
          position: 'fixed', top: '64px', left: 0, bottom: 0, width: '384px',
          overflowY: 'auto', backgroundColor: '#141414',
          borderRight: '1px solid #2A2A2A', zIndex: 10,
        }}>
          <Sidebar
            notifications={notifications}
            onMarkAsRead={id => setNotifications(n => n.map(nf => nf.id === id ? { ...nf, read: true } : nf))}
            onDismissNotification={id => setNotifications(n => n.filter(nf => nf.id !== id))}
            onAddIncident={handleAddIncident}
          />
        </div>

        {/* Main content */}
        <main style={{ paddingTop: '64px', paddingLeft: '384px', height: '100vh', overflowY: 'auto', padding: '80px 16px 16px 400px' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '40px', height: '40px', border: '2px solid #2A2A2A',
                  borderTopColor: '#2563EB', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
                }} />
                <p style={{ fontSize: '14px', color: '#9CA3AF' }}>Loading live data…</p>
              </div>
            </div>
          ) : (
            <>
              <SafetyScore score={averageSafetyScore} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', marginBottom: '4px', fontSize: '13px', color: '#9CA3AF' }}>
                <span>{tourists.length} tourists tracked</span>
                <span>{incidents.filter(i => i.status === 'active').length} active incidents</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A', display: 'inline-block' }} />
                  Live
                </span>
              </div>
              <div style={{ height: '500px', width: '100%', marginTop: '8px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2A2A2A' }}>
                <LiveMap tourists={tourists} incidents={incidents} />
              </div>
            </>
          )}
        </main>

        <PanicButton onPanic={handlePanic} />
      </div>
    </LanguageProvider>
  );
}

export default App;
