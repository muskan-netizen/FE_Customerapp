import React, {createRef, useEffect, useRef, useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import deviceInfoModule, {getBundleId} from 'react-native-device-info';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import FastImage from 'react-native-fast-image';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {getImageUrl, showSuccess} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import {RadioButton} from 'react-native-paper';

import ListEmptyVendors from '../../Vendors/ListEmptyVendors';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import strings from '../../../constants/lang';
import {string} from 'prop-types';
import {BlurView} from '@react-native-community/blur';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import ScaledImage from 'react-native-scalable-image';
import {useNavigation} from '@react-navigation/native';
import CustomAnimatedLoader from '../../../Components/CustomAnimatedLoader';
import {
  loaderOne,
  voiceListen,
} from '../../../Components/Loaders/AnimatedLoaderFiles';
import LottieView from 'lottie-react-native';
import HomeLoader from '../../../Components/Loaders/HomeLoader';
import DeliveryTypeComp from '../../../Components/DeliveryTypeComp';
import {appIds} from '../../../utils/constants/DynamicAppKeys';

export default function DashBoardHeaderFive({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
  isLoadingB = false,
  _onVoiceListen = () => {},
  isVoiceRecord = false,
  _onVoiceStop = () => {},
  showAboveView = true,
  currentLocation,
}) {
  const navigation = useNavigation();
  console.log('currentLocation=>', currentLocation, 'location=>', location);
  const {appData, themeColors, appStyle, themeColor, themeToggle} = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});

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
      }}>
      {showAboveView ? (
        <View
          style={{
            ...styles.headerContainer,
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.borderColorD,
            // borderBottomWidth: 0,
          }}>
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
            {!!appData?.profile?.preferences?.is_hyperlocal && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate(navigationStrings.LOCATION, {
                    type: 'Home1',
                  })
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 0.85,
                  marginLeft: moderateScale(8),
                }}>
                <Image
                  style={styles.locationIcon}
                  source={imagePath.redLocation}
                  resizeMode="contain"
                />
                <View>
                  {!!location?.type && (
                    <Text numberOfLines={1} style={styles.locationTypeTxt}>
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
                          : colors.blackOpacity30,
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
              height: moderateScale(30),
              width: moderateScale(80),
            }}>
            <TouchableOpacity
              style={{marginHorizontal: moderateScale(8)}}
              onPress={() =>
                navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
              }>
              <Image
                style={{
                  tintColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.black,
                }}
                source={imagePath.search1}
              />
            </TouchableOpacity>
            {isVoiceRecord ? (
              <TouchableOpacity onPress={_onVoiceStop}>
                <LottieView
                  style={{
                    height: moderateScale(43),
                    width: moderateScale(30),
                    marginLeft: moderateScale(-2),
                  }}
                  source={voiceListen}
                  autoPlay
                  loop
                  colorFilters={[
                    {keypath: 'layers', color: themeColors.primary_color},
                    {keypath: 'transparent2', color: themeColors.primary_color},
                    {keypath: 'transparent1', color: themeColors.primary_color},
                    {keypath: '01', color: themeColors.primary_color},
                    {keypath: '02', color: themeColors.primary_color},
                    {keypath: '03', color: themeColors.primary_color},
                    {keypath: '04', color: themeColors.primary_color},
                  ]}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{marginHorizontal: moderateScale(8)}}
                onPress={_onVoiceListen}>
                <Image
                  source={imagePath.icVoice}
                  style={{
                    height: moderateScale(20),
                    width: moderateScale(20),
                    borderRadius: moderateScale(10),
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : null}

      <DeliveryTypeComp selectedToggle={selcetedToggle} />

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
