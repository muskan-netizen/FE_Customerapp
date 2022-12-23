import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  BrandProducts,
  Brands,
  BuyProduct,
  Delivery,
  Filter,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductWithCategory,
  SearchProductVendorItem,
  SearchProductVendorItem2,
  SendProduct,
  Vendors,
  Vendors2,
  Brands2,
  BrandProducts2,
  ProductList3,
  SearchProductVendorItem3V2,
} from '../Screens';

import {shortCodes} from '../utils/constants/DynamicAppKeys';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);
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
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        component={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? Brands2
            : Brands
        }
        name={navigationStrings.BRANDS}
      />
      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? BrandProducts2
            : BrandProducts
        }
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
      />
      <Stack.Screen name={navigationStrings.FILTER} component={Filter} />

      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={checkSearchProductVendorItemLayout()}
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
        name={navigationStrings.VENDOR}
        component={appStyle?.homePageLayout === 2 ? Vendors2 : Vendors}
      />

      <Stack.Screen name={navigationStrings.DELIVERY} component={Delivery} />

      <Stack.Screen
        name={navigationStrings.PRODUCT_LIST}
        component={
          appStyle?.homePageLayout === 2
            ? ProductList2
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? ProductList3
            : ProductList
        }
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTWITHCATEGORY}
        component={
          appStyle?.homePageLayout === 2
            ? ProductList2
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? ProductWithCategory
            : ProductList
        }
      />
    </Stack.Navigator>
  );
}
