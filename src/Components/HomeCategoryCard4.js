import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../utils/helperFunctions';

const HomeCategoryCard3 = ({
  data = {},
  onPress = () => { },
  isLoading = false,
  applyRadius = true
}) => {

  const { themeColor, themeToggle, themeColors, appStyle } = useSelector((state) => state?.initBoot);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '120/120',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const onLoad = (evl) => { };

  let imgHeight = moderateScale(70);
  let imgWidth = moderateScale(70);
  let imgRadius = moderateScale(applyRadius ? 25 : 0);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        marginVertical: moderateScale(0),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
   
        {isSVG ? (
          <SvgUri
            height={imgHeight}
            width={imgWidth}
            uri={imageURI}
            style={{}}
          />
        ) : (
          <View>
            <FastImage
              style={{
                height: imgHeight,
                width: imgWidth,
                borderRadius: imgRadius,
              }}
              source={{
                uri: imageURI,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              resizeMode="contain"
              onLoad={onLoad}
            />
          </View>
        )}
  
      <View style={{ flex: 0.2 }}>
        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
            fontFamily: fontFamily.medium,
            fontSize: textScale(10),
            textAlign: 'center',
            marginTop: moderateScaleVertical(4),
            width: moderateScale(80),
          }}>
          {data.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(HomeCategoryCard3);

