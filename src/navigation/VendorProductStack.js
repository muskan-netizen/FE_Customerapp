import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {getBundleId} from 'react-native-device-info';
import {
  OrderDetail,
  ProductDetail,
  ProductDetail2,
  VendorList,
  VendorProducts,
} from '../Screens';
import {appIds} from '../utils/constants/DynamicAppKeys';
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
        component={
          getBundleId() === appIds.capcorp ? ProductDetail2 : ProductDetail
        }
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
