import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {OrderDetail, ProductDetail, VendorList, VendorOrders} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.VENDOR_ORDER}
        component={VendorOrders}
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
