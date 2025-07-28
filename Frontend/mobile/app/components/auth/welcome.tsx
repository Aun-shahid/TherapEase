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

export default function Welcome() {



    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row'}}>
            <Image
                source={require('../../../assets/images/brain.png')}
                style={styles.logo}
                resizeMode="contain"
            ></Image>
            <Text style={{fontSize:38, fontWeight:'800',color:'#49467E',marginTop:21}}>MindScribe</Text>
            </View>
            <Image
                source={require('../../../assets/images/welcomeD.png')}
                style={styles.bgImage}
                resizeMode="cover"
            ></Image>

          <TouchableOpacity style={styles.btn} onPress={()=>{router.push('./splash')}}>
            <Text style={styles.btnlabel}>Get Started</Text>
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
        paddingTop: 80
    },
    logo:{
      width:85,
      height:95
    },
    bgImage: {
        width: '100%',
        height: '70%',
        marginBottom:20,
        shadowColor: '#111',
        shadowOpacity: 0.15,
        shadowRadius: 4,
        padding: 20,
    },
    btn:{
        width:400,
        backgroundColor:'#524f85',
        
        borderRadius:50,
        paddingVertical:12,
        paddingHorizontal:10,
       // padding:9,
        alignContent:'center',
        alignItems:'center'
    },
    btnlabel:{
        color:'white',
        fontSize:27,
        fontWeight:400,
        
    }
})