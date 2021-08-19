import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
} from '../styles/responsiveSize';

export default function Header2({
  centerTitle = '',
  textStyle,
  onPressRight,
  onPressLeft,
  leftIcon,
  rightIcon,
  headerContainerStyle = {},
}) {
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const navigation = useNavigation();
  return (
    <View
      style={{
        height: StatusBarHeight,
        alignItems: 'center',
        flexDirection: 'row',
        ...headerContainerStyle,
      }}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={
            !!onPressLeft
              ? onPressLeft
              : () => {
                  navigation.goBack();
                }
          }>
          <Image
            resizeMode="contain"
            source={leftIcon}
            style={styles.leftIcon}
          />
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={{
            ...styles.textStyle,
            ...textStyle,
          }}>
          {centerTitle}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onPressRight}
        style={{marginLeft: 'auto', marginHorizontal: moderateScale(20)}}>
        <Image
          source={rightIcon}
          resizeMode="contain"
          style={styles.rightIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    leftIcon: {
      height: moderateScaleVertical(25),
      width: moderateScaleVertical(20),
      marginHorizontal: moderateScale(15),
      tintColor: colors.black,
    },
    textStyle: {
      color: colors.black2Color,
      fontSize: textScale(16),
      lineHeight: textScale(28),
      fontFamily: fontFamily.medium,
    },
    rightIcon: {
      height: moderateScaleVertical(25),
      width: moderateScale(25),
    },
  });
  return styles;
}
