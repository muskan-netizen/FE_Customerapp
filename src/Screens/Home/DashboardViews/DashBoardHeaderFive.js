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

import ListEmptyVendors from '../../Vendors/ListEmptyVendors';
import {MyDarkTheme} from '../../../styles/theme';

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
      } else {
        selcetedToggle('delivery');
        updateState({
          checked: 'Delivery',
        });
      }
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
          onPress={() => updateState({isModalVisible: true})}>
          <Image
            source={imagePath.delivery}
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
          <View style={styles.modalMainViewContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => updateState({isModalVisible: false})}>
              <Image
                source={imagePath.crossB}
                style={styles.crossIcon}
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
    </>
  );
}
