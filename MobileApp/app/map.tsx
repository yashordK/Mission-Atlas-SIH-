import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

export default function Map() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const handleRelocate = async () => {
    let loc = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setLocation(coords);
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify(coords));
    }
  };

  if (!location) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // create sample clusters around user
  function generateZones(lat: number, lng: number) {
    const points: any[] = [];

    // Safe (green cluster)
    for (let i = 0; i < 10; i++) {
      points.push([lat + (Math.random() - 0.5) * 0.05, lng + (Math.random() - 0.5) * 0.05, 0.2]);
    }

    // Warning (yellow/orange cluster)
    for (let i = 0; i < 10; i++) {
      points.push([lat + (Math.random() - 0.5) * 0.15, lng + (Math.random() - 0.5) * 0.15, 0.6]);
    }

    // Danger (red cluster)
    for (let i = 0; i < 10; i++) {
      points.push([lat + (Math.random() - 0.5) * 0.25, lng + (Math.random() - 0.5) * 0.25, 1.0]);
    }

    return points;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Leaflet Heatmap Zones</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>
        html, body, #map {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        #map { position: absolute; top: 0; left: 0; z-index: 1; }
        .legend {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: white;
          padding: 6px 10px;
          font-size: 14px;
          border-radius: 4px;
          line-height: 18px;
        }
        .legend i {
          width: 18px;
          height: 18px;
          float: left;
          margin-right: 8px;
          opacity: 0.8;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div class="legend">
        <i style="background:green"></i> Safe<br>
        <i style="background:yellow"></i> Warning<br>
        <i style="background:orange"></i> High Warning<br>
        <i style="background:red"></i> Danger
      </div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"></script>
      <script>
        var userLat = ${location.latitude};
        var userLng = ${location.longitude};

        var map = L.map('map').setView([userLat, userLng], 12);

        // Base tiles always below
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          zIndex: 0
        }).addTo(map);

        // User marker
        var userMarker = L.marker([userLat, userLng], { zIndexOffset: 1000 })
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();

        // Initial heatmap
        var points = ${JSON.stringify(generateZones(location.latitude, location.longitude))};
        var heat = L.heatLayer(points, {
          radius: 35,
          blur: 25,
          maxZoom: 17,
          gradient: {
            0.2: "green",
            0.5: "yellow",
            0.8: "orange",
            1.0: "red"
          }
        }).addTo(map);

        function updateLocation(lat, lng) {
          map.setView([lat, lng], 12);
          userMarker.setLatLng([lat, lng]).bindPopup("You are here").openPopup();

          // regenerate zones around new location
          var newPoints = [];
          for (var i = 0; i < 10; i++) newPoints.push([lat + (Math.random()-0.5)*0.05, lng + (Math.random()-0.5)*0.05, 0.2]);
          for (var i = 0; i < 10; i++) newPoints.push([lat + (Math.random()-0.5)*0.15, lng + (Math.random()-0.5)*0.15, 0.6]);
          for (var i = 0; i < 10; i++) newPoints.push([lat + (Math.random()-0.5)*0.25, lng + (Math.random()-0.5)*0.25, 1.0]);
          heat.setLatLngs(newPoints);
        }

        // Android
        document.addEventListener("message", function(event) {
          var data = JSON.parse(event.data);
          updateLocation(data.latitude, data.longitude);
        });

        // iOS
        window.addEventListener("message", function(event) {
          var data = JSON.parse(event.data);
          updateLocation(data.latitude, data.longitude);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ html: htmlContent }}
        style={styles.map}
      />

      <TouchableOpacity style={styles.button} onPress={handleRelocate}>
        <Text style={styles.buttonText}>Relocate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },
  button: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
