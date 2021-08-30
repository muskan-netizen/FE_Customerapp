import {cloneDeep} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
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
import validator from '../../utils/validations';
import stylesFunc from './styles';

export default function Login({navigation}) {
  var clonedState = {};
  const [state, setState] = useState({
    email: '',
    password: '',
    isLoading: false,
  });

  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const {apple_login, fb_login, twitter_login, google_login} = useSelector(
    (state) => state?.initBoot?.appData?.profile?.preferences,
  );

  const fontFamily = appStyle?.fontSizeData;
  //CLone deep all the states
  useEffect(() => {
    clonedState = cloneDeep(state);
  }, []);

  //Update states
  const updateState = (data) => setState((state) => ({...state, ...data}));
  //Styles in app
  const styles = stylesFunc({themeColors, fontFamily});

  //all states used in this screen
  const {email, password, isLoading} = state;

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  //On change textinput
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  //Validate form
  const isValidData = () => {
    const error = validator({email, password});
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  //Login api fucntion
  const _onLogin = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    let data = {
      email: email,
      password: password,
      device_type: Platform.OS,
      device_token: DeviceInfo.getUniqueId(),
    };
    updateState({isLoading: true});
    actions
      .login(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
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

  //Get your cart detail
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
  //Error handling in api
  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.message || error?.error);
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
        console.log(res, 'google');
        if (res?.user) {
          _saveSocailLogin(res.user, 'google');
        } else {
          updateState({isLoading: false});
        }
      })
      .catch((err) => {
        console.log(err, 'error in gmail login');
        updateState({isLoading: false});
      });
  };
  const _responseInfoCallback = (error, result) => {
    updateState({isLoading: true});
    if (error) {
      updateState({isLoading: false});
    } else {
      if (result && result?.id) {
        console.log(result, 'fbresult');
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
    _twitterSignIn()
      .then((res) => {
        if (res) {
          _saveSocailLogin(res, 'twitter');
        }
      })
      .catch((err) => {});
  };

  return (
    <WrapperContainer isLoadingB={isLoading} source={loaderOne}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{alignSelf: 'flex-start'}}>
          <Image
            source={imagePath.back}
            style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
          />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
          marginHorizontal: moderateScale(24),
        }}>
        <View style={{height: moderateScaleVertical(48)}} />
        <Text style={styles.header}>{strings.LOGIN_YOUR_ACCOUNT}</Text>
        <Text style={styles.txtSmall}>{strings.ENTE_REGISTERED_EMAIL}</Text>
        <View style={{height: moderateScaleVertical(50)}} />
        <BorderTextInput
          onChangeText={_onChangeText('email')}
          placeholder={strings.YOUR_EMAIL}
          value={email}
          keyboardType={'email-address'}
          autoCapitalize={'none'}
        />
        <BorderTextInput
          onChangeText={_onChangeText('password')}
          placeholder={strings.ENTER_PASSWORD}
          value={password}
          secureTextEntry={true}
        />
        <View style={styles.forgotContainer}>
          <Text
            onPress={moveToNewScreen(navigationStrings.FORGOT_PASSWORD)}
            style={{
              fontFamily: fontFamily.bold,
              color: themeColors.primary_color,
            }}>
            {' '}
            {strings.FORGOT}
          </Text>
        </View>

        <GradientButton
          containerStyle={{marginTop: moderateScaleVertical(10)}}
          onPress={_onLogin}
          btnText={strings.LOGIN_ACCOUNT}
        />
        <View style={{marginTop: moderateScaleVertical(50)}}>
          {!!google_login || !!fb_login || !!twitter_login || !!apple_login ? (
            <View style={styles.socialRow}>
              <View style={styles.hyphen} />
              <Text style={styles.orText}>{strings.OR_LOGIN_WITH}</Text>
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
        <View style={styles.bottomContainer}>
          <Text style={{...styles.txtSmall, color: colors.textGreyLight}}>
            {strings.ALREADY_HAVE_AN_ACCOUNT}
            <Text
              onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
              style={{
                fontFamily: fontFamily.bold,
                color: themeColors.primary_color,
              }}>
              {' '}
              {strings.SIGN_UP}
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
