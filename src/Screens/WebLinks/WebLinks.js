import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {useDarkMode} from 'react-native-dark-mode';
import DeviceInfo from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import HTMLView from 'react-native-htmlview';
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
import {showError, showSuccess} from '../../utils/helperFunctions';
import {androidCameraPermission} from '../../utils/permissions';
import validator from '../../utils/validations';
import stylesFun from './styles';

let clickedIndx = null;
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
      {id: 1, name: 'Employee'},
      {id: 2, name: 'Freelancer'},
    ],
    driverTags: '',
    driverSelectedTeam: '',
    driverTransportDetails: '',
    driverUUID: '',
    driverLicencePlate: '',
    driverColor: '',
    driverTransportType: '',
    driverRegistrationDocs: [],
    driverTransportTypeIndx: null,
    isDriverType: false,
    selectedDriverType: '',
    isTeams: false,
    selectedTeam: '',
    isTagsShow: false,
    selectedTags: [],
    selectedTagIndxs: [],
    tagsViewHeight: moderateScale(44),
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
    driverTransportTypeIndx,
    isDriverType,
    selectedDriverType,
    isTeams,
    selectedTeam,
    isTagsShow,
    selectedTags,
    selectedTagIndxs,
    tagsViewHeight,
    title,
    description,
    website,
  } = state;

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
        updateState({isLoading: false});
        updateState({
          htmlContent: res?.data?.page_detail?.primary?.description,
          vendorRegDocs: res?.data?.vendor_registration_documents,
          driverRegDocs: res?.data,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.message || error?.error);
  };
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };

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
    updateState({isLoading: true});

    if (paramData?.slug === 'driver-registration') {
      var formData = new FormData();

      formData.append('name', driverName);
      formData.append('phone_number', driverPhoneNumber);
      formData.append(
        'type',
        !!selectedDriverType ? selectedDriverType.name : '',
      );
      formData.append('dialCode', '91');
      formData.append('team', !!selectedTeam ? selectedTeam?.id : '');
      formData.append('make_model', driverTransportDetails);
      formData.append('uid', driverUUID);
      formData.append('plate_number', driverLicencePlate);
      formData.append('color', driverColor);
      formData.append(
        'vehicle_type_id',
        !!driverTransportType ? driverTransportType?.value : '',
      );
      formData.append('upload_photo', {
        uri: driverPic.path,
        name: driverPic.filename,
        filename: driverPic.filename,
        mime: driverPic.mime,
      });

      selectedTags.map((item) => {
        formData.append('tags[]', item.name);
      });

      driverRegistrationDocs.map((item, indx) => {
        formData.append(
          item?.item?.slug,
          item?.item.file_type === 'Image'
            ? {
                uri: item.fileData.path,
                name: item.fileData.filename,
                filename: item.fileData.filename,
                mime: item.fileData.mime,
              }
            : item?.fileData,
        );
      });

      actions
        .driverRegisteration(formData, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
          'Content-type': 'multipart/form-data',
        })
        .then((res) => {
          console.log(res, 'serverResponse');
          updateState({
            isLoading: false,
          });
          showSuccess(res.message);
        })
        .catch(errorMethod);
    } else {
      console.log(vendorRegisterationDocs, 'vendorRegisterationDocs');

      var formData = new FormData();

      formData.append('full_name', fullname);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber);
      // formData.append('title', title);

      formData.append('dialCode', '91');
      formData.append('password', password);
      formData.append('confirm_password', confirm_password);
      formData.append('name', vendor_name);
      // formData.append('description', description);

      formData.append('address', address);
      // formData.append('website', website);
      // formData.append('isDelivery-in', isDelivery);
      // formData.append('isDineIn', isDineIn);
      // formData.append('isTakeaway', isTakeaway);

      formData.append('countryData', 'IN');
      formData.append('check_conditions', 1);

      vendorRegisterationDocs.map((item, indx) => {
        formData.append(
          item?.item?.primary?.slug,
          item?.item?.file_type == 'Image'
            ? {
                uri: item.fileData.path,
                name: item.fileData.filename,
                filename: item.fileData.filename,
                mime: item.fileData.mime,
              }
            : item?.fileData,
        );
        // if(item?.item?.is_required && ){

        // }
      });
      console.log(formData, 'formData');

      actions
        .vendorRegisteration(formData, {
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
              if (!!clickedIndx) {
                {
                  const driverRegistrationDocsAry = [...driverRegistrationDocs];
                  driverRegistrationDocsAry[clickedIndx] = {
                    item: clickedItem,
                    fileData: res,
                  };

                  updateState({
                    driverRegistrationDocs: driverRegistrationDocsAry,
                  });
                }
                clickedIndx = null;
              } else {
                updateState({
                  driverPic: res,
                });
                console.log(driverPic, 'driverPic');
              }
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
        style={{
          marginVertical: moderateScale(7),
        }}>
        <Text
          style={{
            color: colors.blackOpacity43,
            fontFamily: fontFamily.bold,
            fontSize: textScale(13),
          }}>
          {item.primary?.name || item?.name}
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
                  paramData?.slug === 'driver-registration'
                    ? driverRegistrationDocs[index]?.fileData?.path
                      ? {
                          uri: driverRegistrationDocs[index]?.fileData?.path,
                        }
                      : imagePath.icCamIcon
                    : vendorRegisterationDocs[index]?.fileData?.path
                    ? {
                        uri: vendorRegisterationDocs[index]?.fileData?.path,
                      }
                    : imagePath.icCamIcon
                }
                style={{
                  tintColor:
                    paramData?.slug === 'driver-registration'
                      ? !driverRegistrationDocs[index]?.fileData?.path
                        ? themeColors.primary_color
                        : null
                      : !vendorRegisterationDocs[index]?.fileData?.path
                      ? themeColors.primary_color
                      : null,
                  height:
                    paramData?.slug === 'driver-registration'
                      ? driverRegistrationDocs[index]?.fileData?.path
                        ? height / 6 - moderateScale(15)
                        : 30
                      : vendorRegisterationDocs[index]?.fileData?.path
                      ? height / 6 - moderateScale(15)
                      : 30,
                  width:
                    paramData?.slug === 'driver-registration'
                      ? driverRegistrationDocs[index]?.fileData?.path
                        ? width - moderateScale(80)
                        : 30
                      : vendorRegisterationDocs[index]?.fileData?.path
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

  const _transportTypeSelect = (itm, indx) => {
    updateState({
      driverTransportType: itm,
      driverTransportTypeIndx: indx,
    });
  };

  const _renderTransportTypes = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => _transportTypeSelect(item, index)}
        style={{
          borderColor:
            driverTransportTypeIndx === index
              ? themeColors.primary_color
              : colors.borderColorB,
          borderWidth: 1,
          borderRadius: moderateScale(5),
        }}>
        <Image
          source={{uri: item?.image}}
          style={{
            height: moderateScale(50),
            width: moderateScale(57),
          }}
        />
      </TouchableOpacity>
    );
  };

  const _onTagSelect = (itm, indx) => {
    if (!selectedTags.includes(itm)) {
      updateState({
        selectedTags: [...selectedTags, itm],
      });
    } else {
      const selectedTagsAry = [...selectedTags];
      const ind = selectedTagsAry.findIndex((item) => item.id === itm.id);
      var result = selectedTagsAry.filter((item, idx) => idx !== ind);
      updateState({
        selectedTags: result,
      });
    }
  };

  const removeTag = (itm, indx) => {
    const selectedTagsAry = [...selectedTags];

    const ind = selectedTagsAry.findIndex((item) => item.id == itm.id);
    // const tagIdind = selectedTagIndxsAry.findIndex((item) => item === indx);
    var result = selectedTagsAry.filter((item, idx) => idx !== ind);
    // var tagIdresult = selectedTagIndxsAry.filter(
    //   (item, idx) => idx !== tagIdind,
    // );
    updateState({
      selectedTags: result,
    });
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

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{
            marginTop: moderateScaleVertical(20),
            marginHorizontal: moderateScale(20),
          }}>
          {htmlContent && (
            <HTMLView
              stylesheet={isDarkMode ? htmlStyle : null}
              value={`<p>${htmlContent}</p>`}
            />
          )}
        </View>

        {paramData?.slug === 'vendor-registration' && (
          <View style={styles.mainView}>
            <View style={{marginBottom: moderateScaleVertical(12)}}>
              <Text style={styles.detailStyle}>{strings.PERSONAL_DETAILS}</Text>
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
            <View style={{marginVertical: moderateScaleVertical(10)}}>
              <Text style={styles.detailStyle}>{strings.STORE_DETAILS}</Text>
              <View style={{marginVertical: moderateScaleVertical(20)}}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      width: width / 2 - moderateScale(22),
                    }}>
                    <Text style={styles.uploadText}>{strings.UPLOAD_LOGO}</Text>

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
                  </View>
                  <View
                    style={{
                      width: width / 2 - moderateScale(22),
                    }}>
                    <Text style={styles.uploadText}>
                      {strings.UPLOAD_BANNER}
                    </Text>

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
                  </View>
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
            <View
              style={{
                marginHorizontal: moderateScale(5),
              }}>
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
          <View style={styles.mainView}>
            <View style={{marginBottom: moderateScaleVertical(12)}}>
              <Text style={styles.detailStyle}>{strings.PERSONAL_DETAILS}</Text>
            </View>

            <Text style={{...styles.labelTxt}}>{strings.UPLOAD_PHOTO}</Text>
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
                source={driverPic ? {uri: driverPic.path} : imagePath.icCamIcon}
                style={{
                  tintColor: !driverPic ? themeColors.primary_color : null,
                  height: driverPic ? height / 6 - moderateScale(15) : 30,
                  width: driverPic ? width - moderateScale(80) : 30,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>

            <Text style={styles.labelTxt}>{strings.YOUR_NAME}</Text>

            <BorderTextInput
              placeholder={''}
              onChangeText={_onChangeText('driverName')}
              containerStyle={styles.containerStyle}
            />

            <Text style={styles.labelTxt}>{strings.YOUR_PHONE_NUMBER}</Text>

            <PhoneNumberInput
              onCountryChange={_onCountryChange}
              onChangePhone={(phoneNumber) =>
                updateState({
                  driverPhoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
                })
              }
              cca2={cca2}
              phoneNumber={driverPhoneNumber}
              callingCode={state.callingCode}
              placeholder={''}
              keyboardType={'phone-pad'}
              containerStyle={styles.containerStyle}
            />

            <View style={{zIndex: 10}}>
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
                activeOpacity={0.7}
                onPress={() =>
                  updateState({
                    isDriverType: !isDriverType,
                    isTeams: false,
                    isTagsShow: false,
                  })
                }>
                <Text style={{...styles.labelTxt, marginBottom: 0}}>
                  {!!selectedDriverType
                    ? selectedDriverType.name
                    : strings.TYPE}
                </Text>
                <Image source={imagePath.dropDownNew} />
              </TouchableOpacity>
              {isDriverType && (
                <View
                  style={{
                    top: moderateScaleVertical(40),
                    borderWidth: 1,
                    borderColor: colors.borderColorB,
                    backgroundColor: colors.white,
                    width: '100%',
                    position: 'absolute',
                    paddingHorizontal: moderateScale(10),
                    paddingVertical: moderateScale(5),
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.1,
                  }}>
                  {driverTypes.map((itm, indx) => {
                    return (
                      <TouchableOpacity
                        key={indx}
                        onPress={() =>
                          updateState({
                            selectedDriverType: itm,
                            isDriverType: false,
                          })
                        }
                        style={{
                          marginVertical: moderateScale(5),
                        }}>
                        <Text>{itm.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={{zIndex: 5}}>
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
                activeOpacity={0.7}
                onPress={() =>
                  updateState({
                    isTeams: !isTeams,
                    isDriverType: false,
                    isTagsShow: false,
                  })
                }>
                <Text style={{...styles.labelTxt, marginBottom: 0}}>
                  {!!selectedTeam ? selectedTeam?.name : strings.TEAMS}
                </Text>
                <Image source={imagePath.dropDownNew} />
              </TouchableOpacity>

              {isTeams && (
                <View
                  style={{
                    top: moderateScaleVertical(44),
                    position: 'absolute',
                    borderWidth: 1,
                    borderColor: colors.borderColorB,
                    backgroundColor: colors.white,
                    width: '100%',
                    paddingHorizontal: moderateScale(10),
                    paddingVertical: moderateScale(5),
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.1,
                  }}>
                  {driverRegDocs?.teams.length > 0 ? (
                    <View>
                      {driverRegDocs?.teams.map((itm, indx) => {
                        return (
                          <TouchableOpacity
                            key={indx}
                            onPress={() =>
                              updateState({
                                selectedTeam: itm,
                                isTeams: false,
                              })
                            }
                            style={{
                              marginVertical: moderateScale(5),
                            }}>
                            <Text>{itm.name}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        height: moderateScale(30),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.white,
                      }}>
                      <Text
                        style={{
                          fontFamily: fontFamily.medium,
                          fontSize: moderateScale(13),
                        }}>
                        {strings.NODATAFOUND}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={{marginBottom: moderateScaleVertical(14), zIndex: 2}}>
              <View
                onLayout={(event) => {
                  updateState({
                    tagsViewHeight: event.nativeEvent.layout.height,
                  });
                }}
                style={{
                  minHeight: moderateScaleVertical(44),
                  color: colors.white,
                  borderWidth: 1,
                  borderColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.borderLight,
                  borderRadius: 8,
                  paddingVertical: 3,
                  paddingHorizontal: 3,
                  justifyContent: 'center',
                }}>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {selectedTags.length > 0 && (
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      <FlatList
                        numColumns={3}
                        data={selectedTags}
                        renderItem={({item, index}) => (
                          <TouchableOpacity
                            onPress={() => removeTag(item, index)}
                            activeOpacity={0.7}
                            style={{
                              borderWidth: 1,
                              borderColor: colors.borderColorB,
                              alignItems: 'center',
                              backgroundColor: colors.borderColorB,
                              marginHorizontal: moderateScale(2),
                              flexDirection: 'row',
                              marginVertical: 3,
                              width: (width - moderateScale(52)) / 3,
                              justifyContent: 'space-around',
                              borderRadius: moderateScale(5),
                              paddingVertical: moderateScale(3),
                            }}>
                            <Image
                              source={imagePath.ic_cross}
                              style={{
                                height: 15,
                                width: 15,
                                tintColor: colors.blackOpacity70,
                              }}
                            />
                            <Text
                              style={{
                                fontFamily: fontFamily.regular,
                                marginRight: 3,
                              }}>
                              {item?.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  )}
                  <TextInput
                    placeholder={strings.TAGS}
                    onFocus={() => updateState({isTagsShow: true})}
                    onBlur={() => updateState({isTagsShow: false})}
                    onPressIn={() => alert()}
                    style={{
                      opacity: 0.7,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(14),
                      paddingHorizontal: 8,
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      marginVertical: 3,
                      marginHorizontal: 3,
                    }}
                  />
                </View>
              </View>
              {isTagsShow && (
                <View
                  style={{
                    backgroundColor: colors.white,
                    position: 'absolute',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 0.1,
                    width: '100%',

                    top: tagsViewHeight,
                  }}>
                  {driverRegDocs?.tags.length > 0 ? (
                    <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                      {driverRegDocs?.tags.map((item, index) => {
                        return (
                          <TouchableOpacity
                            onPress={() => _onTagSelect(item, index)}
                            activeOpacity={0.7}
                            style={{
                              borderWidth: 1,
                              borderColor: selectedTags.includes(item)
                                ? themeColors.primary_color
                                : colors.borderColorB,
                              width: (width - moderateScale(70)) / 3,
                              alignItems: 'center',
                              marginVertical: moderateScale(5),
                              paddingVertical: moderateScale(5),
                              marginHorizontal: moderateScale(5),
                              zIndex: 1,
                              backgroundColor: selectedTags.includes(item)
                                ? themeColors.primary_color
                                : colors.borderColorB,
                              borderRadius: moderateScale(5),
                            }}>
                            <Text
                              style={{
                                textAlign: 'center',
                                color: selectedTags.includes(item)
                                  ? colors.white
                                  : colors.black,
                              }}>
                              {item?.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        height: moderateScale(30),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: fontFamily.medium,
                          fontSize: moderateScale(13),
                        }}>
                        {strings.NODATAFOUND}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
            <Text style={styles.labelTxt}>{strings.TRANSPORT_DETAILS}</Text>

            <BorderTextInput
              placeholder={strings.EXAMPLE_TEXT}
              onChangeText={_onChangeText('driverTransportDetails')}
              containerStyle={styles.containerStyle}
            />
            <Text style={styles.labelTxt}>{strings.UID}</Text>

            <BorderTextInput
              placeholder={''}
              onChangeText={_onChangeText('driverUUID')}
              containerStyle={styles.containerStyle}
            />
            <Text style={styles.labelTxt}>{strings.LICENCE_PLATE}</Text>

            <BorderTextInput
              placeholder={''}
              onChangeText={_onChangeText('driverLicencePlate')}
              containerStyle={styles.containerStyle}
            />
            <Text style={styles.labelTxt}>{strings.COLOR}</Text>

            <BorderTextInput
              placeholder={''}
              onChangeText={_onChangeText('driverColor')}
              containerStyle={styles.containerStyle}
            />
            {!!driverRegDocs && (
              <Text
                style={{
                  color: colors.blackOpacity43,
                  fontFamily: fontFamily.bold,
                  fontSize: textScale(13),
                  marginVertical: moderateScaleVertical(5),
                }}>
                {strings.TRANSPORT_TYPE}
              </Text>
            )}
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
      </ScrollView>
      <ActionSheet
        ref={actionSheet}
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
