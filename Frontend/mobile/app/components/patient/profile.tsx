import { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuthContext } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { 
    profile, 
    profileLoading, 
    error, 
    fetchProfile, 
    logout 
  } = useAuthContext();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e: any) {
      console.log('Logout error:', e?.message);
    }
  };

  if (profileLoading) {
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
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{profile.first_name} {profile.last_name}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{profile.email}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>User Type:</Text>
              <Text style={styles.value}>{profile.user_type}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>Verified:</Text>
              <Text style={styles.value}>{profile.is_verified ? 'Yes' : 'No'}</Text>
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
