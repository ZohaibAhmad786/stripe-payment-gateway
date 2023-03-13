import { PlatformPay, PlatformPayButton, StripeProvider, usePlatformPay } from '@stripe/stripe-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { fetchPublishableKey } from '../../../helper';
function GooglePaymentScreen() {
    const {
        isPlatformPaySupported,
        confirmPlatformPayPayment,
        createPlatformPayPaymentMethod
    } = usePlatformPay();

    const [loading, setLoading] = useState(true);
    const [publishingKey, setPublishingKey] = useState("");

    React.useEffect(() => {
        (async function () {
            setLoading(true)
            const publishableKey = await fetchPublishableKey();
            setPublishingKey(publishableKey)
            if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
                Alert.alert('Google Pay is not supported.');
                return;
            }
            setLoading(false)
        })();
    }, []);

    const fetchPaymentIntentClientSecret = async () => {
        // Fetch payment intent created on the server, see above
        const response = await fetch(`http://192.168.18.54:3000/create-payment-intent-google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_method_types: ['card'],
                amount: 12 * 278,
                currency: 'usd',
                metadata: {
                    productId: "price_1LexnRImE3PIl9xOXL6tvx9z"
                }
            }),
        });
        const { secret } = await response.json();

        return secret;
    };
    // if you confirm your payment on your server, you can use Google Pay to only collect a PaymentMethod instead of confirm a payment.
    // In order to do that call the createPlatformPayPaymentMethod method:
    const createPaymentMethod = async () => {
        const { error, paymentMethod } = await createPlatformPayPaymentMethod({
            googlePay: {
                amount: 12,
                currencyCode: 'USD',
                testEnv: true,
                merchantName: 'Test',
                merchantCountryCode: 'US',
            },
        });

        if (error) {
            Alert.alert(error.code, error.message);
            return;
        } else if (paymentMethod) {
            Alert.alert(
                'Success',
                `The payment method was created successfully. paymentMethodId: ${paymentMethod.id}`
            );
        }
    };


    const pay = async () => {
        const clientSecret = await fetchPaymentIntentClientSecret();

        const { error } = await confirmPlatformPayPayment(
            clientSecret,
            {
                googlePay: {
                    testEnv: true,
                    merchantName: 'My merchant name',
                    merchantCountryCode: 'US',
                    currencyCode: 'USD',
                    billingAddressConfig: {
                        format: PlatformPay.BillingAddressFormat.Full,
                        isPhoneNumberRequired: true,
                        isRequired: true,
                    },
                },
            }
        );

        if (error) {
            Alert.alert(error.code, error.message);
            // Update UI to prompt user to retry payment (and possibly another payment method)
            return;
        }
        Alert.alert('Success', 'The payment was confirmed successfully.');
    };
    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
        </View>
    } else {
        return (
            <StripeProvider publishableKey={publishingKey}>
                <View >
                    <PlatformPayButton
                        type={PlatformPay.ButtonType.Pay}
                        onPress={pay}
                        // onPress={createPaymentMethod}
                        style={{
                            width: '100%',
                            height: 50,
                        }}
                    />
                </View>
            </StripeProvider>


        );
    }
}

export default GooglePaymentScreen