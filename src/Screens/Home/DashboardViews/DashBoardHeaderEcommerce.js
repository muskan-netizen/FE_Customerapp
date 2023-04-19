import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { getImageUrl } from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import CustomAnimatedLoader from '../../../Components/CustomAnimatedLoader';
import DeliveryTypeEcommerceComp from '../../../Components/DeliveryTypeEcommerceComp';
import {
  loaderOne
} from '../../../Components/Loaders/AnimatedLoaderFiles';
import strings from '../../../constants/lang';
import { MyDarkTheme } from '../../../styles/theme';


export default function DashBoardHeaderEcommerce({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
  isLoadingB = false,
  _onVoiceListen = () => { },
  isVoiceRecord = false,
  _onVoiceStop = () => { },
  currentLocation,
  nearestLoc,
  currentLoc,
}) {
  const navigation = useNavigation();
  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
    (state) => state?.initBoot,
  );

  const darkthemeusingDevice = useDarkMode();
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
          backgroundColor: isDarkMode
          ? colors.whiteOpacity22
          : colors.white
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: moderateScale(16),
          alignItems: 'center',
          marginTop: moderateScaleVertical(4),
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
                marginLeft: moderateScale(16),
              }}>
              <Image
                style={{
                  height: moderateScale(20),
                  width: moderateScale(20),
                  tintColor: themeColors.primary_color,
                }}
                source={imagePath.icEcomHeaderLocation}
                resizeMode="contain"
              />
              <View>
                {!!location?.type && (
                  <View style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}>
                    <Text numberOfLines={1} style={{ ...styles.locationTypeTxt, color: colors.black, fontSize: textScale(14) }}>
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
                    <Image style={{
                      marginLeft: moderateScale(3)
                    }} source={imagePath.icEcomDropArrow} />
                  </View>
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

          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
            }>
            <Image

              source={imagePath.icEcomSearch}
            />
          </TouchableOpacity>
        </View>
      </View>

      <DeliveryTypeEcommerceComp
        selectedToggle={selcetedToggle}
        tabMainStyle={{
          marginBottom: moderateScaleVertical(30),
        }}
      />

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
