// app/auth/verify-email.tsx
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

export default function VerifyEmailScreen() {
  const [token, setToken] = useState('');

  const handleVerifyEmail = async () => {
    try {
      await axios.post('http://192.168.100.117:8000/api/authenticator/verify-email/', {
        token,
      });
      alert('✅ Email verified successfully!');
    } catch (err: any) {
      console.error(err);
      alert('❌ Email verification failed');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter your email verification token</Text>
      <TextInput
        placeholder="Verification Token"
        onChangeText={setToken}
        value={token}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <Button title="Verify Email" onPress={handleVerifyEmail} />
    </View>
  );
}
