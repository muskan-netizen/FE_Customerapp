import Clipboard from '@react-native-community/clipboard';
import React, {useEffect, useState} from 'react';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useSelector} from 'react-redux';
import strings from './src/constants/lang';
import Routes from './src/navigation/Routes';
import store from './src/redux/store';
import types from './src/redux/types';
import {getItem, getUserData, setItem} from './src/utils/utils';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import NetInfo from '@react-native-community/netinfo';
import {updateInternetConnection} from './src/redux/actions/auth';
import NoInternetModal from './src/Components/NoInternetModal';
import SplashScreen from 'react-native-splash-screen';
import Container from './src/library/toastify-react-native';
import {moderateScaleVertical, width} from './src/styles/responsiveSize';
import fontFamily from './src/styles/fontFamily';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from './src/styles/theme';
import colors from './src/styles/colors';
import {Linking} from 'react-native';
import {navigate} from './src/navigation/NavigationService';
import {getParameterByName, getUrlRoutes} from './src/utils/helperFunctions';
import navigationStrings from './src/navigation/navigationStrings';

const App = () => {
  const [internetConnection, setInternet] = useState(true);

  // deep linking

  // async function handleDynamicLink(deepLinkUrl) {
  //   if (deepLinkUrl != null) {
  //     setItem('deepLinkUrl', deepLinkUrl);
  //     let id = getParameterByName('id', deepLinkUrl);
  //     let routeName = getUrlRoutes(deepLinkUrl, 1);
  //     if (routeName === 'vendor') {
  //       const item = {};
  //       item['id'] = id;
  //       // moveToNewScreen(navigationStrings.VENDOR_DETAIL, item)();

  //       setTimeout(() => {
  //         navigate(navigationStrings.VENDOR_DETAIL, item);
  //       }, 2000);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   Linking.getInitialURL().then((link) => handleDynamicLink(link));

  //   Linking.addEventListener('url', handleDynamicLink);
  //   return () => {
  //     Linking.removeEventListener('url', handleDynamicLink);
  //   };
  // }, []);

  const isDarkMode = useDarkMode();
  useEffect(() => {
    //stop splahs screen from loading
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  useEffect(() => {
    (async () => {
      const userData = await getUserData();

      const {dispatch} = store;
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
    return () => {};
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
        //height={moderateScaleVertical(40)}
        position="top"
        duration={2000}
        // textStyle={{
        //   fontFamily: fontFamily.circularMedium,
        //   marginLeft: RFPercentage(2),
        //   marginRight: RFPercentage(2),
        //   fontSize: RFPercentage(2.5),
        // }}
        positionValue={moderateScaleVertical(20)}
      />
      <FlashMessage position="top" />
      <NoInternetModal show={!internetConnection} />
    </SafeAreaProvider>
  );
};

export default App;
