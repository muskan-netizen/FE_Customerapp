import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  AllPaymentMethods,
  Cart,
  Cart2,
  Cart3,
  Offers,
  OrderDetail,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  VerifyAccount,
  WebPayment,
  Wishlist,
  Wishlist2,
  //Pyament Screens
  Mobbex,
  Payfast,
  Paylink,
  Yoco,
  AllinonePyments,
  Simplify,
  Square,
  Checkout,
  Paystack,
  ScrollableCategory,
  AuthorizeNet,
  FPX
} from '../Screens';
import OrderSuccess from '../Screens/OrderSuccess/OrderSuccess';
import KongaPay from '../Screens/PaymentGateways/KongaPay';
import Pagarme from '../Screens/PaymentGateways/Pagarme';
import { shortCodes } from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const { appData, appStyle } = useSelector((state) => state?.initBoot);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={navigationStrings.CART}
        component={Cart3}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.OFFERS}
        component={Offers}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.ALL_PAYMENT_METHODS}
        component={AllPaymentMethods}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.ORDERSUCESS}
        component={OrderSuccess}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.ORDER_DETAIL}
        component={OrderDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.WEBPAYMENTS}
        component={WebPayment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.WISHLIST}
        component={appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? Wishlist2 : Wishlist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={
          appStyle?.homePageLayout === 2
            ? ProductList2
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? ProductList3
              : ProductList
        }
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.MOBBEX}
        component={Mobbex}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYFAST}
        component={Payfast}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.YOCO}
        component={Yoco}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYLINK}
        component={Paylink}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.ALL_IN_ONE_PAYMENTS}
        component={AllinonePyments}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SIMPLIFY}
        component={Simplify}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SQUARE}
        component={Square}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAGARME}
        component={Pagarme}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.PAYSTACK}
        component={Paystack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.AuthorizeNet}
        component={AuthorizeNet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SCROLLABLE_CATEGORY}
        component={ScrollableCategory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.FPX}
        component={FPX}
        options={{ headerShown: false }}
      />
        <Stack.Screen
        name={navigationStrings.KONGOPAY}
        component={KongaPay}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
