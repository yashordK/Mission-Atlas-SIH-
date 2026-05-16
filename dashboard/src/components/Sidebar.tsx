import React, { useState } from 'react';
import { Notification, Incident } from '../types';

interface SidebarProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismissNotification: (id: string) => void;
  onAddIncident: (incidentData: Omit<Incident, 'id' | 'timestamp'>) => void;
}

const severityLeftBorder = (severity: string): string => {
  switch (severity) {
    case 'high':   return '3px solid #DC2626';
    case 'medium': return '3px solid #D97706';
    default:       return '3px solid #2563EB';
  }
};

const Sidebar: React.FC<SidebarProps> = ({
  notifications, onMarkAsRead, onDismissNotification, onAddIncident,
}) => {
  const [newIncident, setNewIncident] = useState<Omit<Incident, 'id' | 'timestamp'>>({
    title: '', description: '', severity: 'low', type: 'warning',
    location: { lat: 26.1445, lng: 91.7362 }, reportedBy: '', status: 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIncident(newIncident);
    setNewIncident({
      title: '', description: '', severity: 'low', type: 'warning',
      location: { lat: 26.1445, lng: 91.7362 }, reportedBy: '', status: 'active',
    });
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#1C1C1C', border: '1px solid #2A2A2A', color: '#FFFFFF',
    borderRadius: '8px', padding: '10px 12px', width: '100%', fontSize: '13px',
    outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>

      {/* Notifications */}
      <div>
        <p style={{ color: '#4B5563', fontSize: '11px', letterSpacing: '2px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
          Notifications
        </p>
        {notifications.length === 0 ? (
          <p style={{ color: '#4B5563', fontSize: '13px' }}>No active alerts</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map(n => {
              const isPanic = n.title.includes('PANIC') || n.title.includes('SOS');
              return (
                <div key={n.id} style={{
                  backgroundColor: isPanic ? 'rgba(220,38,38,0.07)' : (n.read ? '#141414' : '#1C1C1C'),
                  border: isPanic ? '1px solid rgba(220,38,38,0.3)' : '1px solid #2A2A2A',
                  borderLeft: severityLeftBorder(isPanic ? 'high' : 'low'),
                  borderRadius: '12px', padding: '12px',
                }}>
                  <p style={{ fontWeight: 600, fontSize: '13px', color: isPanic ? '#EF4444' : '#FFFFFF', marginBottom: '3px' }}>{n.title}</p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.5, marginBottom: '6px' }}>{n.message}</p>
                  {n.title.includes('SIMULATED_HASH') && (
                    <p style={{ fontFamily: 'monospace', color: '#4B5563', fontSize: '11px', marginBottom: '4px', wordBreak: 'break-all' }}>
                      {n.message.match(/0x[a-fA-F0-9]+/)?.[0] ?? ''}
                    </p>
                  )}
                  <p style={{ color: '#4B5563', fontSize: '11px', marginBottom: '6px' }}>
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {!n.read && (
                      <button onClick={() => onMarkAsRead(n.id)}
                        style={{ color: '#2563EB', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Mark read
                      </button>
                    )}
                    <button onClick={() => onDismissNotification(n.id)}
                      style={{ color: '#DC2626', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid #2A2A2A' }} />

      {/* Add Incident Form */}
      <div>
        <p style={{ color: '#4B5563', fontSize: '11px', letterSpacing: '2px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
          Add Incident
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input type="text" placeholder="Title" required style={inputStyle}
            value={newIncident.title}
            onChange={e => setNewIncident({ ...newIncident, title: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#2A2A2A'}
          />
          <input type="text" placeholder="Description" style={inputStyle}
            value={newIncident.description}
            onChange={e => setNewIncident({ ...newIncident, description: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#2A2A2A'}
          />
          <select style={inputStyle} value={newIncident.severity}
            onChange={e => setNewIncident({ ...newIncident, severity: e.target.value as Incident['severity'] })}>
            <option value="low">Low Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="high">High Severity</option>
          </select>
          <select style={inputStyle} value={newIncident.type}
            onChange={e => setNewIncident({ ...newIncident, type: e.target.value as Incident['type'] })}>
            <option value="warning">Warning</option>
            <option value="emergency">Emergency</option>
            <option value="info">Info</option>
          </select>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input type="number" placeholder="Latitude" required style={{ ...inputStyle, flex: 1 }}
              value={newIncident.location.lat || ''}
              onChange={e => setNewIncident({ ...newIncident, location: { ...newIncident.location, lat: Number(e.target.value) } })}
            />
            <input type="number" placeholder="Longitude" required style={{ ...inputStyle, flex: 1 }}
              value={newIncident.location.lng || ''}
              onChange={e => setNewIncident({ ...newIncident, location: { ...newIncident.location, lng: Number(e.target.value) } })}
            />
          </div>
          <input type="text" placeholder="Reported By" style={inputStyle}
            value={newIncident.reportedBy}
            onChange={e => setNewIncident({ ...newIncident, reportedBy: e.target.value })}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#2A2A2A'}
          />
          <button type="submit" style={{
            backgroundColor: '#2563EB', color: 'white', borderRadius: '12px',
            width: '100%', padding: '12px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600, transition: 'background-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2563EB')}
          >
            Add Incident
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
