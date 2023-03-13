import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import RootScreen from './src/screens'
import GooglePaymentScreen from './src/screens/GooglePay'
import StripPayment from './src/screens/payment-gatways/stripe'
import PaymentSheetScreen from './src/screens/Paymentsheet'

const Stack = createNativeStackNavigator();
const App = () => {

  return (
    <View style={{ flex: 1 }}>
      
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="StripePayment" component={RootScreen} />
            <Stack.Screen name="custome-payment-element" component={PaymentSheetScreen} />
            <Stack.Screen name="google-pay" component={GooglePaymentScreen} />
            <Stack.Screen name="card-element" component={StripPayment} />
          </Stack.Navigator>
        </NavigationContainer>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})