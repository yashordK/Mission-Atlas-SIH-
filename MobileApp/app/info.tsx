// MobileApp/app/info.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from '@expo/vector-icons';

const Info = () => {
  const steps = [
    {
      title: 'Explore Locations',
      description: 'Browse tourist attractions near you with images, names, and distance information.',
      tip: 'Tip: Tap on a location to see directions and opening hours.',
      icon: <Ionicons name="location-outline" size={24} color="#007AFF" />,
    },
    {
      title: 'Search Destinations',
      description: 'Use the quick search to find where you want to go instantly.',
      tip: 'Tip: Use filters to narrow down by distance or type.',
      icon: <Ionicons name="search-outline" size={24} color="#007AFF" />,
    },
    {
      title: 'Emergency Services',
      description: 'Access the nearest police station, fire brigade, and hospital in one tap.',
      tip: 'Tip: You can call directly from the app.',
      icon: <MaterialIcons name="local-police" size={24} color="#007AFF" />,
    },
    {
      title: 'Offline Safety',
      description: 'In case of poor network, basic safety features remain available locally.',
      tip: 'Tip: Download maps for offline use.',
      icon: <FontAwesome5 name="wifi-slash" size={24} color="#007AFF" />,
    },
    {
      title: 'Updates',
      description: 'Get the latest safety information and new destinations as the app updates.',
      tip: 'Tip: Enable notifications to stay informed.',
      icon: <Entypo name="news" size={24} color="#007AFF" />,
    },
  ];

  const faqs = [
    {
      question: 'What if there’s no network coverage?',
      answer: 'Offline safety features will still work, and you can view previously downloaded maps.',
    },
    {
      question: 'Can I save my favorite locations?',
      answer: 'Yes! Tap the heart icon on a location to save it for later.',
    },
    {
      question: 'How do I quickly contact emergency services?',
      answer: 'Use the Emergency Services button on the home screen to call the nearest station.',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>How to Use the App</Text>

      {steps.map((step, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            {step.icon}
            <Text style={styles.cardTitle}>{step.title}</Text>
          </View>
          <Text style={styles.cardDescription}>{step.description}</Text>
          <Text style={styles.cardTip}>{step.tip}</Text>
        </View>
      ))}

      {/* Quick Actions
      <View style={styles.quickActions}>
        <Text style={styles.quickHeader}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="map-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Go to Map</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="search-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="local-police" size={24} color="#fff" />
            <Text style={styles.actionText}>Emergency</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* FAQ Section */}
      <View style={styles.faqCard}>
        <Text style={styles.faqHeader}>Safety FAQs</Text>
        {faqs.map((faq, idx) => (
          <View key={idx} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Q: {faq.question}</Text>
            <Text style={styles.faqAnswer}>A: {faq.answer}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footerCard}>
        <Text style={styles.footerText}>
          Stay safe and enjoy exploring the North-East region with confidence!
        </Text>
        <Text style={styles.footerSmall}>Last updated: 15-Sep-2025</Text>
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 4,
  },
  cardTip: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  quickActions: {
    marginTop: 20,
    marginBottom: 12,
  },
  quickHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginTop: 4,
    fontWeight: '500',
    fontSize: 12,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  faqHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  faqItem: {
    marginBottom: 8,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  footerCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 100,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
  footerSmall: {
    fontSize: 12,
    color: '#e0e0e0',
    marginTop: 4,
  },
});
