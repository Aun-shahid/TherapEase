
// app/auth/reset-confirm.tsx

import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, StatusBar, Platform } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../utils/config';

export default function ResetConfirmScreen() {
  const { token } = useLocalSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = async () => {
    try {
      await axios.post(`${BASE_URL}/api/authenticator/password-reset-confirm/`, {
        token,
        password,
        password_confirm: confirmPassword,
      });
      alert('✅ Password reset successful!');
      router.push('./login');
    } catch (err: any) {
      alert('⚠️ Error resetting password');
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Optional Therapy Illustration */}
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/4089/4089782.png', // soft therapy-style image
          }}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>Please choose a new secure password</Text>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#524f85" />
          <TextInput
            placeholder="New Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            placeholderTextColor="#aaa"
            style={styles.input}
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#524f85" />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholderTextColor="#aaa"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 40 : 80,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#524f85',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginVertical: 10,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 16,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#524f85',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});


