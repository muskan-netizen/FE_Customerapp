//import liraries
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import ApplePay, { DetailsData, MethodData } from 'react-native-apple-payment';
import WebView from 'react-native-webview';

// create a component
const App = () => {


  useEffect(() => {
    SplashScreen.hide()
  }, [])


  const Method = {
    countryCode: 'US',
    currencyCode: 'USD',
    merchantIdentifier: 'merchant.saamanshop.com.customer',
    supportedNetworks: ['Visa', 'MasterCard', 'AmEx'],
  };

  const Options = {
    total: {
      label: 'Shoe-shop',
      amount: 100,
    },
  };

  const payment = new ApplePay(Method, Options);


  return (
    <View style={styles.container}>
      <Text>HIdf s</Text>
     <WebView
        source={{uri: 'https://api.skipcash.app/pay/1eb10755-4e70-4ef9-8c50-6db074ca104d'}}
        
        />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});

//make this component available to the app
export default App;
