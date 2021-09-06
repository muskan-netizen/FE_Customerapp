import React, {createRef, useEffect, useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {getImageUrl, showSuccess} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

export default function DashBoardHeaderFive({
  navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
}) {
  const pickerRef = createRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
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
    '800/400',
  );

  useEffect(() => {
    addAllTabs();
    userSelectedtab();
  }, [appData]);

  const checkSelectedTab = () => {
    const newTabs = [...tabs];
    newTabs.forEach((item, index) => {
      console.log(item.label, dine_In_Type, 'dine_In_Type2');
      if (item.label === dine_In_Type) {
        console.log('hello');
        newTabs[index].isActive = true;
        updateState({
          tabs: [...newTabs],
        });
      } else {
        console.log('newHello');
        newTabs[index].isActive = false;
        updateState({
          tabs: [...newTabs],
        });
      }
    });
  };

  const addAllTabs = () => {
    const localTabsArray = [];

    if (toggleData?.profile?.preferences?.delivery_check == 1) {
      localTabsArray.push({
        value: 'Delivery',
        label: 'delivery',
        icon: imagePath.delivery,
        iconInActive: imagePath.deliveryInActive,
        isActive: true,
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
        value: 'Dine-In',
        label: 'dine_in',
        icon: imagePath.dineIn,
        isActive: false,
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
        value: 'Takeaway',
        label: 'takeaway',
        icon: imagePath.takeaway,
        isActive: false,
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

  const userSelectedtab = () => {
    if (dine_In_Type === 'delivery') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        selcetedToggle('dine_in');
        updateState({
          checked: 'Dine-In',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        selcetedToggle('takeaway');
        updateState({
          checked: 'Takeaway',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('dine_in');
        updateState({
          checked: 'Dine-In',
        });
      } else {
        selcetedToggle('delivery');
        updateState({
          checked: 'Delivery',
        });
      }
    } else if (dine_In_Type === 'dine_in') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        selcetedToggle('dine_in');
        updateState({
          checked: 'Dine-In',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        selcetedToggle('takeaway');
        updateState({
          checked: 'Takeaway',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('dine_in');
        updateState({
          checked: 'Dine-In',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        selcetedToggle('delivery');
        updateState({
          checked: 'Delivery',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
        updateState({
          checked: 'Delivery',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
        updateState({
          checked: 'Delivery',
        });
      } else {
        selcetedToggle('dine_in');
        updateState({
          checked: 'Dine-In',
        });
      }
    } else {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        selcetedToggle('takeaway');
        updateState({
          checked: 'Takeaway',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        selcetedToggle('takeaway');
        updateState({
          checked: 'Takeaway',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        selcetedToggle('takeaway');
        updateState({
          checked: 'Takeaway',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('dine_in');
        updateState({
          checked: 'Dine-In',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
        updateState({
          checked: 'Delivery',
        });
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
        updateState({
          checked: 'Delivery',
        });
      } else {
        selcetedToggle('takeaway');
        updateState({
          checked: 'Takeaway',
        });
      }
    }
  };

  const dineInFunction = () => {
    Alert.alert(
      '',
      'This Change Will Remove Your Cart Products. Do you Really Want To Continue?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {text: 'Clear Cart', onPress: clearCart},
      ],
    );
  };

  const clearCart = () => {
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
        updateState({isModalVisible: false});
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
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

  const _onTableLabel = () => {
    checkSelectedTab();
    updateState({isModalVisible: true});
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
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
              }}>
              <Image
                style={styles.locationIcon}
                source={imagePath.redLocation}
                resizeMode="contain"
              />

              <Text numberOfLines={1} style={styles.locationTxt}>
                {location?.address}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
              checked === 'Delivery'
                ? imagePath.delivery
                : checked === 'Dine-In'
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
        <Modal
          transparent={true}
          isVisible={isModalVisible}
          testID={'modal'}
          style={{justifyContent: 'flex-end', margin: 0}}>
          <>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => updateState({isModalVisible: false})}>
              <Image
                source={imagePath.crossC}
                style={styles.crossIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.modalMainViewContainer}>
              <View style={{padding: moderateScale(10)}}>
                {tabs.map((item, indx) => {
                  return (
                    <TouchableOpacity
                      style={{
                        borderColor: item.isActive
                          ? themeColors.primary_color
                          : colors.transparent,
                        borderWidth: 1,
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
                          : dineInFunction()
                      }>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
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
                              : colors.iconGrey,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: fontFamily.medium,
                            color: colors.black,
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
                            : colors.black,
                          alignSelf: 'flex-end',
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        </Modal>
      </View>
    </>
  );
}
