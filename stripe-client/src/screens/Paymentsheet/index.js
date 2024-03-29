import React, { useState } from 'react';
import { Alert, StyleSheet, View, Platform } from 'react-native';
import {
  useStripe,
  Address,
  BillingDetails,
} from '@stripe/stripe-react-native';
import PaymentScreen from '../../../components/PaymentScreen';
import Button from '../../../components/Button';
const API_URL = "http://192.168.10.7:3000"

// The following code creates the appearance shown in the screenshot above
const customAppearance = {
 font: {
  scale: 1.15,
  //  family:
  //    Platform.OS === 'android' ? 'avenirnextregular' : 'AvenirNext-Regular',
 },
 shapes: {
   borderRadius: 12,
   borderWidth: 0.5,
 },
 primaryButton: {
   shapes: {
    borderRadius: 20,
   },
 },
 colors: {
   primary: '#fcfdff',
   background: '#ffffff',
   componentBackground: '#f3f8fa',
   componentBorder: '#f3f8fa',
   componentDivider: '#000000',
   primaryText: '#000000',
   secondaryText: '#000000',
   componentText: '#000000',
   placeholderText: '#73757b',
 },
};

export default function PaymentsUICustomScreen({ route }) {
  const { appearance } = route.params || { appearance: false }
  const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } =
    useStripe();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet-ui`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();
console.log({
  paymentIntent,
  ephemeralKey,
  customer,
})
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initialisePaymentSheet = async () => {
    setLoading(true);

    try {
      const { paymentIntent } = await fetchPaymentSheetParams();

      const address = {
        city: 'San Francisco',
        country: 'AT',
        line1: '510 Townsend St.',
        line2: '123 Street',
        postalCode: '94102',
        state: 'California',
      };
      const billingDetails = {
        name: 'Jane Doe',
        email: 'foo@bar.com',
        phone: '555-555-555',
        address: address,
      };

      const { error, paymentOption } = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customFlow: true,
        merchantDisplayName: 'Example Inc.',
        style: 'automatic',
        googlePay: { merchantCountryCode: 'US', testEnv: true },
        returnURL: 'stripe-example://stripe-redirect',
        defaultBillingDetails: billingDetails,
        appearance: appearance?customAppearance:{},
      });

      if (!error) {
        setPaymentSheetEnabled(true);
      } else {
        Alert.alert(`Error code: ${error.code}`, error.message);
      }
      if (paymentOption) {
        setPaymentMethod(paymentOption);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const choosePaymentOption = async () => {
    const { error, paymentOption } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else if (paymentOption) {
      setPaymentMethod({
        label: paymentOption.label,
        image: paymentOption.image,
      });
    } else {
      setPaymentMethod(null);
    }
  };

  const onPressBuy = async () => {
    setLoading(true);
    const { error } = await confirmPaymentSheetPayment();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'The payment was confirmed successfully!');
      setPaymentSheetEnabled(false);
    }
    setLoading(false);
  };

  return (
    // In your app’s checkout, make a network request to the backend and initialize PaymentSheet.
    // To reduce loading time, make this request before the Checkout button is tapped, e.g. when the screen is loaded.
    <PaymentScreen onInit={()=>initialisePaymentSheet()}>
      <View>
        <Button
          variant="primary"
          loading={loading}
          title={'Choose payment method'}
          disabled={!paymentSheetEnabled}
          onPress={choosePaymentOption}
        />
        <Button
          variant="primary"
          loading={loading}
          title={'Trigger timeout'}
          disabled={!paymentSheetEnabled}
          onPress={async () => {
            setLoading(true);
            const { error } = await presentPaymentSheet({ timeout: 5000 });
            if (error) {
              Alert.alert(`${error.code}`, error.message);
            }
            setLoading(false);
          }}
        />
      </View>

      <View style={styles.section}>
        <Button
          variant="primary"
          loading={loading}
          disabled={!paymentMethod || !paymentSheetEnabled}
          title={`Buy${paymentMethod ? ` with ${paymentMethod.label}` : ''}`}
          onPress={onPressBuy}
        />
      </View>
    </PaymentScreen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  paymentMethodTitle: {
    color: "red",
    fontWeight: 'bold',
  },
  image: {
    width: 26,
    height: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});
