import React from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, Animated, StatusBar } from 'react-native';
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
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../../../utils/helperFunctions';
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
import actions from '../../../redux/actions';
import { hitSlopProp } from '../../../styles/commonStyles';
import SearchBar3 from '../../../Components/SearchBar3';
import LinearGradient from 'react-native-linear-gradient';

import * as Animatable from 'react-native-animatable';

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
  cartItemCountView = {
    position: 'absolute',
    zIndex: 100,

    // backgroundColor: colors.cartItemPrice,

    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemCountNumber = {
    fontSize: textScale(8),
  },
}) {
  const navigation = useNavigation();
  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
    (state) => state?.initBoot,
  );
  const { cartItemCount } = useSelector((state) => state?.cart || {});
  const { userData } = useSelector((state) => state?.auth);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  console.log("profileInfoprofileInfo",profileInfo)



  const imageURI = getImageUrl(
    isDarkMode
      ? profileInfo?.dark_logo?.image_fit
      : profileInfo?.logo?.image_fit,
    isDarkMode
      ? profileInfo?.dark_logo?.image_path
      : profileInfo?.logo?.image_path,
    '200/400',
  );

  const onPressWishList = () => {
    if (!!userData?.auth_token) {
      navigation.navigate(navigationStrings.WISHLIST)
    } else {
      actions.setAppSessionData('on_login')
    }

  }

  const headerIconStyle = {
    height: moderateScale(34),
    width: moderateScale(34),
    // borderRadius: moderateScale(28 / 2)
  }
  return (

    <LinearGradient
      colors={[themeColors?.primary_color, themeColors?.primary_color, getColorCodeWithOpactiyNumber(
          themeColors.primary_color.substr(1),
          40)]}

    >
      <SafeAreaView>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: moderateScale(16),
            alignItems: 'center',
            marginTop: moderateScaleVertical(4),
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.openDrawer()}
            style={{ alignItems: 'center', }}>
            <Image
              style={{
                ...headerIconStyle,
                tintColor: colors.white,
                marginRight: moderateScale(16),
                height:moderateScale(26),
                width:moderateScale(26),
              }}
              source={imagePath.icHamburger}
              resizeMode="contain"
            />
          </TouchableOpacity>
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
                  height: moderateScale(60),
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

            {/* wish list */}
            <TouchableOpacity
              hitSlop={hitSlopProp}
              style={{ marginHorizontal: moderateScale(8) }}
              onPress={onPressWishList}>
              <Image
                style={{
                  ...headerIconStyle,
                  tintColor: colors.white,

                }}
                source={imagePath.wishlist3}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginHorizontal: moderateScale(8) }}
              onPress={() => navigation.navigate(navigationStrings.CART)}>
              <Image
                style={{
                  ...headerIconStyle,
                  tintColor: colors.white,
                }}
                source={imagePath.icEcomCart2}
              />
            </TouchableOpacity>

          </View>
        </View>


        <DeliveryTypeEcommerceComp
          selectedToggle={selcetedToggle}
          themeColors={{primary_color: colors.black}}
        />
        <Animatable.View
          animation={'fadeIn'}
          delay={400}
        >
          <SearchBar3
            onPress={() => navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)}
          />
        </Animatable.View>



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
      </SafeAreaView>
    </LinearGradient>


  );
}