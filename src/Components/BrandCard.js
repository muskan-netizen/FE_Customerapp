import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

export default function BrandCard({data = {}, onPress = () => {}}) {
  const navigation = useNavigation();
  const scaleInAnimated = new Animated.Value(0);
  const {appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      style={[
        styles.imgContainer,
        {...commonStyles.shadowStyle},
        {...getScaleTransformationStyle(scaleInAnimated)},
      ]}>
      <FastImage
        source={{
          uri: getImageUrl(
            data.image.image_fit,
            data.image.image_path,
            '1000/1000',
          ),
        }}
        style={{height: moderateScale(50), width: moderateScale(50)}}
        resizeMode="contain"
      />
      <View
        style={{
          marginLeft: moderateScale(39),
          borderLeftWidth: 1,
          borderColor: colors.brandLineVertical,
          justifyContent: 'center',
          paddingLeft: moderateScale(39),
        }}>
        <Text style={{...commonStyles.futuraBtHeavyFont16}}>
          {data?.translation[0]?.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    marginHorizontal: moderateScale(16),
    padding: moderateScale(18),
    flexDirection: 'row',
    paddingVertical: moderateScaleVertical(10),
  },
});
