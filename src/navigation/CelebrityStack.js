import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {getBundleId} from 'react-native-device-info';
import {
  Celebrity,
  CelebrityProduct,
  SearchProductVendorItem,
  Filter,
  ProductDetail,
  BrandProducts,
  SendProduct,
  BuyProduct,
  Vendors,
  Delivery,
  ProductList,
  Vendors2,
  ProductList2,
  ProductDetail2,
} from '../Screens';
import {appIds} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.CELEBRITY}
        component={Celebrity}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CELEBRITYDETAIL}
        component={CelebrityProduct}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={SearchProductVendorItem}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.FILTER}
        component={Filter}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          getBundleId() === appIds.capcorp ? ProductDetail2 : ProductDetail
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={BrandProducts}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SEND_PRODUCT}
        component={SendProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.BUY_PRODUCT}
        component={BuyProduct}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.VENDOR}
        component={getBundleId() === appIds.capcorp ? Vendors2 : Vendors}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.DELIVERY}
        component={Delivery}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={
          getBundleId() === appIds.capcorp ? ProductList2 : ProductList
        }
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
