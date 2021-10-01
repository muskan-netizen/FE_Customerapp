import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import { getUserData } from './utils';
import * as NavigationService from '../navigation/NavigationService';
import navigationStrings from '../navigation/navigationStrings';
import { Platform } from 'react-native';
import actions from '../redux/actions';
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let checkToken = await AsyncStorage.getItem('fcmToken');
  console.log('the old token', checkToken);
  if (!checkToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (!!fcmToken) {
        console.log('fcme token generated', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('error in fcmToken', error);
      // alert(error?.message)
    }
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    const { notification } = remoteMessage
    console.log('Notification caused app to open from background state:', notification);
    if (notification?.sound == 'notification.wav') {
      actions.isVendorNotification(true)
    }
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        const { notification } = remoteMessage
        console.log('Notification caused app to open from quit state:',remoteMessage.notification);
        if (notification?.sound == 'notification.wav') {
          actions.isVendorNotification(true)
        }
      }
    });

}
