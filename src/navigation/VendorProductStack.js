import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {OrderDetail, ProductDetail, VendorList, VendorProducts} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.VENDOR_PRODUCT}
        component={VendorProducts}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDORLIST}
        component={VendorList}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={ProductDetail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
