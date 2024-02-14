
import { CardField, StripeProvider, useConfirmPayment } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';


export default function PaymentThroughCard({publishableKey}) {
  const [email, setEmail] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [cardInfo, setCardInfo] = useState(null);
  const [canPay, setCanPay] = useState(true);

  const { confirmPayment, loading } = useConfirmPayment();

  console.log({cardInfo})

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`http://192.168.10.7:3000/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'usd',
        amount: 100,
      }),
    });

    // items: ['id-1'],
    // request_three_d_secure: 'any',42424
    const { secret } = await response.json();
    console.log({ CLIENT: secret })
    return secret;
  };

  const handlePayPress = async () => {
    // 1. fetch Intent Client Secret from backend
    const clientSecret = await fetchPaymentIntentClientSecret()
    // 2. Gather customer billing information (ex. email)
    const billingDetails = {
      email: 'email@stripe.com',
      phone: '+48888000888',
      address: {
        city: 'Houston',
        country: 'US',
        line1: '1459  Circle Drive',
        line2: 'Texas',
        postalCode: '77063',
      },
    }; // mocked data for tests
    setCanPay(false);
    // 3. Confirm payment with card details
    // The rest will be done automatically using webhooks
    const { error, paymentIntent } = await confirmPayment(
      clientSecret,
      {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails,
        },
      },
      {
        setupFutureUsage: saveCard ? 'OffSession' : undefined,
      }
    );
    

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log('Payment confirmation error', error.message);
    } else if (paymentIntent) {
      Alert.alert(
        'Success',
        `The payment was confirmed successfully! currency: ${paymentIntent.currency}`
      );
      console.log('Success from promise', paymentIntent);
    }
    setCanPay(true);
  };

  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={{padding:20}}>
      <TextInput
        autoCapitalize="none"
        placeholder="E-mail"
        keyboardType="email-address"
        onChange={(value) => setEmail(value.nativeEvent.text)}
        style={styles.input}
      />
      <CardField
        postalCodeEnabled={false}
        autofocus
        placeholders={{
          number: '4242 4242 4242 4242',
          postalCode: '12345',
          cvc: 'CVC',
          expiration: 'MM|YY',
        }}
        onCardChange={(cardDetails) => {
          console.log('cardDetails', cardDetails);
          setCardInfo(cardDetails.complete)
        }}
        onFocus={(focusedField) => {
          // console.log('focusField', focusedField);
        }}
        cardStyle={inputStyles}
        style={styles.cardField}
      />
      <View style={styles.row}>
        <Switch
          onValueChange={(value) => setSaveCard(value)}
          value={saveCard}
        />
        <Text style={styles.text}>Save card during payment</Text>
      </View>
      <Button
        variant="primary"
        disabled={!canPay}
        onPress={() => handlePayPress()}
        title="Pay"
        accessibilityLabel="Pay"
        loading={loading}
      />
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    marginLeft: 12,
  },
  input: {
    height: 44,
    //   borderBottomColor: ,
    borderBottomWidth: 1.5,
  },
});

const inputStyles = {
  borderWidth: 1,
  backgroundColor: '#FFFFFF',
  borderColor: '#000000',
  borderRadius: 8,
  fontSize: 14,
  fontFamily: 'Macondo-Regular',
  placeholderColor: '#A020F0',
  textColor: '#0000ff',
};
