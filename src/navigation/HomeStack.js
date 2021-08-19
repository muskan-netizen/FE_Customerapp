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
  SearchProductVendorItem,
  SendProduct,
  ShippingDetails,
  SuperMarket,
  TrackDetail,
  Tracking,
  VendorDetail,
  VendorDetail2,
  Vendors,
  Vendors2,
} from '../Screens';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';
import TopTabRoutes from './TopTabRoutes';

const Stack = createStackNavigator();
export default function () {
  const {appStyle, appData} = useSelector((state) => state?.initBoot);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={
          appStyle?.homePageLayout === 3
            ? navigationStrings.TOP_TAB_ROUTES
            : navigationStrings.HOME
        }
        component={appStyle?.homePageLayout === 3 ? TopTabRoutes : Home}
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
          appData?.profile?.code === shortCodes.capcorp ? Vendors2 : Vendors
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR_DETAIL}
        component={
          appData?.profile?.code === shortCodes.capcorp
            ? VendorDetail2
            : VendorDetail
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={
          appData?.profile?.code === shortCodes.capcorp
            ? ProductList2
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
          appData?.profile?.code === shortCodes.capcorp
            ? ProductDetail2
            : ProductDetail
        }
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={SearchProductVendorItem}
        options={{headerShown: false}}
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
        component={BrandProducts}
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
    </Stack.Navigator>
  );
}
