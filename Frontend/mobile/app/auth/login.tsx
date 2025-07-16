
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Platform,
//   KeyboardAvoidingView,
//   Alert,
// } from 'react-native';
// import { useState } from 'react';
// import axios from 'axios';
// import { router } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import { BASE_URL } from '../utils/config';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//      const res = await axios.post(`${BASE_URL}/api/authenticator/login/`, {
//   email,
//   password,
// });

//       const { user, access, refresh } = res.data;

//       await AsyncStorage.setItem('access_token', access);
//       await AsyncStorage.setItem('refresh_token', refresh);

//       if (user.user_type === 'therapist') {
//         router.push('../therapist/dashboard');
//       } else {
//         router.push('../patient/dashboard');
//       }
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Login Failed', 'Please check your credentials and try again.');
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.wrapper}
//     >
//       <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//         <Text style={styles.title}>Welcome Back</Text>
//         <Text style={styles.subtitle}>Please log in to continue</Text>

//         <View style={styles.inputWrapper}>
//           <MaterialIcons name="email" size={20} color="#524f85" style={styles.icon} />
//           <TextInput
//             placeholder="Email"
//             placeholderTextColor="#999"
//             style={styles.input}
//             onChangeText={setEmail}
//             value={email}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//         </View>

//         <View style={styles.inputWrapper}>
//           <FontAwesome name="lock" size={20} color="#524f85" style={styles.icon} />
//           <TextInput
//             placeholder="Password"
//             placeholderTextColor="#999"
//             style={styles.input}
//             onChangeText={setPassword}
//             value={password}
//             secureTextEntry
//           />
//         </View>

//         <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//           <Text style={styles.loginButtonText}>Login</Text>
//         </TouchableOpacity>

//         <View style={styles.links}>
//           <TouchableOpacity onPress={() => router.push('./register')}>
//             <Text style={styles.linkText}>Don’t have an account? Register</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => router.push('./request-reset')}>
//             <Text style={styles.linkText}>Forgot Password?</Text>
//           </TouchableOpacity>

         
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   wrapper: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   container: {
//     padding: 24,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#524f85',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#888',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//     backgroundColor: '#f9f9f9',
//   },
//   input: {
//     flex: 1,
//     height: 48,
//     fontSize: 16,
//     color: '#333',
//   },
//   icon: {
//     marginRight: 8,
//   },
//   loginButton: {
//     backgroundColor: '#524f85',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   loginButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   links: {
//     marginTop: 30,
//     alignItems: 'center',
//   },
//   linkText: {
//     color: '#524f85',
//     fontSize: 14,
//     marginVertical: 5,
//   },
// });



import { BASE_URL } from '../utils/config';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Pressable,
} from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/authenticator/login/`, {
        email,
        password,
      });

      const { user, access, refresh } = res.data;

      const savedRole = await AsyncStorage.getItem('selected_role');
      if (savedRole!=user.user_type){
            Alert.alert('Wrong User Type', `This account is registered as a ${user.user_type}.`);
      return;
      }

      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);

      if (user.user_type === 'therapist') {
        router.push('../therapist/dashboard');
      } else {
        router.push('../patient/dashboard');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <View>
        <Pressable style={styles.backButton} onPress={()=>router.push('./splash')}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please log in to continue</Text>

        <View style={styles.inputWrapper}>
          <MaterialIcons name="email" size={20} color="#524f85" style={styles.icon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <FontAwesome name="lock" size={20} color="#524f85" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.links}>
          <TouchableOpacity onPress={() => router.push('./register')}>
            <Text style={styles.linkText}>Don’t have an account? Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('./request-reset')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('./verify-email')}>
            <Text style={styles.linkText}>Verify Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 24,
    justifyContent: 'center'
    
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#524f85',
    textAlign: 'center',
    marginBottom: 10,
    marginTop:250
    
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 8,
  },
  loginButton: {
    backgroundColor: '#524f85',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  links: {
    marginTop: 30,
    alignItems: 'center',
  },
  linkText: {
    color: '#524f85',
    fontSize: 14,
    marginVertical: 5,
  },
  backButton:{
    position: 'absolute',
  top: Platform.OS === 'android' ? 40 : 60,
  left: 20,
  zIndex: 10,
  }
});