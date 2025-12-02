import 'react-native-gesture-handler';
import 'react-native-screens';

import messaging from '@react-native-firebase/messaging';
import { AppRegistry, LogBox, Platform } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import App from './App';
import { name as appName } from './app.json';
import actions from './src/redux/actions';
console.disableYellowBox = true;
LogBox.ignoreAllLogs();


// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const { data, notification } = remoteMessage;
  console.log("received in background messages", remoteMessage)

  if (
    Platform.OS == 'android' &&
    notification.android.sound == 'notification'
  ) {
    let _data = JSON.parse(data.data);
    if (_data.vendors[0].vendor.auto_accept_order == 1) {
    } else {
      actions.isVendorNotification(true);
    }
  }
});


AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
