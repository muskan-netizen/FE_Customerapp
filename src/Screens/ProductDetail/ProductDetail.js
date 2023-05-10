import { useFocusEffect } from '@react-navigation/native';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import DatePicker from 'react-native-date-picker';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal, { ReactNativeModal } from 'react-native-modal';
import RenderHtml from 'react-native-render-html';
import Share from 'react-native-share';
import { Pagination } from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import Banner2 from '../../Components/Banner2';
import BottomSlideModal from '../../Components/BottomSlideModal';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import HorizontalLine from '../../Components/HorizontalLine';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import ProductsComp from '../../Components/ProductsComp';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

import { MyDarkTheme } from '../../styles/theme';
import {
  addRemoveMinutes,
  getHourAndMinutes,
  tokenConverterPlusCurrencyNumberFormater,
} from '../../utils/commonFunction';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showInfo,
  showSuccess,
} from '../../utils/helperFunctions';
import AddonModal from './AddonModal';
import ListEmptyProduct from './ListEmptyProduct';
import stylesFunc from './styles';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';
import BorderTextInput from '../../Components/BorderTextInput';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import * as RNLocalize from 'react-native-localize';
import Reccuring from '../../Components/Reccuring';

import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function ProductDetail({ route, navigation }) {
  console.log('my route', route.params.data);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const cartData = useSelector((state) => state?.cart?.cartItemCount);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, themeColors, themeLayouts, currencies, languages, appStyle } =
    useSelector((state) => state?.initBoot);
  const {
    additional_preferences,
    digit_after_decimal,
    seller_sold_title,
    seller_platform_logo,
  } = appData?.profile?.preferences || {};
  const { productListData } = useSelector((state) => state?.product);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  const commonStyles = commonStylesFunc({ fontFamily });
  const reloadData = useSelector((state) => state?.reloadData?.reloadData);
  const { data, isProductList = false } = route.params;


  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    isLoading: true,
    isLoadingB: false,
    isLoadingC: false,
    productId: data?.products?.id || data?.item?.id || data?.id,
    productDetailData: null,
    productPriceData: null,
    variantSet: [],
    addonSet: [],
    relatedProducts: [],
    showListOfAddons: false,
    venderDetail: null,
    productTotalQuantity: 0,
    productSku: null,
    productVariantId: null,
    isVisibleAddonModal: false,
    lightBox: false,
    productQuantityForCart: 1,
    showErrorMessageTitle: false,
    typeId: null,
    isProductImageLargeViewVisible: false,
    selectedVariant: null,
    selectedOption: null,
    btnLoader: false,
    startDateRental: new Date(),
    endDateRental: '',
    isRentalStartDatePicker: false,
    isRentalEndDatePicker: false,
    rentalProductDuration: null,
    productDetailNew: {},
    isProductAvailable: false,
    productAttributes: [],
    offersList: [],
    isOffersModalVisible: false,
  });
  const [pinCode, setPinCode] = useState('');
  const [isAvailableSlotsModal, setAvailableSlotsModal] = useState(false);
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableVendorSlots, setAvailableVendorSlots] = useState([]);
  const [isLoadingPinCode, setLoadingPinCode] = useState(false);
  const [isLoadingGetSlots, setLoadingGetSlots] = useState(false);
  const [selectedVendorDeliverySlot, setSelectedVendorDeliverySlot] = useState(
    {},
  );
  const [isTimeIntervals, setIsTimeIntervals] = useState(false);
  const [productAvailableIntervals, setProductAvailableIntervals] = useState(
    [],
  );
  const [selectedProductInterval, setSelectedProductInterval] = useState({});
  const [isLoadingProductSlotIntervals, setIsLoadingProductSlotIntervals] =
    useState(false);
  const [productPreferences, setProductPreferences] = useState({})
  const [isAppointmentPicker, setAppointmentPicker] = useState(false)
  const [appointmentSelectedDate, setAppointmentSelectedDate] = useState(null)
  const [appointmentAvailableSlots, setAppointmentAvailableSlots] = useState([])
  const [selectedAppointmentSlot, setSelectedAppointmentSlot] = useState({})
  const [isAppointmentSlotsModal, setAppointmentSlotsModal] = useState(false)
  const [selectedAppointmentIndx, setSelectedAppointmentIndx] = useState(null)
  const [appointmentDispatcherAgentSlots, setAppointmentDispatcherAgentSlots] = useState([])
  const [allDispatcherAgents, setAllDispatcherAgents] = useState([]);
  const [availableDriversForSlot, setAvailableDriversForSlot] = useState([])
  // const [selectedAllProductDataForAppointment, setSelectedAllProductDataForAppointment] = useState({})
  const [selectedAgent, setSelectedAgent] = useState({})





  //Saving the initial state
  const initialState = cloneDeep(state);
  const userData = useSelector((state) => state?.auth?.userData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { bannerRef } = useRef();
  const {
    productDetailData,
    productPriceData,
    isLoadingC,
    addonSet,
    variantSet,
    showListOfAddons,
    venderDetail,
    productTotalQuantity,
    productSku,
    productVariantId,
    relatedProducts,
    isVisibleAddonModal,
    lightBox,
    productQuantityForCart,
    showErrorMessageTitle,
    typeId,
    isProductImageLargeViewVisible,
    selectedVariant,
    btnLoader,
    startDateRental,
    endDateRental,
    isRentalStartDatePicker,
    isRentalEndDatePicker,
    rentalProductDuration,
    productDetailNew,
    isProductAvailable,
    productAttributes,
    offersList,
    isOffersModalVisible,
  } = state;

  const [variantState, setVariantState] = useState({
    planValues: ["Daily", "Weekly", "Custom", "Alternate Days"],
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    quickSelection: ["Weekdays", "Weekends"],
    showCalendar: false,
    reccuringCheckBox: false,
    selectedPlanValues: '',
    selectedWeekDaysValues: [],
    selectedQuickSelectionValue: '',
    minimumDate: moment(new Date()).add(2, 'days').format("YYYY-MM-DD"),
    initDate: new Date(),
    start: {},
    end: {},
    period: {},
    disabledDaysIndexes: [],
    selectedDaysIndexes: [],
    date: new Date(),
    showDateTimeModal: false,
    slectedDate: new Date(),
  })

  const { planValues, reccuringCheckBox, showCalendar, selectedPlanValues, minimumDate,
    weekDays, quickSelection, start, end, period, selectedWeekDaysValues, selectedQuickSelectionValue, initDate,
    disabledDaysIndexes, selectedDaysIndexes, date, showDateTimeModal, slectedDate } = variantState
  const updateAddonState = (data) => { setVariantState((state) => ({ ...state, ...data })) };

  const resetVariantState = () => {
    updateAddonState({
      planValues: ["Daily", "Weekly", "Alternate Days", "Custom"],
      weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      quickSelection: ["Weekdays", "Weekends"],
      showCalendar: false,
      selectedPlanValues: '',
      selectedWeekDaysValues: [],
      selectedQuickSelectionValue: '',
      minimumDate: moment(new Date()).add(2, 'days').format("YYYY-MM-DD"),
      initDate: new Date(),
      start: {},
      end: {},
      period: {},
      disabledDaysIndexes: [],
      selectedDaysIndexes: [],
      date: new Date(),
      showDateTimeModal: false,
      slectedDate: new Date(),
    })
  }

  let plainHtml = productDetailData?.translation[0]?.body_html || null;

  useFocusEffect(
    React.useCallback(() => {
      if (variantSet.length) {
        let variantSetData = variantSet
          .map((i, inx) => {
            let find = i.options.filter((x) => x.value);
            if (find.length) {
              return {
                variant_id: find[0].variant_id,
                optionId: find[0].id,
              };
            }
          })
          .filter((x) => x != undefined);
        console.log(variantSetData, 'variantSetData');
        if (variantSetData.length) {
          getProductDetailBasedOnFilter(variantSetData);
        } else {
          getProductDetail();
        }
      }
    }, [variantSet]),
  );

  useEffect(() => {
    getProductDetail();
  }, [state.productId, state.isLoadingB]);
  const onShare = () => {
    console.log('onShare', appData);
    if (!!productDetailData?.share_link) {
      let hyperLink = productDetailData?.share_link;
      let options = { url: hyperLink };
      Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          err && console.log(err);
        });
      return;
    }
    alert('link not found');
  };

  const getProductDetail = () => {
    console.log('api hit getProductDetail', state.productId);
    actions
      .getProductDetailByProductId(
        `/${state.productId}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res.data, 'res getProductDetail');

        if (res?.data?.products?.product_media) {
          res?.data?.products?.product_media.map((val) => {
            const url1 = val?.image?.path?.image_fit || val.image.image_fit;
            const url2 = val?.image?.path?.image_path || val.image.image_path;
            let imageUri = getImageUrl(url1, url2, '600/800');
            FastImage.preload([{ uri: imageUri }]);
          });
        }

        // const imageUrl = res.data?.image?.path
        // ? getImageUrl(
        //   item.image.path.image_fit,
        //   item.image.path.image_path,
        //   '1000/1000',
        // )
        // : getImageUrl(item.image.image_fit, item.image.image_path, '1000/1000');
        setProductPreferences(res?.data?.prefference)
        updateState({
          productAttributes: res?.data?.product_attribute,
          offersList: res?.data?.coupon_list,
          productDetailNew: res?.data?.products,
          productDetailData: res?.data?.products,
          relatedProducts: res.data.relatedProducts,
          productPriceData: res.data.products.variant[0],
          addonSet: res.data.products.add_on,
          typeId: res.data.products.category.category_detail.type_id,
          venderDetail: res.data.products.vendor,
          productTotalQuantity: res.data.products.variant[0].quantity,
          productVariantId: res.data.products.variant[0].id,
          productSku: res.data.products.sku,
          productQuantityForCart: !!res.data.products?.minimum_order_count
            ? Number(res.data.products?.minimum_order_count)
            : 1,
          isLoading: false,
          isLoadingB: false,
          btnLoader: false,
          rentalProductDuration:
            Number(res?.data?.products?.minimum_duration) * 60 +
            Number(res?.data?.products?.minimum_duration_min),
          endDateRental: addRemoveMinutes(
            Number(res?.data?.products?.minimum_duration) * 60 +
            Number(res?.data?.products?.minimum_duration_min),
          ),
          startDateRental: new Date(),
        });
        if (
          res.data.products.variant_set.length &&
          variantSet &&
          !variantSet.length
        ) {
          updateState({ variantSet: res.data.products.variant_set });
        }
      })
      .catch(errorMethod);
  };

  //Get Product detail based on varint selection
  const getProductDetailBasedOnFilter = (variantSetData) => {
    console.log('api hit getProductDetailBasedOnFilter');
    let data = {};
    data['variants'] = variantSetData.map((i) => i.variant_id);
    data['options'] = variantSetData.map((i) => i.optionId);
    actions
      .getProductDetailByVariants(`/${productDetailData.sku}`, data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        console.log(res.data, 'res.data by vendor id ');
        updateState({
          isLoading: false,
          isLoadingB: false,
          isLoadingC: false,

          productPriceData: {
            multiplier: res.data.multiplier,
            price: res.data.price,
          },
          productSku: res.data.sku,
          productVariantId: res.data.id,
          showErrorMessageTitle: false,
          selectedVariant: null,
          btnLoader: false,
          productDetailNew: res?.data,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    setLoadingPinCode(false);
    if (error?.message?.alert == 1) {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        btnLoader: false,
      });
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        { text: strings.CLEAR_CART2, onPress: () => clearCart() },
      ]);
    } else {
      if (error?.data?.variant_empty) {
        updateState({
          isLoading: false,
          showErrorMessageTitle: true,
          isLoadingB: false,
          isLoadingC: false,
          selectedVariant: null,
          btnLoader: false,
        });
      } else {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isLoadingC: false,
          selectedVariant: null,
          btnLoader: false,
        });
        if (error?.message == "Recurring booking type not be empty.") {
          showInfo('Schedule the product click on recurring checkbox');
        } else {
          showError(error?.message || error?.error);
        }
      }
    }
  };

  const errorMethodSecond = (error, addonSet) => {
    if (error?.message?.alert == 1) {
      updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
      // showError(error?.message?.error || error?.error);

      Alert.alert('', strings.ALREADY_EXIST, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        { text: strings.CLEAR_CART2, onPress: () => clearCart(addonSet) },
      ]);
    } else {
      updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
      if (error?.message == "Recurring booking type not be empty.") {
        showInfo('Schedule the product click on recurring checkbox');
      } else {
        showError(error?.message || error?.error);
      }
    }
  };

  const clearCart = (addonSet) => {
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
        // updateState({
        //   cartItems: [],
        //   cartData: {},
        //   isLoadingB: false,
        // });
        // addToCart();
        if (addonSet) {
          _finalAddToCart(addonSet);
        } else {
          addToCart();
        }
        // _finalAddToCart(addonSet);
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //add Product to wishlist
  const _onAddtoWishlist = (item) => {
    console.log(item, 'itemwishlist');

    if (!!userData?.auth_token) {
      actions
        .updateProductWishListData(
          `/${item.product_id || item.id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          showSuccess(res.message);

          if (item.inwishlist) {
            item.inwishlist = null;
            updateState({ productDetailData: item });
          } else {
            item.inwishlist = { product_id: item.id };
            updateState({ productDetailData: item });
          }
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  useEffect(() => {
    myRef.current.scrollToPosition(1, 0, true);
  }, [state.productId]);

  const selectSpecificOptions = (options, i, inx) => {
    let newArray = cloneDeep(options);
    let modifyVariants = variantSet.map((vi, vnx) => {
      if (vi.variant_type_id == i.variant_id) {
        return {
          ...vi,
          options: newArray.map((j, jnx) => {
            if (j.id == i.id) {
              return {
                ...j,
                value: true,
              };
            }
            return {
              ...j,
              value: false,
            };
          }),
        };
      } else {
        return vi;
      }
    });
    updateState({
      variantSet: modifyVariants,
      selectedOption: i,
    });
  };

  const onSelect = () => {
    if (variantSet.length) {
      let variantSetData = variantSet
        .map((i, inx) => {
          let find = i.options.filter((x) => x.value);
          if (find.length) {
            return {
              variant_id: find[0].variant_id,
              optionId: find[0].id,
            };
          }
        })
        .filter((x) => x != undefined);
      if (variantSetData.length) {
        updateState({ btnLoader: true });
        getProductDetailBasedOnFilter(variantSetData);
      } else {
        getProductDetail();
      }
    }
  };

  const checkProductAvailibility = () => {
    // actions
    //   .checkProductAvailibility(
    //     {
    //       selectedStartDate: String(
    //         moment(startDateRental).format('YYYY-MM-DD hh:mm:ss'),
    //       ),
    //       selectEndDate: String(
    //         moment(endDateRental).format('YYYY-MM-DD hh:mm:ss'),
    //       ),
    //       variant_option_id: productDetailNew?.set[0]?.variant_option_id,
    //       product_id: productDetailNew?.product?.id,
    //     },
    //     {
    //       code: appData.profile.code,
    //       currency: currencies.primary_currency.id,
    //       language: languages.primary_language.id,
    //     },
    //   )
    //   .then((res) => {
    //     console.log(res, 'res......res...res');
    //     updateState({
    //       isProductAvailable: true,
    //     });
    //   })
    //   .catch((err) => {
    //     updateState({
    //       isProductAvailable: false,
    //     });
    //   });
  };

  const onDateChange = (val) => {
    isRentalEndDatePicker
      ? updateState({
        endDateRental: val,
      })
      : updateState({
        startDateRental: val,
        endDateRental: addRemoveMinutes(
          Number(productDetailData?.minimum_duration) * 60 +
          Number(productDetailData?.minimum_duration_min),
          val,
        ),
        rentalProductDuration:
          Number(productDetailData?.minimum_duration * 60) +
          Number(productDetailData?.minimum_duration_min),
      });
  };

  const addRemoveDuration = (key) => {
    if (key == 1) {
      updateState({
        rentalProductDuration:
          rentalProductDuration +
          Number(productDetailData?.additional_increments) * 60 +
          Number(productDetailData?.additional_increments_min),
        endDateRental: addRemoveMinutes(
          Number(productDetailData?.additional_increments) * 60 +
          Number(productDetailData?.additional_increments_min),
          endDateRental,
        ),
      });
      checkProductAvailibility();
    } else {
      if (
        Number(rentalProductDuration) !=
        Number(productDetailData.minimum_duration) * 60 +
        Number(productDetailData.minimum_duration_min)
      ) {
        updateState({
          rentalProductDuration:
            rentalProductDuration -
            (Number(productDetailData?.additional_increments) * 60 +
              Number(productDetailData?.additional_increments_min)),
          endDateRental: addRemoveMinutes(
            Number(productDetailData?.additional_increments) * 60 +
            Number(productDetailData?.additional_increments_min),
            endDateRental,
            '-',
          ),
        });
      }
    }
  };

  const variantSetValue = (item) => {
    const { options, type, variant_type_id } = item;
    console.log('variantSetValuevariantSetValue', item);
    if (type == 1 || type == 2) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => updateState({ selectedVariant: item })}
            style={{
              ...styles.dropDownStyle,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.blackOpacity05,
            }}>
            <Text
              style={{
                fontSize: moderateScale(12),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {options.filter((val) => {
                if (val?.value) {
                  return val;
                }
              })[0]?.title || strings.SELECT + ' ' + item?.title}
            </Text>
            <Image source={imagePath.dropDownSingle} />
          </TouchableOpacity>
          {selectedVariant?.variant_type_id == variant_type_id
            ? radioButtonView(options)
            : null}

        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => updateState({ selectedVariant: item })}
          style={{
            ...styles.dropDownStyle,
            backgroundColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.blackOpacity05,
          }}>
          <Text
            style={{
              fontSize: moderateScale(12),
              fontFamily: fontFamily.medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {options.filter((val) => {
              if (val?.value) {
                return val;
              }
            })[0]?.title || strings.SELECT + ' ' + item?.title}
          </Text>
          <Image source={imagePath.dropDownSingle} />
        </TouchableOpacity>

        {selectedVariant?.variant_type_id == variant_type_id
          ? circularView(options)
          : null}
      </View>
    );
  };

  const radioButtonView = (options) => {
    return (
      <Modal
        key={'1'}
        isVisible
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({ selectedVariant: null })}>
        <View
          style={{
            ...styles.modalView,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: moderateScale(18),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.SELECT} {selectedVariant?.title}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => updateState({ selectedVariant: null })}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.horizontalLine,
              borderBottomColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((i, inx) => {
              return (
                <TouchableOpacity
                  key={inx}
                  // disabled={options && options.length == 1 ? true : false}
                  onPress={() => selectSpecificOptions(options, i, inx)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // marginRight: moderateScale(16),
                    marginBottom: moderateScaleVertical(10),
                  }}>
                  <Image
                    source={
                      i?.value
                        ? imagePath.icActiveRadio
                        : imagePath.icInActiveRadio
                    }
                    style={{
                      tintColor: themeColors.primary_color,
                      marginRight: moderateScale(16),
                    }}
                  />
                  <Text
                    style={{
                      ...styles.variantValue,
                      color: i?.value
                        ? themeColors.primary_color
                        : isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity43,
                      fontSize: textScale(14),
                      fontFamily: i.value
                        ? fontFamily.bold
                        : fontFamily.regular,
                    }}>
                    {i?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <GradientButton
            indicator={btnLoader}
            indicatorColor={colors.white}
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{
              fontFamily: fontFamily.medium,
              textTransform: 'capitalize',
              color: colors.white,
            }}
            onPress={onSelect}
            btnText={strings.SELECT}
            btnStyle={{
              borderRadius: moderateScale(4),
              height: moderateScale(38),
            }}
          />
        </View>
      </Modal>
    );
  };

  const circularView = (options) => {
    return (
      <Modal
        key={'2'}
        isVisible
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({ selectedVariant: null })}>
        <View
          style={{
            ...styles.modalView,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: moderateScale(18),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.SELECT} {selectedVariant?.title}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => updateState({ selectedVariant: null })}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.horizontalLine,
              borderBottomColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((i, inx) => {
              return (
                <TouchableOpacity
                  key={inx}
                  // disabled={options && options.length == 1 ? true : false}
                  onPress={() => selectSpecificOptions(options, i, inx)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: moderateScale(5),
                    marginBottom: moderateScaleVertical(10),
                  }}
                  activeOpacity={0.8}>
                  <View
                    style={[
                      styles.variantSizeViewTwo,
                      {
                        backgroundColor: colors.white,
                        borderWidth: i?.value ? 1 : 0,

                        borderColor:
                          i?.value &&
                            (i.hexacode == '#FFFFFF' || i.hexacode == '#FFF')
                            ? colors.textGrey
                            : i.hexacode,
                      },
                    ]}>
                    <View
                      style={[
                        styles.variantSizeViewOne,
                        {
                          backgroundColor: i.hexacode,
                          borderWidth:
                            i.hexacode == '#FFFFFF' || i.hexacode == '#FFF'
                              ? StyleSheet.hairlineWidth
                              : 0,
                        },
                      ]}></View>
                  </View>
                  <Text
                    style={{
                      ...styles.variantValue,
                      color: i?.value
                        ? themeColors.primary_color
                        : isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity43,
                      fontSize: textScale(14),
                      fontFamily: i.value
                        ? fontFamily.bold
                        : fontFamily.regular,
                      marginLeft: moderateScale(8),
                    }}>
                    {i?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <GradientButton
            indicator={btnLoader}
            indicatorColor={colors.white}
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{
              fontFamily: fontFamily.medium,
              textTransform: 'capitalize',
              color: colors.white,
            }}
            onPress={onSelect}
            btnText={strings.SELECT}
            btnStyle={{
              borderRadius: moderateScale(4),
              height: moderateScale(38),
            }}
          />
        </View>
      </Modal>
    );
  };

  const renderVariantSet = ({ item, index }) => {
    return (
      <View
        key={String(index)}
        style={{
          flex: 1,
          marginRight: moderateScale(8),
        }}>
        <Text
          style={{
            ...styles.variantLable,
            marginBottom: moderateScale(5),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>{`${item?.title}`}</Text>
        {item?.options ? variantSetValue(item) : null}
      </View>
    );
  };

  const showAllVariants = () => {
    let variantSetData = cloneDeep(variantSet);
    return (
      <View style={{ marginBottom: moderateScaleVertical(16) }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          numColumns={2}
          data={!!variantSetData ? variantSetData : []}
          renderItem={renderVariantSet}
          keyExtractor={(item) => item?.variant_type_id.toString()}
        />
      </View>
    );
  };

  console.log(typeId, "typeId>>>>>typeId", rentalProductDuration)

  useEffect(() => {
    if (data?.addonSetData && data?.randomValue) {
      updateState({ addonSet: data?.addonSetData });
      setTimeout(() => {
        _finalAddToCart(data?.addonSetData);
      }, 1000);
    }
  }, [data?.addonSetData, data?.randomValue]);

  useEffect(() => {
    if (!isEmpty(productDetailNew)) {
      checkProductAvailibility();
    }
  }, [productDetailNew]);

  const _finalAddToCart = (addonSet = addonSet) => {


    if (dine_In_Type == 'appointment' && isEmpty(selectedAppointmentSlot) && isEmpty(appointmentSelectedDate)) {
      alert('Please select appointment date and slot')
      return
    }


    const addon_ids = [];
    const addon_options = [];

    const weeDays = []
    const selectedCustomDates = []

    if (selectedWeekDaysValues.length) {
      selectedWeekDaysValues.map((itm, inx) => {
        const value = itm === "Mo" ? 1 :
          itm === "Tu" ? 2 :
            itm === "We" ? 3 :
              itm === "Th" ? 4 :
                itm === "Fr" ? 5 :
                  itm === "Sa" ? 6 :
                    itm === "Su" && 0
        weeDays.push(value)
      })
    }
    if (!isEmpty(period) && selectedPlanValues == "Custom") {
      Object.entries(period).map(([key, value]) => (selectedCustomDates.push(key)));
    }
    if (!isEmpty(period) && selectedPlanValues == "Weekly") {
      Object.entries(period).map(([key, value]) => {
        console.log("=>", JSON.stringify(value));
        ((value['startingDay'] == true || value['startingDay'] == false) || value['endingDay']) && selectedCustomDates.push(key)
      });
    }
    const recurringformPost = {}

    recurringformPost['action'] = selectedPlanValues == "Daily" ? 1 : selectedPlanValues == "Weekly" ? 2 : selectedPlanValues == "Monthly" ? 3 :
      selectedPlanValues == "Alternate Days" ? 6 : selectedPlanValues == "Custom" ? 4 : 5
    recurringformPost['startDate'] = start.dateString ? start.dateString : ''
    recurringformPost['endDate'] = end.dateString ? end.dateString : ''
    recurringformPost['weekDay'] = weeDays
    recurringformPost['selected_custom_dates'] = selectedCustomDates


    addonSet.map((i, inx) => {
      i.setoptions.map((j, jnx) => {
        if (j?.value == true) {
          addon_ids.push(j?.addon_id);
          addon_options.push(j?.id);
        }
      });
    });

    let data = {};
    data['sku'] = productSku;
    data['quantity'] = productQuantityForCart;
    data['product_variant_id'] = productVariantId;
    data['type'] = dine_In_Type;
    if (!isEmpty(selectedProductInterval)) {
      data['sele_slot_id'] = selectedProductInterval?.id;
      data['sele_slot_price'] = selectedProductInterval?.price;
      data['delivery_date'] = moment(selectedDate).format('YYYY-MM-DD');
    }

    data['start_date_time'] = String(
      moment(startDateRental).format('YYYY-MM-DD hh:mm:ss'),
    );
    data['end_date_time'] = String(
      moment(endDateRental).format('YYYY-MM-DD hh:mm:ss'),
    );
    data['total_booking_time'] = rentalProductDuration;

    data['additional_increments_hrs_min'] =
      rentalProductDuration -
      Number(productDetailData?.minimum_duration) * 60 +
      Number(productDetailData?.minimum_duration_min);
    if (addonSet && addonSet.length) {
      // console.log(addonSetData, 'addonSetData');
      data['addon_ids'] = addon_ids;
      data['addon_options'] = addon_options;
    }
    if (dine_In_Type == 'appointment') {
      data['schedule_slot'] = selectedAppointmentSlot?.value,
        data['scheduled_date_time'] = String(
          moment(appointmentSelectedDate).format('YYYY-MM-DD hh:mm:ss'),
        );
      data['dispatch_agent_id'] = selectedAgent?.id
      data['schedule_type'] = productDetailData?.mode_of_service == 'schedule' ? 'schedule' : ''

    }

    console.log(data, 'data for cart');

    data['recurringformPost'] = recurringformPost
    console.log(JSON.stringify(data), 'data for cart');
    updateState({ isLoadingC: true, isVisibleAddonModal: false });
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res.data');
        actions.cartItemQty(res);
        actions.reloadData(!reloadData);

        showSuccess(strings.PRODUCT_ADDED_SUCCESS);

        updateState({ isLoadingC: false });
        if (!!isProductList) {
          navigation.navigate(navigationStrings.PRODUCT_LIST, {
            data: {
              item: data,
              isLoading: true,
              data: res?.data
            }
          });
        } else {
          navigation.goBack()
        }
      }).catch((error) => errorMethodSecond(error, addonSet));
  };
  const addToCart = () => {
    if (isProductAvailable) {
      showError('Product varient is not availabel!');
      return;
    }
    if (typeId == 10 && !!cartData?.data?.item_count) {
      showError('Rental product already added in cart!');
      return;
    }
    if (data?.is_recurring_booking) {
      if (isEmpty(selectedPlanValues)) {
        showError('Plan type should not be empty!');
        return;
      }
      if (isEmpty(selectedWeekDaysValues) && selectedPlanValues == "Weekly") {
        showError('Weekdays should not be empty!');
        return;
      }
      if (selectedPlanValues == "Daily" || selectedPlanValues == "Weekly" || selectedPlanValues == "Alternate Days") {
        if (isEmpty(start) || isEmpty(end)) {
          showError('Start date and End date should not be empty!');
          return;
        }
      } else {
        if (isEmpty(period)) {
          showError('Select dates in custom plan!');
          return;
        }
      }
    }
    {
      addonSet && addonSet.length
        ? updateState({ isVisibleAddonModal: true })
        : _finalAddToCart(addonSet);
    }
    // _finalAddToCart()
  };

  const myRef = useRef(null);

  const productIncrDecreamentForCart = (type) => {
    let quantityToIncreaseDecrease = !!productDetailData?.batch_count
      ? Number(productDetailData?.batch_count)
      : 1;
    if (type == 2) {
      let limitOfMinimumQuantity = !!productDetailData?.minimum_order_count
        ? Number(productDetailData?.minimum_order_count)
        : 1;

      if (productQuantityForCart <= limitOfMinimumQuantity) {
      } else {
        updateState({
          productQuantityForCart:
            productQuantityForCart - quantityToIncreaseDecrease,
        });
      }
    } else if (type == 1) {
      if (productQuantityForCart == productTotalQuantity) {
        showError(strings.MAXIMUM_LIMIT_REACHED);
      } else {
        updateState({
          productQuantityForCart:
            productQuantityForCart + quantityToIncreaseDecrease,
        });
      }
    }
  };

  const renderProduct = ({ item, index }) => {
    // item.showAddToCart = true;
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.push(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
      // <ProductCard
      // onPress={() =>
      //   navigation.push(navigationStrings.PRODUCTDETAIL, {data: item})
      // }
      //   onAddtoWishlist={() => _onAddtoWishlist(item)}
      //   data={item}
      //   cardStyle={{
      //     backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
      //     marginHorizontal: moderateScale(10),
      //   }}
      //   addToCart={() =>
      //     navigation.push(navigationStrings.PRODUCTDETAIL, {data: item})
      //   }
      //   bottomText={strings.VIEW_DETAIL}
      //   nameTextStyle={{
      //     ...styles.productName,
      //     color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      //   }}
      // />
    );
  };

  const setModalVisibleForAddonModal = (visible) => {
    updateState({ isVisibleAddonModal: false });
  };

  const onclickBanner = () => {
    updateState({ lightBox: true });
  };

  const onImageLargeView = (item) => {
    updateState({
      isProductImageLargeViewVisible: true,
    });
  };

  // load images for zooming effect

  const allImagesArrayForZoom = [];
  productDetailData?.product_media
    ? productDetailData?.product_media?.map((item, index) => {
      return (allImagesArrayForZoom[index] = {
        url: getImageUrl(
          item?.image.path.image_fit,
          item?.image.path.image_path,
          '1000/1000',
        ),
      });
    })
    : getImageUrl(
      productDetailData?.product_media[0]?.image?.path?.image_fit,
      productDetailData?.product_media[0]?.image?.path?.image_path,
      '1000/1000',
    );

  const renderImageZoomingView = () => {
    return (
      <View
        style={{
          height: moderateScaleVertical(height),
          width: moderateScale(width),
        }}>
        <ImageViewer
          renderHeader={() => <View style={{ backgroundColor: 'red' }}></View>}
          renderIndicator={(currentIndex, allSize) => (
            <View
              style={{
                position: 'absolute',
                top: 100,
                width: width / 2,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() =>
                  updateState({
                    isProductImageLargeViewVisible: false,
                  })
                }>
                <Image
                  style={{
                    tintColor: colors.white,
                    marginHorizontal: moderateScale(20),
                  }}
                  source={imagePath.backArrow}
                />
              </TouchableOpacity>
              <Text style={{ color: colors.white }}>
                {currentIndex + '/' + allSize}
              </Text>
            </View>
          )}
          imageUrls={allImagesArrayForZoom}
        />
      </View>
    );
  };

  // const renderProductAttributes = ({ item, index }) => {
  //   return (
  //     <View
  //       style={{
  //         flexDirection: 'row',
  //         justifyContent: 'space-between',
  //         alignItems: 'center',
  //       }}>
  //       <Text
  //         style={{
  //           fontFamily: fontFamily.bold,
  //           fontSize: textScale(14),
  //         }}>
  //         {item?.title}
  //       </Text>
  //       <Text
  //         style={{
  //           fontFamily: fontFamily.regular,
  //           fontSize: textScale(14),
  //         }}>
  //         {item?.value}
  //       </Text>
  //     </View>)
  // }
  const RenderOfferView = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: textScale(14),
            paddingHorizontal: moderateScale(15),
            fontFamily: fontFamily.regular,
          }}>
          {strings.AVAILABLE_OFFERS}
        </Text>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: colors.greyMedium,
            marginVertical: moderateScaleVertical(10),
          }}
        />
        <ScrollView style={{ width: '100%' }}>
          {offersList?.length > 0 &&
            offersList.map((el, indx) => {
              // console.log(el);
              return (
                <View
                  key={indx}
                  style={{
                    borderBottomWidth: 1,
                    paddingHorizontal: moderateScale(15),
                    width: '100%',
                    borderBottomColor: colors.greyMedium,
                    marginBottom: moderateScale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: textScale(13),
                      marginBottom: moderateScale(5),
                      fontFamily: fontFamily.regular,
                    }}>
                    {el.name ? el.name : ''}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(11),
                      marginBottom: moderateScale(5),
                      color: colors.textGreyOpcaity7,
                      fontFamily: fontFamily.regular,
                    }}>
                    {el.short_desc ? el.short_desc : ''}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      borderTopWidth: 1,
                      borderTopColor: colors.greyMedium,
                      alignItems: 'center',
                      paddingTop: moderateScaleVertical(15),
                      marginTop: moderateScale(8),
                      paddingBottom: moderateScale(15),
                    }}>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: themeColors.primary_color,
                        borderRadius: moderateScale(3),
                        paddingHorizontal: moderateScale(7),
                        paddingVertical: moderateScale(4),
                        borderStyle: 'dashed',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: textScale(11),
                          fontFamily: fontFamily.regular,
                          textTransform: 'uppercase',
                        }}>
                        {el.name ? el.name : ''}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(`${el.name ? el.name : ''}`);
                        Toast.show(strings.COPIED);
                      }}>
                      <Text
                        style={{
                          fontSize: textScale(11),
                          color: themeColors.primary_color,
                          fontFamily: fontFamily.regular,
                        }}>
                        {strings.TAP_TO_COPY}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  };

  const onChangePinCode = (text) => {
    if (text.length === 6) {
      onCheckVendorPinCode(text);
      setLoadingPinCode(true);
    }
    setSelectedVendorDeliverySlot({});
    setSelectedDate(null);
    setPinCode(text);
  };

  const onCheckVendorPinCode = (pin_code) => {
    actions
      .checkVendorPincode(
        {
          vendor_id: productDetailData?.vendor?.id,
          pincode: pin_code,
        },
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res, 'res....res');
        setLoadingPinCode(false);
        if (!!res?.data) {
          setIsPincodeValid(true);
        } else {
          setIsPincodeValid(false);
        }
      })
      .catch(errorMethod);
  };

  const onDateSelected = async (date) => {
    setLoadingGetSlots(true);
    if (isAppointmentPicker) {
      if (productDetailData?.is_slot_from_dispatch) {
        const apiData = {
          cur_date: moment(appointmentSelectedDate).format("YYYY-MM-DD"),
          product_id: productDetailData?.id
        }
        const apiHeader = {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        }
        actions.getAppointmentSlots(apiData, apiHeader).then((res) => {
          console.log(res, "<===res getAppointmentSlots")
          if (res?.dispatchAgents) {
            if (!isEmpty(res?.dispatchAgents?.slots)) {
              const slots = res?.dispatchAgents?.slots
              setAppointmentDispatcherAgentSlots(slots)
              let allSlots = []
              for (var propName in slots) {
                if (slots.hasOwnProperty(propName)) {
                  var propValue = slots[propName];
                  allSlots.push(propValue)
                }
              }

              setAllDispatcherAgents(res?.dispatchAgents?.agents)
              setAppointmentDispatcherAgentSlots(allSlots)
            }

          } else {
            setAppointmentAvailableSlots(res?.data?.time_slots)
          }

          setLoadingGetSlots(false);
          setAppointmentPicker(false);
          setSelectedAppointmentIndx(null);
          setSelectedAppointmentSlot({})
          setTimeout(() => {
            setAppointmentSlotsModal(true)
          }, 500);
        }).catch((err) => {
          console.log(err, "<==err getAppointmentSlots")
          setLoadingGetSlots(false);
          setAppointmentPicker(false);
          errorMethod(err);
        })
      } else {
        try {
          let vendorId = productDetailData?.vendor_id
          // vendor_id,date,delivery
          const res = await actions.checkVendorSlots(
            `?vendor_id=${vendorId}&date=${moment(appointmentSelectedDate).format("YYYY-MM-DD")}&delivery=${dine_In_Type}`,
            {
              code: appData?.profile?.code,
              // currency: currencies?.primary_currency?.id,
              // language: languages?.primary_language?.id,
              // systemuser: DeviceInfo.getUniqueId(),
              timezone: RNLocalize.getTimeZone(),
              // device_token: DeviceInfo.getUniqueId(),
            },
          );

          console.log(res, "res for slots vendor");
          if (res) {
            setAppointmentAvailableSlots(res)
            setLoadingGetSlots(false);
            setAppointmentPicker(false);
            setSelectedAppointmentIndx(null);
            setSelectedAppointmentSlot({})
            setTimeout(() => {
              setAppointmentSlotsModal(true)
            }, 500);
          }
        } catch (error) {
          setLoadingGetSlots(false);

          console.log('error riased', error);
        }
      };
      return
    }

    setSelectedDate(date);
    actions
      .getVendorShippingSlots(
        {
          delivery_date: moment(date).format('YYYY-MM-DD'),
          product_id: productDetailData?.id,
          vendor_cutoff_time: moment(date).format('hh:mm A'),
        },
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res, '<===res');
        setIsDatePicker(false);
        setLoadingGetSlots(false);
        if (!isEmpty(res?.data)) {
          setAvailableVendorSlots(res?.data);
          setTimeout(() => {
            setAvailableSlotsModal(true);
          }, 700);
        } else {
          setTimeout(() => {
            showError('No available slots found!');
          }, 700);
        }
      })
      .catch((err) => {
        setLoadingGetSlots(false);
        setIsDatePicker(false);
        errorMethod(err);
      });
  };

  const onDoneDeliverySlot = () => {
    if (isTimeIntervals) {
      if (isEmpty(selectedProductInterval)) {
        alert('Please select a slot interval');
        return;
      }
      setAvailableSlotsModal(false);
      setIsTimeIntervals(false);
      return;
    }
    setSelectedProductInterval({});
    if (isEmpty(selectedVendorDeliverySlot)) {
      alert('Please select a slot');
      return;
    }
    setIsLoadingProductSlotIntervals(true);
    actions
      .getProductDeliverySlotsInterval(
        {
          slot_id: selectedVendorDeliverySlot?.delivery_slot?.id,
        },
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        setProductAvailableIntervals(res?.data);
        setIsTimeIntervals(true);
        setIsLoadingProductSlotIntervals(false);

        console.log(res, 'res.............');
      })
      .catch((err) => {
        setIsLoadingProductSlotIntervals(false);
        alert(err?.error || err?.message);
      });
  };

  const deliverSlotModalContent = () => {
    return (
      <View
        style={{
          minHeight: height / 3,
          backgroundColor: colors.white,
          borderTopLeftRadius: moderateScale(10),
          borderTopRightRadius: moderateScale(10),
          padding: moderateScale(10),
          maxHeight: height / 1.7,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: moderateScaleVertical(10),
          }}>
          <Text
            style={{
              fontFamily: fontFamily?.bold,
              fontSize: textScale(16),
            }}>
            Select delivery slot {isTimeIntervals ? 'interval' : ''}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
          }}>
          {isTimeIntervals ? (
            <FlatList
              data={productAvailableIntervals}
              ItemSeparatorComponent={() => (
                <View style={{ height: moderateScaleVertical(10) }} />
              )}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => setSelectedProductInterval(item)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 8,
                    borderWidth: 1,
                    borderColor:
                      selectedProductInterval?.id == item?.id
                        ? themeColors?.primary_color
                        : colors.borderColorB,
                    borderRadius: moderateScale(6),
                  }}>
                  <Image
                    style={{
                      tintColor:
                        selectedProductInterval?.id == item?.id
                          ? themeColors?.primary_color
                          : colors.borderColorB,
                      height: 15,
                      width: 15,
                    }}
                    source={
                      selectedProductInterval?.id == item?.id
                        ? imagePath.radioNewActive
                        : imagePath.radioNewInActive
                    }
                  />
                  <Text
                    style={{
                      fontFamily: fontFamily?.regular,
                      marginLeft: moderateScale(10),
                    }}>
                    {`${item?.title} (${item?.start_time} - ${item?.end_time} ${currencies?.primary_currency?.symbol}${item?.price})`}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={() => (
                <View
                  style={{
                    height: 10,
                  }}
                />
              )}
            />
          ) : (
            <FlatList
              data={availableVendorSlots}
              ItemSeparatorComponent={() => (
                <View style={{ height: moderateScaleVertical(10) }} />
              )}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => setSelectedVendorDeliverySlot(item)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 8,
                    borderWidth: 1,
                    borderColor:
                      selectedVendorDeliverySlot?.id == item?.id
                        ? themeColors?.primary_color
                        : colors.borderColorB,
                    borderRadius: moderateScale(6),
                  }}>
                  <Image
                    style={{
                      tintColor:
                        selectedVendorDeliverySlot?.id == item?.id
                          ? themeColors?.primary_color
                          : colors.borderColorB,
                      height: 15,
                      width: 15,
                    }}
                    source={
                      selectedVendorDeliverySlot?.id == item?.id
                        ? imagePath.radioNewActive
                        : imagePath.radioNewInActive
                    }
                  />
                  <Text
                    style={{
                      fontFamily: fontFamily?.regular,
                      marginLeft: moderateScale(10),
                    }}>
                    {`${item?.delivery_slot?.title} (${item?.delivery_slot?.start_time} - ${item?.delivery_slot?.end_time} ${currencies?.primary_currency?.symbol}${item?.delivery_slot?.price})`}
                  </Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={() => (
                <View
                  style={{
                    height: 10,
                  }}
                />
              )}
            />
          )}
          <ButtonWithLoader
            onPress={onDoneDeliverySlot}
            btnText="Done"
            isLoading={isLoadingProductSlotIntervals}
            btnStyle={{
              backgroundColor: themeColors?.primary_color,
              borderWidth: 0,
              position: 'absolute',
              width: '100%',
              bottom: 0,
            }}
          />
        </View>
      </View>
    );
  };


  const onSlotSelect = (item, index) => {
    const result = allDispatcherAgents.filter(a1 => item?.agent_id.find(a2 => a1.id == a2));
    setAvailableDriversForSlot(result)
    setSelectedAppointmentSlot(item)
    setSelectedAppointmentIndx(index)
    setSelectedAgent({})
  }

  const _onSelecteAgent = (item) => {
    setSelectedAgent(item)
  }


  const AppointmentSlotModal = () => {
    return <View style={{
      backgroundColor: colors.white,
      height: moderateScaleVertical(350),
      borderTopRightRadius: moderateScale(10),
      borderTopLeftRadius: moderateScale(10),
      padding: moderateScale(12)
    }}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: moderateScale(10)
      }}>
        <Text style={{
          fontFamily: fontFamily?.bold,
          fontSize: textScale(14),
        }}>Select slot</Text>
        <TouchableOpacity onPress={() => {
          if (isEmpty(selectedAgent) && productDetailData?.is_show_dispatcher_agent) {
            alert('please select agent')
            return
          }
          setAppointmentSlotsModal(false)
        }}>
          <Text style={{
            fontFamily: fontFamily.bold,
            color: themeColors?.primary_color
          }}>Done</Text>
        </TouchableOpacity>
      </View>
      {!isEmpty(appointmentDispatcherAgentSlots) ?
        <FlatList data={appointmentDispatcherAgentSlots}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{
            height: moderateScaleVertical(10)
          }} />} renderItem={({ item, index }) => <TouchableOpacity onPress={() => onSlotSelect(item, index)} style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderWidth: 1,
            borderColor: colors.borderColorB,
            borderRadius: moderateScale(4)
          }}>
            <Image source={selectedAppointmentIndx == index ? imagePath.radioActive : imagePath.radioInActive} />
            <Text style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(13),
              marginLeft: moderateScale(10)
            }}>{item?.name}</Text>
          </TouchableOpacity>} />
        : <FlatList data={appointmentAvailableSlots}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{
            height: moderateScaleVertical(10)
          }} />} renderItem={({ item, index }) => <TouchableOpacity onPress={() => {
            setSelectedAppointmentSlot(item)
            setSelectedAppointmentIndx(index)
          }} style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderWidth: 1,
            borderColor: colors.borderColorB,
            borderRadius: moderateScale(4)
          }}>
            <Image source={selectedAppointmentIndx == index ? imagePath.radioActive : imagePath.radioInActive} />
            <Text style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(13),
              marginLeft: moderateScale(10)
            }}>{item?.name}</Text>
          </TouchableOpacity>} />}



      <View style={{ flexDirection: 'row', paddingVertical: moderateScaleVertical(10) }}>
        {!!(productDetailData?.is_slot_from_dispatch && productDetailData?.is_show_dispatcher_agent && !isEmpty(availableDriversForSlot)) && availableDriversForSlot.map((item, index) => {
          return (
            <TouchableOpacity style={{ alignItems: 'center', marginHorizontal: moderateScale(10) }}
              onPress={() => _onSelecteAgent(item)}>
              <View style={{ borderWidth: moderateScale(1), borderColor: item?.id == selectedAgent?.id ? themeColors?.primary_color : colors.textGreyLight, height: moderateScaleVertical(42), width: moderateScale(42), borderRadius: moderateScale(20) }}>
                <Image style={{ height: moderateScaleVertical(40), width: moderateScale(40), borderRadius: moderateScale(20) }} source={{ uri: item?.image_url }} />
              </View>
              <Text style={{ fontSize: textScale(9), fontFamily: fontFamily?.bold, color: item?.id == selectedAgent?.id ? themeColors?.primary_color : colors.textGreyLight }}>{item?.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

    </View>
  }

  console.log(themeColors, "variantState =>", variantState);
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
    // isLoadingB={isLoadingC}
    >
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={venderDetail?.name}
        textStyle={{ fontSize: textScale(14) }}
        rightIcon={
          !!data?.showAddToCart
            ? false
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icSearchb
              : imagePath.search
        }
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}
        isShareIcon={imagePath.icShareb}
        onShare={onShare}
      />

      <KeyboardAwareScrollView ref={myRef} showsVerticalScrollIndicator={false}>
        <View style={{ marginHorizontal: moderateScale(16) }}>
          {state.isLoading && <ListEmptyProduct isLoading={state.isLoading} />}

          {!state.isLoading && (
            <>
              {/* //Top section slider */}

              {!!productDetailData?.product_media.length ? (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: moderateScaleVertical(20),
                    justifyContent: 'space-between',
                  }}>
                  {/* <View style={{ flex: 0.2 }}><Image source={imagePath.fav} /></View> */}
                  <View style={{ flex: 1, alignItems: 'center', }}>
                    <Banner2
                      autoPlay={false}
                      resizeMode={getBundleId() == appIds?.eatHalal ? "cover" : "contain"}
                      bannerRef={bannerRef}
                      bannerData={productDetailData?.product_media}
                      sliderWidth={width}
                      itemWidth={width / 1.1}
                      pagination={false}
                      setActiveState={(index) =>
                        updateState({ slider1ActiveSlide: index })
                      }
                      imagestyle={{
                        borderRadius: 8,
                      }}
                      showLightbox={true}
                      cardViewStyle={styles.cardViewStyle}
                      childView={
                        <TouchableOpacity
                          hitSlop={{
                            top: 40,
                            right: 40,
                            left: 40,
                            bottom: 40,
                          }}
                          onPress={() => _onAddtoWishlist(productDetailData)}>
                          {productDetailData?.is_wishlist ? (
                            <View
                              style={{
                                position: 'absolute',
                                right: moderateScale(10),
                                top: moderateScale(10),
                              }}>
                              {!!productDetailData?.inwishlist ? (
                                <Image
                                  style={{
                                    tintColor: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : themeColors.primary_color,
                                  }}
                                  source={imagePath.whiteFilledHeart}
                                />
                              ) : (
                                <Image
                                  style={{
                                    tintColor: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : themeColors.primary_color,
                                  }}
                                  source={imagePath.heart2}
                                />
                              )}
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      }
                      onPress={onImageLargeView}
                    />

                    <View style={{ paddingTop: 5 }}>
                      <Pagination
                        dotsLength={productDetailData?.product_media?.length}
                        activeDotIndex={state.slider1ActiveSlide}
                        dotColor={'grey'}
                        dotStyle={[styles.dotStyle]}
                        inactiveDotColor={colors.black}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.8}
                      />
                    </View>
                  </View>
                </View>
              ) : null}

              {/* Product Name and Branc detail */}

              <View style={{ marginTop: moderateScaleVertical(10) }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      numberOfLines={2}
                      style={
                        isDarkMode
                          ? [
                            styles.productName,
                            { color: MyDarkTheme.colors.text },
                          ]
                          : { ...styles.productName, flex: 1 }
                      }>
                      {productDetailData?.translation[0]?.title}
                    </Text>
                    {getBundleId() !== appIds.danielleBejjani ||
                      Number(productPriceData?.price) !== 0 ? (
                      <Text
                        style={{
                          ...styles.productPrice,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}>
                        {tokenConverterPlusCurrencyNumberFormater(
                          Number(productPriceData?.price) *
                          Number(productQuantityForCart),
                          digit_after_decimal,
                          additional_preferences,
                          currencies?.primary_currency?.symbol,
                        )}
                      </Text>
                    ) : null}
                  </View>
                </View>

                <View style={styles.flexView}>
                  <View>
                    <Text
                      style={{
                        ...commonStyles.mediumFont12,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity43,
                      }}>
                      {strings.IN}{' '}
                      {
                        productDetailData?.category?.category_detail
                          ?.translation[0]?.name
                      }
                    </Text>
                    {!!productDetailData?.vendor?.is_seller && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: moderateScaleVertical(6),
                        }}>
                        <Image
                          source={{
                            uri: getImageUrl(
                              seller_platform_logo?.proxy_url,
                              seller_platform_logo?.image_path,
                              '200/200',
                            ),
                          }}
                          resizeMode="contain"
                          style={{
                            height: 30,
                            width: 30,
                          }}
                        />
                        <Text
                          style={{
                            marginLeft: moderateScale(7),
                            fontFamily: fontFamily?.regular,
                            color: colors.black,
                          }}>
                          {seller_sold_title}
                        </Text>
                      </View>
                    )}
                  </View>

                  {(!!appData?.profile?.preferences?.rating_check && productDetailData?.averageRating !== null) && (
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
                        rating={parseInt(
                          Number(productDetailData?.averageRating).toFixed(1),
                        )}
                        fullStarColor={colors.yellowB}
                        starSize={8}
                        containerStyle={{ width: width / 9 }}
                      />
                    </View>
                  )}
                </View>
                {productTotalQuantity == 0 && !!typeId && typeId !== 8 && (
                  <View style={{ justifyContent: 'center' }}>
                    <Text
                      style={
                        stylesFunc({
                          themeColors,
                          fontFamily,
                          productTotalQuantity,
                        }).productTypeAndBrandValue
                      }>
                      {productDetailData?.has_inventory == 0 ||
                        (!!productTotalQuantity && !!productTotalQuantity != 0) ||
                        (!!typeId && typeId == 8) ||
                        !!productDetailData?.sell_when_out_of_stock
                        ? ''
                        : strings.OUT_OF_STOCK}
                    </Text>
                  </View>
                )}
              </View>
              {productDetailData?.replaceable ||
                productDetailData?.returnable ? (
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: moderateScaleVertical(10),
                    marginHorizontal: moderateScale(10),
                  }}>
                  <Image source={imagePath.icRefundable} />
                  <Text
                    style={{
                      marginLeft: moderateScale(10),
                      fontFamily: fontFamily.regular,
                      fontSize: textScale(12),
                      color: colors.textGrey,
                    }}>
                    {strings.WE_HAVE}{' '}
                    {!!productDetailData?.is_return_days
                      ? productDetailData?.return_days + ` ${strings.DAYS} `
                      : ''}
                    {!!productDetailData?.replaceable ? strings.REPLACABLE : ''}
                    {!!productDetailData?.replaceable &&
                      productDetailData?.returnable
                      ? ` ${strings.AND} `
                      : ''}
                    {!!productDetailData?.returnable ? strings.RETURNABLE : ''} {strings.POLICY_ON_THIS_PRODUCT}
                  </Text>
                </View>
              ) : null}

              {!isEmpty(offersList) ? (
                <TouchableOpacity
                  onPress={() =>
                    updateState({ isOffersModalVisible: !isOffersModalVisible })
                  }
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: moderateScaleVertical(16),
                    borderTopWidth: 1,
                    borderColor: '#EBEBEB',
                    marginTop: moderateScaleVertical(10),
                  }}>
                  <Text
                    style={{
                      ...styles.milesTxt,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      opacity: 1,
                      fontSize: textScale(10),
                    }}>
                    All Offers
                  </Text>
                  <Image
                    source={imagePath.icBackb}
                    style={{
                      transform: [{ rotate: '-180deg' }],
                      width: moderateScale(11),
                      height: moderateScale(11),
                      resizeMode: 'contain',
                      marginLeft: moderateScale(6),
                    }}
                  />
                </TouchableOpacity>
              ) : null}

              {/* 
               {!!productDetailData?.delaySlot ?
                    <Text style={{
                      ...commonStyles.mediumFont14Normal,
                      fontSize: textScale(10),
                      textAlign: 'left',
                      color: colors.redB,
                      marginTop: moderateScaleVertical(8)
                    }}>{strings.WE_ARE_NOT_ACCEPTING} {productDetailData?.delaySlot}</Text>
                    : null
                  }            */}

              <HorizontalLine
                lineStyle={{ marginVertical: moderateScaleVertical(16) }}
              />

              {/* Product description */}

              {plainHtml != null ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.descriptiontitle,
                              { color: MyDarkTheme.colors.text },
                            ]
                            : styles.descriptiontitle
                        }>
                        {strings.DESCRIPTION}
                      </Text>

                      <RenderHtml
                        contentWidth={width}
                        source={{ html: plainHtml }}
                        tagsStyles={{
                          p: {
                            color: isDarkMode ? colors.white : colors.black,
                            textAlign: 'left',
                          },
                        }}
                      />
                      {/* <HTMLView
                        value={plainHtml}
                        stylesheet={{div: styles.descriptionStyle}}
                      /> */}
                    </View>
                  </View>
                  <HorizontalLine
                    lineStyle={{ marginVertical: moderateScaleVertical(14) }}
                  />
                </>
              ) : null}

              {(!!productDetailData?.vendor?.hyper_local_delivery ||
                !!productDetailData?.vendor?.next_day_delivery ||
                !!productDetailData?.vendor?.same_day_delivery) && (
                  <View
                    style={{
                      marginBottom: moderateScaleVertical(15),
                    }}>
                    <Text
                      style={{
                        fontFamily: fontFamily?.bold,
                        fontSize: textScale(12),
                        color: colors.black,
                      }}>
                      Enter Pincode for hassale free timely delivery
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'space-between',
                        marginTop: moderateScaleVertical(10),
                      }}>
                      <View
                        style={{
                          flex: 0.48,
                        }}>
                        <BorderTextInput
                          onChangeText={onChangePinCode}
                          value={pinCode}
                          placeholder={'Enter Pincode'}
                          containerStyle={{
                            flex: 1,
                            borderRadius: moderateScale(10),
                            height: moderateScaleVertical(40),
                          }}
                          keyboardType={'number-pad'}
                          marginBottom={0}
                        />
                        {!isPincodeValid &&
                          pinCode.length == 6 &&
                          !isLoadingPinCode && (
                            <Text
                              style={{
                                textAlign: 'right',
                                color: colors.redB,
                                marginRight: 5,
                                fontSize: textScale(10),
                              }}>
                              Enter valid pincode
                            </Text>
                          )}
                      </View>
                      {isLoadingPinCode && pinCode.length == 6 ? (
                        <Text
                          style={{
                            flex: 0.48,
                            color: colors.black,
                          }}>
                          Loading...
                        </Text>
                      ) : (
                        <View
                          style={{
                            flex: 0.48,
                          }}>
                          {isPincodeValid && pinCode.length == 6 && (
                            <TouchableOpacity
                              onPress={() => {
                                setAvailableVendorSlots([]);
                                setSelectedVendorDeliverySlot({});
                                setIsDatePicker(true);
                              }}
                              style={{
                                borderWidth: 1,
                                borderColor: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : colors.borderLight,
                                flex: 1,
                                height: moderateScaleVertical(40),
                                paddingHorizontal: moderateScale(5),
                                borderRadius: moderateScale(10),
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: fontFamily?.regular,
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.textGreyB,
                                }}>
                                {selectedDate
                                  ? moment(selectedDate).format(
                                    'YYYY-MM-DD hh:mm A',
                                  )
                                  : 'Select Date'}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                    {!isEmpty(selectedProductInterval) &&
                      isPincodeValid &&
                      pinCode.length == 6 && (
                        <Text
                          style={{
                            fontSize: textScale(11),
                            textAlign: 'right',
                            marginRight: moderateScale(5),
                            marginTop: moderateScale(5),
                          }}>{`${selectedProductInterval?.title} (${selectedProductInterval?.start_time} - ${selectedProductInterval?.end_time} ${currencies?.primary_currency?.symbol}${selectedProductInterval?.price})`}</Text>
                      )}
                  </View>
                )}

              {/* // Product variants */}
              {variantSet && variantSet.length ? showAllVariants() : null}
              {/* {addonSet && addonSet.length ? showAllAddons() : null} */}
              {typeId == 10 ? (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginVertical: moderateScaleVertical(10),
                    }}>
                    <TouchableOpacity
                      onPress={() => updateState({ isRentalStartDatePicker: true })}>
                      <Text
                        style={{
                          fontSize: moderateScale(13),
                          fontFamily: fontFamily.bold,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}>
                        Start Date
                      </Text>
                      <Text
                        style={{
                          fontSize: moderateScale(12),
                          fontFamily: fontFamily.regular,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}>
                        {!!startDateRental
                          ? moment(startDateRental).format('MM/DD/YY hh:mm A')
                          : ''}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => updateState({ isRentalEndDatePicker: true })}>
                      <Text
                        style={{
                          fontSize: moderateScale(13),
                          fontFamily: fontFamily.bold,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}>
                        End Date
                      </Text>
                      <Text
                        style={{
                          fontSize: moderateScale(12),
                          fontFamily: fontFamily.regular,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}>
                        {!!endDateRental
                          ? moment(endDateRental).format('MM/DD/YY hh:mm A')
                          : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{
                      fontSize: moderateScale(13),
                      fontFamily: fontFamily.bold,
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    }}>
                    Duration:
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      marginVertical: 5,
                    }}>
                    <TouchableOpacity
                      onPress={() => addRemoveDuration(2)}
                      style={{
                        borderRightWidth: 1,
                        flex: 0.3,
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <Text>{'<'}</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        flex: 0.4,
                        textAlign: 'center',
                        fontSize: moderateScale(13),
                        fontFamily: fontFamily.regular,
                        color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      }}>
                      {getHourAndMinutes(rentalProductDuration)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => addRemoveDuration(1)}
                      style={{
                        borderLeftWidth: 1,
                        flex: 0.3,
                        alignItems: 'center',
                        padding: 5,
                      }}>
                      <Text> {'>'} </Text>
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      fontSize: moderateScale(13),
                      fontFamily: fontFamily.regular,
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                      }}>
                      {' '}
                      {tokenConverterPlusCurrencyNumberFormater(
                        productDetailData?.variant[0]?.actual_price,
                        digit_after_decimal,
                        additional_preferences,
                        currencies?.primary_currency?.symbol,
                      )}
                    </Text>{' '}
                    for first{' '}
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                      }}>
                      {productDetailData?.minimum_duration}
                    </Text>{' '}
                    hour{' '}
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                      }}>
                      {productDetailData?.minimum_duration_min}
                    </Text>{' '}
                    min
                  </Text>
                  <Text
                    style={{
                      fontSize: moderateScale(13),
                      fontFamily: fontFamily.regular,
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    }}>
                    Extra duration will be charged{' '}
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                      }}>
                      {tokenConverterPlusCurrencyNumberFormater(
                        productDetailData?.variant[0]?.incremental_price,
                        digit_after_decimal,
                        additional_preferences,
                        currencies?.primary_currency?.symbol,
                      )}
                    </Text>{' '}
                    per{' '}
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                      }}>
                      {productDetailData?.additional_increments}
                    </Text>{' '}
                    hour and {' '}
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                      }}>
                      {tokenConverterPlusCurrencyNumberFormater(
                        productDetailData?.variant[0]?.incremental_price_per_min,
                        digit_after_decimal,
                        additional_preferences,
                        currencies?.primary_currency?.symbol,
                      )} per
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                      }}>
                      {' '}
                      {productDetailData?.additional_increments_min}
                    </Text>{' '}
                    min
                  </Text>
                </View>
              ) : null}

              {showErrorMessageTitle ? (
                <Text
                  style={{
                    fontSize: textScale(14),
                    color: colors.redB,
                    fontFamily: fontFamily.medium,
                    marginBottom: moderateScaleVertical(16),
                  }}>
                  {strings.NOVARIANTPRODUCTAVAILABLE}
                </Text>
              ) : null}
              {
                dine_In_Type == 'appointment' && productDetailData?.mode_of_service === 'schedule' &&
                <View style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <View style={{
                    flex: 0.45
                  }}>
                    <Text style={{
                      fontFamily: fontFamily?.bold,
                      color: colors.black,
                      fontSize: textScale(14)
                    }}>Appointment</Text>
                    <TouchableOpacity onPress={() => setAppointmentPicker(true)} style={{
                      backgroundColor: colors.backGroundGreyD,
                      paddingVertical: moderateScaleVertical(8),
                      paddingHorizontal: moderateScale(7),
                      marginVertical: moderateScale(8),
                      borderRadius: moderateScale(8)

                    }}><Text style={{
                      fontFamily: fontFamily?.regular,
                      color: colors.black,
                      fontSize: textScale(13)
                    }}>{appointmentSelectedDate ? moment(appointmentSelectedDate).format("DD-MM-YYYY") : "Select Date"}</Text></TouchableOpacity>

                  </View>
                  {(!!appointmentSelectedDate) && <View style={{
                    flex: 0.45
                  }}>
                    <Text style={{
                      fontFamily: fontFamily?.bold,
                      color: colors.black,
                      fontSize: textScale(14)
                    }}>Slots</Text>
                    <TouchableOpacity onPress={() => setAppointmentSlotsModal(true)} style={{
                      backgroundColor: colors.backGroundGreyD,
                      paddingVertical: moderateScaleVertical(8),
                      paddingHorizontal: moderateScale(7),
                      marginVertical: moderateScale(8),
                      borderRadius: moderateScale(8)
                    }}><Text style={{
                      fontFamily: fontFamily?.regular,
                      color: colors.black,
                      fontSize: textScale(13)
                    }}>{(!isEmpty(selectedAppointmentSlot)) ? selectedAppointmentSlot?.name : "Select Slot"}</Text></TouchableOpacity>
                  </View>}
                </View>

              }

              {/* // Recurring Product variants */}
              {!!data?.is_recurring_booking &&
                <View style={[{ marginBottom: moderateScaleVertical(25), paddingHorizontal: moderateScale(2), flexDirection: 'row', alignItems: 'center' }]}>
                  <Text
                    style={[
                      styles.variantValue,
                      {
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        fontSize: textScale(12),
                      },
                    ]}>
                    Reccuring
                  </Text>
                  <TouchableOpacity
                    style={{ paddingLeft: moderateScale(5) }}
                    onPress={() => {
                      updateAddonState({ reccuringCheckBox: !reccuringCheckBox })
                      resetVariantState()
                    }}>
                    <Image
                      style={{ tintColor: themeColors.primary_color, height: moderateScale(14), width: moderateScale(14) }}
                      source={
                        reccuringCheckBox
                          ? imagePath.checkBox2Active
                          : imagePath.checkBox2InActive
                      }
                    />
                  </TouchableOpacity>
                </View>
              }

              {reccuringCheckBox &&
                <Reccuring
                  planValues={planValues}
                  weekDays={weekDays}
                  quickSelection={quickSelection}
                  showCalendar={showCalendar}
                  reccuringCheckBox={reccuringCheckBox}
                  selectedPlanValues={selectedPlanValues}
                  selectedWeekDaysValues={selectedWeekDaysValues}
                  selectedQuickSelectionValue={selectedQuickSelectionValue}
                  minimumDate={minimumDate}
                  initDate={initDate}
                  start={start}
                  end={end}
                  period={period}
                  disabledDaysIndexes={disabledDaysIndexes}
                  selectedDaysIndexes={selectedDaysIndexes}
                  date={date}
                  showDateTimeModal={showDateTimeModal}
                  slectedDate={slectedDate}
                  updateAddonState={updateAddonState}
                />}

              {/* Add to Cart button */}
              {(productDetailData?.has_inventory == 0 ||
                (!!productTotalQuantity && !!productTotalQuantity != 0) ||
                (!!typeId && typeId == 8) ||
                !!productDetailData?.sell_when_out_of_stock) &&
                (false ? null : showErrorMessageTitle ? null : (
                  <View
                    style={{
                      marginBottom: moderateScaleVertical(25),
                    }}>
                    {Number(productPriceData?.price) !== 0 ||
                      getBundleId() == appIds.danielleBejjani ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',

                          backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.background
                            : colors.white,
                        }}>
                        {getBundleId() !== appIds.danielleBejjani && typeId !== 10 && dine_In_Type != 'appointment' ?
                          <View
                            style={{
                              ...commonStyles.buttonRect,
                              ...styles.incDecBtnStyle,
                              backgroundColor: getColorCodeWithOpactiyNumber(
                                themeColors.primary_color.substr(1),
                                15,
                              ),
                              flex: 0.4,
                              borderColor: themeColors?.primary_color,
                              height: moderateScale(38),
                              justifyContent: 'space-between',
                              marginRight: moderateScale(8),


                            }}
                          >
                            <TouchableOpacity
                              disabled={
                                !productDetailData?.vendor?.show_slot &&
                                !!productDetailData?.vendor?.is_vendor_closed
                              }
                              onPress={() => productIncrDecreamentForCart(2)}
                            >
                              <Text
                                style={{
                                  ...commonStyles.mediumFont14,
                                  color: themeColors?.primary_color,
                                  fontFamily: fontFamily.bold,
                                }}>
                                -
                              </Text>
                            </TouchableOpacity>
                            <TextInput
                              keyboardType={"number-pad"}
                              onChangeText={(value) =>
                                updateState({
                                  productQuantityForCart:
                                    value == '' ? 1 : Number(value),
                                })
                              }
                              style={{
                                maxWidth: moderateScale(60),
                                marginLeft: moderateScale(4)
                              }}
                              value={`${productQuantityForCart.toString()}`}
                            />

                            <TouchableOpacity
                              disabled={
                                !productDetailData?.vendor?.show_slot &&
                                !!productDetailData?.vendor?.is_vendor_closed
                              }
                              onPress={() => productIncrDecreamentForCart(1)}
                              hitSlop={hitSlopProp}>
                              <Text
                                style={{
                                  ...commonStyles.mediumFont14,
                                  color: themeColors?.primary_color,
                                  fontFamily: fontFamily.bold,
                                }}>+</Text>
                            </TouchableOpacity>
                          </View> : null}

                        <View />
                        <View style={{ flex: 1 }}>
                          <GradientButton
                            indicator={isLoadingC}
                            disabled={
                              // !productDetailData?.vendor?.closed_store_order_scheduled
                              !productDetailData?.vendor
                                ?.closed_store_order_scheduled &&
                              !!productDetailData?.vendor?.is_vendor_closed
                            }
                            indicatorColor={colors.white}
                            colorsArray={[
                              themeColors.primary_color,
                              themeColors.primary_color,
                            ]}
                            textStyle={{
                              fontFamily: fontFamily.medium,
                              textTransform: 'capitalize',
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.white,
                            }}
                            onPress={addToCart}
                            btnText={`${strings.ADD
                              }  ${tokenConverterPlusCurrencyNumberFormater(
                                Number(productPriceData?.price) *
                                Number(productQuantityForCart),
                                digit_after_decimal,
                                additional_preferences,
                                currencies?.primary_currency?.symbol,
                              )}`}
                            btnStyle={{
                              borderRadius: moderateScale(4),
                              height: moderateScale(38),
                              opacity: productDetailData?.vendor
                                ?.closed_store_order_scheduled
                                ? 1
                                : productDetailData?.vendor?.is_vendor_closed
                                  ? 0.3
                                  : 1,
                            }}
                          />
                        </View>
                      </View>
                    ) : null}
                    {!productDetailData?.vendor?.closed_store_order_scheduled &&
                      !!productDetailData?.vendor?.is_vendor_closed ? (
                      <Text
                        style={{
                          ...commonStyles.regularFont11,
                          color: colors.redB,
                        }}>
                        {strings.VENDOR_NOT_ACCEPTING_ORDERS}
                      </Text>
                    ) : null}
                  </View>
                ))}

              <AddonModal
                productdetail={productDetailData}
                isVisible={isVisibleAddonModal}
                onClose={() => setModalVisibleForAddonModal(false)}
                // onPress={(data) => alert('123')}
                addonSet={addonSet}
              // onPress={currentLocation}
              />
            </>
          )}
        </View>
        {/* related product */}

        <View style={{}}>
          {!!relatedProducts && !!relatedProducts.length && (
            <Text
              style={{
                ...styles.descriptiontitle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                marginLeft: moderateScale(16),
              }}>
              {strings.YOUMAYALSO}
            </Text>
          )}
          <FlatList
            data={(!state.isLoading && relatedProducts) || []}
            renderItem={renderProduct}
            keyExtractor={(item, index) => String(index)}
            keyboardShouldPersistTaps="always"
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1, marginVertical: moderateScaleVertical(10) }}
            contentContainerStyle={{ flexGrow: 1 }}
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => (
              <View style={{ marginLeft: moderateScale(8) }} />
            )}
            ListFooterComponent={() => (
              <View style={{ marginLeft: moderateScale(8) }} />
            )}
          // ListEmptyComponent={<ListEmptyProduct isLoading={state.isLoading}/>}
          />
        </View>
        <View style={{ marginBottom: moderateScale(40) }} />
      </KeyboardAwareScrollView>

      <Modal
        isVisible={isProductImageLargeViewVisible}
        style={{
          height: height,
          width: width,
          margin: 0,
        }}
        animationInTiming={600}>
        {renderImageZoomingView()}
      </Modal>
      <Modal
        key={'4'}
        isVisible={isRentalStartDatePicker || isRentalEndDatePicker}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() =>
          updateState({
            isRentalStartDatePicker: false,
            isRentalEndDatePicker: false,
          })
        }>
        <View
          style={{
            ...styles.modalView,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                updateState({
                  isRentalStartDatePicker: false,
                  isRentalEndDatePicker: false,
                })
              }>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.horizontalLine,
              borderBottomColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}
          />

          <DatePicker
            locale={languages?.primary_language?.sort_code}
            date={isRentalStartDatePicker ? startDateRental : endDateRental}
            textColor={isDarkMode ? colors.white : colors.blackB}
            mode="datetime"
            minimumDate={isRentalEndDatePicker ? startDateRental : new Date()}
            onDateChange={(value) => onDateChange(value)}
          />
        </View>
      </Modal>
      <Modal
        key={'5'}
        isVisible={isDatePicker || isAppointmentPicker}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => {
          setIsDatePicker(false);
          setSelectedDate(null);
        }}>
        <View
          style={{
            ...styles.modalView,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (isAppointmentPicker) {
                  setAppointmentPicker(false)
                  setAppointmentSelectedDate('')
                }
                else {
                  setIsDatePicker(false);
                  setSelectedDate(null);
                }
              }}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.horizontalLine,
              borderBottomColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}
          />
          <DatePicker
            locale={languages?.primary_language?.sort_code}
            date={isAppointmentPicker ? (appointmentSelectedDate || new Date()) : (selectedDate || new Date())}
            textColor={isDarkMode ? colors.white : colors.blackB}
            mode="date"
            minimumDate={new Date()}
            onDateChange={(value) => isAppointmentPicker ? setAppointmentSelectedDate(value) : setSelectedDate(value)}
          />
          <ButtonWithLoader
            onPress={() => onDateSelected(isAppointmentPicker ? (appointmentSelectedDate || new Date()) : (selectedDate || new Date()))}
            btnText="Done"
            isLoading={isLoadingGetSlots}
            btnStyle={{
              backgroundColor: themeColors?.primary_color,
              borderWidth: 0,
            }}
          />
        </View>
      </Modal>
      <BottomSlideModal
        mainContainView={RenderOfferView}
        isModalVisible={isOffersModalVisible}
        mainContainerStyle={{
          width: '100%',
          paddingHorizontal: 0,
          marginHorizontal: 0,
          maxHeight: moderateScale(450),
        }}
        innerViewContainerStyle={{
          width: '100%',
          paddingHorizontal: 0,
          marginHorizontal: 0,
        }}
        onBackdropPress={() =>
          updateState({ isOffersModalVisible: !isOffersModalVisible })
        }
      />
      <ReactNativeModal
        isVisible={isAvailableSlotsModal}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        {deliverSlotModalContent()}
      </ReactNativeModal>
      <ReactNativeModal
        isVisible={isAppointmentSlotsModal}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <AppointmentSlotModal />
      </ReactNativeModal>
    </WrapperContainer >
  );
}
const htmlStyle = StyleSheet.create({
  h2: {
    color: '#e5e5e7', // make links coloured pink
  },
});
