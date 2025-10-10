import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Platform, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useSelector } from 'react-redux';

import Geocoder from 'react-native-geocoding';
import strings from '../../../constants/lang';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  androidBackButtonHandler,
  getCurrentLocation,
  showError,
} from '../../../utils/helperFunctions';
import { chekLocationPermission } from '../../../utils/permissions';
import {
  TaxiHomeDashbord,
} from '../DashboardViews/Index';
// import DashBoardSeven from '../DashboardViews/DashBoardSeven';
import { MyDarkTheme } from '../../../styles/theme';
import socketServices from '../../../utils/scoketService';
import { getColorSchema } from '../../../utils/utils';

navigator.geolocation = require('react-native-geolocation-service');

export default function TaxiHomeScreen({ route, navigation }) {
  const paramData = route?.params;
  const { location, dineInType, appMainData } = useSelector(
    (state) => state?.home || {},
  );
  const { cartItemCount } = useSelector((state) => state?.cart || {});
  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    internetConnection,
    appStyle,
    isDineInSelected,
    themeColor,
    themeToggle,
    redirectedFrom
  } = useSelector((state) => state?.initBoot || {});
  const { userData } = useSelector((state) => state?.auth || {});
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [state, setState] = useState({
    isLoading: true,
    isRefreshing: false,
    selectedTabType: '',
    locationObj: {},
    isHomeLoading: true,
  });

  const {
    isLoading,
    isRefreshing,
    selectedTabType,
    locationObj,
    isHomeLoading,
  } = state;

  const memorizedAppData = useMemo(() => appData, [appData])
  const memorizsedAppMainData = useMemo(() => appMainData, [appMainData])
  const memorizsedLocation = useMemo(() => location, [location])


  useEffect(() => {
    if (!!userData?.auth_token && !!appData?.profile?.socket_url) {
      socketServices.initializeSocket(appData?.profile?.socket_url);
    }
  }, [appData]);

  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        androidBackButtonHandler,
      );
      return () => backHandler.remove();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      updateState({ isLoading: true });
      chekLocationPermission(true)
        .then((result) => {
          if (result !== 'goback') {
            getCurrentLocation('home')
              .then((res) => {
                actions.locationData(res);
                updateState({ locationObj: res, isLoading: false });
              })
              .catch((err) => {
                console.log('error raised', location);
                updateState({ locationObj: location, isLoading: false });
              }).finally(() => {
                updateState({ isLoading: false })
              });
          }
        })
        .catch((error) => console.log('error while accessing location', error));
    }, []),
  );

  useEffect(() => {
    Geocoder.init(Platform.OS == 'ios' ? appData?.profile?.preferences?.map_key_for_ios_app || appData?.profile?.preferences?.map_key : appData?.profile?.preferences?.map_key_for_app || appData?.profile?.preferences?.map_key, { language: 'en' }); // set the language
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAllAddress();
      initApiHit();
    }, []),
  );
  //get All address
  const getAllAddress = () => {
    // console.log("userData?.auth_token",userData?)
    if (!!(userData && userData?.auth_token)) {
      actions
        .getAddress(
          {},
          {
            code: appData?.profile?.code,
          },
        )
        .then((res) => {
          console.log(res, 'res>>>res');
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
  const homeData = () => {
    console.log('appData?.profile?.preferences', appData?.profile?.preferences);
    let latlongObj = {};
    if (appData?.profile?.preferences?.is_hyperlocal) {
      latlongObj = {
        address: locationObj?.address,
        latitude: locationObj?.latitude,
        longitude: locationObj?.longitude,
      };
    }



    var selectedVendorType = null;
    var defaultVendorType = null;

    if (!!appData?.profile && appData?.profile?.preferences?.vendorMode) {
      defaultVendorType = appData?.profile?.preferences?.vendorMode[0]?.type; //
      appData?.profile?.preferences?.vendorMode.forEach((val, i) => {
        if (val?.type == dineInType) {
          selectedVendorType = val.type;
        }
      });
    }

    if (!selectedVendorType) {

      actions.dineInData(defaultVendorType);
    }
    updateState({ isHomeLoading: true });
    actions
      .homeData(
        {
          type: !!selectedVendorType ? selectedVendorType : defaultVendorType,
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
        console.log('Home data++++++', res);
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
        setTimeout(() => {
          updateState({ isLoading: false, isRefreshing: false, isHomeLoading: false });
        }, 1000);
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, 'error>>>>');
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false, isHomeLoading: false });
    showError(error?.message || error?.error);
  };

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  //onPress Category
  const onPressCategory = (item) => {
    console.log(item, 'item>>>>>item');
    if (item.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY ||
      item.redirect_to == staticStrings.ONDEMANDSERVICE
    ) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.ADDADDRESS, item)();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        actions.saveSchduleTime('now');
        moveToNewScreen(navigationStrings.ADDADDRESS, {
          ...item,
        })();
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, item)();
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.BRANDS)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
    } else if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
          item,
          rootProducts: true,
          // categoryData: data,
        })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: item?.id,
          vendor: true,
          name: item?.name,
        })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  //On Press banner
  const bannerPress = (data) => {
    console.log(data, 'bannerPressdata');
    let item = {};
    if (data?.redirect_id) {
      if (data?.redirect_to == staticStrings.VENDOR) {
        item = {
          ...data?.vendor,
          redirect_to: data.redirect_to,
        };
      } else {
        item = {
          id: data.redirect_id,
          redirect_to: data.redirect_to,
          name: data.redirect_name,
        };
      }

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
    let header = {};
    if (languages?.primary_language?.id) {
      header = {
        code: appData?.profile?.code,
        language: languages?.primary_language?.id,
      };
    } else {
      header = {
        code: appData?.profile?.code,
      };
    }

    actions
      .initApp(
        {},
        header,
        true,
        currencies?.primary_currency,
        languages?.primary_language,
      )
      .then((res) => {
        console.log(res, 'initApp');
      })
      .catch((error) => {
        updateState({ isRefreshing: false });
      }).finally(() => {
        homeData()
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ isRefreshing: true });
    initApiHit();
  };

  const selectedToggle = (type) => {
    actions.dineInData(type);
    updateState({
      selectedTabType: type,
    });
  };
  return (
    <View style={{
      flex: 1,
      backgroundColor: isDarkMode
        ? MyDarkTheme.colors.background
        : colors.white,
    }}>
      <TaxiHomeDashbord
        handleRefresh={() => handleRefresh()}
        bannerPress={(item) => bannerPress(item)}
        isHomeDataloding={isLoading || isHomeLoading}
        isRefreshing={isRefreshing}
        onPressCategory={(item) => onPressCategory(item)}
        selcetedToggle={selectedToggle}
        appMainData={memorizsedAppMainData}
        toggleData={memorizedAppData}
        location={memorizsedLocation}

        currentLocation={locationObj}
      />
    </View>
  );
}