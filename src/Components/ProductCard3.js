import React, { useState } from 'react';
import { Animated, Image, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {
  getImageUrl,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';
import HTMLView from 'react-native-htmlview';
import DashedLine from 'react-native-dashed-line';
import imagePath from '../constants/imagePath';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../styles/theme';

export default function ProductCard3({
  data = {},
  onPress = () => { },
  cardWidth,
  cardStyle = {},
  onAddtoWishlist,
  addToCart = () => { },
  activeOpacity = 1,
  bottomText = strings.BUY_NOW,
  index,
}) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCart, setSelectedCart] = useState(null)

  const [selectedIndexForCartIcon, setSelectedIndexForCartIcon] = useState(-1);
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const isDarkMode = theme;
  const currentTheme = useSelector((state) => state?.appTheme);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;

  const { themeLayouts } = currentTheme;
  const commonStyles = commonStylesFunc({ fontFamily });
  const cardWidthNew = cardWidth ? cardWidth : width * 0.5 - 21.5;
  const url1 = data?.media[0]?.image?.path.image_fit;
  const url2 = data?.media[0]?.image?.path.image_path;
  const getImage = getImageUrl(
    url1,
    url2,
    selectedIndex == index ? '200/200' : '300/300',
  );

  const scaleInAnimated = new Animated.Value(0);

  const changePosition = () => {
    let i = selectedIndex == -1 ? index : -1;
    setSelectedIndex(i);
  };

  const changePositionForCartIcon = () => {
    let i = selectedIndexForCartIcon == -1 ? index : -1;
    setSelectedIndexForCartIcon(i);
  };
  return (
    <TouchableOpacity
      // disabled
      activeOpacity={0.6}
      onPress={onPress}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      style={{
        borderRadius: 10,
        flexDirection: selectedIndex == index ? 'column' : 'row',
        justifyContent: 'space-between',
        marginVertical: moderateScaleVertical(10),
        paddingHorizontal: 16,
        flex: 1
      }}>
    
      <Animatable.View
        key={selectedIndex}
        animation={selectedIndex == index ? 'slideInLeft' : 'slideInRight'}
        duration={300}
      >
        <TouchableOpacity onPress={changePosition} activeOpacity={1}>
          <FastImage
            source={{ uri: url1 && url2 ? getImage : '', priority: FastImage.priority.high}}
            style={{
              height:
                selectedIndex == index
                  ? moderateScale(150)
                  : moderateScale(100),
              width: selectedIndex == index ? '100%' : moderateScale(100),
              borderRadius: moderateScale(15),
         
            }}
            resizeMode={selectedIndex == index ? "cover" : 'stretch'}
          />
        </TouchableOpacity>
      </Animatable.View>

      <View
        style={{
          marginLeft: 10,
          overflow: 'hidden',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Animatable.View
          key={selectedIndex}
        // animation={selectedIndex == index ? 'fadeInDown' : 'fadeInLeft'}
        >
          {/* Title View */}
          <View
            style={{
              marginTop: moderateScaleVertical(12)
            }}>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? {
                    ...commonStyles.futuraBtHeavyFont14,
                    width: moderateScaleVertical(220),
                    // fontFamily: 'Eina02-SemiBold',
                    color: MyDarkTheme.colors.text,
                  }
                  : {
                    ...commonStyles.futuraBtHeavyFont14,
                    width: moderateScaleVertical(220),
                    // fontFamily: 'Eina02-SemiBold',
                  }
              }>
              {data?.translation[0]?.title}
            </Text>
          </View>

          {/* Price view */}
          <View
            style={{
              // height: 30,
              paddingTop: moderateScale(5),
              paddingBottom: moderateScale(5),
            }}>
            <Text
              numberOfLines={1}
              style={{
                ...commonStyles.mediumFont14,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {`${currencies?.primary_currency?.symbol}${(
                Number(data?.variant[0]?.multiplier) *
                Number(data?.variant[0]?.price)
              ).toFixed(2)}`}
            </Text>
          </View>

          {/* rating View */}
          {!!Number(data?.averageRating) && (
            <View
              style={{
                flexDirection: 'row',
                // height: 30,
                alignItems: 'center',
                paddingBottom: moderateScale(5),
              }}>
              <Image source={imagePath.startwo} />
              <Text
                numberOfLines={1}
                style={{
                  color: colors.yellowB,
                  paddingLeft: 5,
                  fontFamily: fontFamily?.bold,
                  opacity: 1,
                  fontSize: textScale(12),
                }}>
                {data?.averageRating
                  ? Number(data?.averageRating).toFixed(1)
                  : 0}
              </Text>
            </View>
          )}
        </Animatable.View>

        <View>
          {!!selectedCart && selectedCart?.id == data.id ? null : 
          <TouchableOpacity
            // onPress={() => setSelectedCart(data)}
            onPress={onPress}
          >
            <Image source={imagePath.greyRoundPlus} />
          </TouchableOpacity>}

          {/* {!!selectedCart && selectedCart?.id == data.id && <View
            style={{
              borderRadius: moderateScale(5),
              backgroundColor: themeColors.primary_color,
              padding: moderateScale(10),
              borderRadius: 16,
              alignItems: 'center',
              marginTop: selectedIndex == index ? moderateScaleVertical(20) : 0
            }}
          >
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              // onPress={() => productIncrDecreamentForCart(2)}
              activeOpacity={0.8}
              hitSlop={hitSlopProp}
            >
              <Text style={{
                fontFamily: fontFamily.bold,
                fontSize: moderateScale(20),
                color: colors.white,
              }}>-</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={{
                fontFamily: fontFamily.bold,
                fontSize: moderateScale(16),
                color: colors.white,
              }}>
                1
              </Text>
            </View>
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              activeOpacity={0.8}
              hitSlop={hitSlopProp}
            // onPress={() => productIncrDecreamentForCart(1)}
            >
              <Text style={{
                fontFamily: fontFamily.bold,
                fontSize: moderateScale(20),
                color: colors.white,
              }}>+</Text>
            </TouchableOpacity>
          </View>} */}
        </View>
      </View>
    </TouchableOpacity>
  );
}
