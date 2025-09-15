// app/map.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Map = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Map Screen</Text>
  </View>
);

export default Map;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});
