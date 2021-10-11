/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
console.disableYellowBox = true;
import messaging from '@react-native-firebase/messaging';
import { Component } from 'react';
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});
class Index extends Component {
    render() {
        return (
            <App/>
        );
    }
}

export default Index;

AppRegistry.registerComponent(appName, () => App);
