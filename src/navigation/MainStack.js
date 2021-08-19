import React from 'react';
import {useSelector} from 'react-redux';
import {
  AboutUs,
  BrandProducts,
  BuyProduct,
  Cart,
  ContactUs,
  Delivery,
  Location,
  MyOrders,
  MyProfile,
  MyProfile2,
  Notifications,
  OrderDetail,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  SearchProductVendorItem,
  SendProduct,
  Settings,
  SuperMarket,
  SupermarketProductsCategory,
  TrackDetail,
  Tracking,
  Vendors,
  Vendors2,
} from '../Screens';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';

export default function (Stack) {
  const {appData} = useSelector((state) => state?.initBoot);

  return (
    <>
      <Stack.Screen
        name={navigationStrings.TAB_ROUTES}
        component={TabRoutes}
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
        name={navigationStrings.SUPERMARKET_PRODUCTS_CATEGORY}
        component={SupermarketProductsCategory}
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
        name={navigationStrings.SETTIGS}
        component={Settings}
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
        name={navigationStrings.BRANDDETAIL}
        component={BrandProducts}
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
        name={navigationStrings.CART}
        component={Cart}
        options={{headerShown: false}}
      />
    </>
  );
}
