import React from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import {Image} from 'react-native-elements';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {getImageUrl} from '../utils/helperFunctions';

export default function ThreeColumnCard2({
  data = {},
  cardIndex,
  withTextBG = false,
  onPress = () => {},
}) {
  //MarginHorizontal is 16 which is total 32
  //marginHorizontal for center item is 8 which is toal 16
  //total spcaing required is width-32+16 or 48
  // width - 48 will be the width of each card and
  const {themeColors, appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const cardWidth = width / 3 - moderateScale(16);
  const scaleInAnimated = new Animated.Value(0);
  const commonStyles = commonStylesFunc({fontFamily});
  let celebDimension = width / 3;

  console.log(data, 'datadatadatadatadata');
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      // onPressIn={() => pressInAnimation(scaleInAnimated)}
      // onPressOut={() => pressOutAnimation(scaleInAnimated)}

      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: moderateScaleVertical(10),
      }}>
      <View>
        <Text
          style={{
            fontFamily: fontFamily.medium,
            fontSize: textScale(16),
            color: colors.black,
          }}>
          {data?.name}
        </Text>
        {/* <Text
          style={{
            marginTop: moderateScaleVertical(5),
            fontFamily: fontFamily.medium,
            fontSize: textScale(13),
          }}>
          $120
        </Text> */}
        <Text
          style={{
            fontFamily: fontFamily.regular,
            color: colors.textGreyG,
            marginTop: moderateScale(5),
          }}>
          Uramaki styled spicy chicken
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            color: colors.textGreyG,
          }}>
          dimsums with chef’s ...more
        </Text>
      </View>

      <View
        style={{
          width: moderateScale(90),
          height: moderateScaleVertical(90),
          borderRadius: moderateScale(15),
          overflow: 'hidden',
        }}>
        <Image
          PlaceholderContent={
            <Image
              source={{
                uri: getImageUrl(
                  data?.avatar?.proxy_url || data?.image?.proxy_url,
                  data?.avatar?.image_path || data?.image?.image_path,
                  `13/14`,
                ),
              }}
              style={{
                width: cardWidth,
                height: moderateScaleVertical(128),
                borderRadius: moderateScale(10),
              }}
            />
          }
          source={{
            uri: getImageUrl(
              data?.avatar?.proxy_url || data?.image?.proxy_url,
              data?.avatar?.image_path || data?.image?.image_path,
              `130/140`,
            ),
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
