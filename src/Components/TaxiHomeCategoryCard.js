import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { appIds } from '../utils/constants/DynamicAppKeys';
import { getImageUrl } from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

const TaxiHomeCategoryCard = ({data = {},onPress = () => { },mainViewStyle}) => {
  
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appStyle } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const imageURI = getImageUrl(data?.icon?.image_fit,data?.icon?.image_path,'200/200');

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: (width - moderateScale(16 * 2) - moderateScale(12 * 3)) / 4,
        ...styles.mainView,
        ...mainViewStyle
      }}>
      {!!imageURI ? (
        <View style={styles.imageContainer}>
          {!!isSVG ? (
            <View
              style={{
                height: moderateScale(40),
                width: moderateScale(40),
              }}>
              <SvgUri
                height={moderateScale(40)}
                width={moderateScale(40)}
                uri={imageURI}
              />
            </View>
          ) : (
            <FastImage
              style={styles.imageStyle}
              source={{
                uri: imageURI,
                priority: FastImage.priority.high,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      ) : (
        <></>
      )}
      <Text
        style={{
          color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          fontFamily: fontFamily?.regular,
          marginTop: moderateScaleVertical(6),
          fontSize: textScale(12),
          textAlign: 'center',
        }}>
        {data.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScaleVertical(4),
  },
  imageStyle: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(8),
  },
  mainView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(10),
  },
});
export default React.memo(TaxiHomeCategoryCard);
