import { useEffect } from 'react';
import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import actions from '../redux/actions';
import { printReciept } from '../BLEPrinter';

const ForegroundHandler = (props) => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("remote message foreground", remoteMessage)
      const { data, messageId, notification } = remoteMessage
      {
        Platform.OS == 'ios' ?
          PushNotificationIOS.addNotificationRequest({
            id: messageId,
            body: data?.message || '',
            title: data?.type || '',
            sound: notification.sound,
          })
          :
          PushNotification.localNotification({
            channelId: notification.android.channelId,
            id: messageId,
            body: data?.message || '',
            title: data?.type || '',
            soundName: notification.android.sound,
            vibrate: true,
            playSound: true
          })
      }
      printReciept()
      if (Platform.OS == 'android' && notification.android.sound == 'notification') {
        actions.isVendorNotification(true)
        const { data } = remoteMessage.data
        // printReciept(data)
      }
      if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
        actions.isVendorNotification(true)
      }

    });
    return unsubscribe;
  }, []);

  return null;
};

export default ForegroundHandler;