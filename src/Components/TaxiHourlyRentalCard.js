import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';
import { SvgUri } from 'react-native-svg';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../styles/theme';
import { appIds } from '../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';
import imagePath from '../constants/imagePath';

const TaxiHomeCategoryCard = ({ data = {}, onPress = () => { }, mainViewStyle }) => {

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appStyle } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const imageURI = getImageUrl(data?.icon?.image_fit, data?.icon?.image_path, '200/200');


  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: getBundleId() == appIds.hezniTaxi ? width / moderateScale(3) : undefined,
        ...styles.mainView,
        ...mainViewStyle
      }}>

      <View style={styles.container}>

        <FastImage
          style={styles.imageStyle}
          source={imagePath.ic_hourly_taxi}
          resizeMode="contain"
        />
      </View>
      <View style={{ flex: 0.5 }}>
        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            fontFamily: fontFamily?.regular,
            marginTop: moderateScaleVertical(8),
            fontSize: textScale(12),
          }}>
          {"Rentals"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    backgroundColor: colors.lightGreyBg,
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(5),
  },
  imageStyle: {
    height: moderateScale(width / 8),
    width: moderateScale(width / 8),
    borderRadius: moderateScale(10),
  },
  mainView: {
    marginVertical: moderateScale(10),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  }
});
export default React.memo(TaxiHomeCategoryCard);
