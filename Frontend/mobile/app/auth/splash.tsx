// 

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Dimensions
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';


const screenWidth = Dimensions.get('window').width;

export default function Splash() {
 
  

  return (
    <View style={styles.container}>
        
        <Text style={styles.subheading}>Continue as</Text>


        <TouchableOpacity style={styles.card}
          onPress={async () => {
            await AsyncStorage.setItem('selected_role', 'therapist');
            router.push('./login');
          }}>

          <Image
        source={require('../../assets/images/therap.jpg')} // Replace with your image
        style={styles.bgImage}
        resizeMode="contain"
      />
            <View style={styles.labelCont}>
            <Text style={styles.label}>Therapist</Text>
            </View>


        </TouchableOpacity>

        <TouchableOpacity style={styles.card}
        onPress={async()=>{await AsyncStorage.setItem('selected_role','patient');
          router.push('./login');
        }}>

          <Image
          source={require('../../assets/images/pat.png')}
          style={styles.bgImage}
          resizeMode='contain'
          ></Image>
          <View style={styles.labelCont}>
            <Text style={styles.label}>Patient</Text>
            </View>

        </TouchableOpacity>

      
      

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //justifyContent: 'center',
    alignItems: 'center',
    paddingTop:80
  },

  bgImage: {
    width:'100%',
    height:195,
    marginBottom:20,
    shadowColor: '#111',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    padding: 20,
    
   
    
  },

  card:{
    width: screenWidth *0.8,
     backgroundColor:"#F9F9F9",
    padding:20,
    marginBottom:30,
    elevation:9,
     shadowOffset: { width: 0, height: 3 },
     borderRadius:20,
     alignItems:'center',
     height:screenWidth *0.75,
     shadowColor:'#000',
     shadowOpacity:0.4

    
    

  },


  subheading: {
    fontSize: 39,
    fontWeight: '600',
    marginBottom: 45,
    color: '#4B4B4B',
    textShadowColor: '#00000040',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },

  labelCont:{
   backgroundColor:'#524f85',
   paddingVertical:10,
   paddingHorizontal:30,
   borderRadius:20,
   width:200,
   alignItems:'center'

  },

  label:{
    color:'white',
    fontSize:22,
    fontWeight:500

  }

  
});













{/* <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.subheading}>Choose your role to continue</Text>

        <TouchableOpacity
          style={styles.buttonT}
          onPress={async () => {
            await AsyncStorage.setItem('selected_role', 'therapist');
            router.push('./login');
          }}>
          <MaterialIcons name="psychology" size={24} color="white" />
          <Text style={styles.textT}>Therapist</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 20, fontWeight: '500', color: 'white' }}>OR</Text>

        <TouchableOpacity
          style={styles.buttonP}
          onPress={async () => {
            await AsyncStorage.setItem('selected_role', 'patient');
            router.push('./login');
          }}>
          <FontAwesome5 name="user-alt" size={24} color="#524f85" />
          <Text style={styles.textP}>Patient</Text>
        </TouchableOpacity>
      </Animated.View> */}