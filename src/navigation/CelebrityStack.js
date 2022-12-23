import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  BrandProducts,
  BuyProduct,
  Celebrity,
  Celebrity2,
  CelebrityProduct,
  CelebrityProduct2,
  Delivery,
  Filter,
  ProductDetail,
  ProductDetail2,
  ProductList,
  ProductList2,
  ProductList3,
  ProductWithCategory,
  SearchProductVendorItem,
  SearchProductVendorItem2,
  SendProduct,
  Vendors,
  Vendors2,
} from '../Screens';
import navigationStrings from './navigationStrings';

const Stack = createStackNavigator();
export default function () {
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  const checkProductListLayout = () => {
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
        name={navigationStrings.CELEBRITY}
        component={
          appStyle?.homePageLayout === 3 ||
          appStyle?.homePageLayout === 5 ||
          appStyle?.homePageLayout === 8
            ? Celebrity2
            : Celebrity
        }
      />
      <Stack.Screen
        name={navigationStrings.CELEBRITYDETAIL}
        component={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? CelebrityProduct2
            : CelebrityProduct
        }
      />

      <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        component={
          appStyle?.homePageLayout === 3 ||
          appStyle?.homePageLayout === 5 ||
          appStyle?.homePageLayout === 8
            ? SearchProductVendorItem2
            : SearchProductVendorItem
        }
      />

      <Stack.Screen name={navigationStrings.FILTER} component={Filter} />

      <Stack.Screen
        name={navigationStrings.PRODUCTDETAIL}
        component={
          appStyle?.homePageLayout === 2 ? ProductDetail2 : ProductDetail
        }
      />

      <Stack.Screen
        name={navigationStrings.BRANDDETAIL}
        component={BrandProducts}
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
        component={checkProductListLayout()}
      />
      <Stack.Screen
        name={navigationStrings.PRODUCTWITHCATEGORY}
        component={checkProductWithCategoryLayout()}
      />
    </Stack.Navigator>
  );
}
