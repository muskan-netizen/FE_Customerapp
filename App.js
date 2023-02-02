// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Clipboard from '@react-native-community/clipboard';
import NetInfo from '@react-native-community/netinfo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useRef, useState } from 'react';
// import { Linking, Platform } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import NoInternetModal from './src/Components/NoInternetModal';
import NotificationModal from './src/Components/NotificationModal';
import strings from './src/constants/lang';
import Routes from './src/navigation/Routes';
import { updateInternetConnection } from './src/redux/actions/auth';
import store from './src/redux/store';
import types from './src/redux/types';
// import PrinterScreen from './src/Screens/PrinterConnection/PrinterScreen';
import { getBundleId } from 'react-native-device-info';
import { MenuProvider } from 'react-native-popup-menu';
import actions from './src/redux/actions';

import { appIds } from './src/utils/constants/DynamicAppKeys';
import ForegroundHandler from './src/utils/ForegroundHandler';
// import { getUrlRoutes } from './src/utils/helperFunctions';
import {
  notificationListener,
  requestUserPermission,
} from './src/utils/notificationService';
import { getItem, getUserData, setItem } from './src/utils/utils';


const App = () => {
  const isDarkMode = useDarkMode();
  const [internetConnection, setInternet] = useState(true);

  // const ConnectBTFunction = async () => {
  //   await AsyncStorage.removeItem('autoConnectEnabled');

  //   const temp = new PrinterScreen();

  //   AsyncStorage.getItem('BleDevice2').then((res) => {
  //     const tt = JSON.parse(res);
  //     temp.connectBTFunc({
  //       address: tt.boundAddress,
  //       name: tt.name,
  //     });
  //   });
  //   AsyncStorage.removeItem('BleDevice2');
  // };




  // async function handleDynamicLink(deepLinkUrl) {
  //   console.log(deepLinkUrl, 'deepLinkUrldeepLinkUrl');
  //   if (deepLinkUrl != null) {
  //     setItem('deepLinkUrl', deepLinkUrl)
  //       .then((res) => {
  //         actions.setDeeplinkUrl(deepLinkUrl);
  //       })
  //       .catch((error) => {
  //         console.log(error, 'erroror');
  //       });

  //     let routeName = getUrlRoutes(deepLinkUrl, 2);
  //     console.log(routeName, 'routeName');
  //     if (routeName === 'vendor') {
  //       return;
  //     } else if (routeName === 'track') {
  //       openSpecificScreenByDeeplink(deepLinkUrl);
  //     }
  //   }
  // }

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
    //stop splashs screen from loading
    if (
      getBundleId() == appIds.masa ||
      getBundleId() == appIds.muvpod ||
      getBundleId() == appIds.hezniTaxi ||
      getBundleId() == appIds.flank
    ) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 200);
    } else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
    }

    // AsyncStorage.getItem('autoConnectEnabled').then((res) => {
    //   if (res !== null) {
    //     if (Platform.OS == 'android') {
    //       ConnectBTFunction();
    //     }
    //   }
    // });
  }, []);

  const notificationConfig = () => {
    requestUserPermission();
    notificationListener();
  };

  useEffect(() => {
    (async () => {
      const userData = await getUserData();

      notificationConfig();

      const { dispatch } = store;
      if (userData && !!userData?.auth_token) {
        dispatch({
          type: types.LOGIN,
          payload: userData,
        });
      }
      const getAppData = await getItem('appData');

      if (!!getAppData && !!getAppData?.themeColors) {
        setPrimaryColor(getAppData.themeColors.primary_color);
      }
      if (!!getAppData) {
        dispatch({
          type: types.APP_INIT,
          payload: getAppData,
        });
      }

      const locationData = await getItem('location');
      if(!!locationData){
      dispatch({
        type: types.LOCATION_DATA,
        payload: locationData,
      });
    }

      const profileAddress = await getItem('profileAddress');

      if(!!profileAddress){
      dispatch({
        type: types.PROFILE_ADDRESS,
        payload: profileAddress,
      });
    }

      const cartItemCount = await getItem('cartItemCount');

      if (!!cartItemCount) {
        dispatch({
          type: types.CART_ITEM_COUNT,
          payload: cartItemCount,
        });
      }

      const allUserAddress = await getItem('saveUserAddress');

      if (!!allUserAddress) {
        dispatch({
          type: types.SAVE_ALL_ADDRESS,
          payload: allUserAddress,
        });
      }

      const walletData = await getItem('walletData');
      if (!!walletData) {
        dispatch({
          type: types.WALLET_DATA,
          payload: walletData,
        });
      }

      const selectedAddress = await getItem('saveSelectedAddress');
      if (!!selectedAddress) {
        dispatch({
          type: types.SELECTED_ADDRESS,
          payload: selectedAddress,
        });
      }

      const dine_in_type = await getItem('dine_in_type');
      if (!!dine_in_type) {
        dispatch({
          type: types.DINE_IN_DATA,
          payload: dine_in_type,
        });
      }
      const theme = await getItem('theme');
      const themeToggle = await getItem('istoggle');
      if (JSON.parse(themeToggle)) {
        dispatch({
          type: types.THEME,
          payload: isDarkMode,
        });
        dispatch({
          type: types.THEME_TOGGLE,
          payload: !!themeToggle? JSON.parse(themeToggle): {},
        });
      } else {
        dispatch({
          type: types.THEME_TOGGLE,
          payload: !!themeToggle? JSON.parse(themeToggle): {},
        });
        if (JSON.parse(theme)) {
          dispatch({
            type: types.THEME,
            payload: true,
          });
        } else {
          dispatch({
            type: types.THEME,
            payload: false,
          });
        }
      }

      const searchResult = await getItem('searchResult');

      if (!!searchResult) {
        dispatch({
          type: types.ALL_RECENT_SEARCH,
          payload: searchResult,
        });
      }

      //Language
      const getLanguage = await getItem('language');
      if (!!getLanguage) {
        strings.setLanguage(getLanguage);
      }

      //saveShortCode
      const saveShortCode = await getItem('saveShortCode');
      if (!!saveShortCode) {
        dispatch({
          type: types.SAVE_SHORT_CODE,
          payload: saveShortCode,
        });
      }
      //Gamil configure
      // GoogleSignin.configure();

      // clip copy issue
      // if (__DEV__) {
      //   Clipboard.setString('');
      // }
    })();
    return () => { };
  }, []);

  //Check internet connection
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

export default App
