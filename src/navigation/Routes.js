import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import { useSelector } from 'react-redux';
import {
  ChatRoom,
  ChatRoomForVendor,
  ChatScreen,
  ChatScreenForVendor,
} from '../Screens';
import AppIntro from '../Screens/AppIntro';
import ShortCode from '../Screens/ShortCode/ShortCode';
import AuthStack from './AuthStack';
import CourierStack from './CourierStack';
import { navigationRef } from './NavigationService';
import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';
import TabRoutesVendor from './TabRoutesVendor';
import TaxiAppStack from './TaxiAppStack';
import TaxiTabRoutes from './TaxiTabRoutes';
import TabRoutesVendorNewTemplate from './VendorApp/TabRoutesVendor';
import { View, Text, TouchableOpacity } from 'react-native';
import TabRoutesP2p from './TabRoutesP2p';

const Stack = createNativeStackNavigator();


export default function Routes() {
  const { userData, appSessionInfo } = useSelector((state) => state?.auth || {});
  const { appStyle,themeColors } = useSelector((state) => state?.initBoot || {});
  const businessType = appStyle?.homePageLayout;

  console.log(themeColors, "themeColorsthemeColorsthemeColors")
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }} >

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
          <Stack.Screen
            name={navigationStrings.TAB_ROUTES}
            component={
              businessType === 4
                ? TaxiTabRoutes
                : businessType === 8
                  ? TabRoutesP2p
                  :
                  TabRoutes
            }
            options={{ gestureEnabled: false }}
          />

        ) : (
          AuthStack(Stack, appStyle)
        )}

        {CourierStack(Stack)}

        {TaxiAppStack(Stack)}

        <Stack.Screen
          name={navigationStrings.CHAT_SCREEN}
          component={ChatScreen}
        />
        <Stack.Screen
          name={navigationStrings.CHAT_SCREEN_FOR_VENDOR}
          component={ChatScreenForVendor}
        />
        <Stack.Screen
          name={navigationStrings.CHAT_ROOM}
          component={ChatRoom}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
