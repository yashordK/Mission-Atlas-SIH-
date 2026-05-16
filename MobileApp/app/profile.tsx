// MobileApp/app/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const user = {
    name: 'Suyash Vasal Jain',
    dob: '06-Aug-2006', // adjust if needed
    gender: 'Male',
    age: 19, // as of 2025
    bloodGroup: 'O+', // placeholder
    aadhar: 'xxxx-xxxx-xxxx',
    passport: 'X1234567',
    nationality: 'Indian',
    profileImage: '',

    contact: {
      email: 'suyashjain@example.com',
      phone: '+91 91234 56789',
      alternatePhone: '+91 98765 43210',
      address: {
        street: 'Symbiosis University of Applied Sciences',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pin: '452001',
      },
    },

    emergencyContact: {
      name: 'Prashasti',
      relation: 'Friend',
      phone: '+91 98765 43210',
      alternatePhone: '+91 91234 56789',
    },

    medicalInfo: {
      allergies: 'None known',
      chronicDiseases: 'None',
      surgeries: [],
      medications: [],
      vaccinationHistory: ['COVID-19 - 2021'],
    },

    preferences: {
      theme: 'Light',
      notifications: true,
      language: 'English',
    },

    security: {
      twoFA: true,
      lastLogin: '16-Sep-2025 09:00 AM',
      accountCreated: '01-Jul-2023',
    },
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.contact.email}</Text>
        <Text style={styles.phone}>{user.contact.phone}</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <Text style={styles.cardDescription}>Date of Birth: {user.dob}</Text>
        <Text style={styles.cardDescription}>Age: {user.age}</Text>
        <Text style={styles.cardDescription}>Gender: {user.gender}</Text>
        <Text style={styles.cardDescription}>Blood Group: {user.bloodGroup}</Text>
        <Text style={styles.cardDescription}>Aadhar Number: {user.aadhar}</Text>
        <Text style={styles.cardDescription}>Passport Number: {user.passport}</Text>
        <Text style={styles.cardDescription}>Nationality: {user.nationality}</Text>
        <Text style={styles.cardDescription}>
          Address: {user.contact.address.street}, {user.contact.address.city}, {user.contact.address.state} - {user.contact.address.pin}
        </Text>
      </View>

      {/* Emergency Contact */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Emergency Contact</Text>
        <Text style={styles.cardDescription}>Name: {user.emergencyContact.name}</Text>
        <Text style={styles.cardDescription}>Relation: {user.emergencyContact.relation}</Text>
        <Text style={styles.cardDescription}>Phone: {user.emergencyContact.phone}</Text>
        <Text style={styles.cardDescription}>Alternate Phone: {user.emergencyContact.alternatePhone}</Text>
      </View>

      {/* Medical Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Medical Information</Text>
        <Text style={styles.cardDescription}>Allergies: {user.medicalInfo.allergies}</Text>
        <Text style={styles.cardDescription}>Chronic Diseases: {user.medicalInfo.chronicDiseases}</Text>
        <Text style={styles.cardDescription}>Surgeries:</Text>
        {user.medicalInfo.surgeries.length ? user.medicalInfo.surgeries.map((surgery, index) => (
          <Text key={index} style={styles.cardDescription}>• {surgery}</Text>
        )) : <Text style={styles.cardDescription}>None</Text>}
        <Text style={styles.cardDescription}>Medications:</Text>
        {user.medicalInfo.medications.length ? user.medicalInfo.medications.map((med, index) => (
          <Text key={index} style={styles.cardDescription}>• {med}</Text>
        )) : <Text style={styles.cardDescription}>None</Text>}
        <Text style={styles.cardDescription}>Vaccination History:</Text>
        {user.medicalInfo.vaccinationHistory.length ? user.medicalInfo.vaccinationHistory.map((vaccine, index) => (
          <Text key={index} style={styles.cardDescription}>• {vaccine}</Text>
        )) : <Text style={styles.cardDescription}>None</Text>}
      </View>

      {/* Preferences */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Preferences</Text>
        <Text style={styles.cardDescription}>Theme: {user.preferences.theme}</Text>
        <Text style={styles.cardDescription}>Notifications: {user.preferences.notifications ? 'Enabled' : 'Disabled'}</Text>
        <Text style={styles.cardDescription}>Language: {user.preferences.language}</Text>
      </View>

      {/* Security Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Security</Text>
        <Text style={styles.cardDescription}>Two-Factor Authentication: {user.security.twoFA ? 'Enabled' : 'Disabled'}</Text>
        <Text style={styles.cardDescription}>Last Login: {user.security.lastLogin}</Text>
        <Text style={styles.cardDescription}>Account Created: {user.security.accountCreated}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 16 },
  header: { marginTop: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#007AFF' },
  name: { fontSize: 22, fontWeight: 'bold', marginTop: 8, color: '#222' },
  email: { fontSize: 14, color: '#555', marginTop: 2 },
  phone: { fontSize: 14, color: '#555', marginTop: 2 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#333' },
  cardDescription: { fontSize: 14, color: '#555', lineHeight: 20 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF3B30', paddingVertical: 12, borderRadius: 12, marginTop: 20 },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#fff', marginLeft: 8 },
});
