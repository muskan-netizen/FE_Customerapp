import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, {useState} from 'react';
import {Dimensions, FlatList, Image, Text, View} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import LeftRightText from '../../Components/LeftRightText';
import {
  loaderFive,
  loaderOne,
} from '../../Components/Loaders/AnimatedLoaderFiles';
import StepIndicators from '../../Components/StepIndicator';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {getImageUrl, showError} from '../../utils/helperFunctions';
import ListEmptyCart from './ListEmptyCart';
import stylesFunc from './styles';

const {height, width} = Dimensions.get('window');

export default function OrderDetail({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  console.log('param data', paramData);
  const [state, setState] = useState({
    isLoading: true,
    cartItems: [],
    cartData: {},
    selectedPayment: null,
    labels: [
      strings.ACCEPTED,
      strings.PROCESSING,
      strings.OUT_FOR_DELIVERY,
      strings.DELIVERED,
    ],

    // labels: [
    //   {lable: 'Accepted', orderDate: '12/12/1233'},
    //   {lable: 'Processing', orderDate: ''},
    //   {lable: 'Out For Delivery', orderDate: ''},
    //   {lable: 'Delivered', orderDate: ''},
    // ],
    currentPosition: null,
    orderStatus: null,
  });
  const {isLoading, cartItems, cartData, labels, currentPosition, orderStatus} =
    state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useFocusEffect(
    React.useCallback(() => {
      updateState({isLoading: true});
      if (!!userData?.auth_token) {
        _getOrderDetailScreen();
      } else {
        showError(strings.UNAUTHORIZED_MESSAGE);
      }
    }, [currencies, languages, paramData]),
  );

  /*********Get order detail screen********* */
  const _getOrderDetailScreen = () => {
    let data = {};
    data['order_id'] = paramData?.orderId;
    if (paramData?.selectedVendor) {
      data['vendor_id'] = paramData?.selectedVendor.id;
    }

    //
    updateState({isLoading: true});
    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, '=====res');
        updateState({isLoading: false});
        if (res?.data) {
          updateState({
            cartItems: res.data.vendors,
            cartData: res.data,
            isLoading: false,
            currentPosition: paramData?.orderStatus
              ? labels.indexOf(
                  paramData?.orderStatus?.current_status?.title
                    .charAt(0)
                    .toUpperCase() +
                    paramData?.orderStatus?.current_status?.title.slice(1),
                )
              : null,
            orderStatus: res?.data?.vendors[0]?.order_status,
          });
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isLoading: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const onStarRatingPress = (i, rating) => {
    // updateState({isLoading: true});
    _giveRatingToProduct(i, rating);
  };

  const _giveRatingToProduct = (productDetail, rating) => {
    let data = {};
    data['order_vendor_product_id'] = productDetail?.id;
    data['order_id'] = productDetail?.order_id;
    data['product_id'] = productDetail?.product_id;
    data['rating'] = rating;
    data['review'] = productDetail?.product_rating?.review
      ? productDetail?.product_rating?.review
      : '';
    // data['vendor_id'] = productDetail.vendor_id;

    actions
      .giveRating(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        let cloned_cartItems = cloneDeep(cartItems);
        updateState({
          isLoading: false,
          cartItems: (cloned_cartItems = cloned_cartItems.map((itm, inx) => {
            itm.products.map((j, jnx) => {
              if (j?.product_id == productDetail?.product_id) {
                j.product_rating = res.data;
                return j;
              } else {
                return j;
              }
            });
            return itm;
          })),
        });
      })
      .catch(errorMethod);
  };

  //give review and update the rate
  const rateYourOrder = (item) => {
    navigation.navigate(navigationStrings.RATEORDER, {item});
  };

  const _renderItem = ({item, index}) => {
    // return <OffersCard />;
    let {itemCount} = state;
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          // marginVertical: moderateScale(10),
        }}>
        {/* show ETA Time */}

        {!!item?.ETA && (
          <View
            style={{
              ...styles.ariveView,
              backgroundColor: themeColors.primary_color,
            }}>
            <Text
              style={{
                ...styles.ariveTextStyle,
                color: colors.white,
              }}>
              {strings.YOUR_ORDER_WILL_ARRIVE_BY} {item?.ETA}
            </Text>
          </View>
        )}
        <View
          style={{
            paddingHorizontal: moderateScale(10),
          }}>
          <View
            style={{
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
              marginVertical: moderateScale(10),
            }}>
            <Text
              style={{
                ...styles.summaryText,
                marginBottom: 0,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,

                fontSize: textScale(13),
                fontFamily: fontFamily.bold,
              }}>
              {item?.vendor_name}
            </Text>
          </View>

          {item?.products.length
            ? item?.products.map((i, inx) => {
                if (item?.vendor_id == i?.vendor_id) {
                  return (
                    <View
                      style={{
                        marginBottom: moderateScaleVertical(6),
                      }}
                      key={inx}>
                      <View
                        style={{
                          ...styles.cartItemMainContainer,
                          backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.background
                            : '#F8F8F8',
                        }}>
                        <FastImage
                          source={
                            i?.image_path
                              ? {
                                  uri: getImageUrl(
                                    i?.image_path?.image_fit,
                                    i?.image_path?.image_path,
                                    '300/300',
                                  ),
                                  priority: FastImage.priority.high,
                                }
                              : ''
                          }
                          style={styles.imageStyle}
                        />

                        <View style={styles.cartItemDetailsCon}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flex: 0.7,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  ...styles.priceItemLabel2,
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.blackOpacity86,
                                  fontSize: textScale(12),
                                  fontFamily: fontFamily.medium,
                                }}>
                                {i?.translation?.title},
                              </Text>

                              {i?.variant_options.length
                                ? i?.variant_options.map((j, jnx) => {
                                    return (
                                      <View style={{flexDirection: 'row'}}>
                                        <Text
                                          style={
                                            isDarkMode
                                              ? [
                                                  styles.cartItemWeight2,
                                                  {
                                                    color:
                                                      MyDarkTheme.colors.text,
                                                  },
                                                ]
                                              : styles.cartItemWeight2
                                          }
                                          numberOfLines={1}>
                                          {j.title}{' '}
                                        </Text>
                                        <Text
                                          style={
                                            isDarkMode
                                              ? [
                                                  styles.cartItemWeight2,
                                                  {
                                                    color:
                                                      MyDarkTheme.colors.text,
                                                  },
                                                ]
                                              : styles.cartItemWeight2
                                          }
                                          numberOfLines={
                                            1
                                          }>{`(${j.option})`}</Text>
                                      </View>
                                    );
                                  })
                                : null}
                            </View>

                            <View
                              style={{
                                flex: 0.5,
                                justifyContent: 'center',
                                alignItems: 'flex-end',
                              }}>
                              <Text style={styles.cartItemPrice}>
                                {`${currencies?.primary_currency?.symbol}${
                                  // Number(i?.pvariant?.multiplier) *
                                  Number(i?.price).toFixed(2)
                                }`}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View style={{flex: 0.5, justifyContent: 'center'}}>
                              {i?.quantity && (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      ...styles.quantityStyles,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGrey,
                                    }}>
                                    {strings.QTY}
                                  </Text>
                                  <Text style={styles.cartItemWeight}>
                                    {i?.quantity}
                                  </Text>
                                </View>
                              )}
                              {!!i?.product_addons.length && (
                                <View>
                                  <Text style={styles.cartItemWeight2}>
                                    {strings.EXTRA}
                                  </Text>
                                </View>
                              )}
                              {i?.product_addons.length
                                ? i?.product_addons.map((j, jnx) => {
                                    return (
                                      <View style={{flexDirection: 'row'}}>
                                        <Text
                                          style={styles.cartItemWeight2}
                                          numberOfLines={1}>
                                          {j.addon_title}{' '}
                                        </Text>
                                        <Text
                                          style={styles.cartItemWeight2}
                                          numberOfLines={
                                            1
                                          }>{`(${j.option_title})`}</Text>
                                      </View>
                                    );
                                  })
                                : null}
                            </View>
                          </View>
                        </View>
                      </View>

                      {!!paramData?.showRating ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingBottom: moderateScaleVertical(5),
                            paddingHorizontal: moderateScale(10),
                          }}>
                          <StarRating
                            disabled={false}
                            maxStars={5}
                            rating={Number(i?.product_rating?.rating)}
                            selectedStar={(rating) =>
                              onStarRatingPress(i, rating)
                            }
                            fullStarColor={colors.ORANGE}
                            starSize={15}
                          />
                          {i?.product_rating?.rating ? (
                            <View>
                              <Text
                                onPress={() => rateYourOrder(i)}
                                style={[
                                  styles.writeAReview,
                                  {color: themeColors.primary_color},
                                ]}>
                                {strings.WRITE_REVIEW}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      ) : null}
                    </View>
                  );
                } else {
                  null;
                }
              })
            : null}

          {!!Number(item?.discount_amount) && (
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }>
                {strings.DISCOUNT}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }>{`- ${currencies?.primary_currency?.symbol}${Number(
                item?.discount_amount ? item?.discount_amount : 0,
              ).toFixed(2)}`}</Text>
            </View>
          )}
          {!!Number(item?.delivery_fee) && (
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }>
                {strings.DELIVERY_CHARGES}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                          fontSize: textScale(14),
                        },
                      ]
                    : styles.priceItemLabel
                }>{`${currencies?.primary_currency?.symbol}${Number(
                item?.delivery_fee ? item?.delivery_fee : 0,
              ).toFixed(2)}`}</Text>
            </View>
          )}
          <View style={styles.itemPriceDiscountTaxView}>
            <Text
              style={{
                ...styles.summaryText,
                fontSize: textScale(14),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}>
              {strings.AMOUNT}
            </Text>
            <Text
              style={{
                ...styles.summaryText,
                fontSize: textScale(14),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}>{`${currencies?.primary_currency?.symbol}${Number(
              item?.payable_amount ? item?.payable_amount : 0,
            ).toFixed(2)}`}</Text>
          </View>
        </View>
      </View>
    );
  };
  const orderAmountDetail = () => {
    return (
      <View style={styles.priceSection}>
        {/* <Text style={styles.price}>{strings.PRICE}</Text> */}
        <View
          style={[
            styles.bottomTabLableValue,
            // {marginTop: moderateScaleVertical(10)},
          ]}>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel
            }>
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel
            }>{`${currencies?.primary_currency?.symbol}${Number(
            cartData?.total_amount,
          ).toFixed(2)}`}</Text>
        </View>
        {!!cartData?.wallet_amount_used && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`-${currencies?.primary_currency?.symbol}${Number(
              cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0,
            ).toFixed(2)}`}</Text>
          </View>
        )}
        {!!cartData?.loyalty_amount_saved && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`-${currencies?.primary_currency?.symbol}${Number(
              cartData?.loyalty_amount_saved
                ? cartData?.loyalty_amount_saved
                : 0,
            ).toFixed(2)}`}</Text>
          </View>
        )}

        {!!cartData?.total_discount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.TOTAL_DISCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`-${currencies?.primary_currency?.symbol}${Number(
              cartData?.total_discount,
            ).toFixed(2)}`}</Text>
          </View>
        )}
        {!!cartData?.taxable_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.TAX_AMOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`${currencies?.primary_currency?.symbol}${Number(
              cartData?.taxable_amount ? cartData?.taxable_amount : 0,
            ).toFixed(2)}`}</Text>
          </View>
        )}

        <View style={styles.amountPayable}>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel2
            }>
            {strings.AMOUNT_PAYABLE}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel2
            }>{`${currencies?.primary_currency?.symbol}${Number(
            cartData?.payable_amount,
          ).toFixed(2)}`}</Text>
        </View>
      </View>
    );
  };

  const getFooter = () => {
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <View
          style={{
            padding: moderateScale(16),
          }}>
          <Text
            style={{
              ...styles.summaryText,
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}>
            {strings.DELIEVERY_ADDRESS}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: moderateScaleVertical(16),
            }}>
            <Image source={imagePath.icMap} />
            <View style={{marginLeft: moderateScale(12), flex: 1}}>
              <Text
                style={{
                  ...styles.summaryText,
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                  flex: 1,
                }}>
                {cartData?.address?.address}
              </Text>
            </View>
          </View>

          <LeftRightText
            leftText={strings.ORDER_NUMBER}
            rightText={`#${cartData?.order_number || ''}`}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />
          <LeftRightText
            leftText={strings.PAYMENT_METHOD}
            rightText={
              cartData?.payment_option?.title_lng
                ? cartData?.payment_option?.title_lng
                : cartData?.payment_option?.title || ''
            }
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />
          <LeftRightText
            leftText={strings.PLACED_ON}
            rightText={`${moment(cartData?.created_at).format(
              'DD MMM,YYYY',
            )} ${moment(cartData?.created_at).format('LT')} `}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />
        </View>
        <View
          style={{
            padding: moderateScale(16),
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.greyColor,
          }}>
          <Text
            style={{
              ...styles.summaryText,
              fontFamily: fontFamily.medium,
              fontSize: textScale(14),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}>
            {strings.PAYMENT_SUMMARY}
          </Text>

          {!!cartData?.subtotal_amount && (
            <LeftRightText
              leftText={strings.SUBTOTAL}
              rightText={`${currencies?.primary_currency?.symbol}${Number(
                cartData?.subtotal_amount,
              ).toFixed(2)}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.total_delivery_fee && (
            <LeftRightText
              leftText={strings.DELIVERY_FEE}
              rightText={`${currencies?.primary_currency?.symbol}${Number(
                cartData?.total_delivery_fee,
              ).toFixed(2)}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.total_discount && (
            <LeftRightText
              leftText={strings.DISCOUNT}
              rightText={`-${currencies?.primary_currency?.symbol}${Number(
                cartData?.total_discount,
              ).toFixed(2)}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          <View
            style={{
              ...styles.dottedLine,
              borderColor: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.lightGreyBgColor,
            }}
          />

          <LeftRightText
            leftText={strings.TOTAL}
            rightText={`${currencies?.primary_currency?.symbol}${Number(
              cartData?.total_amount,
            ).toFixed(2)}`}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(16),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
            rightTextStyle={{
              fontSize: textScale(16),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />
          <View style={{height: moderateScaleVertical(40)}}></View>
        </View>
      </View>
    );
  };

  const getHeader = () => {
    let getUserImage = getImageUrl(
      cartData?.user_image?.image_fit,
      cartData?.user_image?.image_path,
      '500/500',
    );

    return (
      <>
        {((!!orderStatus && orderStatus?.current_status?.title == 'Placed') ||
          (!!paramData &&
            paramData?.orderStatus?.current_status?.title == 'Placed')) && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: moderateScaleVertical(10),
            }}>
            {/* <BallIndicator
              size={35}
              count={10}
              color={themeColors.primary_color}
            /> */}

            <LottieView
              source={loaderFive}
              autoPlay
              loop
              style={{
                height: moderateScaleVertical(100),
                width: moderateScale(100),
              }}
              colorFilters={[
                {
                  keypath: 'right sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'right sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left sand 2',
                  color: themeColors.primary_color,
                },

                {
                  keypath: 'right top sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left top sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top left sand 1',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top left sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'right fallin sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'bottom cyrcle 12',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'bottom cyrcle 11',
                  color: themeColors.primary_color,
                },

                {
                  keypath: 'left fallin sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top right sand 1',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top right sand 1',
                  color: themeColors.primary_color,
                },

                // top right sand 1
              ]}
            />
            <Text style={styles.waitToAccept}>{strings.WAITINGTOACCEPT}</Text>
          </View>
        )}
        {!!orderStatus &&
          orderStatus?.current_status?.title != 'Rejected' &&
          orderStatus?.current_status?.title != 'Placed' && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}>
              <StepIndicators
                labels={labels}
                currentPosition={currentPosition}
                themeColor={themeColors}
              />
            </View>
          )}
        {!orderStatus &&
          paramData?.orderStatus?.current_status?.title != 'Rejected' &&
          paramData?.orderStatus?.current_status?.title != 'Placed' && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}>
              <StepIndicators
                labels={labels}
                currentPosition={currentPosition}
                themeColor={themeColors}
              />
            </View>
          )}
      </>
    );
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <HeaderWithFilters
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.ORDER_DETAILS}
      />
      <View
        style={{
          height: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.borderLight,
        }}
      />
      <View
        style={{
          ...styles.mainComponent,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.greyColor,
        }}>
        <FlatList
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems.length ? getHeader() : null}
          ListFooterComponent={cartItems.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: colors.backgroundGrey}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={_renderItem}
          ListEmptyComponent={<ListEmptyCart isLoading={isLoading} />}
          style={{flex: 1}}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        />
      </View>
    </WrapperContainer>
  );
}
