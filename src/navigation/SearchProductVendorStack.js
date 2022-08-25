import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {MyOrders, OrderDetail, ProductList3, SearchProductVendorItem2} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function ({navigation}) {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.SEARCH}
        component={SearchProductVendorItem2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={ProductList3}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
