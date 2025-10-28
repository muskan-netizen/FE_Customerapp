import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import { useSelector } from 'react-redux';
import CustomBottomTabBar from '../Components/CustomBottomTabBar';
import CustomBottomTabBarFive from '../Components/CustomBottomTabBarFive';
import CustomBottomTabBarFour from '../Components/CustomBottomTabBarFour';
import CustomBottomTabBarThree from '../Components/CustomBottomTabBarThree';
import CustomBottomTabBarTwo from '../Components/CustomBottomTabBarTwo';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import { MyOrders } from '../Screens';
import colors from '../styles/colors';
import { moderateScale, textScale } from '../styles/responsiveSize';
import { appIds } from '../utils/constants/DynamicAppKeys';
import AccountStack from './AccountStack';
import HomeStack from './HomeStack';
import navigationStrings from './navigationStrings';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import CustomBottomTabBarGlass from '../Components/CustomBottomTabBarGlass';
import FastImage from 'react-native-fast-image';

const Tab = createBottomTabNavigator();

export default function TaxiTabRoutes(props) {
  let showBottomBar_ = true;

  const { appStyle, themeColors } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;

  const getTintColor = (focused = false, tintColor) => {
    return appStyle?.tabBarLayout == 4 ? focused ? themeColors?.primary_color : colors.black : appStyle?.tabBarLayout == 1 || appStyle?.tabBarLayout == 3 ? focused ? colors.white : colors.whiteOpacity85 : focused ? themeColors?.primary_color : colors.black
  }

  const getImgStyle = (focused) => {
    if (appStyle?.tabBarLayout == 4) {
      return {
        height: moderateScale(20),
        width: moderateScale(20),
      };
    } else if (
      appStyle?.tabBarLayout == 1 ||
      appStyle?.tabBarLayout == 3
    ) {
      return {
        height: moderateScale(20),
        width: moderateScale(20),
      };
    } else {
      return {
        height: moderateScale(20),
        width: moderateScale(20),
      };
    }
  };
  const getTabBarVisibility = (route, navigation, screens = []) => {
    if (navigation && navigation.isFocused && navigation.isFocused()) {
      const route_name = getFocusedRouteNameFromRoute(route);
      if (screens.includes(route_name)) {
        showBottomBar_ = false;
        return false;
      }
      showBottomBar_ = true;
      return true;
    }
  };
  const getCustomTabBar = (props) => {
    if (showBottomBar_) {
      switch (appStyle?.tabBarLayout) {
        case 1:
          return <CustomBottomTabBar {...props} />;
        case 2:
          return <CustomBottomTabBarGlass {...props} />;
        case 3:
          return <CustomBottomTabBarThree {...props} />;
        case 4:
          return <CustomBottomTabBarFour {...props} />;
        case 5:
          return <CustomBottomTabBarFive {...props} />;
      }
    }
  }
  return (
    <Tab.Navigator
      backBehavior={'initialRoute'}
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontFamily: fontFamily?.medium,
          fontSize: textScale(12),
          color: colors.white,
        }
      }}
      tabBar={getCustomTabBar}>
      <Tab.Screen
        component={HomeStack}
        name={navigationStrings.HOMESTACK}
        options={({ route, navigation }) => ({
          tabBarVisible: getTabBarVisibility(route, navigation, [
            navigationStrings.PRODUCTDETAIL,
            navigationStrings.ADDADDRESS

          ]),
          tabBarLabel: strings.HOME,
          tabBarIcon: ({ focused, tintColor }) => (
            <FastImage
              style={getImgStyle(focused)}
              tintColor={getTintColor(focused, tintColor)}
              source={
                appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.home2Active
                    : imagePath.home2InActive
                  : appStyle?.tabBarLayout === 4
                    ? focused
                      ? imagePath.homeRedActive
                      : imagePath.homeRedInActive
                    : appStyle?.tabBarLayout === 2
                      ? focused
                        ? imagePath.homeRedActive
                        : imagePath.homeRedInActive
                    : focused
                      ? imagePath.tabAActive
                      : imagePath.tabAInActive
              }
            />
          ),
        })}
      />
      <Tab.Screen
        component={MyOrders}
        name={navigationStrings.MY_ORDERS}
        options={{
          tabBarLabel:
            appStyle?.tabBarLayout === 6
              ? strings.SERVICES
              : appIds.mml == getBundleId()
                ? strings.MYDELIERIES
                : appIds.jiffex == getBundleId()
                  ? strings.MY_ORDERS
                  : strings.MYRIDES,
          tabBarIcon: ({ focused, tintColor }) => {
            return (
              <FastImage
                style={getImgStyle(focused)}
                tintColor={getTintColor(focused, tintColor)}
                resizeMode="contain"
                source={
                  appStyle?.tabBarLayout === 6
                    ? focused
                      ? imagePath.settings_red_icon
                      : imagePath.settings_icon
                    : appStyle?.tabBarLayout === 5
                      ? focused
                        ? imagePath.icMyRideActive
                        : imagePath.icMyRideInActive
                      : focused
                        ? imagePath.rideFilled
                        : imagePath.ride
                }
              />
            );
          },
          // unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        component={AccountStack}
        name={navigationStrings.ACCOUNTS}
        options={{
          tabBarLabel: strings.ACCOUNTS,
          tabBarIcon: ({ focused, tintColor }) => (
            <FastImage
              style={getImgStyle(focused)}
              tintColor={getTintColor(focused, tintColor)}
              source={
                appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.accountActive
                    : imagePath.accountInactiveRoyo
                  : appStyle?.tabBarLayout === 2
                    ? focused
                      ? imagePath.accountRedActive
                      : imagePath.accountRedInActive
                    : appStyle?.tabBarLayout === 4
                      ? focused
                        ? imagePath.accountRedActive
                        : imagePath.accountRedInActive
                      : focused
                        ? imagePath.accountRedActive
                        : imagePath.accountInactiveRoyo
              }
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function stylesData(params) {
  const { appStyle } = useSelector((state) => state.initBoot);
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
