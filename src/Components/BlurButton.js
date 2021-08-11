import React from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';

export default function BlurButton({con}) {
  const {appStyle, themeColors} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  return (
    <View
      style={{
        position: 'absolute',
        left: moderateScale(24),
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        right: moderateScale(24),
        backgroundColor: 'rgba(255,255,255,.4)',
        borderRadius: 40,
        height: moderateScaleVertical(30),
      }}>
      <Text
        style={{
          color: colors.white,
          fontFamily: fontFamily.bold,
        }}>
        Delivery
      </Text>
    </View>
  );
}
