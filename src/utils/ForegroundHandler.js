import notifee, {
  AndroidColor,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {Platform} from 'react-native';
import actions from '../redux/actions';
import {StartPrinting} from '../Screens/PrinterConnection/PrinteFunc';
import {redirectFromNotification} from './helperFunctions';

// let arr = []
// let canEnablePrinter = true

const ForegroundHandler = (props) => {
  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail);
          let clickActionUrl = detail?.notification?.data?.click_action || null;
          redirectFromNotification(clickActionUrl);
          break;
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('remote message foreground', remoteMessage);

      const {data, messageId, notification} = remoteMessage;

      /// Create a channel (required for Android)

      const channelId = await notifee.createChannel({
        id: notification?.android?.channelId || 'default',
        name: 'Default Channel',
        vibration: true,
        lightColor: AndroidColor.YELLOW,
        sound: 'customnotii',
      });

      if (Platform.OS == 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: messageId,
          body: data?.body || '',
          title: data?.title || '',
          sound: notification?.sound || '',
        });
      } else {
        let displayNotificationData = {};
        if (notification?.android?.imageUrl) {
          displayNotificationData = {
            title: data?.title || notification?.title || '',
            body: data?.body || notification?.body || '',
            android: {
              sound: notification?.android?.sound || 'customnotii',
              channelId,
              pressAction: {
                id: 'default',
              },
              style: {
                type: AndroidStyle.BIGPICTURE,
                picture: notification?.android?.imageUrl,
              },
            },
            data: {...data},
          };
        } else {
          displayNotificationData = {
            title: data?.title || notification?.title || '',
            body: data?.body || notification?.body || '',
            android: {
              sound: notification?.android?.sound || 'customnotii',
              channelId,
              pressAction: {
                id: 'default',
              },
            },
            data: {...data},
          };
        }

        await notifee.displayNotification(displayNotificationData);
      }

      // {
      //   Platform.OS == 'ios'
      //     ? PushNotificationIOS.addNotificationRequest({
      //         id: messageId,
      //         body: data?.body || '',
      //         title: data?.title || '',
      //         sound: notification.sound,
      //       })
      //     : PushNotification.localNotification({
      //         bigPictureUrl:
      //           'https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8=',
      //         channelId: notification.android.channelId,
      //         id: messageId,
      //         body: data?.message || '',
      //         title: data?.type || '',
      //         soundName: notification.android.sound,
      //         vibrate: true,
      //         playSound: true,
      //       });
      // }

      // soundName: notification?.title == "order Accepted" ? 'customnotii.mp3' : notification.android.sound,

      if (
        Platform.OS == 'android' &&
        notification.android.sound == 'notification'
      ) {
        actions.isVendorNotification(true);
        actions.refreshNotification(messageId);
        const {data} = remoteMessage.data;
        let _data = JSON.parse(data);
        console.log(
          'foreground notification listener checking data >>>>',
          _data,
        );
        console.log(
          'foreground notification listener checking data >>>>',
          _data.vendors[0].vendor.auto_accept_order == 1,
        );
        if (_data.vendors[0].vendor.auto_accept_order == 1) {
          StartPrinting(_data);
        }
      }

      // // function for custion notii beloww
      // if (Platform.OS == 'android' && notification.android.sound == 'customnotii.mp3') {
      //   actions.isVendorNotification(true)
      //   actions.refreshNotification(messageId);
      //   const { data } = remoteMessage.data
      //   let _data = JSON.parse(data)
      //   console.log('foreground notification listener checking data >>>>',_data)
      //   console.log('foreground notification listener checking data >>>>',_data.vendors[0].vendor.auto_accept_order == 1)
      //   if(_data.vendors[0].vendor.auto_accept_order == 1){
      //     StartPrinting(_data)
      //   }
      // }

      if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
        actions.isVendorNotification(true);
        actions.refreshNotification(messageId);
      }
    });
    return unsubscribe;
  }, []);

  return null;
};

export default ForegroundHandler;
