import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../../styles/responsiveSize';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../../../../utils/helperFunctions';
import { SvgUri } from 'react-native-svg';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../../../styles/theme';
import navigationStrings from '../../../../navigation/navigationStrings';
import strings from '../../../../constants/lang';

const HomeCategoryCard11 = ({
  data = {},
  onPress = () => { },
  isLoading = false,
  index = 0,
  navigation,
  priceType = "vendor"
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot || {});
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '160/160',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const onLoad = (evl) => { };

  let imgHeight = moderateScale(70);
  let imgWidth = moderateScale(70);
  let imgRadius = moderateScale(35);

  console.log("isSVGisSVG", isSVG)

  if (index == 5) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate(navigationStrings.CATEGORY, {
          data: {
            priceType: priceType
          }
        })}
        style={{
          width: (width - moderateScale(16)) / 3,
        }}
      >
        <View style={{
          ...styles.boxStyle,

          backgroundColor: getColorCodeWithOpactiyNumber(
            themeColors?.primary_color.substr(1),
            20,
          ),
        }}>

          <Text
            style={{
              color: themeColors?.primary_color,
              fontFamily: fontFamily.medium,
              fontSize: textScale(10),
              textAlign: 'center',

            }}>
            {strings.VIEW_ALL}
          </Text>


        </View>
      </TouchableOpacity>
    )
  }
  if (index < 5) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          width: (width - moderateScale(16)) / 3,
          marginVertical: moderateScale(0),
          justifyContent: 'center',
          alignItems: 'center',

        }}>
        <View
          style={{
            ...styles.boxStyle,
            backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.grey5
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
                resizeMode="cover"
                onLoad={onLoad}
              />
            </View>
          )}
        </View>

        <Text
          // numberOfLines={1}
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
            textAlign: 'center',
            marginTop: moderateScaleVertical(8),
            // width: moderateScale(80),
          }}>
          {data.name}
        </Text>

      </TouchableOpacity>
    );
  }
  return null;
};
export default React.memo(HomeCategoryCard11);
const styles = StyleSheet.create({
  boxStyle: {
    borderRadius: moderateScale(8),
    minWidth: width / 3.4,
    minHeight: moderateScale(80),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey5,
    paddingVertical: moderateScaleVertical(4),
    borderColor: colors.textGreyLight,
  }
});