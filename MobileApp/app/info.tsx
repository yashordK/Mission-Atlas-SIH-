// app/info.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Info = () => {
  const steps = [
    {
      title: 'Explore Locations',
      description:
        'Browse tourist attractions near you with images, names, and distance information.',
    },
    {
      title: 'Search Destinations',
      description:
        'Use the quick search to find where you want to go instantly.',
    },
    {
      title: 'Emergency Services',
      description:
        'Access the nearest police station, fire brigade, and hospital in one tap.',
    },
    {
      title: 'Offline Safety',
      description:
        'In case of poor network, basic safety features remain available locally.',
    },
    {
      title: 'Updates',
      description:
        'Get the latest safety information and new destinations as the app updates.',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>How to Use the App</Text>

      {steps.map((step, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{step.title}</Text>
          <Text style={styles.cardDescription}>{step.description}</Text>
        </View>
      ))}

      <View style={styles.footerCard}>
        <Text style={styles.footerText}>
          Stay safe and enjoy exploring the North-East region with confidence!
        </Text>
      </View>
    </ScrollView>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  footerCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
});
