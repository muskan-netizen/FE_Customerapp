import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';
import {SvgUri} from 'react-native-svg';
import Elevations from 'react-native-elevation';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../styles/theme';
import ButtonWithLoader from './ButtonWithLoader';

const LaundryCategoryCard = ({
  data = {},
  onPress = () => {},
  isLoading = false,
}) => {
  const {appStyle, themeToggle, themeColor, themeColors} = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '160/160',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const onLoad = (evl) => {};

  return (
    <View
      // onPress={onPress}

      style={{
        alignItems: 'center',
        borderRadius: moderateScale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20),
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          borderRadius: moderateScale(40),
          height: moderateScale(75),
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        {isSVG ? (
          <SvgUri
            height={moderateScale(50)}
            width={moderateScale(50)}
            uri={imageURI}
            style={{}}
          />
        ) : (
          <View>
            <FastImage
              style={{
                height: moderateScale(50),
                width: moderateScale(50),
                borderRadius: moderateScale(25),
              }}
              source={{
                uri: imageURI,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              resizeMode="cover"
              onLoad={onLoad}
            />
          </View>
        )}

        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            fontFamily: fontFamily.regular,
            fontSize: textScale(12),
            marginLeft: moderateScale(20),
          }}>
          {data.name}
        </Text>
      </View>
      <ButtonWithLoader
        btnText="+ Add"
        btnTextStyle={{
          color: themeColors.primary_color,
        }}
        btnStyle={{
          width: moderateScale(90),
          marginTop: 0,
          height: moderateScaleVertical(35),
          borderRadius: moderateScale(5),
          borderColor: themeColors.primary_color,
        }}
      />
    </View>
  );
};
export default React.memo(LaundryCategoryCard);
const styles = StyleSheet.create({});
