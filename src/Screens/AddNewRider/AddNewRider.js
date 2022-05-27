import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import { useSelector } from 'react-redux';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import Modal from '../../Components/Modal';
import SearchBar from '../../Components/SearchBar';
import TextInputWithUnderlineAndLabel from '../../Components/TextInputWithUnderlineAndLabel';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import stylesFun from './styles';
import { getColorCodeWithOpactiyNumber } from '../../utils/helperFunctions';


export default function AddNewRider({ navigation, route }) {
  const paramData = route?.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const userData = useSelector((state) => state?.auth?.userData);
  const { appData, allAddresss, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );

  const [state, setState] = useState({
    friendName: '',
    friendMobileNumber: '',
    countryPickerModalVisible: false,
    cca2: 'IN',
    callingCode: '+91',
  });
  const { friendName, friendMobileNumber, countryPickerModalVisible, cca2, callingCode } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));


  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFun({
    fontFamily,
    themeColors,

  });


  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  const _onCountryChange = (data) => {
    updateState({
      countryPickerModalVisible: false, bookForFriendModalVisible: true, cca2: data.cca2,
      callingCode: data.callingCode,
    });

  };
  const _openCountryPicker = () => {
    updateState({
      bookForFriendModalVisible: false
    })
    setTimeout(() => {
      updateState({ countryPickerModalVisible: true });
    }, 500);
  };

  const setDataAndBookRideForFriend = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    updateState({
      bookForFriendModalVisible: false
    })
  }



  const _onCountryPickerModalClose = () => {
    updateState({ countryPickerModalVisible: false });
  };




  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.white
        // colors.white
      }
      statusBarColor={colors.white}
      // isLoadingB={isLoadingB}
      source={loaderOne}>
      <View style={{ paddingHorizontal: moderateScale(20) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: moderateScale(40),

            marginTop: moderateScaleVertical(20)
          }}>
          <TouchableOpacity
            style={{ flex: 0.5, flexDirection: 'row' }}
            onPress={() => navigation.goBack()}
            hitSlop={{
              top: 30,
              right: 30,
              left: 30,
              bottom: 30,
            }}>
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
              source={imagePath.backArrowCourier}
            />
            <Text
              style={{
                fontSize: textScale(16),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginHorizontal: moderateScale(20)
              }}>
              New Rider
            </Text>
          </TouchableOpacity>


        </View>


        <View style={{ paddingVertical: moderateScaleVertical(14), alignItems: 'center', marginVertical: moderateScaleVertical(25), borderRadius: 4, paddingHorizontal: moderateScale(12), backgroundColor: getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 20) }}>
          <Text style={{ letterSpacing: 0.5, fontFamily: fontFamily.medium, color: colors.black, fontSize: textScale(14) }}>
            Drivers will see this name. Do you want to make any changes?
            <Text style={{ fontFamily: fontFamily.regular, color: colors.blackLight }}>
              {` Changing the name here won't affect how it appears in your device's contacts`}
            </Text>
          </Text>

        </View>


        <TextInputWithUnderlineAndLabel
          onChangeText={_onChangeText('friendName')}
          label={'First Name'}
          value={friendName}
          containerStyle={styles.textInputContainer}
          undnerlinecolor={colors.textGreyB}
          labelStyle={{
            color: colors.black,
            fontSize: textScale(12),
          }}
          txtInputStyle={styles.textInputStyle}
          returnKeyType={'next'}
        />
        <TextInputWithUnderlineAndLabel
          onChangeText={_onChangeText('friendName')}
          label={'Last Name'}
          value={friendName}
          containerStyle={styles.textInputContainer}
          undnerlinecolor={colors.textGreyB}
          labelStyle={{
            color: colors.black,
            fontSize: textScale(12),
          }}
          txtInputStyle={styles.textInputStyle}
          returnKeyType={'next'}
        />
        <View>
          <Text style={styles.phoneNumberTextInputLabel}>{strings.PHONE_NUMBER}</Text>
          <View style={styles.phoneNumberInnerContainer}>
            <TouchableOpacity
              style={styles.countryPickerContainer}
              onPress={_openCountryPicker}
            >
              <View
                style={styles.countryPickerInnerContainer}>
                <View style={{ marginRight: moderateScale(-10) }}>
                  <Flag countryCode={cca2} />
                </View>
                <Text
                  style={styles.callingCodeText}>
                  {callingCode}
                </Text>
              </View>


              <Image source={imagePath.dropdownTriangle} />
            </TouchableOpacity>

            <TextInputWithUnderlineAndLabel
              onChangeText={_onChangeText('friendMobileNumber')}
              value={friendMobileNumber}
              containerStyle={styles.phoneNumberInnput}
              undnerlinecolor={colors.textGreyB}
              labelStyle={{
                color: colors.black,
                fontSize: textScale(12),
              }}
              txtInputStyle={styles.textInputStyle}
              returnKeyType={'next'}
              keyboardType={'numeric'}
            />

          </View>
        </View>
        <GradientButton
          colorsArray={[
            themeColors.primary_color,
            themeColors.primary_color,
          ]}
          textStyle={{ textTransform: 'none', fontSize: textScale(16) }}
          onPress={setDataAndBookRideForFriend}
          marginTop={moderateScaleVertical(30)}
          marginBottom={moderateScaleVertical(10)}
          btnText={'Add Rider'}
          btnStyle={{ borderRadius: moderateScale(4) }}
        />
      </View>
      {countryPickerModalVisible && (
        <CountryPicker
          cca2={cca2}
          withCallingCode={callingCode}
          visible={countryPickerModalVisible}
          withFlagButton={false}
          withFilter
          onClose={_onCountryPickerModalClose}
          onSelect={_onCountryChange}
        />
      )}


    </WrapperContainer>
  );
}

const styles = StyleSheet.create({});
