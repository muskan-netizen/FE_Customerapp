import React, {useEffect, useRef, useState} from 'react';
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
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFun from './styles';
import commonStylesFun from '../../styles/commonStyles';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkIsAdmin} from '../../utils/utils';
import {useNavigation} from '@react-navigation/native';
import {cloneDeep, isEmpty} from 'lodash';
import TextInputWithUnderlineAndLabel from '../../Components/TextInputWithUnderlineAndLabel';
import {cameraHandler} from '../../utils/commonFunction';
import ActionSheet from 'react-native-actionsheet';
import {androidCameraPermission} from '../../utils/permissions';
import DocumentPicker from 'react-native-document-picker';
import codes from 'country-calling-code';
import * as RNLocalize from 'react-native-localize';
import RNOtpVerify from 'react-native-otp-verify';
import DeviceCountry, {
  TYPE_ANY,
  TYPE_TELEPHONY,
  TYPE_CONFIGURATION,
} from 'react-native-device-country';
var getPhonesCallingCodeAndCountryData = null;
DeviceCountry.getCountryCode()
  .then((result) => {
    console.log(result, 'getCountryCoderesult');
    // {"code": "BY", "type": "telephony"}
    getPhonesCallingCodeAndCountryData = codes.filter(
      (x) => x.isoCode2 == result.code.toUpperCase(),
    );
  })
  .catch((e) => {
    console.log(e);
  });

let addtionSelectedImageIndex = null;

let addtionSelectedImage = null;

export default function Signup({navigation}) {
  const navigation_ = useNavigation();
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const userData = useSelector((state) => state.auth.userData);
  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    themeColor,
    themeToggle,
    redirectedFrom,
  } = useSelector((state) => state?.initBoot);
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  const styles = stylesFun({fontFamily});

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  // var getPhonesCallingCodeAndCountryData = codes.filter(x => x.isoCode2 == RNLocalize.getCountry())
  const [state, setState] = useState({
    isLoading: false,
    callingCode:
      getPhonesCallingCodeAndCountryData &&
      getPhonesCallingCodeAndCountryData.length
        ? getPhonesCallingCodeAndCountryData[0].countryCodes[0]
        : appData?.profile.country?.phonecode
        ? appData?.profile?.country?.phonecode
        : '91',
    cca2:
      getPhonesCallingCodeAndCountryData &&
      getPhonesCallingCodeAndCountryData.length
        ? getPhonesCallingCodeAndCountryData[0].isoCode2
        : appData?.profile?.country?.code
        ? appData?.profile?.country?.code
        : 'IN',
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    deviceToken: '',
    referralCode: '',
    isShowPassword: false,
    addtionalTextInputs: [],
    addtionalImages: [],
    addtionalPdfs: [],
    appHashKey: 'WpV3+5pgxIH',
  });
  const {
    phoneNumber,
    callingCode,
    cca2,
    name,
    email,
    isLoading,
    password,
    referralCode,
    isShowPassword,
    addtionalTextInputs,
    addtionalImages,
    addtionalPdfs,
    appHashKey,
  } = state;
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const isValidData = () => {
    const error = validations({
      name: name,
      email: appData?.profile?.preferences?.verify_email
        ? email
        : 'abc@gmail.com',
      password: password,
      callingCode: callingCode,
      phoneNumber: appData?.profile?.preferences?.verify_phone
        ? phoneNumber
        : '78787878787',
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNOtpVerify.getHash()
        .then((res) => {
          updateState({
            appHashKey: res[0],
          });
        })
        .catch();
    }
    actions
      .userRegistrationDocument(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          addtionalTextInputs: res?.data.filter((x) => x?.file_type == 'Text'),
          addtionalImages: res?.data.filter((x) => x?.file_type == 'Image'),
          addtionalPdfs: res?.data.filter((x) => x?.file_type == 'Pdf'),
        });
      })
      .catch((err) => {
        console.log(err, 'err>>>>>');
      });
  }, []);

  /** SIGNUP API FUNCTION **/
  const onSignup = async () => {
    let formdata = new FormData();
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }

    if (!email && !phoneNumber) {
      showError(strings.ENTER_EMAIL_OR_PHONE_NUMBER_WITH_COUNTRY_CODE);
      return;
    }

    formdata.append('name', name);
    formdata.append('app_hash_key', appHashKey);
    formdata.append('phone_number', phoneNumber);
    formdata.append('dial_code', callingCode.toString());
    formdata.append('country_code', cca2);
    formdata.append('email', email);
    formdata.append('password', password);
    formdata.append('device_type', Platform.OS);
    formdata.append('device_token', DeviceInfo.getUniqueId());
    formdata.append('refferal_code', referralCode);
    formdata.append(
      'fcm_token',
      !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
    );

    var isRequired = true;
    if (!isEmpty(addtionalTextInputs)) {
      addtionalTextInputs.map((i, inx) => {
        if (i?.contents != '' && !!i?.contents) {
          formdata.append(i?.translations[0].slug, i?.contents);
        } else if (i?.is_required) {
          if (isRequired) {
            showError(
              `${
                strings.PLEASE_ENTER
              } ${i?.translations[0].name.toLowerCase()}`,
            );
            isRequired = false;
            return;
          }
        }
      });
    }

    let concatinatedArray = addtionalImages.concat(addtionalPdfs);
    if (!isEmpty(concatinatedArray)) {
      concatinatedArray.map((i, inx) => {
        if (i?.value) {
          formdata.append(
            i?.translations[0].slug,
            i?.file_type == 'Image'
              ? {
                  uri: i.fileData.path,
                  name: i.fileData.filename,
                  filename: i.fileData.filename,
                  type: i.fileData.mime,
                }
              : i?.fileData,
          );
        } else if (i?.is_required) {
          if (isRequired) {
            showError(
              `${
                strings.PLEASE_UPLOAD
              } ${i?.translations[0].name.toLowerCase()}`,
            );
            isRequired = false;
            return;
          }
        }
      });
    }

    if (!isRequired) {
      return;
    }
    console.log(formdata, 'formdata>><');
    updateState({isLoading: true});
    actions
      .signUpApi(formdata, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'THIS IS RESPONSE');
        console.log(userData, 'USERDATA AFTER THEN');
        updateState({isLoading: false});
        if (!!res.data) {
          if (
            !!res.data?.client_preference?.verify_email &&
            !!res.data?.client_preference?.verify_phone
          ) {
            if (
              !!res.data?.verify_details?.is_email_verified &&
              !!res.data?.verify_details?.is_phone_verified
            ) {
              checkIsAdmin(navigation_, navigation, res.data, redirectedFrom);
            } else {
              moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})();
            }
          } else if (
            !!res.data?.client_preference?.verify_email ||
            !!res.data?.client_preference?.verify_phone
          ) {
            if (
              !!res.data?.verify_details?.is_email_verified ||
              !!res.data?.verify_details?.is_phone_verified
            ) {
              checkIsAdmin(navigation_, navigation, res.data, redirectedFrom);
            } else {
              moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})();
            }
          } else {
            checkIsAdmin(navigation_, navigation, res.data, redirectedFrom);
          }
        }
      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.message || error?.error);
    console.log(error);
  };

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const showHidePassword = () => {
    updateState({isShowPassword: !isShowPassword});
  };

  let actionSheet = useRef();
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const handleDynamicTxtInput = (text, index, type) => {
    let data = cloneDeep(addtionalTextInputs);
    data[index].contents = text;
    data[index].id = type?.id;
    data[index].file_type = type?.file_type;
    data[index].label_name = type?.translations[0]?.name;
    updateState({addtionalTextInputs: data});
  };

  //Get TextInput
  const getTextInputField = (type, index) => {
    return (
      <BorderTextInput
        // secureTextEntry={true}
        placeholder={type?.translations[0]?.name || ''}
        onChangeText={(text) => handleDynamicTxtInput(text, index, type)}
      />
    );
  };

  //Update Images
  const updateImages = (type, index) => {
    addtionSelectedImageIndex = index;
    addtionSelectedImage = type;
    showActionSheet(false);
  };

  const getImageFieldView = (type, index) => {
    return (
      <View
        style={{
          marginRight: moderateScale(15),
          marginTop: moderateScale(10),
          width: moderateScale(95),
        }}>
        <TouchableOpacity
          onPress={() => updateImages(type, index)}
          style={styles.imageUpload}>
          {addtionalImages[index].value != undefined &&
          addtionalImages[index].value != null &&
          addtionalImages[index].value != '' ? (
            <Image
              source={{uri: addtionalImages[index].value}}
              style={styles.imageStyle2}
            />
          ) : (
            <Image source={imagePath?.icPhoto} />
          )}
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={{...styles.label3, minHeight: moderateScale(25)}}>
          {type?.translations[0]?.name}
          {type.is_required ? '*' : ''}
        </Text>
      </View>
    );
  };

  const getDoc = async (value, index) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      let data = cloneDeep(addtionalPdfs);
      if (res) {
        data[index].value = res[0].uri;
        data[index].filename = res[0].name;
        data[index].fileData = res[0];
        updateState({addtionalPdfs: data});
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const getPdfView = (type, index) => {
    return (
      <View
        style={{marginRight: moderateScale(20), marginTop: moderateScale(20)}}>
        <TouchableOpacity
          onPress={() => getDoc(type, index)}
          style={{
            ...styles.imageUpload,
            height: 100,
            width: 100,
            borderRadius: moderateScale(4),
            borderWidth: 1,
            borderColor: colors.blue,
          }}>
          <Text style={styles.uploadStyle}>
            {addtionalPdfs[index].value != undefined &&
            addtionalPdfs[index].value != null &&
            addtionalPdfs[index].value != ''
              ? `${addtionalPdfs[index].filename}`
              : `+ ${strings.UPLOAD}`}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.label3]}>
          {type?.translations[0]?.name}
          {type.is_required ? '*' : ''}
        </Text>
      </View>
    );
  };

  // this funtion use for camera handle
  const cameraHandle = async (index) => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus) {
      if (index == 0 || index == 1) {
        cameraHandler(index, {
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
        })
          .then((res) => {
            console.log(res, 'res>>><>>>');
            let data = cloneDeep(addtionalImages);

            data[addtionSelectedImageIndex].value = res?.sourceURL || res?.path;
            data[addtionSelectedImageIndex].fileData = res;
            // data[addtionSelectedImageIndex].filename1 =
            //   addtionSelectedImage?.translations[0]?.name;
            // data[addtionSelectedImageIndex].file_type =
            //   addtionSelectedImage?.file_type;
            // data[addtionSelectedImageIndex].id = addtionSelectedImage?.id;
            // data[addtionSelectedImageIndex].mime = res?.mime;

            updateState({addtionalImages: data});
          })
          .catch((err) => {
            console.log(err, 'err>>>>');
          });
      }
    }
  };

  return (
    <WrapperContainer
      isLoadingB={isLoading}
      source={loaderOne}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <View
        style={{
          height: moderateScaleVertical(60),
          paddingHorizontal: moderateScale(24),
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{alignSelf: 'flex-start'}}>
          <Image
            source={
              appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.back
            }
            style={
              isDarkMode
                ? {
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    tintColor: MyDarkTheme.colors.text,
                  }
                : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
            }
          />
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          <View style={{marginTop: moderateScaleVertical(50)}}>
            <Text
              style={
                isDarkMode
                  ? [styles.header, {color: MyDarkTheme.colors.text}]
                  : styles.header
              }>
              {strings.CREATE_YOUR_ACCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                  : styles.txtSmall
              }>
              {strings.ENTER_DETAILS_BELOW}
            </Text>
          </View>

          <View
            style={{
              marginTop: moderateScaleVertical(50),
              marginHorizontal: moderateScale(24),
            }}>
            <BorderTextInput
              onChangeText={_onChangeText('name')}
              placeholder={strings.YOUR_NAME}
              value={name}
              returnKeyType={'next'}
            />
            <BorderTextInput
              // autoCapitalize={'none'}
              onChangeText={_onChangeText('email')}
              placeholder={strings.YOUR_EMAIL}
              value={email}
              keyboardType={'email-address'}
              returnKeyType={'next'}
            />
            <PhoneNumberInput
              onCountryChange={_onCountryChange}
              onChangePhone={(phoneNumber) =>
                updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
              }
              cca2={cca2}
              phoneNumber={phoneNumber}
              callingCode={state.callingCode}
              placeholder={strings.YOUR_PHONE_NUMBER}
              keyboardType={'phone-pad'}
              color={isDarkMode ? MyDarkTheme.colors.text : null}
            />
            <View style={{height: moderateScaleVertical(20)}} />
            <BorderTextInput
              secureTextEntry={isShowPassword ? false : true}
              onChangeText={_onChangeText('password')}
              placeholder={strings.ENTER_PASSWORD}
              value={password}
              rightIcon={
                password.length > 0
                  ? !isShowPassword
                    ? imagePath.icShowPassword
                    : imagePath.icHidePassword
                  : false
              }
              onPressRight={showHidePassword}
              isShowPassword={isShowPassword}
              rightIconStyle={{}}
              returnKeyType={'next'}
            />
            <BorderTextInput
              onChangeText={_onChangeText('referralCode')}
              placeholder={
                appData?.profile?.preferences?.referral_code
                  ? appData?.profile?.preferences?.referral_code
                  : strings.ENTERREFERALCODE
              }
              value={referralCode}
              returnKeyType={'next'}
            />

            {!isEmpty(addtionalTextInputs) &&
              addtionalTextInputs.map((item, index) => {
                return getTextInputField(item, index);
              })}

            {!isEmpty(addtionalImages) && (
              <View style={styles.viewStyleForUploadImage}>
                {addtionalImages.map((item, index) => {
                  return getImageFieldView(item, index);
                })}
              </View>
            )}

            {!isEmpty(addtionalPdfs) && (
              <View style={styles.viewStyleForUploadImage}>
                {addtionalPdfs.map((item, index) => {
                  return getPdfView(item, index);
                })}
              </View>
            )}

            <GradientButton
              onPress={onSignup}
              marginTop={moderateScaleVertical(10)}
              btnText={strings.SIGNUP_AN_ACCOUNT}
            />
          </View>
          <View style={styles.bottomContainer}>
            <Text
              style={
                isDarkMode
                  ? {...styles.txtSmall, color: MyDarkTheme.colors.text}
                  : {...styles.txtSmall, color: colors.textGreyLight}
              }>
              {strings.ALREADY_HAVE_AN_ACCOUNT}
              <Text
                onPress={moveToNewScreen(navigationStrings.LOGIN)}
                style={{
                  color: themeColors.primary_color,
                  fontFamily: fontFamily.futuraBtHeavy,
                }}>
                {strings.LOGIN}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => cameraHandle(index)}
      />
    </WrapperContainer>
  );
}
