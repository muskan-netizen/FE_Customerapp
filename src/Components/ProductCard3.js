import { isArray, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import { UIActivityIndicator } from 'react-native-indicators';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import { hitSlopProp } from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import { getImageUrl } from '../utils/helperFunctions';

const ProductCard3 = ({
  data = {},
  onPress = () => { },
  addToCart = () => { },
  onIncrement,
  onDecrement,
  selectedItemID,
  btnLoader,
  categoryInfo = '',
  businessType,
  CartItems = {},
  onPressInquiry = () => { }
}) => {
  const [state, setState] = useState({
    qtyText: '1',
    isVisibleText: true,
  });
  const {
    isVisibleText,
    qtyText,
  } = state;

  var totalProductQty = 0;
  if (data?.check_if_in_cart_app) {
    data?.check_if_in_cart_app.map(val => {
      totalProductQty = totalProductQty + val.quantity;
    });
  }

  const updateState = data => setState(state => ({ ...state, ...data }));
  const { priceType, dineInType } = useSelector(state => state?.home);
  const theme = useSelector(state => state?.initBoot?.themeColor);

  const isDarkMode = theme;
  const currencies = useSelector(state => state?.initBoot?.currencies);
  const { appStyle, themeColors, appData } = useSelector(
    state => state?.initBoot,
  );
  const dine_In_Type = useSelector(state => state?.home?.dineInType);
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};

  const fontFamily = appStyle?.fontSizeData;
  const styles = styleData({ themeColors, fontFamily });

  const url1 = !isEmpty(data?.media) && data?.media[0]?.image?.path.image_fit;
  const url2 = !isEmpty(data?.media) && data?.media[0]?.image?.path.image_path;

  const getImage = quality => getImageUrl(url1, url2, quality);

  useEffect(() => {
    updateState({ qtyText: data?.qty || totalProductQty });
  }, [totalProductQty]);

  useEffect(() => {
    updateState({ qtyText: data?.qty || totalProductQty });
  }, [data?.qty]);

  const onIncrementQty = () => {
    if (
      !!categoryInfo?.is_vendor_closed &&
      categoryInfo?.closed_store_order_scheduled !== 1
    ) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    onIncrement();
  };

  const onDecrementQty = () => {
    onDecrement();
  };

  let typeId = data?.category_id;
  const cardBg = isDarkMode ? MyDarkTheme.colors.background : colors.white;
  const cartBg = isDarkMode ? themeColors.primary_color : colors.black;

  const renderCartButton = () => {
    if (data?.inquiry_only) {
      return (
        <TouchableOpacity
          onPress={() => onPressInquiry(data)}
          style={styles.circleBtn(cartBg)}>
          <Image source={imagePath.cartIcon} style={styles.cartIconImg} resizeMode="contain" />
        </TouchableOpacity>
      );
    }
    if (dine_In_Type === 'p2p' || dine_In_Type === 'rental') return null;

    const inStock =
      data?.has_inventory == 0 ||
      !!data?.variant[0]?.quantity ||
      (!!typeId && typeId == 8) ||
      (!!businessType && businessType == 'laundry');

    if (!inStock) {
      return <Text style={styles.outOfStock}>{strings.OUT_OF_STOCK}</Text>;
    }

    const alreadyInCart =
      ((!!data?.check_if_in_cart_app && data?.check_if_in_cart_app.length > 0) ||
        !!data?.qty ||
        totalProductQty) &&
      CartItems.data !== null &&
      dine_In_Type != 'appointment';

    if (alreadyInCart) {
      return (
        <View style={styles.qtyRow(cartBg, isDarkMode, themeColors)}>
          <TouchableOpacity
            disabled={selectedItemID == data?.id}
            activeOpacity={1}
            onPress={onDecrementQty}
            hitSlop={hitSlopProp}>
            <Image
              style={{ tintColor: isDarkMode ? colors.white : themeColors.primary_color }}
              source={imagePath.icMinus2}
            />
          </TouchableOpacity>

          <Animatable.View style={{ overflow: 'hidden' }}>
            {selectedItemID == data?.id && btnLoader ? (
              <UIActivityIndicator size={moderateScale(14)} color={themeColors.primary_color} />
            ) : isVisibleText ? (
              <Animatable.Text
                duration={200}
                numberOfLines={1}
                style={{
                  fontFamily: fontFamily.medium,
                  fontSize: moderateScale(13),
                  color: isDarkMode ? colors.white : themeColors.primary_color,
                  marginHorizontal: moderateScale(6),
                }}>
                {qtyText}
              </Animatable.Text>
            ) : null}
          </Animatable.View>

          <TouchableOpacity
            disabled={selectedItemID == data?.id}
            activeOpacity={0.8}
            hitSlop={hitSlopProp}
            onPress={onIncrementQty}>
            <Image
              style={{ tintColor: isDarkMode ? colors.white : themeColors.primary_color }}
              source={imagePath.icAdd4}
            />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={selectedItemID == data?.id}
        onPress={addToCart}
        style={styles.circleBtn(cartBg)}>
        {selectedItemID == data?.id ? (
          <UIActivityIndicator size={moderateScale(16)} color={colors.white} />
        ) : (
          <Image source={imagePath.cartIcon} style={styles.cartIconImg} resizeMode="contain" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      disabled={btnLoader}
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(16),
        paddingVertical: moderateScaleVertical(12),
        backgroundColor: cardBg,
      }}>

      {/* LEFT: Image */}
      <View style={styles.imgWrapper(isDarkMode)}>
        {!!url1 ? (
          <FastImage
            style={styles.imgStyle}
            source={{
              uri: getImage('240/240'),
              cache: FastImage.cacheControl.immutable,
              priority: FastImage.priority.high,
            }}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imgStyle, { backgroundColor: isDarkMode ? colors.whiteOpacity15 : '#F0F0F0' }]} />
        )}
      </View>

      {/* CENTER: Info */}
      <View style={{ flex: 1, marginHorizontal: moderateScale(12) }}>
        <Text
          numberOfLines={2}
          style={{
            color: isDarkMode ? colors.white : '#1A1A2E',
            fontFamily: fontFamily.semiBold || fontFamily.bold,
            fontSize: textScale(13),
            lineHeight: moderateScaleVertical(18),
          }}>
          {!isEmpty(data?.translation) ? data?.translation[0]?.title : data?.title || data?.sku}
        </Text>

        {data?.vendor?.name ? (
          <Text
            style={{
              fontSize: textScale(10),
              color: isDarkMode ? colors.whiteOpacity50 : colors.grayOpacity51,
              marginTop: moderateScaleVertical(3),
            }}>
            {data?.vendor?.name}
          </Text>
        ) : null}

        {!!appData?.profile?.preferences?.rating_check && !!data?.averageRating ? (
          <View style={{
            borderWidth: 0.5,
            alignSelf: 'flex-start',
            padding: 2,
            borderRadius: 2,
            marginTop: moderateScaleVertical(4),
            borderColor: colors.yellowB,
            backgroundColor: colors.yellowOpacity10,
          }}>
            <StarRating
              disabled
              maxStars={5}
              rating={Number(parseInt(data?.averageRating).toFixed(1))}
              fullStarColor={colors.yellowB}
              starSize={8}
              containerStyle={{ width: width / 9 }}
            />
          </View>
        ) : null}

        {!(!!appData?.profile?.preferences?.is_service_product_price_from_dispatch &&
          dineInType === 'on_demand' && priceType == 'freelancer') && data?.inquiry_only == 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: moderateScaleVertical(6) }}>
            <Text
              numberOfLines={1}
              style={{
                color: isDarkMode ? colors.white : '#1A1A2E',
                fontFamily: fontFamily.semiBold || fontFamily.bold,
                fontSize: textScale(13),
              }}>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(data?.variant[0]?.price) * Number(data?.variant[0]?.multiplier || 1),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
                currencies,
              )}
            </Text>
            {Number(data?.variant[0]?.compare_at_price) > Number(data?.variant[0]?.price) ? (
              <Text
                numberOfLines={1}
                style={{
                  color: colors.redB,
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(11),
                  textDecorationLine: 'line-through',
                  marginLeft: moderateScale(6),
                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(data?.variant[0]?.compare_at_price) * Number(data?.variant[0]?.multiplier || 1),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                  currencies,
                )}
              </Text>
            ) : null}
            {!!data?.is_recurring_booking ? (
              <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ marginLeft: moderateScale(6) }}>
                <Image style={{ tintColor: themeColors.primary_color }} source={imagePath.ic_calendar} />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {(!!data?.add_on_count && data?.add_on_count !== 0) ||
          (!!data?.variant_set_count && data?.variant_set_count !== 0) ||
          (!!isArray(data?.add_on) && data?.add_on?.length !== 0) ? (
          <Text style={{ ...styles.customTextStyle, marginTop: moderateScaleVertical(3) }}>
            {strings.CUSTOMISABLE}
          </Text>
        ) : null}
      </View>

      {/* RIGHT: Cart Button */}
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {renderCartButton()}
      </View>

    </TouchableOpacity>
  );
};

function styleData({ fontFamily }) {
  const styles = StyleSheet.create({
    outOfStock: {
      color: colors.orangeB,
      fontSize: textScale(10),
      lineHeight: 20,
      fontFamily: fontFamily.medium,
    },
    customTextStyle: {
      fontSize: textScale(9),
      fontFamily: fontFamily.medium,
      color: colors.yellowC,
    },
    imgStyle: {
      height: moderateScale(92),
      width: moderateScale(92),
      borderRadius: moderateScale(12),
    },
    cartIconImg: {
      width: moderateScale(18),
      height: moderateScale(18),
      tintColor: colors.white,
    },
  });

  const imgWrapper = (isDarkMode) => ({
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: isDarkMode ? colors.whiteOpacity15 : '#F0F0F0',
  });

  const circleBtn = (bg) => ({
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: bg,
    justifyContent: 'center',
    alignItems: 'center',
  });

  const qtyRow = (bg, isDarkMode, themeColors) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? bg : 'transparent',
    borderWidth: isDarkMode ? 0 : 1,
    borderColor: themeColors.primary_color,
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScaleVertical(6),
    minWidth: moderateScale(80),
    justifyContent: 'space-between',
  });

  return { ...styles, imgWrapper, circleBtn, qtyRow };
}
export default React.memo(ProductCard3);
