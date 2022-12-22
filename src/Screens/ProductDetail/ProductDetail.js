import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep, isEmpty} from 'lodash';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
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
import {useDarkMode} from 'react-native-dark-mode';
import DatePicker from 'react-native-date-picker';
import DeviceInfo, {getBundleId} from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal, {ReactNativeModal} from 'react-native-modal';
import RenderHtml from 'react-native-render-html';
import Share from 'react-native-share';
import {Pagination} from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import Banner2 from '../../Components/Banner2';
import BottomSlideModal from '../../Components/BottomSlideModal';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import HorizontalLine from '../../Components/HorizontalLine';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import ProductsComp from '../../Components/ProductsComp';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, {hitSlopProp} from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

import {MyDarkTheme} from '../../styles/theme';
import {
  addRemoveMinutes,
  getHourAndMinutes,
  tokenConverterPlusCurrencyNumberFormater,
} from '../../utils/commonFunction';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import AddonModal from './AddonModal';
import ListEmptyProduct from './ListEmptyProduct';
import stylesFunc from './styles';
import Toast from 'react-native-simple-toast';
import Clipboard from '@react-native-community/clipboard';
import BorderTextInput from '../../Components/BorderTextInput';

export default function ProductDetail({route, navigation}) {
  console.log('my route', route.params.data);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const cartData = useSelector((state) => state?.cart?.cartItemCount);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences;
  const {productListData} = useSelector((state) => state?.product);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});
  const reloadData = useSelector((state) => state?.reloadData?.reloadData);
  const {data} = route.params;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    isLoading: true,
    isLoadingB: false,
    isLoadingC: false,
    productId: data?.item?.id || data?.id,
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
  //Saving the initial state
  const initialState = cloneDeep(state);
  const userData = useSelector((state) => state?.auth?.userData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {bannerRef} = useRef();
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

  const customRight = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={imagePath.search} />
      </View>
    );
  };

  let plainHtml = productDetailData?.translation[0]?.body_html || null;
  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  // useEffect(() => {
  //   updateState({
  //     productQuantityForCart: !!productDetailData?.minimum_order_count
  //       ? productDetailData?.minimum_order_count
  //       : 1,
  //   });
  // }, [productQuantityForCart]);

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
      let options = {url: hyperLink};
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
            console.log('banner images', imageUri);
            FastImage.preload([{uri: imageUri}]);
          });
        }

        // const imageUrl = res.data?.image?.path
        // ? getImageUrl(
        //   item.image.path.image_fit,
        //   item.image.path.image_path,
        //   '1000/1000',
        // )
        // : getImageUrl(item.image.image_fit, item.image.image_path, '1000/1000');
        updateState({
          productAttributes: res?.data?.product_attribute,
          offersList: res?.data?.coupon_list,
          productDetailNew: res?.data?.products,
          productDetailData: res.data.products,
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
          updateState({variantSet: res.data.products.variant_set});
        }
      })
      .catch((error) => console.log(error, 'error'));
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
        {text: strings.CLEAR_CART2, onPress: () => clearCart()},
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
        showError(error?.message || error?.error);
      }
    }
  };

  const errorMethodSecond = (error, addonSet) => {
    if (error?.message?.alert == 1) {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      // showError(error?.message?.error || error?.error);

      Alert.alert('', strings.ALREADY_EXIST, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: strings.CLEAR_CART2, onPress: () => clearCart(addonSet)},
      ]);
    } else {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      showError(error?.message || error?.error);
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
            updateState({productDetailData: item});
          } else {
            item.inwishlist = {product_id: item.id};
            updateState({productDetailData: item});
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
      console.log(variantSetData, 'variantSetData callback');
      if (variantSetData.length) {
        updateState({btnLoader: true});
        getProductDetailBasedOnFilter(variantSetData);
      } else {
        getProductDetail();
      }
    }
  };

  const checkProductAvailibility = () => {
    console.log(productDetailNew, 'productDetailNew....productDetailNew');
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
    const {options, type, variant_type_id} = item;
    console.log('variantSetValuevariantSetValue', item);
    if (type == 1) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => updateState({selectedVariant: item})}
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
                  onPress={() => updateState({isRentalStartDatePicker: true})}>
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
                  onPress={() => updateState({isRentalEndDatePicker: true})}>
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
                    productDetailNew?.actual_price,
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
                  {productDetailNew?.product?.minimum_duration}
                </Text>{' '}
                hour{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {productDetailNew?.product?.minimum_duration_min}
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
                    productDetailNew?.incremental_price,
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
                  {productDetailNew?.product?.additional_increments}
                </Text>{' '}
                hour{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {' '}
                  {productDetailNew?.product?.additional_increments_min}
                </Text>{' '}
                min
              </Text>
              {/* {console.log(
                productDetailNew,
                'productDetailNew....productDetailNew',
              )} */}
            </View>
          ) : null}
        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => updateState({selectedVariant: item})}
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
        onBackdropPress={() => updateState({selectedVariant: null})}>
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
              onPress={() => updateState({selectedVariant: null})}>
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
        onBackdropPress={() => updateState({selectedVariant: null})}>
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
              onPress={() => updateState({selectedVariant: null})}>
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

  const renderVariantSet = ({item, index}) => {
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
      <View style={{marginBottom: moderateScaleVertical(16)}}>
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

  useEffect(() => {
    if (data?.addonSetData && data?.randomValue) {
      updateState({addonSet: data?.addonSetData});
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
    const addon_ids = [];
    const addon_options = [];
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
    data['start_date_time'] = String(
      moment(startDateRental).format('YYYY-MM-DD hh:mm:ss'),
    );
    data['end_date_time'] = String(
      moment(endDateRental).format('YYYY-MM-DD hh:mm:ss'),
    );
    data['total_booking_time'] = rentalProductDuration;
    data['additional_increments_hrs_min'] =
      rentalProductDuration -
      Number(productDetailNew?.product?.minimum_duration) * 60 +
      Number(productDetailNew?.product?.minimum_duration_min);
    if (addonSet && addonSet.length) {
      // console.log(addonSetData, 'addonSetData');
      data['addon_ids'] = addon_ids;
      data['addon_options'] = addon_options;
    }
    console.log(data, 'data for cart');
    updateState({isLoadingC: true, isVisibleAddonModal: false});
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

        updateState({isLoadingC: false});
        navigation.goBack();
      })
      .catch((error) => errorMethodSecond(error, addonSet));
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
    {
      addonSet && addonSet.length
        ? updateState({isVisibleAddonModal: true})
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

  const renderProduct = ({item, index}) => {
    // item.showAddToCart = true;
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.push(navigationStrings.PRODUCTDETAIL, {data: item})
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
    updateState({isVisibleAddonModal: false});
  };

  const onclickBanner = () => {
    updateState({lightBox: true});
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
          renderHeader={() => <View style={{backgroundColor: 'red'}}></View>}
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
              <Text style={{color: colors.white}}>
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
        <ScrollView style={{width: '100%'}}>
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
      alert('dksjfkdjf');
    }
    setPinCode(text);
  };

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
        textStyle={{fontSize: textScale(14)}}
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
        <View style={{marginHorizontal: moderateScale(16)}}>
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
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <Banner2
                      autoPlay={false}
                      resizeMode="contain"
                      bannerRef={bannerRef}
                      bannerData={productDetailData?.product_media}
                      sliderWidth={width}
                      itemWidth={width / 1.1}
                      pagination={false}
                      setActiveState={(index) =>
                        updateState({slider1ActiveSlide: index})
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

                    <View style={{paddingTop: 5}}>
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

              <View style={{marginTop: moderateScaleVertical(10)}}>
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
                              {color: MyDarkTheme.colors.text},
                            ]
                          : {...styles.productName, flex: 1}
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

                  {productDetailData?.averageRating !== null && (
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
                        containerStyle={{width: width / 9}}
                      />
                    </View>
                  )}
                </View>
                {productTotalQuantity == 0 && !!typeId && typeId !== 8 && (
                  <View style={{justifyContent: 'center'}}>
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
                    We have{' '}
                    {productDetailData?.is_return_days
                      ? productDetailData?.return_days + ' days '
                      : ''}
                    {productDetailData?.replaceable ? 'replaceable' : ''}
                    {productDetailData?.replaceable &&
                    productDetailData?.returnable
                      ? ' and '
                      : ''}
                    {productDetailData?.returnable ? 'returnable' : ''} policy
                    on this product!
                  </Text>
                </View>
              ) : null}

              {!isEmpty(offersList) ? (
                <TouchableOpacity
                  onPress={() =>
                    updateState({isOffersModalVisible: !isOffersModalVisible})
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
                      transform: [{rotate: '-180deg'}],
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
                lineStyle={{marginVertical: moderateScaleVertical(16)}}
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
                                {color: MyDarkTheme.colors.text},
                              ]
                            : styles.descriptiontitle
                        }>
                        {strings.DESCRIPTION}
                      </Text>

                      <RenderHtml
                        contentWidth={width}
                        source={{html: plainHtml}}
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
                    lineStyle={{marginVertical: moderateScaleVertical(14)}}
                  />
                </>
              ) : null}

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
                  <BorderTextInput
                    onChangeText={onChangePinCode}
                    value={pinCode}
                    placeholder={'Enter Pincode'}
                    containerStyle={{
                      flex: 0.48,
                      borderRadius: moderateScale(10),
                      height: moderateScaleVertical(40),
                    }}
                    keyboardType={'number-pad'}
                    marginBottom={0}
                  />
                  <TouchableOpacity
                    onPress={() => setAvailableSlotsModal(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.borderLight,
                      flex: 0.48,
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
                      Select Date
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* // Product variants */}
              {variantSet && variantSet.length ? showAllVariants() : null}
              {/* {addonSet && addonSet.length ? showAllAddons() : null} */}

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
                        {getBundleId() !== appIds.danielleBejjani ? (
                          <View
                            style={{
                              ...commonStyles.buttonRect,
                              ...styles.incDecBtnStyle,
                              backgroundColor: getColorCodeWithOpactiyNumber(
                                themeColors.primary_color.substr(1),
                                15,
                              ),
                              flex: 0.3,
                              borderColor: themeColors?.primary_color,
                              height: moderateScale(38),
                              justifyContent: 'space-between',
                              marginRight: moderateScale(8),
                            }}
                            // onPress={onPress}
                          >
                            <TouchableOpacity
                              disabled={
                                !productDetailData?.vendor?.show_slot &&
                                !!productDetailData?.vendor?.is_vendor_closed
                              }
                              onPress={() => productIncrDecreamentForCart(2)}
                              // hitSlop={hitSlopProp}
                              // style={{
                              //   flex: 0.2,

                              // }}
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
                              style={{
                                ...commonStyles.buttonRect,
                                ...styles.incDecBtnStyle,
                                backgroundColor: getColorCodeWithOpactiyNumber(
                                  themeColors.primary_color.substr(1),
                                  15,
                                ),
                                borderColor: themeColors?.primary_color,
                                height: moderateScale(38),
                                justifyContent: 'space-between',
                                marginLeft: moderateScale(8),
                                textAlign: 'center',
                              }}
                              value={`${productQuantityForCart.toString()}`}
                              onChangeText={(value) =>
                                updateState({
                                  productQuantityForCart:
                                    value == '' ? '' : Number(value),
                                })
                              }
                              // onPress={onPress}
                            />

                            <TouchableOpacity
                              disabled={
                                !productDetailData?.vendor?.show_slot &&
                                !!productDetailData?.vendor?.is_vendor_closed
                              }
                              value={`${productQuantityForCart.toString()}`}
                              onChangeText={(value) =>
                                updateState({
                                  productQuantityForCart:
                                    value == '' ? '' : Number(value),
                                })
                              }
                            />

                            <TouchableOpacity
                              disabled={
                                !productDetailData?.vendor?.show_slot &&
                                !!productDetailData?.vendor?.is_vendor_closed
                              }
                              onPress={() => productIncrDecreamentForCart(1)}
                              hitSlop={hitSlopProp}>
                              <Text>+</Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}

                        <View />
                        <View style={{flex: 1}}>
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
                            btnText={`${
                              strings.ADD
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
            style={{flex: 1, marginVertical: moderateScaleVertical(10)}}
            contentContainerStyle={{flexGrow: 1}}
            horizontal
            ItemSeparatorComponent={() => <View style={{width: 10}} />}
            ListHeaderComponent={() => (
              <View style={{marginLeft: moderateScale(8)}} />
            )}
            ListFooterComponent={() => (
              <View style={{marginLeft: moderateScale(8)}} />
            )}
            // ListEmptyComponent={<ListEmptyProduct isLoading={state.isLoading}/>}
          />
        </View>
        <View style={{marginBottom: moderateScale(40)}} />
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
            minimumDate={new Date()}
            onDateChange={(value) => onDateChange(value)}
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
          updateState({isOffersModalVisible: !isOffersModalVisible})
        }
      />
      <ReactNativeModal
        onBackButtonPress={() => setAvailableSlotsModal(false)}
        isVisible={isAvailableSlotsModal}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <View
          style={{
            height: height / 3,
            backgroundColor: colors.white,
            borderTopLeftRadius: moderateScale(10),
            borderTopRightRadius: moderateScale(10),
            padding: moderateScale(10),
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
              Select delivery slot
            </Text>
            <TouchableOpacity onPress={() => setAvailableSlotsModal(false)}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 8,
              borderWidth: 1,
              borderColor: colors.borderColorB,
              borderRadius: moderateScale(6),
            }}>
            <Image source={imagePath.radioInActive} />
            <Text
              style={{
                fontFamily: fontFamily?.regular,
                marginLeft: moderateScale(10),
              }}>
              Afternoon (11:01 - 15:00 $100.00)
            </Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>
    </WrapperContainer>
  );
}
const htmlStyle = StyleSheet.create({
  h2: {
    color: '#e5e5e7', // make links coloured pink
  },
});
