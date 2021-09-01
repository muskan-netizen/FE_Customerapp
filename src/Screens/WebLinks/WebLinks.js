import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import {cloneDeep} from 'lodash';

import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError} from '../../utils/helperFunctions';
import stylesFun from './styles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import strings from '../../constants/lang';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import ActionSheet from 'react-native-actionsheet';
import {cameraHandler} from '../../utils/commonFunction';

export default function WebLinks({navigation, route}) {
  console.log(route, 'route>>>');
  const paramData = route?.params;
  const [state, setState] = useState({
    isLoading: false,
    htmlContent: null,
    callingCode: '91',
    cca2: 'IN',
    phoneNumber: '',
    fullname: '',
    email: '',
    title: '',
    password: '',
    confirm_password: '',
    description: '',
    vender_name: '',
    address: '',
    website: '',
    imageArray: [],
  });
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  const {isLoading, htmlContent} = state;

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  useEffect(() => {
    updateState({isLoading: true});
    getCmsPageDetail();
  }, []);

  //Get list of all payment method
  const getCmsPageDetail = () => {
    let data = {};
    data['page_id'] = paramData && paramData?.id;
    actions
      .getCmsPageDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log('Cms page detail', res);
        updateState({isLoadingB: false, isLoading: false, isRefreshing: false});
        if (res && res?.data?.description) {
          updateState({htmlContent: res?.data?.description});
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };

  /***********Remove Image from rating */
  const _removeImageFromList = (selectdImage) => {
    console.log(selectdImage, 'selectdImage>>>');
    if (selectdImage?.id) {
      console.log(selectdImage?.id, 'selectdImage?.id');
      let copyArrayImages = cloneDeep(imageArray);
      console.log(copyArrayImages, 'copyArrayImages');
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id,
      );
      updateState({
        imageArray: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(imageArray);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        imageArray: copyArrayImages,
      });
    }
  };
  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    {
      !!userData?.auth_token
        ? imageArray.length == 5
          ? showError('Maximum photo selection limit reached')
          : actionSheet.current.show()
        : null;
    }
  };
  // this funtion use for camera handle
  const cameraHandle = (index) => {
    if (index == 0 || index == 1) {
      cameraHandler(index, {
        width: 300,
        height: 400,
        cropping: false,
        cropperCircleOverlay: false,
        compressImageQuality: 0.5,
        mediaType: 'photo',
      })
        .then((res) => {
          console.log(res, 'res?.data');
          if (res && (res?.sourceURL || res?.path)) {
            console.log(res, 'response');
            let file = {
              image_id: Math.random(),
              name: res?.filename,
              type: res?.mime,
              uri: res?.sourceURL || res?.path,
            };
            let find = imageArray.find((x) => x?.name == res?.filename);
            if (find) {
              showError('Image is already uploaded');
            } else {
              updateState({imageArray: [...imageArray, file]});
            }
          }
        })
        .catch((err) => {});
    }
  };
  const {cca2, phoneNumber, imageArray} = state;
  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={
          appData?.profile?.code === shortCodes.capcorp
            ? imagePath.backArrow
            : imagePath.back
        }
        centerTitle={(paramData && paramData?.title) || ''}
        headerStyle={{backgroundColor: Colors.white}}
      />
      <View style={{...commonStyles.headerTopLine}} />

      <ScrollView>
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              marginHorizontal: moderateScale(20),
            }}>
            {/* {!!(paramData && paramData?.url) && (
              <WebView source={{uri: paramData?.url}} />
            )} */}
            {htmlContent && <HTMLView value={htmlContent} />}
          </View>
          <View
            style={{
              marginTop: moderateScaleVertical(30),
              marginHorizontal: moderateScale(24),
            }}>
            <View style={{marginBottom: moderateScaleVertical(12)}}>
              <Text
                style={{
                  fontSize: textScale(18),
                  fontFamily: fontFamily.medium,
                }}>
                {strings.PERSONAL_DETAILS}
              </Text>
            </View>
            <BorderTextInput
              placeholder={strings.YOUR_NAME}
              onChangeText={_onChangeText('fullname')}
              containerStyle={styles.containerStyle}
            />

            <BorderTextInput
              placeholder={strings.YOUR_EMAIL}
              onChangeText={_onChangeText('email')}
              containerStyle={styles.containerStyle}
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
              containerStyle={styles.containerStyle}
            />

            <BorderTextInput
              placeholder={strings.ENTER_TITLE}
              label={'Title'}
              onChangeText={_onChangeText('title')}
              containerStyle={styles.containerStyle}
            />

            <BorderTextInput
              secureTextEntry={true}
              placeholder={strings.ENTER_PASSWORD}
              onChangeText={_onChangeText('password')}
              containerStyle={styles.containerStyle}
            />
            <BorderTextInput
              secureTextEntry={true}
              placeholder={strings.CONFIRM_PASSWORD}
              onChangeText={_onChangeText('confirm_password')}
              containerStyle={styles.containerStyle}
            />
            <View style={{marginBottom: moderateScaleVertical(12)}}>
              <Text
                style={{
                  fontSize: textScale(18),
                  fontFamily: fontFamily.medium,
                }}>
                {strings.STORE_DETAILS}
              </Text>
            </View>
            <BorderTextInput
              placeholder={strings.VENDER_NAME}
              onChangeText={_onChangeText('vender_name')}
              containerStyle={styles.containerStyle}
            />
            <BorderTextInput
              placeholder={strings.DESCRIPTION}
              onChangeText={_onChangeText('description')}
              containerStyle={styles.containerStyle}
            />
            <BorderTextInput
              placeholder={strings.ADDRESS}
              onChangeText={_onChangeText('address')}
              containerStyle={styles.containerStyle}
            />
            <BorderTextInput
              placeholder={strings.WEBSITE}
              onChangeText={_onChangeText('website')}
              containerStyle={styles.containerStyle}
            />
            <View style={{marginTop: moderateScaleVertical(20)}}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    width: width / 2 - moderateScale(22),
                  }}>
                  <Text
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginBottom: moderateScaleVertical(12),
                      fontFamily: fontFamily.medium,
                    }}>
                    {strings.UPLOAD_LOGO}
                  </Text>
                  {imageArray && imageArray.length ? (
                    imageArray.map((i, inx) => {
                      return (
                        <ImageBackground
                          source={{
                            uri: i.uri,
                          }}
                          style={styles.imageOrderStyle}
                          imageStyle={styles.imageOrderStyle}>
                          <View style={styles.viewOverImage}>
                            <View
                              style={{
                                position: 'absolute',
                                top: -10,
                                right: 30,
                              }}>
                              <TouchableOpacity
                                onPress={() => _removeImageFromList(i)}>
                                <Image source={imagePath.icRemoveIcon} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ImageBackground>
                      );
                    })
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 0.2,
                        height: height / 10,
                        marginHorizontal: moderateScale(12),
                      }}>
                      <TouchableOpacity
                        onPress={showActionSheet}
                        style={[
                          styles.viewOverImage2,
                          {borderStyle: 'dashed'},
                        ]}>
                        <Image
                          source={imagePath.icCamIcon}
                          style={{tintColor: colors.themeColor}}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    width: width / 2 - moderateScale(22),
                  }}>
                  <Text
                    style={{
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginBottom: moderateScaleVertical(12),
                      fontFamily: fontFamily.medium,
                    }}>
                    {strings.UPLOAD_BANNER}
                  </Text>
                  {imageArray && imageArray.length ? (
                    imageArray.map((i, inx) => {
                      return (
                        <ImageBackground
                          source={{
                            uri: i.uri,
                          }}
                          style={styles.imageOrderStyle}
                          imageStyle={styles.imageStyle}>
                          <View style={styles.viewOverImage}>
                            <View
                              style={{
                                position: 'absolute',
                                top: -10,
                                right: 30,
                              }}>
                              <TouchableOpacity
                                onPress={() => _removeImageFromList(i)}>
                                <Image source={imagePath.icRemoveIcon} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </ImageBackground>
                      );
                    })
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 0.2,
                        height: height / 10,
                        marginHorizontal: moderateScale(12),
                      }}>
                      <TouchableOpacity
                        onPress={showActionSheet}
                        style={[
                          styles.viewOverImage2,
                          {borderStyle: 'dashed'},
                        ]}>
                        <Image
                          source={imagePath.icCamIcon}
                          style={{tintColor: colors.themeColor}}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <GradientButton
              marginTop={moderateScaleVertical(10)}
              btnText={strings.SUBMIT}
            />
          </View>
        </View>
        <ActionSheet
          ref={actionSheet}
          // title={'Choose one option'}
          options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => cameraHandle(index)}
        />
      </ScrollView>
    </WrapperContainer>
  );
}
