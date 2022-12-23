import React from 'react';
import {useSelector} from 'react-redux';
import {
  AboutUs,
  BrandProducts,
  BuyProduct,
  Cart,
  ChatRoom,
  ChatRoomForVendor,
  ChatScreen,
  ChatScreenForVendor,
  ContactUs,
  Delivery,
  Location,
  MyOrders,
  MyProfile,
  MyProfile2,
  MyProfile3,
  Notifications,
  OrderDetail,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  ProductWithCategory,
  SearchProductVendorItem,
  SearchProductVendorItem2,
  SearchProductVendorItem3V2,
  SendProduct,
  Settings,
  SuperMarket,
  SupermarketProductsCategory,
  TrackDetail,
  Tracking,
  Vendors,
  Vendors2,
} from '../Screens';
import navigationStrings from './navigationStrings';
import TaxiAppStack from './TaxiAppStack';
import TaxiTabRoutes from './TaxiTabRoutes';

export default function (Stack) {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  const checkProductListLayout = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return ProductList2;

      case 3:
        return ProductList3;

      case 5:
        return ProductList3;

      case 8:
        return ProductList3;

      default:
        return ProductList;
    }
  };

  const checkProductWithCategoryLayout = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return ProductList2;

      case 3:
        return ProductWithCategory;

      case 5:
        return ProductWithCategory;

      case 8:
        return ProductWithCategory;

      default:
        return ProductList;
    }
  };

  const checkMyProfileLayout = () => {
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
    <>
      <Stack.Screen
        name={navigationStrings.TAXITABROUTES}
        component={TaxiTabRoutes}
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
        component={appStyle?.homePageLayout === 2 ? Vendors2 : Vendors}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.SUPERMARKET_PRODUCTS_CATEGORY}
        component={SupermarketProductsCategory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={checkProductListLayout()}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.PRODUCTWITHCATEGORY}
        component={checkProductWithCategoryLayout()}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name={navigationStrings.MY_PROFILE}
        component={checkMyProfileLayout()}
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
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
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
        component={checkSearchProductVendorItemLayout()}
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
      <Stack.Screen
        name={navigationStrings.CHAT_SCREEN}
        component={ChatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_SCREEN_FOR_VENDOR}
        component={ChatScreenForVendor}
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
      {TaxiAppStack(Stack)}
    </>
  );
}
