import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { fetchPublishableKey } from '../../../helper';
import PaymentThroughCard from '../../../payments/PaymentThroughCard';

const StripPayment = () => {
    const [loading, setLoading] = useState(true);
    const [publishableKey, setPublishableKey] = useState("");

    React.useEffect(() => {
        (async function () {
            setLoading(true)
            const publishableKey = await fetchPublishableKey();
            setPublishableKey(publishableKey)
            setLoading(false)
        })();
    }, []);
    if (loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
        </View>
    } else {
        return <PaymentThroughCard publishableKey={publishableKey} />
    }
};

export default StripPayment;
