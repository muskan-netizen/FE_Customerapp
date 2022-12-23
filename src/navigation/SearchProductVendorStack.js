import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {ProductList3, SearchProductVendorItem2} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={navigationStrings.SEARCH}
        component={SearchProductVendorItem2}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={ProductList3}
      />
    </Stack.Navigator>
  );
}
