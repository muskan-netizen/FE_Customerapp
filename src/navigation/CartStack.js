import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {getBundleId} from 'react-native-device-info';
import {
  AllPaymentMethods,
  Cart,
  Cart2,
  Offers,
  OrderDetail,
  VerifyAccount,
  WebPayment,
} from '../Screens';
import OrderSuccess from '../Screens/OrderSuccess/OrderSuccess';
import {appIds} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.CART}
        // component={getBundleId() === appIds.capcorp ? Cart2 : Cart}
        component={Cart}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.CART2}
        component={Cart2}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.OFFERS}
        component={Offers}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.ALL_PAYMENT_METHODS}
        component={AllPaymentMethods}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDERSUCESS}
        component={OrderSuccess}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
