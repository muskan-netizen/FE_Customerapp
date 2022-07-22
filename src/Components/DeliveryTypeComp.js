import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {moderateScale, textScale} from '../styles/responsiveSize';
import {useSelector} from 'react-redux';
import strings from '../constants/lang';
import actions from '../redux/actions';
import deviceInfoModule from 'react-native-device-info';
import {showError, showSuccess} from '../utils/helperFunctions';
import {MyDarkTheme} from '../styles/theme';
import colors from '../styles/colors';
import imagePath from '../constants/imagePath';

function DeliveryTypeComp({selectedToggle = () => {}}) {
  const {cartItemCount} = useSelector((state) => state?.cart);
  const {
    appData,
    themeColors,
    appStyle,
    currencies,
    languages,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const {dineInType} = useSelector((state) => state?.home);

  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({fontFamily, themeColors, isDarkMode});

  const [state, setState] = useState({
    tabs: [],
  });

  const {tabs} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  useEffect(() => {
    addAllTabs();
    userSelectedtab();
  }, [appData, dineInType]);

  const addAllTabs = () => {
    const localTabsArray = [];

    if (appData?.profile?.preferences?.delivery_check == 1) {
      localTabsArray.push({
        value:
          appData?.profile?.preferences?.delivery_nomenclature ||
          strings.DELIVERY,
        label: 'delivery',
        icon: imagePath.delivery,
        iconInActive: imagePath.deliveryInActive,
        isActive: dineInType === 'delivery' ? true : false,
      });
      if (
        appData?.profile?.preferences?.dinein_check == 0 &&
        appData?.profile?.preferences?.takeaway_check == 0
      ) {
        selectedToggle('delivery');
      }
    }
    if (appData?.profile?.preferences?.dinein_check == 1) {
      localTabsArray.push({
        value:
          appData?.profile?.preferences?.dinein_nomenclature || strings.DINE_IN,
        label: 'dine_in',
        icon: imagePath.dineIn,
        isActive: dineInType === 'dine_in' ? true : false,
      });
      if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.takeaway_check == 0
      ) {
        selectedToggle('dine_in');
      }
    }
    if (appData?.profile?.preferences?.takeaway_check == 1) {
      localTabsArray.push({
        value:
          appData?.profile?.preferences?.takeaway_nomenclature ||
          strings.TAKEAWAY,
        label: 'takeaway',
        icon: imagePath.takeaway,
        isActive: dineInType === 'takeaway' ? true : false,
      });
      if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 0
      ) {
        selectedToggle('takeaway');
      }
    }
    updateState({
      tabs: localTabsArray,
      checked: localTabsArray[0],
    });
  };

  const setUserSelectedTab = (label, value) => {
    selectedToggle(value);
  };

  const userSelectedtab = () => {
    if (dineInType === 'delivery') {
      if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 1 &&
        appData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.dinein_nomenclature || strings.DINE_IN,
          'dine_in',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 0 &&
        appData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 1 &&
        appData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.dinein_nomenclature || strings.DINE_IN,
          'dine_in',
        );
      } else {
        setUserSelectedTab(
          appData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      }
    } else if (dineInType === 'dine_in') {
      if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 1 &&
        appData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.dinein_nomenclature || strings.DINE_IN,
          'dine_in',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 0 &&
        appData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 1 &&
        appData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.dinein_nomenclature || strings.DINE_IN,
          'dine_in',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 1 &&
        appData?.profile?.preferences?.dinein_check == 0 &&
        appData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 1 &&
        appData?.profile?.preferences?.dinein_check == 0 &&
        appData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 1 &&
        appData?.profile?.preferences?.dinein_check == 1 &&
        appData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else {
        setUserSelectedTab(
          appData?.profile?.preferences?.dinein_nomenclature || strings.DINE_IN,
          'dine_in',
        );
      }
    } else {
      if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 1 &&
        appData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 0 &&
        appData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 1 &&
        appData?.profile?.preferences?.dinein_check == 0 &&
        appData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 0 &&
        appData?.profile?.preferences?.dinein_check == 1 &&
        appData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.dinein_nomenclature || strings.DINE_IN,
          'dine_in',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 1 &&
        appData?.profile?.preferences?.dinein_check == 1 &&
        appData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else if (
        appData?.profile?.preferences?.delivery_check == 1 &&
        appData?.profile?.preferences?.dinein_check == 0 &&
        appData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(
          appData?.profile?.preferences?.delivery_nomenclature ||
            strings.DELIVERY,
          'delivery',
        );
      } else {
        setUserSelectedTab(
          appData?.profile?.preferences?.takeaway_nomenclature ||
            strings.TAKEAWAY,
          'takeaway',
        );
      }
    }
  };

  const _onTableItm = (item, indx) => {
    const newTabs = [...tabs];
    newTabs.forEach((item, index) => {
      if (index === indx) {
        selectedToggle(item.label);
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

  return (
    <View
      style={{
        ...styles.tabMainStyle,
        borderBottomColor: isDarkMode
          ? colors.whiteOpacity22
          : colors.borderColorD,
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
                ...styles.tabItemView,
                width: tabs.length == 2 ? '50%' : '33.6%',
                borderBottomColor:
                  item.isActive && isDarkMode
                    ? MyDarkTheme.colors.white
                    : item.isActive && !isDarkMode
                    ? themeColors.primary_color
                    : isDarkMode
                    ? colors.blackOpacity0
                    : colors.greyColor1,
              }}>
              <Image
                source={item.icon}
                style={{
                  ...styles.tabItemImg,
                  tintColor:
                    item.isActive && isDarkMode
                      ? MyDarkTheme.colors.white
                      : item.isActive && !isDarkMode
                      ? themeColors.primary_color
                      : colors.greyLight,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  ...styles.tabItemTxt,
                  color:
                    item.isActive && isDarkMode
                      ? MyDarkTheme.colors.white
                      : item.isActive && !isDarkMode
                      ? themeColors.primary_color
                      : colors.greyLight,
                }}>
                {item.value}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

export function stylesFunc({fontFamily, themeColors, isDarkMode}) {
  const styles = StyleSheet.create({
    tabMainStyle: {
      borderRadius: moderateScale(10),
      flexDirection: 'row',
      marginTop: moderateScale(10),
      borderBottomWidth: 0.8,
    },
    tabItemView: {
      borderBottomWidth: 2,
      height: moderateScale(40),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    tabItemImg: {
      height: moderateScale(16),
      width: moderateScale(16),
      marginRight: moderateScale(3),
    },
    tabItemTxt: {
      marginLeft: moderateScale(3),
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,

      textTransform: 'capitalize',
    },
  });
  return styles;
}

export default React.memo(DeliveryTypeComp);
