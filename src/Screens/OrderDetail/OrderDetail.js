import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
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
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {getImageUrl, showError} from '../../utils/helperFunctions';
import ListEmptyCart from './ListEmptyCart';
import stylesFunc from './styles';
const {height, width} = Dimensions.get('window');

export default function OrderDetail({navigation, route}) {
  const paramData = route?.params;
  console.log(paramData, 'paramsData.....');
  const [state, setState] = useState({
    isLoading: true,
    cartItems: [],
    cartData: {},
    selectedPayment: null,
  });
  const {isLoading, cartItems, cartData} = state;
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

    console.log(data, '_getOrderDetailScreen data >>>>>>');
    // console.log(paramData?.orderId,"orderId");
    updateState({isLoading: true});
    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'get order detail res>>>>');
        updateState({isLoading: false});
        if (res?.data) {
          updateState({
            cartItems: res.data.vendors,
            cartData: res.data,
            isLoading: false,
          });
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({isLoading: false, isLoading: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const onStarRatingPress = (i, rating) => {
    console.log(i, 't>>>');
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
    console.log(data, '>datadatadatadatadata');
    actions
      .giveRating(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'res>>>');
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
          backgroundColor: '#fff',
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScale(10),
        }}>
        <View style={styles.vendorView}>
          <Text style={styles.vendorText}>{item?.vendor_name}</Text>
        </View>
        {item?.products.length
          ? item?.products.map((i, inx) => {
              if (item?.vendor_id == i?.vendor_id) {
                return (
                  <View key={inx}>
                    <View style={[styles.cartItemMainContainer]}>
                      <View style={styles.cartItemImage}>
                        <FastImage
                          source={
                            i?.image_path
                              ? {
                                  uri: getImageUrl(
                                    i?.image_path?.image_fit,
                                    i?.image_path?.image_path,
                                    '300/300',
                                  ),
                                }
                              : ''
                          }
                          style={styles.imageStyle}
                        />
                      </View>

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
                              numberOfLines={2}
                              style={[styles.priceItemLabel2, {opacity: 0.8}]}>
                              {i?.translation?.title}
                            </Text>
                            {i?.variant_options.length
                              ? i?.variant_options.map((j, jnx) => {
                                  return (
                                    <View style={{flexDirection: 'row'}}>
                                      <Text
                                        style={styles.cartItemWeight2}
                                        numberOfLines={1}>
                                        {j.title}{' '}
                                      </Text>
                                      <Text
                                        style={styles.cartItemWeight2}
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
                              <View style={{flexDirection: 'row'}}>
                                <Text
                                  style={{
                                    color: colors.textGrey,
                                    fontSize: textScale(14),
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
                              {'Write a Review'}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    ) : null}

                    <View style={styles.dashedLine} />
                  </View>
                );
              } else {
                null;
              }
            })
          : null}

        {/* offerview */}
        {/* <TouchableOpacity
          disabled={item?.couponData ? true : false}
          onPress={() => _getAllOffers(item.vendor, cartData)}
          style={styles.offersViewB}>
          {item?.couponData ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{flex: 0.7, flexDirection: 'row', alignItems: 'center'}}>
                <Image source={imagePath.percent} />
                <Text
                  numberOfLines={1}
                  style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                  {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                <Text
                  onPress={() => _removeCoupon(item, cartData)}
                  style={[styles.removeCoupon, {color: colors.cartItemPrice}]}>
                  {strings.REMOVE}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={imagePath.percent} />
              <Text
                style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                {strings.APPLY_PROMO_CODE}
              </Text>
            </View>
          )}
        </TouchableOpacity> */}
        {!!Number(item?.discount_amount) && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text style={styles.priceItemLabel}>{strings.DISCOUNT}</Text>
            <Text style={styles.priceItemLabel}>{`- ${
              currencies?.primary_currency?.symbol
            }${Number(
              item?.discount_amount ? item?.discount_amount : 0,
            ).toFixed(2)}`}</Text>
          </View>
        )}
        {!!Number(item?.delivery_fee) && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text style={styles.priceItemLabel}>
              {strings.DELIVERY_CHARGES}
            </Text>
            <Text style={styles.priceItemLabel}>{`${
              currencies?.primary_currency?.symbol
            }${Number(item?.delivery_fee ? item?.delivery_fee : 0).toFixed(
              2,
            )}`}</Text>
          </View>
        )}
        <View style={styles.itemPriceDiscountTaxView}>
          <Text style={styles.priceItemLabel2}>{strings.AMOUNT}</Text>
          <Text style={styles.priceItemLabel2}>{`${
            currencies?.primary_currency?.symbol
          }${Number(item?.payable_amount ? item?.payable_amount : 0).toFixed(
            2,
          )}`}</Text>
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
          <Text style={styles.priceItemLabel}>{strings.SUBTOTAL}</Text>
          <Text style={styles.priceItemLabel}>{`${
            currencies?.primary_currency?.symbol
          }${Number(cartData?.total_amount).toFixed(2)}`}</Text>
        </View>
        {!!cartData?.wallet_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.WALLET}</Text>
            <Text style={styles.priceItemLabel}>{`${
              currencies?.primary_currency?.symbol
            }${Number(
              cartData?.wallet_amount ? cartData?.wallet_amount : 0,
            ).toFixed(2)}`}</Text>
          </View>
        )}
        {!!cartData?.loyalty_amount_saved && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.LOYALTY}</Text>
            <Text style={styles.priceItemLabel}>{`-${
              currencies?.primary_currency?.symbol
            }${Number(
              cartData?.loyalty_amount_saved
                ? cartData?.loyalty_amount_saved
                : 0,
            ).toFixed(2)}`}</Text>
          </View>
        )}

        {!!cartData?.total_discount && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.TOTAL_DISCOUNT}</Text>
            <Text style={styles.priceItemLabel}>{`-${
              currencies?.primary_currency?.symbol
            }${Number(cartData?.total_discount).toFixed(2)}`}</Text>
          </View>
        )}
        {!!cartData?.taxable_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text style={styles.priceItemLabel}>{strings.TAX_AMOUNT}</Text>
            <Text style={styles.priceItemLabel}>{`${
              currencies?.primary_currency?.symbol
            }${Number(
              cartData?.taxable_amount ? cartData?.taxable_amount : 0,
            ).toFixed(2)}`}</Text>
          </View>
        )}

        <View style={styles.amountPayable}>
          <Text style={styles.priceItemLabel2}>{strings.AMOUNT_PAYABLE}</Text>
          <Text style={styles.priceItemLabel2}>{`${
            currencies?.primary_currency?.symbol
          }${Number(cartData?.payable_amount).toFixed(2)}`}</Text>
        </View>
      </View>
    );
  };
  const getFooter = () => {
    return (
      <>
        {/* Price section */}
        {!!paramData?.fromVendorApp ? null : orderAmountDetail()}
        {!!cartData?.address ? null : orderAmountDetail()}
        {/* Add instruction */}

        <View style={{height: moderateScaleVertical(20)}} />

        <View style={{height: 2}} />
        {/* select payment method */}
        <TouchableOpacity
          disabled={true}
          style={[styles.paymentMainView, {justifyContent: 'space-between'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={imagePath.paymentMethod} />
            <Text style={styles.selectedMethod}>
              {cartData?.payment_option?.title || ''}
            </Text>
          </View>
          <View></View>
        </TouchableOpacity>
      </>
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: moderateScale(10),
            }}>
            {/* {!!paramData?.fromVendorApp && (
              <Image
                source={{
                  uri: cartData?.user_image ? getUserImage : getdummyUser,
                }}
                style={{
                  height: moderateScale(48),
                  width: moderateScale(48),
                  borderRadius: moderateScale(48 / 2),
                }}
              />
            )} */}
            <View style={{marginLeft: moderateScale(10)}}>
              {!!paramData?.fromVendorApp && (
                <Text style={styles.userName}>{cartData?.user_name}</Text>
              )}
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={
                    styles.orderLableStyle
                  }>{`#${cartData?.order_number}  |  `}</Text>
                <Text style={styles.orderLableStyle}>{`${moment(
                  cartData?.created_at,
                ).format('DD MMM,YYYY')} ${moment(cartData?.created_at).format(
                  'LT',
                )} `}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delivery Location */}
        <View style={[styles.topLable, {marginTop: moderateScale(10)}]}>
          <View style={{flex: 0.35, flexDirection: 'row'}}>
            <Image
              style={{tintColor: colors.black}}
              source={imagePath.locationGreen}
            />
            <Text numberOfLines={1} style={styles.deliveryLocationAndTime}>
              {strings.DELIVERYAT}
            </Text>
          </View>
          <View style={{flex: 0.7, flexWrap: 'wrap', justifyContent: 'center'}}>
            <View>
              <Text numberOfLines={1} style={styles.address}>
                {cartData?.address?.address}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoading}>
      <HeaderWithFilters
        leftIcon={
          appData?.profile?.code === shortCodes.capcorp
            ? imagePath.backArrow
            : imagePath.back
        }
        centerTitle={strings.ORDER_DET}
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <View style={styles.mainComponent}>
        <FlatList
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems.length ? getHeader() : null}
          ListFooterComponent={cartItems.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: colors.backgroundGrey}}
          keyExtractor={(item, index) => String(index)}
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
