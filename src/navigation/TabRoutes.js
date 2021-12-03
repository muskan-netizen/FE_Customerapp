import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/core';
import React, {useState} from 'react';
import {Image, StyleSheet, Text} from 'react-native';
import {View} from 'react-native-animatable';
import {useSelector} from 'react-redux';
import CustomBottomTabBar from '../Components/CustomBottomTabBar';
import CustomBottomTabBarFive from '../Components/CustomBottomTabBarFive';
import CustomBottomTabBarFour from '../Components/CustomBottomTabBarFour';
import CustomBottomTabBarThree from '../Components/CustomBottomTabBarThree';
import CustomBottomTabBarTwo from '../Components/CustomBottomTabBarTwo';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import staticStrings from '../constants/staticStrings';
import colors from '../styles/colors';
import {moderateScale, textScale} from '../styles/responsiveSize';
import {shortCodes} from '../utils/constants/DynamicAppKeys';
import AccountStack from './AccountStack';
import BrandStack from './BrandStack';
import CartStack from './CartStack';
import CelebrityStack from './CelebrityStack';
import HomeStack from './HomeStack';
import navigationStrings from './navigationStrings';

const Tab = createBottomTabNavigator();

let showBottomBar_ = true;

export default function TabRoutes(props) {
  const [showBottomBar, setShowBottomBar] = useState(true);
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

  const getTabBarVisibility = (route, navigation, screen) => {
    if (navigation && navigation.isFocused && navigation.isFocused()) {
      // const routeName = route.state
      //   ? route.state.routes[route.state.index].name
      //   : '';

      const route_name = getFocusedRouteNameFromRoute(route);

      // console.log(
      //   'checking focus func >>>',
      //   route_name,
      //   '>>>>>>>',
      //   navigation.isFocused(),
      // );

      console.log(
        'checking route name >>>>',
        route_name,
        screen.includes(route_name),
      );
      if (screen.includes(route_name)) {
        // setShowBottomBar(false)
        showBottomBar_ = false;
        return false;
      }
      // setShowBottomBar(true)
      showBottomBar_ = true;
      return true;
    }
  };

  if (checkForCeleb) {
    celebTab = (
      <Tab.Screen
        component={CelebrityStack}
        name={navigationStrings.CELEBRITY}
        options={({route}) => ({
          tabBarLabel: strings.CELEBRITY,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={[
                {tintColor: tintColor},
                appStyle?.tabBarLayout === 3 && {height: 26, width: 26},
              ]}
              source={
                appStyle?.tabBarLayout === 4
                  ? focused
                    ? imagePath.celebActive
                    : imagePath.celebInActive
                  : appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.icCelebActive1
                    : imagePath.icCelebInActive1
                  : focused
                  ? imagePath.tabDActive
                  : imagePath.tabDInActive
              }
            />
          ),
          // unmountOnBlur: true,
        })}
      />
    );
  }
  if (checkForBrand) {
    brandTab = (
      <Tab.Screen
        component={BrandStack}
        name={navigationStrings.BRANDS}
        options={({route}) => ({
          tabBarLabel: strings.BRANDS,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              style={[
                {tintColor: tintColor},
                appStyle?.tabBarLayout === 2 ||
                  (appStyle?.tabBarLayout === 4 && {height: 20, width: 20}),
              ]}
              source={
                appStyle?.tabBarLayout === 4
                  ? focused
                    ? imagePath.icBrandActive
                    : imagePath.icBrandInActive
                  : appStyle?.tabBarLayout === 5
                  ? focused
                    ? imagePath.brandsActive1
                    : imagePath.brandsInActive1
                  : focused
                  ? imagePath.tabCActive
                  : imagePath.tabCInActive
              }
              // source={focused ? imagePath.tabCActive : imagePath.tabCInActive}
            />
          ),
          //  unmountOnBlur: true,
        })}
      />
    );
  }

  return (
    <Tab.Navigator
      backBehavior={'initialRoute'}
      tabBar={(props) => {
        if (showBottomBar_) {
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
        options={({route, navigation}) => ({
          tabBarVisible: getTabBarVisibility(route, navigation, [
            navigationStrings.PRODUCT_LIST,
            navigationStrings.PRODUCTDETAIL,
          ]),
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
        })}
      />
      <Tab.Screen
        component={CartStack}
        name={navigationStrings.CART}
        options={({route, navigation}) => ({
          tabBarVisible: getTabBarVisibility(route, navigation, [
            navigationStrings.PRODUCT_LIST,
            navigationStrings.PRODUCTDETAIL,
          ]),
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
                style={[
                  {tintColor: tintColor},
                  appStyle?.tabBarLayout === 2 && {height: 25, width: 25},
                ]}
                source={
                  appStyle?.tabBarLayout === 5
                    ? focused
                      ? imagePath.ordersActive
                      : imagePath.ordersInActive
                    : appStyle?.tabBarLayout === 4
                    ? focused
                      ? imagePath.cartRedActive
                      : imagePath.cartRedInActive
                    : focused
                    ? imagePath.cartActive
                    : imagePath.cartInActive
                }
              />
            </View>
          ),
          unmountOnBlur: true,
          // unmountOnBlur: cartItemCount?.data?.item_count ? false : true,
          gestureEnabled: true,
        })}
      />
      {brandTab}
      {celebTab}
      <Tab.Screen
        component={AccountStack}
        name={navigationStrings.ACCOUNTS}
        options={({route}) => ({
          tabBarLabel: strings.ACCOUNTS,
          tabBarIcon: ({focused, tintColor}) => (
            <Image
              resizeMode="contain"
              style={[
                {tintColor: tintColor},
                appStyle?.tabBarLayout === 2 && {height: 23, width: 23},
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
        })}
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
