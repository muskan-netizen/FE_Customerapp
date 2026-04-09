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
  width
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

enableFreeze(true)


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
  onSeviceType = () => { }
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


  return (
    <View
      style={{
        borderBottomColor: isDarkMode
          ? colors.whiteOpacity22
          : colors.borderColorD,
        backgroundColor: getBundleId() == appIds?.eatHalal ? colors?.redFireBrick : null,
        paddingTop: Math.max(insets.top, moderateScaleVertical(8)),
      }}>
      {showAboveView ? (
        <View
          style={{
            ...styles.headerContainer,
            marginTop: 0,
            paddingBottom: moderateScaleVertical(2),
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.borderColorD,
            // borderBottomWidth: 0,
          }}>

          {appStyle?.homePageLayout == 10 ? <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.openDrawer()}
            style={{ alignItems: 'center', }}>
            <Image
              style={{
                tintColor: themeColors.primary_color,
                marginRight: moderateScale(16),
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
            }}>
            {!!(
              profileInfo &&
              (profileInfo?.logo || profileInfo?.dark_logo)
            ) ? (
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
            ) : null}
            {(!!appData?.profile?.preferences?.is_hyperlocal || dineInType == "p2p") && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate(navigationStrings.LOCATION, {
                    type: 'Home1',
                  })
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  flex: 0.85,
                  marginLeft: moderateScale(8),
                }}>
                <Image
                  style={[styles.locationIcon, { tintColor: getBundleId() == appIds?.eatHalal ? colors?.white : themeColors.primary_color }]}
                  source={imagePath.redLocation}
                  resizeMode="contain"

                />
                <View>
                  {!!location?.type && (
                    <Text numberOfLines={1} style={[styles.locationTypeTxt, {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : getBundleId() == appIds?.eatHalal ? colors?.white : colors.blackOpacity30,
                      fontFamily: fontFamily.medium,
                    }]}>
                      {location?.type === 3
                        ? !!(
                          location?.type_name != 0 &&
                          location?.type != '0' &&
                          location?.type_name !== null
                        )
                          ? location?.type_name
                          : strings.UNKNOWN
                        : location?.type === 2
                          ? strings.WORK
                          : strings.HOME}
                    </Text>
                  )}

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.locationTxt,
                      {
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : getBundleId() == appIds?.eatHalal ? colors?.white : colors.blackOpacity30,
                        fontFamily: fontFamily.medium,
                      },
                    ]}>
                    {location?.address}

                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minHeight: moderateScale(40),
              paddingRight: moderateScale(8),
              flexShrink: 0,
              gap: moderateScale(6),
            }}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : getBundleId() == appIds?.eatHalal
                  ? 'rgba(255,255,255,0.2)'
                  : 'rgba(0,0,0,0.06)',
                borderRadius: moderateScale(20),
                paddingHorizontal: moderateScale(10),
                paddingVertical: moderateScale(6),
              }}>
              <Image
                style={{
                  height: moderateScale(16),
                  width: moderateScale(16),
                  resizeMode: 'contain',
                  tintColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : getBundleId() == appIds?.eatHalal ? colors?.white : colors.black,
                }}
                source={imagePath.search1}
              />
            </TouchableOpacity>
            {!!appData?.profile?.preferences?.is_service_product_price_from_dispatch && (dineInType === "on_demand") && !!appData?.profile?.preferences?.is_service_price_selection ? <TouchableOpacity onPress={onSeviceType}>
              <Image style={{height:moderateScaleVertical(20),width:moderateScale(20),resizeMode:'contain'}} source={imagePath.servicetype} />
            </TouchableOpacity> : null}
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

export default React.memo(DashBoardHeaderFive)
