import React, {createRef, useEffect, useState} from 'react';
import {
  Alert,
  I18nManager,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSelector} from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {getImageUrl, showSuccess} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import Modal from 'react-native-modal';
import {RadioButton} from 'react-native-paper';
import actions from '../../../redux/actions';
import deviceInfoModule from 'react-native-device-info';

import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';

export default function DashBoardHeaderFive({
  navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
}) {
  const pickerRef = createRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const isDarkMode = theme;
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
  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const imageURI = getImageUrl(
    profileInfo?.logo?.image_fit,
    profileInfo?.logo?.image_path,
    '800/400',
  );

  useEffect(() => {
    addAllTabs();
    // getSelectedTab();
    userSelectedtab();
  }, [appData]);

  const addAllTabs = () => {
    const localTabsArray = [];

    if (toggleData?.profile?.preferences?.delivery_check == 1) {
      localTabsArray.push('Delivery');
      if (
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
      }
    }
    if (toggleData?.profile?.preferences?.dinein_check == 1) {
      localTabsArray.push('Dine-In');
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('dine_in');
      }
    }
    if (toggleData?.profile?.preferences?.takeaway_check == 1) {
      localTabsArray.push('Takeaway');
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
  const getSelectedTab = () => {
    if (dine_In_Type == 'delivery') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        updateState({checked: 'Dine-In'});
      } else {
        updateState({checked: 'Delivery'});
      }
    }
    if (dine_In_Type == 'dine_in') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        updateState({checked: 'Dine-In'});
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        updateState({checked: 'Delivery'});
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        updateState({checked: 'Dine-In'});
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        updateState({checked: 'Dine-In'});
      }
    }
    if (dine_In_Type == 'takeaway') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        updateState({checked: 'Dine-In'});
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        updateState({checked: 'Dine-In'});
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        updateState({checked: 'Dine-In'});
      } else {
        updateState({checked: 'Takeaway'});
      }
    }
  };

  // useEffect(() => {
  //   userSelectedtab();
  // }, [checked]);

  const userSelectedtab = () => {
    console.log(dine_In_Type, 'dine_In_Type');

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
      } else selcetedToggle('delivery');
      updateState({
        checked: 'Delivery',
      });
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
      } else selcetedToggle('delivery');
      updateState({
        checked: 'Delivery',
      });
    } else {
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
      } else selcetedToggle('delivery');

      updateState({
        checked: 'Delivery',
      });
    }
  };

  const _onChangeRadioToggle = (value) => {
    selcetedToggle(value.toLowerCase().replace('-', '_'));
    updateState({
      checked: value,
      isModalVisible: false,
    });
  };

  const dineInFunction = () => {
    Alert.alert(
      '',
      'This Change Will Remove Your Cart Products. Do you Really Want To Continue?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
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

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(15),
        marginTop: moderateScale(5),
      }}>
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
            style={{flexDirection: 'row', alignItems: 'center', flex: 0.85}}>
            <Image
              style={{
                height: moderateScale(18),
                width: moderateScale(18),
                tintColor: themeColors.primary_color,
              }}
              source={imagePath.redLocation}
              resizeMode="contain"
            />

            <Text
              numberOfLines={1}
              style={{
                paddingLeft: 5,
                // height:20,
                lineHeight: 20,
                fontFamily: fontFamily.regular,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontSize: textScale(10),
              }}>
              {location?.address}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          // flex: 0,
          paddingVertical: moderateScaleVertical(5),
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => updateState({isModalVisible: true})}>
        <Image
          source={imagePath.delivery}
          style={{
            width: moderateScale(18),
            height: moderateScale(18),
            tintColor: themeColors.primary_color,
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            fontFamily: fontFamily.regular,
            color: themeColors.primary_color,
            marginHorizontal: moderateScale(3),
          }}>
          {checked}
        </Text>

        <Image
          source={imagePath.dropDownNew}
          style={{
            width: moderateScale(8),
            height: moderateScale(8),
            tintColor: themeColors.primary_color,
            marginTop: moderateScaleVertical(3),
          }}
          resizeMode="contain"
        />

        {/* <DropDownPicker
          items={tableData}
          defaultValue={tableData[0]?.label}
          containerStyle={{
            height: 30,
            marginLeft: -10,
          }}
          style={{
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            width: 105,
            backgroundColor: colors.transparent,
            borderWidth: 0,
          }}
          itemStyle={{
            justifyContent: 'flex-start',
            flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
          }}
          selectedLabelStyle={{
            color: themeColors.primary_color,
          }}
          dropDownStyle={{
            height: moderateScale(110),
            width: width / 3.5,
            alignSelf: 'center',
          }}
          arrowColor={themeColors.primary_color}
          arrowStyle={{height: 15}}
        /> */}
      </TouchableOpacity>
      <Modal
        transparent={true}
        isVisible={isModalVisible}
        testID={'modal'}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.modalMainViewContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => updateState({isModalVisible: false})}>
            <Image
              source={imagePath.crossB}
              style={{
                tintColor: themeColors.primary_color,
                height: moderateScale(23),
                width: moderateScale(23),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={{marginHorizontal: moderateScale(30)}}>
            <RadioButton.Group
              onValueChange={
                !(
                  cartItemCount?.message == null &&
                  cartItemCount?.data?.item_count > 0
                )
                  ? _onChangeRadioToggle
                  : dineInFunction
              }
              value={checked}>
              {tabs.map((item, indx) => {
                return (
                  <RadioButton.Item
                    color={themeColors.primary_color}
                    key={indx}
                    label={item}
                    value={item}
                  />
                );
              })}
            </RadioButton.Group>
          </View>
        </View>
      </Modal>
    </View>
  );
}
