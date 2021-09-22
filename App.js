import Clipboard from '@react-native-community/clipboard';
import NetInfo from '@react-native-community/netinfo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import NoInternetModal from './src/Components/NoInternetModal';
import strings from './src/constants/lang';
import Container from './src/library/toastify-react-native';
import * as NavigationService from './src/navigation/NavigationService';
import navigationStrings from './src/navigation/navigationStrings';
import Routes from './src/navigation/Routes';
import { updateInternetConnection } from './src/redux/actions/auth';
import store from './src/redux/store';
import types from './src/redux/types';
import { moderateScaleVertical, width } from './src/styles/responsiveSize';
import { getParameterByName, getUrlRoutes } from './src/utils/helperFunctions';
import {requestUserPermission, notificationListener } from './src/utils/notificationService';
import { getItem, getUserData, setItem } from './src/utils/utils';


const App = () => {
  const [internetConnection, setInternet] = useState(true);

  // deep linking

  async function handleDynamicLink(deepLinkUrl) {
    console.log(deepLinkUrl, 'deepLinkUrl');
    if (deepLinkUrl != null) {
      setItem('deepLinkUrl', deepLinkUrl);
      // let routeName = getUrlRoutes(deepLinkUrl, 1);
      // if (routeName === 'vendor') {
      var data = deepLinkUrl?.split('=').pop();
      let removePer = decodeURI(data)
      let sendingData = JSON.parse(removePer)
      console.log(sendingData, 'split url');
      // return;
      setTimeout(() => {
        NavigationService.navigate(navigationStrings.TAB_ROUTES, {
          screen: navigationStrings.HOMESTACK,
          params: {
            screen: navigationStrings.PRODUCT_LIST,
            params: {
              data: sendingData
            },
          },
        });
      }, 1800);
    }
  }


  useEffect(() => {
    Linking.getInitialURL().then((link) => handleDynamicLink(link));
    Linking.addEventListener('url', (event) => handleDynamicLink(event.url));
    return () => {
      Linking.removeEventListener('url', (event) =>
        handleDynamicLink(event.url),
      );
    };
  }, [handleDynamicLink]);

  const isDarkMode = useDarkMode();
  useEffect(() => {
    //stop splahs screen from loading
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
  }, []);


  const notificationConfig = () =>{
      requestUserPermission()
      notificationListener()
  }

  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      notificationConfig()

      const { dispatch } = store;
      if (userData && !!userData.auth_token) {
        dispatch({
          type: types.LOGIN,
          payload: userData,
        });
      }

      const getAppData = await getItem('appData');
      dispatch({
        type: types.APP_INIT,
        payload: getAppData,
      });

      const locationData = await getItem('location');
      dispatch({
        type: types.LOCATION_DATA,
        payload: locationData,
      });
      const profileAddress = await getItem('profileAddress');

      dispatch({
        type: types.PROFILE_ADDRESS,
        payload: profileAddress,
      });

      const cartItemCount = await getItem('cartItemCount');
      if (cartItemCount) {
        dispatch({
          type: types.CART_ITEM_COUNT,
          payload: cartItemCount,
        });
      }

      const allUserAddress = await getItem('saveUserAddress');
      if (allUserAddress) {
        dispatch({
          type: types.SAVE_ALL_ADDRESS,
          payload: allUserAddress,
        });
      }

      const selectedAddress = await getItem('saveSelectedAddress');
      if (selectedAddress) {
        dispatch({
          type: types.SELECTED_ADDRESS,
          payload: selectedAddress,
        });
      }

      const dine_in_type = await getItem('dine_in_type');
      if (dine_in_type) {
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
          payload: JSON.parse(themeToggle),
        });
      } else {
        dispatch({
          type: types.THEME_TOGGLE,
          payload: JSON.parse(themeToggle),
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
      console.log(searchResult, 'searchResult');
      if (searchResult) {
        dispatch({
          type: types.ALL_RECENT_SEARCH,
          payload: searchResult,
        });
      }

      //Language
      const getLanguage = await getItem('language');
      if (getLanguage) {
        strings.setLanguage(getLanguage);
      }

      //saveShortCode
      const saveShortCode = await getItem('saveShortCode');
      if (saveShortCode) {
        dispatch({
          type: types.SAVE_SHORT_CODE,
          payload: saveShortCode,
        });
      }
      //Gamil configure
      GoogleSignin.configure();

      // clip copy issue
      if (__DEV__) {
        Clipboard.setString('');
      }
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

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Routes />
      </Provider>
      <Container
        width={width - 20}
        position="top"
        duration={2000}
        positionValue={moderateScaleVertical(20)}
      />
      <FlashMessage position="top" />
      <NoInternetModal show={!internetConnection} />
    </SafeAreaProvider>
  );
};

export default App;
