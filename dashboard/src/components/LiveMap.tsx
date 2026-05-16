import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Tourist, Incident } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Suppress default icon load — we use CircleMarkers instead
delete (L.Icon.Default.prototype as any)._getIconUrl;

interface LiveMapProps {
  tourists: Tourist[];
  incidents: Incident[];
}

const ResizeMap: React.FC = () => {
  const map = useMap();
  useEffect(() => { map.invalidateSize(); }, [map]);
  return null;
};

const incidentColor = (severity: string): string => {
  switch (severity) {
    case 'high':   return '#DC2626';
    case 'medium': return '#D97706';
    default:       return '#2563EB';
  }
};

const LiveMap: React.FC<LiveMapProps> = ({ tourists, incidents }) => {
  return (
    <MapContainer
      center={[26.1445, 91.7362]}
      zoom={6}
      style={{ height: '100%', width: '100%', backgroundColor: '#000000' }}
    >
      <ResizeMap />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* Tourist markers — blue circles */}
      {tourists.map(t => (
        <CircleMarker
          key={t.id}
          center={[t.location.lat, t.location.lng]}
          radius={8}
          pathOptions={{ fillColor: '#2563EB', fillOpacity: 0.9, color: '#1D4ED8', weight: 2 }}
        >
          <Popup>
            <div style={{ background: '#1C1C1C', color: '#fff', padding: '8px', borderRadius: '8px', minWidth: '160px' }}>
              <strong style={{ color: '#3B82F6' }}>{t.name}</strong>
              <br /><span style={{ color: '#9CA3AF', fontSize: '12px' }}>Score: {t.safetyScore}/100</span>
              <br /><span style={{ color: '#9CA3AF', fontSize: '12px' }}>{t.itinerary}</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Incident markers — severity-coloured circles */}
      {incidents.map(i => (
        <CircleMarker
          key={i.id}
          center={[i.location.lat, i.location.lng]}
          radius={i.severity === 'high' ? 10 : i.severity === 'medium' ? 8 : 6}
          pathOptions={{
            fillColor: incidentColor(i.severity),
            fillOpacity: 0.85,
            color: incidentColor(i.severity),
            weight: 2,
          }}
        >
          <Popup>
            <div style={{ background: '#1C1C1C', color: '#fff', padding: '8px', borderRadius: '8px', minWidth: '180px' }}>
              <strong style={{ color: incidentColor(i.severity) }}>{i.title}</strong>
              <br /><span style={{ color: '#9CA3AF', fontSize: '12px' }}>{i.description}</span>
              <br /><span style={{ color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {i.severity} · {i.reportedBy}
              </span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default LiveMap;
