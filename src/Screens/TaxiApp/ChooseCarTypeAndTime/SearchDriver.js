import LottieView from 'lottie-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import { useSelector } from 'react-redux';
import { searchingLoader } from '../../../Components/Loaders/AnimatedLoaderFiles';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import stylesFun from './styles';

export default function () {

  const { appData, themeColors, appStyle } = useSelector((state) => state?.initBoot);

  // alert(isShowRating);
  const fontFamily = appStyle?.fontSizeData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const styles = stylesFun({ fontFamily, themeColors });
  const commonStyles = commonStylesFun({ fontFamily });
  const { profile } = appData;

  //give review and update the rate

  return (
    <View
      style={{
        paddingHorizontal: 10,
        zIndex: 1000,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            height: moderateScaleVertical(100),
            width: moderateScale(100),
            // marginVertical: moderateScaleVertical(40),
          }}>
          <LottieView
            source={searchingLoader}
            autoPlay
            loop
            style={{
              height: moderateScaleVertical(100),
              width: moderateScale(100),
            }}

            colorFilters={[
              { keypath: "Shape Layer 16", color:  themeColors.primary_color },
              { keypath: "Shape Layer 15", color: themeColors.primary_color },
              { keypath: "Shape Layer 14", color: themeColors.primary_color },
              { keypath: "Shape Layer 13", color: themeColors.primary_color },
              { keypath: "Shape Layer 12", color: themeColors.primary_color },
              { keypath: "Shape Layer 11", color: themeColors.primary_color },
              { keypath: "Shape Layer 10", color: themeColors.primary_color },
              { keypath: "Shape Layer 9", color: themeColors.primary_color },
              { keypath: "Shape Layer 8", color: themeColors.primary_color },
              { keypath: "Shape Layer 7", color: themeColors.primary_color },
              { keypath: "Shape Layer 6", color: themeColors.primary_color },
              { keypath: "Shape Layer 5", color: themeColors.primary_color },
              { keypath: "Shape Layer 20", color: themeColors.primary_color },
              { keypath: "Shape Layer 19", color: themeColors.primary_color },
              { keypath: "Shape Layer 18", color: themeColors.primary_color },
              { keypath: "Shape Layer 17", color: themeColors.primary_color },
            ]}
          />
        </View>
        <Text
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {strings.CONNECTING_YOU_TO_NEARBY_DERIVER}
        </Text>
        <Text
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.regular,
            marginVertical: moderateScaleVertical(20),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {strings.YOUR_RIDE_WILL_START_SOON}
        </Text>
      </View>
    </View>
  );
}
