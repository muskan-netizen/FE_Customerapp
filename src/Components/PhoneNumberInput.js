import {callingCodes} from 'country-data';
import React, {useState} from 'react';
import {
  I18nManager,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, {Flag} from 'react-native-country-picker-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {moderateScale, textScale, width} from '../styles/responsiveSize';

export default function PhoneNumberInput({
  cca2 = '',
  callingCode,
  onChangePhone,
  onCountryChange,
  phoneNumber,
  placeholder,
  containerStyle,
  color,
}) {
  const [state, setState] = useState({
    countryPickerModalVisible: false,
  });

  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;

  const _onCountryChange = (data) => {
    setState({countryPickerModalVisible: false});
    onCountryChange(data);
  };
  const _openCountryPicker = () => {
    setState({countryPickerModalVisible: true});
  };
  const _onCountryPickerModalClose = () => {
    setState({countryPickerModalVisible: false});
  };
  const {countryPickerModalVisible} = state;
  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 13,
        borderColor: color ? color : colors.borderLight,
        height: moderateScale(49),
        ...containerStyle,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: moderateScale(88),
        }}
        onPress={_openCountryPicker}>
        <Flag countryCode={cca2} />

        <Image source={imagePath.dropdownTriangle} />
      </TouchableOpacity>
      <TextInput
        selectionColor={colors.black}
        placeholder={placeholder}
        keyboardType="numeric"
        value={phoneNumber}
        placeholderTextColor={color ? color : colors.textGreyOpcaity7}
        onChangeText={onChangePhone}
        style={{
          // flex: 1,
          width: width / 1.57,
          borderLeftWidth: 1,
          fontFamily: fontFamily.medium,
          color: color ? color : colors.textGrey,
          fontSize: textScale(14),
          borderLeftColor: colors.borderLight,
          opacity: 0.7,
          paddingTop: 0,
          paddingBottom: 0,
          marginVertical: 8,
          paddingHorizontal: 10,
          textAlign: I18nManager.isRTL ? 'right' : 'left',
        }}
      />
      {countryPickerModalVisible && (
        <CountryPicker
          withCallingCode={callingCodes}
          cca2={cca2}
          visible={countryPickerModalVisible}
          withFlagButton={false}
          withFilter
          onClose={_onCountryPickerModalClose}
          onSelect={_onCountryChange}
        />
      )}
    </View>
  );
}
