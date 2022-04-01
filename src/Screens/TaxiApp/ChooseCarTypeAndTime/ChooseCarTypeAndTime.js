import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import {isEmpty} from 'lodash';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import DeviceInfo from 'react-native-device-info';
import Geocoder from 'react-native-geocoding';
import * as RNLocalize from 'react-native-localize';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import CustomCallouts from '../../../Components/CustomCallouts';
import GradientButton from '../../../Components/GradientButton';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import {appIds} from '../../../utils/constants/DynamicAppKeys';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';
import {
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
} from '../../../utils/helperFunctions';
import PaymentProcessingModal from '../../CourierService/PaymentProcessingModal';
import AvailableDriver from './AvailableDriver';
import SelectPaymentModalView from './SelectPaymentModalView';
import SelectTimeModalView from './SelectTimeModalView';
import SelectVendorModalView from './SelectVendorModalView';
import stylesFun from './styles';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function ChooseCarTypeAndTime({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  console.log('my route', paramData);
  const bottomSheetRef = useRef(null);

  const {appData, currencies, languages, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state?.auth?.userData);
  const {pickUpTimeType} = useSelector((state) => state?.home);

  const fontFamily = appStyle?.fontSizeData;
  const [refArr, setRefArr] = useState([]);

  const [state, setState] = useState({
    region: {
      latitude: paramData?.location[0]?.latitude
        ? Number(paramData?.location[0].latitude)
        : 30.7191,
      longitude: paramData?.location[0]?.longitude
        ? Number(paramData?.location[0].longitude)
        : 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    coordinate: {
      latitude: paramData?.location[0]?.latitude
        ? Number(paramData?.location[0].latitude)
        : 30.7191,
      longitude: paramData?.location[0]?.longitude
        ? Number(paramData?.location[0].longitude)
        : 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    isLoading: false,
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
    availableVendors: paramData?.cabVendors,
    availableCarList: [],
    availAbleTimes: [
      {
        id: 1,
        label: 'in 20 min.',
      },
      {
        id: 2,
        label: 'in 50 min.',
      },
      {
        id: 3,
        label: 'in 80 min.',
      },
    ],
    selectedCarOption: null,
    selectedAvailableTimeOption: null,
    showVendorModal: false,
    showCarModal: true,
    showTimeModal: false,
    showPaymentModal: false,
    redirectFromNow: false,
    date: new Date(),
    slectedDate: paramData?.datetime?.slectedDate
      ? paramData?.datetime?.slectedDate
      : moment(date).format('YYYY-MM-DD'),
    selectedTime: paramData?.datetime?.selectedTime
      ? paramData?.datetime?.selectedTime
      : moment(date).format('LT'),

    isModalVisible: false,

    selectedDateAndTime: `${moment().format('YYYY-MM-DD')} ${moment().format(
      'H:MM',
    )}`,
    selectedVendorOption: paramData?.cabVendors[0]
      ? paramData?.cabVendors[0]
      : null,
    pageNo: 1,
    limit: 12,
    uploadImages: [],
    isLoadingB: false,
    totalDistance: 0,
    totalDuration: 0,
    updatedAmount: null,
    couponInfo: null,
    loyalityAmount: null,
    isTimerPickerModal: false,
    formatedTime: moment().format('hh:mm A'),
    isDatePickerModal: false,
    pickedUpTime: paramData?.datetime?.selectedTime
      ? paramData?.datetime?.selectedTime
      : moment().format('hh:mm A'),
    selectedDate: moment().format('YYY-MM-DD'),
    pickedUpDate: paramData?.datetime?.slectedDate
      ? paramData?.datetime?.slectedDate
      : moment().format('YYYY-MM-DD'),
    selectedPayment: {},
    taskInstruction: '',
    productFaqQuestionAnswers: [],
    allSubmittedAnswers: null,
    indicatorLoader: false,
  });
  const {
    selectedPayment,
    couponInfo,
    updatedAmount,
    totalDistance,
    totalDuration,
    showVendorModal,
    selectedDateAndTime,

    isModalVisible,
    isLoading,
    addressLabel,
    formattedAddress,
    region,
    coordinate,
    availableCarList,
    selectedCarOption,
    selectedAvailableTimeOption,
    showCarModal,
    showTimeModal,
    availAbleTimes,
    showPaymentModal,
    redirectFromNow,
    slectedDate,
    selectedTime,
    selectedVendorOption,
    date,
    availableVendors,
    pageNo,
    limit,
    isLoadingB,
    loyalityAmount,
    isTimerPickerModal,
    formatedTime,
    isDatePickerModal,
    pickedUpTime,
    selectedDate,
    pickedUpDate,
    uploadImages,
    taskInstruction,
    productFaqQuestionAnswers,
    allSubmittedAnswers,
    indicatorLoader,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;

  const walletAmount = useSelector(
    (state) => state?.product?.walletData?.wallet_amount,
  );

  const mapRef = useRef();

  const markerRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (paramData && paramData?.selectedMethod) {
        updateState({selectedPayment: paramData?.selectedMethod});
      }
      // updateState({isLoadingB: true});
    }, [paramData]),
  );
  console.log(selectedPayment, 'selectedPayment');
  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
  }, []);

  const _confirmAddress = (addressType) => {};
  const _onRegionChange = (region) => {
    updateState({region: region});
    _getAddressBasedOnCoordinates(region);
    markerRef.current.showCallout();

    // animate(region);
  };

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useEffect(() => {
    {
      !!selectedVendorOption && _getAllCarAndPrices();
    }
  }, [selectedVendorOption]);

  useEffect(() => {
    updateState({
      updatedAmount: paramData?.promocodeDetail?.couponInfo?.new_amount,
      couponInfo: paramData?.promocodeDetail?.couponInfo,
    });
  }, [
    paramData?.promocodeDetail?.couponInfo,
    paramData?.promocodeDetail?.new_amount,
  ]);

  //Get list of all orders api
  const _getAllCarAndPrices = () => {
    updateState({isLoading: true, showVendorModal: false, showCarModal: true});
    actions
      .getAllCarAndPrices(
        `/${selectedVendorOption?.id}/${paramData?.id}?page=${pageNo}&limit=${limit}`,
        {locations: paramData?.location},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          loyalityAmount: res?.data?.loyalty_amount_saved
            ? Number(res?.data?.loyalty_amount_saved).toFixed(
                appData?.profile?.preferences?.digit_after_decimal,
              )
            : 0,
          availableCarList:
            pageNo == 1
              ? res?.data?.products?.data
              : [...availableCarList, ...res?.data?.products?.data],
          selectedCarOption: selectedCarOption
            ? selectedCarOption
            : res?.data?.products?.data[0],
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
          productFaqQuestionAnswers: res?.data?.products?.data?.map(
            (item, index) => {
              return item;
            },
          ),
        });
      })
      .catch(errorMethod);
  };

  //error handling of api
  const errorMethod = (error) => {
    console.log(error, 'errorOccured');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      indicatorLoader: false,
    });
    showError(error?.message || error?.error || error?.description);
  };

  const _getAddressBasedOnCoordinates = (region) => {
    Geocoder.from({
      latitude: region.latitude,
      longitude: region.longitude,
    })
      .then((json) => {
        // console.log(json, 'json');
        var addressComponent = json.results[0].formatted_address;
        updateState({
          formattedAddress: addressComponent,
        });
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };

  const _selectTime = () => {
    updateState({showTimeModal: false, showPaymentModal: true});
  };

  const sendStripeToken = (extraData, data) => {
    data['order_number'] = extraData?.orderDetail?.order_number;
    data['action'] = 'pickup_delivery';
    data['stripe_token'] = paramData?.tokenInfo;
    console.log(data, 'data>>><');
    console.log(extraData, 'extraData....');
    actions
      .openPaymentWebUrlPost(`/${selectedPayment?.code}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'res>>>>>');
        updateState({
          isModalVisible: false,
          isLoading: false,
          isRefreshing: false,
          indicatorLoader: false,
        });
        let newObj = extraData?.orderDetail;
        newObj['dispatch_traking_url'] = res?.data?.data?.dispatch_traking_url;
        extraData['orderDetail'] = newObj;

        navigation.navigate(
          navigationStrings.PICKUPTAXIORDERDETAILS,
          extraData,
        );
      })
      .catch(errorMethod);
  };

  const _finalPayment = (data) => {
    if (isEmpty(selectedPayment)) {
      // showError(strings.PLEASE_SELECT_A_PAYMENT_METHOD);
      _redirectToPayement();
      return;
    }

    updateState({
      isLoading: true,
      indicatorLoader: true,
    });
    console.log(data, 'data>>>>>');
    actions
      .placeDelievryOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'resresresres');
        if (res && res?.status == 200) {
          let extraData = {
            orderId: res?.data?.id,
            fromVendorApp: true,
            selectedVendor: {id: selectedCarOption?.vendor_id},
            orderDetail: res?.data,
            fromCab: paramData?.pickup_taxi ? false : true,
            pickup_taxi: paramData?.pickup_taxi,
            totalDuration: totalDuration,
            selectedCarOption: selectedCarOption?.sku,
          };
          if (selectedPayment?.id == 4) {
            sendStripeToken(extraData, data);
            return;
          }
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
            indicatorLoader: false,
          });
          navigation.navigate(
            navigationStrings.PICKUPTAXIORDERDETAILS,
            extraData,
          );
        } else {
          console.log(res, 'res>>>>>');
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
            indicatorLoader: false,
          });
          showError(res?.message || res?.error);
        }
      })
      .catch(errorMethod);
  };

  const _confirmAndPay = () => {
    console.log(selectedCarOption, 'selectedCarOption');
    console.log(selectedPayment?.id, 'selectedPayment?.id ');
    let data = {};

    data['task_type'] = pickUpTimeType ? pickUpTimeType : '';
    data['schedule_time'] =
      pickUpTimeType == 'now' ? '' : `${slectedDate} ${selectedTime}`;
    data['recipient_phone'] = '';
    data['recipient_email'] = '';
    data['task_description'] = taskInstruction;
    // data['amount'] =
    //   couponInfo && updatedAmount
    //     ? updatedAmount
    //     : selectedCarOption?.tags_price;
    data['amount'] = selectedCarOption?.tags_price;
    data['payment_option_id'] = selectedPayment ? selectedPayment?.id : 1;
    data['vendor_id'] = selectedCarOption?.vendor_id;
    data['product_id'] = selectedCarOption?.id;
    data['currency_id'] = currencies?.primary_currency?.id;
    data['tasks'] = paramData?.tasks;
    data['images_array'] = uploadImages;
    data['user_product_order_form'] = allSubmittedAnswers
      ? allSubmittedAnswers
      : [];
    if (couponInfo) {
      data['coupon_id'] = couponInfo?.id;
    }
    data['order_time_zone'] = RNLocalize.getTimeZone();

    if (!!userData) {
      !!userData?.client_preference?.verify_email ||
      !!userData?.client_preference?.verify_phone
        ? !!userData?.verify_details?.is_email_verified &&
          !!userData?.verify_details?.is_phone_verified
          ? selectedPayment.id == 10
            ? renderRazorPay(data)
            : _finalPayment(data)
          : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT_SECOND, {
              formCart: true,
            })()
        : selectedPayment.id == 10
        ? renderRazorPay(data)
        : _finalPayment(data);
    }
  };

  const renderRazorPay = (data) => {
    let options = {
      description: 'Payment for your order',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: appData?.profile?.preferences?.razorpay_api_key, // Your api key
      amount: Number(selectedCarOption?.tags_price) * 100,
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
          data['transaction_id'] = res?.razorpay_payment_id;
          _finalPayment(data); // placeOrder
        }
      })
      .catch(errorMethod);
  };

  const onBookNow = () => {
    var isRequired = false;
    !!selectedCarOption?.product_faq.length > 0 &&
      selectedCarOption.product_faq.forEach((val) => {
        if (val.is_required) {
          isRequired = true;
        }
      });
    if (isRequired) {
      alert('Please fill all required fields in detail form');
    } else {
      _confirmAndPay();
    }
  };

  const _selectTimeView = () => {
    return (
      <SelectTimeModalView
        date={date}
        onPressBack={() =>
          updateState({showTimeModal: false, showCarModal: true})
        }
        _onDateChange={_onNewDateChange}
        availAbleTimes={availAbleTimes}
        selectedAvailableTimeOption={selectedAvailableTimeOption}
        selectAvailAbleTime={(i) =>
          updateState({selectedAvailableTimeOption: i})
        }
        _selectTime={_selectTime}
        navigation={navigation}
        isTimerPickerModal={isTimerPickerModal}
        formatedTime={formatedTime}
        isDatePickerModal={isDatePickerModal}
        pickedUpTime={pickedUpTime}
        selectedDate={selectedDate}
        pickedUpDate={pickedUpDate}
        _pickerOpen={_pickerOpen}
        _pickerCancel={_pickerCancel}
        _onDayPress={_onDayPress}
        _modalOkPress={_modalOkPress}
        // date={formatedTime}
        scheduleDate={slectedDate}
        scheduleTime={selectedTime}
      />
    );
  };

  //Select Car vendor
  const _selectVendorModalView = () => {
    return (
      <SelectVendorModalView
        onPressAvailableVendor={(item) =>
          updateState({selectedVendorOption: item})
        }
        selectedVendorOption={selectedVendorOption}
        _select={() => {
          selectedVendorOption
            ? _getAllCarAndPrices()
            : showError(strings.PLEASE_SELECT_OPTION);
        }}
        // isLoading={isLoading}
        availableVendors={availableVendors}
        navigation={navigation}
      />
    );
  };

  const onPressAvailableVendor = (item) => {
    updateState({
      isLoading: true,
      availableCarList: [],
      pageNo: 1,
      selectedVendorOption: item,
    });
  };
  //Modal to select car

  const renderVendors = ({item}) => {
    return (
      <TouchableOpacity
        disabled={selectedVendorOption.id == item.id}
        onPress={() => onPressAvailableVendor(item)}
        style={{
          backgroundColor:
            selectedVendorOption.id == item.id
              ? themeColors.primary_color
              : 'white',
          padding: moderateScale(8),
          borderRadius: moderateScale(4),
          borderWidth: selectedVendorOption.id == item.id ? 0 : 0.5,
          borderColor: themeColors.primary_color,
        }}>
        <Text
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.regular,
            color:
              selectedVendorOption.id == item.id
                ? themeColors.secondary_color
                : colors.black,
          }}>
          {item?.name || ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const carModalHeader = () => {
    if (!!showPaymentModal) {
      return (
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
            padding: moderateScale(16),
            // alignItems: 'center',
            borderRadius: 8,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() =>
                redirectFromNow
                  ? updateState({showCarModal: true, showPaymentModal: false})
                  : updateState({showTimeModal: true, showPaymentModal: false})
              }>
              <Image
                style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
                source={imagePath.backArrowCourier}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity77
                  : colors.black,
                width: moderateScale(40),
                height: moderateScale(4),
                borderRadius: 8,
                marginRight: moderateScale(34),
              }}
            />
            <Text />
          </View>
          <View style={{marginBottom: moderateScaleVertical(32)}} />
        </View>
      );
    }
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          borderRadius: 8,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          marginTop: moderateScaleVertical(18),
        }}>
        <View
          style={{
            // padding: moderateScale(16),
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Image style={{opacity: 0}} source={imagePath.backArrowCourier} />

            <View
              style={{
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity77
                  : colors.black,
                width: moderateScale(40),
                height: moderateScale(4),
                borderRadius: 8,
                marginRight: moderateScale(34),
              }}
            />
          </View>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? colors.whiteOpacity77 : colors.black,
              marginTop: moderateScaleVertical(8),
            }}>
            {availableCarList.length > 0 ? strings.CHOOSE_A_TRIP : ''}
          </Text>
        </View>
        <View style={{marginVertical: moderateScale(8)}}>
          <FlatList
            horizontal
            data={availableVendors}
            renderItem={renderVendors}
            extraData={availableVendors}
            ItemSeparatorComponent={() => (
              <View style={{marginRight: moderateScale(12)}} />
            )}
            ListHeaderComponent={() => (
              <View style={{marginLeft: moderateScale(16)}} />
            )}
            ListFooterComponent={() => (
              <View style={{marginRight: moderateScale(16)}} />
            )}
          />
        </View>
      </View>
    );
  };

  const _selectCarModalView = () => {
    return (
      <AvailableDriver
        onPressAvailableCar={(item) => updateState({selectedCarOption: item})}
        selectedCarOption={selectedCarOption}
        onPressPickUpNow={() => {
          selectedCarOption
            ? updateState({
                // pickUpTimeType: 'now',
                showPaymentModal: true,
                redirectFromNow: true,
                showCarModal: false,
              })
            : showError(strings.PLEASE_SELECT_CAR);
        }}
        isLoading={isLoading}
        onPressPickUplater={() => {
          selectedCarOption
            ? updateState({
                // pickUpTimeType: 'schedule',
                showTimeModal: true,
                redirectFromNow: false,
                showCarModal: false,
              })
            : showError(strings.PLEASE_SELECT_CAR);
        }}
        availableCarList={availableCarList}
        // onPressAvailableVendor={(item) => onPressAvailableVendor(item)}
        selectedVendorOption={selectedVendorOption}
        _select={() => {
          selectedVendorOption
            ? _getAllCarAndPrices()
            : showError(strings.PLEASE_SELECT_OPTION);
        }}
        // isLoading={isLoading}
        availableVendors={availableVendors}
        navigation={navigation}
      />
    );
  };

  const _redirectToPayement = () => {
    moveToNewScreen(navigationStrings.PAYMENT_OPTIONS, {
      screenName: strings.PAYMENT,
    })();
  };

  console.log('app data');

  const uploadImage = async (img) => {
    console.log('selected image', img);

    const imgData = new FormData();
    imgData.append('upload_photo', {
      uri: img,
      name: 'image.png',
      fileName: 'image',
      type: 'image/png',
    });
    try {
      const res = await actions.imageUpload(imgData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });
      console.log('image upload res', res);
      updateState({
        uploadImages: [...uploadImages, ...[res.image]],
      });
    } catch (error) {
      console.log('erro rraised', error);
      showError(error?.error || error?.message);
    }
  };

  console.log('image uploaded res', uploadImages);

  const updateInstruction = (val) => {
    updateState({taskInstruction: val});
  };

  const onQuestionAnswerSubmit = (item) => {
    updateState({
      allSubmittedAnswers: item,
    });
  };

  const _selectPaymentView = () => {
    console.log(
      'selectedPaymentselectedPaymentselectedPayment',
      selectedPayment,
    );
    return (
      <SelectPaymentModalView
        _confirmAndPay={_confirmAndPay}
        slectedDate={pickedUpDate}
        isModalVisible={isModalVisible}
        selectedTime={pickedUpTime}
        date={date}
        onPressBack={() =>
          redirectFromNow
            ? updateState({showCarModal: true, showPaymentModal: false})
            : updateState({showTimeModal: true, showPaymentModal: false})
        }
        totalDistance={totalDistance}
        totalDuration={totalDuration}
        selectedCarOption={selectedCarOption}
        navigation={navigation}
        couponInfo={couponInfo}
        updatedPrice={updatedAmount}
        loyalityAmount={loyalityAmount}
        removeCoupon={() => removeCoupon()}
        pickUpTimeType={pickUpTimeType}
        redirectToPayement={() => _redirectToPayement()}
        selectedPayment={selectedPayment}
        pickup_taxi={paramData?.pickup_taxi}
        uploadImage={uploadImage}
        updateInstruction={updateInstruction}
        productFaqQuestionAnswers={selectedCarOption}
        onQuestionAnswerSubmit={(item) => onQuestionAnswerSubmit(item)}
        indicatorLoader={indicatorLoader}
      />
    );
  };

  const removeCoupon = () => {
    updateState({
      updatedAmount: null,
      couponInfo: null,
    });
  };

  const _onDateChange = (date) => {
    // alert(213);
    console.log(date, 'date');
    let time = moment(date).format('HH:mm');
    let dateSelectd = moment(date).format('YYYY-MM-DD');

    console.log(time, 'time');
    console.log(dateSelectd, 'dateSelectd');
    updateState({
      selectedDateAndTime: `${dateSelectd} ${time}`,
      slectedDate: dateSelectd,
      selectedTime: moment(date).format('LT'),
      date: date,
      formatedTime: moment(value).format('LT'),
    });
  };

  const _updateState = () => {
    // navigationStrings.CABDRIVERLOCATIONANDDETAIL
    updateState({isModalVisible: false});
    navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL, {});
  };

  const onMapPress = (e) => {
    updateState({
      locations: [...locations, e.nativeEvent.coordinate],
    });
  };

  const _pickerOpen = (value) => {
    updateState({[value]: true});
  };

  const _pickerCancel = (value) => {
    updateState({[value]: false});
  };

  const _onDayPress = (value) => {
    updateState({selectedDate: value.dateString});
  };

  const _modalOkPress = (value1, value2) => {
    updateState({
      [value1]: false,
      [value2]: value2 === 'pickedUpTime' ? formatedTime : selectedDate,
    });
  };

  const _onNewDateChange = (value) => {
    updateState({formatedTime: moment(value).format('hh:mm A')});
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     coordinatesFit();
  //   }, 2000);
  // }, []);

  console.log('paramData?.location', paramData);
  // useEffect(() => {
  //   console.log('check state ref array >>>', refArr);
  //   refArr.forEach((element) => {
  //     element.current.showCallout();
  //   });
  // }, [refArr]);

  // const showRef = (_markerRef, index) => {
  //   if (_markerRef) {
  //     const temp = paramData?.tasks;
  //     let newObj = temp[index];
  //     newObj = {...newObj, markerRef: _markerRef};
  //     temp[index] = newObj;
  //     // state set
  //     setRefArr(temp);
  //   }
  // };

  const onCenter = () => {
    if (paramData?.location.length > 0 && !!mapRef?.current?.fitToCoordinates) {
      mapRef.current.fitToCoordinates(paramData?.location, {
        edgePadding: {
          right: width / 3.2,
          bottom: height / 20,
          left: width / 3.2,
          top: height / 20,
        },
      });
    }
  };

  const onPressPickUpNow = () => {
    selectedCarOption
      ? updateState({
          // pickUpTimeType: 'now',
          showPaymentModal: true,
          redirectFromNow: true,
          showCarModal: false,
        })
      : showError(strings.PLEASE_SELECT_CAR);
  };

  return (
    <View style={{...styles.container}}>
      {/* <View style={{ height: StatusBarHeight }} /> */}
      <View style={{flex: 1}}>
        {!!paramData?.location.length > 0 && (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            customMapStyle={
              appIds.cabway == DeviceInfo.getBundleId() ? null : mapStyleGrey
            }
            // style={styles.map}
            style={{height: height / 2.3}}
            region={region}
            initialRegion={region}
            //   customMapStyle={mapStyle}
            // ref={mapRef}
            // liteMode={true}
            tracksViewChanges={false}>
            <CustomCallouts data={paramData?.tasks} />

            <MapViewDirections
              origin={paramData?.location[0]}
              waypoints={
                paramData?.location.length > 2
                  ? paramData?.location.slice(1, -1)
                  : []
              }
              destination={paramData?.location[paramData?.location.length - 1]}
              apikey={profile?.preferences?.map_key}
              strokeWidth={4}
              strokeColor={colors.black}
              optimizeWaypoints={true}
              onStart={(params) => {
                // console.log(Started routing between "${params.origin}" and "${params.destination}");
              }}
              precision={'high'}
              timePrecision={'now'}
              mode={'DRIVING'}
              // maxZoomLevel={20}
              onReady={(result) => {
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                updateState({
                  totalDistance: result.distance.toFixed(2),
                  totalDuration: result.duration.toFixed(2),
                });
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: width / 3.2,
                    bottom: height / 20,
                    left: width / 3.2,
                    top: height / 20,
                  },
                });
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
            />
          </MapView>
        )}

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
          }}
          onPress={onCenter}>
          <Image
            style={{
              width: moderateScale(34),
              height: moderateScale(34),
              borderRadius: moderateScale(34 / 2),
            }}
            source={imagePath.mapNavigation}
          />
        </TouchableOpacity>
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[height / 2.2, height / 1.25]}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          handleComponent={carModalHeader}
          onChange={() => playHapticEffect(hapticEffects.impactMedium)}>
          <BottomSheetScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.white,
              }}>
              {!!showCarModal && _selectCarModalView()}
              {/* {!!showTimeModal && _selectTimeView()} */}
              {!!showPaymentModal && _selectPaymentView()}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
        {!!showCarModal && (
          <View
            style={{
              width: '90%',
              position: 'absolute',
              bottom: 20,
              marginHorizontal: moderateScale(16),
            }}>
            {availableCarList.length > 0 && (
              <GradientButton
                // endcolor={{x: 0.0, y: 0.25}}
                // startcolor={{x: 0.0, y: 0.0}}
                colorsArray={[
                  themeColors.primary_color,

                  themeColors.primary_color,
                ]}
                textStyle={{textTransform: 'none', fontSize: textScale(14)}}
                onPress={
                  selectedCarOption?.variant[0]?.price > 0
                    ? onPressPickUpNow
                    : () => {}
                }
                btnText={
                  selectedCarOption?.variant[0]?.price > 0
                    ? `${strings.CONFIRM} ${selectedCarOption?.translation[0]?.title} `
                    : strings.NORIDEAVAILABLE
                }
                containerStyle={{flex: 1}}
              />
            )}
          </View>
        )}

        {/* {!!showPaymentModal && (
          <View
            style={{
              width: '90%',
              position: 'absolute',
              bottom: 20,
              marginHorizontal: moderateScale(16),

            }}>

            <GradientButton
              // endcolor={{x: 0.0, y: 0.25}}
              // startcolor={{x: 0.0, y: 0.0}}
              indicator={indicatorLoader}
              indicatorColor={colors.white}
              colorsArray={[
                themeColors.primary_color,

                themeColors.primary_color,
              ]}
              textStyle={{ textTransform: 'none', fontSize: textScale(14) }}
              onPress={onBookNow}
              btnText={
                paramData?.pickup_taxi
                  ? strings.BOOK_NOW_RIDE
                  : pickUpTimeType === 'now'
                    ? strings.BOOK_NOW
                    : strings.SCHEDULE_RIDE_FOR +
                    `${moment(slectedDate).format('DD MMM')} ${selectedTime} `
              }
              containerStyle={{ flex: 1 }}
            />

          </View>
        )} */}
      </View>

      {/* BottomView */}

      <View style={styles.topView}>
        <TouchableOpacity
          style={{
            marginTop: moderateScaleVertical(4),
            height: moderateScale(40),
            width: moderateScale(40),
            borderRadius: moderateScale(16),
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() =>
            // navigation.navigate(navigationStrings.PICKUPLOCATION)
            navigation.goBack()
          }>
          <Image
            source={imagePath.backArrowCourier}
            style={{
              tintColor: colors.black,
            }}
          />
        </TouchableOpacity>
      </View>

      <PaymentProcessingModal
        isModalVisible={isModalVisible}
        updateModalState={_updateState}
      />
    </View>
  );
}
