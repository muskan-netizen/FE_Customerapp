import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';

// import OrderCardComponent from './OrderCardComponent';

export default function VendorList({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const isDarkMode = theme;
  console.log(route.params, 'VendorList params');
  const {allVendors, selectedVendor, screenType} = route.params;
  const [state, setState] = useState({
    isLoading: false,
    selectedVendorInStore: selectedVendor,
  });
  const {isLoading, selectedVendorInStore} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const currentTheme = useSelector((state) => state.initBoot);
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  const {themeColors, themeLayouts} = currentTheme;

  const setStoreAndRedirect = (i) => {
    updateState({selectedVendorInStore: i});
    navigation.navigate(
      screenType == staticStrings.ORDERS
        ? navigationStrings.VENDOR_ORDER
        : screenType == staticStrings.PRODUCTS
        ? navigationStrings.VENDOR_PRODUCT
        : navigationStrings.VENDOR_REVENUE,
      {
        selectedVendorFrom: i,
      },
    );
  };
  const styles = stylesData({fontFamily});

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={imagePath.back}
        centerTitle={'Available Stores'}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      <View
        style={{
          marginTop: moderateScaleVertical(20),
          marginHorizontal: moderateScale(10),
        }}>
        {allVendors && allVendors.length
          ? allVendors.map((i, inx) => {
              let imageurl = i.logo
                ? getImageUrl(i.logo.image_fit, i.logo.image_path, '200/200')
                : logoUrl;
              return (
                <TouchableOpacity
                  onPress={() => setStoreAndRedirect(i)}
                  key={inx}
                  style={
                    isDarkMode
                      ? [
                          styles.listViewStyle,
                          {backgroundColor: MyDarkTheme.colors.lightDark},
                        ]
                      : styles.listViewStyle
                  }>
                  <View
                    style={{
                      flex: 0.8,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <FastImage
                      source={{uri: imageurl}}
                      style={{
                        height: moderateScale(48),
                        width: moderateScale(48),
                        borderRadius: moderateScale(48 / 2),
                      }}
                    />
                    <Text
                      style={
                        isDarkMode
                          ? [
                              styles.vendorTitleStyle,
                              {color: MyDarkTheme.colors.text},
                            ]
                          : styles.vendorTitleStyle
                      }>
                      {i.name}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.2,
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                    }}>
                    {!!(i?.id == selectedVendorInStore?.id) && (
                      <Image
                        style={{tintColor: themeColors.primary_color}}
                        source={imagePath.done}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          : null}
      </View>
    </WrapperContainer>
  );
}

export function stylesData({fontFamily}) {
  const currentTheme = useSelector((state) => state.initBoot);
  const {themeColors} = currentTheme;
  const styles = StyleSheet.create({
    listViewStyle: {
      flexDirection: 'row',
      marginBottom: moderateScaleVertical(10),
      justifyContent: 'space-between',
      backgroundColor: colors.white,
      borderRadius: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      padding: moderateScale(10),
    },
    vendorTitleStyle: {
      marginLeft: moderateScale(10),
      color: colors.textGreyI,
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
    },
  });
  return styles;
}
