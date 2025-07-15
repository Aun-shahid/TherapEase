


// app/auth/verify-email.tsx
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import { BASE_URL } from '../utils/config';
import { MaterialIcons } from '@expo/vector-icons';

export default function VerifyEmailScreen() {
  const [token, setToken] = useState('');

  const handleVerifyEmail = async () => {
    try {
      await axios.post(`${BASE_URL}/api/authenticator/verify-email/`, { token });
      alert('✅ Email verified successfully!');
      router.push('./login');
    } catch (err: any) {
      console.error(err);
      alert('❌ Email verification failed');
      router.push('./register');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Verify Your Email</Text>

          <Text style={styles.subtitle}>
            Enter the verification token sent to your email. This helps us ensure your identity.
          </Text>

          <View style={styles.inputWrapper}>
            <MaterialIcons name="vpn-key" size={22} color="#524f85" style={styles.icon} />
            <TextInput
              placeholder="Verification Token"
              placeholderTextColor="#999"
              onChangeText={setToken}
              value={token}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button title="Verify Email" color="#524f85" onPress={handleVerifyEmail} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 60, // Spacing from top to avoid notch
    paddingBottom: 20,
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
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 30,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
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
  buttonWrapper: {
    marginTop: 10,
  },
});
