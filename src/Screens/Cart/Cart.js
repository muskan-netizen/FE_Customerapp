import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {TextInput} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import AddressModal from '../../Components/AddressModal';
import ButtonComponent from '../../Components/ButtonComponent';
import ChooseAddressModal from '../../Components/ChooseAddressModal';
import ConfirmationModal from '../../Components/ConfirmationModal';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import TransparentButtonWithTxtAndIcon from '../../Components/TransparentButtonWithTxtAndIcon';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {getImageUrl, showError, showSuccess} from '../../utils/helperFunctions';
import ListEmptyCart from './ListEmptyCart';
import stylesFun from './styles';
import Modal from 'react-native-modal';
import GradientButton from '../../Components/GradientButton';
import DatePicker from 'react-native-date-picker';

export default function Cart({navigation, route}) {
  let paramsData = route?.params;
  const [state, setState] = useState({
    isLoading: true,
    isVisibleTimeModal: false,
    isVisible: false,
    cartItems: [],
    cartData: {},
    isLoadingB: false,
    isModalVisibleForClearCart: false,
    isVisibleAddressModal: false,
    type: '',
    vendorAddress: '',
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
    viewHeight: 0,
  });
  const {
    viewHeight,
    isVisibleTimeModal,
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
    vendorAddress,
    selectedTipvalue,
    selectedTipAmount,
  } = state;

  //Redux store data
  const userData = useSelector((state) => state?.auth?.userData);
  const {appData, allAddresss, themeColors, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const homePageLayout = appStyle?.homePageLayout;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const selectedAddressData = useSelector(
    (state) => state?.cart?.selectedAddress,
  );

  const dineInType = useSelector((state) => state?.home?.dineInType);

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

  useEffect(() => {
    checkforAddressUpdate();
  }, [selectedAddress, allAddresss]);

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
      } else {
        selectAddress(allAddresss[0]);
      }
    }
    if (selectedAddress && allAddresss.length) {
      // let find2=
      console.log(allAddresss, 'allAddresss');
      console.log(selectedAddress, 'selectedAddress');
      let find = allAddresss.find(
        (x) =>
          x.id == selectedAddress.id &&
          x.is_primary == selectedAddress.is_primary,
      );
      if (find) {
        selectAddress(find);
      } else {
        selectAddress(allAddresss[0]);
        // updateState({selectedAddress: null});
        // actions.saveAddress(null);
      }
    }
  };

  //get All address
  const getAllAddress = () => {
    if (!!userData?.auth_token) {
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
            console.log(res.data, 'saveAllUserAddress >>data');
            actions.saveAllUserAddress(res.data);
          }
        })
        .catch(errorMethod);
    }
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
        console.log(res, 'cart detail');
        actions.cartItemQty(res);
        updateState({isLoadingB: false, isRefreshing: false});
        if (res && res.data) {
          updateState({
            cartItems: res.data.products,
            vendorAddress: res.data.address,
            cartData: res.data,
          });
        } else {
          updateState({
            cartItems: [],
            cartData: {},
            vendorAddress: '',
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
        // systemuser: DeviceInfo.getUniqueId(),
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

  const _finalPayment = () => {
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
        if (!!userData) {
          !!userData?.client_preference?.verify_email ||
          !!userData?.client_preference?.verify_phone
            ? !!userData?.verify_details?.is_email_verified &&
              !!userData?.verify_details?.is_phone_verified
              ? _finalPayment()
              : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
                  formCart: true,
                })()
            : _finalPayment();
        } else {
          _finalPayment();
        }
        // _finalPayment()
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
        `/${selectedMethod}?tip=${
          selectedTipAmount && selectedTipAmount != ''
            ? Number(selectedTipAmount)
            : 0
        }&amount=${
          cartData?.total_payable_amount
        }&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&address_id=${
          selectedAddressData?.id
        }&payment_option_id=${selectedPayment?.id}&action=cart`,
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
          `/${selectedMethod}?tip=${
            selectedTipAmount && selectedTipAmount != ''
              ? Number(selectedTipAmount)
              : 0
          }&amount=${cartData?.total_payable_amount}&auth_token=${
            userData?.auth_token
          }&address_id=${selectedAddressData?.id}&payment_option_id=${
            selectedPayment?.id
          }&action=cart&stripe_token=${paramsData?.tokenInfo}`,
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
      <View
        style={{
          backgroundColor: '#fff',
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScale(10),
        }}>
        <View style={styles.vendorView}>
          <Text numberOfLines={1} style={styles.vendorText}>
            {item?.vendor?.name}
          </Text>
        </View>
        {item?.vendor_products.length
          ? item?.vendor_products.map((i, inx) => {
              return (
                <View key={inx}>
                  <View style={[styles.cartItemMainContainer]}>
                    <View style={styles.cartItemImage}>
                      <FastImage
                        source={
                          i?.cartImg != '' && i?.cartImg != null
                            ? {
                                uri: getImageUrl(
                                  i?.cartImg?.path?.proxy_url,
                                  i?.cartImg?.path?.image_path,
                                  '300/300',
                                ),
                              }
                            : imagePath.patternOne
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
                        <View style={{flex: 0.6}}>
                          <Text
                            numberOfLines={1}
                            style={[styles.priceItemLabel2, {opacity: 0.8}]}>
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
                                      numberOfLines={1}>{`(${j.option})`}</Text>
                                  </View>
                                );
                              })
                            : null}
                        </View>

                        <View style={{flex: 0.3, justifyContent: 'center'}}>
                          <View style={styles.incDecBtnContainer}>
                            <TouchableOpacity
                              style={{flex: 0.3, alignItems: 'center'}}
                              onPress={() => addDeleteCartItems(i, inx, 2)}>
                              <Text style={styles.cartItemValueBtn}>-</Text>
                            </TouchableOpacity>
                            <View style={{flex: 0.4, alignItems: 'center'}}>
                              <Text style={styles.cartItemValue}>
                                {i?.quantity}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={{flex: 0.3, alignItems: 'center'}}
                              onPress={() => addDeleteCartItems(i, inx, 1)}>
                              <Text style={styles.cartItemValueBtn}>+</Text>
                            </TouchableOpacity>
                          </View>
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
                              <Text style={{color: colors.textGrey}}>
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

                        <View
                          style={{
                            flex: 0.5,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text style={styles.cartItemPrice}>
                            {`${currencies?.primary_currency?.symbol}${
                              // Number(i?.pvariant?.multiplier) *
                              Number(i?.variants?.quantity_price).toFixed(2)
                            }`}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.dashedLine} />
                </View>
              );
            })
          : null}

        {item?.isDeliverable ? null : (
          <View style={{marginHorizontal: moderateScale(10)}}>
            <Text
              style={{
                fontSize: moderateScale(12),
                fontFamily: fontFamily.medium,
                color: colors.redFireBrick,
              }}>
              {
                'The specific items are not deliverable to this address. Please remove the items or change the address '
              }
            </Text>
          </View>
        )}

        {/* offerview */}
        <TouchableOpacity
          disabled={item?.couponData ? true : false}
          onPress={() => _getAllOffers(item.vendor, cartData)}
          style={styles.offersViewB}>
          {item?.couponData ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{flex: 0.7, flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{tintColor: themeColors.primary_color}}
                  source={imagePath.percent}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                  {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                {/* <Image source={imagePath.crossBlueB}  /> */}
                <Text
                  onPress={() => _removeCoupon(item, cartData)}
                  style={[styles.removeCoupon, {color: colors.cartItemPrice}]}>
                  {strings.REMOVE}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{tintColor: themeColors.primary_color}}
                source={imagePath.percent}
              />
              <Text
                style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                {strings.APPLY_PROMO_CODE}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {!!item?.discount_amount && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text style={styles.priceItemLabel}>{strings.DISCOUNT}</Text>
            <Text style={styles.priceItemLabel}>{`- ${
              currencies?.primary_currency?.symbol
            }${Number(
              item?.discount_amount ? item?.discount_amount : 0,
            ).toFixed(2)}`}</Text>
          </View>
        )}
        {!!item?.deliver_charge && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text style={styles.priceItemLabel}>
              {strings.DELIVERY_CHARGES}
            </Text>
            <Text style={styles.priceItemLabel}>{`${
              currencies?.primary_currency?.symbol
            }${Number(item?.deliver_charge ? item?.deliver_charge : 0).toFixed(
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

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: type,
        selectedId: id,
      });
    } else {
      // showError(strings.UNAUTHORIZED_MESSAGE);
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
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
      // showError(strings.UNAUTHORIZED_MESSAGE);
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
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

  const onPressPickUplater = () => {
    updateState({
      isVisibleTimeModal: true,
    });
  };
  //Footer section in cart screen
  const getFooter = () => {
    return (
      <>
        {/* Price section */}
        <View style={styles.priceSection}>
          <View style={[styles.bottomTabLableValue]}>
            <Text style={styles.priceItemLabel}>{strings.SUBTOTAL}</Text>
            <Text style={styles.priceItemLabel}>{`${
              currencies?.primary_currency?.symbol
            }${Number(cartData?.gross_paybale_amount).toFixed(2)}`}</Text>
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
          {!!cartData?.loyalty_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.priceItemLabel}>{strings.LOYALTY}</Text>
              <Text style={styles.priceItemLabel}>{`-${
                currencies?.primary_currency?.symbol
              }${Number(
                cartData?.loyalty_amount ? cartData?.loyalty_amount : 0,
              ).toFixed(2)}`}</Text>
            </View>
          )}

          {!!cartData?.total_subscription_discount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.priceItemLabel}>
                {strings.TOTALSUBSCRIPTION}
              </Text>
              <Text style={styles.priceItemLabel}>{`-${
                currencies?.primary_currency?.symbol
              }${Number(cartData?.total_subscription_discount).toFixed(
                2,
              )}`}</Text>
            </View>
          )}

          {/* {!!cartData?.total_discount_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.priceItemLabel}>
                {strings.TOTAL_DISCOUNT}
              </Text>
              <Text style={styles.priceItemLabel}>{`-${
                currencies?.primary_currency?.symbol
              }${Number(cartData?.total_discount_amount).toFixed(2)}`}</Text>
            </View>
          )} */}

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

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                </ScrollView>

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

          {!!cartData?.total_tax && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.priceItemLabel}>{strings.TAX_AMOUNT}</Text>
              <Text style={styles.priceItemLabel}>{`${
                currencies?.primary_currency?.symbol
              }${Number(cartData?.total_tax ? cartData?.total_tax : 0).toFixed(
                2,
              )}`}</Text>
            </View>
          )}

          <View style={styles.amountPayable}>
            <Text style={styles.priceItemLabel2}>{strings.AMOUNT_PAYABLE}</Text>
            <Text style={styles.priceItemLabel2}>{`${
              currencies?.primary_currency?.symbol
            }${(
              Number(cartData?.total_payable_amount) +
              (selectedTipAmount != null && selectedTipAmount != ''
                ? Number(selectedTipAmount)
                : 0)
            ).toFixed(2)}`}</Text>
          </View>
        </View>

        {/* Add instruction */}
        {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.addInstruction}>{strings.ADD_INSTRUCTIONS}</Text>
        </View> */}
        <View style={{height: moderateScaleVertical(20)}} />

        <View style={{height: 2}} />
        {/* select payment method */}
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

        {!!cartData?.deliver_status && (
          <View style={styles.paymentView}>
            {/* <ButtonComponent
            btnText={strings.SCHEDULE_ORDER}
            borderRadius={moderateScale(13)}
            containerStyle={styles.sceduleOrderStyle}
          /> */}

            <TransparentButtonWithTxtAndIcon
              btnText={strings.SCHEDULE_ORDER}
              borderRadius={moderateScale(13)}
              containerStyle={{
                marginHorizontal: 20,
                alignItems: 'center',
              }}
              onPress={onPressPickUplater}
              marginBottom={moderateScaleVertical(10)}
              marginTop={moderateScaleVertical(10)}
              containerStyle={{width: width / 2.5}}
              textStyle={{
                color: themeColors.primary_color,
                textTransform: 'none',
                fontSize: textScale(14),
              }}
            />

            <ButtonComponent
              onPress={() => placeOrder()}
              btnText={strings.PLACE_ORDER}
              borderRadius={moderateScale(13)}
              textStyle={{color: '#fff'}}
              containerStyle={styles.placeOrderButtonStyle}
            />
          </View>
        )}
      </>
    );
  };

  //Header section of cart screen
  const getHeader = () => {
    return (
      <>
        {/* Delivery Location */}
        {!vendorAddress ? (
          <>
            <View style={[styles.topLable, {marginTop: moderateScale(20)}]}>
              <View
                style={{
                  flex: 0.35,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
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
        ) : (
          <>
            <View
              style={{
                marginTop: moderateScale(20),
                flex: 0.35,
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: moderateScale(20),
              }}>
              <Image
                style={{tintColor: colors.black}}
                source={imagePath.locationGreen}
              />
              <Text numberOfLines={1} style={styles.deliveryLocationAndTime}>
                {strings.ADDRESS}:
              </Text>
              <Text numberOfLines={1} style={styles.address}>
                {vendorAddress}
              </Text>
            </View>
            <View style={styles.clearCartView}>
              <TouchableOpacity onPress={() => openClearCartModal()}>
                <Text style={styles.clearCart}>{strings.CLEARCART}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </>
    );
  };

  //Native modal for Modal
  const openClearCartModal = () => {
    Alert.alert('', strings.AREYOUSURE, [
      {
        text: 'Cancel',
        onPress: () => {},
        // style: 'destructive',
      },
      {text: 'Confirm', onPress: () => bottomButtonClick()},
    ]);
  };
  //SelectAddress
  const selectAddress = (address) => {
    if (!!userData?.auth_token) {
      updateState({isLoadingB: true});
      let data = {};
      let query = `/${address?.id}`;
      actions
        .setPrimaryAddress(query, data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          // updateState({isLoadingB: false, del: del ? false : true});
          actions.saveAddress(address);
          updateState({
            isVisible: false,
            isLoadingB: false,
            selectedAddress: address,
          });
          // getCartDetail();

          // showSuccess(res.message);
        })
        .catch((error) => {
          updateState({isLoadingB: false});
          showError(error?.message || error?.error);
        });
    }
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
        getAllAddress();
        setTimeout(() => {
          let address = res.data;
          address['is_primary'] = 1;
          // actions.saveAddress(address);
          updateState({
            selectedAddress: address,
          });
        }, 500);

        showSuccess(res.message);
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

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  const onClose = () => {
    updateState({isVisibleTimeModal: false});
  };

  const onDateChange = (value) => {
    console.log(value, 'value');
    // _onDateChange(value);
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoadingB}>
      {homePageLayout == 2 ? (
        <HeaderWithFilters centerTitle={strings.CART} LeftIcon={true} />
      ) : (
        <HeaderWithFilters centerTitle={strings.CART} noLeftIcon={true} />
      )}
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <View style={styles.mainComponent}>
        <FlatList
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems?.length ? getHeader() : null}
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
      </View>
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
      <AddressModal
        isVisible={isVisibleAddressModal}
        onClose={() => setModalVisibleForAddessModal(false)}
        type={type}
        passLocation={(data) => addUpdateLocation(data)}
      />

      {/* Date time modal */}
      <Modal
        transparent={true}
        isVisible={isVisibleTimeModal}
        animationType={'none'}
        style={styles.modalContainer}
        onLayout={(event) => {
          updateState({viewHeight: event.nativeEvent.layout.height});
        }}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image source={imagePath.crossB} />
        </TouchableOpacity>
        <View style={styles.modalMainViewContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.modalMainViewContainer}>
            <View
              style={{
                // flex: 0.6,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text style={styles.carType}>{strings.SELECTDATEANDTIME}</Text>
            </View>

            <View style={{alignItems: 'center', height: height / 3.5}}>
              <DatePicker
                date={new Date()}
                mode="datetime"
                minimumDate={new Date()}
                style={{width: width - 20, height: height / 3.5}}
                // onDateChange={setDate}
                onDateChange={(value) => onDateChange(value)}
              />
            </View>
          </ScrollView>
          <View
            style={[
              styles.bottomAddToCartView,
              {top: viewHeight - height / 6},
            ]}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              // textStyle={styles.textStyle}
              onPress={() => alert('In progress')}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(30)}
              btnText={strings.SELECT}
            />
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
}
