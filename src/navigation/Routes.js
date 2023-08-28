import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { useSelector } from 'react-redux';
import {
  ChatRoom,
  ChatRoomForVendor,
  ChatScreen,
  ChatScreenForVendor,
  P2pChatRoom,
  P2pChatScreen,
  ProductList,
  ProductList2,
  ProductList3,
  ProductListEcom,
  ProductListOnDemand,
  ProductDetail2,
  ProductDetail,
  SearchProductVendorItem,
  SearchProductVendorItem3V2
} from '../Screens';
import AppIntro from '../Screens/AppIntro';
import ShortCode from '../Screens/ShortCode/ShortCode';
import AuthStack from './AuthStack';
import CourierStack from './CourierStack';
import DrawerRoutes from './DrawerRoutes';
import { navigationRef } from './NavigationService';
import TabRoutesVendor from './TabRoutesVendor';
import TaxiAppStack from './TaxiAppStack';
import TabRoutesVendorNewTemplate from './VendorApp/TabRoutesVendor';
import navigationStrings from './navigationStrings';
import TabRoutesP2pOnDemand from './TabRoutesP2pOnDemand';
import TabRoutes from './TabRoutes';
import TaxiTabRoutes from './TaxiTabRoutes';
import TabRoutesP2p from './TabRoutesP2p';
import { verticalAnimation } from '../utils/utils';


const Stack = createNativeStackNavigator();


export default function Routes() {
  const { userData, appSessionInfo } = useSelector((state) => state?.auth || {});
  const { appStyle, themeColors, appData } = useSelector((state) => state?.initBoot || {});
  const businessType = appStyle?.homePageLayout;


  const renderProductListScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 1: return ProductList;
      case 2: return ProductList2;
      case 10: return ProductListEcom;
      case 11: return ProductListOnDemand;
      default: return ProductList3;
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

  const checkSearchProductVendorItemLayout = (layout) => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return SearchProductVendorItem;
      default:
        return SearchProductVendorItem3V2;
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {appSessionInfo == 'shortcode' ||
          appSessionInfo == 'show_shortcode' ? (

          <Stack.Screen
            name={navigationStrings.SHORT_CODE}
            component={ShortCode}
          />

        ) : appSessionInfo == 'app_intro' ? (
          <Stack.Screen
            name={navigationStrings.APP_INTRO}
            component={AppIntro}
            options={{ gestureEnabled: false }}
          />
        ) : appSessionInfo == 'guest_login' || !!userData?.auth_token ? (
          <React.Fragment>
            {
              businessType === 10 ? <Stack.Screen
                name={navigationStrings.DRAWER_ROUTES}
                component={DrawerRoutes}
                options={{ gestureEnabled: false }}
              /> : <Stack.Screen
                name={navigationStrings.TAB_ROUTES}
                component={
                  !!appData?.profile?.preferences?.is_rental_weekly_monthly_price ? TabRoutesP2pOnDemand :
                    businessType === 4
                      ? TaxiTabRoutes
                      : businessType === 8
                        ? TabRoutesP2p
                        : businessType === 10
                          ? TabRoutesEcommerce
                          : TabRoutes
                }
                options={{ gestureEnabled: false }}
              />
            }</React.Fragment>



        ) : (
          AuthStack(Stack, appStyle, appData)
        )}

        {CourierStack(Stack)}

        {TaxiAppStack(Stack)}

        <Stack.Screen
          name={navigationStrings.CHAT_SCREEN}
          component={!!appData?.profile?.preferences?.is_rental_weekly_monthly_price ? P2pChatScreen : ChatScreen}
        />
        <Stack.Screen
          name={navigationStrings.CHAT_SCREEN_FOR_VENDOR}
          component={ChatScreenForVendor}
        />
        <Stack.Screen
          name={navigationStrings.CHAT_ROOM}
          component={!!appData?.profile?.preferences?.is_rental_weekly_monthly_price ? P2pChatRoom : ChatRoom}
        />
        <Stack.Screen
          name={navigationStrings.CHAT_ROOM_FOR_VENDOR}
          component={ChatRoomForVendor}
        />

        <Stack.Screen
          name={navigationStrings.TABROUTESVENDOR}
          component={TabRoutesVendor}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name={navigationStrings.TABROUTESVENDORNEW}
          component={TabRoutesVendorNewTemplate}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name={navigationStrings.PRODUCT_LIST}
          component={renderProductListScreen()}
          options={{ gestureEnabled: false }}
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


      </Stack.Navigator>
    </NavigationContainer>
  );
}
