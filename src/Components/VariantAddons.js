import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep, isEmpty} from 'lodash';
import moment from 'moment';
import React, {useEffect, useRef, useState, Fragment} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DatePicker from 'react-native-date-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import {Pagination} from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import Banner from '../Components/Banner';
import GradientButton from '../Components/GradientButton';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import commonStylesFun, {hitSlopProp} from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {
  addRemoveMinutes,
  getHourAndMinutes,
  tokenConverterPlusCurrencyNumberFormater,
} from '../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  hapticEffects,
  playHapticEffect,
} from '../utils/helperFunctions';
import BannerLoader from './Loaders/BannerLoader';
import HeaderLoader from './Loaders/HeaderLoader';
import { Calendar, CalendarList } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';

const VariantAddons = ({
  productdetail = null,
  isVisible = false,
  showShimmer,
  shimmerClose = () => {},
  slider1ActiveSlide = 0,
  productDetailData = null,
  variantSet = [],
  addonSet = [],
  productTotalQuantity = 0,
  showErrorMessageTitle = false,
  typeId = null,
  selectedVariant = null,
  isProductImageLargeViewVisible = false,
  isLoadingC = false,
  updateState = () => {},
  startDateRental = new Date(),
  endDateRental = new Date(),
  isRentalStartDatePicker = false,
  isRentalEndDatePicker = false,
  rentalProductDuration = null,
  isVarientSelectLoading = false,
  productDetailNew = {},
  isProductAvailable = false,
}) => {
  console.log("productDetailNew =>", productDetailNew,"\n productDetailData =>", productDetailData, "\n endDateRental =>",endDateRental);
  const {appData, themeColors, currencies, languages, appStyle, themeColor} =
    useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences;
  const fontFamily = appStyle?.fontSizeData;
  const isDarkMode = themeColor;
  const buttonTextColor = themeColors;
  const commonStyles = commonStylesFun({fontFamily, buttonTextColor});
  const [variantState, setVariantState] = useState({
    planValues: ["Daily", "Weekly", "Monthly", "Alternate Days"],
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    quickSelection: ["Weekdays", "Weekends"],
    showCalendar: false,
    reccuringCheckBox: false,
    selectedPlanValues: '',
    selectedWeekDaysValues: [],
    selectedQuickSelectionValue: '',
    minimumDate: new Date().toJSON().slice(0, 10),
    initDate: new Date(),
    start: {},
    end: {},
    period: {},
    disabledDaysIndexes: [],
    selectedDaysIndexes: [],
  })

  const { planValues, reccuringCheckBox, showCalendar, selectedPlanValues, minimumDate,
    weekDays, quickSelection, start, end, period, selectedWeekDaysValues, selectedQuickSelectionValue, initDate,
    disabledDaysIndexes, selectedDaysIndexes } = variantState
  const updateAddonState = (data) => { setVariantState((state) => ({ ...state, ...data })) };

  const resetVariantState = () => {
    updateAddonState({
      planValues: ["Daily", "Weekly", "Monthly", "Alternate Days"],
      weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      quickSelection: ["Weekdays", "Weekends"],
      showCalendar: false,
      selectedPlanValues: '',
      selectedWeekDaysValues: [],
      selectedQuickSelectionValue: '',
      minimumDate: new Date().toJSON().slice(0, 10),
      initDate: new Date(),
      start: {},
      end: {},
      period: {},
      disabledDaysIndexes: [],
      selectedDaysIndexes: [],
    })
  }

  useFocusEffect(
    React.useCallback(() => {
      if (variantSet.length) {
        let variantSetData = variantSet
          .map((i, inx) => {
            let find = i.options.filter((x) => x.value);
            if (find.length) {
              return {
                variant_id: find[0]?.variant_id,
                optionId: find[0]?.id,
              };
            }
          })
          .filter((x) => x != undefined);
        if (variantSetData.length) {
          getProductDetailBasedOnFilter(variantSetData);
        } else {
          getProductDetail();
        }
      }
    }, [variantSet]),
  );

  const getProductDetailBasedOnFilter = (variantSetData) => {
    console.log('api hit getProductDetailBasedOnFilter', variantSetData);
    let data = {};
    data['variants'] = variantSetData?.map((i) => i.variant_id);
    data['options'] = variantSetData?.map((i) => i.optionId);
    actions
      .getProductDetailByVariants(`/${productDetailData.sku}`, data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        console.log(res.data, 'res.data by vendor id ');
        updateState({
          productDetailNew: res?.data,
          productPriceData: {
            multiplier: res?.data?.multiplier,
            price: res?.data?.price,
          },
          productSku: res?.data?.sku,
          productVariantId: res?.data?.id,
          showErrorMessageTitle: false,
          selectedVariant: null,
          isVarientSelectLoading: false,
        });
      })
      .catch((error) => console.log(error, 'errrorrrr'));
  };

  useEffect(() => {
    getProductDetail();
  }, []);
  useEffect(() => {
    if (!isEmpty(productDetailNew)) {
      checkProductAvailibility();
    }
  }, [productDetailNew]);

  const getProductDetail = () => {
    console.log('api hit getProductDetail');
    actions
      .getProductDetailByProductId(
        `/${productdetail?.id}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res?.data, 'res.data++ prodcut detail');
        updateState({
          productDetailData: res?.data?.products,
          relatedProducts: res?.data?.relatedProducts,
          productPriceData: res?.data?.products?.variant[0],
          addonSet: res?.data?.products?.add_on,
          venderDetail: res?.data?.products?.vendor,
          productTotalQuantity: res?.data?.products?.variant[0]?.quantity,
          productVariantId: res?.data?.products?.variant[0]?.id,
          productSku: res?.data?.products?.sku,
          variantSet: res?.data?.products?.variant_set,
          typeId: res?.data?.products?.category?.category_detail?.type_id,
          isLoadingC: false,
          selectedVariant: null,
          productQuantityForCart: !!res.data.products?.minimum_order_count
            ? Number(res.data.products?.minimum_order_count)
            : 1,
          rentalProductDuration:
            Number(res?.data?.products?.minimum_duration) * 60 +
            Number(res?.data?.products?.minimum_duration_min),
          endDateRental: addRemoveMinutes(
            Number(res?.data?.products?.minimum_duration) * 60 +
              Number(res?.data?.products?.minimum_duration_min),
          ),
          startDateRental: new Date(),
        });
        shimmerClose(false);
      })
      .catch((error) => {
        console.log('error raised', error);
        updateState({
          selectedVariant: null,
          isLoadingC: false,
        });
      });
  };

  const checkProductAvailibility = () => {
    actions
      .checkProductAvailibility(
        {
          selectedStartDate: String(
            moment(startDateRental).format('YYYY-MM-DD hh:mm:ss'),
          ),
          selectEndDate: String(
            moment(endDateRental).format('YYYY-MM-DD hh:mm:ss'),
          ),
          variant_option_id: productDetailNew && productDetailNew?.set?.length && productDetailNew?.set[0]?.variant_option_id,
          product_id: productDetailNew?.product?.id,
        },
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        updateState({
          isProductAvailable: true,
        });
      })
      .catch((err) => {
        updateState({
          isProductAvailable: false,
        });
      });
  };

  const selectSpecificOptionsForAddions = (options, i, inx) => {
    let newArray = cloneDeep(options);
    updateState({
      addonSet: addonSet.map((vi, vnx) => {
        if (vi.addon_id == i.addon_id) {
          return {
            ...vi,
            setoptions: newArray.map((j, jnx) => {
              if (vi?.max_select > 1) {
                let incrementedValue = 0;
                newArray.forEach((e) => {
                  if (e.value) {
                    incrementedValue = incrementedValue + 1;
                  }
                });
                if (incrementedValue == vi?.max_select && !j.value) {
                  return {
                    ...j,
                  };
                } else {
                  if (j?.id == i?.id) {
                    return {
                      ...j,
                      value: i?.value ? false : true,
                    };
                  }

                  return {
                    ...j,
                  };
                }
              } else {
                if (j.id == i.id) {
                  return {
                    ...j,
                    value: i?.value ? false : true,
                  };
                }

                return {
                  ...j,
                  value: false,
                };
              }
            }),
          };
        } else {
          return vi;
        }
      }),
    });
  };

  const checkBoxButtonViewAddons = ({setoptions}) => {
    return (
      <View>
        {setoptions.map((i, inx) => {
          return (
            <TouchableOpacity
              hitSlop={hitSlopProp}
              key={inx}
              activeOpacity={1}
              onPress={() => {
                playHapticEffect(hapticEffects.rigid);
                selectSpecificOptionsForAddions(setoptions, i, inx);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: moderateScaleVertical(10),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    ...styles.variantValue,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {i?.title
                    ? i.title.charAt(0).toUpperCase() + i.title.slice(1)
                    : ''}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.variantValue,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {tokenConverterPlusCurrencyNumberFormater(
                    Number(i?.price),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}
                </Text>
                <View style={{paddingLeft: moderateScale(5)}}>
                  <Image
                    style={{tintColor: themeColors.primary_color}}
                    source={
                      i?.value
                        ? imagePath.checkBox2Active
                        : imagePath.checkBox2InActive
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const showAllAddons = () => {
    let variantSetData = cloneDeep(addonSet);
    return (
      <>
        <View
          style={{
            marginTop: moderateScaleVertical(5),
          }}>
          {variantSetData.map((i, inx) => {
            return (
              <View
                key={inx}
                style={{
                  marginVertical: moderateScaleVertical(5),
                }}>
                <Text
                  style={{
                    ...styles.variantLable,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  }}>
                  {i?.title}
                </Text>

                <Text
                  style={{
                    ...styles.chooseOption,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.grayOpacity51,
                    fontSize: textScale(10),
                  }}>
                  {`${strings.MIN} ${i?.min_select} ${strings.AND_MAX} ${i?.max_select} ${strings.SELECTION_ALLOWED}`}
                </Text>

                {!!i.errorShow && (
                  <Text
                    style={{
                      color: colors.redColor,
                      fontSize: textScale(8),
                      fontFamily: fontFamily.medium,
                      textAlign: 'left',
                    }}>
                    {`${strings.MIN} ${i?.min_select} ${strings.REQUIRED}`}
                  </Text>
                )}

                {i?.setoptions ? checkBoxButtonViewAddons(i) : null}
                <View
                  style={{
                    ...commonStyles.headerTopLine,
                    marginVertical: moderateScaleVertical(10),
                  }}
                />
              </View>
            );
          })}
        </View>
      </>
    );
  };

  const selectSpecificOptions = (options, i) => {
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
              variant_id: find[0]?.variant_id,
              optionId: find[0]?.id,
            };
          }
        })
        .filter((x) => x != undefined);
      if (variantSetData.length) {
        updateState({isVarientSelectLoading: true});
        getProductDetailBasedOnFilter(variantSetData);
      } else {
        getProductDetail();
      }
    }
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

          {!isEmpty(
            options.filter((val) => {
              if (val?.value) {
                return val;
              }
            }),
          ) && typeId == 10 ? (
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
                    {strings.START_DATE}
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
                    {strings.END_DATE}
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
                {strings.DURATION}:
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
                {strings.FOR_FIRST}{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {productDetailNew?.product?.minimum_duration}
                </Text>{' '}
                {strings.HOUR}{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {productDetailNew?.product?.minimum_duration_min}
                </Text>{' '}
                {strings.MIN}
              </Text>
              <Text
                style={{
                  fontSize: moderateScale(13),
                  fontFamily: fontFamily.regular,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.EXTRA_DURATION_CHARGES}{' '}
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
                {strings.PER}{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {productDetailNew?.product?.additional_increments}
                </Text>{' '}
                {strings.HOUR}{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {' '}
                  {productDetailNew?.product?.additional_increments_min}
                </Text>{' '}
                {strings.MIN}
              </Text>
            </View>
          ) : null}
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
                  hitSlop={hitSlopProp}
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
            indicator={isVarientSelectLoading}
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
                  hitSlop={hitSlopProp}
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
            indicator={isLoadingC}
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

  const {bannerRef} = useRef();

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
      <View
        style={{
          marginVertical: moderateScaleVertical(12),
          paddingHorizontal: moderateScale(0),
        }}>
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

  var totalProductQty = 0;
  if (!!productdetail?.check_if_in_cart_app) {
    productdetail?.check_if_in_cart_app.map((val) => {
      totalProductQty = totalProductQty + val.quantity;
    });
  }

  const shimmerShow = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
          borderTopLeftRadius: 0,
          borderTopStartRadius: 0,
        }}>
        <BannerLoader
          isBannerDots
          homeLoaderWidth={width}
          homeLoaderHeight={moderateScaleVertical(190)}
          viewStyles={{
            marginHorizontal: 0,
          }}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(80)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(80)}
          rectHeightLeft={moderateScaleVertical(10)}
          rx={5}
          ry={5}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(60)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(60)}
          rectHeightLeft={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width - moderateScale(30)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={width - moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(12)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width}
          heightLeft={moderateScaleVertical(2)}
          rectWidthLeft={width}
          rectHeightLeft={moderateScaleVertical(2)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(12)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          heightLeft={moderateScaleVertical(7)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(7)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          widthLeft={moderateScale(60)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(60)}
          rectHeightLeft={moderateScaleVertical(10)}
          widthRight={moderateScale(60)}
          heightRight={moderateScaleVertical(10)}
          rectWidthRight={moderateScale(60)}
          rectHeightRight={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          widthLeft={moderateScale(60)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(60)}
          rectHeightLeft={moderateScaleVertical(10)}
          widthRight={moderateScale(60)}
          heightRight={moderateScaleVertical(10)}
          rectWidthRight={moderateScale(60)}
          rectHeightRight={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          heightLeft={moderateScaleVertical(7)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(7)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          heightLeft={moderateScaleVertical(7)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(7)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />

        <HeaderLoader
          isRight={false}
          widthLeft={width}
          heightLeft={moderateScaleVertical(2)}
          rectWidthLeft={width}
          rectHeightLeft={moderateScaleVertical(2)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(15)}}
        />
        <HeaderLoader
          widthLeft={moderateScale(80)}
          heightLeft={moderateScaleVertical(30)}
          rectWidthLeft={moderateScale(80)}
          rectHeightLeft={moderateScaleVertical(30)}
          widthRight={width - moderateScale(130)}
          heightRight={moderateScaleVertical(30)}
          rectWidthRight={width - moderateScale(130)}
          rectHeightRight={moderateScaleVertical(30)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: 'auto',
            marginBottom: moderateScaleVertical(25),
          }}
        />
      </View>
    );
  };

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
  // reccuring 
  const onPlanSelect = (itm) => {
    updateAddonState({ selectedPlanValues: itm === selectedPlanValues ? '' : itm })
    if (itm === 'Daily') {
      updateAddonState({ showCalendar: itm === selectedPlanValues ? false : true })
    } else if (itm === 'Monthly') {
      updateAddonState({ showCalendar: itm === selectedPlanValues ? false : true })
    }
    else {
      updateAddonState({ showCalendar: false })
    }
    updateAddonState({
      selectedWeekDaysValues: [],
      selectedQuickSelectionValue: '',
      start: {},
      end: {},
      period: {},
      disabledDaysIndexes: [],
      selectedDaysIndexes: [],
    })
  }

  const onSelectDayDelivery = (itm) => {

    let selectedDays = [...selectedWeekDaysValues]

    if (isEmpty(selectedDays)) {
      selectedDays.push(itm)
      updateAddonState({ showCalendar: true })
    } else {
      selectedDays.indexOf(itm) === -1 ?
        insert(itm, selectedDays) :
        selectedDays.splice(selectedDays.indexOf(itm), 1);
    }
    updateAddonState({ selectedWeekDaysValues: selectedDays, selectedQuickSelectionValue: '', period: {}, })
    selectedDays.length < 1 && updateAddonState({ showCalendar: false, disabledDaysIndexes: [], selectedDaysIndexes: [] })
    if (selectedDays.length > 0) {
      const disabledDaysNumber = [...disabledDaysIndexes]
      let selectedDaysNumber = [...selectedDaysIndexes]
      const value = itm === "Mo" ? 1 :
        itm === "Tu" ? 2 :
          itm === "We" ? 3 :
            itm === "Th" ? 4 :
              itm === "Fr" ? 5 :
                itm === "Sa" ? 6 :
                  itm === "Su" && 7

      if (isEmpty(selectedDaysNumber)) {
        selectedDaysNumber.push(value)
      } else {
        selectedDaysNumber.indexOf(value) === -1 ?
          insert(value, selectedDaysNumber) :
          selectedDaysNumber.splice(selectedDaysNumber.indexOf(value), 1);
      }
      updateAddonState({ selectedDaysIndexes: selectedDaysNumber, })

      const weekArr = [1, 2, 3, 4, 5, 6, 7]
      console.log("disabledDaysIndexes =>", disabledDaysIndexes);
      console.log("disabledDaysNumber =>", disabledDaysNumber);
      const numberToDeleteSet = new Set(selectedDaysNumber);
      const newArr = weekArr.filter((name) => {
        // return those elements not in the namesToDeleteSet
        return !numberToDeleteSet.has(name);
      });
      console.log("newArr =>", newArr);

      updateAddonState({ disabledDaysIndexes: newArr })
      getDisabledDays(
        initDate.getMonth(),
        initDate.getFullYear(),
        newArr
      )
    }
  }

  const onSelectQuickSelection = (itm) => {
    if (itm === 'Weekdays') {
      selectedQuickSelectionValue === (itm) ?
        updateAddonState({
          selectedWeekDaysValues: [], selectedQuickSelectionValue: '', showCalendar: false, disabledDaysIndexes: [],
          start: {},
          end: {},
          period: {},
        })
        :
        (
          updateAddonState({
            selectedWeekDaysValues: ["Mo", "Tu", "We", "Th", "Fr"], selectedQuickSelectionValue: itm,
            showCalendar: true, disabledDaysIndexes: [6, 7], start: {},
            end: {},
          }),
          getDisabledDays(
            initDate.getMonth(),
            initDate.getFullYear(),
            [6, 7]
          )
        )
    }
    if (itm === 'Weekends') {
      selectedQuickSelectionValue === (itm) ?
        updateAddonState({
          selectedWeekDaysValues: [], selectedQuickSelectionValue: '', showCalendar: false, disabledDaysIndexes: [],
          start: {},
          end: {},
        })
        :
        (
          updateAddonState({
            selectedWeekDaysValues: ["Sa", "Su"], selectedQuickSelectionValue: itm, showCalendar: true, disabledDaysIndexes: [1, 2, 3, 4, 5],
            start: {},
            end: {},
            period: {},
          }),
          getDisabledDays(
            initDate.getMonth(),
            initDate.getFullYear(),
            [1, 2, 3, 4, 5]
          )
        )
    }
  }

  console.log(themeColors,"variantState =>", variantState);
  const ShowReccuringView = () => {
    const { timestamp: startTimeStamp } = start
    const { timestamp: endTimeStamp } = end
    return (
      <View style={styles.mainView}>
        <Text style={{
          ...styles.productName,
          color: isDarkMode
            ? MyDarkTheme.colors.text
            : colors.black,
          fontFamily: fontFamily.bold,
        }}>Select your plan type</Text>
        <View style={styles.elementInRows}>
          {planValues.map((itm, inx) => {
            return (
              <TouchableOpacity key={String(inx)}
                onPress={() => onPlanSelect(itm)}
                style={{
                  // width: moderateScale(50), 
                  backgroundColor: selectedPlanValues === itm ? themeColors.bottomBarGradientA :
                    getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 60),
                  marginHorizontal: moderateScale(6),
                  marginVertical: moderateScale(6),
                  paddingHorizontal: moderateScale(16),
                  paddingVertical: moderateScale(10),
                  borderRadius: moderateScale(10),
                }}>
                <Text style={{
                  ...styles.productName,
                  color: isDarkMode
                    ? colors.black :
                    MyDarkTheme.colors.white,
                  fontFamily: fontFamily.bold,
                  fontSize: textScale(10)
                }}>{itm}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        {!isEmpty(selectedPlanValues) &&
          <View>
            <View style={{ marginVertical: moderateScaleVertical(8) }}>
              {
                selectedPlanValues === 'Daily' ?
                  <View style={{ alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{  ...styles.dateText, marginRight: moderateScale(15) }}>
                        Select Start Date:
                      </Text>
                      <Text style={{
                        ...styles.productName, fontFamily: fontFamily.medium,
                        fontSize: textScale(12), textAlign: 'center', marginVertical: moderateScaleVertical(4)
                      }}>
                        {startTimeStamp ? moment(startTimeStamp).format('MM/DD/YY') : 'Select Date'}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                      <Text style={{  ...styles.dateText, marginRight: moderateScale(22) }}>
                        Select End Date:
                      </Text>
                      <Text style={{
                        ...styles.productName, textAlign: 'center', fontFamily: fontFamily.medium,
                        fontSize: textScale(12), marginVertical: moderateScaleVertical(4)
                      }}>
                        {endTimeStamp ? moment(endTimeStamp).format('MM/DD/YY') : 'Select Date'}
                      </Text>
                    </View>
                  </View>
                  : selectedPlanValues === 'Weekly' ?
                    <View style={{ alignItems: 'flex-start' }}>
                      <Text>{`Select Day(s) of Delivery`}</Text>
                      <View style={styles.elementInRows}>
                        {weekDays.map((itm, inx) => {
                          return (
                            <TouchableOpacity key={String(inx)}
                              onPress={() => onSelectDayDelivery(itm)}
                              style={{
                                // width: moderateScale(50), 
                                backgroundColor: selectedWeekDaysValues.includes(itm) ? themeColors.bottomBarGradientA :
                                  getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 60),
                                marginHorizontal: moderateScale(6),
                                marginVertical: moderateScale(6),
                                paddingHorizontal: moderateScale(16),
                                paddingVertical: moderateScale(10),
                                borderRadius: moderateScale(10),
                              }}>
                              <Text style={{
                                ...styles.productName,
                                color: isDarkMode
                                  ? colors.black :
                                  MyDarkTheme.colors.white,
                                fontFamily: fontFamily.bold,
                                fontSize: textScale(10)
                              }}>{itm}</Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                      <View style={{}}>
                        <Text>Quick Selection</Text>
                        <View style={styles.elementInRows}>
                        {quickSelection.map((itm, inx) => {
                          return (
                            <TouchableOpacity key={String(inx)}
                              onPress={() => onSelectQuickSelection(itm)}
                              style={{
                                // width: moderateScale(50), 
                                backgroundColor: selectedQuickSelectionValue.includes(itm) ? themeColors.bottomBarGradientA :
                                  getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 60),
                                marginHorizontal: moderateScale(6),
                                marginVertical: moderateScale(6),
                                paddingHorizontal: moderateScale(16),
                                paddingVertical: moderateScale(10),
                                borderRadius: moderateScale(10),
                              }}>
                              <Text style={{
                                ...styles.productName,
                                color: isDarkMode
                                  ? colors.black :
                                  MyDarkTheme.colors.white,
                                fontFamily: fontFamily.bold,
                                fontSize: textScale(10)
                              }}>{itm}</Text>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                      </View>
                    </View>
                    : selectedPlanValues === 'Monthly' ?
                      <View>
                        <Text>{`Select Day(s) for monthly delivery`}</Text>
                      </View>
                      : selectedPlanValues === 'Alternate Days' &&
                      <View>
                        <Text>{`Select Day(s) for monthly delivery`}</Text>
                      </View>
              }
            </View>
            {showCalendar &&
              (
                selectedPlanValues === 'Monthly' ?
                  <Calendar
                    initialDate={'2023-01-01'}
                    horizontal={true}
                    pagingEnabled={true}
                    calendarWidth={width - moderateScale(38)}
                    calendarHeight={height / 2.6}
                    onDayPress={(value) => onMonthPress(value)}
                    // minDate={minimumDate}
                    markingType={'custom'}
                    markedDates={period}
                    // markedDates={{
                    //   '2023-01-16': {selected: true, marked: true},
                    //   '2023-01-17': {marked: true},
                    //   '2023-01-19': {disabled: true}
                    // }}
                    hideExtraDays={true}
                    hideArrows={true}
                    hideDayNames={true}
                    theme={{
                      calendarBackground: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                      dayTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      monthTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      textDisabledColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA,
                      textSectionTitleDisabledColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA,
                    }}
                    disabledDaysIndexes={disabledDaysIndexes}
                    renderHeader={date => {
                      return (
                        <></>
                      )
                    }}
                  />
                  :
                  <Calendar
                    horizontal={true}
                    pagingEnabled={true}
                    calendarWidth={width - moderateScale(38)}
                    calendarHeight={height / 2.6}
                    renderArrow={_renderArrow}
                    hideArrows={false}
                    onDayPress={(value) => onDayPress(value)}
                    minDate={minimumDate}
                    markingType={'period'}
                    markedDates={period}
                    theme={{
                      calendarBackground: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                      dayTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      monthTextColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      textDisabledColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA,
                      textSectionTitleDisabledColor: isDarkMode ? colors.whiteOpacity22 : colors.greyA,
                    }}
                    firstDay={1}
                    disabledDaysIndexes={disabledDaysIndexes}
                    disableAllTouchEventsForDisabledDays={true}
                  />
              )
            }
          </View>
        }
      </View>
    )
  }
  function insert(element, array) {
    array.push(element);
    array.sort(function(a, b) {
      const date1 = new Date(a);
      const date2 = new Date(b);
      return date1 - date2;
    });
    return array;
  }
  const toTimestamp = (strDate) => {
    // const dt = moment(strDate).format("X");
    const dt = Date.parse(strDate);
    return dt;
  }
  const getDatesDiff = (start_date, end_date, date_format = "YYYY-MM-DD") => {
    const getDateAsArray = date => {
      return moment(date.split(/\D+/), date_format);
    };
    const diff = getDateAsArray(end_date).diff(getDateAsArray(start_date), "days") + 1;
    const dates = [];
    for (let i = 0; i < diff; i++) {
      const nextDate = getDateAsArray(start_date).add(i, "day");
      // for weekend
      // const isWeekEndDay = nextDate.isoWeekday() > 5;
      // if (!isWeekEndDay)
      dates.push(nextDate.format(date_format))
    }
    return dates;
  };

  const getPeriod = (startTimestamp, endTimestamp, selectedPlanValues, oldperiodo) => {
    const periodo = !isEmpty(oldperiodo) ? { ...oldperiodo } : {}
    let currentTimestamp = startTimestamp
    while (currentTimestamp < endTimestamp) {
      if (selectedPlanValues === 'Weekly') {
        if (periodo[currentTimestamp]?.disabled === true) {
          periodo[currentTimestamp] = { color: isDarkMode ? colors.whiteOpacity22 : colors.greyA, startingDay: false, textColor: '#FFFFFF' }
        } else {
          const dateString = getDateString(currentTimestamp, selectedPlanValues)
          if (dateString) {
            periodo[dateString] = {
              color: currentTimestamp === startTimestamp ? themeColors.primary_color : getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 25),
              startingDay: currentTimestamp === startTimestamp,
              textColor: colors.white
            }
          }
        }
      } else {
        const dateString = getDateString(currentTimestamp)
        periodo[dateString] = {
          color: currentTimestamp === startTimestamp ? themeColors.primary_color : getColorCodeWithOpactiyNumber(themeColors.primary_color.substring(1), 25),
          startingDay: currentTimestamp === startTimestamp,
          textColor: colors.white
        }
      }
      currentTimestamp += 24 * 60 * 60 * 1000
    }
    if (selectedPlanValues === 'Weekly') {
      const dateString = getDateString(endTimestamp, selectedPlanValues)
      if (dateString) {
        periodo[dateString] = {
          color: themeColors.primary_color,
          endingDay: true,
          textColor: colors.white
        }
      }
    } else {
      const dateString = getDateString(endTimestamp, selectedPlanValues)
      periodo[dateString] = {
        color: themeColors.primary_color,
        endingDay: true,
        textColor: colors.white
      }
    }
    return periodo
  }

  const getDateString = (timestamp, selectedPlanValues = '') => {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    let dateString = `${year}-`
    if (month < 10) {
      dateString += `0${month}-`
    } else {
      dateString += `${month}-`
    }
    if (day < 10) {
      dateString += `0${day}`
    } else {
      dateString += day
    }
    if (selectedPlanValues || !isEmpty(selectedPlanValues)) {
      let weekdayNumber = date.getDay()
      weekdayNumber = weekdayNumber === 0 ? weekdayNumber + 7 :  weekdayNumber
      console.log("weekdayNumber =>", weekdayNumber);
      if (disabledDaysIndexes.includes(weekdayNumber)) {
        return null;
      } else {
        return dateString
      }
    } else {
      return dateString
    }
  }

  const getDisabledDays = (month, year, daysIndexes) => {
    let pivot = moment().month(month).year(year).startOf('month');
    const end = moment().month(month).year(year).endOf('year');
    let dates = {};
    const disabled = { disabled: true, disableTouchEvent: true };
    while (pivot.isBefore(end)) {
      daysIndexes.forEach((day) => {
        const copy = moment(pivot);
        dates[copy.day(day).format('YYYY-MM-DD')] = disabled;
      });
      pivot.add(7, 'days');
    }
    console.log("getDisabledDays =>", dates);
    updateAddonState({ period: dates })
    return dates;
  };

  function insertProperty(obj, key, value) {
    var result = {};
    var counter = 0;
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        result[prop] = obj[prop];
        counter++;
      }
    }
    if (!(key in result)) {
      result[key] = value;
    }
    return result;
  };

  const onMonthPress = (dayObj) => {
    alert('onMonthPress')
    const { dateString, day, month, year, } = dayObj

    const periodIsEmpty = isEmpty(period)
    if (periodIsEmpty) {
      const periodo = {
        [dateString]: {
          color: themeColors.primary_color,
          selected: true,
          marked: true,
          textColor: colors.white
        },
      }
      updateAddonState({ period: periodo })
    } else {
      let periodo = {...period}
      for (var prop in period) {
        if (!period.hasOwnProperty(dateString)) {
          periodo = {
            ...periodo,
            [dateString]: {
              color: themeColors.primary_color,
              selected: true,
              marked: true,
              textColor: colors.white
            }
          }
        }else{
          delete periodo[dateString]
        }
      }
      console.log("periodo =>", periodo);
      updateAddonState({ period: periodo })
    }
  }

  const onDayPress = (dayObj) => {
    alert('onDayPress')
    const { dateString, day, month, year, } = dayObj
    if (selectedPlanValues === ('Daily')) {
      // timestamp returned by dayObj is in 12:00AM UTC 0, want local 12:00AM
      const timestamp = new Date(year, month - 1, day).getTime()
      const newDayObj = { ...dayObj, timestamp }
      // if there is no start day, add start. or if there is already a end and start date, restart
      const startIsEmpty = isEmpty(start)
      if (startIsEmpty || !startIsEmpty && !isEmpty(end)) {
        const periodo = {
          [dateString]: {
            color: themeColors.primary_color,
            endingDay: true,
            startingDay: true,
            textColor: colors.white
          },
        }
        updateAddonState({ start: newDayObj, period: periodo, end: {} })
      } else {
        // if end date is older than start date switch
        const { timestamp: savedTimestamp } = start
        if (savedTimestamp > timestamp) {
          const periodo = getPeriod(timestamp, savedTimestamp)
          updateAddonState({ start: newDayObj, end: start, period: periodo })

        } else {
          if (savedTimestamp === timestamp) {
            updateAddonState({ start: {}, end: {}, period: {} })
          }
          else {
            const periodo = getPeriod(savedTimestamp, timestamp)
            updateAddonState({ end: newDayObj, start: start, period: periodo })
          }

        }
      }
    }

    if (selectedPlanValues === ('Weekly')) {
      // timestamp returned by dayObj is in 12:00AM UTC 0, want local 12:00AM
      const statePeriodo = { ...period }
      const timestamp = new Date(year, month - 1, day).getTime()
      const newDayObj = { ...dayObj, timestamp }
      // if there is no start day, add start. or if there is already a end and start date, restart
      const startIsEmpty = isEmpty(start)
      if (startIsEmpty || !startIsEmpty && !isEmpty(end)) {
        const { timestamp: startTimeStamp } = start
        const { timestamp: endTimeStamp } = end
        let periodo1
        if (startTimeStamp !== newDayObj.timestamp && endTimeStamp) {
          const periodo2 = getDisabledDays(
            initDate.getMonth(),
            initDate.getFullYear(),
            disabledDaysIndexes
          )
          periodo1 = insertProperty(periodo2, dateString, {
            color: themeColors.primary_color,
            endingDay: true,
            startingDay: true,
            textColor: colors.white
          });
          updateAddonState({ start: newDayObj, end: {}, period: periodo1 })
        } else {
          periodo1 = insertProperty(statePeriodo, dateString, {
            color: themeColors.primary_color,
            endingDay: true,
            startingDay: true,
            textColor: colors.white
          });
          updateAddonState({ start: newDayObj, period: periodo1, end: {} })
        }

      }
      else {
        // if end date is older than start date switch
        const { timestamp: savedTimestamp } = start
        if (savedTimestamp > timestamp) {
          const periodo = getPeriod(timestamp, savedTimestamp, selectedPlanValues, statePeriodo)
          updateAddonState({ start: newDayObj, end: start, period: periodo })
        }
        else {
          if (savedTimestamp === timestamp) {
            updateAddonState({ start: {}, end: {}, period: {} })
            getDisabledDays(
              initDate.getMonth(),
              initDate.getFullYear(),
              disabledDaysIndexes
            )
          }
          else {
            const periodo = getPeriod(savedTimestamp, timestamp, selectedPlanValues, statePeriodo)
            updateAddonState({ end: newDayObj, start: start, period: periodo })
          }
        }
      }

    }
  }
  const _renderArrow = (direction) => {
    if (direction == 'left') {
      return (
        <Image
          source={imagePath.icgo3}
          style={{
            height: 25,
            width: 25,
            tintColor: themeColors.primary_color,
            transform: [{ scaleX: -1 }],
          }}
        />
      );
    } else {
      return (
        <Image
          source={imagePath.icgo3}
          style={{ height: 25, width: 25, tintColor: themeColors.primary_color }}
        />
      );
    }
  };
  return (
    <View style={{flex: 1}}>
      {showShimmer ? (
        shimmerShow()
      ) : (
        <Animatable.View style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            // onScroll={onScroll}
            style={{
              ...styles.modalMainViewContainer,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : '#fff',
              marginHorizontal: moderateScale(10),
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: moderateScale(10),
              }}>
              <Banner
                bannerRef={bannerRef}
                bannerData={productDetailData?.product_media}
                sliderWidth={width}
                itemWidth={width}
                pagination={false}
                setActiveState={(index) =>
                  updateState({slider1ActiveSlide: index})
                }
                showLightbox={true}
                cardViewStyle={styles.cardViewStyle}
                onPressImage={() =>
                  updateState({
                    isProductImageLargeViewVisible: true,
                  })
                }
              />
              {!isEmpty(productDetailData) ? (
                <View style={{paddingTop: 5}}>
                  <Pagination
                    dotsLength={productDetailData?.product_media?.length}
                    activeDotIndex={slider1ActiveSlide}
                    dotColor={'grey'}
                    dotStyle={[styles.dotStyle]}
                    inactiveDotColor={'black'}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.8}
                  />
                </View>
              ) : null}
            </View>

            <Animatable.View
              delay={1}
              animation="fadeInUp"
              style={styles.mainView}>
              <View>
                {!isEmpty(productdetail) ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.productName,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      fontFamily: fontFamily.bold,
                    }}>
                    {productdetail?.translation[0]?.title || ''}
                  </Text>
                ) : null}

                {/* rating View */}
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
                      // disabled={false}
                      maxStars={5}
                      rating={Number(productDetailData?.averageRating).toFixed(
                        1,
                      )}
                      fullStarColor={colors.yellowB}
                      starSize={8}
                      containerStyle={{width: width / 9}}
                    />
                  </View>
                )}
              </View>
              <View style={{justifyContent: 'center'}}>
                {!!typeId && typeId !== 8 && (
                  <Text
                    style={{
                      color:
                        (productTotalQuantity && productTotalQuantity != 0) ||
                        !!productDetailData?.sell_when_out_of_stock
                          ? colors.green
                          : colors.orangeB,
                      fontSize: textScale(10),
                      fontFamily: fontFamily.medium,
                    }}>
                    {(productTotalQuantity && productTotalQuantity != 0) ||
                    !!productDetailData?.sell_when_out_of_stock ||
                    productDetailData?.has_inventory == 0
                      ? ''
                      : strings.OUT_OF_STOCK}
                  </Text>
                )}
              </View>

              {!isEmpty(productdetail) &&
              productdetail?.translation[0]?.body_html != null ? (
                <View>
                  <Text
                    style={{
                      fontSize: textScale(10),
                      fontFamily: fontFamily.regular,
                      lineHeight: moderateScale(14),
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyE,
                      textAlign: 'left',
                    }}>
                    {productdetail?.translation_description}
                  </Text>
                  <View style={{marginBottom: 10}} />
                </View>
              ) : null}

              <View
                style={{
                  ...commonStyles.headerTopLine,
                  marginTop: moderateScaleVertical(8),
                  // marginVertical: moderateScaleVertical(10),
                }}
              />
              {/* ********Addon set View*******  */}
              {!!addonSet && addonSet?.length ? showAllAddons() : null}

              {!!variantSet && variantSet?.length ? showAllVariants() : null}
            </Animatable.View>
            {showErrorMessageTitle ? (
              <Text
                style={{
                  fontSize: textScale(14),
                  marginHorizontal: moderateScale(20),
                  color: colors.redB,
                  fontFamily: fontFamily.medium,
                  marginBottom: moderateScaleVertical(20),
                }}>
                {strings.NOVARIANTPRODUCTAVAILABLE}
              </Text>
            ) : null}
              {!!productdetail?.is_recurring_booking &&
                <View style={[{paddingHorizontal: moderateScale(12), flexDirection: 'row', alignItems: 'center' }]}>
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
              {reccuringCheckBox && ShowReccuringView()}
          </ScrollView>

          <View style={{height: moderateScale(100)}} />
        </Animatable.View>
      )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  productName: {
    color: colors.textGrey,
    fontSize: textScale(18),
    lineHeight: 28,
    fontFamily: fontFamily.medium,
  },

  relatedProducts: {
    color: colors.textGrey,
    fontSize: textScale(18),
    lineHeight: 28,
    fontFamily: fontFamily.medium,
    marginVertical: moderateScaleVertical(10),
  },

  variantLable: {
    color: colors.textGrey,
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
  },

  modalMainViewContainer: {
    backgroundColor: colors.white,
  },
  modalContainer: {
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: moderateScaleVertical(height / 10),
    overflow: 'hidden',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: moderateScaleVertical(10),
  },
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  cardView: {
    height: height / 3.8,
    width: width,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  productName: {
    color: colors.textGrey,
    fontSize: textScale(14),
    fontFamily: fontFamily.regular,
  },
  mainView: {
    marginVertical: moderateScaleVertical(12),
    paddingHorizontal: moderateScale(12),
  },
  description: {
    color: colors.textGreyB,
    fontSize: textScale(14),
    lineHeight: 22,
    fontFamily: fontFamily.regular,
    textAlign: 'left',
  },
  variantValue: {
    color: colors.black,
    fontSize: textScale(10),
    lineHeight: 22,
    fontFamily: fontFamily.regular,
    paddingRight: moderateScale(4),
  },

  chooseOption: {
    marginBottom: moderateScale(2),
    color: colors.textGreyF,
    fontSize: textScale(9),
    lineHeight: 22,
    fontFamily: fontFamily.regular,
  },
  incDecBtnStyle: {
    borderWidth: 0.4,
    borderRadius: moderateScale(4),
    height: moderateScale(38),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(12),
  },
  variantSizeViewOne: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(30 / 2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantSizeViewTwo: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(40 / 2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardViewStyle: {
    alignItems: 'center',
    height: width * 0.6,
    width: width,
    alignItems: 'center',
    height: width * 0.6,
    borderRadius: moderateScale(15),
    width: '100%',
    overflow: 'hidden',
    // marginRight: 20
  },
  dotStyle: {height: 12, width: 12, borderRadius: 12 / 2},

  dropDownStyle: {
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScaleVertical(2),
  },
  modalView: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScaleVertical(16),
    paddingBottom: moderateScaleVertical(16),
    borderTopLeftRadius: moderateScale(12),
    borderTopRightRadius: moderateScale(12),
  },
  horizontalLine: {
    width: '100%',
    borderBottomWidth: 1.5,
    marginVertical: moderateScaleVertical(8),
  },
  dateText: {
    color: colors.textGrey,
    textAlign: 'left',
    fontFamily: fontFamily.bold,
    fontSize: textScale(12),
    marginVertical: moderateScaleVertical(4),
  },
  elementInRows: {
    flexDirection: 'row',
    marginVertical: moderateScaleVertical(8),
    flexWrap: 'wrap'
  }
});
export default VariantAddons;