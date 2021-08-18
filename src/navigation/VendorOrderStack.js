import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  OrderDetail,
  ProductDetail,
  ProductDetail2,
  VendorList,
  VendorOrders,
} from '../Screens';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const {appData} = useSelector((state) => state?.initBoot);

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
        component={
          appData?.profile?.code === shortCodes.capcorp
            ? ProductDetail2
            : ProductDetail
        }
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
