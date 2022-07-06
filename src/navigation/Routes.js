import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {AppearanceProvider} from 'react-native-appearance';
import {useSelector} from 'react-redux';
import AppIntro from '../Screens/AppIntro';
import ShortCode from '../Screens/ShortCode/ShortCode';
import colors from '../styles/colors';
import AuthStack from './AuthStack';
import CourierStack from './CourierStack';
import {navigationRef} from './NavigationService';
import navigationStrings from './navigationStrings';
import TabRoutes from './TabRoutes';
import TaxiAppStack from './TaxiAppStack';
import TaxiTabRoutes from './TaxiTabRoutes';
import TabRoutesVendor from './TabRoutesVendor';
import TabRoutesVendorNewTemplate from './VendorApp/TabRoutesVendor';
import {Cart} from '../Screens';
const Stack = createStackNavigator();

export function shortCode(Stack) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.SHORT_CODE}
        component={ShortCode}
        options={{headerShown: false}}
      />
    </>
  );
  // getItem('firstTime').then((el) => {
  //   if (el && el !== null) {
  //     return (
  //       <>
  //         <Stack.Screen
  //           name={navigationStrings.SHORT_CODE}
  //           component={ShortCode}
  //           options={{ headerShown: false }}
  //         />
  //       </>
  //     );
  //   } else {
  //     return (
  //       <>
  //         <Stack.Screen
  //           name={navigationStrings.APP_INTRO}
  //           component={AppIntro}
  //           options={{ headerShown: false }}
  //         />
  //       </>
  //     );
  //   }
  // })
}

export default function Routes() {
  const userData = useSelector((state) => state?.auth?.userData);
  const {shortCodeStatus, appStyle} = useSelector((state) => state?.initBoot);
  const businessType = appStyle?.homePageLayout;
 

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
        // theme={scheme == 'dark' ? DarkTheme : DefaultTheme}
        ref={navigationRef}>
        <Stack.Navigator>
          {/* {RoyoOrderStack(Stack)} */}
          {shortCode(Stack)}
          {AuthStack(Stack)}
          {CourierStack(Stack)}
          {TaxiAppStack(Stack)}

          <Stack.Screen
            name={navigationStrings.APP_INTRO}
            component={AppIntro}
            options={{headerShown: false, gestureEnabled: false}}
          />

          {/* <Stack.Screen
            name={navigationStrings.DRAWER_ROUTES}
            component={DrawerRoutes}
            options={{ headerShown: false, gestureEnabled: false }}
          /> */}

          <Stack.Screen
            name={navigationStrings.TAB_ROUTES}
            component={businessType === 4 ? TaxiTabRoutes : TabRoutes}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name={navigationStrings.CART}
            component={Cart}
            options={{headerShown: false, gestureEnabled: false}}
          />
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
