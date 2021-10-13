import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  BrandProducts,
  BuyProduct,
  ConfirmDetailsBuy,
  Delivery,
  Filter,
  Home,
  Location,
  OrderDetail,
  Payment,
  PaymentSuccess,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  SearchProductVendorItem,
  SendProduct,
  ShippingDetails,
  SuperMarket,
  TrackDetail,
  Tracking,
  VendorDetail,
  VendorDetail2,
  VendorDetail3,
  Vendors,
  Vendors2,
  Vendors3,
  SearchProductVendorItem2,
  BrandProducts2,
  ViewAllData,
  TaxiHomeScreen,
} from '../Screens';
import {shortCodes} from '../utils/constants/DynamicAppKeys';

import {verticalAnimation} from '../utils/utils';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const {appStyle, appData} = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={
          businessType === 4
            ? navigationStrings.TAXIHOMESCREEN
            : navigationStrings.HOME
        }
        component={businessType === 4 ? TaxiHomeScreen : Home}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.DELIVERY}
        component={Delivery}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SUPERMARKET}
        component={SuperMarket}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR}
        component={
          appStyle?.homePageLayout === 2
            ? Vendors2
            : appStyle?.homePageLayout === 3
            ? Vendors3
            : Vendors
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR_DETAIL}
        component={
          appStyle?.homePageLayout === 2
            ? VendorDetail2
            : appStyle?.homePageLayout === 3
            ? VendorDetail3
            : VendorDetail
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={
          appStyle?.homePageLayout === 2
            ? ProductList2
            : appStyle?.homePageLayout === 3
            ? ProductList3
            : ProductList
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.TRACKING}
        component={Tracking}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.TRACKDETAIL}
        component={TrackDetail}
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
        name={navigationStrings.CONFIRM_DETAILS_BUY}
        component={ConfirmDetailsBuy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={
          appStyle?.homePageLayout === 3
            ? SearchProductVendorItem2
            : SearchProductVendorItem
        }
        options={verticalAnimation}
      />

      <Stack.Screen
        name={navigationStrings.LOCATION}
        component={Location}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.FILTER}
        component={Filter}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={
          appStyle?.homePageLayout === 3 ? BrandProducts2 : BrandProducts
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYMENT}
        component={Payment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYMENT_SUCCESS}
        component={PaymentSuccess}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SHIPPING_DETAILS}
        component={ShippingDetails}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.VIEW_ALL_DATA}
        component={ViewAllData}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
