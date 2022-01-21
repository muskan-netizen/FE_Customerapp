import React, { useEffect, useState } from 'react';
import {
  Animated,
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
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { currencyNumberFormatter } from '../utils/commonFunction';
import {
  getImageUrl,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

let numberOfHits = [];

const ProductCard3 = ({
  data = {},
  onPress = () => { },
  addToCart = () => { },
  index,
  onIncrement,
  onDecrement,
  selectedItemID,
  Servicetype,
  isVisibleModal,
  selectedItemIndx,
  btnLoader,
  categoryInfo = '',
  businessType,
}) => {
  // console.log('item data++', data);
  // data['qty'] = 1
  const [state, setState] = useState({
    selectedIndex: -1,
    selectedIndexForCartIcon: -1,
    isVisibleTextSlideUp: false,
    qtyText: '1',
    isVisibleText: true,
    disabledBtn: false,
    isIncrement: true,
  });
  const {
    selectedIndex,
    selectedIndexForCartIcon,
    isVisibleText,
    qtyText,
    isVisibleTextSlideUp,
    disabledBtn,
    isIncrement,
  } = state;

  var totalProductQty = 0;
  if (data?.check_if_in_cart_app) {
    data?.check_if_in_cart_app.map((val) => {
      totalProductQty = totalProductQty + val.quantity;
    });
  }

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const isDarkMode = theme;
  const currentTheme = useSelector((state) => state?.appTheme);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = styleData({ themeColors, fontFamily });

  const { themeLayouts } = currentTheme;
  const commonStyles = commonStylesFunc({ fontFamily });

  const url1 = data?.media[0]?.image?.path.image_fit;
  const url2 = data?.media[0]?.image?.path.image_path;
  const getImage = (quality) => getImageUrl(url1, url2, quality);
  const getIconImage = (url1, url2, quality) =>
    getImageUrl(url1, url2, quality);

  const scaleInAnimated = new Animated.Value(0);

  const changePosition = () => {
    let i = selectedIndex == -1 ? index : -1;
    updateState({ selectedIndex: i });
  };

  useEffect(() => {
    updateState({ qtyText: data?.qty || totalProductQty });
  }, []);

  useEffect(() => {
    updateState({ qtyText: data?.qty || totalProductQty });
  }, [data?.qty]);

  const changePositionForCartIcon = () => {
    let i = selectedIndexForCartIcon == -1 ? index : -1;
    updateState({ selectedIndexForCartIcon: i });
  };

  const textAnimateForIncrement = {
    0: {
      top: 0,
    },
    0.5: {
      top: -3,
      height: 20,
    },
    1: {
      top: -50,
      height: 20,
    },
  };

  const textAnimateForIncrement_ = {
    0: {
      top: 50,
      height: 0,
    },
    0.5: {
      top: 30,
      height: 0,
    },
    1: {
      top: 9,
      height: 20,
    },
  };

  const textAnimateForDecrement = {
    0: {
      top: 9,
      height: 0,
    },
    0.5: {
      top: 20,
      height: 0,
    },
    1: {
      top: 35,
      height: 20,
    },
  };

  const textAnimateForDecrement_ = {
    0: {
      top: -50,
      height: 0,
    },
    0.5: {
      top: -3,
      height: 0,
    },
    1: {
      top: 9,
      height: 20,
    },
  };

  const initAnimation = async () => {
    updateState({ disabledBtn: true });
    console.log('checking text >>>>', numberOfHits[0]);
    updateState({ isVisibleTextSlideUp: true });
    updateState({ qtyText: Number(numberOfHits[0]) + 1 });

    await setTimeout(() => {
      updateState({ isVisibleText: false, isVisibleTextSlideUp: false });
      updateState({ isVisibleText: true });
    }, 250);
    await setTimeout(() => {
      numberOfHits.shift();
    }, 200);
    setTimeout(() => {
      if (numberOfHits.length > 0) {
        initAnimation();
      }
    }, 800);
    setTimeout(() => {
      updateState({ disabledBtn: false });
    }, 300);

    return;
    numberOfHits.forEach((el, index) => {
      console.log('checking text >>>>', el);
      updateState({ isVisibleTextSlideUp: true });
      updateState({ qtyText: el });

      setTimeout(() => {
        updateState({ isVisibleText: false });
        updateState({ isVisibleText: true });
        updateState({ isVisibleTextSlideUp: false });
      }, 500);
      if (numberOfHits.length === index + 1) {
        numberOfHits = [];
      }
    });
  };

  let htmlText = data?.translation[0]?.body_html || null;

  let typeId = data?.category?.category_detail?.type_id;
  return (
    <Animatable.View
      // animation={index > 8 ? '' : 'fadeInUp'}
      // delay={index > 8 ? 1 * 100 : index * 10}
      pointerEvents={btnLoader ? 'none' : 'auto'}>
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
        }}>
        <View
          style={{
            marginLeft: moderateScale(10),
            overflow: 'hidden',
            justifyContent: 'space-between',
            flexDirection: 'row',
            flex: 1,
            // alignItems: 'center',
          }}>
          <Animatable.View
            key={selectedIndex}
            style={{
              flex: 1,
              marginTop: selectedIndex == index ? moderateScaleVertical(8) : 0,
            }}
          // animation={selectedIndex == index ? 'fadeInDown' : 'fadeInLeft'}
          >
            {/* Title View */}
            <View>
              {data && !!data?.tags && data?.tags.length > 0 ? (
                <View>
                  {!!data.tags[0]?.tag?.icon ? (
                    <Image
                      source={{
                        uri: getIconImage(
                          data.tags[0]?.tag?.icon?.image_fit,
                          data?.tags[0]?.tag?.icon?.image_path,
                          '50/50',
                        ),
                      }}
                      style={{
                        marginLeft: moderateScale(1),
                        marginBottom: moderateScale(5),
                        width: moderateScale(17),
                        height: moderateScale(17),
                      }}
                    />
                  ) : null}
                </View>
              ) : null}
              <Text
                // numberOfLines={1}
                style={{
                  ...commonStyles.futuraBtHeavyFont14,
                  width: moderateScaleVertical(220),
                  // fontFamily: 'Eina02-SemiBold',
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(12),
                  width: width / 2.5,
                  textTransform: 'capitalize',
                  // flex:1
                }}>
                {data?.translation[0]?.title}
              </Text>
              {!!data?.category?.category_detail?.translation && (
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.inTextStyle,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity40,
                  }}>
                  {strings.IN}
                  {` ${data?.category?.category_detail?.translation[0]?.name}`}
                </Text>
              )}
            </View>

            {/* rating View */}
            {!!data?.averageRating && (
              <View
                style={{
                  borderWidth: 0.5,
                  alignSelf: 'flex-start',
                  padding: 2,
                  borderRadius: 2,
                  marginVertical: moderateScaleVertical(4),
                  borderColor: colors.yellowB,
                  backgroundColor: colors.yellowOpacity10,
                }}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={Number(parseInt(data?.averageRating).toFixed(1))}
                  fullStarColor={colors.yellowB}
                  starSize={8}
                  containerStyle={{ width: width / 9 }}
                />
              </View>
            )}

            {/* Price view */}
            <View
              style={{
                paddingTop: moderateScale(5),
                paddingBottom: moderateScale(5),
              }}>
              <Text
                numberOfLines={1}
                style={{
                  ...commonStyles.mediumFont14,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  fontSize: textScale(12),
                  fontFamily: fontFamily.regular,
                }}>
                {`${currencies?.primary_currency?.symbol
                  }${currencyNumberFormatter(
                    (
                      Number(
                        data?.variant[0]?.multiplier || data?.variant_multiplier,
                      ) * Number(data?.variant[0]?.price)
                    ).toFixed(2),
                  )}`}
              </Text>
            </View>
            <View style={{ width: width / 2 }}>
              <Text
                style={{
                  fontSize: textScale(10),
                  fontFamily: fontFamily.regular,
                  lineHeight: moderateScale(14),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity66,
                  textAlign: 'left',
                }}>
                {data?.translation_description}
              </Text>
              {/* {!!htmlText && (
                <HtmlViewComp
                  plainHtml={htmlText}
                  nodeComponentProps={{
                    numberOfLines: 2,
                  }}
                />
              )} */}
            </View>
          </Animatable.View>

          <View
            style={{
              paddingBottom:
                (!!data?.add_on && data?.add_on.length !== 0) ||
                  (!!data?.variantSet && data?.variantSet.length !== 0)
                  ? moderateScale(30)
                  : moderateScale(15),
              alignItems: 'center',
              // marginRight: url1 ? 0 :  moderateScale(60)
            }}>
            {url1 && (
              <Animatable.View
                key={selectedIndex}
                animation={
                  selectedIndex == index ? 'slideInLeft' : 'slideInRight'
                }
                duration={100}>
                <TouchableOpacity
                  disabled
                  onPress={changePosition}
                  activeOpacity={1}
                  style={{
                    ...commonStyles.shadowStyle,
                    margin: 2,
                    borderRadius: moderateScale(15),
                    height: moderateScale(100),
                    width: moderateScale(100),
                    // backgroundColor: 'red',
                    // padding:5
                  }}>
                  <FastImage
                    style={{
                      ...styles.imgStyle,
                      backgroundColor: isDarkMode
                        ? colors.whiteOpacity15
                        : colors.greyColor,
                      borderRadius: moderateScale(7),
                    }}
                    source={{ uri: getImage('800/400') }}
                  />
                </TouchableOpacity>
              </Animatable.View>
            )}

            <View
              style={{
                position: url1 ? 'absolute' : 'relative',
                bottom: 0,
                flex: 1,
                justifyContent: url1 ? 'flex-start' : 'center',
              }}>
              {!!data?.variant[0]?.quantity ||
                (!!typeId && typeId == 8) ||
                (!!businessType && businessType == 'laundry') ||
                data?.has_inventory == 0 ? (
                <View
                  style={{
                    marginTop:
                      selectedIndex == index ? moderateScaleVertical(8) : 0,
                    alignItems: 'center',
                    // backgroundColor: 'red',
                  }}>
                  {(!!data?.check_if_in_cart_app &&
                    data?.check_if_in_cart_app.length > 0) ||
                    !!data?.qty ||
                    totalProductQty ? (
                    <View
                      pointerEvents={categoryInfo?.is_vendor_closed && categoryInfo?.closed_store_order_scheduled !== 1 ? 'none' : 'auto'}
                      style={{
                        ...styles.addBtnStyle,
                        paddingVertical: 0,

                        height: 35,
                        // backgroundColor: themeColors.primary_color,
                        backgroundColor: colors.greyColor2,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderRadius: moderateScale(8),
                        paddingHorizontal: moderateScale(8),
                      }}>
                      <TouchableOpacity
                        disabled={selectedItemID == data?.id}
                        onPress={() => {
                          updateState({ ...state, isIncrement: false });
                          if (!disabledBtn) {
                            const isEnabled = numberOfHits.length === 0;
                            numberOfHits.push(data?.qty || totalProductQty);
                            if (isEnabled) {
                              initAnimation();
                            }
                            onDecrement();
                          }
                        }}
                        activeOpacity={0.8}
                        hitSlop={hitSlopProp}>
                        <Text
                          style={{
                            fontFamily: fontFamily.bold,
                            fontSize: moderateScale(16),
                            color: themeColors.primary_color,
                          }}>
                          -
                        </Text>
                      </TouchableOpacity>
                      <Animatable.View
                        style={{
                          // backgroundColor: 'red',
                          // height: 30,
                          overflow: 'hidden',
                        }}>
                        {selectedItemID == data?.id && btnLoader ? (
                          <UIActivityIndicator
                            size={moderateScale(18)}
                            color={themeColors.primary_color}
                          />
                        ) : (
                          // {/* {selectedItemIndx === index &&
                          //   selectedItemID == data?.id &&
                          //   btnLoader ? (
                          //   <UIActivityIndicator
                          //     size={moderateScale(18)}
                          //     color={themeColors.primary_color}
                          //   /> */}
                          <Animatable.View style={{ flex: 1 }}>
                            {isVisibleText ? (
                              <Animatable.Text
                                animation={
                                  isIncrement
                                    ? isVisibleTextSlideUp
                                      ? textAnimateForIncrement
                                      : textAnimateForIncrement_
                                    : isVisibleTextSlideUp
                                      ? textAnimateForDecrement
                                      : textAnimateForDecrement_
                                }
                                duration={150}
                                style={{
                                  fontFamily: fontFamily.bold,
                                  fontSize: moderateScale(16),
                                  color: themeColors.primary_color,
                                  height: 100,
                                }}>
                                {/* {qtyText || data?.qty || totalProductQty} */}
                                {qtyText}
                              </Animatable.Text>
                            ) : null}
                          </Animatable.View>
                        )}
                      </Animatable.View>
                      <TouchableOpacity
                        disabled={selectedItemID == data?.id}
                        activeOpacity={0.8}
                        hitSlop={hitSlopProp}
                        onPress={() => {
                          updateState({ ...state, isIncrement: true });
                          if (!disabledBtn) {
                            const isEnabled = numberOfHits.length === 0;
                            numberOfHits.push(data?.qty || totalProductQty);
                            if (isEnabled) {
                              initAnimation();
                            }
                            onIncrement();
                          }
                        }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.bold,
                            fontSize: moderateScale(20),
                            color: themeColors.primary_color,
                          }}>
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        disabled={selectedItemID == data?.id}
                        onPress={addToCart}
                        style={{
                          ...styles.addBtnStyle,
                          backgroundColor: colors.greyColor2,
                          // marginBottom: 1,
                        }}>
                        {selectedItemID == data?.id ? (
                          <UIActivityIndicator
                            size={moderateScale(18)}
                            color={themeColors.primary_color}
                          />
                        ) : (
                          <View>
                            <Text style={styles.addStyleText}>
                              {strings.ADD}{' '}
                              {data?.minimum_order_count > 1
                                ? `(${data?.minimum_order_count})`
                                : ''}
                            </Text>
                          </View>
                        )}

                        {/* <Image source={imagePath.greyRoundPlus} /> */}
                      </TouchableOpacity>
                    </>
                  )}
                  {(!!data?.add_on && data?.add_on.length !== 0) ||
                    (!!data?.variantSet && data?.variantSet.length !== 0) ? (
                    <Text
                      style={{
                        ...styles.customTextStyle,
                        textTransform: 'lowercase',
                        color: colors.blackOpacity40,
                      }}>
                      {strings.CUSTOMISABLE}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <Text style={styles.outOfStock}>{strings.OUT_OF_STOCK}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

function styleData({ themeColors, fontFamily }) {
  const styles = StyleSheet.create({
    outOfStock: {
      color: colors.orangeB,
      fontSize: textScale(10),
      lineHeight: 20,
      fontFamily: fontFamily.medium,
    },
    customTextStyle: {
      fontSize: textScale(8),
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(4),
      color: colors.yellowC,
    },
    addStyleText: {
      fontSize: textScale(10),
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
    },
    addBtnStyle: {
      borderWidth: StyleSheet.hairlineWidth,
      paddingVertical: moderateScaleVertical(6),
      borderRadius: moderateScale(8),
      borderColor: themeColors.primary_color,
      justifyContent: 'center',
      alignItems: 'center',
      width: moderateScale(73),
      height: moderateScaleVertical(35),

      // flexDirection:"row"
      // width: moderateScale(80),
    },
    inTextStyle: {
      width: moderateScaleVertical(220),
      fontFamily: fontFamily.regular,
      fontSize: textScale(9),
      width: width / 3,
      textAlign: 'left',
      marginTop: moderateScaleVertical(6),
      marginBottom: moderateScaleVertical(4),
    },
    imgStyle: {
      height: moderateScale(100),
      width: moderateScale(100),
      borderRadius: moderateScale(15),
    },
  });
  return styles;
}
export default React.memo(ProductCard3);
