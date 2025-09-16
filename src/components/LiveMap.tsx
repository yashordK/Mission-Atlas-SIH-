// src/components/LiveMap.tsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Tourist, Incident } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Props interface
interface LiveMapProps {
  tourists: Tourist[];
  incidents: Incident[];
}

// Helper component to fix broken tiles on first render
const ResizeMap: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
};

const LiveMap: React.FC<LiveMapProps> = ({ tourists, incidents }) => {
  return (
    <MapContainer
      center={[26.1445, 91.7362]} // Default center: Guwahati
      zoom={6}
      className="h-full w-full z-0 rounded-xl shadow-inner"
    >
      <ResizeMap />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Tourist markers */}
      {tourists.map((t) => (
        <Marker key={t.id} position={[t.location.lat, t.location.lng]}>
          <Popup>
            <strong>{t.name}</strong>
            <br />
            Safety Score: {t.safetyScore}
            <br />
            Itinerary: {t.itinerary}
          </Popup>
        </Marker>
      ))}

      {/* Incident markers */}
      {incidents.map((i) => (
        <Marker key={i.id} position={[i.location.lat, i.location.lng]}>
          <Popup>
            <strong>{i.title}</strong>
            <br />
            {i.description}
            <br />
            Severity: {i.severity}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LiveMap;

