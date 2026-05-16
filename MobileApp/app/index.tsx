// MobileApp/app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Modal, ScrollView, FlatList, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import * as Location from 'expo-location';
// import DateTimePicker from '@react-native-community/datetimepicker';

import logo from '../assets/images/icon.jpg';
import locationBg from '../assets/images/locationBg.png';

const GEMINI_API_KEY = 'AIzaSyBAJbubgfm6dHQgYMRxSAMl9JfiFXrL9oY';

const famousPlaces: { [key: string]: string[] } = {
  "Arunachal Pradesh": [
    "Tawang Monastery",
    "Ziro Valley",
    "Sela Pass",
    "Bomdila",
    "Namdapha National Park",
    "Dirang",
    "Gorichen Peak",
    "Itanagar",
    "Pasighat",
    "Pakhui Wildlife Sanctuary",
    "Mechuka Valley",
    "Jiro Lake",
    "Parshuram Kund",
    "Bum La Pass",
    "Talley Valley Wildlife Sanctuary"
  ],
  "Assam": [
    "Kaziranga National Park",
    "Kamakhya Temple",
    "Majuli Island",
    "Manas National Park",
    "Sivasagar",
    "Haflong",
    "Dibrugarh",
    "Umananda Island",
    "Pobitora Wildlife Sanctuary",
    "Tezpur",
    "Dipor Bil",
    "Jorhat",
    "Barak Valley",
    "Chandubi Lake",
    "Assam State Zoo"
  ],
  "Manipur": [
    "Loktak Lake",
    "Imphal War Cemetery",
    "Kangla Fort",
    "Keibul Lamjao National Park",
    "Shirui Hills",
    "INA Memorial",
    "Tharon Cave",
    "Sangai Festival",
    "Sendra Island",
    "Manipur State Museum",
    "Leimaram Waterfall",
    "Khonghampat Orchidarium",
    "Andro Village",
    "Bishnupur",
    "Red Hill Lokpaching"
  ],
  "Meghalaya": [
    "Shillong Peak",
    "Mawlynnong Village",
    "Nohkalikai Falls",
    "Cherrapunji",
    "Umiam Lake",
    "Dawki River",
    "Elephant Falls",
    "Laitlum Canyons",
    "Mawsmai Cave",
    "Living Root Bridges",
    "Balpakram National Park",
    "Siju Cave",
    "Ward's Lake",
    "Don Bosco Museum",
    "Jaintia Hills"
  ],
  "Mizoram": [
    "Phawngpui Blue Mountain",
    "Reiek Tlang",
    "Vantawng Falls",
    "Aizawl",
    "Tam Dil Lake",
    "Hmuifang",
    "Murlen National Park",
    "Lunglei",
    "Palak Lake",
    "Saiha",
    "Dampa Tiger Reserve",
    "Serchhip",
    "Rih Dil",
    "Champhai",
    "Thenzawl"
  ],
  "Nagaland": [
    "Dzukou Valley",
    "Kohima War Cemetery",
    "Khonoma Village",
    "Hornbill Festival",
    "Shilloi Lake",
    "Mokokchung",
    "Tuophema Village",
    "Japfu Peak",
    "Dimapur",
    "Triple Falls",
    "Longwa Village",
    "Mount Tiyi",
    "Nagaland State Museum",
    "Pfutsero",
    "Meluri"
  ],
  "Tripura": [
    "Ujjayanta Palace",
    "Neermahal",
    "Tripura Sundari Temple",
    "Jampui Hills",
    "Sepahijala Wildlife Sanctuary",
    "Unakoti",
    "Dumboor Lake",
    "Bhuvaneswari Temple",
    "Kamalasagar Lake",
    "Heritage Park",
    "Chabimura",
    "Melaghar",
    "Boxanagar",
    "Pilak",
    "Rudrasagar Lake"
  ]
};

const locations = [
  { id: 1, name: "Arunachal Pradesh", image: require("../assets/images/Arunachal_pradesh.jpg") },
  { id: 2, name: "Assam", image: require("../assets/images/assam.jpg") },
  { id: 3, name: "Manipur", image: require("../assets/images/manipur.png") },
  { id: 4, name: "Meghalaya", image: require("../assets/images/meghalaya.png") },
  { id: 5, name: "Mizoram", image: require("../assets/images/mizoram.png") },
  { id: 6, name: "Nagaland", image: require("../assets/images/Nagaland.png") },
  { id: 7, name: "Tripura", image: require("../assets/images/Tripura.jpg") },
];

const Home = () => {
  const [city, setCity] = useState<string>('Fetching location...');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [places, setPlaces] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [tripDays, setTripDays] = useState<string[]>([]);
  const [itinerary, setItinerary] = useState<string>('');
  const [modalStep, setModalStep] = useState<number>(1);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCity('Permission denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      let reverseGeo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (reverseGeo.length > 0) {
        const { city, district, region } = reverseGeo[0];
        setCity(city || district || region || "Unknown Location");
      }
    })();
  }, []);

  const generateItinerary = async () => {
    if (!selectedPlaces.length || !tripDays.length) {
      alert('Please select places and trip dates.');
      return;
    }

    setLoadingItinerary(true);

    const prompt = `
      Create a day-wise travel itinerary for visiting ${selectedPlaces.join(", ")} 
      in ${selectedState} for the dates ${tripDays.join(", ")}.
      Divide attractions per day, suggest timings, and travel tips.
    `;

    try {
      const response = await fetch("https://api.gemini.ai/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gemini-text-001",
          prompt: prompt,
          max_tokens: 1000
        }),
      });

      const data = await response.json();
      setItinerary(data.choices[0].text);
      setModalStep(3);
    } catch (err) {
      console.error(err);
      alert("Failed to generate itinerary");
    } finally {
      setLoadingItinerary(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.headerTitle}>Hello, King</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Welcome Card */}
      <ImageBackground source={locationBg} style={styles.card} imageStyle={{ borderRadius: 16 }}>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientOverlay}
        />
        <View style={styles.cardContent}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.locationText}>{city}</Text>
        </View>
      </ImageBackground>

      {/* Quick Action Card */}
      <View style={styles.quickActionCard}>
        <Text style={styles.actionHeading}>Where do you want to go?</Text>
        {locations.map((loc) => (
          <TouchableOpacity
            key={loc.id}
            style={styles.locationRow}
            activeOpacity={0.7}
            onPress={() => {
              setSelectedState(loc.name);
              setPlaces(famousPlaces[loc.name] || []);
              setSelectedPlaces([]);
              setTripDays([]);
              setModalStep(1);
              setItinerary('');
              setModalVisible(true);
            }}
          >
            <Image source={loc.image} style={styles.locationImage} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{loc.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Emergency Services Card */}
      <View style={styles.servicesCard}>
        <Text style={styles.actionText}>Nearest Emergency Services</Text>
  <TouchableOpacity
    style={styles.serviceRow}
    onPress={() => Linking.openURL('https://maps.app.goo.gl/nPVXiG4Xt8UdEYTbA')}
  >
    <Ionicons name="shield-checkmark-outline" size={24} color="#007AFF" />
    <Text style={styles.serviceText}>Police Station (2.29 km)</Text>
  </TouchableOpacity>
        <View style={styles.serviceRow}>
          <Ionicons name="medkit-outline" size={24} color="green" />
          <Text style={styles.serviceText}>Hospital (1.8 km)</Text>
        </View>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedState}</Text>

          {/* Step Indicator */}
          <View style={styles.stepper}>
            <View style={[styles.step, modalStep >= 1 && styles.activeStep]} />
            <View style={[styles.step, modalStep >= 2 && styles.activeStep]} />
            <View style={[styles.step, modalStep >= 3 && styles.activeStep]} />
          </View>

          {/* Step 1: Select Places */}
          {modalStep === 1 && (
            <>
              <Text style={styles.modalSubTitle}>Select Places to Visit</Text>
              <FlatList
                data={places}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.placeItem, selectedPlaces.includes(item) && styles.selectedPlace]}
                    onPress={() => {
                      if (selectedPlaces.includes(item)) {
                        setSelectedPlaces(selectedPlaces.filter(p => p !== item));
                      } else {
                        setSelectedPlaces([...selectedPlaces, item]);
                      }
                    }}
                  >
                    <Text style={{ color: selectedPlaces.includes(item) ? '#fff' : '#000', fontWeight: '500' }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.nextBtn} onPress={() => setModalStep(2)}>
                <Text style={styles.nextBtnText}>Next</Text>
              </TouchableOpacity>
            </>
          )}

{/* Step 2: Select Dates */}
{modalStep === 2 && (
  <>
    <Text style={styles.modalSubTitle}>Enter Trip Dates</Text>
    <TextInput
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        fontSize: 16
      }}
      placeholder="Enter dates (e.g., 2025-09-20, 2025-09-21)"
      value={tripDays.join(', ')}
      onChangeText={(text) => setTripDays(text.split(',').map(t => t.trim()))}
    />

    <TouchableOpacity style={styles.nextBtn} onPress={generateItinerary}>
      <Text style={styles.nextBtnText}>Generate Itinerary</Text>
    </TouchableOpacity>
  </>
)}

          {/* Step 3: Show Itinerary */}
          {modalStep === 3 && (
            <>
              <Text style={styles.modalSubTitle}>Your AI-Powered Itinerary</Text>
              {loadingItinerary ? <ActivityIndicator size="large" color="#007bff" /> :
                <ScrollView style={styles.itineraryBox}>
                  <Text style={styles.itineraryText}>{itinerary}</Text>
                </ScrollView>
              }
              <TouchableOpacity style={styles.nextBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.nextBtnText}>Close</Text>
              </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#dae0e0ff', paddingHorizontal: 16, paddingTop: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#fff', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginTop: 20 },
  logo: { width: 40, height: 40, resizeMode: 'contain' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  card: { height: 150, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  cardContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  welcomeText: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
  locationText: { fontSize: 19, fontWeight: 'bold', color: '#ffffffe1' },
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
  modalTitle: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  modalSubTitle: { fontSize: 20, fontWeight: '600', marginVertical: 12 },
  stepper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  step: { width: (width - 80) / 3, height: 5, backgroundColor: '#ccc', borderRadius: 5 },
  activeStep: { backgroundColor: '#007bff' },
  placeItem: { padding: 12, marginVertical: 5, backgroundColor: '#e0e0e0', borderRadius: 10 },
  selectedPlace: { backgroundColor: '#007bff' },
  nextBtn: { backgroundColor: '#007bff', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  nextBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  itineraryBox: { maxHeight: '70%', backgroundColor: '#fff', padding: 12, borderRadius: 12 },
  itineraryText: { fontSize: 15, lineHeight: 22 }
});
