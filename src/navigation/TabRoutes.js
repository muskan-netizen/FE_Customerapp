import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, Text, StyleSheet} from 'react-native';
import CustomBottomTabBar from '../Components/CustomBottomTabBar';
import CustomBottomTabBarTwo from '../Components/CustomBottomTabBarTwo';
import CustomBottomTabBarThree from '../Components/CustomBottomTabBarThree';

import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import {useSelector} from 'react-redux';
import {Cart} from '../Screens';
import colors from '../styles/colors';
import {moderateScale, textScale} from '../styles/responsiveSize';
import AccountStack from './AccountStack';
import BrandStack from './BrandStack';
import CelebrityStack from './CelebrityStack';
import HomeStack from './HomeStack';
import CartStack from './CartStack';
import navigationStrings from './navigationStrings';
import {View} from 'react-native-animatable';
import staticStrings from '../constants/staticStrings';
import CustomTopTabBar from '../Components/CustomTopTabBar';
import CustomBottomTabBar1 from '../Components/CustomBottomTabBar1';
import {getBuildId, getBundleId} from 'react-native-device-info';
import {appIds} from '../utils/constants/DynamicAppKeys';
const Tab = createBottomTabNavigator();

export default function TabRoutes(props) {
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const {appStyle, appData} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesData();

  const allCategory = appMainData?.categories;
  const checkForCeleb = appData?.profile?.preferences?.celebrity_check;

  // const checkForCeleb =
  //   allCategory &&
  //   allCategory.find((x) => x?.redirect_to == staticStrings.CELEBRITY);
  const checkForBrand =
    allCategory &&
    allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);

  var celebTab = null;
  var brandTab = null;
  if (checkForCeleb) {
    celebTab = (
      <Tab.Screen
        component={CelebrityStack}
        name={navigationStrings.CELEBRITY}
        options={{
          tabBarLabel: strings.CELEBRITY,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={{tintColor: tintColor}}
              source={focused ? imagePath.tabDActive : imagePath.tabDInActive}
            />
          ),
          unmountOnBlur: true,
        }}
      />
    );
  }
  // capcorp

  if (getBundleId() !== appIds.capcorp) {
    if (checkForBrand) {
      brandTab = (
        <Tab.Screen
          component={BrandStack}
          name={navigationStrings.BRANDS}
          options={{
            tabBarLabel: strings.BRANDS,
            tabBarIcon: ({focused, tintColor}) => (
              <Image
                style={{tintColor: tintColor}}
                source={focused ? imagePath.tabCActive : imagePath.tabCInActive}
              />
            ),
            //  unmountOnBlur: true,
          }}
        />
      );
    }
  }

  return (
    <Tab.Navigator
      backBehavior={'initialRoute'}
      tabBar={(props) => {
        switch (appStyle?.tabBarLayout) {
          case 1:
            return getBundleId() === appIds.capcorp ? (
              <CustomBottomTabBar1 {...props} />
            ) : (
              <CustomBottomTabBar {...props} />
            );
          case 2:
            return <CustomBottomTabBarTwo {...props} />;
          case 3:
            return <CustomBottomTabBarThree {...props} />;
        }
      }}
      tabBarOptions={{
        // activeTintColor: colors.white,
        // inactiveTintColor: colors.tabGrey,
        labelStyle: {
          textTransform: 'capitalize',
          fontFamily: fontFamily?.medium,
          fontSize: textScale(12),
          color: colors.white,
        },

        // showLabel: false,
      }}>
      <Tab.Screen
        component={HomeStack}
        name={navigationStrings.HOMESTACK}
        options={{
          tabBarLabel: strings.HOME,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={{tintColor: tintColor}}
              source={
                getBundleId() === appIds.capcorp
                  ? focused
                    ? imagePath.homeActive
                    : imagePath.homeInActive
                  : focused
                  ? imagePath.tabAActive
                  : imagePath.tabAInActive
              }
            />
          ),
          // unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        component={CartStack}
        name={navigationStrings.CART}
        options={{
          tabBarLabel: strings.CART,
          tabBarIcon: ({focused, tintColor}) => (
            <View style={{alignItems: 'center'}}>
              {cartItemCount?.data?.item_count ? (
                <View style={[styles.cartItemCountView]}>
                  <Text style={styles.cartItemCountNumber}>
                    {cartItemCount?.data?.item_count}
                  </Text>
                </View>
              ) : null}
              <Image
                style={{tintColor: tintColor}}
                source={
                  getBundleId() === appIds.capcorp
                    ? focused
                      ? imagePath.ordersActive
                      : imagePath.ordersInActive
                    : focused
                    ? imagePath.cartActive
                    : imagePath.cartInActive
                }
              />
            </View>
          ),
          unmountOnBlur: cartItemCount?.data?.item_count ? false : true,
        }}
      />
      {brandTab}
      {celebTab}
      <Tab.Screen
        component={AccountStack}
        name={navigationStrings.ACCOUNTS}
        options={{
          tabBarLabel: strings.ACCOUNTS,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={{tintColor: tintColor}}
              source={
                getBundleId() === appIds.capcorp
                  ? focused
                    ? imagePath.profileActive
                    : imagePath.profileInActive
                  : focused
                  ? imagePath.tabEActive
                  : imagePath.tabEInActive
              }
            />
          ),
          //  unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
}

export function stylesData(params) {
  const {themeColors, appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const styles = StyleSheet.create({
    cartItemCountView: {
      position: 'absolute',
      zIndex: 100,
      top: -5,
      right: -5,
      backgroundColor: colors.cartItemPrice,
      width: moderateScale(18),
      height: moderateScale(18),
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartItemCountNumber: {
      fontFamily: fontFamily?.bold,
      color: colors.white,
      fontSize: textScale(8),
    },
  });
  return styles;
}
