import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import { getImageUrl } from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

import { useNavigation } from '@react-navigation/native';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { enableFreeze } from 'react-native-screens';
import CustomAnimatedLoader from '../../../Components/CustomAnimatedLoader';
import DeliveryTypeComp from '../../../Components/DeliveryTypeComp';
import {
  loaderOne,
} from '../../../Components/Loaders/AnimatedLoaderFiles';
import strings from '../../../constants/lang';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { getColorSchema } from '../../../utils/utils';

enableFreeze(true);


function DashBoardHeaderFive({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
  isLoadingB = false,
  showAboveView = true,
  currentLocation,
  nearestLoc,
  currentLoc,
  onSeviceType = () => { },
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
    (state) => state?.initBoot,
  );
  const { dineInType } = useSelector((state) => state?.home);


  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  const imageURI = getImageUrl(
    isDarkMode
      ? profileInfo?.dark_logo?.image_fit
      : profileInfo?.logo?.image_fit,
    isDarkMode
      ? profileInfo?.dark_logo?.image_path
      : profileInfo?.logo?.image_path,
    '200/400',
  );
  const isEatHalalTheme = getBundleId() === appIds?.eatHalal;
  const shouldShowLocation =
    !!appData?.profile?.preferences?.is_hyperlocal || dineInType === 'p2p';
  const showServiceTypeButton =
    !!appData?.profile?.preferences?.is_service_product_price_from_dispatch &&
    dineInType === 'on_demand' &&
    !!appData?.profile?.preferences?.is_service_price_selection;
  const primaryTextColor =
    isDarkMode || isEatHalalTheme ? colors.white : colors.textGreyNew;
  const secondaryTextColor = isEatHalalTheme
    ? colors.whiteOpacity85
    : isDarkMode
    ? colors.whiteOpacity77
    : colors.blackOpacity43;
  const accentColor = isEatHalalTheme ? colors.white : themeColors.primary_color;
  const headerBackgroundColor = isEatHalalTheme
    ? colors.redFireBrick
    : isDarkMode
    ? MyDarkTheme.colors.background
    : colors.white;
  const headerCardBorderColor = isEatHalalTheme
    ? 'rgba(255,255,255,0.16)'
    : isDarkMode
    ? colors.whiteOpacity22
    : colors.borderColorB;
  const actionButtonColor = isEatHalalTheme
    ? colors.whiteOpacity15
    : isDarkMode
    ? 'rgba(255,255,255,0.08)'
    : colors.backgroundGrey;
  const shadowColor = isEatHalalTheme ? colors.blackOpacity20 : colors.blackOpacity10;
  const locationTypeLabel =
    location?.type === 3
      ? (
          location?.type_name !== 0 &&
          location?.type !== '0' &&
          location?.type_name !== null
        )
        ? location?.type_name
        : strings.UNKNOWN
      : location?.type === 2
      ? strings.WORK
      : strings.HOME;


  return (
    <View
      style={{
        borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.borderColorD,
        backgroundColor: headerBackgroundColor,
        paddingTop: Math.max(insets.top, moderateScaleVertical(8)),
      }}>
      {showAboveView ? (
        <View
          style={{
            ...styles.headerContainer,
            marginTop: 0,
            borderBottomWidth: 0,
            minHeight: moderateScaleVertical(68),
          }}>

          {appStyle?.homePageLayout === 10 ? <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.openDrawer()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: moderateScale(42),
              height: moderateScale(42),
              borderRadius: moderateScale(14),
              backgroundColor: actionButtonColor,
              borderWidth: 1,
              borderColor: headerCardBorderColor,
              marginRight: moderateScale(12),
            }}>
            <Image
              style={{
                tintColor: accentColor,
                height: moderateScale(20),
                width: moderateScale(20),
              }}
              source={imagePath.icMenuIcon}
              resizeMode="contain"
            />
          </TouchableOpacity> : null}
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
              marginRight: moderateScale(12),
            }}>
            {profileInfo && (profileInfo?.logo || profileInfo?.dark_logo) ? (
              <View
                style={{
                  width: moderateScale(58),
                  height: moderateScale(58),
                  borderRadius: moderateScale(18),
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  paddingHorizontal: moderateScale(8),
                }}>
                <FastImage
                  style={{
                    width: moderateScale(width / 6),
                    height: moderateScale(40),
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri: imageURI,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }}
                />
              </View>
            ) : null}
            {shouldShowLocation && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate(navigationStrings.LOCATION, {
                    type: 'Home1',
                  })
                }
                style={{
                  flex: 1,
                  minWidth: 0,
                  marginLeft: moderateScale(12),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: moderateScaleVertical(2),
                  }}>
                  <Image
                    style={{
                      height: moderateScale(14),
                      width: moderateScale(14),
                      tintColor: accentColor,
                      marginRight: moderateScale(6),
                    }}
                    source={imagePath.redLocation}
                    resizeMode="contain"
                  />
                  {!!location?.type && (
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.locationTypeTxt,
                        {
                          color: primaryTextColor,
                          fontFamily: fontFamily.bold,
                          fontSize: moderateScale(13),
                          marginRight: moderateScale(4),
                        },
                      ]}>
                      {locationTypeLabel}
                    </Text>
                  )}
                  <Image
                    tintColor={secondaryTextColor}
                    source={imagePath.dropDownSingle}
                    style={{
                      width: moderateScale(12),
                      height: moderateScale(12),
                    }}
                    resizeMode="contain"
                  />
                </View>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.locationTxt,
                    {
                      color: secondaryTextColor,
                      fontFamily: fontFamily.medium,
                      paddingLeft: 0,
                      lineHeight: moderateScale(18),
                    },
                  ]}>
                  {location?.address}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minHeight: moderateScale(44),
              flexShrink: 0,
            }}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
              }
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: moderateScale(44),
                height: moderateScale(44),
                backgroundColor: actionButtonColor,
                borderRadius: moderateScale(15),
                borderWidth: 1,
                borderColor: headerCardBorderColor,
                shadowColor: shadowColor,
                shadowOffset: {
                  width: 0,
                  height: moderateScaleVertical(3),
                },
                shadowOpacity: 0.12,
                shadowRadius: moderateScale(8),
                elevation: 2,
              }}>
              <Image
                style={{
                  height: moderateScale(18),
                  width: moderateScale(18),
                  resizeMode: 'contain',
                  tintColor: accentColor,
                }}
                source={imagePath.search1}
              />
            </TouchableOpacity>
            {showServiceTypeButton ? (
              <TouchableOpacity
                onPress={onSeviceType}
                style={{
                  marginLeft: moderateScale(8),
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: moderateScale(44),
                  height: moderateScale(44),
                  backgroundColor: actionButtonColor,
                  borderRadius: moderateScale(15),
                  borderWidth: 1,
                  borderColor: headerCardBorderColor,
                }}>
                <Image
                  style={{
                    height: moderateScaleVertical(20),
                    width: moderateScale(20),
                    resizeMode: 'contain',
                    tintColor: accentColor,
                  }}
                  source={imagePath.servicetype}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}

      {getBundleId() !== appIds?.dropOff ? <DeliveryTypeComp
        selectedToggle={selcetedToggle}
        tabMainStyle={{
          marginBottom: 0,
        }}
      /> : null}

      <CustomAnimatedLoader
        source={loaderOne}
        loaderTitle={strings.LOADING}
        containerColor={
          isDarkMode ? MyDarkTheme.colors.lightDark : colors.white
        }
        loadercolor={themeColors.primary_color}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
          },
        ]}
        visible={isLoadingB}
      />
    </View>
  );
}

export default React.memo(DashBoardHeaderFive);
