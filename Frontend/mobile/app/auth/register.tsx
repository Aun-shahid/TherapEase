


// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   StatusBar,
//   ScrollView,
// } from 'react-native';
// import { useState } from 'react';
// import axios from 'axios';
// import { router } from 'expo-router';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { RadioButton } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../utils/config';

// export default function RegisterScreen() {
//   const [form, setForm] = useState({
//     username: '',
//     email: '',
//     password: '',
//     password_confirm: '',
//     first_name: '',
//     last_name: '',
//     user_type: 'patient',
//     phone_number: '',
//     date_of_birth: '',
//     license_number: '',
//     specialization: '',
//   });

//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [date, setDate] = useState(new Date());

//   const handleChange = (key: string, value: string) => {
//     setForm({ ...form, [key]: value });
//   };

//   const handleDateChange = (_event: any, selectedDate: Date | undefined) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       const isoDate = selectedDate.toISOString().split('T')[0];
//       setDate(selectedDate);
//       handleChange('date_of_birth', isoDate);
//     }
//   };



  
// //   This sends a POST request to your Django backend with all the form data.
// // The backend should validate and create a user.
//   const handleRegister = async () => {
//     try {
//      await axios.post(`${BASE_URL}/api/authenticator/register/`, form, {

//         headers: { 'Content-Type': 'application/json' },
//       });

//       alert('✅ Registered! Please verify your email and then log in.');
//       router.push('./verify-email');
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
//     <ScrollView contentContainerStyle={styles.scrollContent}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Register</Text>

//         <Text style={styles.label}>Username</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your username"
//           onChangeText={(text) => handleChange('username', text)}
//           value={form.username}
//         />

//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your email"
//           keyboardType="email-address"
//           onChangeText={(text) => handleChange('email', text)}
//           value={form.email}
//         />

//         <Text style={styles.label}>Password</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter password"
//           secureTextEntry
//           onChangeText={(text) => handleChange('password', text)}
//           value={form.password}
//         />

//         <Text style={styles.label}>Confirm Password</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Re-enter password"
//           secureTextEntry
//           onChangeText={(text) => handleChange('password_confirm', text)}
//           value={form.password_confirm}
//         />

//         <Text style={styles.label}>First Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter first name"
//           onChangeText={(text) => handleChange('first_name', text)}
//           value={form.first_name}
//         />

//         <Text style={styles.label}>Last Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter last name"
//           onChangeText={(text) => handleChange('last_name', text)}
//           value={form.last_name}
//         />

//         <Text style={styles.label}>User Type</Text>
//         <View style={styles.radioGroup}>
//           <TouchableOpacity style={styles.radioItem} onPress={() => handleChange('user_type', 'patient')}>
//             <RadioButton
//               value="patient"
//               status={form.user_type === 'patient' ? 'checked' : 'unchecked'}
//               onPress={() => handleChange('user_type', 'patient')}
//               color="white"
//               uncheckedColor="white"
//             />
//             <Text style={styles.radioLabel}>Patient</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.radioItem} onPress={() => handleChange('user_type', 'therapist')}>
//             <RadioButton
//               value="therapist"
//               status={form.user_type === 'therapist' ? 'checked' : 'unchecked'}
//               onPress={() => handleChange('user_type', 'therapist')}
//               color="white"
//               uncheckedColor="white"
//             />
//             <Text style={styles.radioLabel}>Therapist</Text>
//           </TouchableOpacity>
//         </View>

//         {form.user_type === 'therapist' && (
//           <>
//             <Text style={styles.label}>License Number</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter license number"
//               onChangeText={(text) => handleChange('license_number', text)}
//               value={form.license_number}
//             />

//             <Text style={styles.label}>Specialization</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Depression, Anxiety"
//               onChangeText={(text) => handleChange('specialization', text)}
//               value={form.specialization}
//             />
//           </>
//         )}

//         <Text style={styles.label}>Phone Number</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="03xx-xxxxxxx"
//           keyboardType="phone-pad"
//           onChangeText={(text) => handleChange('phone_number', text)}
//           value={form.phone_number}
//         />

//         <Text style={styles.label}>Date of Birth</Text>
//         <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
//           <Text style={{ color: form.date_of_birth ? '#000' : '#999' }}>
//             {form.date_of_birth || 'YYYY-MM-DD'}
//           </Text>
//         </TouchableOpacity>

//         {showDatePicker && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={handleDateChange}
//             maximumDate={new Date()}
//           />
//         )}

//         <TouchableOpacity style={styles.button} onPress={handleRegister}>
//           <Text style={styles.buttonText}>Register</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => router.push('./login')}>
//           <Text style={styles.link}>Already have an account? Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => router.push('./verify-email')}>
//           <Text style={styles.link}>Verify Email</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#524f85',
//     paddingHorizontal: 30,
//     paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 40 : 80,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: 'white',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   label: {
//     color: 'white',
//     fontSize: 16,
//     marginBottom: 5,
//     marginTop: 10,
//   },
//   input: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 16,
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     gap: 20,
//   },
//   radioItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   radioLabel: {
//     color: 'white',
//     fontSize: 16,
//     marginLeft: 4,
//   },
//   button: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   buttonText: {
//     color: '#524f85',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   link: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 14,
//     marginTop: 12,
//     textDecorationLine: 'underline',
//   },
// });






//DATK MODE

// import { BASE_URL } from '../utils/config';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   StatusBar,
//   ScrollView,
//   Image,
//   KeyboardAvoidingView,
// } from 'react-native';
// import {  useState, useEffect } from 'react';
// import axios from 'axios';
// import { router } from 'expo-router';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { RadioButton } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function RegisterScreen() {

//   const [role, setRole] = useState<'therapist' | 'patient'>('patient');

//   const [form, setForm] = useState({
//     username: '',
//     email: '',
//     password: '',
//     password_confirm: '',
//     first_name: '',
//     last_name: '',
//     user_type: 'patient',
//     phone_number: '',
//     date_of_birth: '',
//     license_number: '',
//     specialization: '',
//   });

//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [date, setDate] = useState(new Date());

//   useEffect(() => {
//     const loadRole = async () => {
//       const savedRole = await AsyncStorage.getItem('selected_role');
//       if (savedRole === 'therapist' || savedRole === 'patient') {
//         setRole(savedRole);
//         setForm((prev) => ({ ...prev, user_type: savedRole }));
//       }
//     };
//     loadRole();
//   }, []);

//   const handleChange = (key: string, value: string) => {
//     setForm({ ...form, [key]: value });
//   };

//   const handleDateChange = (_event: any, selectedDate: Date | undefined) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       const isoDate = selectedDate.toISOString().split('T')[0];
//       setDate(selectedDate);
//       handleChange('date_of_birth', isoDate);
//     }
//   };



  
// //   This sends a POST request to your Django backend with all the form data.
// // The backend should validate and create a user.
//   const handleRegister = async () => {
//     try {
//       await axios.post('http://192.168.1.13:8000/api/authenticator/register/', form, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       alert('✅ Registered! Please verify your email and then log in.');
//       router.push('./verify-email');
//     } catch (err: any) {
//       if (err.response) {
//         console.log("❌ Validation Error:", err.response.data);
//         alert("⚠ " + JSON.stringify(err.response.data, null, 2));
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

//     <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           style={styles.wrapper}
//         >
    

    
//     <ScrollView contentContainerStyle={styles.scrollContent}>
//       <View style={styles.container}>
//         <View style={styles.circleContainer}>
//             <View style={styles.circle1} />
//             <View style={styles.circle2} />
//           </View>
//         <Image
//                   style={styles.img}
//                   source={require('../../assets/images/register.png')}
//                   resizeMode="contain"
//                 ></Image>
//         <Text style={styles.title}>
//           {role === 'therapist' ? 'SIGN UP AS THERAPIST' : 'SIGN UP AS A PATIENT'}
//         </Text>

//         <Text style={styles.label}>Username</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your username"
//           onChangeText={(text) => handleChange('username', text)}
//           value={form.username}
//         />

//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your email"
//           keyboardType="email-address"
//           onChangeText={(text) => handleChange('email', text)}
//           value={form.email}
//         />

//         <Text style={styles.label}>Password</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter password"
//           secureTextEntry
//           onChangeText={(text) => handleChange('password', text)}
//           value={form.password}
//         />

//         <Text style={styles.label}>Confirm Password</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Re-enter password"
//           secureTextEntry
//           onChangeText={(text) => handleChange('password_confirm', text)}
//           value={form.password_confirm}
//         />

//         <Text style={styles.label}>First Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter first name"
//           onChangeText={(text) => handleChange('first_name', text)}
//           value={form.first_name}
//         />

//         <Text style={styles.label}>Last Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter last name"
//           onChangeText={(text) => handleChange('last_name', text)}
//           value={form.last_name}
//         />




//         {/* <Text style={styles.label}>User Type</Text>
//         <View style={styles.radioGroup}>
//           <TouchableOpacity style={styles.radioItem} onPress={() => handleChange('user_type', 'patient')}>
//             <RadioButton
//               value="patient"
//               status={form.user_type === 'patient' ? 'checked' : 'unchecked'}
//               onPress={() => handleChange('user_type', 'patient')}
//               color="white"
//               uncheckedColor="white"
//             />
//             <Text style={styles.radioLabel}>Patient</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.radioItem} onPress={() => handleChange('user_type', 'therapist')}>
//             <RadioButton
//               value="therapist"
//               status={form.user_type === 'therapist' ? 'checked' : 'unchecked'}
//               onPress={() => handleChange('user_type', 'therapist')}
//               color="white"
//               uncheckedColor="white"
//             />
//             <Text style={styles.radioLabel}>Therapist</Text>
//           </TouchableOpacity>
//         </View>

//         {form.user_type === 'therapist' && (
//           <>
//             <Text style={styles.label}>License Number</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter license number"
//               onChangeText={(text) => handleChange('license_number', text)}
//               value={form.license_number}
//             />

//             <Text style={styles.label}>Specialization</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Depression, Anxiety"
//               onChangeText={(text) => handleChange('specialization', text)}
//               value={form.specialization}
//             />
//           </>
//         )} */}


//         {/* Conditionally render therapist-specific fields */}
//         {role === 'therapist' && (
//           <>
//             <Text style={styles.label}>License Number</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter license number"
//               onChangeText={(text) => handleChange('license_number', text)}
//               value={form.license_number}
//             />

//             <Text style={styles.label}>Specialization</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Depression, Anxiety"
//               onChangeText={(text) => handleChange('specialization', text)}
//               value={form.specialization}
//             />
//           </>
//         )}

//         <Text style={styles.label}>Phone Number</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="03xx-xxxxxxx"
//           keyboardType="phone-pad"
//           onChangeText={(text) => handleChange('phone_number', text)}
//           value={form.phone_number}
//         />

//         <Text style={styles.label}>Date of Birth</Text>
//         <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
//           <Text style={{ color: form.date_of_birth ? '#000' : '#999' }}>
//             {form.date_of_birth || 'YYYY-MM-DD'}
//           </Text>
//         </TouchableOpacity>

//         {showDatePicker && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={handleDateChange}
//             maximumDate={new Date()}
//           />
//         )}

//         <TouchableOpacity style={styles.button} onPress={handleRegister}>
//           <Text style={styles.buttonText}>Register</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => router.push('./login')}>
//           <Text style={styles.link}>Already have an account? Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => router.push('./verify-email')}>
//           <Text style={styles.link}>Verify Email</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   wrapper:{
//     flex: 1,
//      backgroundColor: '#524f85'
//   },
//   container: {
    
//     flexGrow:1,
//     justifyContent: 'center',
   
//     padding: 30,
//     //paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 40 : 80,
//   },
//   title: {
//     fontSize: 40,
//     fontWeight: '900',
//     color: 'white',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   label: {
//     color: 'white',
//     fontSize: 16,
//     marginBottom: 5,
//     marginTop: 10,
//   },
//   input: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 16,
//   },
//   img: {
//     width: 400,
//     height: 400,
    
//   },
//   radioGroup: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     gap: 20,
//   },
//   radioItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   radioLabel: {
//     color: 'white',
//     fontSize: 16,
//     marginLeft: 4,
//   },
//   button: {
//     backgroundColor: '#9B99B987',
//     padding: 15,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   link: {
//     color: 'white',
//     textAlign: 'center',
//     fontSize: 14,
//     marginTop: 12,
//     textDecorationLine: 'underline',
//   },
//   circleContainer: {
//     position: 'absolute',
//     top: -60,
//     right: -60,
//     zIndex: 1,
//   },

//   circle1: {
//     width: 120,
//     height: 120,
//     borderRadius: 100,
//     backgroundColor: '#9B99B987', // or any primary theme color
//     opacity: 0.8,
//     position: 'absolute',
//     top: 0,
//     marginTop:50,
//     right: 0,
//   },

//   circle2: {
//     width: 140,
//     height: 140,
//     borderRadius: 100,
//     backgroundColor: '#9B99B987', 
//     opacity: 0.6,
//     position: 'absolute',
//     top: 40,
//     right: 40,
//   }
// });






//LIGHT MODE

import { BASE_URL } from '../utils/config';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {  useState, useEffect } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {

  const [role, setRole] = useState<'therapist' | 'patient'>('patient');

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    user_type: 'patient',
    phone_number: '',
    date_of_birth: '',
    license_number: '',
    specialization: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const loadRole = async () => {
      const savedRole = await AsyncStorage.getItem('selected_role');
      if (savedRole === 'therapist' || savedRole === 'patient') {
        setRole(savedRole);
        setForm((prev) => ({ ...prev, user_type: savedRole }));
      }
    };
    loadRole();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleDateChange = (_event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      setDate(selectedDate);
      handleChange('date_of_birth', isoDate);
    }
  };



  
//   This sends a POST request to your Django backend with all the form data.
// The backend should validate and create a user.
  const handleRegister = async () => {
    try {
      await axios.post('http://192.168.1.15:8000/api/authenticator/register/', form, {
        headers: { 'Content-Type': 'application/json' },
      });

      alert('✅ Registered! Please verify your email and then log in.');
      router.push('./verify-email');
    } catch (err: any) {
      if (err.response) {
        console.log("❌ Validation Error:", err.response.data);
        alert("⚠ " + JSON.stringify(err.response.data, null, 2));
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

    <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.wrapper}
        >
    

    
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.circleContainer}>
            <View style={styles.circle1} />
            <View style={styles.circle2} />
          </View>
        <Image
                  style={styles.img}
                  source={require('../../assets/images/register.png')}
                  resizeMode="contain"
                ></Image>
        <Text style={styles.title}>
          {role === 'therapist' ? 'SIGN UP AS THERAPIST' : 'SIGN UP AS A PATIENT'}
        </Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          onChangeText={(text) => handleChange('username', text)}
          value={form.username}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          onChangeText={(text) => handleChange('email', text)}
          value={form.email}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          onChangeText={(text) => handleChange('password', text)}
          value={form.password}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          secureTextEntry
          onChangeText={(text) => handleChange('password_confirm', text)}
          value={form.password_confirm}
        />

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          onChangeText={(text) => handleChange('first_name', text)}
          value={form.first_name}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          onChangeText={(text) => handleChange('last_name', text)}
          value={form.last_name}
        />




        {/* <Text style={styles.label}>User Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity style={styles.radioItem} onPress={() => handleChange('user_type', 'patient')}>
            <RadioButton
              value="patient"
              status={form.user_type === 'patient' ? 'checked' : 'unchecked'}
              onPress={() => handleChange('user_type', 'patient')}
              color="white"
              uncheckedColor="white"
            />
            <Text style={styles.radioLabel}>Patient</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.radioItem} onPress={() => handleChange('user_type', 'therapist')}>
            <RadioButton
              value="therapist"
              status={form.user_type === 'therapist' ? 'checked' : 'unchecked'}
              onPress={() => handleChange('user_type', 'therapist')}
              color="white"
              uncheckedColor="white"
            />
            <Text style={styles.radioLabel}>Therapist</Text>
          </TouchableOpacity>
        </View>

        {form.user_type === 'therapist' && (
          <>
            <Text style={styles.label}>License Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter license number"
              onChangeText={(text) => handleChange('license_number', text)}
              value={form.license_number}
            />

            <Text style={styles.label}>Specialization</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Depression, Anxiety"
              onChangeText={(text) => handleChange('specialization', text)}
              value={form.specialization}
            />
          </>
        )} */}


        {/* Conditionally render therapist-specific fields */}
        {role === 'therapist' && (
          <>
            <Text style={styles.label}>License Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter license number"
              onChangeText={(text) => handleChange('license_number', text)}
              value={form.license_number}
            />

            <Text style={styles.label}>Specialization</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Depression, Anxiety"
              onChangeText={(text) => handleChange('specialization', text)}
              value={form.specialization}
            />
          </>
        )}

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="03xx-xxxxxxx"
          keyboardType="phone-pad"
          onChangeText={(text) => handleChange('phone_number', text)}
          value={form.phone_number}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: form.date_of_birth ? '#000' : '#999' }}>
            {form.date_of_birth || 'YYYY-MM-DD'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('./login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => router.push('./verify-email')}>
          <Text style={styles.link}>Verify Email</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  wrapper:{
    flex: 1,
     backgroundColor: '#ffffff'
  },
  container: {
    
    flexGrow:1,
    justifyContent: 'center',
   
    padding: 30,
    //paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 40 : 80,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#49467E',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    color: '#524f85',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontWeight:500
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 9,
    padding: 12,
    fontSize: 16,
    borderColor:'black',
    borderWidth:1
  },
  img: {
    width: 400,
    height: 400,
    
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#49467E',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#49467E',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  circleContainer: {
    position: 'absolute',
    top: -60,
    right: -60,
    zIndex: 1,
  },

  circle1: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: '#2E2C4E87', 
    opacity: 0.8,
    position: 'absolute',
    top: 0,
    marginTop:50,
    right: 0,
  },

  circle2: {
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: '#2E2C4E87', 
    opacity: 0.6,
    position: 'absolute',
    top: 40,
    right: 40,
  }
});