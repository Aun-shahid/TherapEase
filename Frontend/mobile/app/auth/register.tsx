








// import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
// import { useState } from 'react';
// import axios from 'axios';
// import { router } from 'expo-router';

// export default function RegisterScreen() {
//   const [form, setForm] = useState({
//     username: '',
//     email: '',
//     password: '',
//     password_confirm: '',
//     first_name: '',
//     last_name: '',
//     user_type: 'patient', // or 'therapist'
//     phone_number: '',
//     date_of_birth: '',
//   });

//   const handleChange = (key: string, value: string) => {
//     setForm({ ...form, [key]: value });
//   };

//   const handleRegister = async () => {
//     try {
//       await axios.post('http://192.168.100.117:8000/api/authenticator/register/', form, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       alert('✅ Registered! Please verify your email.');
//       router.push('./login');
//     } catch (err: any) {
//       if (err.response) {
//         console.log("❌ Validation Error:", err.response.data);
//         alert("⚠️ " + JSON.stringify(err.response.data, null, 2));
//       } else if (err.request) {
//         console.log("❌ No response from server:", err.request);
//         alert("No response from server");
//       } else {
//         console.log("❌ Unknown error:", err.message);
//         alert("Unknown error: " + err.message);
//       }
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Register</Text>
//       {Object.keys(form).map((key) => (
//         <TextInput
//           key={key}
//           placeholder={key}
//           onChangeText={(text) => handleChange(key, text)}
//           value={(form as any)[key]}
//           style={{ borderBottomWidth: 1, marginVertical: 5 }}
//         />
//       ))}
//       <Button title="Register" onPress={handleRegister} />
//       <TouchableOpacity onPress={() => router.push('./login')}>
//         <Text style={{ marginTop: 10, color: 'blue' }}>Already have an account? Login</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => router.push('./verify-email')}>
//         <Text style={{ marginTop: 10, color: 'blue' }}>Verify Email</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }



// app/auth/register.tsx
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';

import registerStyles from '@/assets/styles/registerStyles';



import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    user_type: 'patient', // or 'therapist'
    phone_number: '',
    date_of_birth: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

 const handleRegister = async () => {
  try {
    await axios.post('http://192.168.100.117:8000/api/authenticator/register/', form, {
      headers: { 'Content-Type': 'application/json' },
    });

    alert('✅ Registered! Please verify your email and then log in.');
    router.push('./login'); // 👈 Go to login after register
  } catch (err: any) {
    if (err.response) {
      console.log("❌ Validation Error:", err.response.data);
      alert("⚠️ " + JSON.stringify(err.response.data, null, 2));
    } else if (err.request) {
      console.log("❌ No response from server:", err.request);
      alert("No response from server");
    } else {
      console.log("❌ Unknown error:", err.message);
      alert("Unknown error: " + err.message);
    }
  }
};


  return (
 
    <View style={registerStyles.container}>
  <Text>Register</Text>
  
  {Object.keys(form).map((key) => (
    <TextInput
      key={key}
      placeholder={key}
      onChangeText={(text) => handleChange(key, text)}
      value={(form as any)[key]}
      style={registerStyles.input}
    />
  ))}
  
  <Button title="Register" onPress={handleRegister} />

  <TouchableOpacity onPress={() => router.push('./login')}>
    <Text style={registerStyles.link}>Already have an account? Login</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.push('./verify-email')}>
    <Text style={registerStyles.link}>Verify Email</Text>
  </TouchableOpacity>
</View>

  );
}
