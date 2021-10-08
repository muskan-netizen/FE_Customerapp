import { useEffect } from 'react';
import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import actions from '../redux/actions';
import { printReciept, StartPrinting } from '../Screens/PrinterConnection/PrinteFunc';

// let arr = []
// let canEnablePrinter = true

const ForegroundHandler = (props) => {

  // const initPrinter = () => {
  //   canEnablePrinter = false

  //   printReciept(arr[0]).then(() => {
  //     arr.shift()
  //     setTimeout(() => {
  //       if(arr.length > 0){
  //         initPrinter()
  //       }else{
  //         canEnablePrinter = true
  //       }
  //     }, 2000);
  //   })
  // }

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

      if (Platform.OS == 'android' && notification.android.sound == 'notification') {
        actions.isVendorNotification(true)
        const { data } = remoteMessage.data
      
        // arr.push(data)

        // if (canEnablePrinter) {
        //   initPrinter()
        // }

        StartPrinting(JSON.parse(data))

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