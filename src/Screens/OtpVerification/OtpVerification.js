import React, {useEffect, useState} from 'react';
import {I18nManager, Image, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
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
import {
  otpTimerCounter,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFunc from './styles';

export default function OtpVerification({navigation}) {
  const [state, setState] = useState({
    timer: 30,
    phoneOTP: '',
    emailOTP: '',
  });
  const updateState = (data) => setState((state) => ({...state, ...data}));
  useEffect(() => {
    let timerId;
    if (timer > 0) {
      timerId = setTimeout(() => {
        updateState({timer: timer - 1});
      }, 1000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [state.timer]);

  const _onResend = () => {
    let data = {};
    actions
      .resendOTP(data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        showSuccess(res.success);

        updateState({isLoading: false});
      })
      .catch(errorMethod);
    updateState({timer: 30});
  };

  const userData = useSelector((state) => state?.auth?.userData);
  const {appData, appStyle, themeColors} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {});
  };

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const {timer, phoneOTP, emailOTP} = state;
  const isValidData = (otp) => {
    const error = validations({
      otp,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const onVerify = (type, otp) => {
    const checkValid = isValidData(otp);
    if (!checkValid) {
      return;
    }

    let data = {
      type: type,
      otp: otp,
    };
    updateState({isLoading: true});
    actions
      .verifyAccount(data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        showSuccess(res.message);
        if (userData) {
          userData?.client_preference?.verify_email ||
          userData?.client_preference?.verify_phone
            ? userData?.verify_details?.is_email_verified ||
              userData?.verify_details?.is_phone_verified
              ? navigation.push(navigationStrings.DRAWER_ROUTES)
              : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})()
            : navigation.push(navigationStrings.DRAWER_ROUTES);
        }
        updateState({isLoading: false});
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.message || error?.error);
    console.log(error);
  };

  return (
    <WrapperContainer>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: moderateScaleVertical(20),
          paddingHorizontal: moderateScale(24),
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{alignSelf: 'flex-start'}}>
          <Image
            source={imagePath.back}
            style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.push(navigationStrings.DRAWER_ROUTES)}>
          <Text style={styles.skipText}>{strings.SKIP}</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            marginTop: moderateScaleVertical(50),
            marginHorizontal: moderateScale(24),
          }}>
          <Text style={styles.header}>{strings.OTP_VERIFICATION}</Text>
          <Text style={styles.txtSmall}>{strings.ENTER_OTP_SENT}</Text>
          <View style={{height: moderateScaleVertical(50)}} />

          {!!userData?.client_preference?.verify_phone ? (
            !userData?.verify_details?.is_phone_verified && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: moderateScaleVertical(20),
                }}>
                <BorderTextInput
                  placeholder={strings.ENTER_OTP}
                  containerStyle={{flex: 0.7}}
                  marginBottom={0}
                  onChangeText={_onChangeText('phoneOTP')}
                  value={phoneOTP}
                />
                <TouchableOpacity
                  onPress={() => onVerify('phone', phoneOTP)}
                  style={{
                    flex: 0.27,
                    backgroundColor: !userData?.verify_details
                      ?.is_phone_verified
                      ? themeColors.primary_color
                      : colors.white,
                    paddingVertical: moderateScaleVertical(8),
                    paddingHorizontal: moderateScale(8),
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: !userData?.verify_details?.is_phone_verified
                        ? colors.white
                        : colors.green,
                      fontFamily: fontFamily.bold,
                      fontSize: textScale(12),
                    }}>
                    {!userData?.verify_details?.is_phone_verified
                      ? strings.VERIFY_PHONE
                      : strings.VERIFIED}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View></View>
          )}

          {!!userData?.client_preference?.verify_email ? (
            !userData?.verify_details?.is_email_verified && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: moderateScaleVertical(20),
                }}>
                <BorderTextInput
                  placeholder={strings.ENTER_OTP}
                  containerStyle={{flex: 0.7}}
                  marginBottom={0}
                  onChangeText={_onChangeText('emailOTP')}
                  value={emailOTP}
                />
                <TouchableOpacity
                  onPress={() => onVerify('email', emailOTP)}
                  style={{
                    flex: 0.27,
                    backgroundColor: !userData?.verify_details
                      ?.is_email_verified
                      ? themeColors.primary_color
                      : colors.white,
                    paddingVertical: moderateScaleVertical(8),
                    paddingHorizontal: moderateScale(8),
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: !userData?.verify_details?.is_email_verified
                        ? colors.white
                        : colors.green,
                      fontFamily: fontFamily.bold,
                      fontSize: textScale(12),
                    }}>
                    {!userData?.verify_details?.is_email_verified
                      ? strings.VERIFY_EMAIL
                      : strings.VERIFIED}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View></View>
          )}

          {/* <GradientButton
            onPress={() => navigation.navigate(navigationStrings.TAB_ROUTES)}
            containerStyle={{marginTop: moderateScaleVertical(10)}}
            btnText={strings.VERIFY_ACCOUNT}
          /> */}
          {timer > 0 ? (
            <View style={styles.bottomContainer}>
              <Text style={{...styles.txtSmall, color: colors.textGreyLight}}>
                {strings.RESEND_CODE_IN}
                <Text
                  style={{
                    color: themeColors.primary_color,
                    fontFamily: fontFamily.bold,
                  }}>
                  {`${otpTimerCounter(timer)} min`}
                </Text>
              </Text>
            </View>
          ) : (
            <View style={styles.bottomContainer}>
              <Text style={{...styles.txtSmall, color: colors.textGreyLight}}>
                {strings.DIDNT_GET_OTP}
                <Text
                  onPress={_onResend}
                  style={{
                    color: colors.themeColor,
                    fontFamily: fontFamily.bold,
                  }}>
                  {` ${strings.RESEND_CODE}`}
                </Text>
              </Text>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
