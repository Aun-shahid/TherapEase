

// app/therapist/dashboard.tsx
import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuthContext } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function TherapistDashboard() {
  const { 
    user, 
    profileLoading, 
    fetchProfile 
  } = useAuthContext();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#524f85" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ Failed to load profile. Try logging in again.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Image
          source={{ uri: 'https://i.ibb.co/QfH4zST/patient-dashboard.png' }}
          style={styles.illustration}
          resizeMode="contain"
        /> */}

        <Text style={styles.greeting}>👋 Welcome, {user.first_name}!</Text>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>User Type:</Text>
          <Text style={styles.value}>{user.user_type}</Text>
        </View>

        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('./profile')}>
          <Text style={styles.profileButtonText}>Go to Profile</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:50
  },
  illustration: {
    width: 220,
    height: 160,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#524f85',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  profileButton: {
    backgroundColor: '#524f85',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
