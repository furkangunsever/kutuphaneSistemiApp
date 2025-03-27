/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// Arka plan mesaj işleyicisini tanımlayın
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Arka planda mesaj alındı:', remoteMessage);
  // Burada arka planda gelen mesajları işleyebilirsiniz
});

AppRegistry.registerComponent(appName, () => App);
