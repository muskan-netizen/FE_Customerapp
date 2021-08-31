import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSelector} from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

export default function DashBoardHeaderFive({navigation = {}, location = []}) {
  const [state, setState] = useState({});
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
  const tableData = [
    {label: 'Delivery', value: 'Delivery'},
    {label: '1', value: '1'},
    {label: '1', value: '1'},
  ];
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(15),
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        {appData?.profile?.preferences?.is_hyperlocal && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate(navigationStrings.LOCATION, {
                type: 'Home1',
              })
            }
            style={{flexDirection: 'row', alignItems: 'center'}}>
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
        <DropDownPicker
          items={tableData}
          defaultValue={tableData[0].label}
          containerStyle={{
            height: 40,
          }}
          itemStyle={{
            justifyContent: 'flex-start',
          }}
          dropDownStyle={{
            height: 80,
            width: 100,
            alignSelf: 'center',
          }}
        />
      </View>
    </View>
  );
}
