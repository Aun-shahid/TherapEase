

//purpose of tokens here 

// First-time login:
// You go to /auth/login
// Enter email + password
// Tokens are received from server and saved using AsyncStorage
// You’re redirected to dashboard

// Next time suppose excepot form logout anythign happens that crashes the app like you kill the expo or 
// memory crahs happened etc and when restart the app then

// index.tsx runs

// It finds the token in AsyncStorage

// It checks if it’s still valid using /profile/ API

// If valid → goes to your dashboard

// If not → logs you out and goes to login screen


// import { useEffect, useState } from 'react';
// import { router } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import api from './utils/api'; // Axios instance with interceptor support
// import { ActivityIndicator, View, Text } from 'react-native';
// import { AxiosError } from 'axios';

// export default function Index() {
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     const checkAuthAndRedirect = async () => {
//       try {
//         const token = await AsyncStorage.getItem('access_token');

//         if (!token) {
//           // No token found — go to login
//           router.replace('/auth/login');
//           return;
//         }

//         // Token exists → try to fetch user profile
//         const res = await api.get('authenticator/profile/');
//         const user = res.data;

//         // Redirect user based on their role
//         if (user.user_type === 'therapist') {
//           router.replace('/therapist/dashboard');
//         } else {
//           router.replace('/patient/dashboard');
//         }
//       } catch (err) {
//         const axiosErr = err as AxiosError;
//         console.log(
//           '❌ Auth check failed:',
//           axiosErr.response?.data || axiosErr.message
//         );

//         // Clear any possibly invalid tokens
//         await AsyncStorage.clear();

//         // Send user to login page
//         router.replace('/auth/login');
//       } finally {
//         setChecking(false);
//       }
//     };

//     checkAuthAndRedirect();
//   }, []);

//   // Show a loading spinner while checking authentication
//   if (checking) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#524f85" />
//         <Text style={{ marginTop: 10 }}>Checking session...</Text>
//       </View>
//     );
//   }

//   return null;
// }







import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './utils/api'; // Axios instance with interceptor support
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // 🟢 Import StyleSheet
import { AxiosError } from 'axios';
import LottieView from 'lottie-react-native';
import { AntDesign } from '@expo/vector-icons';

export default function Index() {
  const [checking, setChecking] = useState(false); //  changed since we're not auto-checking anymore

  const checkAuthAndRedirect = async () => {
    setChecking(true);
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        router.replace('/auth/splash');
        return;
      }

      const res = await api.get('authenticator/profile/');
      const user = res.data;

      if (user.user_type === 'therapist') {
        router.replace('/therapist/dashboard');
      } else {
        router.replace('/patient/dashboard');
      }
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.log('❌ Auth check failed:', axiosErr.response?.data || axiosErr.message);
      await AsyncStorage.clear();
      router.replace('/auth/login');
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/images/mental-health.json')}
        autoPlay
        loop
        style={styles.animation}
      />

      <Text style={styles.title}>
        Welcome to <Text style={styles.brand}>MindScribe</Text>
      </Text>
      <Text style={styles.subtitle}>“Your healing journey starts here”</Text>

      <TouchableOpacity style={styles.nextButton} onPress={checkAuthAndRedirect} disabled={checking}>
        <AntDesign name="arrowright" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#524f85',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 280,
    height: 280,
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  brand: {
    color: '#ffc0cb',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
  },
  nextButton: {
    position: 'absolute',
    top: 60,
    right: 25,
    backgroundColor: '#7d70ba',
    borderRadius: 50,
    padding: 10,
    elevation: 4,
  },
});

