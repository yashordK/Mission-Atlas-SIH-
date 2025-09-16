// app/sos.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SOS = () => (
  <View style={styles.container}>
    <Text style={styles.text}>SOS Screen</Text>
  </View>
);

export default SOS;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold', color: 'red' },
});
