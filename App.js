import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useRef, useState } from 'react';
// import { Linking, Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import FlashMessage from 'react-native-flash-message';
import { MenuProvider } from 'react-native-popup-menu';
import { batch, Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import NoInternetModal from './src/Components/NoInternetModal';
import NotificationModal from './src/Components/NotificationModal';
import strings from './src/constants/lang';
import Routes from './src/navigation/Routes';
import actions from './src/redux/actions';
import { updateInternetConnection } from './src/redux/actions/auth';
import store from './src/redux/store';
import types from './src/redux/types';
import PrinterScreen from './src/Screens/PrinterConnection/PrinterScreen';

import { appIds } from './src/utils/constants/DynamicAppKeys';
import ForegroundHandler from './src/utils/ForegroundHandler';

import {
  notificationListener,
  requestUserPermission,
} from './src/utils/notificationService';
import { getLastBidInfo, getUserData } from './src/utils/utils';


import { InteractionManager, Platform } from 'react-native';

import { clearLastBidData } from './src/redux/actions/home';


if (__DEV__) {
  require('./ReactotronConfig');
}

const APP_BOOT_STORAGE_KEYS = [
  'appData',
  'location',
  'profileAddress',
  'cartItemCount',
  'saveUserAddress',
  'walletData',
  'saveSelectedAddress',
  'dine_in_type',
  'theme',
  'istoggle',
  'searchResult',
  'language',
  'saveShortCode',
];

const safeJsonParse = (value) => {
  if (value == null) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const getBootStorageData = async () => {
  const storedEntries = await AsyncStorage.multiGet(APP_BOOT_STORAGE_KEYS);

  return storedEntries.reduce((accumulator, [key, value]) => {
    accumulator[key] = safeJsonParse(value);
    return accumulator;
  }, {});
};

const getMinimumSplashDuration = () =>
  getBundleId() === appIds.masa ? 200 : 350;



const App = () => {
  const [internetConnection, setInternet] = useState(true);

  const ConnectBTFunction = async () => {
    await AsyncStorage.removeItem('autoConnectEnabled');

    const temp = new PrinterScreen();

    AsyncStorage.getItem('BleDevice2').then((res) => {
      const tt = JSON.parse(res);
      temp.connectBTFunc({
        address: tt.boundAddress,
        name: tt.name,
      });
    });
    AsyncStorage.removeItem('BleDevice2');
  };


  if (!__DEV__) {
    console.log = () => null;
  }



  //open screens based on deep link url
  const openSpecificScreenByDeeplink = async (deepLinkUrl) => {
    const userData = await getUserData();
    if (userData?.auth_token && deepLinkUrl) {

      actions.setRedirection('from_deepLinking');
      actions.setAppSessionData('shortcode');

    } else {
      setTimeout(() => {
        actions.setAppSessionData('on_login');
      }, 1000);
    }
  };


  useEffect(() => {
    let isMounted = true;

    const hydrateApp = async () => {
      const splashDelay = new Promise((resolve) => {
        setTimeout(resolve, getMinimumSplashDuration());
      });

      try {
        const { dispatch } = store;
        const [userData, lastBidData, storedBootData] = await Promise.all([
          getUserData(),
          getLastBidInfo(),
          getBootStorageData(),
        ]);
        await splashDelay;

        batch(() => {
          if (userData?.auth_token) {
            if (lastBidData?.expiryTime) {
              let expiryDate = new Date(lastBidData?.expiryTime);
              let currentDate = new Date();

              if (currentDate >= expiryDate) {
                clearLastBidData();
              } else {
                dispatch({
                  type: types.LAST_BID_INFO,
                  payload: lastBidData,
                });
              }
            }

            dispatch({
              type: types.LOGIN,
              payload: userData,
            });
          }

          if (storedBootData?.appData) {
            dispatch({
              type: types.APP_INIT,
              payload: storedBootData.appData,
            });
          }

          if (storedBootData?.location) {
            dispatch({
              type: types.LOCATION_DATA,
              payload: storedBootData.location,
            });
          }

          if (storedBootData?.profileAddress) {
            dispatch({
              type: types.PROFILE_ADDRESS,
              payload: storedBootData.profileAddress,
            });
          }

          if (storedBootData?.cartItemCount) {
            dispatch({
              type: types.CART_ITEM_COUNT,
              payload: storedBootData.cartItemCount,
            });
          }

          if (storedBootData?.saveUserAddress) {
            dispatch({
              type: types.SAVE_ALL_ADDRESS,
              payload: storedBootData.saveUserAddress,
            });
          }

          if (storedBootData?.walletData) {
            dispatch({
              type: types.WALLET_DATA,
              payload: storedBootData.walletData,
            });
          }

          if (storedBootData?.saveSelectedAddress) {
            dispatch({
              type: types.SELECTED_ADDRESS,
              payload: storedBootData.saveSelectedAddress,
            });
          }

          if (storedBootData?.dine_in_type) {
            dispatch({
              type: types.DINE_IN_DATA,
              payload: storedBootData.dine_in_type,
            });
          }

          const themeToggle = !!storedBootData?.istoggle;

          dispatch({
            type: types.THEME_TOGGLE,
            payload: themeToggle,
          });

          dispatch({
            type: types.THEME,
            payload: themeToggle ? false : !!storedBootData?.theme,
          });

          if (storedBootData?.searchResult) {
            dispatch({
              type: types.ALL_RECENT_SEARCH,
              payload: storedBootData.searchResult,
            });
          }

          if (storedBootData?.saveShortCode) {
            dispatch({
              type: types.SAVE_SHORT_CODE,
              payload: storedBootData.saveShortCode,
            });
          }
        });

        if (storedBootData?.language) {
          strings.setLanguage(storedBootData.language);
        }

        GoogleSignin.configure();
      } finally {
        if (isMounted) {
          SplashScreen.hide();
        }
      }
    };

    hydrateApp();

    const btAutoConnectTask = InteractionManager.runAfterInteractions(() => {
      if (Platform.OS === 'android') {
        AsyncStorage.getItem('autoConnectEnabled').then((res) => {
          if (res !== null) {
            ConnectBTFunction();
          }
        });
      }
    });

    return () => {
      isMounted = false;
      btAutoConnectTask.cancel();
    };
  }, []);

  useEffect(() => {
    notificationListener();

    const notificationPermissionTask = InteractionManager.runAfterInteractions(
      () => {
        requestUserPermission();
      },
    );

    return () => {
      notificationPermissionTask.cancel();
    };
  }, []);

  // Check internet connection
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const netStatus = state.isConnected;
      setInternet(netStatus);
      updateInternetConnection(netStatus);
    });
    return () => removeNetInfoSubscription();
  }, []);

  const { blurRef } = useRef();

  return (
    <SafeAreaProvider>
      <MenuProvider>
        <Provider ref={blurRef} store={store}>
          <ForegroundHandler />
          <Routes />
          <NotificationModal />
        </Provider>
      </MenuProvider>
      <FlashMessage position="top" />
      <NoInternetModal show={!internetConnection} />
    </SafeAreaProvider>
  );
};


export default App;
