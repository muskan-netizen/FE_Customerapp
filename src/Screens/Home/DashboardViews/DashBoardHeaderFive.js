import React, {createRef, useEffect, useState} from 'react';
import {I18nManager, Image, Text, TouchableOpacity, View} from 'react-native';
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
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import Modal from 'react-native-modal';
import {RadioButton} from 'react-native-paper';

export default function DashBoardHeaderFive({
  navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
}) {
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const [state, setState] = useState({
    tableData: [
      {label: 'Delivery', value: 'delivery'},
      {label: 'Dine-in', value: 'dine-in'},
      {label: 'Takeaway', value: 'takeaway'},
    ],
    isModalVisible: false,
    checked: '',
    tabs: [],
  });

  const {tableData, isModalVisible, checked, tabs} = state;

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

  console.log(dine_In_Type, 'dine_In_Type');
  // const renderRadioItems = () => {
  //   return tableData.map(
  //     (itm, inx) => console.log(itm, 'djflksdjflkjs'),
  //     // return <RadioButton.Item label={itm.label} value={itm.value} />;
  //   );
  // };

  useEffect(() => {
    addAllTabs();
    // getSelectedTab();
  }, [appData]);

  const addAllTabs = () => {
    const localTabsArray = [];
    // userSelectedtab();
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
      checked: tabs[0],
    });
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
                color: colors.black,
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
          Delivery
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
        // swipeDirection={['up', 'left', 'right', 'down']}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.modalMainViewContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => updateState({isModalVisible: false})}>
            <Image
              source={imagePath.crossB}
              style={{
                tintColor: themeColors.primary_color,
                height: moderateScale(20),
                width: moderateScale(20),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <RadioButton.Group
            onValueChange={(value) => updateState({checked: value})}
            value={checked}>
            {tabs.map((item) => {
              return <RadioButton.Item label={item} value={item} />;
            })}
          </RadioButton.Group>
        </View>
      </Modal>
    </View>
  );
}
