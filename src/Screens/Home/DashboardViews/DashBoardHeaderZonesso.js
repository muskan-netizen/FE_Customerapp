import React, {createRef, useEffect, useRef, useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
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
import Header from '../../../Components/Header';

export default function DashBoardHeaderZonesso({
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
}) {
  const navigation = useNavigation();

  const {appData, themeColors, appStyle, themeColor, themeToggle} = useSelector(
    (state) => state?.initBoot,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});

  return (
    <View
      style={{
        marginHorizontal: moderateScale(18),
      }}>
      <Header
        leftIcon={imagePath.location1}
        // centerTitle={'Abu Dhabi'}
        customLeft={() => {
          return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity activeOpacity={0.7}>
                <Image source={imagePath.location1} />
              </TouchableOpacity>
              <Text style={{marginLeft: 12, fontFamily: fontFamily.regular}}>
                Abu Dhabi
              </Text>
            </View>
          );
        }}
      />
      {showAboveView ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }
          style={{
            ...styles.headerContainer,
            borderBottomWidth: 0,
            backgroundColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.blackOpacity05,
            borderRadius: moderateScale(12),
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              alignItems: 'center',
            }}>
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
              justifyContent: 'center',
              alignItems: 'center',
              height: moderateScale(36),
            }}>
            <TouchableOpacity
              style={{}}
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
          </View>
        </TouchableOpacity>
      ) : null}

      {/* <DeliveryTypeComp selectedToggle={selcetedToggle} /> */}

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
