import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import { getBundleId } from 'react-native-device-info';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { appIds } from '../utils/constants/DynamicAppKeys';
import { getColorSchema } from '../utils/utils';
import { TextInput } from 'react-native';

const PhoneNumberInputWithUnderline = ({
  cca2 = '',
  callingCode = '',
  onChangePhone,
  onCountryChange,
  phoneNumber,
  placeholder,
  textInputStyle = {},
  undnerlineColor = colors.transparent,
  labelStyle = {},
  isEditable = true
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {themeColors, appStyle} = useSelector((state) => state?.initBoot);
  const [state, setState] = useState({
    countryPickerModalVisible: false,
  });

  const fontFamily = appStyle?.fontSizeData;

  const _onCountryChange = (data) => {
    setState({countryPickerModalVisible: false});
    onCountryChange(data);
  };
  const _openCountryPicker = () => {
    if (getBundleId() !== appIds.baytukom && !!isEditable) {
      setState({countryPickerModalVisible: true});
    }
  };
  const _onCountryPickerModalClose = () => {
    setState({countryPickerModalVisible: false});
  };
  const {countryPickerModalVisible} = state;
  return (
    <View style={{ marginTop: moderateScaleVertical(10) }}>
      {/* Label */}
      <Text
        style={{
          color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB,
          textAlign: 'left',
          ...labelStyle,
        }}>
        {placeholder}
      </Text>

      {/* Input row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: undnerlineColor,
          paddingVertical: moderateScaleVertical(8),
          marginTop: moderateScaleVertical(4),
        }}>

        {/* Country picker button */}
        <TouchableOpacity
          onPress={_openCountryPicker}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyOpcaity7,
              fontFamily: fontFamily.regular,
            }}>
            +{callingCode}{' '}
          </Text>
          <Flag
            withEmoji={true}
            withFlagButton={true}
            countryCode={cca2}
            flagSize={16}
          />
          <Image
            style={{ tintColor: colors.textGreyB, marginLeft: moderateScale(4) }}
            source={imagePath.dropdownTriangle}
          />
        </TouchableOpacity>

        {/* Vertical divider */}
        <View
          style={{
            width: StyleSheet.hairlineWidth,
            height: moderateScaleVertical(18),
            backgroundColor: undnerlineColor,
            marginHorizontal: moderateScale(10),
          }}
        />

        {/* Phone number input */}
        <TextInput
          selectionColor={isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB}
          editable={isEditable}
          onChangeText={onChangePhone}
          value={phoneNumber}
          keyboardType="numeric"
          style={{
            flex: 1,
            opacity: 0.8,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            fontFamily: fontFamily.regular,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        />
      </View>

      {countryPickerModalVisible && (
        <CountryPicker
          withCallingCode={true}
          cca2={cca2}
          countryCode={callingCode}
          visible={countryPickerModalVisible}
          withFlagButton={false}
          withFilter
          onClose={_onCountryPickerModalClose}
          onSelect={_onCountryChange}
        />
      )}
    </View>
  );
};
export default React.memo(PhoneNumberInputWithUnderline);
