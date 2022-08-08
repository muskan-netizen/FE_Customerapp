import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {AppearanceProvider} from 'react-native-appearance';
import {useSelector} from 'react-redux';
import {Cart, ChatScreen} from '../Screens';
import AppIntro from '../Screens/AppIntro';
import ShortCode from '../Screens/ShortCode/ShortCode';
import AuthStack from './AuthStack';
import CourierStack from './CourierStack';

import {navigationRef} from './NavigationService';
import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';
import TabRoutesVendor from './TabRoutesVendor';
import TaxiAppStack from './TaxiAppStack';
import TaxiTabRoutes from './TaxiTabRoutes';
import TabRoutesVendorNewTemplate from './VendorApp/TabRoutesVendor';
const Stack = createStackNavigator();

export default function Routes() {
  const {userData, appSessionInfo, isGuestLogin} = useSelector(
    (state) => state?.auth,
  );
  const {appStyle} = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;
  console.log(appSessionInfo, 'appSessionInfo..appSessionInfo');
  return (
    <AppearanceProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          {appSessionInfo == 'shortcode' ||
          appSessionInfo == 'show_shortcode' ? (
            <Stack.Screen
              name={navigationStrings.SHORT_CODE}
              component={ShortCode}
              options={{headerShown: false}}
            />
          ) : appSessionInfo == 'app_intro' ? (
            <Stack.Screen
              name={navigationStrings.APP_INTRO}
              component={AppIntro}
              options={{headerShown: false, gestureEnabled: false}}
            />
          ) : appSessionInfo == 'guest_login' || !!userData?.auth_token ? (
            <Stack.Screen
              name={navigationStrings.TAB_ROUTES}
              component={businessType === 4 ? TaxiTabRoutes : TabRoutes}
              options={{headerShown: false, gestureEnabled: false}}
            />
          ) : (
            AuthStack(Stack, appStyle)
          )}
          {CourierStack(Stack)}
      

          <Stack.Screen
            name={navigationStrings.TABROUTESVENDOR}
            component={TabRoutesVendor}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name={navigationStrings.TABROUTESVENDORNEW}
            component={TabRoutesVendorNewTemplate}
            options={{headerShown: false, gestureEnabled: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}
