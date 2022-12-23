import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  BrandProducts,
  BrandProducts2,
  BuyProduct,
  CategoryBrands,
  ChatRoom,
  ChatScreen,
  ConfirmDetailsBuy,
  Delivery,
  Filter,
  Home,
  LaundryAvailableVendors,
  Location,
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
  SendProduct,
  ShippingDetails,
  SuperMarket,
  TrackDetail,
  Tracking,
  VendorDetail,
  VendorDetail2,
  VendorDetail3,
  Vendors2,
  Vendors3,
  ViewAllData,
  TaxiHomeScreen,
  Subscriptions2,
  SubcategoryVendor,
  Addaddress,
  ChatRoomForVendor,
  ListDetail,
  P2pProducts,
  P2pProductDetail,
  SearchProductVendorItem3V2,
  HomeV2Api,
} from '../Screens';
import AddVehicleDetails from '../Screens/AddVehicleDetails/AddVehicleDetails';

import {verticalAnimation} from '../utils/utils';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();

export default function () {
  const {appStyle, appData} = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;

  const rendervendorScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return Vendors2;
      case 3:
        return Vendors3;
      case 5:
        return Vendors3;
      case 6:
        return Vendors3;
      default:
        return VendorDetail;
    }
  };

  const renderVendorDetailsScreens = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return VendorDetail2;
      case 3:
        return VendorDetail3;
      case 5:
        return VendorDetail3;
      case 6:
        return VendorDetail3;

      default:
        return VendorDetail;
    }
  };

  const renderProductListScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 2:
        return ProductList2;
      case 3:
        return ProductList3;
      case 5:
        return ProductList3;
      case 6:
        return ProductList3;
      default:
        return ProductList;
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
      case 3:
        return BrandProducts2;
      case 5:
        return BrandProducts2;
      case 6:
        return BrandProducts2;
      default:
        return BrandProducts;
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

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={
          businessType === 4
            ? navigationStrings.TAXIHOMESCREEN
            : navigationStrings.HOME
        }
        component={
          businessType === 4
            ? TaxiHomeScreen
            : businessType === 8
            ? HomeV2Api
            : Home
        }
      />
      <Stack.Screen
        name={navigationStrings.ADDADDRESS}
        component={Addaddress}
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
        name={navigationStrings.PRODUCTWITHCATEGORY}
        component={checkProductWithCategoryLayout()}
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
        name={navigationStrings.CART_SCREEN}
        component={ChatScreen}
        options={{gestureEnabled: true}}
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
    </Stack.Navigator>
  );
}
