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
} from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function splash(){
    return(
        
        
        
    <View style={styles.container}>

        <Text style={styles.subheading}>Choose your role to continue</Text>
              <TouchableOpacity style={styles.button} onPress={async () => {
    await AsyncStorage.setItem('selected_role', 'therapist');
    router.push('./login');
  }}>
                <Text style={styles.textB}>Therapist</Text>
              </TouchableOpacity>

              <Text style={{fontSize:20, fontWeight:500}}>OR</Text>

              <TouchableOpacity style={styles.button} onPress={async () => {
    await AsyncStorage.setItem('selected_role', 'patient');
    router.push('./login');
  }}>
                <Text style={styles.textB}>Patient</Text>
              </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({

    container:{
       flex:1,
       justifyContent:"center",
       alignItems:"center",
       gap:10


    },
    button:{
        backgroundColor: '#524f85',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width:300
    },
    textB:{
        color: '#fff',
    fontSize: 23,
    fontWeight: '600',
    },
    subheading:{
        fontSize:30,
        marginBottom:70
    }
})