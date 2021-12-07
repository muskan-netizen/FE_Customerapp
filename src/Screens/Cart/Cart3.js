import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep, isEmpty, update} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  FlatList,
  I18nManager,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import * as Animatable from 'react-native-animatable';
import DatePicker from 'react-native-date-picker';
import DeviceInfo from 'react-native-device-info';
import DropDownPicker from 'react-native-dropdown-picker';
import FastImage from 'react-native-fast-image';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {UIActivityIndicator} from 'react-native-indicators';
import * as RNLocalize from 'react-native-localize';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import AddressModal3 from '../../Components/AddressModal3';
import ButtonComponent from '../../Components/ButtonComponent';
import ChooseAddressModal from '../../Components/ChooseAddressModal';
import ConfirmationModal from '../../Components/ConfirmationModal';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import HorizontalLine from '../../Components/HorizontalLine';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import ProductListLoader from '../../Components/Loaders/ProductListLoader';
import MarketCard3 from '../../Components/MarketCard3';
import ProductsComp from '../../Components/ProductsComp';
import WishlistCard from '../../Components/WishlistCard';
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
import {MyDarkTheme} from '../../styles/theme';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {
  getImageUrl,
  getParameterByName,
  numberFormat,
  showError,
  showInfo,
  showSuccess,
  timeInLocalLangauge,
} from '../../utils/helperFunctions';
import {getItem, removeItem, setItem} from '../../utils/utils';
import stylesFun from './styles';
import RazorpayCheckout from 'react-native-razorpay';
import moment from 'moment';
import {hitSlopProp} from '../../styles/commonStyles';
import {CheckBox} from 'react-native-elements';

export default function Cart({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const checkCartItem = useSelector((state) => state?.cart?.cartItemCount);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const location = useSelector((state) => state?.home?.location);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let paramsData = route?.params;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const recommendedVendorsdata = appMainData?.vendors;

  const [state, setState] = useState({
    isVisibleTimeModal: false,
    isVisible: false,
    cartItems: [],
    cartData: {},
    isLoadingB: true,
    isModalVisibleForClearCart: false,
    isVisibleAddressModal: false,
    type: '',
    vendorAddress: '',
    selectedAddress: null,
    selectedPayment: {},
    isRefreshing: false,
    selectedTipvalue: null,
    selectedTipAmount: null,
    viewHeight: 0,
    tableData: [],
    isTableDropDown: false,
    defaultSelectedTable: '',
    deepLinkUrl: null,
    selectedTimeOptions: [
      {id: 1, title: strings.NOW, type: 'now'},
      {id: 2, title: strings.SCHEDULE_ORDER, type: 'schedule'},
    ],
    selectedTimeOption: null,
    sheduledorderdate: null,
    sheduledpickupdate: null,
    sheduleddropoffdate: null,
    scheduleType: null,
    swipeKey: 'randomStrings',
    wishlistArray: [],
    btnLoader: false,
    placeLoader: false,
    localeSheduledOrderDate: null,
    btnLoadrId: null,
    instruction: '',
    pickupDriverComment: null,
    dropOffDriverComment: null,
    vendorComment: null,
    localePickupDate: null,
    localeDropOffDate: null,
    modalType: null,
    showTaxFeeArea: false,
    isGiftBoxSelected: false,
  });
  const {
    viewHeight,
    isVisibleTimeModal,
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
    tableData,
    isTableDropDown,
    defaultSelectedTable,
    deepLinkUrl,
    selectedTimeOptions,
    selectedTimeOption,
    sheduledorderdate,
    scheduleType,
    swipeKey,
    wishlistArray,
    btnLoader,
    placeLoader,
    localeSheduledOrderDate,
    btnLoadrId,
    instruction,
    pickupDriverComment,
    dropOffDriverComment,
    vendorComment,
    localePickupDate,
    localeDropOffDate,
    modalType,
    sheduledpickupdate,
    sheduleddropoffdate,
    showTaxFeeArea,
    isGiftBoxSelected,
  } = state;

  //Redux store data
  const userData = useSelector((state) => state?.auth?.userData);
  const {appData, allAddresss, themeColors, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const selectedLanguage = languages?.primary_language?.sort_code;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors, isDarkMode, MyDarkTheme});

  const selectedAddressData = useSelector(
    (state) => state?.cart?.selectedAddress,
  );

  const dineInType = useSelector((state) => state?.home?.dineInType);
  console.log(dineInType, 'dineInType');

  //Update states on screens
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  let businessType = appData?.profile?.preferences?.business_type || null;

  useFocusEffect(
    React.useCallback(() => {
      if (paramsData && paramsData?.selectedMethod) {
        updateState({selectedPayment: paramsData?.selectedMethod});
      }
      // alert('run')
      if (!checkCartItem?.data?.item_count) {
        updateState({isLoadingB: true});
      }
      getCartDetail();
      getAllWishListData();
      // if (!!checkCartItem?.data) {
      //   getCartDetail();
      // } else {
      //   getAllWishListData();
      // }
      return () => {
        // alert('blur')
      };
    }, [
      currencies,
      languages,
      route?.params?.promocodeDetail,
      allAddresss,
      selectedAddress,
      paramsData,
      isRefreshing,
      checkCartItem?.data?.item_count,
    ]),
  );

  useEffect(() => {
    if (!!checkCartItem?.data) {
      checkforAddressUpdate();
    }
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
            actions.saveAllUserAddress(res.data);
          }
        })
        .catch(errorMethod);
    }
  };

  //get the entire cart detail
  const getCartDetail = () => {
    // alert("cart detail hit")
    actions
      .getCartDetail(
        `/?type=${dineInType}${
          paramsData?.data?.queryURL ? `&${paramsData?.data?.queryURL}` : '' //for webPayment method- Mobbex,
        }`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
          timezone: RNLocalize.getTimeZone(),
          device_token: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty(res);
        console.log(res.data, 'cart details>>>', cartItems);
        let checkDate = !!res?.data?.scheduled_date_time;

        if (!!checkDate && res.data.schedule_type == 'schedule') {
          let formatDate = new Date(res?.data?.scheduled_date_time);
          updateState({
            localeSheduledOrderDate: timeInLocalLangauge(
              formatDate,
              selectedLanguage,
            ),
          });
        } else {
          updateState({
            scheduleType: 'now',
            localeSheduledOrderDate: null,
          });
        }

        //schedule date for pickup and  dropoff
        let checkDateDropOFf = !!res?.data?.schedule_dropoff;
        let checkDatePickUp = !!res?.data?.schedule_pickup;

        if (!!checkDatePickUp) {
          let formatDate2 = new Date(res?.data?.schedule_pickup);
          updateState({
            localePickupDate: timeInLocalLangauge(
              formatDate2,
              selectedLanguage,
            ),
          });
        }

        if (!!checkDateDropOFf) {
          let formatDate3 = new Date(res?.data?.schedule_dropoff);
          updateState({
            localeDropOffDate: timeInLocalLangauge(
              formatDate3,
              selectedLanguage,
            ),
          });
        }

        updateState({
          isRefreshing: false,
          isLoadingB: false,
          pickupDriverComment: res?.data?.comment_for_pickup_driver
            ? res?.data?.comment_for_pickup_driver
            : pickupDriverComment,
          dropOffDriverComment: res?.data?.comment_for_dropoff_driver
            ? res?.data?.comment_for_dropoff_driver
            : dropOffDriverComment,
          vendorComment: res?.data?.comment_for_vendor
            ? res?.data?.comment_for_vendor
            : vendorComment,
          sheduledorderdate: res?.data?.scheduled_date_time,
          sheduleddropoffdate: res?.data?.schedule_dropoff,
          sheduledpickupdate: res?.data?.schedule_pickup,
          scheduleType: res?.data?.schedule_type,
          selectedTimeOption:
            res?.data?.schedule_type == 'now'
              ? {id: 1, title: strings.NOW, type: 'now'}
              : res?.data?.schedule_type == 'schedule'
              ? {id: 2, title: strings.SCHEDULE_ORDER, type: 'schedule'}
              : {id: 1, title: strings.NOW, type: 'now'},
        });
        if (res && res.data) {
          if (
            !!res.data.vendor_details.vendor_tables &&
            res.data.vendor_details.vendor_tables.length > 0
          ) {
            res.data.vendor_details.vendor_tables.forEach(
              (item, indx) =>
                (tableData[indx] = {
                  id: item.id,
                  label: `${strings.CATEGORY}: ${
                    item.category.title ? item.category.title : ''
                  } | ${strings.TABLE}: ${
                    item.table_number ? item.table_number : 0
                  } | ${strings.SEAT_CAPACITY}: ${
                    item.seating_number ? item.seating_number : 0
                  }`,
                  value: `${strings.CATEGORY}: ${
                    item.category.title ? item.category.title : ''
                  } | ${strings.TABLE}: ${
                    item.table_number ? item.table_number : 0
                  } | ${strings.SEAT_CAPACITY}: ${
                    item.seating_number ? item.seating_number : 0
                  }`,
                  title: item.category.title,
                  table_number: item.table_number,
                  seating_number: item.seating_number,
                  vendor_id: res.data.vendor_details.vendor_address.id,
                }),
              updateState({
                tableData: tableData,
              }),
            );
            const data = {
              vendor_id: tableData[0].vendor_id,
              table: tableData[0].id,
            };
            _vendorTableCart(data, tableData[0]);
          }
          updateState({
            cartItems: res.data.products,
            vendorAddress: res.data.address,
            cartData: res.data,
            isLoadingB: false,
            isRefreshing: false,
            selectedTipvalue:
              res?.data?.total_payable_amount == 0 ? 'custom' : null,
          });
          if (!res?.data?.schedule_type) {
            //if schedule type is null then hit the api again with now option
            setDateAndTimeSchedule();
          }
        } else {
          updateState({
            cartData: {},
            cartItems: [],
            vendorAddress: '',
            isLoadingB: false,
            isRefreshing: false,
          });
        }
      })
      .catch(errorMethod);

    getItem('selectedTable')
      .then((res) => {
        updateState({
          defaultSelectedTable: res,
        });
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
      let data = {};
      data['cart_id'] = itemToUpdate?.cart_id;
      data['quantity'] = quanitity;
      data['cart_product_id'] = itemToUpdate?.id;
      data['type'] = dineInType;
      updateState({btnLoader: true, btnLoadrId: item?.id});
      actions
        .increaseDecreaseItemQty(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          console.log('cart detail', res);
          actions.cartItemQty(res);
          updateState({
            cartItems: res.data.products,
            cartData: res.data,
            btnLoader: false,
          });
        })
        .catch(errorMethod);
    } else {
      updateState({btnLoader: true});
      removeItem('selectedTable');
      removeProductFromCart(itemToUpdate);
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (item) => {
    let data = {};
    data['cart_id'] = item?.cart_id;
    data['cart_product_id'] = item?.id;
    data['type'] = dineInType;
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
          btnLoader: false,
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
    removeItem('selectedTable');
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
        getAllWishListData();
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, '<==errorOccured');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      btnLoader: false,
      placeLoader: false,
    });
    showError(error?.description || error?.message || error?.error || error);
  };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS, {
      vendor: vendor,
      cartId: cartData.id,
    })();
  };

  useEffect(() => {
    if (paramsData?.transactionId && !!checkCartItem?.data) {
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

  const checkPaymentOptions = (res) => {
    updateState({placeLoader: false});
    let paymentId = res?.data?.payment_option_id;
    let paymentData = {
      selectedPayment: selectedPayment,
      total_payable_amount: (
        Number(cartData?.total_payable_amount) +
        (selectedTipAmount != null && selectedTipAmount != ''
          ? Number(selectedTipAmount)
          : 0)
      ).toFixed(2),
      payment_option_id: selectedPayment?.id,
      orderDetail: res.data,
      redirectFrom: 'cart',
    };

    if (
      !!paymentId &&
      !!(
        Number(cartData?.total_payable_amount) + Number(selectedTipAmount) ===
        0
      )
    ) {
      moveToNewScreen(navigationStrings.ORDERSUCESS, {
        orderDetail: res.data,
      })();
      return;
    }

    switch (paymentId) {
      case 6: //Payfast Payment Getway
        navigation.navigate(navigationStrings.PAYFAST, paymentData);
        break;
      case 7: //Mobbex Payment Getway
        navigation.navigate(navigationStrings.MOBBEX, paymentData);
        break;
      case 8: //Yoco Payment Getway
        navigation.navigate(navigationStrings.YOCO, paymentData);
        break;
      case 9: //Pyalink Payment Getway
        navigation.navigate(navigationStrings.PAYLINK, paymentData);
        break;
      case 12: //Simplify Payment Getway
        navigation.navigate(navigationStrings.SIMPLIFY, paymentData);
        break;
      case 13: //Square Payment Getway
        navigation.navigate(navigationStrings.SQUARE, paymentData);
        break;
      default:
        if (
          !!businessType &&
          businessType == 'home_service' &&
          res?.data?.vendors.length == 1
        ) {
          setTimeout(() => {
            _getOrderDetail(res.data.vendors[0]);
          }, 1500);
        } else {
          moveToNewScreen(navigationStrings.ORDERSUCESS, {
            orderDetail: res.data,
          })();
        }
        break;
    }
  };

  const _directOrderPlace = () => {
    let data = {};
    data['address_id'] =
      paramsData?.selectedAddressData?.id || selectedAddressData?.id;
    data['payment_option_id'] =
      paramsData?.selectedPayment?.id || selectedPayment?.id;

    data['type'] = dineInType || '';
    data['is_gift'] = isGiftBoxSelected ? 1 : 0;

    if (paramsData?.transactionId) {
      data['transaction_id'] = paramsData?.transactionId;
    }
    placeOrderData(data);
  };

  const placeOrderData = (data) => {
    actions
      .placeOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        latitude: location?.latitude.toString() || '',
        longitude: location?.longitude.toString() || '',
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
          placeLoader: false,
          pickupDriverComment: null,
          dropOffDriverComment: null,
          vendorComment: null,
          localePickupDate: null,
          localeDropOffDate: null,
          modalType: null,
          sheduledpickupdate: null,
          sheduleddropoffdate: null,
        });
        actions.cartItemQty({});
        checkPaymentOptions(res);
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const _getOrderDetail = ({order_id, vendor_id}) => {
    // return;
    let data = {};
    data['order_id'] = order_id;
    data['vendor_id'] = vendor_id;
    // updateState({ isLoading: true });
    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        timezone: RNLocalize.getTimeZone(),
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res===> order detail');
        actions.cartItemQty({});
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
          placeLoader: false,
        });
        if (res?.data) {
          if (
            !!businessType &&
            businessType == 'home_service' &&
            res?.data?.vendors.length == 1 &&
            res?.data?.vendors[0]?.dispatch_traking_url
          ) {
            navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
              orderId: order_id,
              fromVendorApp: true,
              selectedVendor: {id: vendor_id},
              orderDetail: res.data.vendors[0],
              showRating:
                res.data.vendors[0]?.order_status?.current_status?.id != 6
                  ? false
                  : true,
            });
          } else {
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res.data,
            })();
          }
        }
      })
      .catch(errorMethod);
  };

  const setDateAndTimeSchedule = (toHitApiForPlaceOrder) => {
    if (!userData?.auth_token) {
      return;
    }

    let data = {};

    if (businessType == 'laundry' && toHitApiForPlaceOrder) {
      data['comment_for_pickup_driver'] = pickupDriverComment;
      data['comment_for_dropoff_driver'] = dropOffDriverComment;
      data['comment_for_vendor'] = vendorComment;
      data['schedule_pickup'] = sheduledpickupdate
        ? new Date(sheduledpickupdate).toISOString()
        : null;
      data['schedule_dropoff'] = sheduleddropoffdate
        ? new Date(sheduleddropoffdate).toISOString()
        : null;
    } else {
      data['task_type'] = scheduleType;
      data['schedule_dt'] =
        scheduleType != 'now' && sheduledorderdate
          ? new Date(sheduledorderdate).toISOString()
          : null;
      data['comment_for_vendor'] = instruction;
    }

    console.log(data, 'setDateAndTimeSchedule>>>DATA');
    // updateState({isLoading: false});
    actions
      .scheduledOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res>>>');
        if (res && res?.status == 'Success') {
          if (toHitApiForPlaceOrder && businessType == 'laundry') {
            _finalPayment();
          }
          updateState({
            isLoadingB: toHitApiForPlaceOrder ? true : false,
          });
        } else {
          updateState({
            isLoadingB: false,
          });
        }
        // getCartDetail();
      });
    //   .catch(errorMethod);
  };

  const _finalPayment = () => {
    if (selectedPayment?.id == 4 && selectedPayment?.off_site == 0) {
      _offineLinePayment();
      return;
    }
    if (selectedPayment?.id == 10 && selectedPayment?.off_site == 0) {
      _renderRazor();
      return;
    }
    if (
      selectedPayment?.id === 3 &&
      selectedPayment?.off_site === 1 &&
      !!(
        Number(cartData?.total_payable_amount) + Number(selectedTipAmount) !==
        0
      )
    ) {
      _webPayment();
      return;
    } else {
      _directOrderPlace();
    }

    // !!(Number(cartData?.total_payable_amount) !== 0) ||
    //   Number(selectedTipAmount) !== 0) {
    //   _webPayment()
    // }

    // else if (selectedPayment?.off_site == 1 && selectedPayment?.id === 3) {
    //   _webPayment();
    //   return;
    // } else if (
    //   selectedPayment?.off_site == 1 &&
    //   !!(
    //     selectedPayment?.id === 6 ||
    //     selectedPayment?.id === 7 ||
    //     selectedPayment?.id === 8 ||
    //     selectedPayment?.id === 9
    //   )
    // ) {
    //   _directOrderPlace();
    //   return;
    // }
    // _offineLinePayment();
  };

  //Clear cart
  const placeOrder = () => {
    if (!!cartData?.delay_date && !localeSheduledOrderDate) {
      showInfo(strings.SCHEDULE_DATE_REQUIRED);
      return;
    }
    if (isEmpty(selectedPayment)) {
      showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
      return;
    }

    updateState({placeLoader: true});
    var d1 = new Date();
    var d2 = new Date(sheduledorderdate);
    if (!!userData?.auth_token) {
      if (!selectedAddressData) {
        // showError(strings.PLEASE_SELECT_ADDRESS);
        setModalVisible(true);
      } else if (!selectedPayment) {
        errorMethod(strings.PLEASE_SELECT_PAYMENT_METHOD);
      } else if (scheduleType == 'schedule' && d1.getTime() >= d2.getTime()) {
        errorMethod(strings.INVALID_SCHEDULED_DATE);
      } else {
        if (!!userData) {
          if (!!userData) {
            if (
              !!userData?.client_preference?.verify_email &&
              !!userData?.client_preference?.verify_phone
            ) {
              updateState({placeLoader: false});

              if (
                !!userData?.verify_details?.is_email_verified &&
                !!userData?.verify_details?.is_phone_verified
              ) {
                setDateAndTimeSchedule(true);
                setTimeout(() => {
                  _finalPayment();
                }, 500);
              } else {
                moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
                  formCart: true,
                })();
              }
            } else if (
              !!userData?.client_preference?.verify_email ||
              !!userData?.client_preference?.verify_phone
            ) {
              if (
                !!userData?.verify_details?.is_email_verified ||
                !!userData?.verify_details?.is_phone_verified
              ) {
                setDateAndTimeSchedule(true);
                setTimeout(() => {
                  _finalPayment();
                }, 500);
              } else {
                updateState({placeLoader: false});

                moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
                  formCart: true,
                })();
              }
            } else {
              setDateAndTimeSchedule(true);
              setTimeout(() => {
                _finalPayment();
              }, 500);
            }
          }
          // !!userData?.client_preference?.verify_email ||
          // !!userData?.client_preference?.verify_phone
          //   ? !!userData?.verify_details?.is_email_verified &&
          //     !!userData?.verify_details?.is_phone_verified
          //     ? _finalPayment()
          //     : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
          //         formCart: true,
          //       })()
          //   : _finalPayment();
        } else {
          _finalPayment();
        }
        // _finalPayment()
      }
    } else {
      // showError(strings.UNAUTHORIZED_MESSAGE);
      updateState({placeLoader: false});
      moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
    }
  };

  useEffect(() => {
    if (paramsData?.redirectFrom && !!checkCartItem?.data) {
      _directOrderPlace();
    }
  }, [paramsData?.redirectFrom]);

  const swipeRef = useRef(null);

  const openDeleteView = async (item) => {
    let itemToUpdate = cloneDeep(item);
    removeItem('selectedTable');
    removeProductFromCart(itemToUpdate);
    // updateState({ isLoadingB: true });
    // if (!!swipeRef && swipeRef?.current) {
    //     swipeRef?.current.openRight()
    // }
  };

  const swipeBtns = (progress, dragX) => {
    return (
      <Animated.View
        key={String(cartItems.length)}
        style={{
          ...styles.swipeView,
        }}>
        <Image source={imagePath.deleteRed} />
      </Animated.View>
    );
  };

  const _webPayment = () => {
    let selectedMethod = selectedPayment.code.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;

    let queryData = `/${selectedMethod}?tip=${
      selectedTipAmount && selectedTipAmount != ''
        ? Number(selectedTipAmount)
        : 0
    }&amount=${(
      Number(cartData?.total_payable_amount) +
      (selectedTipAmount != null && selectedTipAmount != ''
        ? Number(selectedTipAmount)
        : 0)
    ).toFixed(2)}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&address_id=${
      selectedAddressData?.id
    }&payment_option_id=${selectedPayment?.id}&action=cart`;

    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'response===>');
        updateState({
          isLoadingB: false,
          isRefreshing: false,
          placeLoader: false,
          pickupDriverComment: null,
          dropOffDriverComment: null,
          vendorComment: null,
          localePickupDate: null,
          localeDropOffDate: null,
          modalType: null,
          sheduledpickupdate: null,
          sheduleddropoffdate: null,
        });
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
      let selectedMethod = selectedPayment.code.toLowerCase();
      actions
        .openPaymentWebUrl(
          `/${selectedMethod}?tip=${
            selectedTipAmount && selectedTipAmount != ''
              ? Number(selectedTipAmount)
              : 0
          }&amount=${
            cartData?.total_payable_amount == 0
              ? selectedTipAmount
              : cartData?.total_payable_amount
          }&auth_token=${userData?.auth_token}&address_id=${
            selectedAddressData?.id
          }&payment_option_id=${selectedPayment?.id}&action=cart&stripe_token=${
            paramsData?.tokenInfo
          }`,
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
              placeLoader: false,
              pickupDriverComment: null,
              dropOffDriverComment: null,
              vendorComment: null,
              localePickupDate: null,
              localeDropOffDate: null,
              modalType: null,
              sheduledpickupdate: null,
              sheduleddropoffdate: null,
              selectedPayment: {
                id: 1,
                off_site: 0,
                title: 'Cash On Delivery',
                title_lng: strings.CASH_ON_DELIVERY,
              },
            });
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res.data,
            })();
            showSuccess(res?.message);
          } else {
            updateState({
              isLoadingB: false,
              placeLoader: false,
              selectedPayment: {
                id: 1,
                off_site: 0,
                title: 'Cash On Delivery',
                title_lng: strings.CASH_ON_DELIVERY,
              },
            });
          }
        })
        .catch((err) => console.log(err, 'errorInPlaceOrder'));
    } else {
      errorMethod(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
    }
  };

  const _renderRazor = () => {
    updateState({isLoadingB: true});
    let options = {
      description: 'Credits towards consultation',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: appData?.profile?.preferences?.razorpay_api_key, // Your api key
      amount:
        (Number(cartData?.total_payable_amount) +
          (selectedTipAmount != null && selectedTipAmount != ''
            ? Number(selectedTipAmount)
            : 0)) *
        100,
      name: appData?.profile?.company_name,
      prefill: {
        email: userData?.email,
        contact: userData?.phone_number || '',
        name: userData?.name,
      },
      theme: {color: themeColors.primary_color},
    };

    RazorpayCheckout.open(options)
      .then((res) => {
        console.log(`Success for razor: `, res);
        if (res?.razorpay_payment_id) {
          let data = {};
          data['address_id'] = selectedAddressData?.id;
          data['payment_option_id'] = selectedPayment?.id;
          data['type'] = dineInType || '';
          data['transaction_id'] = res?.razorpay_payment_id;
          placeOrderData(data); // placeOrder
        }
      })
      .catch(errorMethod);
  };

  const clearSceduleDate = async () => {
    updateState({
      scheduleType: 'now',
      localeSheduledOrderDate: null,
      sheduledorderdate: null,
    });
  };

  useEffect(() => {
    if (
      scheduleType != null &&
      scheduleType == 'now' &&
      !!checkCartItem?.data
    ) {
      setDateAndTimeSchedule();
    }
  }, [scheduleType]);

  const _selectTime = (item) => {
    updateState({
      modalType: 'schedule',
      isVisibleTimeModal: true,
    });
  };
  //Select Time Laundry
  const _selectTimeLaundry = (item) => {
    if (item == 'dropoff') {
      updateState({
        modalType: 'dropoff',
        // scheduleType: 'dropoff',
        isVisibleTimeModal: true,
      });
    } else {
      updateState({
        modalType: 'pickup',
        // scheduleType: 'pickup',
        isVisibleTimeModal: true,
      });
    }
  };

  const selectOrderDate = () => {
    onClose();

    if (modalType != 'schedule' && businessType != 'laundry') {
      updateState({
        scheduleType: 'schedule',
      });
    }

    setDateAndTimeSchedule();
  };

  function makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const deleteItem = async (i, index) => {
    updateState({swipeKey: makeid(5)});
    openDeleteView(i);
    swipeRef.current.close();
    // return;

    // Animated.timing(height, {
    //   toValue: 0,
    //   duration: 350,
    //   useNativeDriver: false,
    // }).start(() => openDeleteView(i));
  };

  const getAllWishListData = () => {
    if (!!userData?.auth_token) {
      getAllWishlistItems();
      return;
    }
    updateState({isRefreshing: false, wishlistArray: []});
    return;
  };
  /*  GET ALL WISHLISTED ITEMS API FUNCTION  */
  const getAllWishlistItems = () => {
    // updateState({ isLoadingB: true });
    actions
      .getWishlistProducts(
        `?limit=${10}&page=${1}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          isLoadingB: false,
          wishlistArray: res.data.data,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  const _renderItem = ({item, index}) => {
    return (
      <View>
        {index === 0 && (
          <View style={Platform.OS === 'ios' ? {zIndex: 5000} : {}}>
            {dineInType === 'dine_in' &&
              userData?.auth_token &&
              !!cartData?.vendor_details?.vendor_tables &&
              cartData?.vendor_details?.vendor_tables.length > 0 && (
                <DropDownPicker
                  items={tableData}
                  onOpen={() => updateState({isTableDropDown: true})}
                  onClose={() => updateState({isTableDropDown: false})}
                  defaultValue={
                    deepLinkUrl
                      ? deepLinkUrl == 1
                        ? tableData[0]?.label
                        : tableData[1]?.label
                      : tableData[0]?.label || ''
                  }
                  containerStyle={styles.dropDownContainerStyle}
                  style={{
                    marginHorizontal: moderateScale(20),
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  labelStyle={
                    isDarkMode
                      ? {color: MyDarkTheme.colors.text}
                      : {color: colors.textGrey}
                  }
                  itemStyle={{
                    justifyContent: 'flex-start',
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                  }}
                  dropDownStyle={{
                    ...styles.dropDownStyle,
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  onChangeItem={(item) => _onTableSelection(item)}
                />
              )}
          </View>
        )}
        <View
          key={swipeKey}
          style={{
            ...styles.mainViewRednderItem,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View
            style={{
              ...styles.vendorView,
              paddingHorizontal: moderateScale(8),
              flexDirection: 'column',
            }}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {item?.vendor?.name}
            </Text>
            {item?.is_vendor_closed && (
              <Text
                numberOfLines={1}
                style={{
                  ...styles.priceItemLabel2,
                  color: colors.redB,
                  fontSize: textScale(9),
                }}>
                {strings.VENDOR_NOT_ACCEPTING_ORDERS}
              </Text>
            )}
          </View>
          {/************ start  render cart items *************/}
          {item?.vendor_products.length > 0
            ? item?.vendor_products.map((i, inx) => {
                return (
                  <Swipeable
                    ref={swipeRef}
                    key={swipeKey}
                    renderRightActions={swipeBtns}
                    onSwipeableOpen={() => deleteItem(i, index)}
                    rightThreshold={width / 1.4}
                    // overshootFriction={8}
                  >
                    <Animated.View
                      style={{
                        backgroundColor: isDarkMode
                          ? MyDarkTheme.colors.lightDark
                          : colors.transactionHistoryBg,
                        marginBottom: moderateScaleVertical(12),
                        marginRight: moderateScale(8),
                        borderRadius: moderateScale(10),
                        transform: [],
                        minHeight: height * 0.125,
                      }}
                      key={inx}>
                      <View style={[styles.cartItemMainContainer]}>
                        <View
                          style={[
                            styles.cartItemImage,
                            {
                              backgroundColor: isDarkMode
                                ? MyDarkTheme.colors.lightDark
                                : colors.white,
                            },
                          ]}>
                          <FastImage
                            source={
                              i?.cartImg != '' && i?.cartImg != null
                                ? {
                                    uri: getImageUrl(
                                      i?.cartImg?.path?.proxy_url,
                                      i?.cartImg?.path?.image_path,
                                      '300/300',
                                    ),
                                    priority: FastImage.priority.high,
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
                            <View style={{flex: 1}}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  flex: 1,
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
                                    flex: 0.7,
                                  }}>
                                  {i?.product?.translation[0]?.title},
                                </Text>

                                <View
                                  pointerEvents={btnLoader ? 'none' : 'auto'}
                                  style={{flex: 0.3}}>
                                  <View
                                    style={{
                                      ...styles.incDecBtnContainer,
                                      justifyContent: 'space-between',
                                    }}>
                                    <TouchableOpacity
                                      style={{alignItems: 'center'}}
                                      onPress={() =>
                                        addDeleteCartItems(i, inx, 1)
                                      }>
                                      <Text style={styles.cartItemValueBtn}>
                                        +
                                      </Text>
                                    </TouchableOpacity>
                                    <View
                                      style={{
                                        alignItems: 'center',
                                        width: moderateScale(20),
                                        height: moderateScale(20),
                                        justifyContent: 'center',
                                      }}>
                                      {btnLoadrId === i.id && btnLoader ? (
                                        <UIActivityIndicator
                                          size={moderateScale(16)}
                                          color={colors.white}
                                        />
                                      ) : (
                                        <Text style={styles.cartItemValue}>
                                          {i?.quantity}
                                        </Text>
                                      )}
                                    </View>
                                    <TouchableOpacity
                                      style={{alignItems: 'center'}}
                                      onPress={() =>
                                        addDeleteCartItems(i, inx, 2)
                                      }>
                                      <Text style={styles.cartItemValueBtn}>
                                        -
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                              <Text
                                style={{
                                  ...styles.priceItemLabel2,
                                  fontSize: textScale(12),
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : '#B3B3B3',
                                  marginTop: moderateScaleVertical(4),
                                  fontFamily: fontFamily.regular,
                                }}>
                                <Text style={{}}>
                                  {`${currencies?.primary_currency?.symbol}${
                                    // Number(i?.pvariant?.multiplier) *
                                    currencyNumberFormatter(
                                      Number(i?.variants?.price).toFixed(2),
                                    )
                                  }`}
                                </Text>{' '}
                                X {i?.quantity} ={' '}
                                <Text
                                  style={{
                                    color: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : colors.black,
                                  }}>
                                  {`${currencies?.primary_currency?.symbol}${
                                    // Number(i?.pvariant?.multiplier) *
                                    currencyNumberFormatter(
                                      Number(
                                        i?.variants?.quantity_price,
                                      ).toFixed(2),
                                    )
                                  }`}
                                </Text>
                              </Text>

                              {i?.variant_options.length > 0
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
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'center',
                              }}>
                              {!!i?.product_addons.length > 0 && (
                                <View>
                                  <Text
                                    style={{
                                      ...styles.cartItemWeight2,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGreyB,
                                      marginTop: moderateScale(2),
                                    }}>
                                    {strings.EXTRA}
                                  </Text>
                                </View>
                              )}
                              <View>
                                {i?.product_addons.length > 0
                                  ? i?.product_addons.map((j, jnx) => {
                                      return (
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                          }}>
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              width: '52%',
                                              justifyContent: 'space-between',
                                            }}>
                                            <View
                                              style={{
                                                flexDirection: 'row',
                                                flex: 0.8,
                                              }}>
                                              <Text
                                                style={
                                                  isDarkMode
                                                    ? [
                                                        styles.cartItemWeight2,
                                                        {
                                                          color:
                                                            MyDarkTheme.colors
                                                              .text,
                                                        },
                                                      ]
                                                    : styles.cartItemWeight2
                                                }
                                                numberOfLines={1}>
                                                {j.addon_title}
                                              </Text>
                                              <Text
                                                style={
                                                  {
                                                    ...styles.cartItemWeight2,
                                                    color: isDarkMode
                                                      ? MyDarkTheme.colors.text
                                                      : colors.textGreyB,
                                                  }

                                                  // colors.textGreyB
                                                }
                                                numberOfLines={1}>
                                                {` (${j.option_title})`}
                                              </Text>
                                            </View>
                                            <Text>:</Text>
                                          </View>

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
                                                : [
                                                    styles.cartItemWeight2,
                                                    {color: colors.textGrey},
                                                  ]
                                            }
                                            numberOfLines={1}>{` ${
                                            currencies?.primary_currency?.symbol
                                          }${currencyNumberFormatter(
                                            (
                                              Number(j.price) *
                                              Number(j.multiplier)
                                            ).toFixed(2),
                                          )} x ${Number(j.quantity)} =  ${
                                            currencies?.primary_currency?.symbol
                                          }${currencyNumberFormatter(
                                            (
                                              Number(j.price) *
                                              Number(j.quantity)
                                            ).toFixed(2),
                                          )}`}</Text>
                                        </View>
                                      );
                                    })
                                  : null}
                              </View>
                            </View>
                          </View>

                          <TouchableOpacity
                            style={{
                              alignSelf: 'flex-end',
                              marginRight: moderateScale(14),
                              marginTop: moderateScale(6),
                            }}
                            onPress={() => openDeleteView(i)}>
                            <Image source={imagePath.deleteRed} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {!!cartData?.delay_date && (
                        <Text
                          style={{
                            fontSize: moderateScale(12),
                            fontFamily: fontFamily.medium,
                            color: colors.redFireBrick,
                            marginBottom: moderateScale(3),
                          }}>{`${
                          i?.product.delay_order_hrs > 0 ||
                          i?.product.delay_order_min > 0
                            ? strings.PREPARATION_TIME_IS
                            : ''
                        }${
                          i?.product.delay_order_hrs > 0
                            ? ` ${i?.product.delay_order_hrs} hrs`
                            : ''
                        }${
                          i?.product.delay_order_min > 0
                            ? ` ${i?.product.delay_order_min} mins`
                            : ''
                        }`}</Text>
                      )}

                      {/* <View style={styles.dashedLine} /> */}
                    </Animated.View>
                  </Swipeable>
                );
              })
            : null}
          {/************ end render cart items *************/}
          {item?.isDeliverable ? null : (
            <View style={{marginHorizontal: moderateScale(10)}}>
              <Text
                style={{
                  fontSize: moderateScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.redFireBrick,
                }}>
                {strings.ITEM_NOT_DELIVERABLE}
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
                  style={{
                    flex: 0.7,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{tintColor: themeColors.primary_color}}
                    source={imagePath.percent}
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.viewOffers,
                      {marginLeft: moderateScale(10)},
                    ]}>
                    {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
                  </Text>
                </View>
                <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                  {/* <Image source={imagePath.crossBlueB}  /> */}
                  <Text
                    onPress={() => _removeCoupon(item, cartData)}
                    style={[
                      styles.removeCoupon,
                      {color: colors.cartItemPrice},
                    ]}>
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
          {/* start amount view       */}
          <View
            style={{
              marginHorizontal: moderateScale(4),
              marginTop: moderateScaleVertical(8),
            }}>
            {!!item?.discount_amount && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }>
                  {strings.COUPON_DISCOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.priceItemLabel
                  }>{`- ${
                  currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(
                    item?.discount_amount ? item?.discount_amount : 0,
                  ).toFixed(2),
                )}`}</Text>
              </View>
            )}
            {!!item?.deliver_charge && (
              <View style={styles.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {
                            color: MyDarkTheme.colors.text,
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
                          },
                        ]
                      : styles.priceItemLabel
                  }>{`${
                  currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(
                    item?.deliver_charge ? item?.deliver_charge : 0,
                  ).toFixed(2),
                )}`}</Text>
              </View>
            )}
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.AMOUNT}
              </Text>

              <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel2,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                    : styles.priceItemLabel2
                }>
                {currencies?.primary_currency?.symbol}
                {currencyNumberFormatter(
                  Number(
                    item?.payable_amount ? item?.payable_amount : 0,
                  ).toFixed(2),
                )}
              </Text>

              {/* <NumberFormat
                thousandsGroupStyle="thousand"
                value={2456981}
                prefix="$"
                decimalSeparator="."
                displayType="input"
                type="text"
                thousandSeparator={true}
                allowNegative={true}
              /> */}
              {/* <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel2,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                    : styles.priceItemLabel2
                }>{`${currencies?.primary_currency?.symbol}${Number(
                item?.payable_amount ? item?.payable_amount : 0,
              ).toFixed(2)}`}</Text> */}
            </View>
            {/* <View style={styles.bottomTabLableValue}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.SUBTOTAL}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>{`${currencies?.primary_currency?.symbol}${Number(
                cartData?.gross_paybale_amount,
              ).toFixed(2)}`}</Text>
            </View>
            {!!cartData?.wallet_amount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
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
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                  cartData?.wallet_amount ? cartData?.wallet_amount : 0,
                ).toFixed(2)}`}</Text>
              </View>
            )}
            {!!cartData?.loyalty_amount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
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
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                  cartData?.loyalty_amount ? cartData?.loyalty_amount : 0,
                ).toFixed(2)}`}</Text>
              </View>
            )}

            {!!cartData?.wallet_amount_used && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
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
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                  cartData?.wallet_amount_used
                    ? cartData?.wallet_amount_used
                    : 0,
                ).toFixed(2)}`}</Text>
              </View>
            )}
            {!!cartData?.total_subscription_discount && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>
                  {strings.TOTALSUBSCRIPTION}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`-${currencies?.primary_currency?.symbol}${Number(
                  cartData?.total_subscription_discount,
                ).toFixed(2)}`}</Text>
              </View>
            )} */}

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

            {/* {!!appData?.profile?.preferences?.tip_before_order &&
              !!cartData?.tip &&
              cartData?.tip.length && (
                <View
                  style={[
                    styles.bottomTabLableValue,
                    {
                      flexDirection: 'column',
                      marginTop: moderateScaleVertical(8),
                    },
                  ]}>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.priceTipLabel,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : [styles.priceTipLabel]
                    }>
                    {strings.DOYOUWANTTOGIVEATIP}
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{flexGrow: 1}}>
                    {cartData?.total_payable_amount !== 0 &&
                      cartData?.tip.map((j, jnx) => {
                        return (
                          <TouchableOpacity
                            key={String(jnx)}
                            style={[
                              styles.tipArrayStyle,
                              {
                                backgroundColor:
                                  selectedTipvalue?.value == j?.value
                                    ? themeColors.primary_color
                                    : 'transparent',
                                flex: 0.18,
                              },
                            ]}
                            onPress={() => selectedTip(j)}>
                            <Text
                              style={
                                isDarkMode
                                  ? {
                                      color:
                                        selectedTipvalue?.value == j?.value
                                          ? colors.white
                                          : MyDarkTheme.colors.text,
                                    }
                                  : {
                                      color:
                                        selectedTipvalue?.value == j?.value
                                          ? colors.white
                                          : colors.black,
                                    }
                              }>
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
                          flex:
                            cartData?.total_payable_amount !== 0 ? 0.45 : 0.2,
                        },
                      ]}
                      onPress={() => selectedTip('custom')}>
                      <Text
                        style={
                          isDarkMode
                            ? {
                                color:
                                  selectedTipvalue == 'custom'
                                    ? colors.white
                                    : MyDarkTheme.colors.text,
                              }
                            : {
                                color:
                                  selectedTipvalue == 'custom'
                                    ? colors.white
                                    : colors.black,
                              }
                        }>
                        {strings.CUSTOM}
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
                        marginTop: moderateScaleVertical(8),
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
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGreyOpcaity7,
                        }}
                        maxLength={5}
                        returnKeyType={'done'}
                        keyboardType={'number-pad'}
                        placeholder={strings.ENTER_CUSTOM_AMOUNT}
                        placeholderTextColor={
                          isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGreyOpcaity7
                        }
                      />
                    </View>
                  )}
                </View>
              )} */}

            {/* {!!cartData?.total_tax && (
              <View style={styles.bottomTabLableValue}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.priceItemLabel,
                          {color: MyDarkTheme.colors.text},
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
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.priceItemLabel
                  }>{`${currencies?.primary_currency?.symbol}${Number(
                  cartData?.total_tax ? cartData?.total_tax : 0,
                ).toFixed(2)}`}</Text>
              </View>
            )}

            <View style={styles.amountPayable}>
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.AMOUNT_PAYABLE}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel2, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel2
                }>{`${currencies?.primary_currency?.symbol}${(
                Number(cartData?.total_payable_amount) +
                (selectedTipAmount != null && selectedTipAmount != ''
                  ? Number(selectedTipAmount)
                  : 0)
              ).toFixed(2)}`}</Text>
            </View> */}
          </View>
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

  const _onGiftBoxSelection = () => {
    updateState({isGiftBoxSelected: !isGiftBoxSelected});
  };

  //get footer start
  const getFooter = () => {
    return (
      <View style={{}}>
        <TextInput
          value={instruction}
          onChangeText={(instruction) => updateState({instruction})}
          multiline={true}
          numberOfLines={4}
          style={{
            ...styles.instructionView,
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyNew,
          }}
          placeholderTextColor={
            isDarkMode ? colors.textGreyB : colors.textGreyB
          }
          placeholder={strings.SPECIAL_INSTRUCTION}
        />
        {/* <View style={{ height: moderateScaleVertical(20) }} /> */}

        {/* select payment method */}
        {/* <TouchableOpacity
          onPress={() =>
            !!userData?.auth_token
              ? moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS)()
              : navigation.navigate(navigationStrings.OUTER_SCREEN, {})
          }
          style={styles.paymentMainView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
              source={imagePath.paymentMethod}
            />
            <Text
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginLeft: moderateScale(4),
              }}>
              {selectedPayment.title_lng
                ? selectedPayment.title_lng
                : selectedPayment.title
                ? selectedPayment.title
                : strings.SELECT_PAYMENT_METHOD}
            </Text>
          </View>
          <View>
            <Image
              source={imagePath.goRight}
              style={
                isDarkMode
                  ? {
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                      tintColor: MyDarkTheme.colors.text,
                    }
                  : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
              }
            />
          </View>
        </TouchableOpacity> */}

        {/* {payment submit button} */}
        {/* {userData ? (
          <View
            style={{
              flexDirection: 'row',
              marginVertical: moderateScaleVertical(20),
              marginHorizontal: moderateScale(10),
            }}>
            {selectedTimeOptions.map((i, inx) => {
              return (
                <TouchableOpacity
                  onPress={() => _selectTime(i)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor:
                      selectedTimeOption && selectedTimeOption?.id == i.id
                        ? themeColors?.primary_color
                        : getColorCodeWithOpactiyNumber(
                          themeColors.primary_color.substr(1),
                          20,
                        ),
                    borderColor: themeColors.primary_color,
                    borderWidth:
                      selectedTimeOption && selectedTimeOption?.id == i.id
                        ? 1
                        : 0,
                    borderRadius: 10,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.medium,
                      color:
                        selectedTimeOption && selectedTimeOption?.id == i.id
                          ? colors.white
                          : themeColors.primary_color,
                    }}>
                    {i.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <View
              style={{
                justifyContent: 'center',
              }}>
              {selectedTimeOption?.type === 'now' ? null : (
                <Text
                  style={
                    isDarkMode
                      ? { color: MyDarkTheme.colors.text }
                      : { color: colors.black }
                  }>
                  {sheduledorderdate && scheduleType
                    ? `${moment(sheduledorderdate).format('DD MMM,YYYY HH:mm')}`
                    : null}
                </Text>
              )}
            </View>
          </View>
        ) : null} */}

        {/* Laundry Section only */}
        {!!(businessType == 'laundry') && (
          <View style={styles.laundrySection}>
            <View>
              <View style={{flex: 0.5, flexWrap: 'wrap'}}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.LaundryApppriceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.LaundryApppriceItemLabel
                  }>
                  {strings.COMMENTFORPICKUPDRIVER}
                </Text>
              </View>
              <View style={{flex: 0.5, marginTop: moderateScale(5)}}>
                <TextInput
                  value={pickupDriverComment}
                  onChangeText={(text) =>
                    updateState({pickupDriverComment: text})
                  }
                  placeholder={strings.PLACEHOLDERCOMMENTFORPICKUPDRIVER}
                  placeholderTextColor={colors.textGreyOpcaity6}
                  style={{
                    height: 40,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    backgroundColor: colors.white,
                  }}
                  returnKeyType={'done'}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            </View>
            <View style={{marginTop: moderateScale(15)}}>
              <View style={{flex: 0.5, flexWrap: 'wrap'}}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.LaundryApppriceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.LaundryApppriceItemLabel
                  }>
                  {strings.COMMENTFORDROPUPDRIVER}
                </Text>
              </View>
              <View style={{flex: 0.5, marginTop: moderateScale(5)}}>
                <TextInput
                  value={dropOffDriverComment}
                  onChangeText={(text) =>
                    updateState({dropOffDriverComment: text})
                  }
                  placeholderTextColor={colors.textGreyOpcaity6}
                  placeholder={strings.PLACEHOLDERCOMMENTFORDROPUPDRIVER}
                  style={{
                    height: 40,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    backgroundColor: colors.white,
                  }}
                  returnKeyType={'done'}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            </View>
            <View style={{marginTop: moderateScale(15)}}>
              <View style={{flex: 0.5, flexWrap: 'wrap'}}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.LaundryApppriceItemLabel,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.LaundryApppriceItemLabel
                  }>
                  {strings.COMMENTFORVENDOR}
                </Text>
              </View>
              <View style={{flex: 0.5, marginTop: moderateScale(5)}}>
                <TextInput
                  placeholderTextColor={colors.textGreyOpcaity6}
                  placeholder={strings.PLACEHOLDERCOMMENTFORVENDOR}
                  value={vendorComment}
                  onChangeText={(text) => updateState({vendorComment: text})}
                  style={{
                    height: 40,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    backgroundColor: colors.white,
                  }}
                  returnKeyType={'done'}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: moderateScale(20),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => _selectTimeLaundry('pickup')}
                style={{flex: 0.5, flexDirection: 'row'}}>
                <Image source={imagePath.pickUpSchedule} />
                <View>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.LaundryApppriceItemLabel2,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : styles.LaundryApppriceItemLabel2
                    }>
                    {strings.SCEDULEPICKUP}
                  </Text>
                  {localePickupDate && (
                    <Text
                      numberOfLines={2}
                      style={
                        isDarkMode
                          ? [
                              styles.LaundryApppriceItemLabel3,
                              {color: MyDarkTheme.colors.text},
                            ]
                          : styles.LaundryApppriceItemLabel3
                      }>
                      {localePickupDate ? localePickupDate : ''}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => _selectTimeLaundry('dropoff')}
                style={{flex: 0.5, flexDirection: 'row'}}>
                <Image source={imagePath.dropOffSchedule} />
                <View>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.LaundryApppriceItemLabel2,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : styles.LaundryApppriceItemLabel2
                    }>
                    {strings.SCEDULEDROP}
                  </Text>

                  {localeDropOffDate && (
                    <Text
                      numberOfLines={2}
                      style={
                        isDarkMode
                          ? [
                              styles.LaundryApppriceItemLabel3,
                              {color: MyDarkTheme.colors.text},
                            ]
                          : styles.LaundryApppriceItemLabel3
                      }>
                      {localeDropOffDate
                        ? localeDropOffDate
                        : strings.SCEDULEDROP}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* tip_before_order view start */}

        {!!appData?.profile?.preferences?.tip_before_order &&
          !!cartData?.tip &&
          cartData?.tip.length > 0 && (
            <View
              style={[
                styles.bottomTabLableValue,
                {
                  flexDirection: 'column',
                },
              ]}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceTipLabel, {color: MyDarkTheme.colors.text}]
                    : [styles.priceTipLabel]
                }>
                {strings.DOYOUWANTTOGIVEATIP}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}>
                {cartData?.total_payable_amount !== 0 &&
                  cartData?.tip.map((j, jnx) => {
                    return (
                      <TouchableOpacity
                        key={String(jnx)}
                        style={[
                          styles.tipArrayStyle,
                          {
                            backgroundColor:
                              selectedTipvalue?.value == j?.value
                                ? themeColors.primary_color
                                : 'transparent',
                            flex: 0.18,
                          },
                        ]}
                        onPress={() => selectedTip(j)}>
                        <Text
                          style={
                            isDarkMode
                              ? {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : MyDarkTheme.colors.text,
                                }
                              : {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : colors.black,
                                }
                          }>
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

                {cartData?.total_payable_amount !== 0 && (
                  <TouchableOpacity
                    style={[
                      styles.tipArrayStyle2,
                      {
                        backgroundColor:
                          selectedTipvalue == 'custom'
                            ? themeColors.primary_color
                            : 'transparent',
                        flex: cartData?.total_payable_amount !== 0 ? 0.45 : 0.2,
                      },
                    ]}
                    onPress={() => selectedTip('custom')}>
                    <Text
                      style={
                        isDarkMode
                          ? {
                              color:
                                selectedTipvalue == 'custom'
                                  ? colors.white
                                  : MyDarkTheme.colors.text,
                            }
                          : {
                              color:
                                selectedTipvalue == 'custom'
                                  ? colors.white
                                  : colors.black,
                            }
                      }>
                      {strings.CUSTOM}
                    </Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              {!!selectedTipvalue && selectedTipvalue == 'custom' && (
                <View
                  style={{
                    borderRadius: 5,
                    borderWidth: 0.5,
                    borderColor: colors.textGreyB,
                    height: 40,
                    marginTop: moderateScaleVertical(8),
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
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                    }}
                    maxLength={5}
                    returnKeyType={'done'}
                    keyboardType={'number-pad'}
                    placeholder={strings.ENTER_CUSTOM_AMOUNT}
                    placeholderTextColor={
                      isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7
                    }
                  />
                </View>
              )}
            </View>
          )}
        {/* tip_before_order view end */}

        {appData?.profile?.preferences?.gifting == 1 && (
          <View
            style={{
              ...styles.bottomTabLableValue,
              borderBottomWidth: 0.3,
              borderTopWidth: 0.3,
              borderColor: colors.textGreyB,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <CheckBox
              checked={isGiftBoxSelected}
              onPress={_onGiftBoxSelection}
              // value={isGiftBoxSelected}
              // onValueChange={_onGiftBoxSelection}
              size={20}
              checkedColor={themeColors.primary_color}
              // style={{
              //   height: moderateScale(18),
              //   width: moderateScale(18),
              //   marginLeft: moderateScale(10),
              //   color: themeColors.primary_color,
              // }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: moderateScale(-12),
              }}>
              <Image
                source={imagePath.icGiftIcon}
                style={{
                  marginTop: moderateScale(-3),
                  tintColor: colors.blackOpacity43,
                }}
              />
              <Text
                style={{
                  ...styles.priceTipLabel,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                  marginLeft: moderateScale(6),
                }}>
                {strings.DOES_THIS_INCLUDE_GIFT}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                : styles.priceItemLabel
            }>
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                : styles.priceItemLabel
            }>{`${
            currencies?.primary_currency?.symbol
          }${currencyNumberFormatter(
            Number(cartData?.gross_paybale_amount).toFixed(2),
          )}`}</Text>
        </View>
        {!!cartData?.wallet_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              Number(
                cartData?.wallet_amount ? cartData?.wallet_amount : 0,
              ).toFixed(2),
            )}`}</Text>
          </View>
        )}
        {!!cartData?.loyalty_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`-${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              Number(
                cartData?.loyalty_amount ? cartData?.loyalty_amount : 0,
              ).toFixed(2),
            )}`}</Text>
          </View>
        )}

        {!!cartData?.wallet_amount_used && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`-${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              Number(
                cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0,
              ).toFixed(2),
            )}`}</Text>
          </View>
        )}
        {!!cartData?.total_subscription_discount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {strings.TOTALSUBSCRIPTION}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`-${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              Number(cartData?.total_subscription_discount).toFixed(2),
            )}`}</Text>
          </View>
        )}
        {(cartData?.total_tax > 0 || cartData?.total_service_fee > 0) && (
          <Animatable.View
            style={{
              ...styles.bottomTabLableValue,
              marginTop: moderateScale(8),
              marginBottom: moderateScale(2),
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              hitSlop={hitSlopProp}
              onPress={() => updateState({showTaxFeeArea: !showTaxFeeArea})}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    ...styles.priceItemLabel,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  }}>
                  {strings.TAXES_FEES}
                </Text>

                <Image
                  source={imagePath.dropDownNew}
                  style={{
                    transform: [{scaleY: showTaxFeeArea ? -1 : 1}],
                    marginHorizontal: moderateScale(2),
                  }}
                />
              </View>
            </TouchableOpacity>

            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>{`${
              currencies?.primary_currency?.symbol
            }${currencyNumberFormatter(
              (
                Number(cartData?.total_tax ? cartData?.total_tax : 0) +
                Number(
                  cartData?.total_service_fee ? cartData?.total_service_fee : 0,
                )
              ).toFixed(2),
            )}`}</Text>
          </Animatable.View>
        )}
        {showTaxFeeArea && (
          <View>
            <Animatable.View
              animation="fadeIn"
              style={{marginLeft: moderateScale(15)}}>
              {cartData?.total_service_fee > 0 && (
                <View
                  style={{...styles.bottomTabLableValue, marginVertical: 1}}>
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>
                    {strings.TOTAL_SERVICE_FEE}
                  </Text>

                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>{`${
                    currencies?.primary_currency?.symbol
                  }${currencyNumberFormatter(
                    Number(
                      cartData?.total_service_fee
                        ? cartData?.total_service_fee
                        : 0,
                    ).toFixed(2),
                  )}`}</Text>
                </View>
              )}
              {cartData?.total_tax > 0 && (
                <View
                  style={{...styles.bottomTabLableValue, marginVertical: 1}}>
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>
                    {strings.TAX_AMOUNT}
                  </Text>

                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>{`${
                    currencies?.primary_currency?.symbol
                  }${currencyNumberFormatter(
                    Number(
                      cartData?.total_tax ? cartData?.total_tax : 0,
                    ).toFixed(2),
                  )}`}</Text>
                </View>
              )}
            </Animatable.View>
          </View>
        )}

        <View style={styles.amountPayable}>
          <Text
            style={{
              ...styles.priceItemLabel2,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {strings.AMOUNT_PAYABLE}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel2, {color: MyDarkTheme.colors.text}]
                : styles.priceItemLabel2
            }>{`${
            currencies?.primary_currency?.symbol
          }${currencyNumberFormatter(
            (
              Number(cartData?.total_payable_amount) +
              (selectedTipAmount != null && selectedTipAmount != ''
                ? Number(selectedTipAmount)
                : 0)
            ).toFixed(2),
          )}`}</Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            !!userData?.auth_token
              ? moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS)()
              : navigation.navigate(navigationStrings.OUTER_SCREEN, {})
          }
          style={styles.paymentMainView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
              source={imagePath.paymentMethod}
            />
            <Text
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginLeft: moderateScale(4),
              }}>
              {selectedPayment.title_lng
                ? selectedPayment.title_lng
                : selectedPayment.title
                ? selectedPayment.title
                : strings.SELECT_PAYMENT_METHOD}
            </Text>
          </View>
          <View>
            <Image
              source={imagePath.goRight}
              style={
                isDarkMode
                  ? {
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                      tintColor: MyDarkTheme.colors.text,
                    }
                  : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
              }
            />
          </View>
        </TouchableOpacity>
        {!!(
          userData?.auth_token &&
          !appData?.profile?.preferences?.off_scheduling_at_cart
        ) &&
          !!(scheduleType == 'schedule' && localeSheduledOrderDate) && (
            <TouchableOpacity
              style={{
                marginTop: moderateScale(16),
                marginLeft: moderateScale(16),
                alignSelf: 'flex-start',
              }}
              onPress={clearSceduleDate}>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                  color: themeColors.primary_color,
                  textAlign: 'left',
                }}>
                {strings.CLEAR_SCHEDULE_DATE}
              </Text>
            </TouchableOpacity>
          )}

        {!!cartData?.deliver_status && (
          <View
            pointerEvents={placeLoader ? 'none' : 'auto'}
            style={styles.paymentView}>
            {!!(
              userData?.auth_token &&
              !appData?.profile?.preferences?.off_scheduling_at_cart
            ) && (
              <ButtonComponent
                onPress={_selectTime}
                btnText={
                  localeSheduledOrderDate
                    ? localeSheduledOrderDate
                    : strings.SCHEDULE_ORDER
                }
                borderRadius={moderateScale(13)}
                textStyle={{color: themeColors.primary_color}}
                containerStyle={{
                  ...styles.placeOrderButtonStyle,
                  backgroundColor: colors.transparent,
                  borderColor: themeColors.primary_color,
                  borderWidth: 0.8,
                }}
              />
            )}

            <ButtonComponent
              onPress={() => {
                placeOrder();
              }}
              btnText={strings.PLACE_ORDER}
              borderRadius={moderateScale(13)}
              textStyle={{color: colors.white}}
              containerStyle={styles.placeOrderButtonStyle}
              placeLoader={placeLoader}
            />
          </View>
        )}
        {!!cartData &&
          !!cartData?.upSell_products &&
          !!cartData?.upSell_products.length > 0 && (
            <View
              style={{
                ...styles.suggetionView,
              }}>
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.FREQUENTLY_BOUGHT_TOGETHER}
              </Text>
              <View style={{height: moderateScaleVertical(16)}} />
              <FlatList
                data={cartData?.upSell_products || []}
                renderItem={_renderUpSellProducts}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      marginRight: moderateScale(16),
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View style={{marginRight: moderateScale(16)}} />
                )}
              />
            </View>
          )}
        {!!cartData &&
          !!cartData?.crossSell_products &&
          !!cartData?.crossSell_products.length > 0 && (
            <View style={{...styles.suggetionView}}>
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.YOU_MIGHT_INTERESTED}
              </Text>
              <View style={{height: moderateScaleVertical(16)}} />
              <FlatList
                data={cartData?.crossSell_products || []}
                renderItem={_renderCrossSellProducts}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      marginRight: moderateScale(16),
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View style={{marginRight: moderateScale(16)}} />
                )}
              />
            </View>
          )}
        <View
          style={{
            height: moderateScaleVertical(65),
            backgroundColor: colors.transparent,
          }}></View>
      </View>
    );
  };

  //end footer

  //Header section of cart screen
  const getHeader = () => {
    return (
      <TouchableOpacity
        disabled={!!vendorAddress}
        onPress={() => setModalVisible(true)}
        style={{
          ...styles.topLable,
          marginVertical: moderateScale(7),
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', flex: 0.85}}>
          <Image source={imagePath.mapIcon} />
          <View style={styles.addressView}>
            <Text
              style={{
                ...styles.homeTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {vendorAddress
                ? strings.HOME
                : selectedAddressData
                ? strings.HOME
                : strings.ADD_ADDRESS}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                ...styles.addAddressTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                marginTop: moderateScaleVertical(4),
              }}>
              {vendorAddress
                ? vendorAddress
                : selectedAddressData
                ? selectedAddressData?.address
                : strings.TAP_HERE_ADD_ADDRESS}
            </Text>
          </View>
        </View>
        {!vendorAddress && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}>
            <Image
              source={imagePath.icEdit1}
              style={styles.editIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  //Native modal for Modal
  const openClearCartModal = () => {
    Alert.alert('', strings.AREYOUSURE, [
      {
        text: strings.CANCEL,
        onPress: () => {},
        // style: 'destructive',
      },
      {text: strings.CONFIRM, onPress: () => bottomButtonClick()},
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
          actions.saveAddress(address);
          updateState({
            isVisible: false,
            isLoadingB: false,
            selectedAddress: address,
            placeLoader: false,
          });
        })
        .catch(errorMethod);
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
          placeLoader: false,
        });
        getAllAddress();
        setTimeout(() => {
          let address = res.data;
          address['is_primary'] = 1;

          updateState({
            selectedAddress: address,
          });
          actions.saveAddress(address);
        });

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
    updateState({
      isVisibleTimeModal: false,
    });
  };

  const onDateChangeSecond = (value) => {
    if (modalType == 'pickup') {
      updateState({
        sheduledpickupdate: value,
        localePickupDate: `${value.toLocaleDateString(selectedLanguage, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}, ${value.toLocaleTimeString(selectedLanguage, {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      });
    } else {
      updateState({
        sheduleddropoffdate: value,
        localeDropOffDate: `${value.toLocaleDateString(selectedLanguage, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}, ${value.toLocaleTimeString(selectedLanguage, {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      });
    }
  };

  const onDateChange = (value) => {
    updateState({
      scheduleType: 'schedule',
      sheduledorderdate: value,
      localeSheduledOrderDate: `${value.toLocaleDateString(selectedLanguage, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}, ${value.toLocaleTimeString(selectedLanguage, {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
    });
  };

  useEffect(() => {
    if (!!checkCartItem?.data) {
      getItem('deepLinkUrl')
        .then((res) => {
          if (res) {
            let table_number = getParameterByName('table', res);
            updateState({deepLinkUrl: table_number});
          }
        })
        .catch(errorMethod);
    }
  }, [deepLinkUrl]);

  const _onTableSelection = (item) => {
    const data = {
      vendor_id: item.vendor_id,
      table: item?.id,
    };
    _vendorTableCart(data, item);
  };

  const _vendorTableCart = (data, item) => {
    if (!!userData?.auth_token) {
      actions
        .vendorTableCart(data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          removeItem('deepLinkUrl');
          setItem('selectedTable', item?.label);
        })
        .catch(errorMethod);
      return;
    }
    return;
  };

  const onPressRecommendedVendors = (item) => {
    if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item?.id,
            vendor: true,
            name: item?.name,
          })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const renderRecommendedVendors = ({item}) => {
    return (
      <View
        style={{
          width: moderateScale(width / 2),
          marginLeft: moderateScale(5),
        }}>
        <MarketCard3
          data={item}
          extraStyles={{marginTop: 0, marginVertical: moderateScaleVertical(2)}}
          fastImageStyle={{
            height: moderateScaleVertical(110),
          }}
          imageResizeMode="cover"
          onPress={() => onPressRecommendedVendors(item)}
        />
      </View>
    );
  };

  const ListEmptyComp = () => {
    return (
      <View style={{flex: 1}}>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#fff',
          }}>
          <FastImage
            source={{uri: Image.resolveAssetSource(imagePath.icEmptyCartD).uri}}
            style={{
              marginVertical: moderateScaleVertical(20),
              height: moderateScale(120),
              width: moderateScale(120),
            }}

            // resizeMode="contain"s
          />
          <Text style={{...styles.textStyle}}>
            {strings.YOUR_CART_EMPTY_ADD_ITEMS}
          </Text>
        </View>
        <HorizontalLine
          lineStyle={{
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity77
              : colors.greyA,
            marginVertical: moderateScaleVertical(16),
          }}
        />
        {wishlistArray.length > 0 && (
          <View>
            <Text
              style={{
                ...styles.commTextStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.SHOP_FROM_WISHLIST}
            </Text>
            {wishlistArray.map((val, i) => {
              return (
                <View key={String(i)}>
                  <WishlistCard
                    data={val.product}
                    onPress={moveToNewScreen(
                      navigationStrings.PRODUCTDETAIL,
                      val.product,
                    )}
                  />
                </View>
              );
            })}
          </View>
        )}
        <View style={{marginVertical: moderateScaleVertical(8)}} />

        {recommendedVendorsdata.length > 0 && (
          <View>
            <Text
              style={{
                ...styles.commTextStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.RECOMMENDED_VENDORS}
            </Text>
            <FlatList
              horizontal
              data={recommendedVendorsdata}
              renderItem={renderRecommendedVendors}
              keyExtractor={(item, index) => item?.id.toString()}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
            />
          </View>
        )}

        <View style={{marginBottom: moderateScale(100)}} />
      </View>
    );
  };
  const renderCardItemLoader = () => {
    return (
      <View>
        <HeaderLoader
          widthLeft={moderateScale(140)}
          rectWidthLeft={moderateScale(140)}
          heightLeft={15}
          rectHeightLeft={15}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(30),
          }}
          isRight={false}
        />
        <ProductListLoader
          widthLeft={moderateScale(100)}
          mainView={{
            marginHorizontal: moderateScale(15),
            marginTop: moderateScale(5),
            alignItems: 'flex-start',
          }}
        />
        <HeaderLoader
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          heightLeft={moderateScale(35)}
          rectHeightLeft={moderateScale(35)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
          isRight={false}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(8),
          }}
        />
      </View>
    );
  };

  if (isLoadingB) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}
        source={loaderOne}
        // isLoadingB={isLoadingB}
      >
        <Header centerTitle={strings.CART} leftIcon={imagePath.icBackb} />
        {/* <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#fff',
          }}>
          <FastImage
            source={{uri: Image.resolveAssetSource(imagePath.icEmptyCartD).uri}}
            style={{
              marginVertical: moderateScaleVertical(20),
              height: moderateScale(120),
              width: moderateScale(120),
            }}

            // resizeMode="contain"s
          />
          <Text style={{...styles.textStyle}}>
            {strings.YOUR_CART_EMPTY_ADD_ITEMS}
          </Text>
        </View> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
            }}
            isRight={false}
          />
          <HeaderLoader
            widthLeft={moderateScale(100)}
            rectWidthLeft={moderateScale(100)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
              alignSelf: 'center',
            }}
            isRight={false}
          />
          {renderCardItemLoader()}
          {renderCardItemLoader()}
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(30),
            }}
          />
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(8),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(90)}
            rectWidthLeft={width - moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(20),
            }}
            isRight={false}
          />
          <View style={{flexDirection: 'row'}}>
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(15),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
          </View>
          <HeaderLoader
            widthLeft={moderateScale(90)}
            rectWidthLeft={moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={moderateScale(40)}
            rectHeightLeft={moderateScale(40)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
            isRight={false}
          />
        </ScrollView>
      </WrapperContainer>
    );
  }

  const _renderUpSellProducts = ({item}) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, {data: item})
        }
      />
    );
  };

  const _renderCrossSellProducts = ({item}) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, {data: item})
        }
      />
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      // isLoadingB={isLoadingB}
    >
      <Header
        centerTitle={strings.CART}
        noLeftIcon
        isRightText={cartItems && cartItems?.length}
        onPressRightTxt={() => openClearCartModal()}
      />
      <View
        style={
          isDarkMode
            ? [
                styles.mainComponent,
                {backgroundColor: MyDarkTheme.colors.background},
              ]
            : styles.mainComponent
        }>
        {/* <SwipeListView
          disableRightSwipe
          data={cartItems}
          renderItem={_renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={width}
          // onSwipeValueChange={onSwipeValueChange}
          useNativeDriver={false}
        /> */}
        <FlatList
          key={swipeKey}
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems?.length ? getHeader() : null}
          ListFooterComponent={cartItems?.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: colors.backgroundGrey}}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItem}
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
          ListEmptyComponent={() => (!isLoadingB ? <ListEmptyComp /> : <></>)}
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
        onClose={() => {
          updateState({placeLoader: false});
          setModalVisible(false);
        }}
        openAddressModal={() =>
          setModalVisibleForAddessModal(true, 'addAddress')
        }
        selectAddress={(data) => selectAddress(data)}
        selectedAddress={selectedAddressData}
      />
      <AddressModal3
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
          <Image
            style={isDarkMode && {tintColor: MyDarkTheme.colors.white}}
            source={imagePath.crossB}
          />
        </TouchableOpacity>
        <View
          style={
            isDarkMode
              ? [
                  styles.modalMainViewContainer,
                  {backgroundColor: MyDarkTheme.colors.lightDark},
                ]
              : styles.modalMainViewContainer
          }>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={
              isDarkMode
                ? [
                    styles.modalMainViewContainer,
                    {backgroundColor: MyDarkTheme.colors.lightDark},
                  ]
                : styles.modalMainViewContainer
            }>
            <View
              style={{
                // flex: 0.6,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text
                style={
                  isDarkMode
                    ? [styles.carType, {color: MyDarkTheme.colors.text}]
                    : styles.carType
                }>
                {strings.SELECTDATEANDTIME}
              </Text>
            </View>

            {businessType == 'laundry' && modalType != 'schedule' ? (
              <View
                style={{
                  alignItems: 'center',
                  height: height / 3.5,
                }}>
                {modalType == 'pickup' ? (
                  <DatePicker
                    locale={selectedLanguage}
                    date={
                      sheduledpickupdate
                        ? new Date(sheduledpickupdate)
                        : new Date()
                    }
                    textColor={isDarkMode ? colors.white : colors.blackB}
                    mode="datetime"
                    minimumDate={new Date()}
                    maximumDate={undefined}
                    style={styles.datetimePickerText}
                    // onDateChange={setDate}
                    onDateChange={(value) => onDateChangeSecond(value)}
                  />
                ) : (
                  <DatePicker
                    locale={selectedLanguage}
                    date={
                      sheduleddropoffdate
                        ? new Date(sheduleddropoffdate)
                        : new Date()
                    }
                    textColor={isDarkMode ? colors.white : colors.blackB}
                    mode="datetime"
                    minimumDate={new Date()}
                    maximumDate={undefined}
                    style={styles.datetimePickerText}
                    // onDateChange={setDate}
                    onDateChange={(value) => onDateChangeSecond(value)}
                  />
                )}
              </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  height: height / 3.5,
                }}>
                <DatePicker
                  locale={selectedLanguage}
                  date={
                    sheduledorderdate ? new Date(sheduledorderdate) : new Date()
                  }
                  textColor={isDarkMode ? colors.white : colors.blackB}
                  mode="datetime"
                  minimumDate={
                    !!cartData?.delay_date
                      ? new Date(cartData?.delay_date)
                      : new Date()
                  }
                  maximumDate={undefined}
                  style={styles.datetimePickerText}
                  // onDateChange={setDate}
                  onDateChange={(value) => onDateChange(value)}
                />
              </View>
            )}
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
              onPress={selectOrderDate}
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
