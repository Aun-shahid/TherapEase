// app/auth/refresh-token.tsx
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import axios from 'axios';

export default function RefreshTokenScreen() {
  const [refreshToken, setRefreshToken] = useState('');
  const [newAccessToken, setNewAccessToken] = useState('');

  const handleTokenRefresh = async () => {
    try {
      const res = await axios.post('http://192.168.100.117:8000/api/authenticator/token/refresh/', {
        refresh: refreshToken,
      });
      setNewAccessToken(res.data.access);
      alert('✅ Token refreshed!');
    } catch (err: any) {
      console.error(err);
      alert('❌ Failed to refresh token');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter your refresh token</Text>
      <TextInput
        placeholder="Refresh Token"
        onChangeText={setRefreshToken}
        value={refreshToken}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <Button title="Refresh Access Token" onPress={handleTokenRefresh} />
      {newAccessToken ? (
        <Text selectable style={{ marginTop: 20 }}>New Access Token: {newAccessToken}</Text>
      ) : null}
    </View>
  );
}
