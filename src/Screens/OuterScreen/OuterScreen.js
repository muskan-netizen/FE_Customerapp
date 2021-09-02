import React, {useState} from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import GradientButton from '../../Components/GradientButton';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {hitSlopProp} from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';

import {
  fbLogin,
  googleLogin,
  handleAppleLogin,
  _twitterSignIn,
} from '../../utils/socialLogin';
import DeviceInfo from 'react-native-device-info';

import stylesFunc from './styles';
import Header from '../../Components/Header';
export default function OuterScreen({navigation}) {
  const [state, setState] = useState({
    getLanguage: '',
    isLoading: false,
  });
  const {
    appData,
    currencies,
    themeColors,
    languages,
    shortCodeStatus,
    appStyle,
  } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const {getLanguage, isLoading} = state;
  const {apple_login, fb_login, twitter_login, google_login} =
    appData?.profile?.preferences;

  const homePageLayout = appStyle?.homePageLayout;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  //Saving login user to backend
  const _saveSocailLogin = (socialLoginData, type) => {
    let data = {};
    data['name'] =
      socialLoginData?.name ||
      socialLoginData?.userName ||
      socialLoginData?.fullName?.givenName;
    data['auth_id'] =
      socialLoginData?.id ||
      socialLoginData?.userID ||
      socialLoginData?.identityToken;
    data['phone_number'] = '';
    data['email'] = socialLoginData?.email;
    data['device_type'] = Platform.OS;
    data['device_token'] = DeviceInfo.getUniqueId();

    let query = '';
    if (
      type == 'facebook' ||
      type == 'twitter' ||
      type == 'google' ||
      type == 'apple'
    ) {
      query = type;
    }
    actions
      .socailLogin(`/${query}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res>>>SOCIAL');
        if (!!res.data) {
          !!res.data?.client_preference?.verify_email ||
          !!res.data?.client_preference?.verify_phone
            ? !!res.data?.verify_details?.is_email_verified &&
              !!res.data?.verify_details?.is_phone_verified
              ? navigation.push(navigationStrings.DRAWER_ROUTES)
              : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})()
            : navigation.push(navigationStrings.DRAWER_ROUTES);
        }
        updateState({isLoading: false});
        getCartDetail();
      })
      .catch(errorMethod);
  };

  //error handling
  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.error || error?.message);
  };

  const getCartDetail = () => {
    actions
      .getCartDetail(
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
      })
      .catch((error) => {});
  };

  //Apple Login Support
  const openAppleLogin = () => {
    updateState({isLoading: false});
    handleAppleLogin()
      .then((res) => {
        _saveSocailLogin(res, 'apple');
        // updateState({isLoading: false});
      })
      .catch((err) => {
        updateState({isLoading: false});
      });
  };

  //Gmail Login Support
  const openGmailLogin = () => {
    updateState({isLoading: true});
    googleLogin()
      .then((res) => {
        if (res?.user) {
          _saveSocailLogin(res.user, 'google');
        } else {
          updateState({isLoading: false});
        }
      })
      .catch((err) => {
        updateState({isLoading: false});
      });
  };

  const _responseInfoCallback = (error, result) => {
    updateState({isLoading: true});
    if (error) {
      updateState({isLoading: false});
    } else {
      if (result && result?.id) {
        _saveSocailLogin(result, 'facebook');
      } else {
        updateState({isLoading: false});
      }
    }
  };
  //FacebookLogin
  const openFacebookLogin = () => {
    fbLogin(_responseInfoCallback);
  };

  //twitter login
  const openTwitterLogin = () => {
    // updateState({isLoading: true});
    _twitterSignIn()
      .then((res) => {
        if (res) {
          _saveSocailLogin(res, 'twitter');
        } else {
          updateState({isLoading: false});
        }
      })
      .catch((err) => {
        updateState({isLoading: false});
      });
  };

  const onGuestLogin = () => {
    actions.userLogout();
    getCartDetail();
    navigation.push(navigationStrings.DRAWER_ROUTES);
  };
  return (
    <WrapperContainer isLoadingB={isLoading} source={loaderOne}>
      {shortCodeStatus && (
        <Header
          leftIcon={imagePath.back}
          onPressLeft={() =>
            // navigation.push(navigationStrings.SHORT_CODE, {
            //   shortCodeParam: true,
            // })
            navigation.goBack()
          }
          // rightIcon={imagePath.cartShop}
          headerStyle={{backgroundColor: colors.white}}
        />
      )}

      <View style={{marginTop: moderateScaleVertical(100), flex: 1}}>
        <Text style={styles.header}>{strings.CREATE_YOUR_ACCOUNT}</Text>
        <View style={{marginHorizontal: moderateScale(24)}}>
          <View style={{marginHorizontal: moderateScaleVertical(30)}}>
            <Text numberOfLines={2} style={styles.txtSmall}>
              {appData?.profile?.preferences?.home_tag_line
                ? appData?.profile?.preferences?.home_tag_line
                : ''}
            </Text>
          </View>
          <GradientButton
            containerStyle={{marginTop: moderateScaleVertical(50)}}
            btnText={strings.CREATE_AN_ACCOUNT}
            onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
          />
          <ButtonWithLoader
            btnStyle={styles.guestBtn}
            btnTextStyle={{color: themeColors.primary_color}}
            onPress={() => onGuestLogin()}
            btnText={strings.GUEST_LOGIN}
          />
          <View style={{marginTop: moderateScaleVertical(50)}}>
            {!!google_login ||
            !!fb_login ||
            !!twitter_login ||
            !!apple_login ? (
              <View style={styles.socialRow}>
                <View style={styles.hyphen} />
                <Text style={styles.orText}>{strings.OR_SIGNUP_WITH}</Text>
                <View style={styles.hyphen} />
              </View>
            ) : null}

            <View style={styles.socialRowBtn}>
              {!!google_login && (
                <TouchableOpacity
                  onPress={() => openGmailLogin()}
                  style={{marginHorizontal: moderateScale(20)}}>
                  <Image source={imagePath.google} />
                </TouchableOpacity>
              )}
              {!!fb_login && (
                <TouchableOpacity
                  onPress={() => openFacebookLogin()}
                  style={{marginHorizontal: moderateScale(20)}}>
                  <Image source={imagePath.fb} />
                </TouchableOpacity>
              )}
              {!!twitter_login && (
                <TouchableOpacity
                  onPress={() => openTwitterLogin()}
                  style={{marginHorizontal: moderateScale(20)}}>
                  <Image source={imagePath.twitterIcon} />
                </TouchableOpacity>
              )}

              {!!apple_login && Platform.OS == 'ios' && (
                <TouchableOpacity
                  onPress={() => openAppleLogin()}
                  style={{marginHorizontal: moderateScale(20)}}>
                  <Image source={imagePath.apple} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...styles.txtSmall,
                color: colors.textGreyLight,
                marginTop: 0,
              }}>
              {strings.ALREADY_HAVE_AN_ACCOUNT}
            </Text>
            <TouchableOpacity
              hitSlop={hitSlopProp}
              onPress={moveToNewScreen(navigationStrings.LOGIN)}>
              <Text
                style={{
                  color: themeColors.primary_color,
                  // lineHeight:24,
                  fontFamily: fontFamily.bold,
                }}>
                {' '}
                {strings.LOGIN}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </WrapperContainer>
  );
}
