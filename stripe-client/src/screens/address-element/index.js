import { AddressSheet, AddressSheetError, useStripe } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import PaymentScreen from '../../../components/PaymentScreen';
const API_URL = "http://192.168.18.54:3000"
const AddressElement = () => {
  const [activityLoader, setLoading] = useState(true);
  const [publishableKey, setPublishableKey] = useState("");
  const [addressDetails, setAddressDetails] = useState({});
  const [addressSheetVisible, setAddressSheetVisible] = useState(false);




  const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } =
    useStripe();
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState(null);


  // React.useEffect(() => {
  //   (async function () {//
  //     setLoading(true)
  //     const publishableKey = await fetchPublishableKey();
  //     setPublishableKey(publishableKey)
  //     setLoading(false)
  //   })();
  // }, []);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet-ui`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

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





  // console.log({addressSheetVisible})
  // if (activityLoader) {
  //   return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <ActivityIndicator />
  //   </View>
  // } else {
    return <PaymentScreen onInit={()=>initialisePaymentSheet()}>
      <View style={{ padding: 20 }}>
        <Button
          variant="primary"
          onPress={() => setAddressSheetVisible(true)}
          title="Open Address Sheet"
          accessibilityLabel="address-sheet"
        // loading={loading}
        />
        <AddressSheet
          appearance={{
            colors: {
              primary: '#000000',
              background: '#272822'
            }
          }}
          // defaultValues={{
          //   phone: '111-222-3333',
          //   address: {
          //     country: 'United States',
          //     city: 'San Francisco',
          //   },
          // }}
          additionalFields={{
            phoneNumber: 'required',
          }}
          // allowedCountries={['US', 'CA', 'GB']}
          primaryButtonTitle={'Use this address'}
          sheetTitle={'Shipping Address'}
          googlePlacesApiKey={'AIzaSyDtXRKiXESsyfQt3acJ8pWsc4Ypef5gNtE'}
          visible={addressSheetVisible}
          onSubmit={async (addressDetails) => {
            setAddressDetails(addressDetails)
            // Make sure to set `visible` back to false to dismiss the address element.
            setAddressSheetVisible(false);

            // Handle result and update your UI
          }}
          onError={(error) => {
            if (error.code === AddressSheetError.Failed) {
              Alert.alert('There was an error.', 'Check the logs for details.');
              console.log(error?.localizedMessage);
            }
            // Make sure to set `visible` back to false to dismiss the address element.
            setAddressSheetVisible(false);
          }}
        />
        {/* <CardField
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
                /> */}
        <View style={styles.row}>

        </View>
        <Button
          variant="primary"
          onPress={() => onPressBuy()}
          title="Pay"
          accessibilityLabel="Pay"
        // loading={loading}
        />
      </View>
    </PaymentScreen>
  }
// };

export default AddressElement;

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
