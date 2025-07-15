

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '../utils/api'; // Axios instance with token

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {



// You're using your custom api instance, which automatically:
// Gets the access token from AsyncStorage.
// Adds it to the request header as Authorization: Bearer <token>.
// This means you're securely requesting the user's profile from a protected endpoint


    try {
      const res = await api.get('authenticator/profile/');
      setProfile(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {


// When the user logs out, you:
// Get the refresh_token from local storage.
// Call the logout/ endpoint on your Django backend and send the refresh token.
// This lets the server invalidate the token and end the session.

    try {
      const refresh = await AsyncStorage.getItem('refresh_token');
      if (refresh) {
        await api.post('authenticator/logout/', { refresh });
      }


// After logout (or even if it fails), 
// Clearing both access_token and refresh_token from local storage.
// Redirecting the user to the login screen.
// This prevents accidental reuse of tokens, even if the logout fails.


      await AsyncStorage.clear();
      router.replace('/auth/login');
    } catch (e: any) {
      console.log('Logout error:', e?.response?.data || e.message);
      await AsyncStorage.clear();
      router.replace('/auth/login');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#524f85" />
        <Text style={styles.loadingText}>Fetching your profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>👤 Your Profile</Text>

        {profile ? (
          <>
            <View style={styles.infoBox}>
              <Text style={styles.label}>ID:</Text>
              <Text style={styles.value}>{profile.id}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Username:</Text>
              <Text style={styles.value}>{profile.username}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profile.email}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>User Type:</Text>
              <Text style={styles.value}>{profile.user_type}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.errorText}>⚠️ Failed to load profile. Please try again.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#524f85',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    marginBottom: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    elevation: 2,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
