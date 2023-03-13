import { Alert } from 'react-native';
const API_URL = "http://192.168.18.54:3000"

export async function fetchPublishableKey() {
  try {
    const response = await fetch(`${API_URL}/config`);

    const { publishableKey } = await response.json();
    return publishableKey
  } catch (e) {
    console.warn('Unable to fetch publishable key. Is your server running?');
    Alert.alert(
      'Error',
      'Unable to fetch publishable key. Is your server running?'
    );
    return null;
  }
}
