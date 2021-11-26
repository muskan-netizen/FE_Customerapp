import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, { Callout, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { getColorCodeWithOpactiyNumber, showError } from '../../../utils/helperFunctions';
import SelectCarModalView from './SelectCarModalView';
import SelectPaymentModalView from './SelectPaymentModalView';
import SelectTimeModalView from './SelectTimeModalView';
import SelectVendorModalView from './SelectVendorModalView';
import stylesFun from './styles';
import * as RNLocalize from 'react-native-localize';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../../styles/theme';
import strings from '../../../constants/lang';
import PaymentProcessingModal from '../../CourierService/PaymentProcessingModal';
import { BlurView } from '@react-native-community/blur';
import { useFocusEffect } from '@react-navigation/native';
import { mapStyleGrey } from '../../../utils/constants/MapStyle';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetVirtualizedList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import AvailableDriver from './AvailableDriver';
import GradientButton from '../../../Components/GradientButton';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function ChooseCarTypeAndTime({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  console.log('my route', paramData);
  const bottomSheetRef = useRef(null)

  const { appData, currencies, languages, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state?.auth?.userData);

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
    pickUpTimeType: paramData?.pickUpTimeType
      ? paramData?.pickUpTimeType
      : null,
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
    selectedPayment: { id: 1, title: 'Cash On Delivery', image: imagePath.cash },
    taskInstruction: ''
  });
  const {
    selectedPayment,
    couponInfo,
    updatedAmount,
    totalDistance,
    totalDuration,
    showVendorModal,
    selectedDateAndTime,
    pickUpTimeType,
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
    taskInstruction
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const styles = stylesFun({ fontFamily, themeColors });
  const commonStyles = commonStylesFun({ fontFamily });
  const { profile } = appData;

  const walletAmount = useSelector(
    (state) => state?.product?.walletData?.wallet_amount,
  );

  const mapRef = useRef();

  const markerRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (paramData && paramData?.selectedMethod) {
        updateState({ selectedPayment: paramData?.selectedMethod });
      }
      // updateState({isLoadingB: true});
    }, [paramData]),
  );
  console.log(selectedPayment, 'selectedPayment');
  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, { language: 'en' }); // set the language
  }, []);

  const _confirmAddress = (addressType) => { };
  const _onRegionChange = (region) => {
    updateState({ region: region });
    _getAddressBasedOnCoordinates(region);
    markerRef.current.showCallout();

    // animate(region);
  };

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
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
    updateState({ isLoading: true, showVendorModal: false, showCarModal: true });
    actions
      .getAllCarAndPrices(
        `/${selectedVendorOption?.id}?page=${pageNo}&limit=${limit}`,
        { locations: paramData?.location },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          loyalityAmount: res?.data?.loyalty_amount_saved
            ? Number(res?.data?.loyalty_amount_saved).toFixed(2)
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
        });
      })
      .catch(errorMethod);
  };

  //error handling of api
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
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
    updateState({ showTimeModal: false, showPaymentModal: true });
  };

  const _finalPayment = (data) => {
    updateState({
      isLoading: true,
    });
    actions
      .placeDelievryOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        if (res && res?.status == 200) {
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
          });
          // navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL, {
          //   orderDetail: res?.data,
          //   selectedCarOption: selectedCarOption,
          // });
          navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
            orderId: res?.data?.id,
            fromVendorApp: true,
            selectedVendor: { id: selectedCarOption?.vendor_id },
            orderDetail: res?.data,
            fromCab: paramData?.pickup_taxi ? false : true,
            pickup_taxi: paramData?.pickup_taxi,
            totalDuration: totalDuration,
            selectedCarOption: selectedCarOption?.sku,
          });
        } else {
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
          });
          showError(res?.message || res?.error);
        }
      })
      .catch(errorMethod);
  };
  //Modal to select time

  const _confirmAndPay = () => {
    console.log(selectedCarOption, 'selectedCarOption');
    console.log(selectedPayment?.id, 'selectedPayment?.id ');
    let data = {};

    data['task_type'] = pickUpTimeType ? pickUpTimeType : '';
    data['schedule_time'] = pickUpTimeType == 'now' ? '' : `${slectedDate} ${selectedTime}`;
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
    data['images_array'] = uploadImages
    if (couponInfo) {
      data['coupon_id'] = couponInfo?.id;
    }
    data['order_time_zone'] = RNLocalize.getTimeZone();
    console.log(data, '_confirmAndPay>>>>data>>>');

    if (!!userData) {
      !!userData?.client_preference?.verify_email ||
        !!userData?.client_preference?.verify_phone
        ? !!userData?.verify_details?.is_email_verified &&
          !!userData?.verify_details?.is_phone_verified
          ? _finalPayment(data)
          : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT_SECOND, {
            formCart: true,
          })()
        : _finalPayment(data);
    } else {
      _finalPayment();
    }
  };

  console.log(selectedCarOption, 'selectedCarOption');

  const _selectTimeView = () => {
    return (
      <SelectTimeModalView
        date={date}
        onPressBack={() =>
          updateState({ showTimeModal: false, showCarModal: true })
        }
        _onDateChange={_onNewDateChange}
        availAbleTimes={availAbleTimes}
        selectedAvailableTimeOption={selectedAvailableTimeOption}
        selectAvailAbleTime={(i) =>
          updateState({ selectedAvailableTimeOption: i })
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
          updateState({ selectedVendorOption: item })
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

  const carModalHeader = () => {
    if (!!showPaymentModal) {
      return (
        <View style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          padding: moderateScale(16),
          // alignItems: 'center',
          borderRadius: 8,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity
              onPress={() => redirectFromNow
                ? updateState({ showCarModal: true, showPaymentModal: false })
                : updateState({ showTimeModal: true, showPaymentModal: false })}
            >
              <Image
                style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
                source={imagePath.backArrowCourier}
              />
            </TouchableOpacity>
            <View style={{
              backgroundColor: isDarkMode
                ? colors.whiteOpacity77
                : colors.black,
              width: moderateScale(40),
              height: moderateScale(4),
              borderRadius: 8,
              marginRight: moderateScale(34)
            }} />
            <Text />
          </View>
        </View>
      )
    }
    return (
      <View style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
        padding: moderateScale(16),
        alignItems: 'center',
        borderRadius: 8,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}>
        <View style={{
          backgroundColor: isDarkMode
            ? colors.whiteOpacity77
            : colors.black,
          width: moderateScale(40),
          height: moderateScale(4),
          borderRadius: 8,
          marginRight: moderateScale(34)
        }} />
        <Text style={{
          fontFamily: fontFamily.regular,
          color: isDarkMode
            ? colors.whiteOpacity77
            : colors.black,
          marginTop: moderateScaleVertical(8)
        }}>Choose a trip or swipe up for more</Text>
      </View>
    )
  }

  const _selectCarModalView = () => {
    return (
      <AvailableDriver
        onPressAvailableCar={(item) => updateState({ selectedCarOption: item })}
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
        onPressAvailableVendor={(item) => onPressAvailableVendor(item)}
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

  console.log("app data")


  const uploadImage = async (img) => {
    console.log('selected image', img)

    const imgData = new FormData();
    imgData.append("upload_photo", {
      uri: img,
      name: "image.png",
      fileName: 'image',
      type: 'image/png'
    })
    try {
      const res = await actions.imageUpload(imgData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      console.log("image upload res", res)
      updateState({
        uploadImages: [...uploadImages, ...[res.image]]
      })
    } catch (error) {
      console.log("erro rraised", error)
      showError(error?.error || error?.message)
    }
  }

  console.log("image uploaded res", uploadImages)

  const updateInstruction = (val) => {
    updateState({ taskInstruction: val })
  }

  const _selectPaymentView = () => {
    return (
      <SelectPaymentModalView
        _confirmAndPay={_confirmAndPay}
        slectedDate={pickedUpDate}
        isModalVisible={isModalVisible}
        selectedTime={pickedUpTime}
        navigation={navigation}
        date={date}
        onPressBack={() =>
          redirectFromNow
            ? updateState({ showCarModal: true, showPaymentModal: false })
            : updateState({ showTimeModal: true, showPaymentModal: false })
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
    updateState({ isModalVisible: false });
    navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL, {});
  };

  const onMapPress = (e) => {
    updateState({
      locations: [...locations, e.nativeEvent.coordinate],
    });
  };

  const _pickerOpen = (value) => {
    updateState({ [value]: true });
  };

  const _pickerCancel = (value) => {
    updateState({ [value]: false });
  };

  const _onDayPress = (value) => {
    updateState({ selectedDate: value.dateString });
  };

  const _modalOkPress = (value1, value2) => {
    updateState({
      [value1]: false,
      [value2]: value2 === 'pickedUpTime' ? formatedTime : selectedDate,
    });
  };

  const _onNewDateChange = (value) => {
    updateState({ formatedTime: moment(value).format('hh:mm A') });
  };


  useEffect(() => {
    setTimeout(() => {
      coordinatesFit()
    }, 2000);
  }, [])

  console.log("paramData?.location", paramData)
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


  const coordinatesFit = () => {
    if (paramData?.location.length > 0 && !!mapRef?.current?.fitToCoordinates) {
      mapRef.current.fitToCoordinates(paramData?.location,
        {
          edgePadding: {
            right: width / 20,
            bottom: height / 20,
            left: width / 20,
            top: height / 20,
          },
        }
      )
    }
  }

  const onPressPickUpNow = () => {
    selectedCarOption
      ? updateState({
        // pickUpTimeType: 'now',
        showPaymentModal: true,
        redirectFromNow: true,
        showCarModal: false,
      })
      : showError(strings.PLEASE_SELECT_CAR);
  }

  return (
    <View style={{ ...styles.container }}>
      <View style={{ height: StatusBarHeight }} />
      <View
        style={{
          flex: 1
        }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          customMapStyle={mapStyleGrey}
          // style={styles.map}
          style={StyleSheet.absoluteFillObject}
          region={region}
          initialRegion={region}
          //   customMapStyle={mapStyle}
          // ref={mapRef}
          // liteMode={true}
          tracksViewChanges={false}
        // onPress={onMapPress}
        // onRegionChangeComplete={() =>
        //   _onRegionChange(region, {isGesture: true})
        // }
        >

          {paramData?.tasks.map((coordinate, index) => {
            return (
              <View>
                <MapView.Marker
                  ref={markerRef}
                  zIndex={index}
                  key={`coordinate_${index}`}
                  image={imagePath.radioLocation}
                  coordinate={{
                    latitude: Number(coordinate?.latitude),
                    longitude: Number(coordinate?.longitude),
                  }}>
                  <View
                    style={{
                      ...styles.plainView,
                      backgroundColor: themeColors.primary_color
                    }}>
                    <Text style={styles.pickupDropOff}>
                      {index === 0 ? 'Pickup' : 'Drop'}
                    </Text>
                  </View>
                </MapView.Marker>
              </View>
            );
          })}

          <MapViewDirections
            origin={paramData?.location[0]}
            waypoints={
              paramData?.location.length > 2
                ? paramData?.location.slice(1, -1)
                : []
            }
            destination={paramData?.location[paramData?.location.length - 1]}
            apikey={profile?.preferences?.map_key}
            strokeWidth={3}
            strokeColor={themeColors.primary_color}
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
                  right: width / 20,
                  bottom: height / 20,
                  left: width / 20,
                  top: height / 20,
                },
              });
            }}
            onError={(errorMessage) => {
              // console.log('GOT AN ERROR');
            }}
          />
        </MapView>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={['25%', '50%']}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          handleComponent={carModalHeader}
        >
          <BottomSheetScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={{
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
        {!showPaymentModal && (<View style={{
          width: '90%',
          position: 'absolute',
          bottom: 20,
          marginHorizontal: moderateScale(16),

        }}>

          {availableCarList.length > 0 && (<GradientButton
            // endcolor={{x: 0.0, y: 0.25}}
            // startcolor={{x: 0.0, y: 0.0}}
            colorsArray={[
              themeColors.primary_color,

              themeColors.primary_color,
            ]}
            textStyle={{ textTransform: 'none', fontSize: textScale(14) }}
            onPress={
              selectedCarOption?.variant[0]?.price > 0
                ? onPressPickUpNow
                : () => { }
            }
            btnText={
              selectedCarOption?.variant[0]?.price > 0
                ? `${strings.CONFIRM} ${selectedCarOption?.translation[0]?.title} `
                : strings.NORIDEAVAILABLE
            }
            containerStyle={{ flex: 1 }}
          />)}
        </View>)}

      </View>

      {/* BottomView */}


      <View style={styles.topView}>
        <TouchableOpacity
          style={{
            marginTop: moderateScaleVertical(24),
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
