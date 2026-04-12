import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrl } from '../utils/commonFunction';
import { getColorSchema } from '../utils/utils';
let imageHeight = 160
let imageWidth = 160
let imageRadius = 8


const Cities = ({ isDiscount, item, imageStyle, onPress = () => { }, numberOfLines = 1, containerStyle = {} }) => {
  const { themeColors, appStyle, currencies, themeColor, themeToggle } =useSelector((state) => state?.initBoot || {});
  const { additional_preferences, digit_after_decimal } = useSelector((state) => state?.initBoot?.appData?.profile?.preferences || {});
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const scaleInAnimated = new Animated.Value(0);

  const appMainData = useSelector((state) => state?.home?.appMainData || {});

  const {category = {}} = item || {};


  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={styles.card}
      >
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        source={{
          uri: getImageUrl(
            item.image.image_fit,
            item.image.image_path,
            '600/6000',
          ),
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.high,
        }}
        style={[styles.image, imageStyle]}
        imageStyle={{ borderRadius: moderateScale(10) }}>
        {/* Dark overlay so ad-banner content is hidden */}
        <View style={styles.overlay} />
        <View style={styles.labelWrap}>
          <Text
            numberOfLines={numberOfLines}
            style={[
              styles.label,
              { fontFamily: fontFamily.medium },
            ]}>
            {item?.title}
          </Text>
        </View>
      </FastImage>
    </TouchableOpacity>
  );
};

const CARD_W = width * 0.28;
const CARD_H = moderateScaleVertical(90);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: moderateScale(2),
  },
  image: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: moderateScale(10),
  },
  labelWrap: {
    paddingHorizontal: moderateScale(6),
    paddingBottom: moderateScaleVertical(8),
  },
  label: {
    fontSize: textScale(10),
    color: colors.white,
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default React.memo(Cities);




