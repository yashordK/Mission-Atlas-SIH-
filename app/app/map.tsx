import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, View, Dimensions, ActivityIndicator, TouchableOpacity, Text,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';

interface IncidentPoint {
  lat: number;
  lng: number;
  severity: string;
  title: string;
}

// Map severity → heatmap intensity
function severityToIntensity(severity: string): number {
  switch (severity) {
    case 'high':   return 1.0;
    case 'medium': return 0.6;
    default:       return 0.2;
  }
}

export default function Map() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [incidents, setIncidents] = useState<IncidentPoint[]>([]);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
  }, []);

  // Fetch active incidents from Supabase
  useEffect(() => {
    const fetchIncidents = async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('latitude, longitude, severity, title')
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (!error && data) {
        setIncidents(
          data.map(row => ({
            lat: row.latitude as number,
            lng: row.longitude as number,
            severity: row.severity ?? 'low',
            title: row.title ?? 'Incident',
          }))
        );
      }
    };

    fetchIncidents();

    // Realtime: update heatmap when incidents change
    const channel = supabase
      .channel('map-incidents')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
        fetchIncidents();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleRelocate = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    setLocation(coords);
    webviewRef.current?.postMessage(JSON.stringify(coords));
  };

  if (!location) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12, color: '#555' }}>Getting your location…</Text>
      </View>
    );
  }

  // Build heatmap points from real incidents; fall back to empty array
  const heatPoints: [number, number, number][] = incidents.map(i => [
    i.lat, i.lng, severityToIntensity(i.severity),
  ]);

  // Build marker data for incidents (shown as popup markers)
  const incidentMarkers = incidents.map(i => ({
    lat: i.lat,
    lng: i.lng,
    title: i.title,
    severity: i.severity,
  }));

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Safety Map</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
        #map { position: absolute; top: 0; left: 0; z-index: 1; }
        .legend {
          position: absolute; bottom: 20px; left: 20px;
          background: rgba(255,255,255,0.95); padding: 8px 12px;
          font-size: 13px; border-radius: 6px; line-height: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .legend i { width: 14px; height: 14px; float: left; margin-right: 8px; border-radius: 50%; margin-top: 3px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div class="legend">
        <b>Safety Heatmap</b><br>
        <i style="background:red"></i> High Risk<br>
        <i style="background:orange"></i> Medium Risk<br>
        <i style="background:green"></i> Low / Safe
      </div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"></script>
      <script>
        var userLat = ${location.latitude};
        var userLng = ${location.longitude};
        var incidentData = ${JSON.stringify(incidentMarkers)};
        var heatData = ${JSON.stringify(heatPoints)};

        var map = L.map('map').setView([userLat, userLng], 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors', zIndex: 0
        }).addTo(map);

        // User location marker
        var userMarker = L.marker([userLat, userLng], { zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup('<b>You are here</b>')
          .openPopup();

        // Incident markers
        incidentData.forEach(function(inc) {
          var color = inc.severity === 'high' ? '#dc2626' : inc.severity === 'medium' ? '#f97316' : '#16a34a';
          var icon = L.divIcon({
            html: '<div style="background:' + color + ';width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4)"></div>',
            iconSize: [12, 12], className: ''
          });
          L.marker([inc.lat, inc.lng], { icon: icon })
            .addTo(map)
            .bindPopup('<b>' + inc.title + '</b><br>Severity: ' + inc.severity);
        });

        // Heatmap layer (only if we have real data)
        if (heatData.length > 0) {
          L.heatLayer(heatData, {
            radius: 40, blur: 30, maxZoom: 17,
            gradient: { 0.2: 'green', 0.5: 'orange', 0.8: 'orangered', 1.0: 'red' }
          }).addTo(map);
        }

        // Handle relocation from native
        function updateLocation(lat, lng) {
          map.setView([lat, lng], 12);
          userMarker.setLatLng([lat, lng]).openPopup();
        }
        document.addEventListener('message', function(e) {
          var d = JSON.parse(e.data); updateLocation(d.latitude, d.longitude);
        });
        window.addEventListener('message', function(e) {
          var d = JSON.parse(e.data); updateLocation(d.latitude, d.longitude);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        source={{ html: htmlContent }}
        style={styles.map}
      />
      <TouchableOpacity style={styles.button} onPress={handleRelocate}>
        <Text style={styles.buttonText}>Relocate</Text>
      </TouchableOpacity>
      {incidents.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{incidents.length} active incidents</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  button: {
    position: 'absolute', bottom: 40, right: 20,
    backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  badge: {
    position: 'absolute', top: 16, left: 16,
    backgroundColor: 'rgba(220,38,38,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  badgeText: { color: 'white', fontSize: 12, fontWeight: '600' },
});
