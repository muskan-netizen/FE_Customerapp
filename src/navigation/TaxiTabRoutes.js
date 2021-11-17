import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import {useSelector} from 'react-redux';
import CustomBottomTabBar from '../Components/CustomBottomTabBar';
import CustomBottomTabBarFive from '../Components/CustomBottomTabBarFive';
import CustomBottomTabBarFour from '../Components/CustomBottomTabBarFour';
import CustomBottomTabBarThree from '../Components/CustomBottomTabBarThree';
import CustomBottomTabBarTwo from '../Components/CustomBottomTabBarTwo';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import {MyOrders} from '../Screens';
import colors from '../styles/colors';
import {moderateScale, textScale} from '../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../utils/helperFunctions';
import AccountStack from './AccountStack';
import HomeStack from './HomeStack';
import navigationStrings from './navigationStrings';

const Tab = createBottomTabNavigator();

export default function TaxiTabRoutes(props) {
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const {appStyle, themeColors, appData, themeColor, themeToggle} = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  return (
    <Tab.Navigator
      backBehavior={'initialRoute'}
      tabBar={(props) => {
        console.log(appStyle?.tabBarLayout, 'appStyle?.tabBarLayout');
        switch (appStyle?.tabBarLayout) {
          case 1:
            return <CustomBottomTabBar {...props} />;
          case 2:
            return <CustomBottomTabBarTwo {...props} />;
          case 3:
            return <CustomBottomTabBarThree {...props} />;
          case 4:
            return <CustomBottomTabBarFour {...props} />;
          case 5:
            return <CustomBottomTabBarFive {...props} />;
        }
      }}
      tabBarOptions={{
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
              style={[
                {tintColor: tintColor},
                appStyle?.tabBarLayout === 2 && {height: 25, width: 25},
              ]}
              source={
                appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.homeActive
                    : imagePath.homeInActive
                  : appStyle?.tabBarLayout === 4
                  ? focused
                    ? imagePath.homeRedActive
                    : imagePath.homeRedInActive
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
        component={MyOrders}
        name={navigationStrings.MY_ORDERS}
        options={{
          tabBarLabel:
            appStyle?.tabBarLayout === 6 ? strings.SERVICES : strings.MYRIDES,
          tabBarIcon: ({focused, tintColor}) => {
            let tabIconColor =
              tintColor && appStyle?.tabBarLayout == 4
                ? {
                    tintColor: focused
                      ? isDarkMode
                        ? colors.white
                        : themeColors.primary_color
                      : isDarkMode
                      ? colors.whiteOpacity77
                      : colors.black,
                  }
                : {
                    tintColor: focused
                      ? colors.white
                      : getColorCodeWithOpactiyNumber(
                          colors.white.substr(1),
                          60,
                        ),
                  };
            return (
              <Image
                style={[
                  {
                    ...tabIconColor,
                    height: 23,
                    width: 23,
                  },
                ]}
                source={
                  appStyle?.tabBarLayout === 6
                    ? focused
                      ? imagePath.settings_red_icon
                      : imagePath.settings_icon
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
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={[
                {tintColor: tintColor},
                appStyle?.tabBarLayout === 2 && {height: 25, width: 25},
              ]}
              source={
                appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.profileActive
                    : imagePath.profileInActive
                  : appStyle?.tabBarLayout === 4
                  ? focused
                    ? imagePath.accountRedActive
                    : imagePath.accountRedInActive
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
