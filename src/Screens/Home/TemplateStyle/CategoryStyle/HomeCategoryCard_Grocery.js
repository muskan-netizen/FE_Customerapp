import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../../styles/theme';
import { appIds } from '../../../../utils/constants/DynamicAppKeys';
import { getImageUrl } from '../../../../utils/helperFunctions';
import { getColorSchema } from '../../../../utils/utils';
import imagePath from '../../../../constants/imagePath';
import strings from '../../../../constants/lang';

const HomeCategoryCard3 = ({
  data = {},
  onPress = () => { },
  isLoading = false,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appStyle } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '160/160',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;


  let imgHeight =
    appStyle?.homePageLayout === 5
      ? moderateScale(60)
      : moderateScale(80);
  let imgWidth =
    appStyle?.homePageLayout === 5
      ? moderateScale(60)
      : moderateScale(80);
  let imgRadius =
    appStyle?.homePageLayout === 5
      ? moderateScale(30)
      : moderateScale(15 / 2);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: width / 4,
        // marginVertical: moderateScale(1),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.backgroundYellow,
          borderWidth: 2,
          borderColor: colors.borderBlue,
          borderRadius: moderateScale(12),
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
            />
          </View>
        )}
      </View>
      <View style={{ top: moderateScaleVertical(-12), zIndex: -1, width: moderateScale(imgWidth + 2) }}>
        <ImageBackground
          style={{ paddingTop: moderateScale(16), paddingBottom: moderateScale(6), paddingHorizontal: moderateScale(6) }}
          source={imagePath.catCardBack}
          resizeMode='stretch'
        >
          <Text style={{ color: colors.yelowGreen, fontFamily: fontFamily.medium, fontSize: textScale(8), textAlign: 'center', justifyContent: 'center' }}>{strings.UPTO30OFF}</Text>
        </ImageBackground>
      </View>
      <Text
        numberOfLines={2}
        style={{
          color: colors.white,
          fontFamily: fontFamily.medium,
          fontSize: textScale(10),
          textAlign: 'center',
          flex: 1,
          top: moderateScaleVertical(-8)
        }}>
        {data?.name || (data?.translation && data?.translation[0]?.name)}
      </Text>
    </TouchableOpacity>
  );
};
export default React.memo(HomeCategoryCard3);
const styles = StyleSheet.create({});