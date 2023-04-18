import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Addaddress,
  Addaddress2,
  BrandProducts,
  BrandProducts2,
  BuyProduct,
  CategoryBrands,
  ChatRoom,
  ChatRoomForVendor,
  ChatScreen,
  ConfirmDetailsBuy,
  Delivery,
  Filter,
  Home,
  HomeV2Api,
  LaundryAvailableVendors,
  Location,
  P2pProductDetail,
  P2pProducts,
  Payment,
  PaymentSuccess,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  ProductWithCategory,
  ScrollableCategory,
  SearchProductVendorItem,
  SearchProductVendorItem2,
  SearchProductVendorItem3V2,
  SendProduct,
  ShippingDetails,
  SpotdealProductAndSelectedProducts,
  SubcategoryVendor,
  Subscriptions2,
  SuperMarket,
  TaxiHome,
  TaxiHomeScreen,
  TrackDetail,
  Tracking,
  VendorDetail,
  VendorDetail2,
  VendorDetail3,
  Vendors,
  Vendors2,
  Vendors3,
  ViewAllData,
} from '../Screens';
import AddVehicleDetails from '../Screens/AddVehicleDetails/AddVehicleDetails';
import BidingDriversList from '../Screens/TaxiApp/BidingDriversList/BidingDriversList';

import { verticalAnimation } from '../utils/utils';
import navigationStrings from './navigationStrings';

const Stack = createNativeStackNavigator();

export default function () {
  const { appStyle, appData } = useSelector((state) => state?.initBoot);
  const { lastBidInfo } = useSelector((state) => state?.home);

  const businessType = appStyle?.homePageLayout;

  const rendervendorScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return Vendors;
      case 2:
        return Vendors2;
      default:
        return Vendors3;
    }
  };

  const renderVendorDetailsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return VendorDetail;
      case 2:
        return VendorDetail2;
      default:
        return VendorDetail3;
    }
  };

  const renderProductListScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return ProductList;
      case 2:
        return ProductList2;
      default:
        return ProductList3;
    }
  };

  const renderProductDetailsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return ProductDetail2;
      default:
        return ProductDetail;
    }
  };

  const renderBrandProductsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return BrandProducts;
      default:
        return BrandProducts2;
    }
  };

  const checkSearchProductVendorItemLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return SearchProductVendorItem;
      case 8:
        return SearchProductVendorItem3V2;
      case 10:
        return SearchProductVendorItem3V2;
      default:
        return SearchProductVendorItem2;
    }
  };


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      {!!lastBidInfo && <Stack.Screen
        name={navigationStrings.BIDINGDRIVERSLIST}
        component={BidingDriversList}
        options={{ headerShown: false }}
      />}
      <Stack.Screen
        name={
          businessType === 4
            ? navigationStrings.TAXIHOMESCREEN
            : navigationStrings.HOME
        }
        component={businessType === 4
          ? TaxiHomeScreen
          : businessType === 8 || businessType === 10
            ? HomeV2Api
            : Home}
      />
      <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        // component={Addaddress}
        component={Addaddress2}
      />

      <Stack.Screen name={navigationStrings.DELIVERY} component={Delivery} />
      <Stack.Screen
        name={navigationStrings.SUPERMARKET}
        component={SuperMarket}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR}
        component={rendervendorScreen()}
      />
      <Stack.Screen
        name={navigationStrings.VENDOR_DETAIL}
        component={renderVendorDetailsScreens()}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={renderProductListScreen()}
      />

      <Stack.Screen
        name={navigationStrings.ADD_VEHICLE_DETAILS}
        component={AddVehicleDetails}
      />

      <Stack.Screen name={navigationStrings.TRACKING} component={Tracking} />

      <Stack.Screen
        name={navigationStrings.TRACKDETAIL}
        component={TrackDetail}
      />
      <Stack.Screen
        name={navigationStrings.SEND_PRODUCT}
        component={SendProduct}
      />
      <Stack.Screen
        name={navigationStrings.BUY_PRODUCT}
        component={BuyProduct}
      />
      <Stack.Screen
        name={navigationStrings.CONFIRM_DETAILS_BUY}
        component={ConfirmDetailsBuy}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={renderProductDetailsScreens()}
      />
      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={checkSearchProductVendorItemLayout()}
        options={verticalAnimation}
      />

      <Stack.Screen name={navigationStrings.LOCATION} component={Location} />

      <Stack.Screen name={navigationStrings.FILTER} component={Filter} />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={renderBrandProductsScreens()}
      />
      <Stack.Screen name={navigationStrings.PAYMENT} component={Payment} />
      <Stack.Screen
        name={navigationStrings.PAYMENT_SUCCESS}
        component={PaymentSuccess}
      />

      <Stack.Screen
        name={navigationStrings.SHIPPING_DETAILS}
        component={ShippingDetails}
      />

      <Stack.Screen
        name={navigationStrings.VIEW_ALL_DATA}
        component={ViewAllData}
      />
      <Stack.Screen
        name={navigationStrings.CATEGORY_BRANDS}
        component={CategoryBrands}
      />
      <Stack.Screen
        name={navigationStrings.CHAT_SCREEN}
        component={ChatScreen}
        options={{ gestureEnabled: true }}
      />
      <Stack.Screen
        name={navigationStrings.SCROLLABLE_CATEGORY}
        component={ScrollableCategory}
      />
      <Stack.Screen
        name={navigationStrings.LAUNDRY_AVAILABLE_VENDORS}
        component={LaundryAvailableVendors}
      />
      <Stack.Screen name={navigationStrings.CHAT_ROOM} component={ChatRoom} />
      <Stack.Screen
        name={navigationStrings.CHAT_ROOM_FOR_VENDOR}
        component={ChatRoomForVendor}
      />
      <Stack.Screen
        name={navigationStrings.SUBSCRIPTION}
        component={Subscriptions2}
      />
      <Stack.Screen
        name={navigationStrings.SUBCATEGORY_VENDORS}
        component={SubcategoryVendor}
      />
      <Stack.Screen
        name={navigationStrings.P2P_PRODUCTS}
        component={P2pProducts}
      />
      <Stack.Screen
        name={navigationStrings.P2P_PRODUCT_DETAIL}
        component={P2pProductDetail}
      />

      <Stack.Screen
        name={navigationStrings.SPOTDEALPRODUCTSANDSELECTEDPRODUCTS}
        component={SpotdealProductAndSelectedProducts}
      />

    </Stack.Navigator>
  );
}
