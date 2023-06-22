import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { MaterialIndicator } from 'react-native-indicators';
import { useSelector } from 'react-redux';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { moderateScale } from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { showError } from '../../utils/helperFunctions';
import { getItem } from '../../utils/utils';
import { getAppCode } from './getAppCode';
import { IRootState } from './interfaces';
import styles from './styles';

export default function ShortCode() {
  const { deepLinkUrl, auth, themeColor, themeToggle } = useSelector((state: IRootState) => state?.initBoot || {});
  const theme = themeColor;
  const toggleTheme = themeToggle;
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let apiRes: any = useRef(null); // we using useRef to get latest values immediately

  const [loadingScreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    initApiHit();
  }, []);

  // royoorder: '245bae',
  // grub: '2f3120',
  // gusto: 'd1b1a0',
  // gokab: 'fb78f0', // live
  // // gokab: '578b33', // staging
  // suel: '638bd1',
  // elixir: '574467',
  // ace: '2d98b5',
  // punnet: 'd2cca0',
  // homeric: 'c8fbba',
  // voltaic: 'd8473d',
  // zest: '6865aa',
  // skyline: 'ce1ed6',
  // rentzy: 'd4fc07',
  // spa: '9022c6',
  // emart: '6ca3a4'

  const initApiHit = async () => {
    const lang = await getItem('setPrimaryLanguage');
    const prevCode = await getItem('saveShortCode');
    const appCode = !!prevCode ? prevCode : getAppCode();
    // const appCode = 'c8fbba'

    let header = {};
    if (!!lang?.primary_language?.id) {
      header = { code: appCode, language: lang?.primary_language?.id };
    } else {
      header = { code: appCode };
    }
    actions
      .initApp({}, header, false, null, null, true)
      .then(res => {
        console.log('header response--->', res);
        actions.saveShortCode(appCode);
        apiRes = res; // save response in reference to get the latest value immediately
        setLoadingScreen(false);
        navigateToNextScreen(res);
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

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      <View style={{ flex: 1 }}>
        <View style={styles.splashStyle}>
          <View style={{ position: 'absolute', bottom: moderateScale(100) }}>
            {loadingScreen && (
              <MaterialIndicator size={50} color={colors.greyMedium} />
            )}
          </View>
        </View>
        <Image source={{ uri: 'Splash' }} style={{ flex: 1, zIndex: -1 }} />
      </View>
    </View>
  );
}
