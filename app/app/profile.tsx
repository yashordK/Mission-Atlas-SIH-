import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ProfileRow {
  full_name: string | null;
  phone: string | null;
  nationality: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  blockchain_id: string | null;
  wallet_address: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(authUser);

      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, phone, nationality, emergency_contact, emergency_phone, blockchain_id, wallet_address')
          .eq('id', authUser.id)
          .single();
        if (mounted && data) setProfile(data as ProfileRow);
      }
      if (mounted) setLoading(false);
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile…</Text>
      </View>
    );
  }

  // Unauthenticated state — show guest profile
  const displayName  = profile?.full_name ?? user?.user_metadata?.full_name ?? 'Guest Tourist';
  const displayEmail = user?.email ?? 'Not signed in';
  const displayPhone = profile?.phone ?? user?.phone ?? '—';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={44} color="#007AFF" />
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>
        {displayPhone !== '—' && <Text style={styles.phone}>{displayPhone}</Text>}
        {!user && (
          <View style={styles.guestBadge}>
            <Text style={styles.guestBadgeText}>Guest — Sign in to sync profile</Text>
          </View>
        )}
      </View>

      {/* Personal Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <InfoRow label="Nationality"    value={profile?.nationality ?? '—'} />
        <InfoRow label="Email"          value={displayEmail} />
        <InfoRow label="Phone"          value={displayPhone} />
      </View>

      {/* Emergency Contact */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Emergency Contact</Text>
        <InfoRow label="Name"  value={profile?.emergency_contact ?? '—'} />
        <InfoRow label="Phone" value={profile?.emergency_phone ?? '—'} />
      </View>

      {/* Blockchain Digital ID */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Blockchain Digital ID</Text>
        <InfoRow label="Network"  value="Polygon Amoy Testnet" />
        <InfoRow label="Chain ID" value="80002" />
        <InfoRow
          label="ID"
          value={profile?.blockchain_id
            ? `${profile.blockchain_id.slice(0, 14)}…`
            : 'Not registered'}
        />
        {profile?.wallet_address && (
          <InfoRow label="Wallet" value={`${profile.wallet_address.slice(0, 10)}…`} />
        )}
      </View>

      {/* Account */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <InfoRow label="User ID"    value={user ? user.id.slice(0, 16) + '…' : 'Guest'} />
        <InfoRow label="Status"     value={user ? 'Authenticated' : 'Guest'} />
        <InfoRow label="Auth method" value={user?.app_metadata?.provider ?? '—'} />
      </View>

      {/* Sign out / sign in */}
      {user ? (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.signInNote}>
          <Ionicons name="information-circle-outline" size={18} color="#007AFF" />
          <Text style={styles.signInText}>
            Sign in via the auth flow to sync your profile, emergency contacts, and Blockchain ID.
          </Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#555', fontSize: 14 },
  header: { marginTop: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  avatarCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#e8f0fe', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#007AFF',
  },
  name:  { fontSize: 22, fontWeight: 'bold', marginTop: 10, color: '#222' },
  email: { fontSize: 14, color: '#555', marginTop: 2 },
  phone: { fontSize: 14, color: '#555', marginTop: 2 },
  guestBadge: {
    marginTop: 8, backgroundColor: '#fff3cd', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  guestBadgeText: { fontSize: 12, color: '#856404' },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel: { fontSize: 14, color: '#888' },
  rowValue: { fontSize: 14, color: '#222', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FF3B30', paddingVertical: 14, borderRadius: 12, marginTop: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#fff', marginLeft: 8 },
  signInNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: '#e8f0fe', borderRadius: 12, padding: 14, marginTop: 8,
  },
  signInText: { flex: 1, fontSize: 13, color: '#1a3a6b', lineHeight: 18 },
});
