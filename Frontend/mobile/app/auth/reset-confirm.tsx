// // app/auth/reset-confirm.tsx
// import { View, Text, TextInput, Button } from 'react-native';
// import { useState } from 'react';
// import axios from 'axios';
// import { router } from 'expo-router';
// export default function ResetConfirmScreen() {
//   const [token, setToken] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleConfirmReset = async () => {
//     if (password !== confirmPassword) {
//       return alert('⚠️ Passwords do not match');
//     }

//     try {
//       await axios.post('http://192.168.100.117:8000/api/authenticator/password-reset-confirm/', {
//         token,
//         password,
//         password_confirm: confirmPassword,
//       });
//       alert('✅ Password reset successful. You can now log in.');
//     } catch (err: any) {
//       console.error(err);
//       alert('❌ Password reset failed');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Reset Your Password</Text>
//       <TextInput
//         placeholder="Reset Token"
//         onChangeText={setToken}
//         value={token}
//         style={{ borderBottomWidth: 1, marginVertical: 5 }}
//       />
//       <TextInput
//         placeholder="New Password"
//         onChangeText={setPassword}
//         value={password}
//         secureTextEntry
//         style={{ borderBottomWidth: 1, marginVertical: 5 }}
//       />
//       <TextInput
//         placeholder="Confirm New Password"
//         onChangeText={setConfirmPassword}
//         value={confirmPassword}
//         secureTextEntry
//         style={{ borderBottomWidth: 1, marginVertical: 5 }}
//       />
//       <Button title="Confirm Password Reset" onPress={handleConfirmReset} />
//     </View>
//   );
// }




// import { useLocalSearchParams } from 'expo-router';

// export default function ResetConfirmScreen() {
//   const { token } = useLocalSearchParams(); // ← grabs ?token= from URL

//   console.log("🔐 Token from URL:", token); // helpful for debugging

//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleReset = async () => {
//     try {
//       await axios.post('http://192.168.100.117:8000/api/authenticator/password-reset-confirm/', {
//         token,
//         password,
//         password_confirm: confirmPassword,
//       });
//       alert('✅ Password reset successful!');
//       router.push('./login');
//     } catch (err: any) {
//       alert('⚠️ Error resetting password');
//       console.log(err.response?.data || err.message);
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Reset Your Password</Text>
//       <TextInput
//         placeholder="New Password"
//         secureTextEntry
//         onChangeText={setPassword}
//         value={password}
//         style={{ borderBottomWidth: 1 }}
//       />
//       <TextInput
//         placeholder="Confirm Password"
//         secureTextEntry
//         onChangeText={setConfirmPassword}
//         value={confirmPassword}
//         style={{ borderBottomWidth: 1, marginTop: 10 }}
//       />
//       <Button title="Reset Password" onPress={handleReset} />
//     </View>
//   );
// }



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
  Image,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function ResetConfirmScreen() {
  const { token } = useLocalSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match');
      return;
    }

    try {
      await axios.post('http://192.168.100.117:8000/api/authenticator/password-reset-confirm/', {
        token,
        password,
        password_confirm: confirmPassword,
      });
      Alert.alert('✅ Success', 'Password reset successfully!', [
        { text: 'Login Now', onPress: () => router.push('./login') },
      ]);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert('❌ Error', 'Failed to reset password. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
         

          <Text style={styles.title}>Set a New Password</Text>
          <Text style={styles.subtitle}>
            Enter and confirm your new password below.
          </Text>

          <View style={styles.inputWrapper}>
            <FontAwesome name="lock" size={20} color="#524f85" style={styles.icon} />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <View style={styles.inputWrapper}>
            <FontAwesome name="lock" size={20} color="#524f85" style={styles.icon} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('./login')}>
            <Text style={styles.linkText}>← Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingTop: 40,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 250,
    height: 180,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#524f85',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
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
    width: '100%',
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#524f85',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 24,
    color: '#524f85',
    fontSize: 14,
    textAlign: 'center',
  },
});
