import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  AboutUs,
  Account,
  Account2,
  Account3,
  AccountTemplateFour,
  AddMoney,
  AddNewCustomer,
  AddProduct,
  AllinonePyments,
  BrandProducts,
  BuyProduct,
  ChatRoom,
  ChatRoomForVendor,
  CMSLinks,
  ContactUs,
  CustomerEarningHistory,
  Delivery,
  Inventory,
  Location,
  Loyalty2,
  //Pyament Screens
  Mobbex,
  MyOrders,
  MyP2pPosts,
  MyProfile,
  MyProfile2,
  MyProfile3,
  Notifications,
  OrderDetail,
  P2pProductDetail,
  Payfast,
  Paylink,
  PickupOrderDetail,
  PrinterConnection,
  PrinterConnectionSunmi,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  RateOrder,
  ReplaceOrder,
  ReturnOrder,
  SalesExpenses,
  SearchProductVendorItem,
  SearchProductVendorItem2,
  SearchProductVendorItem3V2,
  SendProduct,
  SendRefferal,
  Settings,
  Subscriptions2,
  TipPaymentOptions,
  TrackDetail,
  Tracking,
  UdhaarLedger,
  Vendors,
  Vendors2,
  Wallet,
  WebLinks,
  WebPayment,
  WebviewScreen,
  Wishlist,
  Wishlist2,
  Yoco,
} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function ({navigation}) {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  const checkLayout = (inx) => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return Account2;
      case 3:
        return Account3;
      case 4:
        return AccountTemplateFour;
      case 5:
        return Account3;
      case 6:
        return Account3;
      case 8:
        return Account3;
      default:
        return Account;
    }
  };
  const checkProfileLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return MyProfile2;
      case 3:
        return MyProfile3;
      case 5:
        return MyProfile3;
      case 8:
        return MyProfile3;
      default:
        return MyProfile;
    }
  };

  const checkSearchProductVendorItemLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 3:
        return SearchProductVendorItem2;
      case 5:
        return SearchProductVendorItem2;
      case 6:
        return SearchProductVendorItem2;
      case 8:
        return SearchProductVendorItem3V2;
      default:
        return SearchProductVendorItem;
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        component={checkLayout()}
        name={navigationStrings.ACCOUNTS}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MY_PROFILE}
        component={checkProfileLayout()}
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
        name={navigationStrings.ATTACH_PRINTER}
        component={PrinterConnection}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ATTACH_PRINTER + 'sunmi'}
        component={PrinterConnectionSunmi}
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
        component={
          appStyle?.homePageLayout === 3 ||
          appStyle?.homePageLayout === 5 ||
          appStyle?.homePageLayout === 8
            ? Wishlist2
            : Wishlist
        }
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
        component={checkSearchProductVendorItemLayout()}
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
        component={appStyle?.homePageLayout === 2 ? Vendors2 : Vendors}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.DELIVERY}
        component={Delivery}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={appStyle?.homePageLayout === 2 ? ProductList2 : ProductList}
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
        name={navigationStrings.LOCATION}
        component={Location}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.TRACKORDER}
        component={MyOrders}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PICKUPORDERDETAIL}
        component={PickupOrderDetail}
        options={{headerShown: false, tabBarVisible: false}}
      />
      <Stack.Screen
        name={navigationStrings.WEBVIEWSCREEN}
        component={WebviewScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SUBSCRIPTION}
        component={Subscriptions2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.LOYALTY}
        component={Loyalty2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.RETURNORDER}
        component={ReturnOrder}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.TIP_PAYMENT_OPTIONS}
        component={TipPaymentOptions}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MOBBEX}
        component={Mobbex}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYFAST}
        component={Payfast}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.YOCO}
        component={Yoco}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PAYLINK}
        component={Paylink}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ALL_IN_ONE_PAYMENTS}
        component={AllinonePyments}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.INVENTORY}
        component={Inventory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.UDHAARLEDGER}
        component={UdhaarLedger}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SALES_EXPENSES}
        component={SalesExpenses}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADD_PRODUCT}
        component={AddProduct}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.ADD_NEW_CUSTOMER}
        component={AddNewCustomer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CUSTOMER_EARNING_HISTORY}
        component={CustomerEarningHistory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM}
        component={ChatRoom}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM_FOR_VENDOR}
        component={ChatRoomForVendor}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.REPLACE_ORDER}
        component={ReplaceOrder}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.P2P_PRODUCT_DETAIL}
        component={P2pProductDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.MY_POSTS}
        component={MyP2pPosts}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
