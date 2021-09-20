import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Addaddress, HomeScreenTaxi, PaymentOptions} from '../Screens';
import VerifyAccountSecond from '../Screens/VerifyAccountSecond/VerifyAccount';
import navigationStrings from './navigationStrings';

export default function (Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.HOMESCREENTAXI}
        component={HomeScreenTaxi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        component={Addaddress}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYMENT_OPTIONS}
        component={PaymentOptions}
        options={{headerShown: false}}
      />
    </>
  );
}
