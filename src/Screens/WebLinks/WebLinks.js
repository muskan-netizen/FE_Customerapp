import {cloneDeep} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {useDarkMode} from 'react-native-dark-mode';
import DeviceInfo from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import HTMLView from 'react-native-htmlview';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
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
import {MyDarkTheme} from '../../styles/theme';
import {cameraHandler} from '../../utils/commonFunction';
import {showError} from '../../utils/helperFunctions';
import {androidCameraPermission} from '../../utils/permissions';
import validator from '../../utils/validations';
import stylesFun from './styles';

let clickedIndx = 0;
let clickedItem = {};

export default function WebLinks({navigation, route}) {
  let actionSheet = useRef();

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );

  const paramData = route?.params;
  const [state, setState] = useState({
    isLoading: false,
    htmlContent: null,
    callingCode: userData?.dial_code
      ? userData?.dial_code
      : appData?.profile?.country?.phonecode
      ? appData?.profile?.country?.phonecode
      : '91',
    cca2: userData?.cca2
      ? userData?.cca2
      : appData?.profile?.country?.code
      ? appData?.profile?.country?.code
      : 'IN',
    phoneNumber: '',
    fullname: '',
    email: '',
    title: '',
    password: '',
    confirm_password: '',
    description: '',
    vendor_name: '',
    address: '',
    website: '',
    imageArray: [],
    imageArrayBanner: [],
    isDineIn: false,
    isTakeaway: false,
    isDelivery: false,
    sfcLicense: [],
    fssaiLicense: [],
    vendorRegDocs: [],
    vendorRegisterationDocs: [],
    driverRegDocs: [],
    driverPic: '',
    driverName: '',
    driverPhoneNumber: '',
    driverTypes: [
      {id: 1, name: 'Employee', isSelected: true},
      {id: 2, name: 'Freelancer', isSelected: false},
    ],
    driverTags: '',
    driverSelectedTeam: '',
    driverTransportDetails: '',
    driverUUID: '',
    driverLicencePlate: '',
    driverColor: '',
    driverTransportType: '',
    driverRegistrationDocs: [],
  });
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data

  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  const {
    cca2,
    phoneNumber,
    imageArray,
    isDineIn,
    isDelivery,
    isTakeaway,
    imageArrayBanner,
    fssaiLicense,
    sfcLicense,
    fullname,
    email,
    password,
    confirm_password,
    vendor_name,
    address,
    vendorRegDocs,
    isLoading,
    htmlContent,
    vendorRegisterationDocs,
    driverRegDocs,
    driverPic,
    driverName,
    driverPhoneNumber,
    driverTypes,
    driverTags,
    driverSelectedTeam,
    driverTransportDetails,
    driverUUID,
    driverLicencePlate,
    driverColor,
    driverTransportType,
    driverRegistrationDocs,
  } = state;

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  useEffect(() => {
    updateState({isLoading: true});
    getCmsPageDetail();
  }, []);

  // //Get list of all payment method
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
        updateState({
          htmlContent: res?.data?.page_detail?.primary?.description,
          vendorRegDocs: res?.data?.vendor_registration_documents,
          driverRegDocs: res?.data,
        });
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

  /***********Remove Image from logo */
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

  /// remove banner

  const _removeBannerFromList = (selectdImage) => {
    console.log(selectdImage, 'selectdImage>>>');
    if (selectdImage?.id) {
      console.log(selectdImage?.id, 'selectdImage?.id');
      let copyArrayImages = cloneDeep(imageArrayBanner);
      console.log(copyArrayImages, 'copyArrayImages');
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id,
      );
      updateState({
        imageArrayBanner: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(imageArrayBanner);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        imageArrayBanner: copyArrayImages,
      });
    }
  };
  /// remove fssaiLicence

  const _removeFssaiLicence = (selectdImage) => {
    console.log(selectdImage, 'selectdImage>>>');
    if (selectdImage?.id) {
      console.log(selectdImage?.id, 'selectdImage?.id');
      let copyArrayImages = cloneDeep(fssaiLicense);
      console.log(copyArrayImages, 'copyArrayImages');
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id,
      );
      updateState({
        fssaiLicense: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(fssaiLicense);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        fssaiLicense: copyArrayImages,
      });
    }
  };

  /// remove sfcLicence

  // const _removeSfcLicence = (selectdImage) => {
  //   console.log(selectdImage, 'selectdImage>>>');
  //   if (selectdImage?.id) {
  //     console.log(selectdImage?.id, 'selectdImage?.id');
  //     let copyArrayImages = cloneDeep(sfcLicense);
  //     console.log(copyArrayImages, 'copyArrayImages');
  //     copyArrayImages = copyArrayImages.filter(
  //       (x) => x?.id !== selectdImage?.id,
  //     );
  //     updateState({
  //       sfcLicense: copyArrayImages,
  //       remove_image_ids: [...remove_image_ids, selectdImage?.id],
  //     });
  //   } else {
  //     let copyArrayImages = cloneDeep(sfcLicense);
  //     copyArrayImages = copyArrayImages.filter(
  //       (x) => x?.image_id !== selectdImage?.image_id,
  //     );
  //     updateState({
  //       sfcLicense: copyArrayImages,
  //     });
  //   }
  // };

  // upload Banner function
  const uploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images || DocumentPicker.types.doc],
      });
      console.log(res, 'response');
      let file = {
        image_id: Math.random(),
        name: res[0]?.name,
        type: res[0]?.type,
        uri: res[0]?.uri,
      };
      console.log(file, 'file');
      updateState({imageArrayBanner: [...imageArrayBanner, file]});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('cancel');
      } else {
        throw err;
      }
    }
  };
  // upload logo function
  const uploadLogo = async () => {
    console.log('dffdffdf');
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images || DocumentPicker.types.doc],
      });
      console.log(res, 'response');
      let file = {
        image_id: Math.random(),
        name: res[0]?.name,
        type: res[0]?.type,
        uri: res[0]?.uri,
      };

      updateState({imageArray: [...imageArray, file]});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log('cancel');
      } else {
        throw err;
      }
    }
  };
  // upload FSSAI License function
  // const fssaiuploadFile = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.pdf],
  //     });

  //     let file = {
  //       image_id: Math.random(),
  //       name: res[0]?.name,
  //       type: res[0]?.type,
  //       uri: res[0]?.uri,
  //     };
  //     console.log(file, 'file');
  //     updateState({fssaiLicense: [...fssaiLicense, file]});
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker, exit any dialogs or menus and move on
  //       console.log('cancel');
  //     } else {
  //       throw err;
  //     }
  //   }
  // };
  // upload SFC License function
  // const sfcuploadFile = async () => {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.images || DocumentPicker.types.doc],
  //     });
  //     console.log(res, 'response');
  //     let file = {
  //       image_id: Math.random(),
  //       name: res[0]?.name,
  //       type: res[0]?.type,
  //       uri: res[0]?.uri,
  //     };
  //     console.log(file, 'file');
  //     updateState({sfcLicense: [...sfcLicense, file]});
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker, exit any dialogs or menus and move on
  //       console.log('cancel');
  //     } else {
  //       throw err;
  //     }
  //   }
  // };

  const isValidData = () => {
    const error = validator({
      name: fullname,
      email: email,
      phoneNumber: phoneNumber,
      newPassword: password,
      confirmPassword: confirm_password,
      vendorName: vendor_name,
      vendorAddress: address,
    });

    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const _onSubmit = () => {
    // const checkValid = isValidData();
    // if (!checkValid) {
    //   return;
    // }

    if (paramData?.slug === 'driver-registration') {
      const data = {};
      data['name'] = driverName;
      data['phone_number'] = driverPhoneNumber;
      data['type'] = 'Employee';
      data['dialCode'] = '91';
      data['team'] = 11;
      data['tags'] = [4, 2];
      data['make_model'] = '2000';
      data['uid'] = driverUUID;
      data['plate_number'] = driverLicencePlate;
      data['color'] = driverColor;
      data['vehicle_type_id'] = 1;

      driverRegistrationDocs.map((item, indx) => {
        data[item?.item?.name] =
          item?.item?.file_type == 'Text' ? item?.fileData : item?.fileData;

        // if(item?.item?.is_required && ){

        // }
      });
      console.log(data, 'sendData');
      console.log(vendorRegisterationDocs, 'vendorRegisterationDocs');

      actions
        .driverRegisteration(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
          'Content-Type': 'multipart/form-data',
        })
        .then((res) => {
          console.log(res, 'serverResponse');
        })
        .catch(errorMethod);
    } else {
      const data = {};
      data['full_name'] = fullname;
      data['email'] = email;
      data['phone_number'] = phoneNumber;
      data['dialCode'] = '91';
      data['password'] = password;
      data['confirm_password'] = confirm_password;
      data['name'] = vendor_name;
      data['address'] = address;
      data['check_conditions'] = 1;
      data['countryData'] = 'IN';

      vendorRegisterationDocs.map((item, indx) => {
        data[item?.item?.primary?.slug] =
          item?.item?.file_type == 'Text' ? item?.fileData : item?.fileData;

        // if(item?.item?.is_required && ){

        // }
      });
      console.log(data, 'sendData');
      console.log(vendorRegisterationDocs, 'vendorRegisterationDocs');

      actions
        .vendorRegisteration(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
          'Content-Type': 'multipart/form-data',
        })
        .then((res) => {
          console.log(res, 'serverResponse');
        })
        .catch(errorMethod);
    }
  };

  console.log(driverRegistrationDocs, 'vendorRegisterationDocsAry');
  const _dynamicTextInputChange = (item, indx, mainItem) => {
    if (paramData?.slug === 'driver-registration') {
      const driverRegistrationDocsAry = [...driverRegistrationDocs];
      driverRegistrationDocsAry[indx] = {
        item: mainItem,
        fileData: item,
      };
      updateState({
        driverRegistrationDocs: driverRegistrationDocsAry,
      });
    } else {
      const vendorRegisterationDocsAry = [...vendorRegisterationDocs];
      vendorRegisterationDocsAry[indx] = {
        item: mainItem,
        fileData: item,
      };
      updateState({
        vendorRegisterationDocs: vendorRegisterationDocsAry,
      });
    }
  };

  const uploadDocs = async (type, item, indx) => {
    if (type == 'Pdf') {
      try {
        const res = await DocumentPicker.pick({
          type: DocumentPicker.types.pdf,
        });

        if (paramData?.slug === 'driver-registration') {
          const driverRegistrationDocsAry = [...driverRegistrationDocs];
          driverRegistrationDocsAry[indx] = {
            item: item,
            fileData: res[0],
          };
          updateState({
            driverRegistrationDocs: driverRegistrationDocsAry,
          });
        } else {
          const vendorRegPdfImgAry = [...vendorRegisterationDocs];
          vendorRegPdfImgAry[indx] = {
            item: item,
            fileData: res[0],
          };
          updateState({
            vendorRegisterationDocs: vendorRegPdfImgAry,
          });
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('cancel');
        } else {
          throw err;
        }
      }
    } else {
      clickedIndx = indx;
      clickedItem = item;
      actionSheet.current.show();
    }
  };

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
            if (paramData?.slug === 'driver-registration') {
              updateState({
                driverPic: res,
              });
            } else {
              const vendorRegPdfImgAry = [...vendorRegisterationDocs];
              vendorRegPdfImgAry[clickedIndx] = {
                item: clickedItem,
                fileData: res,
              };

              updateState({
                vendorRegisterationDocs: vendorRegPdfImgAry,
              });
            }
          })
          .catch((err) => {});
      }
    }
  };

  const _renderFields = ({item, index}) => {
    return (
      <View
        style={
          {
            // marginHorizontal: moderateScale(10),
          }
        }>
        <Text style={{fontFamily: fontFamily.regular}}>
          {item.primary?.name}
        </Text>

        <View>
          {item?.file_type == 'Pdf' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: moderateScaleVertical(8),
              }}>
              <TouchableOpacity
                onPress={() => uploadDocs(item?.file_type, item, index)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.greyMedium,
                  borderRadius: moderateScale(5),
                }}>
                <Text
                  style={{
                    marginHorizontal: moderateScale(8),
                    marginVertical: moderateScaleVertical(8),
                  }}>
                  {strings.CHOOSE_FILE}
                </Text>
              </TouchableOpacity>
              <Text style={{fontFamily: fontFamily.regular, marginLeft: 6}}>
                {paramData?.slug === 'driver-registration'
                  ? driverRegistrationDocs[index]?.fileData
                    ? driverRegistrationDocs[index]?.fileData?.name
                    : strings.NO_FILE_CHOSEN
                  : vendorRegisterationDocs[index]?.fileData
                  ? vendorRegisterationDocs[index]?.fileData?.name
                  : strings.NO_FILE_CHOSEN}
              </Text>
            </View>
          )}

          {item?.file_type == 'Image' && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => uploadDocs(item?.file_type, item, index)}
              style={{
                ...styles.imageView,
                marginVertical: moderateScale(5),
                marginHorizontal: 0,
              }}>
              <Image
                source={
                  !!vendorRegisterationDocs[index]?.fileData?.avatar?.path
                    ? {
                        uri: vendorRegisterationDocs[index]?.fileData?.avatar
                          ?.path,
                      }
                    : imagePath.icCamIcon
                }
                style={{
                  tintColor: !vendorRegisterationDocs[index]?.fileData
                    ? themeColors.primary_color
                    : null,
                  height: vendorRegisterationDocs[index]?.fileData
                    ? height / 6 - moderateScale(15)
                    : 30,
                  width: vendorRegisterationDocs[index]?.fileData
                    ? width - moderateScale(80)
                    : 30,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          )}
          {item?.file_type == 'Text' && (
            <BorderTextInput
              // secureTextEntry={true}
              placeholder={`Enter ${item?.primary?.name || item?.name}`}
              onChangeText={(itm) => _dynamicTextInputChange(itm, index, item)}
              containerStyle={{
                ...styles.containerStyle,
                marginBottom: 0,
                marginTop: moderateScale(3),
              }}
            />
          )}
        </View>
      </View>
    );
  };

  const _renderTransportTypes = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          borderColor: colors.borderColorB,
          borderWidth: 1,
          borderRadius: moderateScale(5),
        }}>
        <Image
          source={{uri: item?.image}}
          style={{height: moderateScale(50), width: moderateScale(57)}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={(paramData && paramData?.title) || ''}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: Colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              marginHorizontal: moderateScale(20),
            }}>
            {/* {!!(paramData && paramData?.url) && (
              <WebView source={{uri: paramData?.url}} />
            )} */}
            {htmlContent && (
              <HTMLView
                stylesheet={isDarkMode ? htmlStyle : null}
                value={`<p>${htmlContent}</p>`}
              />
            )}
          </View>
          {paramData?.slug === 'vendor-registration' && (
            <View
              style={{
                marginTop: moderateScaleVertical(30),
                marginHorizontal: moderateScale(24),
              }}>
              <View style={{marginBottom: moderateScaleVertical(12)}}>
                <Text style={styles.detailStyle}>
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
              <View style={{marginTop: moderateScaleVertical(10)}}>
                <Text style={styles.detailStyle}>{strings.STORE_DETAILS}</Text>
              </View>

              <View style={{marginVertical: moderateScaleVertical(20)}}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: width / 2 - moderateScale(22),
                    }}>
                    <Text style={styles.uploadText}>{strings.UPLOAD_LOGO}</Text>
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
                              <View style={styles.crossIconStyle}>
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
                      <View style={styles.imageView}>
                        <TouchableOpacity
                          onPress={uploadLogo}
                          style={[
                            styles.viewOverImage2,
                            {borderStyle: 'dashed'},
                          ]}>
                          <Image
                            source={imagePath.icCamIcon}
                            style={{tintColor: themeColors.primary_color}}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      width: width / 2 - moderateScale(22),
                    }}>
                    <Text style={styles.uploadText}>
                      {strings.UPLOAD_BANNER}
                    </Text>
                    {imageArrayBanner && imageArrayBanner.length ? (
                      imageArrayBanner.map((i, inx) => {
                        return (
                          <ImageBackground
                            source={{
                              uri: i.uri,
                            }}
                            style={styles.imageOrderStyle}
                            imageStyle={styles.imageStyle}>
                            <View style={styles.viewOverImage}>
                              <View style={styles.crossIconStyle}>
                                <TouchableOpacity
                                  onPress={() => _removeBannerFromList(i)}>
                                  <Image source={imagePath.icRemoveIcon} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </ImageBackground>
                        );
                      })
                    ) : (
                      <View style={styles.imageView}>
                        <TouchableOpacity
                          onPress={uploadFile}
                          style={[
                            styles.viewOverImage2,
                            {borderStyle: 'dashed'},
                          ]}>
                          <Image
                            source={imagePath.icCamIcon}
                            style={{tintColor: themeColors.primary_color}}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <BorderTextInput
                placeholder={strings.VENDOR_NAME}
                onChangeText={_onChangeText('vendor_name')}
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  marginHorizontal: moderateScale(10),
                  marginVertical: moderateScaleVertical(16),
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      marginBottom: moderateScaleVertical(8),
                      fontFamily: fontFamily.medium,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                    }}>
                    {strings.DINE_IN}
                  </Text>
                  <ToggleSwitch
                    isOn={isDineIn}
                    onColor={themeColors.primary_color}
                    offColor={
                      isDarkMode ? MyDarkTheme.colors.text : colors.borderLight
                    }
                    size="small"
                    onToggle={() => updateState({isDineIn: !isDineIn})}
                  />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      marginBottom: moderateScaleVertical(8),
                      fontFamily: fontFamily.medium,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                    }}>
                    {strings.TAKEAWAY}
                  </Text>
                  <ToggleSwitch
                    isOn={isTakeaway}
                    onColor={themeColors.primary_color}
                    offColor={
                      isDarkMode ? MyDarkTheme.colors.text : colors.borderLight
                    }
                    size="small"
                    onToggle={() => updateState({isTakeaway: !isTakeaway})}
                  />
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      marginBottom: moderateScaleVertical(8),
                      fontFamily: fontFamily.medium,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                    }}>
                    {strings.DELIVERY}
                  </Text>
                  <ToggleSwitch
                    isOn={isDelivery}
                    onColor={themeColors.primary_color}
                    offColor={
                      isDarkMode ? MyDarkTheme.colors.text : colors.borderLight
                    }
                    size="small"
                    onToggle={() => updateState({isDelivery: !isDelivery})}
                  />
                </View>
              </View>
              <View style={{}}>
                <FlatList
                  keyExtractor={(itm, indx) => indx.toString()}
                  data={vendorRegDocs}
                  renderItem={_renderFields}
                />
              </View>

              <GradientButton
                onPress={_onSubmit}
                marginTop={moderateScaleVertical(10)}
                btnText={strings.SUBMIT}
              />
              <View
                style={{
                  height: moderateScaleVertical(24),
                  marginBottom: moderateScaleVertical(44),
                }}
              />
            </View>
          )}
          {paramData?.slug === 'driver-registration' && (
            <View
              style={{
                marginTop: moderateScaleVertical(30),
                marginHorizontal: moderateScale(24),
              }}>
              <View style={{marginBottom: moderateScaleVertical(12)}}>
                <Text style={styles.detailStyle}>
                  {strings.PERSONAL_DETAILS}
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(13),
                  marginVertical: moderateScaleVertical(5),
                  color: colors.textGreyB,
                }}>
                Upload Profile Photo
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  actionSheet.current.show();
                }}
                style={{
                  ...styles.imageView,
                  // marginVertical: moderateScale(5),
                  marginHorizontal: 0,
                  marginBottom: moderateScaleVertical(14),
                }}>
                <Image
                  source={imagePath.icCamIcon}
                  style={{
                    tintColor:
                      // !vendorRegisterationDocs[index]?.fileData
                      //   ?
                      themeColors.primary_color,
                    // : null
                    height:
                      //  vendorRegisterationDocs[index]?.fileData
                      //   ? height / 6 - moderateScale(15)
                      //   :
                      30,
                    width:
                      // vendorRegisterationDocs[index]?.fileData
                      //   ? width - moderateScale(80)
                      //   :
                      30,
                  }}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>

              <BorderTextInput
                placeholder={strings.YOUR_NAME}
                onChangeText={_onChangeText('driverName')}
                containerStyle={styles.containerStyle}
              />

              <PhoneNumberInput
                onCountryChange={_onCountryChange}
                onChangePhone={(phoneNumber) =>
                  updateState({
                    driverPhoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
                  })
                }
                cca2={cca2}
                phoneNumber={phoneNumber}
                callingCode={state.callingCode}
                placeholder={strings.YOUR_PHONE_NUMBER}
                keyboardType={'phone-pad'}
                containerStyle={styles.containerStyle}
              />

              <TouchableOpacity
                style={{
                  borderRadius: 8,
                  height: moderateScaleVertical(44),
                  marginBottom: moderateScaleVertical(14),
                  paddingHorizontal: moderateScale(5),
                  borderWidth: 1,
                  borderColor: colors.borderLight,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                activeOpacity={0.7}>
                <Text style={{fontFamily: fontFamily.regular}}>
                  {strings.TYPE}
                </Text>
                <Image source={imagePath.dropDownNew} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  borderRadius: 8,
                  height: moderateScaleVertical(44),
                  marginBottom: moderateScaleVertical(14),
                  paddingHorizontal: moderateScale(5),
                  borderWidth: 1,
                  borderColor: colors.borderLight,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                activeOpacity={0.7}>
                <Text style={{fontFamily: fontFamily.regular}}>{'Teams'}</Text>
                <Image source={imagePath.dropDownNew} />
              </TouchableOpacity>

              <BorderTextInput
                placeholder={'Tags'}
                onChangeText={_onChangeText('password')}
                containerStyle={styles.containerStyle}
              />

              <BorderTextInput
                placeholder={'Transport Details'}
                onChangeText={_onChangeText('driverTransportDetails')}
                containerStyle={styles.containerStyle}
              />
              <BorderTextInput
                placeholder={'UID'}
                onChangeText={_onChangeText('driverUUID')}
                containerStyle={styles.containerStyle}
              />
              <BorderTextInput
                placeholder={'Licence Plate'}
                onChangeText={_onChangeText('driverLicencePlate')}
                containerStyle={styles.containerStyle}
              />

              <BorderTextInput
                placeholder={'Color'}
                onChangeText={_onChangeText('driverColor')}
                containerStyle={styles.containerStyle}
              />
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(13),
                  marginVertical: moderateScaleVertical(5),
                  color: colors.textGreyB,
                }}>
                Transport Type
              </Text>
              <FlatList
                keyExtractor={(itm, indx) => indx.toString()}
                data={driverRegDocs?.transport_types}
                horizontal={true}
                ItemSeparatorComponent={() => <View style={{width: 10}} />}
                renderItem={_renderTransportTypes}
              />

              <FlatList
                keyExtractor={(itm, indx) => indx.toString()}
                data={driverRegDocs?.driver_registration_documents}
                renderItem={_renderFields}
              />

              <GradientButton
                onPress={_onSubmit}
                marginTop={moderateScaleVertical(10)}
                btnText={strings.SUBMIT}
              />
              <View
                style={{
                  height: moderateScaleVertical(24),
                  marginBottom: moderateScaleVertical(44),
                }}
              />
            </View>
          )}
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

const htmlStyle = StyleSheet.create({
  p: {
    fontWeight: '300',
    color: '#e5e5e7', // make links coloured pink
  },
});
