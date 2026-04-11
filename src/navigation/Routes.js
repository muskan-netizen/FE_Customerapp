import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { useSelector } from 'react-redux';
import AppIntro from '../Screens/AppIntro';
import ProductListOnDemand from '../Screens/ProductList/ProductListOnDemand';
import ShortCode from '../Screens/ShortCode/ShortCode';
import AuthStack from './AuthStack';
import CartStack from './CartStack';
import CourierStack from './CourierStack';
import DrawerRoutes from './DrawerRoutes';
import { navigationRef } from './NavigationService';
import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';
import TabRoutesEcommerce from './TabRoutesEcommerce';
import TabRoutesP2pOnDemand from './TabRoutesP2pOnDemand';
import TabRoutesVendor from './TabRoutesVendor';
import TaxiAppStack from './TaxiAppStack';
import TaxiTabRoutes from './TaxiTabRoutes';
import TabRoutesVendorNewTemplate from './VendorApp/TabRoutesVendor';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const {userData, appSessionInfo} = useSelector(state => state?.auth || {});
  const {appStyle, appData} = useSelector(
    state => state?.initBoot || {},
  );
  const {dineInType} = useSelector(state => state?.home);
  const checkProductListLayout = () => {
    if(dineInType === 'ecommerce'){
      return require('../Screens/ProductList/EcomFashionList').default;
    }
    if(dineInType === 'grocery'){
      return require('../Screens/Home/GroceryProductList/GroceryProductList')
        .default;
    }
    switch (appStyle?.homePageLayout) {
      case 1:
        return require('../Screens/ProductList/ProductList').default;
      case 2:
        return require('../Screens/ProductList/ProductList2').default;
      case 10:
        return require('../Screens/ProductList/ProductListEcom').default;
      case 11:
       switch(dineInType){
        case 'on_demand':
         return ProductListOnDemand;
         default:
          return require('../Screens/ProductList/ProductList3').default;
       }
      default:
        return require('../Screens/ProductList/ProductList3').default;
    }
  };
  const checkSearchProductVendorItemLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return require('../Screens/SearchProductVendorItem/SearchProductVendorItem').default;
      case 8:
        return require('../Screens/SearchProductVendorItem/SearchProductVendorItem3(V2_API)').default;
      default:
        return require('../Screens/SearchProductVendorItem/SearchProductVendorItem3(V2_API)').default;
    }
  };
  const renderProductDetailsScreens = () => {
    if (dineInType === 'car_rental') {
      return require('../Screens/ProductDetail/ProductDetail3').default;
    }
    switch (appStyle?.homePageLayout) {
      case 2:
        return require('../Screens/ProductDetail/ProductDetail2').default;
      default:
        return require('../Screens/ProductDetail/ProductDetail').default;
    }
  };

  const businessType = appStyle?.homePageLayout;
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        {appSessionInfo === 'shortcode' || appSessionInfo === 'show_shortcode' ? (
          <Stack.Screen
            name={navigationStrings.SHORT_CODE}
            component={ShortCode}
          />
        ) : appSessionInfo === 'app_intro' ? (
          <Stack.Screen
            name={navigationStrings.APP_INTRO}
            component={AppIntro}
            options={{gestureEnabled: false}}
          />
        ) : appSessionInfo === 'guest_login' || !!userData?.auth_token ? (
          <React.Fragment>
            {businessType === 10 ? (
              <Stack.Screen
                name={navigationStrings.DRAWER_ROUTES}
                component={DrawerRoutes}
                options={{gestureEnabled: false}}
              />
            ) : (
              <Stack.Screen
                name={navigationStrings.TAB_ROUTES}
                component={
                  dineInType === 'pick_drop'
                    ? TaxiTabRoutes
                    : businessType === 8
                    ? TabRoutesP2pOnDemand
                    : businessType === 10
                    ? TabRoutesEcommerce
                    : TabRoutes
                }
                options={{gestureEnabled: false}}
              />
            )}
          </React.Fragment>
        ) : (
          AuthStack(Stack, appStyle, appData)
        )}

        {CourierStack(Stack)}

        {TaxiAppStack(Stack)}

        <Stack.Screen
          name={navigationStrings.CHAT_SCREEN}
          getComponent={() =>
            dineInType === 'p2p'
              ? require('../Screens/P2pOnDemnadBid/P2pChat/ChatScreen/ChatScreen')
                  .default
              : require('../Screens/ChatScreen/ChatScreen').default
          }
        />
        <Stack.Screen
          name={navigationStrings.CHAT_SCREEN_FOR_VENDOR}
          getComponent={() =>
            require('../Screens/ChatScreen/ChatScreenForVendor').default
          }
        />
        <Stack.Screen
          name={navigationStrings.CHAT_ROOM}
          getComponent={() =>
            dineInType === 8
              ? require('../Screens/P2pOnDemnadBid/P2pChat/ChatRoom/ChatRoom')
                  .default
              : require('../Screens/ChatRoom/ChatRoom').default
          }
        />
        <Stack.Screen
          name={navigationStrings.CHAT_ROOM_FOR_VENDOR}
          getComponent={() =>
            require('../Screens/ChatRoom/ChatRoomForVendor').default
          }
        />

        <Stack.Screen
          name={navigationStrings.TABROUTESVENDOR}
          component={TabRoutesVendor}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={navigationStrings.TABROUTESVENDORNEW}
          component={TabRoutesVendorNewTemplate}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name={navigationStrings.WISHLIST}
          getComponent={() =>
            dineInType === 'p2p'
              ? require('../Screens/P2pOnDemnadBid/P2pWishlist/P2pWishlist')
                  .default
              : appStyle?.homePageLayout === 3 ||
                appStyle?.homePageLayout === 5 ||
                appStyle?.homePageLayout === 8
              ? require('../Screens/Wishlist/Wishlist2').default
              : require('../Screens/Wishlist/Wishlist').default
          }
        />
        <Stack.Screen
          name={navigationStrings.P2P_PRODUCT_DETAIL}
          getComponent={() =>
            require(
              '../Screens/P2pOnDemnadBid/P2pOndemandProductDetail/P2pOndemandProductDetail'
            ).default
          }
        />
        <Stack.Screen
          name={navigationStrings.P2P_PRODUCTS}
          getComponent={() =>
            require('../Screens/P2pOnDemnadBid/P2pOndemandProducts/P2pOndemandProducts')
              .default
          }
        />
        <Stack.Screen
          name={navigationStrings.PAYMENT_SCREEN}
          getComponent={() =>
            require('../Screens/P2pOnDemnadBid/P2pPayments/P2pPayment').default
          }
        />
        <Stack.Screen
          name={navigationStrings.PRODUCT_LIST}
          getComponent={checkProductListLayout}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={navigationStrings.PRODUCTDETAIL}
          getComponent={renderProductDetailsScreens}
        />
        <Stack.Screen
          name={navigationStrings.DEVELOPER_MODE}
          getComponent={() =>
            require('../Screens/DeveloperMode/DeveloperMode').default
          }
        />
          <Stack.Screen
        name={navigationStrings.SEARCHPRODUCTOVENDOR}
        getComponent={checkSearchProductVendorItemLayout}
      />
      <Stack.Screen
        name={navigationStrings.VIEW_ALL_SEARCH_ITEM}
        getComponent={() =>
          require('../Screens/ViewAllSearchItems/ViewAllSearchItems').default
        }
      />
      <Stack.Screen
        name={navigationStrings.CART}
        component={CartStack}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
