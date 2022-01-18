import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  Animated,
  TextInput,
  Keyboard,
} from 'react-native';
import {useSelector} from 'react-redux';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';

import DeviceInfo from 'react-native-device-info';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import stylesFunc from './styles';
const {height, width} = Dimensions.get('window');
import MapViewDirections from 'react-native-maps-directions';
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {useIsFocused} from '@react-navigation/native';

import Communications from 'react-native-communications';
import navigationStrings from '../../../navigation/navigationStrings';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import TaxiOrderDetailView from './TaxiOrderDetailView';
import SearchingForDriverView from './SearchingForDriverView';
import useInterval from '../../../utils/useInterval';
import {cloneDeep} from 'lodash';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import StarRating from 'react-native-star-rating';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';
import RoundImg from '../../../Components/RoundImg';
import LeftRightText from '../../../Components/LeftRightText';
import SearchDriver from '../ChooseCarTypeAndTime/SearchDriver';
import moment from 'moment';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import {FlatList} from 'react-native';
import CustomCallouts from '../../../Components/CustomCallouts';
import {appIds} from '../../../utils/constants/DynamicAppKeys';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function PickupTaxiOrderDetail({navigation, route}) {
  const {themeColor, themeToggle} = useSelector(
    (state) => state?.initBoot?.themeColor,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const paramData = route?.params;
  console.log(paramData, 'paramData');
  const [state, setState] = useState({
    isLoading: true,
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    coordinate: {},
    tasks: [],
    agent_location: null,
    agent_image: null,
    orderDetail: null,
    showOrderDetailView: false,
    driverStatus: null,
    productInfo: [],
    isShowRating: false,
    getDispatchId: null,
    isVisible: false,
    driverRating: 0,
    orderStatus: '',
    labels: [
      'Accepted',
      'Arrival',
      strings.OUT_FOR_DELIVERY,
      strings.DELIVERED,
    ],
    orderFullDetail: null,
    showModal: false,
    hideShowBack: 0,
    selectedImg: '',
    baseUrl: '',
    isCancleModal: false,
    reason: '',
    isBtnLoader: false,
  });
  const {
    isLoading,
    region,
    coordinate,
    orderDetail,
    tasks,
    agent_location,
    agent_image,
    showOrderDetailView,
    driverStatus,
    order_vendor_product_id,
    order_id,
    orderRootId,
    productId,
    productInfo,
    isShowRating,
    getDispatchId,
    isVisible,
    driverRating,
    labels,
    orderStatus,
    orderFullDetail,
    showModal,
    hideShowBack,
    selectedImg,
    baseUrl,
    isCancleModal,
    reason,
    isBtnLoader,
  } = state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state.initBoot,
  );

  const isFocused = useIsFocused();
  const bottomSheetRef = useRef(null);

  const {profile} = appData;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, isDarkMode, MyDarkTheme});
  const mapRef = useRef();

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  // const urlValue = paramData?.orderDetail?.dispatch_traking_url
  //   ? (paramData?.orderDetail?.dispatch_traking_url).replace(
  //       '/order/',
  //       '/order-details/',
  //     )
  //   : null;

  const urlValue = `/pickup-delivery/order-tracking-details`;

  console.log(paramData, 'selectedCarOptionselectedCarOption');

  useFocusEffect(
    React.useCallback(() => {
      //   updateState({isLoading: true});
      if (!!userData?.auth_token) {
        // let url = paramData?.orderDetail?.dispatch_traking_url
        //   ? (paramData?.orderDetail?.dispatch_traking_url).replace(
        //       '/order/',
        //       '/order-details/',
        //     )
        //   : null;
        let url = `/pickup-delivery/order-tracking-details`;

        if (url) {
          _getOrderDetailScreen(url);
        } else {
          updateState({isLoading: false});
        }
      } else {
        showError(strings.UNAUTHORIZED_MESSAGE);
      }
    }, [currencies, languages, paramData]),
  );

  useEffect(() => {
    if (urlValue) {
      _updateDriverLocationLocation(urlValue);
    } else {
      updateState({isLoading: false});
    }
  }, []);

  useInterval(
    () => {
      if (urlValue) {
        _updateDriverLocationLocation(urlValue);
      } else {
        updateState({isLoading: false});
      }
    },
    isFocused && orderStatus != 'completed' ? 3000 : null,
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    console.log('driverStatus', driverStatus);
    if (
      driverStatus != '' &&
      driverStatus != null &&
      driverStatus != undefined
    ) {
      console.log(driverStatus, 'driverStatus');
      if (orderStatus === 'completed') {
        showSuccess(driverStatus);
        updateState({
          isShowRating: true,
          isVisible: true,
        });
      }
      // showSuccess(driverStatus);
    }
  }, [driverStatus]);

  const new_dispatch_traking_url = paramData?.orderDetail?.dispatch_traking_url
    ? (paramData?.orderDetail?.dispatch_traking_url).replace(
        '/order/',
        '/order-details/',
      )
    : null;
  console.log(new_dispatch_traking_url, 'new_dispatch_traking_url');
  /*********Update driver detail screen********* */
  const _updateDriverLocationLocation = (url) => {
    actions
      .getOrderDetailPickUp(
        {
          order_id: paramData?.orderId,
          new_dispatch_traking_url: new_dispatch_traking_url,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        // console.log(res?.data?.order_details?.dispatcher_status, 'res---agent');
        console.log('agent location1', res?.data);
        updateState({
          agent_location: res?.data?.agent_location,
          orderDetail: res?.data?.order,
          agent_image: res?.data?.agent_image,
          driverStatus: res?.data?.order_details?.dispatcher_status,
          productInfo: res?.data?.order_details?.products,
          getDispatchId: res?.data?.order?.id,
          driverRating: res?.data?.avgrating,
          orderStatus: res?.data?.order?.status,
          orderFullDetail: res.data,
          baseUrl: res?.data?.base_url,
          isLoading: false,
        });
      })
      .catch(errorMethod);
  };

  /*********Get order detail screen********* */
  const _getOrderDetailScreen = (url) => {
    actions
      .getOrderDetailPickUp(
        {
          order_id: paramData?.orderId,
          new_dispatch_traking_url: new_dispatch_traking_url,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'agent location2');

        // if (JSON.stringify(tasks) !== JSON.stringify(res?.data?.tasks)) {
        updateState({
          tasks: res?.data?.tasks,
        });
        // }

        updateState({
          isLoading: false,
          orderFullDetail: res?.data,
          baseUrl: res?.data?.base_url,
          region: {
            latitude: res?.data?.tasks[0]?.latitude
              ? Number(res?.data?.tasks[0].latitude)
              : 30.7191,
            longitude: res?.data?.tasks[0]?.longitude
              ? Number(res?.data?.tasks[0].longitude)
              : 76.8107,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          coordinate: {
            latitude: res?.data?.tasks[0]?.latitude
              ? Number(res?.data?.tasks[0].latitude)
              : 30.7191,
            longitude: res?.data?.tasks[0]?.longitude
              ? Number(res?.data?.tasks[0].longitude)
              : 76.8107,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          showOrderDetailView: true,
          agent_location: res?.data?.agent_location,
          orderDetail: res?.data?.order,
          agent_image: res?.data?.agent_image,
          driverStatus: res?.data?.order_details?.dispatcher_status,
          isShowRating: res?.data?.order?.status == 'completed' ? true : false,
          productInfo: res?.data?.order_details?.products,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoading: false,
      isLoadingC: false,
      isCancleModal: false,
      isBtnLoader: false,
    });
    showError(error?.message || error?.error);
  };
  const _onRegionChange = (region) => {
    updateState({region: region});
    // _getAddressBasedOnCoordinates(region);
    // animate(region);
  };

  //   on press call
  const _onPressCall = (orderDetail) => {
    // alert("123")
    Communications.phonecall(orderDetail?.phone_number, true);
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
    console.log(productDetail, 'productDetail');
    actions
      .giveRating(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'resresresresres');
        let cloned_productInfo = cloneDeep(productInfo);
        console.log(cloned_productInfo, 'cloned_productInfo');
        updateState({
          isLoading: false,
          productInfo: cloned_productInfo.map((itm, inx) => {
            if (itm?.product_id == productDetail?.product_id) {
              itm.product_rating = res.data;
              return itm;
            } else {
              return itm;
            }
          }),
        });
      })
      .catch(errorMethod);
  };

  // on press chat
  const _onPressChat = (orderDetail) => {
    Communications.text(orderDetail?.phone_number);
  };

  const onStarRatingPress = (productData, rating) => {
    let productListarray = cloneDeep(productInfo);

    // console.log(getDispatchId, 'productData,rating');
    console.log(productData, rating, 'productDataproductDataproductData');
    // updateState({isLoading: true});
    _giveRatingToProduct(productData, rating);

    // navigation.navigate(navigationStrings.RATEORDER, {
    //   item: {
    //     product_rating: {
    //       id: productData?.id,
    //       order_vendor_product_id: productData?.order_vendor_id,
    //       product_id: productData?.product_id,
    //       order_id: productData?.order_id,
    //       dispatchId: getDispatchId,
    //     },
    //   },
    // });
  };

  const _modalClose = () => {
    updateState({
      isVisible: false,
    });
  };
  const rateYourOrder = (item) => {
    updateState({
      isVisible: false,
    });
    navigation.navigate(navigationStrings.RATEORDER, {item});
  };

  const viewDriverStatus = () => {
    switch (orderFullDetail?.order.status) {
      case 'completed':
        return strings.COMPLETE;
        break;
      case 'assigned':
        return strings.ASSIGNED;
        break;
      case 'unassigned':
        return strings.UNASSIGNED;
        break;
      case 'arrived':
        return strings.ARRIVED;
        break;
      default:
        break;
    }
  };

  const _ModalMainView = () => {
    console.log('checking isShowRating', !!isShowRating);
    return (
      <View
        style={{
          height: height / 5,
          backgroundColor: colors.white,
          alignItems: 'center',
          borderRadius: moderateScale(10),
        }}>
        <TouchableOpacity
          onPress={_modalClose}
          style={{position: 'absolute', right: 0, top: 0}}>
          <Image source={imagePath.cross} />
        </TouchableOpacity>
        {!!isShowRating && (
          <ScrollView horizontal>
            {productInfo?.map((item, index) => {
              return (
                <View
                  style={{
                    justifyContent: 'center',
                  }}>
                  <Image
                    style={{
                      resizeMode: 'contain',
                      height: moderateScale(60),
                      width: moderateScale(60),
                      alignSelf: 'center',
                    }}
                    source={{
                      uri: getImageUrl(
                        item.image.proxy_url,
                        item.image.image_path,
                        '150/150',
                      ),
                      priority: FastImage.priority.high,
                    }}
                  />
                  <View style={{marginTop: moderateScaleVertical(10)}}>
                    <StarRating
                      disabled={false}
                      maxStars={5}
                      rating={item?.product_rating?.rating}
                      selectedStar={(rating) => onStarRatingPress(item, rating)}
                      fullStarColor={colors.ORANGE}
                      starSize={30}
                    />
                  </View>
                  {!!item?.product_rating && (
                    <TouchableOpacity
                      hitSlop={{top: 100, bottom: 100, left: 125, right: 125}}
                      onPress={() => rateYourOrder(item)}>
                      <Text
                        style={{
                          marginVertical: moderateScaleVertical(20),
                          textAlign: 'center',
                          fontSize: moderateScale(14),
                          fontFamily: fontFamily.medium,
                        }}>
                        {strings.WRITE_A_REVIEW}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  };

  //order detail View
  const _selectOrderDetailView = () => {
    return (
      <TaxiOrderDetailView
        orderDetail={orderDetail}
        isLoading={isLoading}
        agent_image={agent_image}
        agent_location={agent_location}
        productDetail={paramData?.orderDetail}
        onPressCall={(orderDetail) => _onPressCall(orderDetail)}
        onPressChat={(orderDetail) => _onPressChat(orderDetail)}
      />
    );
  };

  const _selectTexiOrderDetailView = () => {
    return (
      <SearchingForDriverView
        orderDetail={orderDetail}
        isLoading={isLoading}
        agent_image={agent_image}
        agent_location={agent_location}
        productDetail={paramData?.orderDetail}
        onPressCall={(orderDetail) => _onPressCall(orderDetail)}
        onPressChat={(orderDetail) => _onPressChat(orderDetail)}
        totalDuration={paramData?.totalDuration}
        selectedCarOption={paramData?.selectedCarOption}
        productRatings={productInfo}
        isShowRating={isShowRating}
        navigation={navigation}
        onStarRatingPress={onStarRatingPress}
        driverRating={driverRating}
      />
    );
  };

  const offset = useRef(new Animated.Value(0)).current;

  const bottomSheetHeader = () => {
    if (!!orderFullDetail) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: moderateScale(42),
            justifyContent: 'space-between',
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                opacity: 0,
              }}
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
              marginRight: moderateScale(34),
            }}
          />
          <Text />
        </View>
      );
    } else {
      return <View />;
    }
  };

  const onCenter = () => {
    let cords = orderFullDetail.tasks.map((val) => {
      return {
        latitude: Number(val?.latitude),
        longitude: Number(val?.longitude),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    }, []);

    // if (!!!agent_location?.lat) {
    //   let x =
    //   {
    //     latitude: Number(agent_location?.lat),
    //     longitude: Number(agent_location?.long),
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA,
    //   }

    //   cords.push(x)
    // }

    mapRef.current.fitToCoordinates(cords, {
      edgePadding: {
        right: moderateScale(20),
        bottom: moderateScale(40),
        left: moderateScale(20),
        top: moderateScale(40),
      },
    });
  };

  const renderDotContainer = (i) => {
    return (
      <View style={{alignItems: 'center'}}>
        {i == 0 ? (
          <View
            style={{
              height: moderateScale(8),
              width: moderateScale(8),
              borderRadius: moderateScale(8 / 2),
              backgroundColor: themeColors.primary_color,
            }}
          />
        ) : (
          <Image
            style={{
              tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              // height: moderateScale(5),
              // width: moderateScale(5),
              // borderRadius: orderFullDetail.tasks.length - 1 == i ? 0 : moderateScale(5 / 2),
            }}
            source={imagePath.location2}
          />
        )}
      </View>
    );
  };

  const hideModal = () => {
    updateState({isCancleModal: false});
  };

  const onCancelOrder = () => {
    if (reason == '') {
      alert(
        `${
          strings.PLEASE_ENTER
        }${strings.CANCELLATION_REASON.toLocaleLowerCase()}`,
      );
      return;
    }

    updateState({isBtnLoader: true});

    const apiData = {
      order_id: paramData?.orderId,
      vendor_id: paramData?.selectedVendor?.id,
      reject_reason: reason,
    };
    console.log('sendingapi data', apiData);
    actions
      .cancelOrder(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((response) => {
        console.log(response, 'responseFromServer');
        updateState({
          isBtnLoader: false,
          isCancleModal: false,
        });
        showSuccess(response?.message);
        navigation.goBack();
      })
      .catch(errorMethod);
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <View
        style={{flex: 1, marginVertical: moderateScale(16), marginBottom: 0}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: moderateScaleVertical(16),
            marginHorizontal: moderateScale(16),
          }}>
          <TouchableOpacity
            onPress={
              paramData?.fromCab
                ? () => navigation.navigate(navigationStrings.TAXIHOMESCREEN)
                : paramData?.pickup_taxi
                ? () => navigation.navigate(navigationStrings.HOME)
                : () => navigation.goBack()
            }
            activeOpacity={0.8}>
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
              source={imagePath.backArrowCourier}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: moderateScale(16),
              fontFamily: fontFamily.medium,
              textAlign: 'left',
              marginLeft: moderateScale(8),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {orderStatus == 'unassigned'
              ? strings.YOUR_RIDE_WILL_START_SOON
              : strings.INVOICE}
          </Text>
        </View>
        {console.log('check kro', tasks)}
        <View style={{flex: 1}}>
          {!isLoading && !!tasks?.length > 0 && (
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={{height: height / 1.8, width: '100%'}}
              initialRegion={region}
              ref={mapRef}
              // cacheEnabled={true}
              customMapStyle={
                appIds.cabway == DeviceInfo.getBundleId() ? null : mapStyleGrey
              }>
              {!!tasks && tasks.length > 0 && <CustomCallouts data={tasks} />}

              {/* driver location */}
              {console.log(
                'checking agent location coordinates >>> ',
                agent_location?.lat,
                '    ',
                agent_location?.long,
              )}
              {!!agent_location &&
                !!agent_location?.lat &&
                orderStatus != 'completed' && (
                  <Marker.Animated
                    // tracksViewChanges={agent_location == null}
                    coordinate={{
                      latitude: Number(agent_location?.lat),
                      longitude: Number(
                        agent_location?.long || agent_location?.lng,
                      ),
                    }}>
                    <Image
                      style={{
                        zIndex: 99,
                        height: 35,
                        width: 35,
                        transform: [
                          {
                            rotate: `${
                              Number(agent_location?.heading_angle) + 110
                            }deg`,
                          },
                        ],
                      }}
                      source={imagePath.icScooter}
                    />
                  </Marker.Animated>
                )}

              {/* Directions and paths */}
              {console.log(
                'JJJJJ____',
                orderFullDetail?.order_details.dispatcher_status_type,
              )}
              <MapViewDirections
                resetOnChange={false}
                origin={
                  orderStatus !== 'completed' && orderStatus !== 'unassigned'
                    ? {
                        latitude: Number(agent_location?.lat),
                        longitude: Number(
                          agent_location?.long || agent_location?.lng,
                        ),
                      }
                    : tasks[0]
                }
                waypoints={tasks.length > 2 ? tasks.slice(1, -1) : []}
                destination={
                  orderFullDetail?.order_details.dispatcher_status_type == 1
                    ? tasks[0]
                    : tasks[tasks.length - 1]
                }
                // destination={tasks[tasks.length - 1]}
                apikey={profile?.preferences?.map_key}
                strokeWidth={4}
                strokeColor={colors.black}
                optimizeWaypoints={true}
                onStart={(params) => {}}
                precision={'high'}
                timePrecision={'now'}
                mode={'DRIVING'}
                // maxZoomLevel={20}
                onReady={(result) => {
                  updateState({
                    totalDistance: result.distance.toFixed(2),
                    totalDuration: result.duration.toFixed(2),
                  });
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: moderateScale(20),
                      bottom: moderateScale(40),
                      left: moderateScale(20),
                      top: moderateScale(40),
                    },
                  });
                }}
                onError={(errorMessage) => {
                  //
                }}
              />
            </MapView>
          )}
          {/* {!!orderFullDetail && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                // top: height / 3,
                right: 10,
                top: 10,
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
          )} */}
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[height / 3.4, height]}
          animateOnMount={true}
          // onChange={(inx) => updateState({ hideShowBack: inx })}
          onChange={() => playHapticEffect(hapticEffects.impactMedium)}
          handleComponent={bottomSheetHeader}>
          <BottomSheetScrollView
            style={{
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
            }}
            showsVerticalScrollIndicator={false}>
            {!!orderFullDetail && (
              <View style={{marginBottom: moderateScaleVertical(16)}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: moderateScale(16),
                  }}>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.orderLableStyle,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : styles.orderLableStyle
                    }>
                    {`${strings.ORDER_ID}: #${paramData?.orderDetail?.order_number}`}
                  </Text>
                  {orderStatus !== 'completed' ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => updateState({isCancleModal: true})}>
                      <Text
                        style={{
                          textAlign: 'right',
                          color: colors.redB,
                        }}>
                        {strings.CANCEL_ORDER}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: moderateScaleVertical(16),
                    marginBottom: moderateScaleVertical(8),
                    marginHorizontal: moderateScale(16),
                  }}>
                  <View style={{flex: 0.7}}>
                    <Text style={styles.datePriceText}>
                      {moment(
                        new Date(orderFullDetail?.order_details?.created_at),
                      )
                        .locale(
                          languages?.primary_language?.sort_code
                            ? languages?.primary_language?.sort_code
                            : 'en',
                        )
                        .format('MMMM Do YYYY, h:mm a')}
                    </Text>
                    <Text
                      style={{
                        ...styles.statusText,
                        marginTop: moderateScaleVertical(4),
                        textTransform: 'uppercase',
                      }}>
                      #{orderFullDetail.order.unique_id}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.3,
                      alignItems: 'flex-end',
                    }}>
                    <Text style={styles.statusText}>
                      {' '}
                      {currencies?.primary_currency?.symbol}{' '}
                      {orderFullDetail.order_details?.payable_amount}
                    </Text>
                    <Text
                      style={{
                        ...styles.statusText,
                        color: themeColors.primary_color,
                        marginTop: moderateScaleVertical(4),
                        textTransform: 'capitalize',
                      }}>
                      {' '}
                      {viewDriverStatus()}
                    </Text>
                  </View>
                </View>
                {console.log(orderFullDetail, 'orderFullDetail')}
                {!!orderFullDetail?.order.task_description && (
                  <View style={{marginHorizontal: moderateScale(16)}}>
                    <Text style={styles.datePriceText}>
                      {strings.DRIVER_DETAILS}:
                    </Text>
                    <Text
                      style={{
                        ...styles.statusText,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity66,
                        lineHeight: moderateScale(20),
                      }}>
                      {orderFullDetail?.order.task_description}{' '}
                    </Text>
                  </View>
                )}
                <View style={styles.horizontalLine} />

                {orderStatus == 'unassigned' && <SearchDriver />}

                {orderFullDetail?.tasks.map((val, i) => {
                  return (
                    <View style={{marginHorizontal: moderateScale(16)}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View style={{marginRight: moderateScaleVertical(8)}}>
                          {renderDotContainer(i)}
                        </View>
                        <View style={{flex: 1}}>
                          <Text
                            style={{
                              ...styles.statusText,
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.blackOpacity66,
                            }}>
                            {val?.address || ''}
                          </Text>
                        </View>
                      </View>
                      {orderFullDetail.tasks.length - 1 !== i && (
                        <View
                          style={{
                            borderBottomWidth: 0.8,
                            borderBottomColor: isDarkMode
                              ? colors.whiteOpacity22
                              : colors.lightGreyBg,
                            marginVertical: moderateScaleVertical(8),
                            marginHorizontal: 16,
                          }}
                        />
                      )}
                    </View>
                  );
                })}

                {!!orderFullDetail?.agent_location ? (
                  <View
                    style={{
                      backgroundColor: isDarkMode
                        ? colors.whiteOpacity22
                        : colors.greyNew,
                      marginVertical: moderateScaleVertical(24),
                      padding: moderateScale(12),
                      borderRadius: moderateScale(8),
                      marginHorizontal: moderateScale(16),
                    }}>
                    <Text style={styles.deliveryProof}>
                      {strings.DRIVER_DETAILS}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <RoundImg
                          img={orderFullDetail?.agent_image}
                          size={34}
                        />
                        <View style={{flexDirection: 'column'}}>
                          <Text
                            style={{
                              ...styles.statusText,
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                              marginLeft: moderateScale(10),
                            }}>
                            {orderFullDetail?.order?.name || ''}
                          </Text>
                          <Text
                            style={{
                              ...styles.statusText,
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                              marginLeft: moderateScale(10),
                            }}>
                            {`Driver Id: `}
                            {Array(
                              Math.max(
                                4 -
                                  String(orderFullDetail?.order?.driver_id)
                                    .length +
                                  1,
                                0,
                              ),
                            ).join(0) + orderFullDetail?.order?.driver_id}
                          </Text>
                        </View>
                      </View>

                      {!!orderFullDetail?.avgrating &&
                        Number(orderFullDetail?.avgrating) !== 0 && (
                          <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={orderFullDetail?.avgrating}
                            selectedStar={(rating) =>
                              onStarRatingPress(item, rating)
                            }
                            fullStarColor={'#DD812E'}
                            starSize={15}
                          />
                        )}
                    </View>

                    {!!orderFullDetail?.tasks[0]?.proof_image && (
                      <View>
                        <View style={styles.horizontalLine} />
                        <Text style={styles.deliveryProof}>
                          {strings.DELIVERYPROOF}
                        </Text>
                        <FlatList
                          ItemSeparatorComponent={() => (
                            <View style={{marginLeft: 8}} />
                          )}
                          horizontal
                          data={orderFullDetail?.tasks.filter((val) => {
                            if (!!val?.proof_image) {
                              return val;
                            }
                          })}
                          renderItem={({item}) => {
                            return (
                              <View>
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={() =>
                                    updateState({
                                      showModal: true,
                                      selectedImg: item?.proof_image,
                                    })
                                  }>
                                  <Image
                                    source={{
                                      uri: `${baseUrl}/${item?.proof_image}`,
                                    }}
                                    style={{
                                      height: moderateScale(40),
                                      width: moderateScale(40),
                                      borderRadius: moderateScale(4),
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          }}
                        />
                      </View>
                    )}
                    <View style={styles.horizontalLine} />
                    <Text style={styles.deliveryProof}>
                      {strings.ORDER_DETAIL}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      {console.log('>>>>>>>>', orderFullDetail)}
                      {orderFullDetail.order_details.products.map((val) => {
                        return (
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <FastImage
                                  source={{
                                    uri: getImageUrl(
                                      val?.image.image_fit,
                                      val?.image.image_path,
                                      '100/100',
                                    ),
                                    priority: FastImage.priority.high,
                                  }}
                                  style={{
                                    height: moderateScale(40),
                                    width: moderateScale(40),
                                    borderRadius: moderateScale(4),
                                  }}
                                />

                                <Text
                                  style={{
                                    ...styles.statusText,
                                    color: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : colors.black,
                                    marginLeft: moderateScale(10),
                                    width: moderateScale(200),
                                    // backgroundColor: 'red',
                                  }}>
                                  {val?.product_name || ''}
                                </Text>
                              </View>
                              {!!orderFullDetail?.avgrating &&
                                Number(orderFullDetail?.avgrating) !== 0 && (
                                  <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    rating={orderFullDetail?.avgrating}
                                    selectedStar={(rating) =>
                                      onStarRatingPress(item, rating)
                                    }
                                    fullStarColor={'#DD812E'}
                                    starSize={15}
                                  />
                                )}

                              {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={imagePath.startwo} />
                        <TouchableOpacity>
                          <Text style={{
                            fontSize: textScale(10),
                            fontFamily: fontFamily.medium,
                            marginLeft: moderateScale(4)
                          }}>Add Rating</Text>
                        </TouchableOpacity>
                      </View> */}
                            </View>
                            <View
                              style={{
                                // flexDirection: 'row',
                                // alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: moderateScaleVertical(8),
                              }}>
                              {orderFullDetail.order_details.products.length >
                                0 && (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginBottom: moderateScaleVertical(5),
                                  }}>
                                  <Text
                                    style={{
                                      ...styles.statusText,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.black,
                                      // marginLeft: moderateScale(10),
                                    }}>
                                    {'No. of items:'}
                                  </Text>
                                  <Text
                                    style={{
                                      ...styles.statusText,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.black,
                                      marginLeft: moderateScale(10),
                                    }}>
                                    {
                                      orderFullDetail.order_details.products
                                        .length
                                    }
                                  </Text>
                                </View>
                              )}
                              {val.user_product_order_form &&
                                JSON.parse(val.user_product_order_form).length >
                                  0 &&
                                JSON.parse(val.user_product_order_form).map(
                                  (el) => {
                                    return (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                        }}>
                                        {!!el?.question ? (
                                          <Text
                                            style={{
                                              ...styles.statusText,
                                              color: isDarkMode
                                                ? MyDarkTheme.colors.text
                                                : colors.black,
                                              // marginLeft: moderateScale(10),
                                            }}>
                                            {el?.question}:
                                          </Text>
                                        ) : null}
                                        {!!el?.answer ? (
                                          <Text
                                            style={{
                                              ...styles.statusText,
                                              color: isDarkMode
                                                ? MyDarkTheme.colors.text
                                                : colors.black,
                                              marginLeft: moderateScale(10),
                                            }}>
                                            {el?.answer || 'NA'}
                                          </Text>
                                        ) : null}
                                      </View>
                                    );
                                  },
                                )}
                            </View>
                          </View>
                        );
                      })}
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: moderateScaleVertical(10),
                        }}>
                        <Text
                          style={{
                            ...styles.statusText,
                            color: isDarkMode
                              ? MyDarkTheme.colors.text
                              : colors.black,
                            // marginLeft: moderateScale(10),
                          }}>
                          {`${orderDetail?.color || ''}`}
                        </Text>
                        <Text
                          style={{
                            ...styles.statusText,
                            color: isDarkMode
                              ? MyDarkTheme.colors.text
                              : colors.black,
                            marginLeft: moderateScale(10),
                          }}>
                          {orderDetail?.plate_number}
                        </Text>
                      </View>
                    </View>
                    {/* <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      {console.log(JSON.parse(val.user_product_order_form))}
                    </View> */}
                  </View>
                ) : (
                  <View style={{marginBottom: moderateScaleVertical(24)}} />
                )}

                <View style={{marginHorizontal: moderateScale(16)}}>
                  {!!orderFullDetail?.order_details?.delivery_fee &&
                    orderFullDetail?.order_details?.delivery_fee !== '0.00' && (
                      <View>
                        <LeftRightText
                          leftText={strings.DELIVERYFEE}
                          rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.delivery_fee}`}
                          isDarkMode={isDarkMode}
                          MyDarkTheme={MyDarkTheme}
                          marginBottom={0}
                        />
                        <View style={styles.horizontalLine} />
                      </View>
                    )}

                  {!!orderFullDetail?.order_details?.discount_amount &&
                    orderFullDetail?.order_details?.discount_amount !==
                      '0.00' && (
                      <View>
                        <LeftRightText
                          leftText={strings.DISCOUNT}
                          rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.discount_amount}`}
                          leftTextStyle={{color: themeColors.primary_color}}
                          rightTextStyle={{color: themeColors.primary_color}}
                          isDarkMode={isDarkMode}
                          MyDarkTheme={MyDarkTheme}
                          marginBottom={0}
                        />
                        <View style={styles.horizontalLine} />
                      </View>
                    )}
                  {!!orderFullDetail?.order_details?.taxable_amount &&
                    orderFullDetail?.order_details?.taxable_amount !==
                      '0.00' && (
                      <View>
                        <LeftRightText
                          leftText={strings.TAX_AMOUNT}
                          rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.taxable_amount}`}
                          isDarkMode={isDarkMode}
                          isDarkMode={isDarkMode}
                          MyDarkTheme={MyDarkTheme}
                          marginBottom={0}
                        />
                        <View style={styles.horizontalLine} />
                      </View>
                    )}
                  {!!orderFullDetail?.order_details?.subtotal_amount &&
                    orderFullDetail?.order_details?.subtotal_amount !==
                      '0.00' && (
                      <View>
                        <LeftRightText
                          leftText={strings.SUBTOTAL}
                          rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.subtotal_amount}`}
                          isDarkMode={isDarkMode}
                          MyDarkTheme={MyDarkTheme}
                          marginBottom={0}
                        />
                        <View style={styles.horizontalLine} />
                      </View>
                    )}

                  {!!orderFullDetail?.order_details?.payable_amount &&
                    orderFullDetail?.order_details?.payable_amount !==
                      '0.00' && (
                      <View>
                        <LeftRightText
                          leftText={strings.TOTAL}
                          rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.payable_amount}`}
                          isDarkMode={isDarkMode}
                          MyDarkTheme={MyDarkTheme}
                          marginBottom={0}
                        />
                      </View>
                    )}
                </View>
              </View>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
      {/* <BottomViewModal
        show={true}
        mainContainView={_ModalMainView}
        closeModal={_modalClose}
      /> */}
      {console.log('isVisibleisVisibleisVisible', isVisible)}
      <Modal
        isVisible={isVisible}
        onBackdropPress={_modalClose}
        animationIn="zoomIn"
        animationOut="zoomOut">
        {_ModalMainView()}
      </Modal>
      <Modal
        isVisible={showModal}
        onBackdropPress={() => updateState({showModal: false})}
        animationIn="zoomIn"
        animationOut="zoomOut">
        <View
          style={{
            backgroundColor: isDarkMode ? colors.whiteOpacity50 : colors.white,
            borderRadius: moderateScale(8),
            overflow: 'hidden',
            // paddingVertical: moderateScale(12)
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: moderateScale(6),
            }}>
            <Text />
            <Text
              style={{
                fontSize: textScale(16),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                alignSelf: 'center',
                fontFamily: fontFamily.medium,
              }}>
              {strings.PROOF}
            </Text>
            <TouchableOpacity onPress={() => updateState({showModal: false})}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <Image
            source={{uri: `${baseUrl}/${selectedImg}`}}
            style={{
              width: '100%',
              height: height / 3,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.blackOpacity10,
              // borderRadius: 8,
            }}
          />
        </View>
      </Modal>
      <Modal
        isVisible={isCancleModal}
        onBackdropPress={hideModal}
        // animationIn="zoomIn"
        // animationOut="zoomOut"
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
            borderRadius: moderateScale(8),
            overflow: 'hidden',
            paddingHorizontal: moderateScale(16),
            paddingVertical: moderateScale(12),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text />
            <Text
              style={{
                fontSize: textScale(16),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                alignSelf: 'center',
                fontFamily: fontFamily.medium,
              }}>
              {strings.CANCELLATION_REASON}
            </Text>
            <TouchableOpacity onPress={hideModal}>
              <Image
                style={isDarkMode && {tintColor: colors.white}}
                source={imagePath.closeButton}
              />
            </TouchableOpacity>
          </View>

          {/* {!!reasonError && (
            <Text
              style={{
                fontSize: textScale(12),
                color: colors.redB,
                fontFamily: fontFamily.medium,
                marginTop: moderateScaleVertical(8),
              }}>
              {strings.REQUIRED}*{' '}
            </Text>
          )} */}

          <View
            style={{
              // marginVertical: moderateScaleVertical(16),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyNew,
              height: moderateScale(82),
              borderRadius: moderateScale(4),
              paddingHorizontal: moderateScale(8),
              marginTop: moderateScaleVertical(16),
            }}>
            <TextInput
              multiline
              value={reason}
              placeholder={strings.WRITE_YOUR_REASON_HERE}
              onChangeText={(val) => updateState({reason: val})}
              style={{
                ...styles.reasonText,
                color: isDarkMode ? colors.textGreyB : colors.black,
                textAlignVertical: 'top',
              }}
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={
                isDarkMode ? colors.textGreyB : colors.blackOpacity40
              }
            />
          </View>
          <ButtonWithLoader
            isLoading={isBtnLoader}
            btnText={strings.CANCEL}
            btnStyle={{
              backgroundColor: themeColors.primary_color,
              borderWidth: 0,
            }}
            onPress={onCancelOrder}
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
}
