



import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('authenticator/profile/');
        setProfile(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const refresh = await AsyncStorage.getItem('refresh_token');
      if (refresh) {
        await api.post('authenticator/logout/', { refresh });
      }

      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');

      router.replace('/auth/login');
    } catch (e: any) {
      console.log('Logout error:', e?.response?.data || e.message);
      await AsyncStorage.clear();
      router.replace('/auth/login');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#524f85" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Image
          source={{ uri: 'https://i.ibb.co/F6MJsyK/profile-user.png' }}
          style={styles.illustration}
          resizeMode="contain"
        /> */}

        <Text style={styles.title}>👤 Your Profile</Text>

        {profile ? (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>ID</Text>
              <Text style={styles.value}>{profile.id}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>{profile.username}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{profile.email}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.label}>User Type</Text>
              <Text style={styles.value}>{profile.user_type}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.errorText}>⚠️ Failed to load profile.</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    marginTop:50
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  illustration: {
    width: 220,
    height: 160,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#524f85',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#524f85',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 30,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 16,
  },
});

