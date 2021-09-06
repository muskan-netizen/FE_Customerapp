import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, BackHandler, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {useSelector} from 'react-redux';
import {useDeepLinkURL} from '../../Components/DeepLinkHook';
import WrapperContainer from '../../Components/WrapperContainer';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {appIds, shortCodes} from '../../utils/constants/DynamicAppKeys';
import {
  androidBackButtonHandler,
  getCurrentLocation,
  getParameterByName,
  getUrlRoutes,
} from '../../utils/helperFunctions';
import {chekLocationPermission} from '../../utils/permissions';
import {setItem} from '../../utils/utils';
import {
  DashBoardFive,
  DashBoardFour,
  DashBoardHeaderFive,
  DashBoardHeaderOne,
  DashBoardOne,
} from './DashboardViews/Index';
import {MyDarkTheme, MyDefaultTheme} from '../../styles/theme';
import {useDarkMode} from 'react-native-dark-mode';

navigator.geolocation = require('react-native-geolocation-service');

export default function Home({route, navigation}) {
  const paramData = route?.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const isDarkMode = theme;
  const {linkedURL, resetURL} = useDeepLinkURL();

  const location = useSelector((state) => state?.home?.location);
  const [state, setState] = useState({
    isLoading: true,
    latitude: location?.latitude,
    longitude: location?.longitude,
    slider1ActiveSlide: 0,
    // location: [],
    isRefreshing: false,
    updatedData: [],
    selectedTabType: '',
    updateTime: 0,
    isDineInSelected: false,
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    internetConnection,
    appStyle,
    isDineInSelected,
  } = useSelector((state) => state?.initBoot);

  const initData = useSelector((state) => state?.initBoot);
  const userData = useSelector((state) => state?.auth?.userData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  const profileInfo = appData?.profile;
  const {profile} = appData;
  const {
    updateTime,
    isLoading,
    longitude,
    latitude,
    slider1ActiveSlide,
    isRefreshing,
    themeLayout,
    updatedData,
    selectedTabType,
  } = state;
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        androidBackButtonHandler,
      );
      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    updateState({updatedData: appMainData?.categories});
  }, [appMainData]);

  useEffect(() => {
    if (
      paramData?.details &&
      paramData?.details?.formatted_address != location?.address
    ) {
      const address = paramData?.details?.formatted_address;
      const res = {
        address: address,
        latitude: paramData?.details?.geometry?.location.lat,
        longitude: paramData?.details?.geometry?.location.lng,
      };
      if (
        res?.latitude != location?.latitude &&
        res?.longitude != location?.longitude
      ) {
        if (cartItemCount?.data?.item_count) {
          checkCartWithLatLang(res);
        } else {
          updateLatLang(res);
        }
      } else {
        updateLatLang(res);
      }
    }
  }, [paramData?.details]);

  const checkCartWithLatLang = (res) => {
    Alert.alert(
      '',
      'This will remove your cart.Are your sure you want to remove the cart?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: 'Clear Cart', onPress: () => clearCart(res)},
      ],
    );
  };

  const clearCart = (location) => {
    updateLatLang(location);
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty(res);
        homeData(location);
      })
      .catch(errorMethod);
  };

  const updateLatLang = (res) => {
    updateState({updateTime: Math.random()});
    actions.locationData(res);
  };
  useEffect(() => {
    if (updateTime) {
      homeData();
    }
  }, [updateTime]);

  // useEffect(() => {

  //   Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
  //   // Linking.addEventListener('deepLinkUrl', ({deepLinkUrl}) =>
  //   //   moveToLink(deepLinkUrl),
  //   // );

  //   // if app is not opened
  //   const getAsyncURL = async () => {
  //     const deepLinkUrl = await Linking.getInitialURL();
  //     moveToLink(deepLinkUrl);
  //   };

  //   getAsyncURL();
  // }, []);

  // useEffect(() => {
  //   Linking.addEventListener('url', callback);
  //   return () => {
  //     Linking.removeEventListener('url', callback);
  //   };
  // }, []);

  useEffect(() => {
    if (linkedURL) {
      moveToLink(linkedURL);
    }
    resetURL();
  }, [linkedURL, resetURL]);

  const moveToLink = (deepLinkUrl) => {
    console.log();
    if (deepLinkUrl != null) {
      setItem('deepLinkUrl', deepLinkUrl);
      let id = getParameterByName('id', deepLinkUrl);
      let routeName = getUrlRoutes(deepLinkUrl, 1);
      if (routeName === 'vendor') {
        selcetedToggle('dine_in');
        const item = {};
        item['id'] = id;
        moveToNewScreen(navigationStrings.VENDOR_DETAIL, item)();
      }
    }
  };

  useEffect(() => {
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          getCurrentLocation('home')
            .then((res) => {
              if (
                appMainData &&
                typeof appMainData?.reqData == 'object' &&
                appMainData?.reqData?.latitude &&
                (location?.latitude == '' || location?.longitude == '')
              ) {
                const data = {
                  address: appMainData?.reqData?.address,
                  latitude: appMainData?.reqData?.latitude,
                  longitude: appMainData?.reqData?.longitude,
                };
                actions.locationData(data);
              } else {
                if (appData?.profile?.preferences?.is_hyperlocal) {
                  if (!location?.address) {
                    actions.locationData(res);
                  }
                }
              }
            })
            .catch((err) => {});
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // homeData();
      getAllAddress();
    }, []),
  );

  // useEffect(() => {
  //   homeData();
  // }, [appMainData]);

  //get All address
  const getAllAddress = () => {
    if (!!userData?.auth_token) {
      actions
        .getAddress(
          {},
          {
            code: appData?.profile?.code,
          },
        )
        .then((res) => {
          updateState({
            isLoadingB: false,
          });
          if (res.data) {
            actions.saveAllUserAddress(res.data);
          }
        })
        .catch(errorMethod);
    }
  };

  //Home data
  const homeData = (slectedLocatonFromPreviousScreen) => {
    let latlongObj = {};

    if (appData?.profile?.preferences?.is_hyperlocal) {
      latlongObj = {
        address: slectedLocatonFromPreviousScreen
          ? slectedLocatonFromPreviousScreen?.address
          : location?.address,
        latitude: slectedLocatonFromPreviousScreen
          ? slectedLocatonFromPreviousScreen?.latitude
          : location?.latitude,
        longitude: slectedLocatonFromPreviousScreen
          ? slectedLocatonFromPreviousScreen?.longitude
          : location?.longitude,
      };
    }

    {
      selectedTabType
        ? actions
            .homeData(
              {
                type: dine_In_Type ? dine_In_Type : dine_In_Type,
                ...latlongObj,
              },
              {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                // ...latlongObj,
              },
            )
            .then((res) => {
              if (
                appData?.profile?.preferences?.is_hyperlocal &&
                location?.latitude == '' &&
                location?.longitude == ''
              ) {
                if (
                  typeof res?.data?.reqData == 'object' &&
                  res?.data?.reqData?.latitude &&
                  res?.data?.reqData?.longitude
                ) {
                  const data = {
                    address: res?.data?.reqData?.address,
                    latitude: res?.data?.reqData?.latitude,
                    longitude: res?.data?.reqData?.longitude,
                  };
                  actions.locationData(data);
                }
              } else {
                if (
                  appData?.profile?.preferences?.is_hyperlocal &&
                  location?.latitude != '' &&
                  location?.longitude != ''
                ) {
                } else {
                  const data = {
                    address: '',
                    latitude: '',
                    longitude: '',
                  };
                  actions.locationData(data);
                }
              }
              updateState({isLoading: false});
            })
            .catch(errorMethod)
        : null;
    }
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  //Component reference
  const {viewRef2, viewRef3, bannerRef} = useRef();

  //onPress Category
  const onPressCategory = (item) => {
    if (item.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (item?.warning_page_id) {
          if (item?.warning_page_id == 2) {
            moveToNewScreen(navigationStrings.DELIVERY, item)();
          } else {
            moveToNewScreen(navigationStrings.HOMESCREENCOURIER, item)();
          }
        } else {
          if (item?.template_type_id == 1) {
            moveToNewScreen(navigationStrings.SEND_PRODUCT, item)();
          } else {
            moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
          }
        }
      } else {
        // showError(strings.UNAUTHORIZED_MESSAGE);
        moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
      }
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, item)();
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.BRANDS)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  //On Press banner
  const bannerPress = (data) => {
    if (data?.redirect_id) {
      let item = {
        id: data.redirect_id,
        redirect_to: data.redirect_to,
        name: data.redirect_name,
      };
      if (data.redirect_to == staticStrings.VENDOR) {
        data?.is_show_category
          ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
              item,
              rootProducts: true,
              // categoryData: data,
            })()
          : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              vendor: true,
              name: data.redirect_name,
            })();
      } else if (data.redirect_to == staticStrings.CATEGORY) {
        moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: data.redirect_id,
          // vendor: true,
          name: data.redirect_name,
        })();
      }
    }
  };

  //Reloads the screen
  const initApiHit = () => {
    actions
      .initApp(
        {},
        {
          code: appData?.profile?.code,
        },
        true,
      )
      .then((res) => {
        updateState({isRefreshing: false});
      })
      .catch((error) => {
        updateState({isRefreshing: false});
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({isRefreshing: true});

    initApiHit();
    // homeData();
  };
  const updateCircleData = (data) => {
    updateState({updatedData: data});
  };

  const selcetedToggle = (type) => {
    actions.dineInData(type);
    updateState({
      selectedTabType: type,
    });
  };

  useEffect(() => {
    homeData();
  }, [selectedTabType, appData, dine_In_Type]);

  ///onPressCategory2
  const onPressCategory2 = (data) => {
    if (data.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, data)();
    } else if (
      data.redirect_to == staticStrings.PRODUCT ||
      data.redirect_to == staticStrings.CATEGORY
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, data)();
    } else if (data.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (data?.warning_page_id) {
          if (data?.warning_page_id == 2) {
            moveToNewScreen(navigationStrings.DELIVERY, data)();
          } else {
            moveToNewScreen(navigationStrings.HOMESCREENCOURIER, data)();
          }
        } else {
          if (data?.template_type_id == 1) {
            moveToNewScreen(navigationStrings.SEND_PRODUCT, data)();
          } else {
            moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, data)();
          }
        }
      } else {
        // showError(strings.UNAUTHORIZED_MESSAGE);
        moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
      }
    } else if (data.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, data)();
    } else if (data.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (data.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.BRANDS)();
    } else if (data.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, data)();

      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {data})();
    } else if (!data.is_show_category || data.is_show_category) {
      let item = data;
      data?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: data?.id,
            vendor: true,
            name: data?.name,
          })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const renderHomeScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return (
          <>
            <DashBoardHeaderOne navigation={navigation} location={location} />
            <DashBoardOne
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => onPressCategory(item)}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
            />
          </>
        );

      case 2:
        return (
          <>
            <DashBoardHeaderOne navigation={navigation} location={location} />
            <DashBoardFour
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => {
                shortCodes.capcorp === appIds.capcorp
                  ? onPressCategory2(item)
                  : onPressCategory2(item);
              }}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
            />
          </>
        );
      case 3:
        return (
          <>
            <DashBoardHeaderFive
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
            />
            <DashBoardFive
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => {
                shortCodes.capcorp === appIds.capcorp
                  ? onPressCategory2(item)
                  : onPressCategory2(item);
              }}
              isDineInSelected={isDineInSelected}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              navigation={navigation}
            />
          </>
        );
    }
  };
  console.log(appMainData, 'appMainData');
  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      <View style={{flex: 1}}>{renderHomeScreen()}</View>
    </WrapperContainer>
  );
}
