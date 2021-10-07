/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
console.disableYellowBox = true;
import messaging from '@react-native-firebase/messaging';
import { printReciept } from './src/BLEPrinter';
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    printReciept({})
});

AppRegistry.registerComponent(appName, () => App);
