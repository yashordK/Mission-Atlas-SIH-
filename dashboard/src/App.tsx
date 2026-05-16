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
      <div className="min-h-screen bg-gray-50">
        <TopBar userName="Admin" />

        {/* Error banner */}
        {error && (
          <div className="fixed top-16 left-0 right-0 z-30 bg-red-100 border-b border-red-300 text-red-800 text-sm px-4 py-2 flex justify-between items-center">
            <span>⚠ {error}</span>
            <button onClick={loadData} className="ml-4 text-red-600 underline text-xs">Retry</button>
          </div>
        )}

        {/* Sidebar */}
        <div className="fixed top-16 left-0 bottom-0 w-96 overflow-y-auto bg-white shadow-lg z-10">
          <Sidebar
            notifications={notifications}
            onMarkAsRead={id => setNotifications(n => n.map(nf => nf.id === id ? { ...nf, read: true } : nf))}
            onDismissNotification={id => setNotifications(n => n.filter(nf => nf.id !== id))}
            onAddIncident={handleAddIncident}
          />
        </div>

        {/* Main content */}
        <main className="pt-16 pl-96 h-screen overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                <p className="text-sm">Loading live data…</p>
              </div>
            </div>
          ) : (
            <>
              <SafetyScore score={averageSafetyScore} />
              <div className="flex items-center gap-4 mt-3 mb-1 text-sm text-gray-500">
                <span>{tourists.length} tourists tracked</span>
                <span>{incidents.filter(i => i.status === 'active').length} active incidents</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                  Live
                </span>
              </div>
              <div className="h-[500px] w-full mt-2">
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
