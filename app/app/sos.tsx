import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, Linking,
  Vibration, ActivityIndicator, Animated, PanResponder,
} from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const HOLD_DURATION = 3000; // ms to hold before activating

type SOSStatus = 'idle' | 'holding' | 'sending' | 'sent' | 'error';

const SOS = () => {
  const [status, setStatus] = useState<SOSStatus>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const startHold = useCallback(() => {
    setStatus('holding');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    progressAnimation.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: HOLD_DURATION,
      useNativeDriver: false,
    });
    progressAnimation.current.start(({ finished }) => {
      if (finished) activateSOS();
    });

    holdTimer.current = setTimeout(activateSOS, HOLD_DURATION);
  }, []);

  const cancelHold = useCallback(() => {
    if (status !== 'holding') return;
    setStatus('idle');
    progressAnimation.current?.stop();
    progressAnim.setValue(0);
    if (holdTimer.current) clearTimeout(holdTimer.current);
  }, [status]);

  const activateSOS = useCallback(async () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    progressAnimation.current?.stop();
    progressAnim.setValue(0);

    setStatus('sending');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Vibration.vibrate([0, 400, 200, 400]);

    try {
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      if (locStatus !== 'granted') throw new Error('Location permission denied');

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = loc.coords;
      setCoords({ lat: latitude, lng: longitude });

      const { error } = await supabase.from('sos_alerts').insert({
        latitude,
        longitude,
        message: 'SOS activated from mobile app',
        status: 'active',
      });

      if (error) throw error;

      setStatus('sent');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send SOS';
      setErrorMsg(msg);
      setStatus('error');
      console.error('SOS error:', err);
    }
  }, []);

  const reset = () => {
    setStatus('idle');
    setCoords(null);
    setErrorMsg('');
    progressAnim.setValue(0);
  };

  const ringSize = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [140, 170],
  });
  const ringOpacity = progressAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 1],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="warning" size={28} color="#FF3B30" />
        <Text style={styles.headerTitle}>Emergency SOS</Text>
      </View>

      <Text style={styles.subtitle}>
        {status === 'idle' && 'Hold the button for 3 seconds to send an emergency alert'}
        {status === 'holding' && 'Keep holding… release to cancel'}
        {status === 'sending' && 'Sending SOS alert…'}
        {status === 'sent' && 'SOS alert sent! Help is on the way.'}
        {status === 'error' && `Error: ${errorMsg}`}
      </Text>

      {/* Zone safety indicator */}
      <View style={styles.safeZoneCard}>
        <Ionicons name="location" size={18} color="#007AFF" />
        <Text style={styles.safeZoneText}>You are in a monitored zone</Text>
      </View>

      {/* SOS Button */}
      <View style={styles.buttonArea}>
        {status === 'idle' || status === 'holding' ? (
          <>
            {/* Animated ring behind button */}
            <Animated.View
              style={[styles.ring, { width: ringSize, height: ringSize, opacity: ringOpacity, borderRadius: 999 }]}
            />
            <TouchableOpacity
              style={[styles.sosButton, status === 'holding' && styles.sosButtonHolding]}
              onPressIn={startHold}
              onPressOut={cancelHold}
              activeOpacity={0.85}
            >
              <Ionicons name="warning" size={48} color="#fff" />
              <Text style={styles.sosLabel}>SOS</Text>
              {status === 'holding' && <Text style={styles.holdLabel}>HOLD…</Text>}
            </TouchableOpacity>
          </>
        ) : status === 'sending' ? (
          <View style={[styles.sosButton, styles.sosButtonSending]}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.sosLabel}>Sending</Text>
          </View>
        ) : status === 'sent' ? (
          <View style={[styles.sosButton, styles.sosButtonSent]}>
            <Ionicons name="checkmark-circle" size={56} color="#fff" />
            <Text style={styles.sosLabel}>Sent</Text>
          </View>
        ) : (
          <View style={[styles.sosButton, styles.sosButtonError]}>
            <Ionicons name="close-circle" size={56} color="#fff" />
            <Text style={styles.sosLabel}>Failed</Text>
          </View>
        )}
      </View>

      {/* Coordinates display */}
      {coords && (
        <View style={styles.coordCard}>
          <Ionicons name="navigate" size={16} color="#007AFF" />
          <Text style={styles.coordText}>
            Location: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.callBtn]}
          onPress={() => Linking.openURL('tel:112')}
        >
          <Ionicons name="call" size={22} color="#fff" />
          <Text style={styles.actionBtnText}>Call 112</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.ambulanceBtn]}
          onPress={() => Linking.openURL('tel:108')}
        >
          <Ionicons name="medkit" size={22} color="#fff" />
          <Text style={styles.actionBtnText}>Ambulance 108</Text>
        </TouchableOpacity>
      </View>

      {(status === 'sent' || status === 'error') && (
        <TouchableOpacity style={styles.resetBtn} onPress={reset}>
          <Text style={styles.resetBtnText}>
            {status === 'sent' ? 'Mark as Safe' : 'Try Again'}
          </Text>
        </TouchableOpacity>
      )}

      <Text style={styles.footerNote}>
        SOS alerts are monitored by Mission Atlas authorities 24/7
      </Text>
    </View>
  );
};

export default SOS;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 15, color: '#aaa', textAlign: 'center', marginBottom: 20, lineHeight: 22, minHeight: 44 },
  safeZoneCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1a1a2e', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 40 },
  safeZoneText: { color: '#ccc', fontSize: 14 },
  buttonArea: { justifyContent: 'center', alignItems: 'center', width: 200, height: 200, marginBottom: 32 },
  ring: { position: 'absolute', backgroundColor: '#FF3B30' },
  sosButton: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center', shadowColor: '#FF3B30', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 12 },
  sosButtonHolding: { backgroundColor: '#cc2200', transform: [{ scale: 1.08 }] },
  sosButtonSending: { backgroundColor: '#FF8C00' },
  sosButtonSent: { backgroundColor: '#34C759' },
  sosButtonError: { backgroundColor: '#8e0000' },
  sosLabel: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginTop: 4 },
  holdLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  coordCard: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1a1a2e', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, marginBottom: 20 },
  coordText: { color: '#aaa', fontSize: 12 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 16, width: '100%' },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  callBtn: { backgroundColor: '#007AFF' },
  ambulanceBtn: { backgroundColor: '#34C759' },
  actionBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  resetBtn: { backgroundColor: '#333', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12, marginTop: 4 },
  resetBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  footerNote: { position: 'absolute', bottom: 20, fontSize: 12, color: '#555', textAlign: 'center' },
});
