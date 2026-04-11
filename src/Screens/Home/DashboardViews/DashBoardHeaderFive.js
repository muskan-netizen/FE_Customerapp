import { useNavigation } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { enableFreeze } from 'react-native-screens';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CustomAnimatedLoader from '../../../Components/CustomAnimatedLoader';
import DeliveryTypeComp from '../../../Components/DeliveryTypeComp';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { getImageUrl } from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';

enableFreeze(true);

function DashBoardHeaderFive({
  location = [],
  selcetedToggle,
  isLoadingB = false,
  showAboveView = true,
  onSeviceType = () => {},
  isScrolled = false,
}) {
  const navigation = useNavigation();
  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
    (state) => state?.initBoot,
  );
  const { dineInType } = useSelector((state) => state?.home);
  const { userData } = useSelector((state) => state?.auth);

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;

  const imageURI = getImageUrl(
    isDarkMode ? profileInfo?.dark_logo?.image_fit : profileInfo?.logo?.image_fit,
    isDarkMode ? profileInfo?.dark_logo?.image_path : profileInfo?.logo?.image_path,
    '200/400',
  );

  const isLoggedIn = !!userData?.auth_token;
  const showServiceTypeButton =
    !!appData?.profile?.preferences?.is_service_product_price_from_dispatch &&
    dineInType === 'on_demand' &&
    !!appData?.profile?.preferences?.is_service_price_selection;

  const isSavedAddress = isLoggedIn && !!location?.id;
  const locationTypeLabel =
    location?.type === 2 ? strings.WORK
    : location?.type === 1 ? strings.HOME
    : location?.type_name && location?.type_name !== '0' && location?.type_name !== null
    ? location?.type_name
    : 'Saved Location';

  const primaryColor = themeColors?.primary_color || '#2563EB';

  // Internal Animated.Value — animates when isScrolled prop changes
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isScrolled ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [isScrolled]);

  const headerBg = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0)', isDarkMode ? MyDarkTheme.colors.background : 'rgba(255,255,255,1)'],
    extrapolate: 'clamp',
  });

  const shadowOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
    extrapolate: 'clamp',
  });

  const primaryTextColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', isDarkMode ? '#ffffff' : '#111111'],
    extrapolate: 'clamp',
  });

  const secondaryTextColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.80)', isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)'],
    extrapolate: 'clamp',
  });

  const iconTint = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', isDarkMode ? '#ffffff' : primaryColor],
    extrapolate: 'clamp',
  });

  const btnBg = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.20)', isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)'],
    extrapolate: 'clamp',
  });

  const btnBorder = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.38)', isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'],
    extrapolate: 'clamp',
  });

  const separatorOpacity = animValue.interpolate({
    inputRange: [0.6, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={{
        backgroundColor: headerBg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity,
        shadowRadius: 8,
        elevation: isScrolled ? 6 : 0,
        borderBottomWidth: isScrolled ? 0.8 : 0,
        borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(17,17,17,0.08)',
      }}>
      {/* iOS glassmorphism */}
      {Platform.OS === 'ios' && (
        <BlurView
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          blurType="light"
          blurAmount={8}
          reducedTransparencyFallbackColor="rgba(255,255,255,0.1)"
        />
      )}

      <SafeAreaView edges={['top']}>
        {showAboveView ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: moderateScale(12),
              paddingTop: moderateScaleVertical(4),
              paddingBottom: moderateScaleVertical(8),
              minHeight: moderateScaleVertical(52),
            }}>

            {/* Logo */}
            {profileInfo && (profileInfo?.logo || profileInfo?.dark_logo) ? (
              <View
                style={{
                  width: moderateScale(42),
                  height: moderateScale(42),
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: moderateScale(8),
                }}>
                <FastImage
                  style={{ width: moderateScale(42), height: moderateScale(42) }}
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri: imageURI,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }}
                />
              </View>
            ) : null}

            {/* Location */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate(navigationStrings.LOCATION, { type: 'Home1' })}
              style={{ flex: 1, minWidth: 0, marginRight: moderateScale(8) }}>
              <Animated.Text
                numberOfLines={1}
                style={{
                  color: secondaryTextColor,
                  fontFamily: fontFamily?.medium,
                  fontSize: textScale(10),
                  marginBottom: moderateScaleVertical(1),
                }}>
                {isSavedAddress ? locationTypeLabel : 'Current Location'}
              </Animated.Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Animated.Image
                  style={{
                    height: moderateScale(12),
                    width: moderateScale(12),
                    tintColor: iconTint,
                    marginRight: moderateScale(4),
                  }}
                  source={imagePath.redLocation}
                  resizeMode="contain"
                />
                <Animated.Text
                  numberOfLines={1}
                  style={{
                    color: primaryTextColor,
                    fontFamily: fontFamily?.semiBold || fontFamily?.bold,
                    fontSize: textScale(12),
                    flex: 1,
                  }}>
                  {location?.address || 'Detecting location...'}
                </Animated.Text>
                <Animated.Image
                  source={imagePath.dropDownSingle}
                  style={{
                    width: moderateScale(10),
                    height: moderateScale(10),
                    tintColor: secondaryTextColor,
                    marginLeft: moderateScale(4),
                  }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>

            {/* Action buttons */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(8), flexShrink: 0 }}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)}>
                <Animated.View
                  style={{
                    width: moderateScale(44),
                    height: moderateScale(44),
                    borderRadius: moderateScale(22),
                    backgroundColor: btnBg,
                    borderWidth: 1,
                    borderColor: btnBorder,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Animated.Image
                    style={{ height: moderateScale(18), width: moderateScale(18), tintColor: iconTint }}
                    source={imagePath.search1}
                    resizeMode="contain"
                  />
                </Animated.View>
              </TouchableOpacity>

              {showServiceTypeButton ? (
                <TouchableOpacity activeOpacity={0.75} onPress={onSeviceType}>
                  <Animated.View
                    style={{
                      width: moderateScale(44),
                      height: moderateScale(44),
                      borderRadius: moderateScale(22),
                      backgroundColor: btnBg,
                      borderWidth: 1,
                      borderColor: btnBorder,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Animated.Image
                      style={{ height: moderateScale(20), width: moderateScale(20), tintColor: iconTint }}
                      source={imagePath.servicetype}
                      resizeMode="contain"
                    />
                  </Animated.View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : null}

        {getBundleId() !== appIds?.dropOff ? (
          <DeliveryTypeComp
            selectedToggle={selcetedToggle}
            tabMainStyle={{ marginBottom: 0 }}
          />
        ) : null}
      </SafeAreaView>

      {/* Bottom separator */}
      <Animated.View
        style={{
          height: 1,
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
          opacity: separatorOpacity,
        }}
      />

      <CustomAnimatedLoader
        source={loaderOne}
        loaderTitle={strings.LOADING}
        containerColor={isDarkMode ? MyDarkTheme.colors.lightDark : primaryColor}
        loadercolor={colors.white}
        animationStyle={[{ height: moderateScaleVertical(40), width: moderateScale(40) }]}
        visible={isLoadingB}
      />
    </Animated.View>
  );
}

export default React.memo(DashBoardHeaderFive);
