// app/patient/dashboard.tsx
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../utils/api'; // 👈 Axios instance with token
import { router } from 'expo-router';

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('authenticator/profile/'); // ← Secure endpoint
        setUser(res.data); // e.g., { email: ..., first_name: ..., ... }
      } catch (e) {
        console.error('❌ Failed to fetch user profile:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ padding: 20 }}>
        <Text>⚠️ Failed to load profile. Try logging in again.</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>👤 Welcome, {user.first_name}!</Text>
      <Text>Email: {user.email}</Text>
      <Text>User Type: {user.user_type}</Text>

      <TouchableOpacity onPress={() => router.push('./profile')}>
  <Text style={{ color: 'blue' }}>Go to Profile</Text>
</TouchableOpacity>

    </View>
  );
}
