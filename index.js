/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
console.disableYellowBox = true;
import messaging from '@react-native-firebase/messaging';
// import { StartPrinting } from './src/Screens/PrinterConnection/PrinteFunc';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    const { data, notification } = remoteMessage

    if (Platform.OS == 'android' && notification.android.sound == 'notification') {
        // StartPrinting(JSON.parse(data))
      }
});

AppRegistry.registerComponent(appName, () => App);
