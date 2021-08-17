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
import AutoUpLabelTxtInput from '../../Components/AutoUpLabelTxtInput';
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
  textScale,
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

export default function Login2({navigation}) {
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
    console.log(socialLoginData, 'socialLoginData>>>');
    let data = {};
    data['name'] = socialLoginData?.name || socialLoginData?.userName;
    data['auth_id'] = socialLoginData?.id || socialLoginData?.userID;
    data['phone_number'] = '';
    data['email'] = socialLoginData?.email;
    data['device_type'] = Platform.OS;
    data['device_token'] = 'sadassa';
    let query = '';
    if (type == 'facebook' || type == 'twitter' || type == 'google') {
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
        updateState({isLoading: false});
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
      <View
        style={{
          height: moderateScaleVertical(80),
          flexDirection: 'column',
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: moderateScaleVertical(78),
            alignItems: 'center',
            paddingHorizontal: moderateScale(24),
          }}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <Image
              source={imagePath.backArrow}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.black,
              fontSize: textScale(16),
              fontFamily: fontFamily.bold,
              flex: 1,
              textAlign: 'center',
            }}>
            {strings.LOGIN_YOUR_ACCOUNT}
          </Text>
        </View>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: colors.grey2,
            elevation: 2,
          }}></View>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
          marginHorizontal: moderateScale(24),
        }}>
        <View style={{height: moderateScaleVertical(10)}} />
        <Text style={styles.txtSmall}>{strings.ENTE_REGISTERED_EMAIL}</Text>
        <View style={{height: moderateScaleVertical(25)}} />

        <AutoUpLabelTxtInput
          value={email}
          label={strings.YOUR_EMAIL}
          onChangeText={_onChangeText('email')}
          keyboardType={'email-address'}
          autoCapitalize={'none'}
        />

        <AutoUpLabelTxtInput
          value={password}
          label={strings.ENTER_PASSWORD}
          onChangeText={_onChangeText('password')}
          containerStyle={{marginTop: moderateScale(15)}}
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
          containerStyle={{
            marginTop: moderateScaleVertical(10),
            height: moderateScale(55),
          }}
          onPress={_onLogin}
          borderRadius={moderateScale(15)}
          btnText={strings.LOGIN_ACCOUNT}
        />
        <View
          style={{
            marginTop: moderateScaleVertical(20),
            marginBottom: 10,
          }}>
          {!!google_login || !!fb_login || !!twitter_login || !!apple_login ? (
            <View style={styles.socialRow}>
              <Text style={styles.orText2}>{'or'}</Text>
            </View>
          ) : null}
          <View style={{flexDirection: 'column'}}>
            {!!google_login && (
              <TouchableOpacity
                onPress={() => openGmailLogin()}
                style={{
                  borderWidth: 1,
                  borderColor: colors.borderColorD,
                  borderRadius: moderateScale(15),
                  paddingVertical: moderateScale(10),
                  paddingHorizontal: moderateScale(10),
                  marginTop: moderateScale(25),
                  flexDirection: 'row',
                }}>
                <Image
                  source={imagePath.ic_google2}
                  style={{width: 35, height: 35}}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    flex: 0.9,
                    fontFamily: fontFamily.regular,
                  }}>
                  {strings.CONTINUE_GOOGLE}
                </Text>
              </TouchableOpacity>
            )}
            {!!fb_login && (
              <TouchableOpacity
                onPress={() => openFacebookLogin()}
                style={{
                  borderWidth: 1,
                  borderColor: colors.borderColorD,
                  borderRadius: moderateScale(15),
                  paddingVertical: moderateScale(10),
                  paddingHorizontal: moderateScale(10),
                  marginTop: moderateScale(10),
                  flexDirection: 'row',
                }}>
                <Image
                  source={imagePath.ic_fb2}
                  style={{width: 35, height: 35}}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    flex: 0.9,
                    fontFamily: fontFamily.regular,
                  }}>
                  {strings.CONTINUE_FACEBOOK}
                </Text>
              </TouchableOpacity>
            )}
            {!!twitter_login && (
              <TouchableOpacity
                onPress={() => openTwitterLogin()}
                style={{
                  borderWidth: 1,
                  borderColor: colors.borderColorD,
                  borderRadius: moderateScale(15),
                  paddingVertical: moderateScale(10),
                  paddingHorizontal: moderateScale(10),
                  marginTop: moderateScale(10),
                  flexDirection: 'row',
                }}>
                <Image
                  source={imagePath.ic_twitter2}
                  style={{width: 35, height: 35}}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    flex: 0.9,
                    fontFamily: fontFamily.regular,
                  }}>
                  {strings.CONTINUE_TWITTER}
                </Text>
              </TouchableOpacity>
            )}

            {!!apple_login && Platform.OS == 'ios' && (
              <TouchableOpacity
                onPress={() => openAppleLogin()}
                style={{
                  borderWidth: 1,
                  borderColor: colors.borderColorD,
                  borderRadius: moderateScale(15),
                  paddingVertical: moderateScale(10),
                  paddingHorizontal: moderateScale(10),
                  marginTop: moderateScale(10),
                  flexDirection: 'row',
                }}>
                <Image
                  source={imagePath.ic_apple2}
                  style={{width: 35, height: 35}}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    flex: 0.85,
                    fontFamily: fontFamily.regular,
                  }}>
                  {strings.CONTINUE_APPLE}
                </Text>
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
