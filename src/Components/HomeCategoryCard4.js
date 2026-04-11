import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';

// Pastel background palette for each card slot
const CARD_COLORS = [
  '#EDF4FF',
  '#FFF0E6',
  '#E8F8F2',
  '#FFF0F3',
  '#F0EAFF',
  '#E6F9FF',
  '#FFFAE6',
  '#EAECFF',
];

const CARD_WIDTH = (width / 4) - moderateScale(6);

const HomeCategoryCard4 = ({
  data = {},
  onPress = () => {},
  index = 0,
  priceType = 'vendor',
}) => {
  const { themeColor, themeToggle, themeColors, appStyle } = useSelector(
    state => state?.initBoot,
  );
  const { dineInType } = useSelector(state => state?.home || {});

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;

  const scale = useSharedValue(1);

  const imageURI = getImageUrl(
    data?.icon?.image_fit,
    data?.icon?.image_path,
    '120/120',
  );
  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  const navigation = useNavigation();

  const cardBg = isDarkMode
    ? MyDarkTheme.colors.lightDark
    : CARD_COLORS[index % CARD_COLORS.length];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.88, { damping: 14, stiffness: 350 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 14, stiffness: 350 });
  };

  // "View All" card at index 7
  if (index === 7) {
    return (
      <Animated.View style={[styles.wrapper, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() =>
            dineInType === 'p2p'
              ? navigation.navigate(navigationStrings.ALL_CATEGORIES)
              : navigation.navigate(navigationStrings.CATEGORY, {
                  data: { priceType },
                })
          }
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : getColorCodeWithOpactiyNumber(
                    (themeColors?.primary_color || '#41A2E6').substr(1),
                    12,
                  ),
            },
          ]}>
          <View
            style={[
              styles.iconBubble,
              {
                backgroundColor: getColorCodeWithOpactiyNumber(
                  (themeColors?.primary_color || '#41A2E6').substr(1),
                  25,
                ),
              },
            ]}>
            <Text
              style={{
                color: themeColors?.primary_color || '#41A2E6',
                fontSize: textScale(20),
                fontFamily: fontFamily?.bold,
              }}>
              {'→'}
            </Text>
          </View>
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={[
            styles.label,
            {
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily?.medium,
            },
          ]}>
          {strings.VIEW_ALL}
        </Text>
      </Animated.View>
    );
  }

  if (index < 7) {
    return (
      <Animated.View style={[styles.wrapper, animatedStyle]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.85}
          style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.iconBubble}>
            {isSVG ? (
              <SvgUri
                height={moderateScale(46)}
                width={moderateScale(46)}
                uri={imageURI}
              />
            ) : (
              <FastImage
                style={styles.image}
                source={{
                  uri: imageURI,
                  cache: FastImage.cacheControl.immutable,
                  priority: FastImage.priority.high,
                }}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={[
            styles.label,
            {
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily?.medium,
            },
          ]}>
          {data.name}
        </Text>
      </Animated.View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    marginBottom: moderateScaleVertical(14),
    alignItems: 'center',
    marginHorizontal: moderateScale(3),
  },
  card: {
    height: moderateScale(74),
    width: '100%',
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  iconBubble: {
    height: moderateScale(64),
    width: moderateScale(64),
    borderRadius: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FB',
    overflow: 'hidden',
  },
  image: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(10),
  },
  label: {
    fontSize: textScale(11),
    textAlign: 'center',
    marginTop: moderateScaleVertical(7),
    paddingHorizontal: moderateScale(2),
    lineHeight: moderateScale(15),
  },
});

export default React.memo(HomeCategoryCard4);
