// app/auth/request-reset.tsx
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

export default function RequestResetScreen() {
  const [email, setEmail] = useState('');

  const handleResetRequest = async () => {
    try {
      await axios.post('http://192.168.100.117:8000/api/authenticator/password-reset/', {
        email,
      });
      alert('📧 Password reset email sent! Check your inbox.');
    } catch (err: any) {
      console.error(err);
      alert('❌ Failed to send reset email');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter your email to reset password</Text>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <Button title="Send Reset Email" onPress={handleResetRequest} />
    </View>
  );
}
