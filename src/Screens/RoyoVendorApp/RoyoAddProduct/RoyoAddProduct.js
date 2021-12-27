import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../../styles/responsiveSize';
import colors from '../../../styles/colors';
import navigationStrings from '../../../navigation/navigationStrings';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import DropDown from '../../../Components/DropDown';
import fontFamily from '../../../styles/fontFamily';
import {boxWidth, customMarginBottom} from '../../../utils/constants/constants';
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {androidCameraPermission} from '../../../utils/permissions';
import ActionSheet from 'react-native-actionsheet';
import {cameraHandler} from '../../../utils/commonFunction';
import Header from '../../../Components/Header';
import { useSelector } from 'react-redux';

const RoyoAddProduct = (props) => {
  const {navigation} = props;
  const {vendor_list} = props?.route?.params
  const [state, setState] = useState({
    selectedBuisnessType: '',
    productName: '',
    productCategory: '',
    mrp: '',
    salePrice: '',
    productDetail: '',
    selectedImage: [],
  });
  const {
    selectedBuisnessType,
    productName,
    mrp,
    salePrice,
    productDetail,
    selectedImage,
  } = state;

  const updateState = (data) => {
    setState((state) => {
      return {...state, ...data};
    });
  };

  const dropDownData = ['Buisness 1', 'Buisness 2', 'Buisness 3', 'Buisness 4'];



  const onChangeText = (key) => {
    return (value) => {
      updateState({[key]: value});
    };
  };

  const onSelectBuisnessType = (data) => {
    updateState({selectedBuisnessType: data});
  };
  const {storeSelectedVendor} = useSelector((state) => state?.order);
  let actionSheet = useRef();
  const cameraHandle = async (index) => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus) {
      if (index == 0 || index == 1) {
        cameraHandler(index, {
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: false,
          mediaType: 'photo',
        })
          .then((res) => {
            if (res?.data) {
              let newSelectedImage = [...selectedImage, res.path];
              updateState({selectedImage: newSelectedImage});
            }
            let data = {
              type: 'jpg',
              avatar: res?.data,
            };
          })
          .catch((res) => {});
      }
    }
  };

  const selectImage = () => {
    selectedImage.length == 5
      ? alert('More than five image is not allowed')
      : actionSheet.current.show();
  };

  const onPressAdd = () => {
    if (
      selectedImage &&
      selectedBuisnessType &&
      productDetail &&
      productName &&
      mrp &&
      salePrice
    ) {
      updateState({
        selectedBuisnessType: '',
        productName: '',
        productCategory: '',
        mrp: '',
        salePrice: '',
        productDetail: '',
        selectedImage: '',
      });
      {
        navigation.navigate(navigationStrings.ROYO_ADD_PRODUCT);
      }
    } else
      showMessage({
        type: 'danger',
        icon: 'danger',
        message: 'Please fill all the detail',
      });
  };

  const onPressSave = () => {
    if (
      selectedImage &&
      selectedBuisnessType &&
      productDetail &&
      productName &&
      mrp &&
      salePrice
    ) {
      
      navigation.navigate(navigationStrings.ROYO_HOME);
    } else
      showMessage({
        type: 'danger',
        icon: 'danger',
        message: 'Please fill all the detail',
      });
  };


  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: storeSelectedVendor,
      allVendors: vendor_list,
      screenType: navigationStrings.ROYO_ADD_PRODUCT,
    });
  };
  const deleteImage = (index) => {
    let newSelectedImageArary = [...selectedImage];
    newSelectedImageArary = newSelectedImageArary.filter(
      (item, key) => key != index,
    );
    updateState({selectedImage: newSelectedImageArary});
  };
  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      <Header
      headerStyle={{marginVertical: moderateScaleVertical(16)}}
        leftIcon={imagePath.backRoyo}
        centerTitle={`Add product | ${storeSelectedVendor.name}`}
        showImageAlongwithTitle
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        imageAlongwithTitle={imagePath.dropdownTriangle}
      />
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        bounces={false}>
        <Text style={styles.addProduct}>{strings.ADD_PRODUCT_IMAGE}</Text>
        <TouchableOpacity style={styles.camera} onPress={selectImage}>
          <Image source={imagePath.cameraRoyo} />
        </TouchableOpacity>
        <ActionSheet
          ref={actionSheet}
          // title={'Choose one option'}
          options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => cameraHandle(index)}
        />
        {selectedImage ? (
          <View style={styles.flexWrapRow}>
            {selectedImage?.map((val, index) => (
              <View>
                <Image
                  key={index}
                  source={{uri: val}}
                  style={styles.selectedImage}
                />
                <TouchableOpacity
                  onPress={() => deleteImage(index)}
                  style={styles.deleteImageBox}>
                  <Image
                    style={{height: 15, width: 15}}
                    source={imagePath.cancelledRoyo}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.body}>
          <View style={styles.flexWrapSpace}>
            <TextInputWithUnderlineAndLabel
              label={strings.PRODUCT_NAME}
              labelStyle={styles.labelText}
              mainStyle={{...styles.textInputView, width: boxWidth(2.22, 32)}}
              txtInputStyle={styles.textInput}
              underlineColor="transparent"
              value={productName}
              onChangeText={onChangeText('productName')}
              placeholder={strings.ENTER_BUISNESS_NAME}
            />
            <View style={{...styles.textInputView, width: boxWidth(2.22, 32)}}>
              <Text style={styles.labelText}>{strings.PRODUCT_CATEGORY}</Text>
              <DropDown
                value={selectedBuisnessType}
                inputStyle={styles.textInput}
                selectedIndexByProps={-1}
                placeholder={strings.CHOOSE_BUISNESS_TYPE}
                data={dropDownData}
                fetchValues={onSelectBuisnessType}
                marginBottom={0}
                // inputStyle={{ borderColor: countryError !== '' ? colors.redColor : colors.lightGray }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              zIndex: -2,
            }}>
            <TextInputWithUnderlineAndLabel
              label={strings.MRP}
              labelStyle={styles.labelText}
              mainStyle={{...styles.textInputView, flex: 0.48}}
              containerStyle={{}}
              txtInputStyle={styles.textInput}
              underlineColor="transparent"
              keyboardType="numeric"
              returnKeyType="done"
              value={mrp}
              onChangeText={onChangeText('mrp')}
              placeholder={strings.ENTER_MARP}
            />

            <TextInputWithUnderlineAndLabel
              label={strings.SALE_PRICE}
              labelStyle={styles.labelText}
              mainStyle={{...styles.textInputView, flex: 0.48}}
              containerStyle={{}}
              txtInputStyle={styles.textInput}
              underlineColor="transparent"
              keyboardType="numeric"
              returnKeyType="done"
              value={salePrice}
              onChangeText={onChangeText('salePrice')}
              placeholder={strings.ENTER_SALE_PRICE}
            />
          </View>

          <TextInputWithUnderlineAndLabel
            label={strings.PRODUCT_DETAILS}
            labelStyle={styles.labelText}
            mainStyle={{...styles.textInputView, zIndex: -1}}
            txtInputStyle={{
              ...styles.textInput,
              alignItems: 'baseline',
              paddingTop: moderateScaleVertical(8),
              height: moderateScaleVertical(100),
            }}
            containerStyle={{height: moderateScaleVertical(100)}}
            underlineColor="transparent"
            multiline={true}
            value={productDetail}
            onChangeText={onChangeText('productDetail')}
            placeholder={strings.ENTER_PRODUCT_DETAIL}
          />
          <View style={styles.btnbox}>
            <ButtonWithLoader
              btnText="Save & Add"
              btnTextStyle={styles.addBtnText}
              btnStyle={styles.addBtnContainer}
              onPress={onPressAdd}
            />
            <ButtonWithLoader
              btnText="Save"
              btnStyle={styles.SavebtnContainer}
              onPress={onPressSave}
            />
          </View>
          {/* <Text style={styles.variant}>{strings.VARIANTS_ADD}</Text> */}
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
};

export default RoyoAddProduct;

const styles = StyleSheet.create({
  container: {
    marginBottom: customMarginBottom(),
    marginHorizontal: moderateScale(16),
    flexGrow: 1,
  },
  addProduct: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.black,
    marginBottom: moderateScaleVertical(10),
    marginTop: moderateScaleVertical(14),
  },
  camera: {
    maxWidth: moderateScale(69),
    borderRadius: 6,
    borderWidth: 1,
    padding: moderateScale(24),
    borderColor: colors.borderColorGrey,
  },
  selectedImage: {
    height: moderateScaleVertical(60),
    width: moderateScale(60),
    marginRight: moderateScale(8),
  },
  labelText: {
    color: colors.black,
    marginBottom: moderateScaleVertical(8),
  },
  textInputView: {
    marginTop: moderateScaleVertical(24),
    // zIndex: 123,
  },
  textInput: {
    backgroundColor: colors.white,
    borderColor: colors.borderColorGrey,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    color: colors.black,
    height: moderateScaleVertical(48),
    paddingHorizontal: moderateScale(12),
    fontSize: 14,
    fontFamily: fontFamily.medium,
    marginBottom: 0,
    marginTop: 0,
  },
  body: {
    // marginTop: moderateScaleVertical(16),
    marginBottom: moderateScaleVertical(16),
  },
  flexWrapRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: moderateScaleVertical(16),
  },
  deleteImageBox: {top: -5, right: 5, position: 'absolute'},
  dropDown: {
    backgroundColor: colors.white,
    borderColor: colors.borderColorGrey,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    color: colors.black,
    // marginTop: moderateScaleVertical(8),
    padding: moderateScale(9),
    marginBottom: 0,
    height: moderateScaleVertical(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  variant: {
    marginTop: moderateScaleVertical(20),
    fontFamily: fontFamily.medium,
    fontSize: 14,
    textAlign: 'right',
    color: colors.themeColor2,
    zIndex: -1,
  },
  btnbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: -1,
  },
  addBtnContainer: {
    flex: 0.48,
    backgroundColor: colors.white,
    borderColor: colors.themeColor2,
  },
  addBtnText: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.themeColor2,
  },
  SavebtnContainer: {
    flex: 0.48,
    backgroundColor: colors.themeColor2,
    borderColor: colors.themeColor2,
  },
  saveBtnText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },
  flexWrapSpace: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
