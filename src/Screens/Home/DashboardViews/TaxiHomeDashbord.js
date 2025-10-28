import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import * as RNLocalize from 'react-native-localize';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import AddressModal3 from '../../../Components/AddressModal3';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import HorizontalLine from '../../../Components/HorizontalLine';
import TaxiHomeCategoryCard from '../../../Components/TaxiHomeCategoryCard';
import VendorModeHeader from '../../../Components/VendorModeHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFunc, {
  hitSlopProp,
  hitSlopProp7,
} from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { mapStyleGrey } from '../../../utils/constants/MapStyle';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';
import stylesFunc from '../styles';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import CategoryLoader from '../../../Components/Loaders/CategoryLoader';
import TaxiHomeShimmer from '../../../Components/Loaders/TaxiHomeShimmer';

export default function TaxiHomeDashbord({
  handleRefresh = () => { },
  isRefreshing = false,
  onPressCategory = () => { },
  location = {},
  curLatLong = {},
  currentLocation = {},
  isHomeDataloding = false,
  selcetedToggle = () => { }
}) {
  const navigation = useNavigation();
  const theme = useSelector(state => state?.initBoot?.themeColor);
  const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
  const userData = useSelector(state => state?.auth?.userData);
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, currencies, themeColors, appStyle, languages } = useSelector(
    state => state?.initBoot,
  );
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    date: new Date(),
    allSavedAddress: [],
    isVisible: false,
    isVisible1: false,
    updateData: {},
    indicator: false,
    type: 'addAddress',
    newAddressAdded: null,
    isLoadingModal: true,
    fullMapShow: false,
    isVisibleAddressModal: false,
    pickupAddress: {},
    allListedDrivers: [],
    isLoading: true,
  });
  const appMainData = useSelector(state => state?.home?.appMainData);
  useEffect(() => {
    if (!!appMainData?.categories) {
      updateState({ isLoadingModal: false });
    }
  }, [appMainData]);
  const fontFamily = appStyle?.fontSizeData;
  const { bannerRef } = useRef();
  const {
    slider1ActiveSlide,
    allSavedAddress,
    isVisible,
    date,
    isVisible1,
    updateData,
    indicator,
    type,
    del,
    isLoadingModal,
    fullMapShow,
    selectViaMap,
    allListedDrivers,
    isLoading,
  } = state;
  const [isHourlyRentalModal, setIsHourlyRentalModal] = useState(false);
  const [isRentalCalendarModal, setIsRentalCalendarModal] = useState(false);
  const [rentalHours, setRentalHours] = useState(1);
  const [isAm, setIsAm] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [dateTime, setDateTime] = useState('');
  const [dayTime, setDayTime] = useState(new Date());
  const [isTimePicker, setIsTimePicker] = useState(false);
  const [isHourlyRental, setIsHourlyRental] = useState(false);
  const [pressedCategory, setPressedCategory] = useState({});
  const [categoryBasePrice, setCategoryBasePrice] = useState(0);
  const [categoryBaseKM, setCategoryBaseKM] = useState(0);
  const [markedDate, setMarkedDate] = useState(null);

  const styles = stylesFunc({ themeColors, fontFamily });
  const commonStyles = commonStylesFunc({ fontFamily });
  const updateState = data => setState(state => ({ ...state, ...data }));

  let myCategories = [{ data: [] }];

  if (!isEmpty(appMainData?.homePageLabels)) {
    myCategories =
      !!appMainData?.homePageLabels &&
      appMainData?.homePageLabels.filter((val, i) => {
        if (val.slug == 'nav_categories') {
          return val;
        }
      });
  } else {
    myCategories = !isEmpty(appMainData?.categories) && [
      { data: appMainData?.categories || [] },
    ];
  }

  useEffect(() => {
    if (!!appMainData?.categories) {
      updateState({ isLoadingModal: false, isLoading: false });
    }
  }, [appMainData]);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (location?.latitude && location?.longitude && userData?.auth_token) {
      getAllDrivers();
    }
  }, []);

  // useInterval(
  //   () => {
  //     if (location?.latitude && location?.longitude && userData?.auth_token) {
  //       getAllDrivers();
  //     }
  //   },
  //   isFocused ? 5000 : null,
  // );

  const mapRef = useRef();

  useEffect(() => {
    if (allListedDrivers && allListedDrivers?.length) {
      let arr = [];
      allListedDrivers?.map((i, inx) => {
        if (
          i &&
          i?.agentlog?.lat &&
          i?.agentlog?.lat != NaN &&
          i?.agentlog?.long != NaN
        ) {
          arr = [
            ...arr,
            {
              latitude: Number(i?.agentlog?.lat),
              longitude: Number(i?.agentlog?.long),
            },
          ];
        }
      });
      // animate(region);
      fitPadding(arr);
    }
  }, []);

  const fitPadding = newArray => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([...newArray], {
        edgePadding: { top: 100, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  };

  const getAllDrivers = () => {
    actions
      .getAllNearByDrivers(
        {
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(res => {
        updateState({
          allListedDrivers: res?.data,
          isLoading: false,
        });
      })
      .catch(error => {
        console.log(error, 'error>>>>>>>>>>>>>.drivers');
      });
  };

  //render marker on map with driver type

  const renderDriverTypeMarkes = type => {
    switch (type?.vehicle_type_id) {
      case 1:
        return imagePath.icmanMarker;
        break;
      case 2:
        return imagePath.iccycleMarker;
        break;
      case 3:
        return imagePath.icBikeMarker;
        break;
      case 4:
        return imagePath.icCar;
        break;
      case 5:
        return imagePath.ictruckMarker;
        break;
    }
  };

  useEffect(() => {
    if (!!userData?.auth_token) {
      getAllAddress();
    }
  }, [del]);

  useFocusEffect(
    React.useCallback(() => {
      if (!!userData?.auth_token) {
        getAllAddress();
      }
    }, []),
  );

  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then(res => {
        updateState({
          allSavedAddress: res.data,
          isLoading: false,
          indicator: false,
        });
      })
      .catch(error => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  const continueWithNaxtScreen = item => {
    if (!!userData?.auth_token) {
      if (isHourlyRental) {
        setPressedCategory(item);
        setIsHourlyRentalModal(true);
        onHourlyPrice(item);
        return;
      }
      onPressCategory(item);
    } else {
      actions.setAppSessionData('on_login');
    }
  };

  const onHourlyPrice = item => {
    let url = `?cat_id=${item?.id}`;
    actions
      .onGetHourlyBasePrice(url, {
        code: appData?.profile?.code,
      })
      .then(res => {
        console.log(res, '<===onGetHourlyBasePrice');
        setCategoryBasePrice(res?.data?.price);
        setCategoryBaseKM(
          !!res?.data?.km_included ? res?.data?.km_included : 1,
        );
      })
      .catch(errorMethod);
  };

  const addUpdateLocation = childData => {
    //setModalVisible(false);
    updateState({ isLoading: true });

    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then(res => {
        console.log(res, 'res>res>res');
        updateState({ del: del ? false : true });
        showSuccess(res.message);
        updateState({ isLoading: false });
        setModalVisible(false);
      })
      .catch(error => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  const openCloseMapAddress = type => {
    updateState({ selectViaMap: type == 1 ? true : false });
  };

  const setModalVisible = (visible, type, id, data) => {
    updateState({ selectViaMap: false });
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible1: visible,
        type: type,
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  /********************************** instant booking funcationality module code starts here *****************************/

  /********************************** get list of vichales based on the vendor and category *********************/

  /********************** instunt order place api code written here ************************/

  const _onInstuntOrderPlace = () => {
    const vendorIdForInstuntBooking =
      appData?.profile?.preferences?.pick_drop_instant_booking_vendor?.id;
    const productIdForIstuntBooking =
      appData?.profile?.preferences?.pick_drop_instant_booking_vendor
        ?.products[0]?.id;
    const locationForOrder = [
      {
        ...currentLocation,
        pre_address: currentLocation?.address,
        task_type_id: 1,
      },
    ];
    const productSKu =
      appData?.profile?.preferences?.pick_drop_instant_booking_vendor
        ?.products[0]?.sku;

    let data = {};
    data['task_type'] = 'now';
    data['schedule_time'] = '';
    data['is_one_push_booking'] = 1;
    data['recipient_phone'] = '';
    data['recipient_email'] = '';
    data['task_description'] = '';
    data['amount'] = 0;
    data['tags_amount'] = 0;
    data['tollamount'] = 0;
    data['servicechargeamount'] = 0;
    data['payment_option_id'] = 1;
    data['vendor_id'] = vendorIdForInstuntBooking;
    data['product_id'] = productIdForIstuntBooking;
    data['currency_id'] = currencies?.primary_currency?.id;
    data['tasks'] = locationForOrder;
    data['images_array'] = [];
    data['user_product_order_form'] = [];
    data['is_postpay'] = '';
    data['order_time_zone'] = RNLocalize.getTimeZone();
    data['bookingType'] = '';
    data['friendName'] = '';

    actions
      .placeDelievryOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then(res => {
        console.log('res+++++++', res);
        if (res && res?.status == 200) {
          let extraData = {
            orderId: res?.data?.id,
            fromVendorApp: true,
            selectedVendor: { id: vendorIdForInstuntBooking },
            orderDetail: res?.data,
            fromCab: true,
            pickup_taxi: navigationStrings.HOME,
            totalDuration: 0,
            selectedCarOption: productSKu,
          };
          navigation.navigate(
            navigationStrings.PICKUPTAXIORDERDETAILS,
            extraData,
          );
        }
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const errorMethod = error => {
    showError(error?.message || error?.error || error?.description);
  };

  /*********************************************** instunt booking module code ends here *************************/

  const _renderItem = useCallback(
    ({ item, index }) => {
      return (
        <TaxiHomeCategoryCard
          data={item}
          onPress={() => continueWithNaxtScreen(item)}
          mainViewStyle={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.greyNew,
          }}
          index={index}
        />
      );
    },
    [appMainData?.categories, isDarkMode, isHourlyRental],
  );

  const moveToScreen = (details, mapView) => {
    updateState({ fullMapShow: false });

    if (!mapView) {
      if (!!userData?.auth_token) {
        let prefillAdress = null;
        if (!!details) {
          prefillAdress = {
            longitude: Number(details?.longitude),
            latitude: Number(details?.latitude),
            address: details?.address,
            task_type_id: 1,
            pre_address: details?.address,
            isFromSavedAddress: true,
          };
        }
        actions.saveSchduleTime('now');
        goToAddress({ prefillAdress });
      } else {
        actions.setAppSessionData('on_login');
      }
      return;
    }
    setTimeout(() => {
      if (!!userData?.auth_token) {
        let prefillAdress = null;
        if (!!details) {
          prefillAdress = {
            longitude: Number(details?.longitude),
            latitude: Number(details?.latitude),
            address: details?.address,
            task_type_id: 1,
            pre_address: details?.address,
            isFromSavedAddress: true,
          };
        }
        actions.saveSchduleTime('now');
        goToAddress({ prefillAdress });
      } else {
        actions.setAppSessionData('on_login');
      }
    }, 800);
  };

  const addressView = image => {
    return (
      !!allSavedAddress &&
      allSavedAddress.slice(0, 2).map((itm, inx) => {
        return (
          <TouchableOpacity
            key={inx}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: moderateScaleVertical(12),
              justifyContent: 'space-between',
              marginHorizontal: moderateScale(12),
              marginTop: moderateScaleVertical(10),
              borderRadius: moderateScale(12),
              borderWidth: 1,
              borderColor: colors.borderColor,
              flex: 1,
            }}
            onPress={() => moveToScreen(itm, false)}>
            <Image source={image} />
            <View
              style={{
                marginHorizontal: moderateScale(10),
                flex: 1,
                justifyContent: 'center',
                minHeight: moderateScaleVertical(32),
              }}>
              {itm?.street ? <Text
                numberOfLines={2}
                style={{
                  ...styles.address,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.black,
                  fontFamily: fontFamily.medium,
                }}>
                {itm?.street}
              </Text> : null}
              <Text
                numberOfLines={1}
                style={{
                  ...styles.address,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.black,
                }}>
                {itm?.address}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })
    );
  };


  const goToAddress = ({
    fromMap = false,
    scheduleDate = null,
    prefillAdress = null,
  }) => {
    if (!!userData?.auth_token) {
      let item = !!appMainData?.categories
        ? appMainData?.categories[0]
        : myCategories[0]?.data[0];
      if (isHourlyRental) {
        setIsHourlyRentalModal(true);
        setPressedCategory(item);
        return;
      }
      actions.saveSchduleTime(!!scheduleDate ? scheduleDate : 'now');
      if (fromMap) {
        updateState({ fullMapShow: false });
        setTimeout(() => {
          navigation.navigate(navigationStrings.ADDADDRESS, {
            item,
            prefillAdress: !!prefillAdress ? prefillAdress : null,
            hourlyDateTime: isHourlyRental ? dateTime : null,
          });
        }, 800);
      } else {
        navigation.navigate(navigationStrings.ADDADDRESS, {
          item,
          prefillAdress: !!prefillAdress ? prefillAdress : null,
          hourlyDateTime: isHourlyRental ? dateTime : null,
        });
      }
    } else {
      actions.setAppSessionData('on_login');
    }
  };

  const onDateSet = date => {
    updateState({
      isVisible: false,
      isLoadingModal: true,
    });
    setTimeout(() => {
      updateState({ isLoadingModal: false });
      goToAddress({ fromMap: false, scheduleDate: date });
    }, 2000);
  };

  const onChooseTrip = () => {
    if (!dateTime) {
      alert('Pleast select pickup date and time.');
      return;
    }

    setTimeout(() => {
      actions.saveSchduleTime(
        moment(dateTime).format('YYYY-DD-MM hh:mm') >
          moment().format('YYYY-DD-MM hh:mm')
          ? new Date(dateTime)
          : 'now',
      );
      onPressCategory({
        ...pressedCategory,
        hourlyDateTime: dateTime,
        rentalTime: isHourlyRental ? rentalHours : null,
      });
      setIsHourlyRentalModal(false);
    }, 500);
  };

  const onLeaveNow = () => {
    setDateTime(new Date());
    setMarkedDate(moment(new Date()).format('YYYY-MM-DD'));
    setDayTime(new Date());
    const currentDate = new Date();
    const hours = currentDate.getHours();
    setIsAm(hours < 12);
  };

  const onDayPress = day => {
    setDayTime(new Date(day?.dateString));
    setMarkedDate(day?.dateString);
  };

  const onConfirmDayTime = date => {
    setDayTime(date);
    const currentDate = new Date(date);
    const hours = currentDate.getHours();
    setIsAm(hours < 12);
    setIsTimePicker(false);
  };

  const onSetupPickupTime = () => {
    if (!markedDate || markedDate == null) {
      alert('Please select rental date');
      return;
    }
    setDateTime(dayTime);
    setIsRentalCalendarModal(false);
  };
  const renderBanners = ({ item = {}, index = 0 }) => {
    const imageUrl =
      item?.banner_image_url ||
      getImageUrl(
        item?.image.image_fit,
        item?.image.image_path,
        appStyle?.homePageLayout === 5
          ? '800/600'
          : DeviceInfo.getBundleId() == appIds.masa
            ? '800/600'
            : '1200/1000',
      );
    return (
      <View key={String(item?.id || index)} style={{}}>
        <TouchableOpacity
          style={{}}
          activeOpacity={0.8}
          onPress={() => goToAddress({ fromMap: true })}>
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              height:
                DeviceInfo.getBundleId() == appIds.masa
                  ? moderateScale(260)
                  : moderateScale(140),
              width: '100%',
              borderRadius: moderateScale(16),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <WrapperContainer
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}
    // isLoading={isLoading}
    >
      {isLoading || isHomeDataloding ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            zIndex: 1000,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}
        >
          {/* Vendor Mode Header - At the very top */}
          <VendorModeHeader
            selectedToggle={()=>{}}
            containerStyle={{ marginHorizontal: moderateScale(16) }}
          />
          {!!(
            appData?.profile &&
            (appData?.profile?.logo || appData?.profile?.dark_logo)
            && appData?.profile?.preferences?.vendorMode?.length == 1
          ) ? (
            <FastImage
              style={{
                width: moderateScale(width / 4),
                height: moderateScale(46),
                margin: moderateScale(16),
              }}
              resizeMode={FastImage.resizeMode.stretch}
              source={{
                uri: getImageUrl(
                  isDarkMode
                    ? appData?.profile?.dark_logo?.image_fit
                    : appData?.profile?.logo?.image_fit,
                  isDarkMode
                    ? appData?.profile?.dark_logo?.image_path
                    : appData?.profile?.logo?.image_path,
                  '200/400',
                ),
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
            />
          ) : null}
          <TaxiHomeShimmer />
        </ScrollView>
      ) : (
        <ScrollView
          // bounces={false}
          refreshing={isRefreshing}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          alwaysBounceVertical={true}
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            zIndex: 1000,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          {/* Vendor Mode Header - At the very top */}
          <VendorModeHeader
            selectedToggle={selcetedToggle}
            containerStyle={{ marginHorizontal: moderateScale(16) }} />
          {!!(
            appData?.profile &&
            (appData?.profile?.logo || appData?.profile?.dark_logo)
            && appData?.profile?.preferences?.vendorMode?.length == 1
          ) ? (
            <FastImage
              style={{
                width: moderateScale(width / 4),
                height: moderateScale(46),
                margin: moderateScale(16),
              }}
              resizeMode={FastImage.resizeMode.stretch}
              source={{
                uri: getImageUrl(
                  isDarkMode
                    ? appData?.profile?.dark_logo?.image_fit
                    : appData?.profile?.logo?.image_fit,
                  isDarkMode
                    ? appData?.profile?.dark_logo?.image_path
                    : appData?.profile?.logo?.image_path,
                  '200/400',
                ),
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
            />
          ) : null}

          {/* findCabCategory */}
          <>
            <View
              style={{
                marginHorizontal: moderateScale(10),
                borderRadius: moderateScale(32),
                paddingHorizontal: moderateScaleVertical(16),
                paddingVertical: moderateScaleVertical(10),
                backgroundColor: getColorCodeWithOpactiyNumber(
                  colors.taxiCategoryGrayColor.substr(1),
                  30,
                ),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{ flexBasis: 'auto', flexGrow: width / 2 }}
                onPress={() => goToAddress({ fromMap: false })} //from map is false
              >
                <Text
                  style={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.Medium,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.WHERETO}
                </Text>
              </TouchableOpacity>
              {isHourlyRental ? null : (
                <TouchableOpacity
                  onPress={() => {
                    userData?.auth_token
                      ? updateState({
                        isVisible: true,
                      })
                      : actions.setAppSessionData('on_login');
                  }}
                  style={{
                    flexBasis: 'auto',
                    flexGrow: width / 20,
                    alignItems: 'flex-end',
                  }}>
                  <View
                    style={{
                      backgroundColor: colors.white,

                      minHeight: moderateScaleVertical(26),
                      borderRadius: moderateScale(32),
                      justifyContent: 'space-around',
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: moderateScale(12),
                      paddingVertical: moderateScaleVertical(8),
                    }}>
                    <Image source={imagePath.clock} />
                    <Text style={{ marginHorizontal: moderateScale(5) }}>
                      {strings.LATER}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {allSavedAddress.length > 0 && userData?.auth_token ? (
              <></>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: moderateScaleVertical(12),
                  justifyContent: 'space-between',
                  marginHorizontal: moderateScale(12),
                  marginTop: moderateScaleVertical(10),
                  borderRadius: moderateScale(12),
                  borderWidth: 1,
                  borderColor: colors.borderColor,
                  flex: 1,
                }}
                onPress={() => {
                  userData?.auth_token
                    ? setModalVisible(true, 'addAddress')
                    : actions.setAppSessionData('on_login');
                }}>
                <Image source={imagePath.plushRoundedBackground} />
                <View style={{ marginHorizontal: moderateScale(10), flex: 1 }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.addressTitle,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {strings.ADD_NEW_ADDRESS}
                  </Text>
                </View>
                <Image
                  style={{
                    tintColor: colors.textGreyLight,
                  }}
                  source={imagePath.goRight}
                />
              </TouchableOpacity>
            )}
            {addressView(imagePath.locationRoundedBackground)}
          </>

          {!isEmpty(myCategories[0]?.data) ? (
            <FlatList
              data={myCategories[0]?.data || []}
              numColumns={4}
              style={{
                marginHorizontal: moderateScale(12),
              }}
              ListHeaderComponent={() => (
                <View style={{ marginTop: moderateScaleVertical(12), marginBottom: moderateScaleVertical(20) }} >
                  <Text
                    style={{
                      fontSize: textScale(16),
                      fontFamily: fontFamily.medium,
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                    }}
                  >
                    {strings.SUGGESTIONS}
                  </Text>
                </View>
              )}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: moderateScaleVertical(12),
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) =>
                !!item?.id ? String(item.id) : String(index)
              }
              renderItem={_renderItem}
            />
          ) : null}

          <Carousel
            autoplay={true}
            loop={true}
            autoplayInterval={4000}
            data={ appMainData?.mobile_banners || [...appData?.mobile_banners]}
            renderItem={renderBanners}
            sliderWidth={width}
            itemWidth={width - moderateScale(24)}
          />
          <View>
            <DatePicker
              modal
              open={isVisible}
              date={date}
              locale={
                languages?.primary_language?.sort_code
                  ? languages?.primary_language?.sort_code
                  : 'en'
              }
              mode="datetime"
              textColor={isDarkMode ? colors.black : colors.blackB}
              minimumDate={new Date()}
              style={{
                width: width - 20,
                height: height / 4.4,
              }}
              onConfirm={date => onDateSet(date)}
              onCancel={() => updateState({ isVisible: false })}
            />
          </View>
          <View style={{ height: moderateScaleVertical(95) }} />
        </ScrollView>
      )}
      <AddressModal3
        navigation={navigation}
        updateData={updateData}
        isVisible={isVisible1}
        indicator={indicator}
        onClose={() => setModalVisible(!isVisible1)}
        type={type}
        passLocation={data => addUpdateLocation(data)}
        selectViaMap={selectViaMap}
        openCloseMapAddress={openCloseMapAddress}
        constCurrLoc={location}
      />

      <Modal
        isVisible={fullMapShow}
        style={{
          margin: 0,
        }}
        animationInTiming={600}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <MapView
              ref={mapRef}
              provider={
                Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
              }
              // customMapStyle={mapStyleGrey}
              customMapStyle={
                appIds.cabway == DeviceInfo.getBundleId() ? null : mapStyleGrey
              }
              style={{ ...StyleSheet.absoluteFillObject }}
              region={{
                latitude: !!curLatLong?.latitude
                  ? parseFloat(curLatLong?.latitude)
                  : !!location?.latitude
                    ? parseFloat(location?.latitude)
                    : 30.7333,
                longitude: !!curLatLong?.longitude
                  ? parseFloat(curLatLong?.longitude)
                  : !!location?.longitude
                    ? parseFloat(location?.longitude)
                    : 76.7794,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              // initialRegion={region}
              showsUserLocation={true}
            // onRegionChangeComplete={_onRegionChange}
            // showsMyLocationButton={true}
            // pointerEvents={'none'}
            >
              {allListedDrivers?.map((coordinate, index) => {
                return (
                  <Marker.Animated
                    // tracksViewChanges={agent_location == null}
                    coordinate={{
                      latitude: Number(coordinate?.agentlog?.lat),
                      longitude: Number(coordinate?.agentlog?.long),
                    }}>
                    <Image
                      style={{
                        zIndex: 99,
                        // height:46,
                        // width: 32,
                        transform: [
                          {
                            rotate: `${Number(
                              coordinate?.agentlog?.heading_angle
                                ? coordinate?.agentlog?.heading_angle
                                : 0,
                            )}deg`,
                          },
                        ],
                      }}
                      source={renderDriverTypeMarkes(coordinate)}
                    />
                  </Marker.Animated>
                );
              })}
              {getBundleId() == appIds.pave && (
                <Marker
                  coordinate={{
                    latitude: !!curLatLong?.latitude
                      ? parseFloat(curLatLong?.latitude)
                      : !!location?.latitude
                        ? parseFloat(location?.latitude)
                        : 30.733315,
                    longitude: !!curLatLong?.longitude
                      ? parseFloat(curLatLong?.longitude)
                      : !!location?.longitude
                        ? parseFloat(location?.longitude)
                        : 76.779419,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                />
              )}
            </MapView>
            <SafeAreaView>
              <TouchableOpacity
                onPress={() => updateState({ fullMapShow: false })}
                style={{
                  marginTop: moderateScaleVertical(24),
                  height: moderateScale(40),
                  width: moderateScale(40),
                  borderRadius: moderateScale(16),
                  backgroundColor: colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: moderateScale(24),
                }}>
                <Image
                  style={{
                    tintColor: colors.black,
                  }}
                  source={imagePath.backArrowCourier}
                />
              </TouchableOpacity>
            </SafeAreaView>
          </View>
          <View
            style={{
              height: moderateScale(100),
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
            }}>
            <SafeAreaView>
              <TouchableOpacity
                onPress={() => goToAddress({ fromMap: true })}
                style={{
                  height: moderateScale(48),
                  backgroundColor: isDarkMode
                    ? colors.whiteOpacity15
                    : colors.greyNew,
                  justifyContent: 'center',
                  paddingHorizontal: moderateScale(16),
                  margin: moderateScale(16),
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(16),
                    textAlign: 'left',
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.WHERETO}
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isHourlyRentalModal}
        style={{
          margin: 0,
        }}
        animationInTiming={600}>
        <View style={{ flex: 1, backgroundColor: colors.white }}>
          <WrapperContainer>
            <View
              style={{
                flex: 1,
                padding: moderateScale(16),
              }}>
              <TouchableOpacity
                hitSlop={hitSlopProp}
                onPress={() => setIsHourlyRentalModal(false)}>
                <Image source={imagePath.ic_hourly_taxi_back} />
              </TouchableOpacity>
              <Text
                style={{
                  ...commonStyles.boldFont20,
                  marginTop: moderateScaleVertical(24),
                }}>
                {strings.HOW_MUCH_TIME}
              </Text>
              <View style={styles.hourSelectionContainer}>
                <View
                  style={{
                    ...commonStyles.flexRowSpaceBtwn,
                    paddingHorizontal: moderateScale(16),
                  }}>
                  <TouchableOpacity
                    disabled={rentalHours <= 1}
                    onPress={() =>
                      rentalHours > 1 && setRentalHours(rentalHours - 1)
                    }>
                    <Image source={imagePath.ic_minus_hours} />
                  </TouchableOpacity>
                  <Text style={commonStyles.boldFont24}>
                    {rentalHours} {strings.HOURS}
                  </Text>
                  <TouchableOpacity
                    disabled={rentalHours >= 12}
                    onPress={() =>
                      rentalHours < 12 && setRentalHours(rentalHours + 1)
                    }>
                    <Image source={imagePath.ic_plus_hours} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.kmTxt}>
                  {Number(categoryBaseKM) * rentalHours} km
                </Text>
                <View style={styles.hoursBar}>
                  {new Array(12).fill(0).map((item, index) => (
                    <TouchableOpacity
                      hitSlop={hitSlopProp7}
                      onPress={() => setRentalHours(index + 1)}>
                      <Image
                        source={
                          index + 1 === rentalHours
                            ? imagePath.ic_current_bar
                            : index + 1 < rentalHours
                              ? imagePath.ic_selected_bar
                              : imagePath.ic_unselected_bar
                        }
                        style={{
                          marginLeft: index !== 0 ? moderateScale(8) : 0,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={commonStyles.flexRowCenter}>
                  <ButtonWithLoader
                    onPress={onLeaveNow}
                    btnText={strings.LEAVE_NOW}
                    btnTextStyle={{
                      ...commonStyles.mediumFont12,
                      textTransform: 'none',
                      color: colors.white,
                    }}
                    btnStyle={styles.leaveNowBtn}
                  />
                  <ButtonWithLoader
                    onPress={() => setIsRentalCalendarModal(true)}
                    btnText={
                      !!dateTime
                        ? moment(dateTime).format('YYYY-MM-DD hh:mm A')
                        : strings.LEAVE_LATER
                    }
                    btnTextStyle={{
                      ...commonStyles.mediumFont12,
                      textTransform: 'none',
                    }}
                    btnStyle={{
                      ...styles.leaveNowBtn,
                      ...styles.leaveLaterBtn,
                    }}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: colors.greyColor1,
                padding: moderateScaleVertical(16),
              }}>
              <View style={commonStyles.flexRowSpaceBtwn}>
                <Text style={commonStyles.font15}>{strings.STARTING_AT}</Text>
                <Text style={commonStyles.mediumFont16}>
                  {currencies?.primary_currency?.symbol}
                  {Number(categoryBasePrice) * rentalHours}
                </Text>
              </View>
              <View
                style={{
                  ...commonStyles.flexRowSpaceBtwn,
                  marginTop: moderateScaleVertical(6),
                }}>
                <Text />
                <Text style={commonStyles.font15}>
                  {currencies?.primary_currency?.symbol}
                  {Number(categoryBasePrice)}/hr
                </Text>
              </View>
              <ButtonWithLoader
                onPress={onChooseTrip}
                btnText={strings.CHOOSE_A_TRIP}
                btnTextStyle={{
                  ...commonStyles.mediumFont12,
                  textTransform: 'none',
                  color: colors.white,
                }}
                btnStyle={styles.chooseTripBtn}
              />
            </View>
          </WrapperContainer>
        </View>
        <Modal
          isVisible={isRentalCalendarModal}
          style={{
            margin: 0,
          }}
          animationInTiming={600}>
          <WrapperContainer bgColor={colors.white}>
            <ScrollView
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  ...commonStyles.flexRowCenter,
                  ...styles.calendarModal,
                }}>
                <TouchableOpacity
                  hitSlop={hitSlopProp}
                  onPress={() => setIsRentalCalendarModal(false)}>
                  <Image source={imagePath.ic_hourly_taxi_back} />
                </TouchableOpacity>
                <View
                  style={{
                    ...commonStyles.flexRowSpaceBtwn,
                    ...styles.calendarContainer,
                  }}>
                  <Text
                    style={{
                      ...commonStyles.mediumFont15,
                    }}>
                    Reserved Trip
                  </Text>
                  <View
                    style={{
                      alignItems: 'flex-end',
                    }}>
                    <Text style={commonStyles.boldFont11}>
                      {moment(dateTime || new Date()).format('ddd, DD MMM')}
                    </Text>
                    <Text
                      style={{
                        ...commonStyles.font11,
                        marginTop: moderateScaleVertical(4),
                      }}>
                      {moment(dayTime).format('hh:mm A')}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.calendarView}>
                <Calendar
                  minDate={new Date()}
                  style={{
                    padding: 0,
                  }}
                  onDayPress={onDayPress}
                  markedDates={{
                    [markedDate]: {
                      selected: true,
                      selectedColor: themeColors?.primary_color,
                    },
                  }}
                // hideArrows
                />
                <View
                  style={{
                    ...commonStyles.flexRowCenter,
                    ...styles.timeContainer,
                  }}>
                  <TouchableOpacity
                    onPress={() => setIsTimePicker(true)}
                    style={{
                      ...styles.timBtn,
                      ...commonStyles.alignJustifyCenter,
                      borderRadius: moderateScale(4),
                    }}>
                    <Text
                      style={{
                        ...commonStyles.mediumFont14,
                        color: colors.white,
                      }}>
                      {moment(dayTime).format('hh:mm')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsAm(true)}
                    style={{
                      ...styles.amPmBtn,
                      ...commonStyles.alignJustifyCenter,
                      backgroundColor: isAm
                        ? themeColors?.primary_color
                        : colors.greyH,
                      marginLeft: moderateScale(6),
                      borderTopLeftRadius: moderateScale(4),
                      borderBottomLeftRadius: moderateScale(4),
                      borderWidth: 0,
                    }}>
                    <Text
                      style={{
                        ...commonStyles.font12,
                        color: isAm ? colors.white : colors.black,
                      }}>
                      {strings.AM}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsAm(false)}
                    style={{
                      ...commonStyles.alignJustifyCenter,
                      ...styles.amPmBtn,
                      backgroundColor: !isAm
                        ? themeColors?.primary_color
                        : colors.greyH,
                      borderTopRightRadius: moderateScale(4),
                      borderBottomRightRadius: moderateScale(4),
                    }}>
                    <Text
                      style={{
                        ...commonStyles.font12,
                        color: !isAm ? colors.white : colors.black,
                      }}>
                      {strings.PM}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  ...commonStyles.flexRowCenter,
                  marginHorizontal: moderateScaleVertical(16),
                  marginTop: moderateScaleVertical(20),
                }}>
                <Image source={imagePath.ic_hourly_calendar} />
                <View
                  style={{
                    marginLeft: moderateScale(10),
                  }}>
                  <Text
                    style={{
                      ...commonStyles.font14,
                      color: colors.greyI,
                    }}>
                    {strings.CHOOSE_YOUR_EXACT_PICKUP}
                  </Text>
                  <HorizontalLine
                    lineStyle={{
                      marginTop: moderateScaleVertical(16),
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  ...commonStyles.flexRowCenter,
                  marginHorizontal: moderateScaleVertical(16),
                  marginTop: moderateScaleVertical(16),
                }}>
                <Image source={imagePath.ic_hourglass} />
                <View
                  style={{
                    marginLeft: moderateScale(10),
                  }}>
                  <Text
                    style={{
                      ...commonStyles.font14,
                      color: colors.greyI,
                    }}>
                    {strings.EXTRA_WAIT_TIME}
                  </Text>
                  <HorizontalLine
                    lineStyle={{
                      marginTop: moderateScaleVertical(16),
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  ...commonStyles.flexRowCenter,
                  marginHorizontal: moderateScaleVertical(16),
                  marginTop: moderateScaleVertical(16),
                }}>
                <Image source={imagePath.ic_credit_card} />
                <View
                  style={{
                    marginLeft: moderateScale(10),
                  }}>
                  <Text
                    style={{
                      ...commonStyles.font14,
                      color: colors.greyI,
                    }}>
                    {strings.CANCEL_AT_NO_CHARGE}
                  </Text>
                </View>
                <HorizontalLine
                  lineStyle={{
                    marginTop: moderateScaleVertical(12),
                  }}
                />
              </View>
            </ScrollView>

            <ButtonWithLoader
              onPress={onSetupPickupTime}
              btnText={strings.SET_PICKUP_TIME}
              btnTextStyle={{
                fontSize: textScale(12),
                textTransform: 'none',
                fontFamily: fontFamily?.medium,
              }}
              btnStyle={{
                ...styles.chooseTripBtn,
                marginHorizontal: moderateScale(16),
                marginBottom: moderateScaleVertical(16),
              }}
            />
          </WrapperContainer>
        </Modal>
      </Modal>
      <DatePicker
        modal={true}
        open={isTimePicker}
        date={new Date()}
        textColor={isDarkMode ? colors.white : colors.blackB}
        theme={isDarkMode ? 'dark' : 'light'}
        mode="time"
        onCancel={() => setIsTimePicker(false)}
        onConfirm={onConfirmDayTime}
      />
    </WrapperContainer>
  );
}
