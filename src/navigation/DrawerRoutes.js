import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import staticStrings from '../constants/staticStrings';
import colors from '../styles/colors';
import AccountStack from './AccountStack';
import BrandStack from './BrandStack';
import CartStack from './CartStack';
import CelebrityStack from './CelebrityStack';
import HomeStack from './HomeStack';
import navigationStrings from './navigationStrings';
import { Image, Text, StyleSheet } from 'react-native';
import { moderateScale, textScale } from '../styles/responsiveSize';
import fontFamily from '../styles/fontFamily';
import CustomDrawerContent from '../Components/CustomDrawerContent';
import { View } from 'react-native-animatable';
import TabRoutes from './TabRoutes';
import TaxiTabRoutes from './TaxiTabRoutes';
import TabRoutesP2p from './TabRoutesP2p';
import TabRoutesEcommerce from './TabRoutesEcommerce';
import { WebLinks } from '../Screens';

const Drawer = createDrawerNavigator();
export default function DrawerRoutes(props) {
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const appMainData = useSelector((state) => state?.home?.appMainData);

  const { shortCodeStatus, appStyle, appData } = useSelector(
    (state) => state?.initBoot,
  );

  const businessType = appStyle?.homePageLayout;

  const allCategory = appMainData?.categories;
  const checkForCeleb = appData?.profile?.preferences?.celebrity_check;


  console.log("businessTypebusinessTypebusinessType",businessType)

  // const checkForCeleb =
  //   allCategory &&
  //   allCategory.find((x) => x?.redirect_to == staticStrings.CELEBRITY);
  const checkForBrand =
    allCategory &&
    allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);

  var celebTab = null;
  var brandTab = null;
  var gestureEnabled = true;
  var swipeEnabled = true;
  if (checkForCeleb) {
    celebTab = (
      <Drawer.Screen
        component={CelebrityStack}
        name={navigationStrings.CELEBRITY}
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.CELEBRITY,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? imagePath.tabDActive : imagePath.tabDInActive}
            />
          ),
        }}
      />
    );
  }

  if (checkForBrand) {
    brandTab = (
      <Drawer.Screen
        component={BrandStack}
        name={navigationStrings.BRANDS}
        options={{
          gestureEnabled: gestureEnabled,
          swipeEnabled: swipeEnabled,
          drawerLabel: strings.BRANDS,
          drawerIcon: ({ focused }) => (
            <Image
              source={focused ? imagePath.tabCActive : imagePath.tabCInActive}
            />
          ),
        }}
      />
    );
  }


  return (
    <Drawer.Navigator
      drawerPosition={'left'}
      backBehavior={'none'}
      drawerType={'front'}
      overlayColor={'rgba(0,0,0,0.6)'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName={businessType === 4
        ? navigationStrings.TAXITABROUTES
        : navigationStrings.TAB_ROUTES}
    >

      <Drawer.Screen
        component={businessType === 4
          ? TaxiTabRoutes : businessType === 8
            ? TabRoutesP2p : businessType === 10
              ? TabRoutesEcommerce : TabRoutes
        }
        name={
          businessType === 4
            ? navigationStrings.TAXITABROUTES
            : navigationStrings.TAB_ROUTES
        }

      />
      <Drawer.Screen
        component={CartStack}
        name={navigationStrings.CART}
      />


      <Drawer.Screen
        name={navigationStrings.WEBLINKS}
        component={WebLinks}
        options={{ headerShown: false}}
        
      />
      {brandTab}
      {celebTab}

    </Drawer.Navigator>
  );
}

