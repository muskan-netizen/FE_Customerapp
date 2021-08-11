import React from 'react';
import {
  I18nManager,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';

export default function SearchBar({
  containerStyle = {},
  placeholder = '',
  onChangeText,
  showRightIcon = false,
  rightIconPress = () => {},
  searchValue = '',
}) {
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: moderateScale(16),
        height: moderateScaleVertical(48),
        backgroundColor: colors.white,
        alignItems: 'center',
        ...containerStyle,
      }}>
      <Image style={{tintColor: colors.blackLight}} source={imagePath.search} />
      <View style={{flex: 1, marginLeft: 10}}>
        <TextInput
          style={{
            flex: 1,
            paddingTop: 0,
            paddingBottom: 0,
            fontFamily: fontFamily.medium,
            color: colors.textGrey,
            color: colors.blackLight,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
          }}
          value={searchValue}
          autoFocus={true}
          placeholder={placeholder}
          onChangeText={onChangeText}
          //onChange={onChangeText}
        />
      </View>
      {showRightIcon && (
        <TouchableOpacity onPress={rightIconPress}>
          <Image source={imagePath.crossBlueB} />
        </TouchableOpacity>
      )}
    </View>
  );
}
