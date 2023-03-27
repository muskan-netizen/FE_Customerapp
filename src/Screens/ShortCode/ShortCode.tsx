import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, View} from 'react-native';
import {getBundleId} from 'react-native-device-info';
import {useDarkMode} from 'react-native-dynamic';
import {MaterialIndicator} from 'react-native-indicators';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {moderateScale} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import {showError} from '../../utils/helperFunctions';
import {getItem} from '../../utils/utils';
import {getAppCode} from './getAppCode';
import styles from './styles';
import {IRootState} from './interfaces';

export default function ShortCode() {
  const {deepLinkUrl, auth, themeColor, themeToggle} = useSelector(
    (state: IRootState) => state?.initBoot || {},
  );
  const theme = themeColor;
  const toggleTheme = themeToggle;
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let apiRes: any = useRef(null); // we using useRef to get latest values immediately

  const [loadingScreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    initApiHit();
  }, []);

  const initApiHit = async () => {
    const lang = await getItem('setPrimaryLanguage');
    const prevCode = await getItem('saveShortCode');
    // const appCode = !!prevCode ? prevCode : getAppCode();


 const appCode = "0fcc84"
    let header = {};
    if (!!lang?.primary_language?.id) {
      header = {code: appCode, language: lang?.primary_language?.id};
    } else {
      header = {code: appCode};
    }

    console.log(appCode, 'appCode>>>>>');
    actions
      .initApp({}, header, false, null, null, true)
      .then(res => {
        console.log('header response--->', res);
        actions.saveShortCode(appCode);
        apiRes = res; // save response in reference to get the latest value immediately
        if (
          getBundleId() == appIds.masa ||
          getBundleId() == appIds.muvpod ||
          getBundleId() == appIds.hezniTaxi ||
          getBundleId() == appIds.parcelworks ||
          getBundleId() == appIds.stabex
        ) {
          setLoadingScreen(false);
        } else {
          setLoadingScreen(false);
          navigateToNextScreen(res);
        }
      })
      .catch(error => {
        console.log(error, 'error>>>>>error');
        setTimeout(() => {
          showError(error?.message || error?.error);
        }, 500);
      });
  };
  const navigateToNextScreen = useCallback(
    (res: any) => {
      console.log('finally navigate screen+++', res);
      getItem('firstTime').then(el => {
        if (!el && !!res?.data && res?.data?.dynamic_tutorial.length > 0) {
          actions.setAppSessionData('app_intro');
        } else {
          if (!!auth?.userData && !!auth?.userData?.auth_token) {
            actions.setAppSessionData('guest_login');
          } else if (deepLinkUrl && !auth?.userData?.auth_token) {
            actions.setAppSessionData('on_login');
          } else {
            actions.setAppSessionData('guest_login');
          }
        }
      });
    },
    [auth, deepLinkUrl],
  );
  const _renderSplash = useCallback(() => {
    switch (getBundleId()) {
      case appIds.masa:
        return animatedSplash();
      case appIds.muvpod:
        return animatedSplash();
      case appIds.hezniTaxi:
        return animatedSplash();
      case appIds.parcelworks:
        return animatedSplash();
        case appIds.stabex:
          return animatedSplash();
      default:
        return imageSplash();
    }
  }, []);
  const animationVideo = useCallback(() => {
    switch (getBundleId()) {
      case appIds?.masa:
        return imagePath.masa;
      case appIds?.muvpod:
        return imagePath.muvpod;
      case appIds?.hezniTaxi:
        return imagePath.HezniSplash;
      case appIds?.parcelworks:
        return imagePath.parcelWorksSplash;
        case appIds?.stabex:
          return imagePath.stabex;
    }
  }, []);
  const imageSplash = useCallback(() => {
    return (
      <View style={{flex: 1}}>
        <View style={styles.splashStyle}>
          <View style={{position: 'absolute', bottom: moderateScale(100)}}>
            {loadingScreen && (
              <MaterialIndicator size={50} color={colors.greyMedium} />
            )}
          </View>
        </View>
        <Image source={{uri: 'Splash'}} style={{flex: 1, zIndex: -1}} />
      </View>
    );
  }, [loadingScreen]);
  
  const animatedSplash = () => {
    return (
      <View style={styles.videoView}>
        <Video
          source={animationVideo()}
          style={styles.videoStyle}
          resizeMode={getBundleId() == appIds.muvpod ? 'contain' : 'cover'}
          onEnd={onVideoDurationEnded}
          muted={true}
        />
      </View>
    );
  };
  const onVideoDurationEnded = useCallback(() => {
    checkNavigationState(true);
  }, []);
  const checkNavigationState = (videoEnd: boolean) => {
    if (videoEnd) {
      navigateToNextScreen(apiRes);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      {_renderSplash()}
    </View>
  );
}
