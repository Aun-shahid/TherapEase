// // app/patient/dashboard.tsx
// import { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
// import api from '../utils/api'; // 👈 Axios instance with token
// import { router } from 'expo-router';

// export default function PatientDashboard() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await api.get('authenticator/profile/'); // ← Secure endpoint
//         setUser(res.data); // e.g., { email: ..., first_name: ..., ... }
//       } catch (e) {
//         console.error('❌ Failed to fetch user profile:', e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ padding: 20 }}>
//         <ActivityIndicator />
//         <Text>Loading profile...</Text>
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={{ padding: 20 }}>
//         <Text>⚠️ Failed to load profile. Try logging in again.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>👤 Welcome, {user.first_name}!</Text>
//       <Text>Email: {user.email}</Text>
//       <Text>User Type: {user.user_type}</Text>

//       <TouchableOpacity onPress={() => router.push('./profile')}>
//   <Text style={{ color: 'blue' }}>Go to Profile</Text>
// </TouchableOpacity>

//     </View>
//   );
// }



import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import api from '../utils/api'; // 👈 Axios instance with token

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('authenticator/profile/');
        setUser(res.data);
      } catch (e) {
        console.error('❌ Failed to fetch user profile:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#524f85" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          ⚠️ Failed to load profile. Try logging in again.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>👋 Welcome, {user.first_name}!</Text>
        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoText}>{user.email}</Text>

        <Text style={styles.infoLabel}>User Type:</Text>
        <Text style={styles.infoText}>{user.user_type}</Text>

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
  },
  welcome: {
    fontSize: 26,
    fontWeight: '700',
    color: '#524f85',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  profileButton: {
    marginTop: 30,
    backgroundColor: '#524f85',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
