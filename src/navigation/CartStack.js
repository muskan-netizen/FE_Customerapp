import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
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
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.CART}
        component={appStyle?.homePageLayout === 2 ? Cart2 : Cart}
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
