import React, {createRef, useState} from 'react';
import {I18nManager, Image, Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSelector} from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {moderateScale, textScale, width} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

export default function DashBoardHeaderFive({navigation = {}, location = []}) {
  const pickerRef = createRef();

  const [state, setState] = useState({
    tableData: [
      {label: 'Delivery', value: 'Delivery'},
      {label: 'Dine-in', value: '1'},
      {label: 'Takeaway', value: '1'},
    ],
  });
  const {tableData} = state;
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

  const isSVG = imageURI ? imageURI.includes('.svg') : null;
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
        {appData?.profile?.preferences?.is_hyperlocal && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate(navigationStrings.LOCATION, {
                type: 'Home1',
              })
            }
            style={{flexDirection: 'row', alignItems: 'center', flex: 0.85}}>
            <Image
              style={{height: 18, width: 18}}
              source={imagePath.redLocation}
              resizeMode="contain"
            />

            <Text
              numberOfLines={1}
              style={{
                paddingLeft: 5,
                // height:20,
                lineHeight: 20,
                fontFamily: fontFamily.medium,
                color: colors.black,
                fontSize: textScale(10),
              }}>
              {location?.address}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          justifyContent: 'center',
          // flex: 0,
          alignItems: 'flex-end',
          // paddingTop: moderateScaleVertical(12),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={imagePath.delivery}
          style={{width: 18, height: 18}}
          resizeMode="contain"
        />
        {/* <Text
          style={{
            color: themeColors.primary_color,
            fontFamily: fontFamily.regular,
          }}>
          {' '}
          Delivery
        </Text> */}
        <DropDownPicker
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
        />
      </View>
    </View>
  );
}
