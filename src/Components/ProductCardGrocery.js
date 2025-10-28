
import React, { useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Animated, Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { getImageUrlNew, tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import strings from '../constants/lang';
import { MyDarkTheme } from '../styles/theme';
import StarRating from 'react-native-star-rating';

export const ProductCardGrocery = ({
  item,
  onPress = () => { },
  onAddToCartPress = () => { },
  onIncrement = () => { },
  onDecrement = () => { },
  showAddToCart = true,
  selectedItemID = -1,
  btnLoader = false,
  index = 0,
  CartItems = {},
  isDarkMode = false,
  containerStyle = {},
  imageContainerStyle = {},
}) => {
  const { appData, homeData } = useSelector((state) => state?.home)
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  const { currencies, themeColors } = useSelector((state) => state?.initBoot);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  // Calculate total product quantity from check_if_in_cart_app
  var totalProductQty = 0;
  if (item?.check_if_in_cart_app) {
    item?.check_if_in_cart_app.map((val) => {
      totalProductQty = totalProductQty + val.quantity;
    });
  }
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; // Reduced from 50 to 30
  const scaleAnim = useRef(new Animated.Value(0.9)).current; // More subtle scale effect

  useEffect(() => {
    const delay = index * 50; // Simple stagger based on index only

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim, index]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
          ...styles.container,
          backgroundColor: isDarkMode ? MyDarkTheme.colors.border : colors.blackOpacity02,
          ...containerStyle,
        }
      ]}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={0.9}>
        <View style={{...styles.imageContainer, ...imageContainerStyle}}>
          {!!Number(item?.variant?.[0]?.compare_at_price) && (
            <View style={{ ...styles.discountBadge, backgroundColor: themeColors.primary_color }}>
              <Text
                numberOfLines={1}
                style={styles.discountText}
              >
                {`${(
                  ((Number(item?.variant?.[0]?.compare_at_price) - Number(item?.variant?.[0]?.price)) /
                    Number(item?.variant?.[0]?.compare_at_price)) *
                  100
                ).toFixed(0)}% OFF`}
              </Text>
            </View>
          )}
          <FastImage source={{
            uri: item?.path ? getImageUrlNew({
              url: item?.path || null,
              image_const_arr: homeData?.image_prefix,
              type: 'image_fit',
              height: 1024,
              width: 1024,
            }) : isEmpty(item?.media) ? item?.image_url : getImageUrl(item?.media?.[0]?.image?.path?.image_fit, item?.media?.[0]?.image?.path?.image_path, "1024/1024")
          }}
            resizeMode="stretch"
            style={styles.image}
          />

          {/* ADD/Quantity Controls positioned on image */}
          {showAddToCart ? (
            <>
              {((!!item?.check_if_in_cart_app &&
                item?.check_if_in_cart_app.length > 0) ||
                !!item?.qty ||
                totalProductQty) &&
                CartItems.data !== null && dine_In_Type != 'appointment' ? (
                <View style={{ ...styles.quantityControlsOverlay, backgroundColor: colors.white, borderColor: themeColors.primary_color, borderWidth: 1 }}>
                  <TouchableOpacity
                    style={styles.quantityButtonOverlay}
                    onPress={onDecrement}
                    disabled={btnLoader && selectedItemID === item?.id}
                  >
                    <Text style={{ ...styles.quantityButtonTextOverlay, color: themeColors.primary_color }}>-</Text>
                  </TouchableOpacity>

                  <View style={styles.quantityDisplayOverlay}>
                    {btnLoader && selectedItemID === item?.id ? (
                      <ActivityIndicator size="small" style={{ height: moderateScale(12), width: moderateScale(12) }} color={themeColors.primary_color} />
                    ) : (
                      <Text style={{ ...styles.quantityTextOverlay, color: themeColors.primary_color }}>{item?.qty || totalProductQty}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.quantityButtonOverlay}
                    onPress={onIncrement}
                    disabled={btnLoader && selectedItemID === item?.id}
                  >
                    <Text style={{ ...styles.quantityButtonTextOverlay, color: themeColors.primary_color }}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={{ ...styles.addButtonOverlay, backgroundColor: colors.white, borderColor: themeColors.primary_color, borderWidth: 1 }}
                  onPress={onAddToCartPress}
                  disabled={btnLoader && selectedItemID === item?.id}
                >
                  {btnLoader && selectedItemID === item?.id ? (
                    <ActivityIndicator size="small" style={{ height: moderateScale(12), width: moderateScale(12), marginHorizontal: moderateScale(4) }} color={themeColors.primary_color} />
                  ) : (
                    <Text style={{ ...styles.addButtonTextOverlay, color: themeColors.primary_color }}>{strings.ADD}</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          ) :
            <TouchableOpacity
              style={{ ...styles.addButtonOverlay, backgroundColor: colors.white, borderColor: themeColors.primary_color, borderWidth: 1 }}
              onPress={onPress}
              disabled={btnLoader && selectedItemID === item?.id}
            >
              {btnLoader && selectedItemID === item?.id ? (
                <ActivityIndicator size="small" style={{ height: moderateScale(12), width: moderateScale(12), marginHorizontal: moderateScale(4) }} color={themeColors.primary_color} />
              ) : (
                <Text style={{ ...styles.addButtonTextOverlay, color: themeColors.primary_color }}>{strings.VIEW}</Text>
              )}
            </TouchableOpacity>
          }
        </View>
        <View style={styles.content}>
          <Text numberOfLines={2} style={{ ...styles.title, color: isDarkMode ? colors.white : colors.black }} >
            {item?.translation?.[0]?.title || item?.title}
          </Text>
          {!!Number(item?.variant?.[0]?.compare_at_price) ? <Text style={{ ...styles.bottomDiscount, color: themeColors.primary_color }} >
            {`${(
              ((Number(item?.variant?.[0]?.compare_at_price) - Number(item?.variant?.[0]?.price)) /
                Number(item?.variant?.[0]?.compare_at_price)) *
              100
            ).toFixed(0)}% OFF`}
          </Text> : null}
          <StarRating
            disabled={false}
            maxStars={5}
            rating={Number(item?.averageRating || 4).toFixed(
              1,
            )}
            fullStarColor={colors.yellowB}
            starSize={10}
            containerStyle={{ width: width / 8 }}
          />
          <View style={styles.mainPrice}>
            <Text style={{ ...styles.price, color: isDarkMode ? colors.white : colors.black }} >
              {tokenConverterPlusCurrencyNumberFormater(
                Number(item?.variant?.[0]?.price) * Number(item?.variant?.[0]?.multiplier || 1),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
            {!!Number(item?.variant?.[0]?.compare_at_price) && (
              <Text style={{ ...styles.originalPrice, color: isDarkMode ? colors.white : colors.black }} >
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(item?.variant?.[0]?.compare_at_price) * Number(item?.variant?.[0]?.multiplier || 1),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blackOpacity05,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    width: width * 0.35, // Adjusted for 2-column layout in ProductList
    padding: moderateScale(6),
  },
  imageContainer: {
    position: 'relative',
    height: width * 0.35 - moderateScale(12),
    width: width * 0.35 - moderateScale(12),
    borderRadius: moderateScale(10),
  },
  discountBadge: {
    position: 'absolute',
    top: moderateScale(-8),
    left: moderateScale(0),
    backgroundColor: colors.themeColor,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderBottomRightRadius: moderateScale(10),
    borderTopLeftRadius: moderateScale(10),
    zIndex: 1,
  },
  discountText: {
    color: colors.white,
    fontSize: textScale(10),
    fontFamily: fontFamily.regular,
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: moderateScale(10),
  },
  // Overlay buttons on image
  addButtonOverlay: {
    position: 'absolute',
    bottom: moderateScale(-6),
    right: moderateScale(-6),
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonTextOverlay: {
    color: colors.textGrey,
    fontSize: textScale(11),
    fontFamily: fontFamily.bold,
  },
  quantityControlsOverlay: {
    position: 'absolute',
    bottom: moderateScale(-6),
    right: moderateScale(-6),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(2),
    paddingVertical: moderateScale(2),
  },
  quantityButtonOverlay: {
    width: moderateScale(22),
    height: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonTextOverlay: {
    color: colors.white,
    fontSize: textScale(14),
    fontFamily: fontFamily.bold,
  },
  quantityDisplayOverlay: {
    minWidth: moderateScale(24),
    paddingHorizontal: moderateScale(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityTextOverlay: {
    color: colors.white,
    fontSize: textScale(11),
    fontFamily: fontFamily.bold,
  },
  content: {
    marginTop: moderateScaleVertical(8),
    flex: 1,
    gap: moderateScaleVertical(4)
  },
  title: {
    fontSize: textScale(12),
    fontFamily: fontFamily.regular,
  },
  mainPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  price: {
    fontSize: textScale(12),
    color: colors.black,
    fontFamily: fontFamily.bold,
  },
  originalPrice: {
    fontSize: textScale(10),
    color: colors.textGrey,
    textDecorationLine: 'line-through',
    fontFamily: fontFamily.regular,
  },
  bottomDiscount: {
    fontSize: textScale(8),
    color: colors.black,
    fontFamily: fontFamily.regular,
  },
});