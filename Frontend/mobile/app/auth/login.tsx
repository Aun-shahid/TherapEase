
// app/auth/login.tsx
// import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
// import { useState } from 'react';
// import axios from 'axios';
// import { router } from 'expo-router';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post('http://192.168.100.117:8000/api/authenticator/login/', {
//         email,
//         password,
//       });

//       const { user } = res.data;
//       const userType = user.user_type;

//       if (userType === 'therapist') {
//         router.push('../therapist/dashboard');
//       } else {
//         router.push('../patient/dashboard');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Login failed');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Login</Text>
//       <TextInput
//         placeholder="Email"
//         onChangeText={setEmail}
//         value={email}
//         style={{ borderBottomWidth: 1 }}
//       />
//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         onChangeText={setPassword}
//         value={password}
//         style={{ borderBottomWidth: 1, marginTop: 10 }}
//       />
//       <Button title="Login" onPress={handleLogin} />

//       <TouchableOpacity onPress={() => router.push('./register')}>
//         <Text style={{ marginTop: 10, color: 'blue' }}> Dont have an account? Register</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push('./request-reset')}>
//         <Text style={{ marginTop: 10, color: 'blue' }}>Forgot Password?</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push('./verify-email')}>
//         <Text style={{ marginTop: 10, color: 'blue' }}>Verify Email</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }



// app/auth/login.tsx
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://192.168.100.117:8000/api/authenticator/login/', {
        email,
        password,
      });

      const { user, access, refresh } = res.data;

      // ✅ Store tokens for later use (auto-login, API headers, refresh)
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);

      // ✅ Navigate based on user type
      const userType = user.user_type;
      if (userType === 'therapist') {
        router.push('../therapist/dashboard');
      } else {
        router.push('../patient/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={{ borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={{ borderBottomWidth: 1, marginTop: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => router.push('./register')}>
        <Text style={{ marginTop: 10, color: 'blue' }}>Dont have an account? Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('./request-reset')}>
        <Text style={{ marginTop: 10, color: 'blue' }}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('./verify-email')}>
        <Text style={{ marginTop: 10, color: 'blue' }}>Verify Email</Text>
      </TouchableOpacity>
    </View>
  );
}
