

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
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BASE_URL } from '../utils/config'; // adjust path as per your structure


export default function RequestResetScreen() {
  const [email, setEmail] = useState('');

  const handleResetRequest = async () => {
    try {
     await axios.post(`${BASE_URL}/api/authenticator/password-reset/`, {

        email,
      });
      Alert.alert('📧 Email Sent', 'Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error(err);
      Alert.alert('❌ Failed', 'Could not send password reset email.');
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* <Image
            source={{ uri: 'https://i.ibb.co/vm2HxNR/reset-password.png' }} // Change to your illustration if needed
            style={styles.illustration}
            resizeMode="contain"
          /> */}

          <Text style={styles.title}>Forgot Your Password?</Text>

          <Image
          style={styles.img}
          source={require('../../assets/images/Forgot.png')}
          resizeMode='contain'
          ></Image>
          <Text style={styles.subtitle}>
            Enter your email address and we will send you a link to reset your password.
          </Text>

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

          <TouchableOpacity style={styles.resetButton} onPress={handleResetRequest}>
            <Text style={styles.resetButtonText}>Send Reset Email</Text>
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
    padding:15
  },
  container: {
    paddingTop: 70,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: 250,
    height: 180,
    marginBottom: 20,
  },
  img:{
    width:300,
    height:500,
    
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#524f85',
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 17,
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
    fontSize: 17,
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
    fontSize: 20,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 24,
    color: '#524f85',
    fontSize: 16,
    textAlign: 'center',
  },
});
