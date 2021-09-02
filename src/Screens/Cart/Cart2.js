import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import AddressModal2 from '../../Components/AddressModal2';
import ButtonComponent from '../../Components/ButtonComponent';
import ChooseAddressModal from '../../Components/ChooseAddressModal';
import ConfirmationModal from '../../Components/ConfirmationModal';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import ListEmptyCart from './ListEmptyCart';

export default function Cart2({navigation, route}) {
  let paramsData = route?.params;
  const [state, setState] = useState({
    isLoading: true,
    isVisible: false,
    cartItems: [],
    cartData: {},
    isLoadingB: false,
    isModalVisibleForClearCart: false,
    isVisibleAddressModal: false,
    type: '',
    selectedAddress: null,
    selectedPayment: {
      id: 1,
      title: 'Cash on Delivery',
      off_site: 0,
    },
    // selectedPayment: null,
    isRefreshing: false,
    selectedTipvalue: null,
    selectedTipAmount: null,
  });
  const {
    isLoading,
    cartItems,
    cartData,
    isLoadingB,
    isModalVisibleForClearCart,
    isVisibleAddressModal,
    isVisible,
    type,
    selectedAddress,
    selectedPayment,
    isRefreshing,
    selectedTipvalue,
    selectedTipAmount,
  } = state;

  //Redux store data
  const userData = useSelector((state) => state?.auth?.userData);
  const {appData, allAddresss, themeColors, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  // const styles = stylesFun({fontFamily, themeColors});
  const styles = stylesFunc({fontFamily, themeColors});

  const selectedAddressData = useSelector(
    (state) => state?.cart?.selectedAddress,
  );
  //Update states on screens
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  // styles funcation
  // const fontFamily = appStyle?.fontSizeData;
  // const styles = stylesFun({fontFamily, themeColors});

  //On focus fucntion
  useFocusEffect(
    React.useCallback(() => {
      if (paramsData && paramsData?.selectedMethod) {
        updateState({selectedPayment: paramsData?.selectedMethod});
      }
      checkforAddressUpdate();
      updateState({isLoadingB: true});
      getCartDetail();
    }, [
      currencies,
      languages,
      route?.params?.promocodeDetail,
      allAddresss,
      selectedAddress,
      paramsData,
      isRefreshing,
    ]),
  );

  //check for addreess Update and change
  const checkforAddressUpdate = () => {
    if (allAddresss.length == 0) {
      updateState({selectedAddress: null});
      actions.saveAddress(null);
    }
    if (!selectedAddress && allAddresss.length) {
      let find = allAddresss.find((x) => x.is_primary);
      if (find) {
        updateState({selectedAddress: find});
        actions.saveAddress(find);
      }
    }
    if (selectedAddress && allAddresss.length) {
      let find = allAddresss.find((x) => x.id == selectedAddress.id);
      if (find) {
      } else {
        updateState({selectedAddress: null});
        actions.saveAddress(null);
      }
    }
  };

  //get All address
  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        updateState({
          isLoadingB: false,
        });
        if (res.data) {
          actions.saveAllUserAddress(res.data);
        }
      })
      .catch(errorMethod);
  };

  //get the entire cart detail
  const getCartDetail = () => {
    actions
      .getCartDetail(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'res>>>');
        actions.cartItemQty(res);
        updateState({isLoadingB: false, isRefreshing: false});
        if (res && res.data) {
          updateState({
            cartItems: res.data.products,
            cartData: res.data,
          });
        }
      })
      .catch(errorMethod);
  };

  //add /delete products from cart
  const addDeleteCartItems = (item, index, type) => {
    let quanitity = null;
    let itemToUpdate = cloneDeep(item);
    if (type == 1) {
      quanitity = Number(itemToUpdate.quantity) + 1;
    } else {
      quanitity = Number(itemToUpdate.quantity) - 1;
    }
    if (quanitity) {
      updateState({isLoadingB: true});
      let data = {};
      data['cart_id'] = itemToUpdate?.cart_id;
      data['quantity'] = quanitity;
      data['cart_product_id'] = itemToUpdate?.id;

      actions
        .increaseDecreaseItemQty(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          actions.cartItemQty(res);
          updateState({
            cartItems: res.data.products,
            cartData: res.data,
            isLoadingB: false,
          });
        })
        .catch(errorMethod);
    } else {
      updateState({isLoadingB: true});
      removeProductFromCart(itemToUpdate);
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (item) => {
    let data = {};
    data['cart_id'] = item?.cart_id;
    data['cart_product_id'] = item?.id;
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        updateState({
          cartItems: res.data.products,
          cartData: res.data,
          isLoadingB: false,
        });
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Close modal for Clear cart
  const closeOptionModal = () => {
    updateState({isModalVisibleForClearCart: false});
  };

  const bottomButtonClick = () => {
    updateState({isLoadingB: true, isModalVisibleForClearCart: false});
    setTimeout(() => {
      clearEntireCart();
    }, 1000);
  };

  //Clear cart
  const clearEntireCart = () => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty(res);
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
        });
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS, {
      vendor: vendor,
      cartId: cartData.id,
    })();
  };

  useEffect(() => {
    if (paramsData?.transactionId) {
      _directOrderPlace();
    }
  }, [paramsData?.transactionId]);

  //Verify your promo code
  const _removeCoupon = (item, cartData) => {
    updateState({isLoadingB: true});
    let data = {};
    data['vendor_id'] = item?.vendor_id;
    data['cart_id'] = cartData?.id;
    data['coupon_id'] = item?.couponData?.coupon_id;

    actions
      .removePromoCode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        if (res) {
          showSuccess(res?.message || res?.error);
          getCartDetail();
        } else {
          updateState({isLoadingB: false});
        }
      })
      .catch(errorMethod);
  };

  const _directOrderPlace = () => {
    let data = {};
    data['address_id'] =
      paramsData?.selectedAddressData?.id || selectedAddressData?.id;
    data['payment_option_id'] =
      paramsData?.selectedPayment?.id || selectedPayment?.id;

    if (paramsData?.transactionId) {
      data['transaction_id'] = paramsData?.transactionId;
    }
    actions
      .placeOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        actions.cartItemQty({});
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
        });
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          orderDetail: res.data,
        })();
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Clear cart
  const placeOrder = () => {
    if (!!userData?.auth_token) {
      if (!selectedAddressData) {
        // showError('Please select address');
        setModalVisible(true);
      } else if (!selectedPayment) {
        showError('Please select a payment method');
      } else {
        if (selectedPayment?.id == 1 && selectedPayment?.off_site == 0) {
          updateState({isLoadingB: true});
          _directOrderPlace();
        } else {
          if (selectedPayment?.off_site == 1) {
            _webPayment();
          } else {
            _offineLinePayment();
          }
        }
      }
    } else {
      // showError(strings.UNAUTHORIZED_MESSAGE);
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };

  useEffect(() => {
    if (paramsData?.redirectFrom) {
      _directOrderPlace();
    }
  }, [paramsData?.redirectFrom]);
  const _webPayment = () => {
    let selectedMethod = selectedPayment.title.toLowerCase();
    let returnUrl = `/payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;
    let cancelUrl = `/payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;

    updateState({isLoadingB: true});
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${cartData?.total_payable_amount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&address_id=${selectedAddressData?.id}&payment_option_id=${selectedPayment?.id}&action=cart`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({isLoadingB: false, isRefreshing: false});
        if (res && res?.status == 'Success' && res?.data) {
          // updateState({allAvailAblePaymentMethods: res?.data});
          navigation.navigate(navigationStrings.WEBPAYMENTS, {
            paymentUrl: res?.data,
            paymentTitle: selectedPayment?.title,
            redirectFrom: 'cart',
            selectedAddressData: selectedAddressData,
            selectedPayment: selectedPayment,
          });
        }
      })
      .catch(errorMethod);
  };

  //Offline payments
  const _offineLinePayment = async () => {
    if (paramsData?.tokenInfo) {
      updateState({isLoadingB: true});
      let selectedMethod = selectedPayment.title.toLowerCase();
      updateState({isLoadingB: true});
      actions
        .openPaymentWebUrl(
          `/${selectedMethod}?amount=${cartData?.total_payable_amount}&auth_token=${userData?.auth_token}&address_id=${selectedAddressData?.id}&payment_option_id=${selectedPayment?.id}&action=cart&stripe_token=${paramsData?.tokenInfo}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          updateState({isRefreshing: false});
          if (res && res?.status == 'Success' && res?.data) {
            // updateState({allAvailAblePaymentMethods: res?.data});
            actions.cartItemQty({});
            updateState({
              cartItems: [],
              cartData: {},
              isLoadingB: false,
            });
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res.data,
            })();
            showSuccess(res?.message);
          } else {
            updateState({isLoadingB: false});
          }
        })
        .catch(errorMethod);
    } else {
      showError(
        'You have not added the cart detail for the selected payment method',
      );
    }
  };

  //render cart item and cart detail
  const _renderItem = ({item, index}) => {
    // return <OffersCard />;

    let {itemCount} = state;
    return (
      <>
        <View style={styles.mainContainer}>
          <View style={{flexDirection: 'column'}}>
            <Text numberOfLines={1} style={styles.vendorText}>
              {item?.vendor?.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fontFamily.regular,
                color: colors.textGreyF,
                marginTop: moderateScale(8),
              }}>
              Westheimer Road · 2.9 kms
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fontFamily.regular,
                color: colors.textGreyF,
                marginVertical: moderateScale(2),
              }}>
              German · Continental
            </Text>
          </View>
          <View>
            <FastImage
              source={{
                uri: getImageUrl(
                  item?.vendor?.banner?.proxy_url,
                  item?.vendor?.banner?.image_path,
                  '300/300',
                ),
              }}
              style={styles.cartVendorImage}
            />
          </View>
        </View>

        <View style={{marginHorizontal: moderateScale(20)}}>
          {item?.vendor_products.length
            ? item?.vendor_products.map((i, inx) => {
                return (
                  <View>
                    <View style={styles.cartCountView}>
                      <View style={{flex: 0.5}}>
                        <Text numberOfLines={1} style={styles.cartItemTitle}>
                          {i?.product?.translation[0]?.title}
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
                                    numberOfLines={1}>
                                    {`(${j.option})`}
                                  </Text>
                                </View>
                              );
                            })
                          : null}
                      </View>

                      <View style={{flex: 0.3, justifyContent: 'center'}}>
                        <View style={styles.cartAddRemoveView}>
                          <TouchableOpacity
                            style={{flex: 0.3, alignItems: 'center'}}
                            onPress={() => addDeleteCartItems(i, inx, 2)}>
                            <Text style={styles.countViewItems}>-</Text>
                          </TouchableOpacity>
                          <View style={{flex: 0.4, alignItems: 'center'}}>
                            <Text
                              style={[
                                styles.countViewItems,
                                {fontSize: textScale(12)},
                              ]}>
                              {i?.quantity}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={{flex: 0.3, alignItems: 'center'}}
                            onPress={() => addDeleteCartItems(i, inx, 1)}>
                            <Text style={styles.countViewItems}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 0.25,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                        }}>
                        <Text numberOfLines={1} style={styles.itemPriceText}>
                          {`${currencies?.primary_currency?.symbol}${
                            // Number(i?.pvariant?.multiplier) *
                            Number(i?.variants?.quantity_price).toFixed(2)
                          }`}
                        </Text>
                      </View>
                    </View>

                    {!!i?.product_addons.length && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: moderateScale(10),
                        }}>
                        <Text style={styles.cartItemWeight2}>
                          {strings.EXTRA}
                        </Text>
                        {i?.product_addons.length
                          ? i?.product_addons.map((j, jnx) => {
                              return (
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={styles.cartItemWeight2}
                                    numberOfLines={1}>
                                    {j.addon_title}
                                  </Text>
                                  <Text
                                    style={styles.cartItemWeight2}
                                    numberOfLines={
                                      1
                                    }>{`(${j.option_title})`}</Text>
                                  <Text
                                    style={[
                                      styles.cartItemWeight2,
                                      {color: colors.textGrey},
                                    ]}
                                    numberOfLines={1}>{` ${
                                    currencies?.primary_currency?.symbol
                                  }${(
                                    Number(j.price) * Number(j.multiplier)
                                  ).toFixed(2)} `}</Text>
                                </View>
                              );
                            })
                          : null}
                      </View>
                    )}
                  </View>
                );
              })
            : null}
        </View>

        <TouchableOpacity
          disabled={item?.couponData ? true : false}
          onPress={() => _getAllOffers(item.vendor, cartData)}
          activeOpacity={0.7}
          style={styles.applyPromoBtn}>
          {item?.couponData ? (
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: themeColors.primary_color,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(12),
                }}>
                {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
              </Text>
              <Text
                onPress={() => _removeCoupon(item, cartData)}
                style={[styles.removeCoupon, {color: colors.cartItemPrice}]}>
                {strings.REMOVE}
              </Text>
            </View>
          ) : (
            <Text style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
              {strings.APPLY_PROMO_CODE}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.itemPriceDiscountTaxView}>
          {!!item?.discount_amount && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.priceItemLabel}>{strings.DISCOUNT}</Text>
              <Text style={styles.priceItemLabel}>{`- ${
                currencies?.primary_currency?.symbol
              }${Number(
                item?.discount_amount ? item?.discount_amount : 0,
              ).toFixed(2)}`}</Text>
            </View>
          )}
          {!!item?.deliver_charge && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.priceItemLabel}>
                {strings.DELIVERY_CHARGES}
              </Text>
              <Text style={styles.priceItemLabel}>{`${
                currencies?.primary_currency?.symbol
              }${Number(
                item?.deliver_charge ? item?.deliver_charge : 0,
              ).toFixed(2)}`}</Text>
            </View>
          )}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.priceItemLabel2}>{strings.AMOUNT}</Text>
            <Text style={styles.priceItemLabel2}>{`${
              currencies?.primary_currency?.symbol
            }${Number(item?.payable_amount ? item?.payable_amount : 0).toFixed(
              2,
            )}`}</Text>
          </View>
        </View>
      </>
    );
  };

  //Add and update the addreess
  const addUpdateLocation = (childData) => {
    // setModalVisible(false);
    updateState({isLoading: true});
    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
        });
        actions.saveAddress(res.data);
        getAllAddress();
        showSuccess(res.message);
        setTimeout(() => {
          updateState({
            selectedAddress: res.data,
          });
        }, 1000);
      })
      .catch((error) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
        });
        showError(error?.message || error?.error);
      });
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: type,
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };
  const setModalVisibleForAddessModal = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({isVisible: false});
      setTimeout(() => {
        updateState({
          updateData: data,
          isVisibleAddressModal: visible,
          type: type,
          selectedId: id,
        });
      }, 1000);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  //Footer section in cart screen
  const getFooter = () => {
    return (
      <>
        <View style={{marginHorizontal: moderateScale(20)}}>
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={styles.instructionView}
            placeholder={
              ' Any restaurant requests? We’ll try our best to convey it '
            }></TextInput>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: textScale(15),
              marginVertical: moderateScale(20),
            }}>
            Order details
          </Text>
          <View style={[styles.bottomTabLableValue]}>
            <Text style={styles.totalTxts}>{strings.SUBTOTAL}</Text>
            <Text style={styles.totalTxts}>{`${
              currencies?.primary_currency?.symbol
            }${Number(cartData?.gross_paybale_amount).toFixed(2)}`}</Text>
          </View>
          {!!cartData?.wallet_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.totalTxts}>{strings.WALLET}</Text>
              <Text style={styles.totalTxts}>{`${
                currencies?.primary_currency?.symbol
              }${Number(
                cartData?.wallet_amount ? cartData?.wallet_amount : 0,
              ).toFixed(2)}`}</Text>
            </View>
          )}
          {!!cartData?.loyalty_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.totalTxts}>{strings.LOYALTY}</Text>
              <Text style={styles.totalTxts}>{`-${
                currencies?.primary_currency?.symbol
              }${Number(
                cartData?.loyalty_amount ? cartData?.loyalty_amount : 0,
              ).toFixed(2)}`}</Text>
            </View>
          )}

          {!!cartData?.total_discount_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.totalTxts}>{strings.TOTAL_DISCOUNT}</Text>
              <Text style={styles.totalTxts}>{`-${
                currencies?.primary_currency?.symbol
              }${Number(cartData?.total_discount_amount).toFixed(2)}`}</Text>
            </View>
          )}
          {!!cartData?.total_tax && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.totalTxts}>{strings.TAX_AMOUNT}</Text>
              <Text style={styles.totalTxts}>{`${
                currencies?.primary_currency?.symbol
              }${Number(cartData?.total_tax ? cartData?.total_tax : 0).toFixed(
                2,
              )}`}</Text>
            </View>
          )}
          <View style={{height: 5}} />
          <DashedLine
            dashLength={5}
            dashThickness={0.5}
            dashGap={2}
            dashColor={colors.greyLight}
          />

          {!!cartData?.tip &&
            cartData?.tip.length &&
            Number(cartData?.total_payable_amount) != 0 && (
              <View
                style={[
                  styles.bottomTabLableValue,
                  {flexDirection: 'column', marginTop: 20},
                ]}>
                <Text style={[styles.priceTipLabel]}>
                  {strings.DOYOUWANTTOGIVEATIP}
                </Text>

                <KeyboardAwareScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}>
                  {cartData?.tip.map((j, jnx) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.tipArrayStyle,
                          {
                            backgroundColor:
                              selectedTipvalue?.value == j?.value
                                ? themeColors.primary_color
                                : 'transparent',
                          },
                        ]}
                        onPress={() => selectedTip(j)}>
                        <Text
                          style={{
                            color:
                              selectedTipvalue?.value == j?.value
                                ? colors.white
                                : colors.black,
                          }}>
                          {`${currencies?.primary_currency?.symbol} ${j.value}`}
                        </Text>
                        <Text
                          style={{
                            color:
                              selectedTipvalue?.value == j?.value
                                ? colors.white
                                : colors.textGreyB,
                          }}>
                          {j.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    style={[
                      styles.tipArrayStyle2,
                      {
                        backgroundColor:
                          selectedTipvalue == 'custom'
                            ? themeColors.primary_color
                            : 'transparent',
                      },
                    ]}
                    onPress={() => selectedTip('custom')}>
                    <Text
                      style={{
                        color:
                          selectedTipvalue == 'custom'
                            ? colors.white
                            : colors.black,
                      }}>
                      {'Custom'}
                    </Text>
                    <Text
                      style={{
                        color:
                          selectedTipvalue == 'custom'
                            ? colors.white
                            : colors.black,
                      }}>
                      {'Amount'}
                    </Text>
                  </TouchableOpacity>
                </KeyboardAwareScrollView>

                {!!selectedTipvalue && selectedTipvalue == 'custom' && (
                  <View
                    style={{
                      borderRadius: 5,
                      borderWidth: 0.5,
                      borderColor: colors.textGreyB,
                      height: 40,
                    }}>
                    <TextInput
                      value={selectedTipAmount}
                      onChangeText={(text) =>
                        updateState({selectedTipAmount: text})
                      }
                      style={{
                        height: 40,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                      }}
                      maxLength={5}
                      returnKeyType={'done'}
                      keyboardType={'number-pad'}
                      placeholder={'Enter Custom Amount'}
                    />
                  </View>
                )}
              </View>
            )}

          <View style={styles.amountPayable}>
            <Text style={styles.totalTxts2}>{strings.AMOUNT_PAYABLE}</Text>
            <Text style={styles.priceItemLabel3}>{`${
              currencies?.primary_currency?.symbol
            }${(
              Number(cartData?.total_payable_amount) +
              (selectedTipAmount != null && selectedTipAmount != ''
                ? Number(selectedTipAmount)
                : 0)
            ).toFixed(2)}`}</Text>
          </View>
        </View>
        <View style={{height: moderateScaleVertical(40)}} />

        <TouchableOpacity
          onPress={() =>
            !!userData?.auth_token
              ? moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS)()
              : showError(strings.UNAUTHORIZED_MESSAGE)
          }
          style={[styles.paymentMainView, {justifyContent: 'space-between'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={imagePath.paymentMethod} />
            <Text style={styles.selectedMethod}>
              {selectedPayment
                ? selectedPayment.title
                : strings.SELECT_PAYMENT_METHOD}
            </Text>
          </View>
          <View>
            <Image
              source={imagePath.goRight}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
            />
          </View>
        </TouchableOpacity>

        {/* {payment submit button} */}
        <View
          style={{
            marginHorizontal: moderateScale(20),
            marginVertical:
              Platform.OS === 'ios'
                ? moderateScaleVertical(40)
                : moderateScaleVertical(25),
          }}>
          <ButtonComponent
            onPress={() => placeOrder()}
            btnText={strings.PLACE_ORDER}
            borderRadius={moderateScale(15)}
            textStyle={{color: '#fff'}}
            containerStyle={{
              backgroundColor: themeColors.primary_color,
              width: '100%',
            }}
          />
        </View>
      </>
    );
  };

  //Header section of cart screen
  const getHeader = () => {
    return (
      <>
        {/* Delivery Location */}
        <View style={[styles.topLable, {marginTop: moderateScale(20)}]}>
          <View
            style={{flex: 0.35, flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{tintColor: colors.black}}
              source={imagePath.locationGreen}
            />
            <Text numberOfLines={1} style={styles.deliveryLocationAndTime}>
              {strings.DELIVERYAT}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              flex: 0.7,
              // flexWrap: 'wrap',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => setModalVisible(true)}>
            <Text numberOfLines={1} style={styles.address}>
              {selectedAddressData
                ? selectedAddressData?.address
                : 'Add Address'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* clear cart  */}
        <View style={styles.clearCartView}>
          <TouchableOpacity onPress={() => openClearCartModal()}>
            <Text style={styles.clearCart}>{strings.CLEARCART}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const selectedTip = (tip) => {
    console.log(tip, 'tip >>>ITEM');

    if (selectedTipvalue == 'custom') {
      updateState({selectedTipvalue: tip, selectedTipAmount: null});
    } else {
      if (selectedTipvalue && selectedTipvalue?.value == tip?.value) {
        updateState({selectedTipvalue: null, selectedTipAmount: null});
      } else {
        updateState({selectedTipvalue: tip, selectedTipAmount: tip?.value});
      }
    }
  };

  //Native modal for Modal
  const openClearCartModal = () => {
    Alert.alert('', strings.AREYOUSURE, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      {text: 'Confirm', onPress: () => bottomButtonClick()},
    ]);
  };
  //SelectAddress
  const selectAddress = (address) => {
    actions.saveAddress(address);
    updateState({
      isVisible: false,
      selectedAddress: address,
    });
  };
  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoadingB}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2 ? imagePath.backArrow : imagePath.back
        }
        centerTitle={strings.CART}
        headerStyle={{backgroundColor: colors.backgroundGrey}}
      />
      <View style={{height: 1, backgroundColor: colors.borderColorD}} />
      <FlatList
        data={cartItems}
        extraData={cartItems}
        // ListHeaderComponent={cartItems?.length ? getHeader() : null}
        ListFooterComponent={cartItems?.length ? getFooter() : null}
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: colors.backgroundGrey}}
        keyExtractor={(item, index) => String(index)}
        renderItem={_renderItem}
        ListEmptyComponent={<ListEmptyCart isLoading={isLoadingB} />}
        style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        contentContainerStyle={{
          flexGrow: 1,
        }}
      />
      {!!isModalVisibleForClearCart && (
        <ConfirmationModal
          closeModal={() => closeOptionModal()}
          ShowModal={isModalVisibleForClearCart}
          showBottomButton={true}
          mainText={strings.AREYOUSURE}
          bottomButtonClick={bottomButtonClick}
          updateStatus={(item) => updateStatus(item)}
        />
      )}
      <ChooseAddressModal
        isVisible={isVisible}
        onClose={() => setModalVisible(false)}
        openAddressModal={() =>
          setModalVisibleForAddessModal(true, 'addAddress')
        }
        selectAddress={(data) => selectAddress(data)}
        selectedAddress={selectedAddressData}
      />
      <AddressModal2
        isVisible={isVisibleAddressModal}
        onClose={() => setModalVisibleForAddessModal(false)}
        passLocation={(data) => addUpdateLocation(data)}
        type={type}
      />
    </WrapperContainer>
  );
}

export function stylesFunc({fontFamily, themeColors}) {
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      marginHorizontal: moderateScale(20),
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(20),
    },
    cartVendorImage: {
      height: moderateScale(80),
      width: moderateScale(80),
      borderRadius: moderateScale(15),
    },
    cartCountView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: moderateScaleVertical(5),
    },
    cartItemTitle: {
      opacity: 0.8,
      color: colors.black,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    cartAddRemoveView: {
      borderRadius: moderateScale(15),
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingVertical: moderateScaleVertical(3),
      borderWidth: 1,
      borderColor: colors.borderColorD,
      alignItems: 'center',
    },
    countViewItems: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(20),
      color: themeColors.primary_color,
    },
    itemPriceText: {
      fontFamily: fontFamily.medium,
      color: colors.black,
      fontSize: textScale(14),
      marginVertical: moderateScaleVertical(8),
    },
    applyPromoBtn: {
      marginHorizontal: moderateScale(15),
      borderRadius: moderateScale(15),
      borderWidth: 1,
      borderColor: colors.borderColorD,
      paddingVertical: moderateScaleVertical(15),
      paddingHorizontal: moderateScaleVertical(10),
      marginVertical: moderateScaleVertical(10),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    instructionView: {
      height: moderateScale(80),
      borderRadius: moderateScale(15),
      backgroundColor: colors.borderColorD,
      marginVertical: moderateScaleVertical(10),
      padding: moderateScale(10),
    },
    totalTxts: {
      color: colors.black,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    totalTxts2: {
      color: colors.black,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    topLable: {
      flexDirection: 'row',
      paddingHorizontal: moderateScale(10),
    },
    deliveryLocationAndTime: {
      ...commonStyles.mediumFont14,
      color: colors.textGreyB,
    },
    clearCartView: {
      height: moderateScaleVertical(30),
      backgroundColor: getColorCodeWithOpactiyNumber(
        themeColors.primary_color.substr(1),
        20,
      ),
      marginTop: moderateScaleVertical(10),
      justifyContent: 'center',
      alignItems: 'center',
    },

    clearCart: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      color: themeColors.primary_color,
      opacity: 1,
      alignSelf: 'center',
    },
    vendorText: {
      ...commonStyles.futuraHeavyBt,
      marginRight: moderateScale(20),
      color: colors.blackB,
      opacity: 1,
    },

    viewOffers: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },
    removeCoupon: {
      color: colors.themeColor,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },

    price: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    priceItemLabelVat: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
    },
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    priceItemLabel3: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    addInstruction: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      textDecorationLine: 'underline',
    },
    selectedMethod: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      marginLeft: moderateScale(10),
    },
    paymentMainView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: moderateScaleVertical(20),
      paddingHorizontal: moderateScale(5),
      paddingVertical: moderateScaleVertical(10),
      borderRadius: moderateScale(15),
      backgroundColor: colors.lightGreyBgB,
    },

    // cart item design start from here
    cartItemMainContainer: {
      flexDirection: 'row',
      paddingVertical: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(10),
      backgroundColor: colors.white,
    },
    cartItemImage: {
      height: width / 4.5,
      width: width / 4.5,
      backgroundColor: colors.white,
    },
    cartItemName: {
      fontSize: textScale(15),
      fontFamily: fontFamily.bold,
      marginTop: moderateScaleVertical(5),
      color: colors.black,
      opacity: 0.8,
    },
    cartItemDetailsCon: {
      width: width - width / 4 - 20,
      paddingHorizontal: moderateScale(10),
    },
    cartItemPrice: {
      fontFamily: fontFamily.bold,
      color: colors.cartItemPrice,
      fontSize: textScale(14),
      marginVertical: moderateScaleVertical(8),
    },
    cartItemWeight: {
      color: colors.textGreyB,
    },
    cartItemWeight2: {
      color: colors.textGreyB,
      fontSize: moderateScaleVertical(11),
    },
    rattingContainer: {
      paddingRight: moderateScale(16),
      width: moderateScaleVertical(100),
    },
    incDecBtnContainer: {
      backgroundColor: themeColors.primary_color,
      borderRadius: moderateScale(5),
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingVertical: moderateScaleVertical(3),
    },
    cartItemRatting: {
      tintColor: colors.orange,
      marginTop: moderateScaleVertical(2),
      marginTop: moderateScaleVertical(8),
    },
    cartItemRattingNum: {
      marginLeft: moderateScaleVertical(5),
      fontFamily: fontFamily.bold,
      color: colors.orange,
      marginTop: moderateScaleVertical(8),
    },
    cartItemValueBtn: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(20),
      color: colors.white,
    },
    cartItemValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
      color: colors.white,
      marginTop: moderateScaleVertical(5),
    },
    cartItemLine: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginBottom: moderateScaleVertical(10),
    },

    itemPriceDiscountTaxView: {
      flexDirection: 'column',
      marginHorizontal: moderateScale(20),
      paddingVertical: moderateScale(5),
      paddingHorizontal: moderateScale(10),
    },
    bottomTabLableValue: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(5),
    },
    amountPayable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(10),
    },

    dashedLine: {
      height: 1,
      borderRadius: 1,
      borderWidth: 0.5,
      borderColor: colors.borderLight,
      borderStyle: 'dashed',
    },
    address: {
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBgColor,
      fontSize: textScale(10),
    },

    containerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      ...commonStyles.mediumFont16,
      fontSize: textScale(18),
    },
    tipArrayStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderColor: colors.textGreyB,
      marginRight: 5,
      marginVertical: 20,
      borderRadius: moderateScale(5),
      borderColor: themeColors.primary_color,
    },
    tipArrayStyle2: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderColor: colors.textGreyB,
      marginRight: 5,
      marginVertical: 20,
      borderRadius: moderateScale(5),
      borderColor: themeColors.primary_color,
    },
  });
  return styles;
}
