import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import ShortCode from '../Screens/ShortCode/ShortCode';
import AuthStack from './AuthStack';
import CourierStack from './CourierStack';

import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';
import { navigationRef } from './NavigationService';
import DrawerRoutes from './DrawerRoutes';
import TabRoutesVendor from './TabRoutesVendor';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import UserInterfaceStyle from 'react-native-user-interface-style';
import colors from '../styles/colors';
import TaxiAppStack from './TaxiAppStack';
import RoyoOrderStack from './RoyoOrderStack';
import RoyoVendroAppTabRoute from './RoyoVendroAppTabRoute';

const Stack = createStackNavigator();

export function shortCode(Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.SHORT_CODE}
        component={ShortCode}
        options={{ headerShown: false }}
      />
    </>
  );
}

export default function Routes() {
  const userData = useSelector((state) => state?.auth?.userData);
  const { shortCodeStatus, appStyle } = useSelector((state) => state?.initBoot);
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(255, 45, 85)',
    },
  };

  const theme = {
    //like this
    colors: {
      background: colors.transparent,
    },
  };

  return (
    <AppearanceProvider>
      <NavigationContainer
       
        theme={theme}
        // theme={scheme == 'dark' ? DarkTheme : DefaultTheme}
        ref={navigationRef}>
        <Stack.Navigator>
          {/* {RoyoOrderStack(Stack)} */}
          {shortCode(Stack)}
          {AuthStack(Stack)}
          {CourierStack(Stack)}
          {TaxiAppStack(Stack)}

          <Stack.Screen
            name={navigationStrings.DRAWER_ROUTES}
            component={DrawerRoutes}
            options={{ headerShown: false, gestureEnabled: false }}
          />

          <Stack.Screen
            name={navigationStrings.TAB_ROUTES}
            component={TabRoutes}
            options={{ headerShown: false, gestureEnabled: false }}
          />

          <Stack.Screen
            name={navigationStrings.TABROUTESVENDOR}
            // component={TabRoutesVendor}
            component={RoyoVendroAppTabRoute}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppearanceProvider>
  );
}
