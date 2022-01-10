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
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';

export default function DashBoardHeaderFive({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
  isLoadingB = false,
}) {
  const navigation = useNavigation();
  const pickerRef = createRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const [state, setState] = useState({
    isModalVisible: false,
    checked: '',
    tabs: [],
    setSelectedTab: 0,
  });

  const {isModalVisible, checked, tabs} = state;

  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const imageURI = getImageUrl(
    profileInfo?.logo?.image_fit,
    profileInfo?.logo?.image_path,
    '1000/1000',
  );

  useEffect(() => {
    addAllTabs();
    userSelectedtab();
  }, [appData]);

  const addAllTabs = () => {
    const localTabsArray = [];

    if (toggleData?.profile?.preferences?.delivery_check == 1) {
      localTabsArray.push({
        value:
          toggleData?.profile?.preferences?.delivery_nomenclature ||
          strings.DELIVERY,
        label: 'delivery',
        icon: imagePath.delivery,
        iconInActive: imagePath.deliveryInActive,
        isActive: dine_In_Type === 'delivery' ? true : false,
      });
      if (
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
      }
    }
    if (toggleData?.profile?.preferences?.dinein_check == 1) {
      localTabsArray.push({
        value:
          toggleData?.profile?.preferences?.dinein_nomenclature ||
          strings.DINE_IN,
        label: 'dine_in',
        icon: imagePath.dineIn,
        isActive: dine_In_Type === 'dine_in' ? true : false,
      });
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('dine_in');
      }
    }
    if (toggleData?.profile?.preferences?.takeaway_check == 1) {
      localTabsArray.push({
        value:
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
          strings.TAKEAWAY,
        label: 'takeaway',
        icon: imagePath.takeaway,
        isActive: dine_In_Type === 'takeaway' ? true : false,
      });
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0
      ) {
        selcetedToggle('takeaway');
      }
    }
    updateState({
      tabs: localTabsArray,
      checked: localTabsArray[0],
    });
  };

  const setUserSelectedTab = (label, value) => {
    selcetedToggle(value);
  };

  // const checkSelectedTab = () => {
  //   const newTabs = [...tabs];
  //   newTabs.forEach((item, index) => {
  //     if (item.label === dine_In_Type) {
  //       newTabs[index].isActive = true;
  //       updateState({
  //         tabs: [...newTabs],
  //       });
  //     } else {
  //       newTabs[index].isActive = false;
  //       updateState({
  //         tabs: [...newTabs],
  //       });
  //     }
  //   });
  // };

  const userSelectedtab = () => {
    if (dine_In_Type === 'delivery') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.dinein_nomenclature ||
            strings.DINE_IN,
          'dine_in',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.dinein_nomenclature ||
            strings.DINE_IN,
          'dine_in',
        );
      } else {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      }
    } else if (dine_In_Type === 'dine_in') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.dinein_nomenclature ||
            strings.DINE_IN,
          'dine_in',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.dinein_nomenclature ||
            strings.DINE_IN,
          'dine_in',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.dinein_nomenclature ||
            strings.DINE_IN,
          'dine_in',
        );
      }
    } else {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.dinein_nomenclature ||
            strings.DINE_IN,
          'dine_in',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      }
    }
  };

  const dineInFunction = (item, indx) => {
    Alert.alert('', strings.REMOVE_CART_MSG, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
      },
      {text: strings.CLEAR_CART2, onPress: () => clearCart(item, indx)},
    ]);
  };

  const clearCart = (item, indx) => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: deviceInfoModule.getUniqueId(),
        },
      )
      .then((res) => {
        showSuccess(res?.message);
        actions.cartItemQty(res);
        _onTableItm(item, indx);
        updateState({isModalVisible: false});
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const _onTableItm = (item, indx) => {
    const newTabs = [...tabs];

    newTabs.forEach((item, index) => {
      if (index === indx) {
        selcetedToggle(item.label);
        newTabs[index].isActive = true;
        updateState({
          tabs: [...newTabs],
          checked: item.value,
          isModalVisible: false,
        });
      } else {
        newTabs[index].isActive = false;
        updateState({
          tabs: [...newTabs],
        });
      }
    });
  };

  if (isLoading) {
    return (
      <HeaderLoader
        rectHeightLeft={moderateScaleVertical(20)}
        heightLeft={moderateScaleVertical(20)}
        heightRight={moderateScaleVertical(20)}
        rectHeightRight={moderateScaleVertical(20)}
        isRight
        viewStyles={{marginVertical: moderateScaleVertical(10)}}
      />
    );
  }

  return (
    <View
      style={{
        borderBottomWidth: tabs.length > 1 ? 0.8 : 0,
        borderBottomColor: isDarkMode
          ? colors.whiteOpacity22
          : colors.borderColorD,
        // paddingBottom: moderateScale(5),
      }}>
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
          {!!(profileInfo && profileInfo?.logo) ? (
            <Image
              style={{
                width: width / 6,
                height: moderateScaleVertical(50),
              }}
              resizeMode="contain"
              source={
                profileInfo && profileInfo?.logo
                  ? {
                      uri: getImageUrl(
                        profileInfo.logo.image_fit,
                        profileInfo.logo.image_path,
                        '1000/1000',
                      ),
                    }
                  : imagePath.logo
              }
            />
          ) : // <FastImage
          //   source={{
          //     uri: imageURI,
          //     priority: FastImage.priority.high,
          //   }}
          //   style={{
          //     height: moderateScaleVertical(50),
          //     width: width / 6,
          //   }}
          //   resizeMode={FastImage.resizeMode.contain}
          // />
          null}
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
                      ? !!location?.type_name
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
                        : colors.textGrey,
                    },
                  ]}>
                  {location?.address}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={{marginHorizontal: moderateScale(8)}}
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }>
          <Image
            style={{tintColor: themeColors.primary_color}}
            source={imagePath.search1}
          />
        </TouchableOpacity>
        {/* {tabs.length > 1 && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              paddingVertical: moderateScaleVertical(5),
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={_onTableLabel}>
            <Image
              source={
                !!(
                  checked ==
                  toggleData?.profile?.preferences?.delivery_nomenclature ||
                  checked == strings.DELIVERY
                )
                  ? imagePath.delivery
                  : !!(
                    checked ==
                    toggleData?.profile?.preferences?.dinein_nomenclature ||
                    checked == strings.DINE_IN
                  )
                    ? imagePath.dineIn
                    : imagePath.takeaway
              }
              style={styles.deliveryIcon}
              resizeMode="contain"
            />

            <Text style={styles.checkedTxt}>{checked}</Text>

            <Image
              source={imagePath.dropDownNew}
              style={styles.customDropDownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )} */}
        <Modal
          isVisible={isModalVisible}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          onBackdropPress={() => updateState({isModalVisible: false})}>
          <View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => updateState({isModalVisible: false})}>
              <Image source={imagePath.crossC} resizeMode="contain" />
            </TouchableOpacity>

            <View
              style={[
                styles.modalMainViewContainer,
                {
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.background
                    : colors.white,
                },
              ]}>
              <View style={{padding: moderateScale(10)}}>
                {tabs.length > 1 &&
                  tabs.map((item, indx) => {
                    return (
                      <TouchableOpacity
                        key={indx}
                        disabled={!!item.isActive}
                        style={{
                          borderColor: item.isActive
                            ? themeColors.primary_color
                            : colors.transparent,
                          borderWidth: 0.7,
                          flexDirection: 'row',
                          paddingVertical: moderateScaleVertical(15),
                          margin: moderateScale(5),
                          borderRadius: moderateScale(10),
                          alignItems: 'center',
                          paddingHorizontal: moderateScale(20),
                          justifyContent: 'space-between',
                        }}
                        onPress={() =>
                          !(
                            cartItemCount?.message == null &&
                            cartItemCount?.data?.item_count > 0
                          )
                            ? _onTableItm(item, indx)
                            : dineInFunction(item, indx)
                        }>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            source={
                              item.isActive
                                ? imagePath.radioNewActive
                                : imagePath.radioNewInActive
                            }
                            style={{
                              height: moderateScale(20),
                              width: moderateScale(20),
                              tintColor: item.isActive
                                ? themeColors.primary_color
                                : colors.blackOpacity43,
                            }}
                          />
                          <Text
                            style={{
                              fontFamily: fontFamily.medium,
                              color: item.isActive
                                ? themeColors.primary_color
                                : isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.blackOpacity43,
                              fontSize: textScale(12),
                              marginHorizontal: moderateScale(10),
                            }}>
                            {item.value}
                          </Text>
                        </View>
                        <Image
                          source={item.icon}
                          style={{
                            height: moderateScale(22),
                            width: moderateScale(22),
                            tintColor: item.isActive
                              ? themeColors.primary_color
                              : isDarkMode
                              ? MyDarkTheme.colors.text
                              : colors.blackOpacity66,
                            alignSelf: 'flex-end',
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    );
                  })}
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View
        style={{
          // alignSelf: 'center',
          borderRadius: moderateScale(10),
          flexDirection: 'row',
          marginTop: moderateScale(10),
        }}>
        {tabs.length > 1 &&
          tabs.map((item, indx) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                disabled={item.isActive}
                onPress={() =>
                  !(
                    cartItemCount?.message == null &&
                    cartItemCount?.data?.item_count > 0
                  )
                    ? _onTableItm(item, indx)
                    : dineInFunction(item, indx)
                }
                key={indx}
                style={{
                  // width: width / 3 - 8,
                  width: tabs.length == 2 ? '50%' : '33.6%',
                  borderBottomColor:
                    item.isActive && isDarkMode
                      ? MyDarkTheme.colors.white
                      : item.isActive && !isDarkMode
                      ? themeColors.primary_color
                      : isDarkMode
                      ? colors.blackOpacity0
                      : colors.greyColor1,
                  borderBottomWidth: 2,
                  height: moderateScale(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={item.icon}
                  style={{
                    height: moderateScale(16),
                    width: moderateScale(16),
                    tintColor:
                      item.isActive && isDarkMode
                        ? MyDarkTheme.colors.white
                        : item.isActive && !isDarkMode
                        ? themeColors.primary_color
                        : colors.greyLight,
                    // ? themeColors.primary_color
                    // : isDarkMode
                    // ? MyDarkTheme.colors.text
                    // : colors.blackOpacity66,
                    marginRight: moderateScale(3),
                    // tintColor: item.isActive
                    //   ? themeColors.primary_color
                    //   : colors.textGreyOpcaity7,
                    // alignSelf: 'flex-end',
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    marginLeft: moderateScale(3),
                    fontSize: textScale(14),
                    fontFamily: fontFamily.regular,
                    color:
                      item.isActive && isDarkMode
                        ? MyDarkTheme.colors.white
                        : item.isActive && !isDarkMode
                        ? themeColors.primary_color
                        : colors.greyLight,
                    textTransform: 'capitalize',
                  }}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
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
