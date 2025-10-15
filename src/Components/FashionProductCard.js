import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import { getImageUrl } from '../utils/helperFunctions';
import imagePath from '../constants/imagePath';

const FashionProductCard = ({
  item,
  onPress = () => {},
  containerStyle = {},
  onToggleWishlist = () => {},
  onAddToCart = () => {},
  onDecrement = () => {},
  inWishlist = false,
}) => {
  const { appStyle, currencies, themeColor, themeToggle, appData, themeColors } = useSelector(state => state?.initBoot || {});
  const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;
  const isDarkMode = themeToggle ? useSelector(() => null) || false : themeColor; // themeToggle path follows existing pattern

  const imageUrl = getImageUrl(
    item?.media?.[0]?.image?.path?.proxy_url || item?.image?.proxy_url,
    item?.media?.[0]?.image?.path?.image_path || item?.image?.image_path,
    '800/800',
  );

  const priceText = tokenConverterPlusCurrencyNumberFormater(
    item?.price_numeric || item?.variant?.[0]?.price || 0,
    digit_after_decimal,
    additional_preferences,
    currencies?.primary_currency?.symbol,
    currencies,
  );

  const styles = stylesFunc({ fontFamily });

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ ...containerStyle }}>
      <View style={styles.cardContainer}>
        <View>
          <FastImage
            source={{ uri: imageUrl, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
          <TouchableOpacity activeOpacity={0.8} onPress={() => onToggleWishlist(item)} style={styles.heartBtn}>
            <Image source={inWishlist ? imagePath.whiteFilledHeart : imagePath.heart2} style={ styles.heartIcon} tintColor={inWishlist ? colors.redB : colors.black} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.priceRow}>
          <View style={styles.contentWrap}>
            <Text numberOfLines={2} style={styles.title}>
              {item?.translation?.[0]?.title || item?.title}
            </Text>
            <Text style={styles.priceTxt}>
              {priceText}
            </Text>
          </View>

        <TouchableOpacity activeOpacity={0.9} onPress={() => onAddToCart(item)} onLongPress={() => onDecrement(item)} style={styles.cartBtn}>
            <Image source={imagePath.cartIcon} style={styles.cartIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(FashionProductCard);



function stylesFunc({ fontFamily }) {
  return StyleSheet.create({
    cardContainer: {
      borderRadius: moderateScale(16),
      backgroundColor: colors.greyNew,
      padding: moderateScale(8),
      flex: 1
    },
    image: {
      height: moderateScale(156),
      borderRadius: moderateScale(12),
      backgroundColor: colors.greyColor,
    },
    heartBtn: {
      position: 'absolute',
      top: moderateScale(8),
      right: moderateScale(8),
      width: moderateScale(34),
      height: moderateScale(34),
      borderRadius: moderateScale(17),
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heartIcon: {
      width: moderateScale(18),
      height: moderateScale(18),
      tintColor: colors.black,
    },
    title: {
      fontFamily: fontFamily?.medium,
      fontSize: textScale(14),
      color: colors.black,
    },
    priceTxt: {
      fontFamily: fontFamily?.regular,
      fontSize: textScale(12),
      color: colors.textGrey,
      marginTop: moderateScaleVertical(6),
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: moderateScaleVertical(8),
    },
    contentWrap: {
      width: '70%',
    },
    cartBtn: {
      width: moderateScale(28),
      height: moderateScale(28),
      borderRadius: moderateScale(8),
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.blackOpacity10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartIcon: {
      width: moderateScale(16),
      height: moderateScale(16),
      tintColor: colors.black,
    },
  });
}

