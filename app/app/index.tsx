import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground,
  Modal, ScrollView, FlatList, Dimensions, ActivityIndicator, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import * as Location from 'expo-location';

import logo from '../assets/images/icon.jpg';
import locationBg from '../assets/images/locationBg.png';

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY ?? '';
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL ?? 'http://localhost:3001';

const famousPlaces: { [key: string]: string[] } = {
  "Arunachal Pradesh": [
    "Tawang Monastery", "Ziro Valley", "Sela Pass", "Bomdila",
    "Namdapha National Park", "Dirang", "Gorichen Peak", "Itanagar",
    "Pasighat", "Pakhui Wildlife Sanctuary", "Mechuka Valley",
    "Jiro Lake", "Parshuram Kund", "Bum La Pass", "Talley Valley Wildlife Sanctuary",
  ],
  "Assam": [
    "Kaziranga National Park", "Kamakhya Temple", "Majuli Island", "Manas National Park",
    "Sivasagar", "Haflong", "Dibrugarh", "Umananda Island",
    "Pobitora Wildlife Sanctuary", "Tezpur", "Dipor Bil", "Jorhat",
    "Barak Valley", "Chandubi Lake", "Assam State Zoo",
  ],
  "Manipur": [
    "Loktak Lake", "Imphal War Cemetery", "Kangla Fort", "Keibul Lamjao National Park",
    "Shirui Hills", "INA Memorial", "Tharon Cave", "Sangai Festival",
    "Sendra Island", "Manipur State Museum", "Leimaram Waterfall",
    "Khonghampat Orchidarium", "Andro Village", "Bishnupur", "Red Hill Lokpaching",
  ],
  "Meghalaya": [
    "Shillong Peak", "Mawlynnong Village", "Nohkalikai Falls", "Cherrapunji",
    "Umiam Lake", "Dawki River", "Elephant Falls", "Laitlum Canyons",
    "Mawsmai Cave", "Living Root Bridges", "Balpakram National Park",
    "Siju Cave", "Ward's Lake", "Don Bosco Museum", "Jaintia Hills",
  ],
  "Mizoram": [
    "Phawngpui Blue Mountain", "Reiek Tlang", "Vantawng Falls", "Aizawl",
    "Tam Dil Lake", "Hmuifang", "Murlen National Park", "Lunglei",
    "Palak Lake", "Saiha", "Dampa Tiger Reserve", "Serchhip",
    "Rih Dil", "Champhai", "Thenzawl",
  ],
  "Nagaland": [
    "Dzukou Valley", "Kohima War Cemetery", "Khonoma Village", "Hornbill Festival",
    "Shilloi Lake", "Mokokchung", "Tuophema Village", "Japfu Peak",
    "Dimapur", "Triple Falls", "Longwa Village", "Mount Tiyi",
    "Nagaland State Museum", "Pfutsero", "Meluri",
  ],
  "Tripura": [
    "Ujjayanta Palace", "Neermahal", "Tripura Sundari Temple", "Jampui Hills",
    "Sepahijala Wildlife Sanctuary", "Unakoti", "Dumboor Lake", "Bhuvaneswari Temple",
    "Kamalasagar Lake", "Heritage Park", "Chabimura", "Melaghar",
    "Boxanagar", "Pilak", "Rudrasagar Lake",
  ],
};

const locations = [
  { id: 1, name: "Arunachal Pradesh", image: require("../assets/images/Arunachal_pradesh.jpg") },
  { id: 2, name: "Assam",             image: require("../assets/images/assam.jpg") },
  { id: 3, name: "Manipur",           image: require("../assets/images/manipur.png") },
  { id: 4, name: "Meghalaya",         image: require("../assets/images/meghalaya.png") },
  { id: 5, name: "Mizoram",           image: require("../assets/images/mizoram.png") },
  { id: 6, name: "Nagaland",          image: require("../assets/images/Nagaland.png") },
  { id: 7, name: "Tripura",           image: require("../assets/images/Tripura.jpg") },
];

const Home = () => {
  const [city, setCity] = useState<string>('Fetching location…');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [places, setPlaces] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [tripDays, setTripDays] = useState<string>('');
  const [itinerary, setItinerary] = useState<string>('');
  const [modalStep, setModalStep] = useState<number>(1);
  const [loadingItinerary, setLoadingItinerary] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setCity('Permission denied'); return; }
      const loc = await Location.getCurrentPositionAsync({});
      const reverseGeo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (reverseGeo.length > 0) {
        const { city: c, district, region } = reverseGeo[0];
        setCity(c ?? district ?? region ?? 'Unknown Location');
      }
    })();
  }, []);

  const generateItinerary = async () => {
    if (!selectedPlaces.length || !tripDays.trim()) {
      alert('Please select places and enter trip dates.');
      return;
    }
    setLoadingItinerary(true);
    const prompt = `Create a detailed day-wise travel itinerary for visiting ${selectedPlaces.join(', ')} in ${selectedState} for the dates ${tripDays}. Divide attractions per day, suggest timings, local food, travel tips, and safety advice for each location.`;

    try {
      // Try backend first (avoids exposing key on client), fall back to direct Groq
      let itineraryText = '';
      try {
        const serverRes = await fetch(`${SERVER_URL}/api/itinerary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ places: selectedPlaces, state: selectedState, dates: tripDays }),
        });
        if (serverRes.ok) {
          const serverData = await serverRes.json();
          itineraryText = serverData.itinerary;
        } else {
          throw new Error('Server unavailable');
        }
      } catch {
        // Direct Groq fallback
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              { role: 'system', content: 'You are a knowledgeable travel assistant specializing in Northeast India tourism. Provide practical, safety-aware travel itineraries.' },
              { role: 'user', content: prompt },
            ],
            max_tokens: 1500,
            temperature: 0.7,
          }),
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Groq API error ${response.status}: ${errText}`);
        }
        const data = await response.json();
        itineraryText = data.choices?.[0]?.message?.content ?? 'No itinerary generated.';
      }

      setItinerary(itineraryText);
      setModalStep(3);
    } catch (err) {
      console.error('Itinerary generation failed:', err);
      alert('Failed to generate itinerary. Please check your API key or internet connection.');
    } finally {
      setLoadingItinerary(false);
    }
  };

  const openModal = (stateName: string) => {
    setSelectedState(stateName);
    setPlaces(famousPlaces[stateName] ?? []);
    setSelectedPlaces([]);
    setTripDays('');
    setModalStep(1);
    setItinerary('');
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.headerTitle}>Hello, Explorer</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Welcome Card */}
      <ImageBackground source={locationBg} style={styles.card} imageStyle={{ borderRadius: 16 }}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.gradientOverlay}
        />
        <View style={styles.cardContent}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.locationText}>{city}</Text>
        </View>
      </ImageBackground>

      {/* Destinations */}
      <View style={styles.quickActionCard}>
        <Text style={styles.actionHeading}>Where do you want to go?</Text>
        {locations.map(loc => (
          <TouchableOpacity
            key={loc.id}
            style={styles.locationRow}
            activeOpacity={0.7}
            onPress={() => openModal(loc.name)}
          >
            <Image source={loc.image} style={styles.locationImage} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{loc.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Emergency Services */}
      <View style={styles.servicesCard}>
        <Text style={styles.actionText}>Nearest Emergency Services</Text>
        <TouchableOpacity
          style={styles.serviceRow}
          onPress={() => Linking.openURL('https://maps.app.goo.gl/nPVXiG4Xt8UdEYTbA')}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color="#007AFF" />
          <Text style={styles.serviceText}>Police Station</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.serviceRow} onPress={() => Linking.openURL('tel:112')}>
          <Ionicons name="call-outline" size={24} color="#FF3B30" />
          <Text style={styles.serviceText}>Emergency: 112</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.serviceRow} onPress={() => Linking.openURL('tel:108')}>
          <Ionicons name="medkit-outline" size={24} color="green" />
          <Text style={styles.serviceText}>Ambulance: 108</Text>
        </TouchableOpacity>
      </View>

      {/* Itinerary Modal */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedState}</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Step indicator */}
          <View style={styles.stepper}>
            {[1, 2, 3].map(s => (
              <View key={s} style={[styles.step, modalStep >= s && styles.activeStep]} />
            ))}
          </View>

          {/* Step 1: Select Places */}
          {modalStep === 1 && (
            <>
              <Text style={styles.modalSubTitle}>Select Places to Visit</Text>
              <FlatList
                data={places}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.placeItem, selectedPlaces.includes(item) && styles.selectedPlace]}
                    onPress={() => setSelectedPlaces(prev =>
                      prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]
                    )}
                  >
                    <Text style={{ color: selectedPlaces.includes(item) ? '#fff' : '#000', fontWeight: '500' }}>
                      {item}
                    </Text>
                    {selectedPlaces.includes(item) && (
                      <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    )}
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={[styles.nextBtn, !selectedPlaces.length && styles.nextBtnDisabled]}
                onPress={() => selectedPlaces.length && setModalStep(2)}
              >
                <Text style={styles.nextBtnText}>Next ({selectedPlaces.length} selected)</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step 2: Enter Dates */}
          {modalStep === 2 && (
            <>
              <Text style={styles.modalSubTitle}>Enter Trip Dates</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="e.g. 2025-09-20, 2025-09-21, 2025-09-22"
                placeholderTextColor="#aaa"
                value={tripDays}
                onChangeText={setTripDays}
              />
              <Text style={styles.dateHint}>Enter dates separated by commas</Text>
              <TouchableOpacity
                style={[styles.nextBtn, loadingItinerary && styles.nextBtnDisabled]}
                onPress={generateItinerary}
                disabled={loadingItinerary}
              >
                {loadingItinerary
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.nextBtnText}>Generate Itinerary</Text>
                }
              </TouchableOpacity>
            </>
          )}

          {/* Step 3: Show Itinerary */}
          {modalStep === 3 && (
            <>
              <Text style={styles.modalSubTitle}>Your AI Itinerary</Text>
              <ScrollView style={styles.itineraryBox}>
                <Text style={styles.itineraryText}>{itinerary}</Text>
              </ScrollView>
              <View style={styles.row}>
                <TouchableOpacity style={[styles.nextBtn, { flex: 1, marginRight: 8 }]} onPress={() => setModalStep(2)}>
                  <Text style={styles.nextBtnText}>Regenerate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.nextBtn, { flex: 1, backgroundColor: '#34C759' }]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.nextBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Home;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dae0e0', paddingHorizontal: 16, paddingTop: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#fff', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginTop: 20 },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  card: { height: 150, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  cardContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  welcomeText: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  locationText: { fontSize: 19, fontWeight: 'bold', color: 'rgba(255,255,255,0.9)' },
  quickActionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginVertical: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  actionHeading: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  locationRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 12, padding: 10, marginBottom: 10 },
  locationImage: { width: 50, height: 50, borderRadius: 10, marginRight: 12 },
  locationInfo: { flex: 1 },
  locationName: { fontSize: 16, fontWeight: '500', color: '#222' },
  servicesCard: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 3 },
  serviceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  serviceText: { fontSize: 15, marginLeft: 10, color: '#333' },
  actionText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  modalSubTitle: { fontSize: 18, fontWeight: '600', marginVertical: 12 },
  stepper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 8 },
  step: { flex: 1, height: 5, backgroundColor: '#ccc', borderRadius: 5 },
  activeStep: { backgroundColor: '#007bff' },
  placeItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, marginVertical: 4, backgroundColor: '#e0e0e0', borderRadius: 10 },
  selectedPlace: { backgroundColor: '#007bff' },
  nextBtn: { backgroundColor: '#007bff', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  nextBtnDisabled: { backgroundColor: '#aaa' },
  nextBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  dateInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 8, fontSize: 16, backgroundColor: '#fff' },
  dateHint: { fontSize: 12, color: '#888', marginBottom: 4 },
  itineraryBox: { flex: 1, backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 12 },
  itineraryText: { fontSize: 15, lineHeight: 24, color: '#222' },
  row: { flexDirection: 'row', marginTop: 8 },
});
