// app/auth/profile.tsx (or move it to patient/ or therapist/ as needed)
import { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '../utils/api'; // For authenticated requests
import axios from 'axios';      // For raw logout request

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('authenticator/profile/');
      setProfile(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
  try {
    const refresh = await AsyncStorage.getItem('refresh_token');
    
    if (refresh) {
      await api.post('authenticator/logout/', { refresh });
    }

    // Clear local tokens regardless of API success/failure
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');

    // Navigate to login screen
    router.replace('/auth/login');
  } catch (e: any) {
    console.log("Logout error:", e?.response?.data || e.message);
    // Still clear tokens to prevent stuck state
    await AsyncStorage.clear();
    router.replace('/auth/login');
  }
};


  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>👤 Profile</Text>
      
      {profile ? (
        <>
          <Text>ID: {profile.id}</Text>
          <Text>Username: {profile.username}</Text>
          <Text>Email: {profile.email}</Text>
          <Text>User Type: {profile.user_type}</Text>
        </>
      ) : (
        <Text>⚠️ Failed to load profile.</Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}
