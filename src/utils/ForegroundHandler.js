import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import actions from '../redux/actions';

const ForegroundHandler = (props) => {
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            console.log("foreground push notification", remoteMessage)
            const { notification, data } = remoteMessage
            if (Platform.OS == 'android') {
                PushNotification.localNotification({
                    channelId: notification.android.channelId,
                    message: 'sdfdf',
                    title: 'dfdf',
                    playSound: true,
                    soundName: notification.android.sound,
                });
                return
            }
            PushNotificationIOS.addNotificationRequest({
                id: 'dfdfd',
                title: notification?.title,
                sound: notification?.sound,
            });
            if (notification?.sound == 'notification.wav') {
                actions.isVendorNotification(true)
            }
            return
        });

        return unsubscribe;
    }, []);

    return null;
};

export default ForegroundHandler;