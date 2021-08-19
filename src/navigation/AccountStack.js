import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  AboutUs,
  Account,
  Account2,
  AddMoney,
  BrandProducts,
  BuyProduct,
  CMSLinks,
  ContactUs,
  Delivery,
  Loyalty,
  MyOrders,
  MyProfile,
  MyProfile2,
  Notifications,
  OrderDetail,
  PickupOrderDetail,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  RateOrder,
  SearchProductVendorItem,
  SendProduct,
  SendRefferal,
  Settings,
  Subscriptions,
  TrackDetail,
  Tracking,
  Vendors,
  Vendors2,
  Wallet,
  WebLinks,
  WebPayment,
  WebviewScreen,
  Wishlist,
  ReturnOrder,
} from '../Screens';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const {appData} = useSelector((state) => state?.initBoot);
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={
          appData?.profile?.code === shortCodes.capcorp ? Account2 : Account
        }
        name={navigationStrings.ACCOUNTS}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MY_PROFILE}
        component={
          appData?.profile?.code === shortCodes.capcorp ? MyProfile2 : MyProfile
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.MY_ORDERS}
        component={MyOrders}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.NOTIFICATION}
        component={Notifications}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ABOUT_US}
        component={AboutUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CONTACT_US}
        component={ContactUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SETTIGS}
        component={Settings}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.WALLET}
        component={Wallet}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADD_MONEY}
        component={AddMoney}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.WISHLIST}
        component={Wishlist}
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
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={SearchProductVendorItem}
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
        component={
          appData?.profile?.code === shortCodes.capcorp ? Vendors2 : Vendors
        }
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
          appData?.profile?.code === shortCodes.capcorp
            ? ProductList2
            : ProductList
        }
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.RATEORDER}
        component={RateOrder}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.SENDREFFERAL}
        component={SendRefferal}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.CMSLINKS}
        component={CMSLinks}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.WEBLINKS}
        component={WebLinks}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPORDERDETAIL}
        component={PickupOrderDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.TRACKORDER}
        component={MyOrders}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.WEBVIEWSCREEN}
        component={WebviewScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SUBSCRIPTION}
        component={Subscriptions}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LOYALTY}
        component={Loyalty}
        options={{headerShown: false}}
      />
        <Stack.Screen
        name={navigationStrings.RETURNORDER}
        component={ReturnOrder}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
