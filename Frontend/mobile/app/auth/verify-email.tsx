// // app/auth/verify-email.tsx
// import { View, Text, TextInput, Button } from 'react-native';
// import { useState } from 'react';
// import axios from 'axios';
// import {router} from 'expo-router';

// export default function VerifyEmailScreen() {
//   const [token, setToken] = useState('');

//   const handleVerifyEmail = async () => {
//     try {
//       await axios.post('http://192.168.100.117:8000/api/authenticator/verify-email/', {
//         token,
//       });
//       alert('✅ Email verified successfully!');
//       router.push('./login');
//     } catch (err: any) {
//       console.error(err);
//       alert('❌ Email verification failed');
//       router.push('./register');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Enter your email verification token</Text>
//       <TextInput
//         placeholder="Verification Token"
//         onChangeText={setToken}
//         value={token}
//         style={{ borderBottomWidth: 1, marginVertical: 10 }}
//       />
//       <Button title="Verify Email" onPress={handleVerifyEmail} />
//     </View>
//   );
// }


import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function VerifyEmailScreen() {
  const [token, setToken] = useState('');

  const handleVerifyEmail = async () => {
    try {
      await axios.post('http://192.168.100.117:8000/api/authenticator/verify-email/', {
        token,
      });
      Alert.alert('✅ Verified', 'Email verified successfully!', [
        { text: 'Continue to Login', onPress: () => router.push('./login') },
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert('❌ Failed', 'Email verification failed.', [
        {  onPress: () => router.push('./register') },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* 🔙 Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('./register')}>
            <Ionicons name="arrow-back" size={24} color="#524f85" />
          </TouchableOpacity>

       

          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            Enter the verification token sent to your email address to activate your account.
          </Text>

          <View style={styles.inputWrapper}>
            <MaterialIcons name="vpn-key" size={20} color="#524f85" style={styles.icon} />
            <TextInput
              placeholder="Verification Token"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={setToken}
              value={token}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyEmail}>
            <Text style={styles.verifyButtonText}>Verify Email</Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Did not get the token? Check your spam folder or contact our support team.
          </Text>
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
    paddingTop: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
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
  verifyButton: {
    backgroundColor: '#524f85',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  note: {
    marginTop: 24,
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
