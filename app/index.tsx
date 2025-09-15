// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Import images
import logo from '../assets/images/icon.jpg';
import locationBg from '../assets/images/locationBg.png';
import loc1 from '../assets/images/loc1.png'; 
import loc2 from '../assets/images/loc2.png';
import loc3 from '../assets/images/loc3.png';

const Home = () => {
    const [city, setCity] = useState<string>('Fetching location...');

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

    const locations = [
        { id: 1, name: 'Shillong Peak', distance: '5.2 km', image: loc1 },
        { id: 2, name: 'Kaziranga National Park', distance: '42 km', image: loc2 },
        { id: 3, name: 'Majuli Island', distance: '15 km', image: loc3 },
    ];

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
            <ImageBackground
                source={locationBg}
                style={styles.card}
                imageStyle={{ borderRadius: 16 }}
            >
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
                <Text style={styles.actionText}>Where do you want to go?</Text>

                {locations.map((loc) => (
                    <View key={loc.id} style={styles.locationRow}>
                        <Image source={loc.image} style={styles.locationImage} />
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationName}>{loc.name}</Text>
                            <Text style={styles.locationDistance}>{loc.distance}</Text>
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={styles.showMoreBtn}>
                    <Text style={styles.showMoreText}>Show more</Text>
                </TouchableOpacity>
            </View>

            {/* Emergency Services Card */}
            <View style={styles.servicesCard}>
                <Text style={styles.actionText}>Nearest Emergency Services</Text>

                <View style={styles.serviceRow}>
                    <Ionicons name="shield-checkmark-outline" size={24} color="#007AFF" />
                    <Text style={styles.serviceText}>Police Station (2.3 km)</Text>
                </View>
                <View style={styles.serviceRow}>
                    <Ionicons name="medkit-outline" size={24} color="green" />
                    <Text style={styles.serviceText}>Hospital (1.8 km)</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dae0e0ff',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 20,
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    card: {
        height: 150,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    welcomeText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 6,
    },
    locationText: {
        fontSize: 14,
        color: '#fff',
    },
    quickActionCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
    },
    locationInfo: {
        flex: 1,
    },
    locationName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
    },
    locationDistance: {
        fontSize: 13,
        color: '#777',
    },
    showMoreBtn: {
        marginTop: 8,
        paddingVertical: 6,
        alignItems: 'center',
    },
    showMoreText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#007AFF',
    },
    servicesCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
        elevation: 3,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    serviceText: {
        fontSize: 15,
        marginLeft: 10,
        color: '#333',
    },
});
