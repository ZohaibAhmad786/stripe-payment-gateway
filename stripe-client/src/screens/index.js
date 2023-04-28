import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const RootScreen = ({navigation}) => {

    const [laoading,setLoading]=useState(true)

    
  return (
    <View style={{padding:20, backgroundColor:'#3A3335',flex:1}}>
      <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('custome-payment-element')}>
        <Text style={styles.text}>Custome Payment Element</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('google-pay')}>
        <Text style={styles.text}>{Platform.OS==='android'?"Google":"Apple"} Pay</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('card-element')}>
        <Text style={styles.text}>Card Element</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('custome-payment-element',{appearance:true})}>
        <Text style={styles.text}>Appearance API</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('address-element')}>
        <Text style={styles.text}>Address Element</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnContainer} onPress={()=>{}}>
        <Text style={styles.text}>Mobile Payment Element</Text>
      </TouchableOpacity>
    </View>
  )
}

export default RootScreen

const styles = StyleSheet.create({
    btnContainer: {
        height:50,
        marginVertical:20,
        borderRadius:12,
        backgroundColor:'#F0544F',
        justifyContent:'center',
        alignItems:'center',
    },
    text:{
        color: "white",
        fontSize:14
    }
})