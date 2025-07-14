// // app/auth/reset-confirm.tsx
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
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




import { useLocalSearchParams } from 'expo-router';

export default function ResetConfirmScreen() {
  const { token } = useLocalSearchParams(); // ← grabs ?token= from URL

  console.log("🔐 Token from URL:", token); // helpful for debugging

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = async () => {
    try {
      await axios.post('http://192.168.100.117:8000/api/authenticator/password-reset-confirm/', {
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
    <View style={{ padding: 20 }}>
      <Text>Reset Your Password</Text>
      <TextInput
        placeholder="New Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={{ borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        style={{ borderBottomWidth: 1, marginTop: 10 }}
      />
      <Button title="Reset Password" onPress={handleReset} />
    </View>
  );
}
