import React, { useState } from 'react';
import {
  I18nManager,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal';
import { getBundleId } from 'react-native-device-info';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import { moderateScale, textScale, width } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { appIds } from '../utils/constants/DynamicAppKeys';
import { getColorSchema } from '../utils/utils';

const PhoneNumberInput = ({
  cca2 = '',
  callingCode = '',
  onChangePhone,
  onCountryChange,
  phoneNumber,
  placeholder,
  containerStyle,
  color,
  autoFocus = false,
  showCountryCode = true,
  TxtInputStyle,
  flagSize,
  downArrowStyle,
  require = false,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    countryPickerModalVisible: false,
  });

  const { appStyle } = useSelector((state) => state?.initBoot || {});

  const fontFamily = appStyle?.fontSizeData;

  const _onCountryChange = (data) => {
    setState({ countryPickerModalVisible: false });
    onCountryChange(data);
  };
  const _openCountryPicker = () => {
    if (getBundleId() !== appIds.baytukom) {
      setState({ countryPickerModalVisible: true });
    }
  };
  const _onCountryPickerModalClose = () => {
    setState({ countryPickerModalVisible: false });
  };
  const { countryPickerModalVisible } = state;
  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 13,
        borderColor: isDarkMode ? MyDarkTheme.colors.text : colors.borderLight,
        height: moderateScale(49),
        ...containerStyle,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: moderateScale(10),
        }}
        onPress={_openCountryPicker}>
        {showCountryCode && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.textGreyOpcaity7
            }}>+ </Text>
            <Text
              style={{
                fontFamily: fontFamily.medium,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyOpcaity7,
              }}>
              {callingCode}
            </Text>
          </View>
        )}

        <View>
          <Flag
            {...{ withEmoji: true, withFlagButton: true, countryCode: cca2, flagSize: flagSize }}
          />
        </View>

        {/* <Image
          source={imagePath.dropdownTriangle}
          style={{
            ...downArrowStyle,
            tintColor: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.black,
          }}
        /> */}
      </TouchableOpacity>
      <TextInput
        selectionColor={colors.black}
        placeholder={placeholder.concat(!!require ? '*' : '')}
        keyboardType="numeric"
        value={phoneNumber}
        placeholderTextColor={
          isDarkMode ? MyDarkTheme.colors.text : colors.textGreyOpcaity7
        }
        onChangeText={onChangePhone}
        style={{
          // flex: 1,
          width: width / 1.57,
          borderLeftWidth: 1,
          fontFamily: fontFamily.medium,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
          fontSize: textScale(14),
          borderLeftColor: colors.borderLight,
          opacity: 0.7,
          paddingTop: 0,
          paddingBottom: 0,
          marginVertical: 8,
          paddingHorizontal: 10,
          textAlign: I18nManager.isRTL ? 'right' : 'left',
          ...TxtInputStyle,
        }}
        autoFocus={autoFocus}
      />
      {countryPickerModalVisible && (
        <CountryPicker
          withCallingCode={true}
          visible={countryPickerModalVisible}
          withFlagButton={false}
          withEmoji={true}
          withFilter
          countryCode={callingCode}
          onClose={_onCountryPickerModalClose}
          onSelect={_onCountryChange}
          closeButtonImage={imagePath.closeButton}
          theme={{
            primaryColor: '#f97316',
            backgroundColor: '#FFFFFF',
            onBackgroundTextColor: '#0f172a',
            fontSize: 14,
            fontFamily: fontFamily?.medium,
            filterPlaceholderTextColor: '#94a3b8',
            itemHeight: 52,
            flagSize: 22,
          }}
          filterProps={{
            placeholder: 'Search country...',
            placeholderTextColor: '#94a3b8',
            style: {
              fontSize: 14,
              color: '#0f172a',
              paddingHorizontal: 16,
            },
          }}
          flatListProps={{
            contentContainerStyle: { paddingHorizontal: 16 },
          }}
        />
      )}
    </View>
  );
};
export default React.memo(PhoneNumberInput);
