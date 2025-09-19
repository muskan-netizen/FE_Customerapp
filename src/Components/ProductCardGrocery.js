
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
}) => {
  const { appData, homeData } = useSelector((state) => state?.home)
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  const currencies = useSelector((state) => state?.initBoot?.currencies);
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
          ...styles.container
        }
      ]}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={0.9}>
        {!!Number(item?.variant?.[0]?.compare_at_price) && (
          <View style={styles.discountBadge}>
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
            image_const_arr: homeData.image_prefix,
            type: 'image_fit',
            height: 1024,
            width: 1024,
          }) : isEmpty(item?.media) ? item?.image_url : getImageUrl(item?.media?.[0]?.image?.path?.image_fit, item?.media?.[0]?.image?.path?.image_path, "1024/1024")
        }}
          resizeMode="cover"
          style={styles.image}
        />
        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title} >
            {item?.translation?.[0]?.title || item?.title}
          </Text>
          <View style={styles.mainPrice}>
            <Text style={styles.price} >
              {tokenConverterPlusCurrencyNumberFormater(
                Number(item?.variant?.[0]?.price) * Number(item?.variant?.[0]?.multiplier || 1),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
            {!!Number(item?.variant?.[0]?.compare_at_price) && (
              <Text style={styles.originalPrice} >
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(item?.variant?.[0]?.compare_at_price) * Number(item?.variant?.[0]?.multiplier || 1),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
            )}
          </View>
          {showAddToCart && (
            <>
              {((!!item?.check_if_in_cart_app &&
                item?.check_if_in_cart_app.length > 0) ||
                !!item?.qty ||
                totalProductQty) &&
                CartItems.data !== null && dine_In_Type != 'appointment' ? (
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={onDecrement}
                    disabled={btnLoader && selectedItemID === item?.id}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.quantityDisplay}>
                    {btnLoader && selectedItemID === item?.id ? (
                      <ActivityIndicator size="small" color={colors.themeColor} />
                    ) : (
                      <Text style={styles.quantityText}>{item?.qty || totalProductQty}</Text>
                    )}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={onIncrement}
                    disabled={btnLoader && selectedItemID === item?.id}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.addButton} 
                  onPress={onAddToCartPress}
                  disabled={btnLoader && selectedItemID === item?.id}
                >
                  {btnLoader && selectedItemID === item?.id ? (
                    <ActivityIndicator size="small" color={colors.themeColor} />
                  ) : (
                    <Text style={styles.addButtonText}>
                      {strings.ADDTOCART}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundGrey,
    borderRadius: moderateScale(10),
    overflow: 'hidden',
    width: width * 0.35, // Adjusted for 2-column layout in ProductList
    padding: moderateScale(6),
  },
  discountBadge: {
    position: 'absolute',
    top: moderateScale(0),
    right: moderateScale(0),
    backgroundColor: colors.themeColor,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(4),
    borderBottomLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
    zIndex: 1,
  },
  discountText: {
    color: colors.white,
    fontSize: textScale(10),
    fontFamily: fontFamily.regular,
  },
  image: {
    height: width * 0.35 - moderateScale(12),
    width:  width * 0.35 - moderateScale(12),
    borderRadius: moderateScale(10),
  },
  content: {
    marginTop: moderateScaleVertical(6),
    flex: 1,
    gap:moderateScaleVertical(4)
  },
  title: {
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
  },
  mainPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  price: {
    fontSize: textScale(14),
    color: colors.themeColor,
    fontFamily: fontFamily.bold,
  },
  originalPrice: {
    fontSize: textScale(14),
    color: colors.textGrey,
    textDecorationLine: 'line-through',
    fontFamily: fontFamily.regular,
  },
  addButton: {
    borderWidth: 1,
    borderColor: colors.themeColor,
    borderRadius: moderateScale(6),
    paddingVertical: moderateScale(4),
    alignItems: 'center',
    marginTop: 'auto'
  },
  addButtonText: {
    color: colors.themeColor,
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.themeColor,
    borderRadius: moderateScale(6),
    overflow: 'hidden',
    marginTop: 'auto'
  },
  quantityButton: {
    paddingVertical: moderateScale(4),
    paddingHorizontal: moderateScale(8),
    backgroundColor: colors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: moderateScale(30),
  },
  quantityButtonText: {
    color: colors.white,
    fontSize: textScale(14),
    fontFamily: fontFamily.bold,
  },
  quantityDisplay: {
    flex: 1,
    paddingVertical: moderateScale(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    minHeight: moderateScale(26),
  },
  quantityText: {
    color: colors.black,
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
  },
});