import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const RootScreen = ({navigation}) => {

    const [laoading,setLoading]=useState(true)

    
  return (
    <View style={{padding:20}}>
      <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('custome-payment-element')}>
        <Text style={styles.text}>Custome Payment Element</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('google-pay')}>
        <Text style={styles.text}>Google Pay</Text>
      </TouchableOpacity>
    
      <TouchableOpacity style={styles.btnContainer} onPress={()=>navigation.navigate('card-element')}>
        <Text style={styles.text}>Card Element</Text>
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
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center',
    },
    text:{
        color: "white",
        fontSize:14
    }
})