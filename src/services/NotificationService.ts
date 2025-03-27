import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import axios from 'axios';
import {BASE_URL} from '../config/base_url';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Bildirim izni verildi');
    getFCMToken();
  } else {
    console.log('Bildirim izni reddedildi');
  }
}

export async function getFCMToken() {
  try {
    const fcmToken = await AsyncStorage.getItem('fcmToken');

    if (!fcmToken) {
      const newToken = await messaging().getToken();
      if (newToken) {
        console.log('Yeni FCM Token:', newToken);
        await AsyncStorage.setItem('fcmToken', newToken);

        // Token'ı sunucuya kaydet
        await saveTokenToServer(newToken);
      }
    } else {
      console.log('Mevcut FCM Token:', fcmToken);
    }
  } catch (error) {
    console.log('FCM token alma hatası:', error);
  }
}

export async function saveTokenToServer(token: string) {
  try {
    const userToken = await AsyncStorage.getItem('token');
    if (!userToken) return;

    await axios.post(
      `${BASE_URL}/users/fcm-token`,
      {fcmToken: token},
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('FCM token sunucuya kaydedildi');
  } catch (error) {
    console.error('FCM token sunucuya kaydedilemedi:', error);
  }
}

export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Bildirim tıklandı (arka planda):', remoteMessage.notification);
    // Burada bildirime tıklandığında yapılacak işlemleri tanımlayabilirsiniz
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Bildirim tıklandı (uygulama kapalıyken):',
          remoteMessage.notification,
        );
        // Burada bildirime tıklandığında yapılacak işlemleri tanımlayabilirsiniz
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('Ön planda bildirim alındı:', remoteMessage);
    // Burada ön planda bildirim gösterme işlemlerini yapabilirsiniz
  });
};
