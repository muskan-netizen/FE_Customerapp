import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';
import BlurImages from './BlurImages';

export default function BrandCard2({data = {}, onPress = () => {}}) {
  const navigation = useNavigation();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const theme = useSelector((state) => state?.initBoot?.themeColor);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const scaleInAnimated = new Animated.Value(0);
  const {appStyle, themeColors} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  console.log(
    getImageUrl(data.image.image_fit, data.image.image_path, '800/400'),
    'datadatadatadatadata',
  );

  return (
    <View style={styles.imgContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={() => pressInAnimation(scaleInAnimated)}
        onPressOut={() => pressOutAnimation(scaleInAnimated)}
        style={{
          backgroundColor: colors.borderColorNew,
          // paddingVertical: moderateScaleVertical(30),
          borderRadius: moderateScale(10),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <BlurImages
          isDarkMode={isDarkMode}
          themeColor={themeColors.primary_color}
          style={{
            ...styles.imgStyle,
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyColor,
          }}
          thumnailUrl={{
            uri: getImageUrl(
              data.image.image_fit,
              data.image.image_path,
              '40/40',
            ),
          }}
          originalUrl={{
            uri: getImageUrl(
              data.image.image_fit,
              data.image.image_path,
              '400/400',
            ),
          }}
          containerStyle={{borderRadius: moderateScale(10), width: '100%'}}
        />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: textScale(11),
          fontFamily: fontFamily.regular,
          marginVertical: moderateScaleVertical(10),
          alignSelf: 'center',
          color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
        }}>
        {data?.name ? data?.name : data?.translation[0]?.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    width: (width - moderateScale(60)) / 3,
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(10),
    flexDirection: 'column',
  },
  imgStyle: {
    height: moderateScale(100),
    width: '100%',
    borderRadius: moderateScale(10),
  },
});
