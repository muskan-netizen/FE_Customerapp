import React, {useEffect, useRef, useState} from 'react';
import {AppState, Platform} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import Routes from './src/Navigation/Routes';
import store from './src/redux/store';
import types from './src/redux/types';
import fontFamily from './src/styles/fontFamily';
import {moderateScale, textScale} from './src/styles/responsiveSize';
import {
  notificationListener,
  requestUserPermission,
} from './src/utils/notificationServices';
import {getItem, getUserData, setItem} from './src/utils/utils';

import dynamicLinks from '@react-native-firebase/dynamic-links';
import NavigationService from './src/Navigation/NavigationService';
import navigationStrings from './src/constants/navigationStrings';
import {showError} from './src/helper/helperFunctions';
import actions from './src/redux/actions';
//aws-amplify
import Amplify from 'aws-amplify';
import awsConfig from './src/aws-exports';
Amplify.configure(awsConfig);

const {dispatch} = store;

const App = () => {
  async function handleDynamicLink(link) {
    if (!!link?.url.includes('reviewId')) {
      let getId = link.url?.split('=').pop();
      await onGuest();
      setTimeout(() => {
        console.log('im get id', getId);
        NavigationService.navigate(navigationStrings.POST_DETAIL, {
          data: {_id: getId},
        });
      }, 2000);
      console.log('recieved link', link);
    } else {
      if (!!link?.url) {
        let getId = link.url?.split('=').pop();
        actions.sharedPostId(getId);
        actions.postTypeChange('ALL');
        await onGuest();
        setTimeout(() => {
          NavigationService.navigate(navigationStrings.HOME, {postId: getId});
        }, 2000);
        console.log('recieved link', link);
      } else {
        // showError("!!!Oops this link are broken")
      }
    }
  }

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        handleDynamicLink(link);
      });
    const linkingListener = dynamicLinks().onLink(handleDynamicLink);
    return () => {
      linkingListener();
    };
  }, []);

  const onGuest = async () => {
    await setItem('isSkip', true);
    actions.isSkip(true);
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const init = async () => {
    try {
      const userData = await getUserData();
      const isSkip = await getItem('isSkip');
      console.log('is skip value', isSkip);
      // const isFirstTime = await getFirstTime();
      if (userData && !!userData.access_token) {
        console.log('enter');
        dispatch({
          type: types.LOGIN,
          payload: userData,
        });
      }
      if (!!isSkip) {
        console.log('enter');
        dispatch({
          type: types.IS_SKIP,
          payload: isSkip,
        });
      }
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
      // if (!!isFirstTime) {
      // actions.isFirstTime(true)
      // }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await requestUserPermission();
      await notificationListener();
      init();
    })();
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    appState.current = nextAppState;
    if (appState.current == 'background') {
      console.log('Yess');
      // TrackPlayer.reset()
    }
    setAppStateVisible(appState.current);
    console.log('AppState', appState.current);
  };

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Routes />
        <FlashMessage
          titleStyle={{
            marginRight: moderateScale(5),
            fontFamily: fontFamily.medium,
            fontSize: textScale(16),
            marginTop: Platform.OS == 'ios' ? 0 : 16,
          }}
          position="top"
        />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
