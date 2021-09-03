import React, {createRef, useState} from 'react';
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
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';

export default function DashBoardHeaderFive({navigation = {}, location = []}) {
  const pickerRef = createRef();
  const isDarkMode = useDarkMode();
  const [state, setState] = useState({
    tableData: [
      {label: 'Delivery', value: 'Delivery'},
      {label: 'Dine-in', value: '1'},
      {label: 'Takeaway', value: '1'},
    ],
    isModalVisible: false,
    checked: 'Delivery',
  });
  const {tableData, isModalVisible, checked} = state;
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
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

  // const renderRadioItems = () => {
  //   return tableData.map(
  //     (itm, inx) => console.log(itm, 'djflksdjflkjs'),
  //     // return <RadioButton.Item label={itm.label} value={itm.value} />;
  //   );
  // };

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
        style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => updateState({isModalVisible: false})}>
          <Image source={imagePath.crossB} />
        </TouchableOpacity>
        <View style={styles.modalMainViewContainer}>
          <RadioButton.Group
            onValueChange={(value) => updateState({checked: value})}
            value={checked}>
            <RadioButton.Item label="Delivery" value="first" />
            <RadioButton.Item label="Dine-in" value="second" />
            <RadioButton.Item label="Takeaway" value="third" />
          </RadioButton.Group>
        </View>
      </Modal>
    </View>
  );
}
