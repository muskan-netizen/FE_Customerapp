import React from 'react';
import { I18nManager, Image, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorSchema } from '../utils/utils';

const ListItemHorizontal = ({
  leftIconStyle,
  iconLeft,
  iconRight,
  centerHeading,
  centerText,
  onPress = () => { },
  onRightIconPress = () => { },
  containerStyle = {},
  centerContainerStyle = {},
  centerHeadingStyle = {},
  rightIconStyle = {},
  rightText = '',
  showCountry = false
}) => {
  const { appStyle, primary_country ,themeColors} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        paddingVertical: moderateScaleVertical(16),
        paddingHorizontal: moderateScale(16),
        alignItems: 'center',
        backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white,
        ...containerStyle,
      }}>
      {iconLeft ? (
        <View style={{
          backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.backgroundGrey,
          padding: moderateScale(10),
          borderRadius: moderateScale(10),
          marginRight: moderateScale(12),
          ...leftIconStyle 
        }}>
          <Image
            source={iconLeft}
            style={{
              transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
              tintColor: themeColors.primary_color,
              height: moderateScale(22),
              width: moderateScale(22),
            }}
            resizeMode='contain'
          />
        </View>
      ) : (
        <View />
      )}
      <View
        style={{
          flex: 1,
          ...centerContainerStyle,
        }}>
        <Text
          style={{
            fontSize: textScale(15),
            fontFamily: fontFamily?.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            marginBottom: centerText ? moderateScale(2) : 0,
            ...centerHeadingStyle,
          }}>
          {centerHeading}
        </Text>
        {!!centerText && (
          <Text
            style={{
              ...commonStyles.mediumFont14,
              color: colors.grey,
              lineHeight: textScale(20),
              opacity: 0.7,
              fontSize: textScale(13),
              marginTop: moderateScaleVertical(5),
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}>
            {centerText}
          </Text>
        )}
      </View>
      {showCountry ?
        <>
          {!!primary_country?.primary_country && !!primary_country?.primary_country?.flag ? <FastImage
            source={{ uri: primary_country?.primary_country.flag }}
            style={{
              width: moderateScale(36),
              height: moderateScale(24),
              marginRight: moderateScale(8)
            }}
            resizeMode={FastImage.resizeMode.contain}
          /> : null}
        </>
        : null
      }
      {!!rightText && (
        <Text
          style={{
            ...commonStyles.mediumFont14,
            color: isDarkMode ? colors.white : colors.black,
            lineHeight: textScale(20),
            opacity: 0.7,
            fontSize: textScale(13),
            marginTop: moderateScaleVertical(5),
            textAlign: I18nManager.isRTL ? 'right' : 'left',
          }}>
          {rightText}
        </Text>
      )}
      {iconRight && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Image
            style={[
              rightIconStyle,
              { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] },
            ]}
            source={iconRight}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(ListItemHorizontal);
