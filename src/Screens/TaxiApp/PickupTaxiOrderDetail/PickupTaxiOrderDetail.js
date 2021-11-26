import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  Animated
} from 'react-native';
import { useSelector } from 'react-redux';
import HeaderWithFilters from '../../../Components/HeaderWithFilters';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import * as Animatable from 'react-native-animatable'
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetVirtualizedList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  getImageUrl,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import stylesFunc from './styles';
const { height, width } = Dimensions.get('window');
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { useIsFocused } from '@react-navigation/native';

import Communications from 'react-native-communications';
import navigationStrings from '../../../navigation/navigationStrings';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../../styles/theme';
import TaxiOrderDetailView from './TaxiOrderDetailView';
import SearchingForDriverView from './SearchingForDriverView';
import { color } from 'react-native-reanimated';
import useInterval from '../../../utils/useInterval';
import { cloneDeep } from 'lodash';
import BottomViewModal from '../../../Components/BottomViewModal';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';

import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import StarRating from 'react-native-star-rating';
import { mapStyleGrey } from '../../../utils/constants/MapStyle';
import StepIndicators from '../../../Components/StepIndicator';
import AnimatedHeader from '../../../Components/AnimatedHeader';
import RoundImg from '../../../Components/RoundImg';
import LeftRightText from '../../../Components/LeftRightText';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function PickupTaxiOrderDetail({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
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
    hideShowBack: 0
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
    hideShowBack
  } = state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot,
  );
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef(null)

  const { profile } = appData;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, isDarkMode, MyDarkTheme });
  const mapRef = useRef();

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
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
          updateState({ isLoading: false });
        }
      } else {
        showError(strings.UNAUTHORIZED_MESSAGE);
      }
    }, [currencies, languages, paramData]),
  );

  useInterval(
    () => {
      if (urlValue) {
        _updateDriverLocationLocation(urlValue);
      } else {
        updateState({ isLoading: false });
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
        console.log('agent location', res?.data)
        updateState({
          agent_location: res?.data?.agent_location,
          orderDetail: res?.data?.order,
          agent_image: res?.data?.agent_image,
          driverStatus: res?.data?.order_details?.dispatcher_status,
          productInfo: res?.data?.order_details?.products,
          getDispatchId: res?.data?.order?.id,
          driverRating: res?.data?.avgrating,
          orderStatus: res?.data?.order?.status,
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
        console.log(res, 'res---agent>>>>>>>');
        updateState({
          isLoading: false,
          tasks: res?.data?.tasks,
          orderFullDetail: res?.data,
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
          isShowRating:
            res?.data?.order?.status == 'completed'
              ? true
              : false,
          productInfo: res?.data?.order_details?.products,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoading: false, isLoadingC: false });
    showError(error?.message || error?.error);
  };
  const _onRegionChange = (region) => {
    updateState({ region: region });
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
    navigation.navigate(navigationStrings.RATEORDER, { item });
  };
  const _ModalMainView = () => (
    <View
      style={{
        height: height / 5,
        backgroundColor: colors.white,
      }}>
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
                <View style={{ marginTop: moderateScaleVertical(10) }}>
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
                    hitSlop={{ top: 100, bottom: 100, left: 125, right: 125 }}
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


  const onCenter = () => {
    mapRef.current.fitToCoordinates(
      [
        {
          latitude: Number(driverStatus?.agent_location?.lat),
          longitude: Number(driverStatus?.agent_location?.long),
        },
        {
          latitude: Number(driverStatus.tasks[1]?.latitude),
          longitude: Number(driverStatus.tasks[1]?.longitude),
        },
      ],
      {
        edgePadding: {
          right: width / 20,
          bottom: height / 20,
          left: width / 20,
          top: height / 20,
        },
      },
    );
  };


  const renderDotContainer = (i) => {
    return (
      <View>
        <Image
          style={{
            tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            height: moderateScale(5),
            width: moderateScale(5),
            borderRadius: orderFullDetail.tasks.length - 1 == i ? 0 : moderateScale(5 / 2),
          }}
          source={imagePath.blackSquare}
        />
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <View style={{ flex: 1, margin: moderateScale(16), marginBottom: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: moderateScaleVertical(16) }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Image style={{
              tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black
            }} source={imagePath.backArrowCourier} />
          </TouchableOpacity>
          <Text style={{
            fontSize: moderateScale(16),
            fontFamily: fontFamily.medium,
            textAlign: 'left',
            marginLeft: moderateScale(8),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black
          }}>Invoice</Text>
        </View>



        {!isLoading && (
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{
              height: '30%',
              width: '100%'
            }}
            region={region}
            // initialRegion={region}
            ref={mapRef}
            // cacheEnabled={true}
            customMapStyle={mapStyleGrey}
          // showsMyLocationButton={true}
          // userLocationFastestInterval={10000}
          // onRegionChangeComplete={_onRegionChange}
          >
            {/* pick and drop all locations */}
            {tasks.map((coordinate, index) => (
              <MapView.Marker
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
            ))}

            {/* driver location */}
            {!!agent_location && !!agent_location?.lat && orderStatus != 'completed' && (
              <MapView.Marker
                key={`coordinate_${agent_location?.lat}`}
                //   image={imagePath.driver}
                coordinate={{
                  latitude: Number(agent_location?.lat),
                  longitude: Number(
                    agent_location?.long || agent_location?.lng,
                  ),
                }}>
                <Image
                  style={{ height: 35, width: 35 }}
                  source={imagePath.icScooter}
                />
              </MapView.Marker>
            )}

            {/* Directions and paths */}
            <MapViewDirections
              origin={tasks[0]}
              waypoints={tasks.length > 2 ? tasks.slice(1, -1) : []}
              destination={tasks[tasks.length - 1]}
              apikey={profile?.preferences?.map_key}
              strokeWidth={5}
              strokeColor={themeColors.primary_color}
              optimizeWaypoints={true}
              onStart={(params) => { }}
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
                    right: width / 20,
                    bottom: height / 20,
                    left: width / 20,
                    top: height / 60,
                  },
                });
              }}
              onError={(errorMessage) => {
                //
              }}
            />
          </MapView>)}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={['60%', '100%']}
          animateOnMount={true}
          onChange={(inx) => updateState({ hideShowBack: inx })}

          handleComponent={() => <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: moderateScale(42),
              justifyContent: 'space-between'
            }}
          >

            <Animatable.View
            // duration={200}
            // animation="fadeIn"
            // easing="linear"
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
              >
                <Image style={{
                  tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  opacity: hideShowBack
                }} source={imagePath.backArrowCourier} />
              </TouchableOpacity>
            </Animatable.View>
            <View
              style={{
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity77
                  : colors.black,
                width: moderateScale(40),
                height: moderateScale(4),
                marginRight: moderateScale(34)
              }} />
            <Text />
          </View>}
        >
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            {!!orderFullDetail && <View style={{ marginBottom: moderateScaleVertical(16) }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: moderateScaleVertical(16),
                marginBottom: moderateScaleVertical(24)
              }}>
                <View style={{ flex: 0.5 }}>
                  <Text style={styles.datePriceText}>July 28  ·  01:52 PM</Text>
                  <Text style={{ ...styles.statusText, marginTop: moderateScaleVertical(4) }}>id:9888</Text>
                </View>
                <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                  <Text style={styles.statusText}> {currencies?.primary_currency?.symbol} {orderFullDetail.order_details?.payable_amount}</Text>
                  <Text style={{
                    ...styles.statusText,
                    color: themeColors.primary_color,
                    marginTop: moderateScaleVertical(4),
                    textTransform: 'capitalize'
                  }}>{orderFullDetail?.order.status}</Text>
                </View>
              </View>

              {orderFullDetail?.tasks.map((val, i) => {
                return (
                  <View>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <View style={{ marginRight: moderateScaleVertical(8) }}>
                        {renderDotContainer(i)}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          ...styles.statusText,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.blackOpacity66,

                        }}>{val?.address || ''}</Text>
                      </View>
                    </View>
                    {orderFullDetail.tasks.length - 1 !== i && (<View
                      style={{
                        borderBottomWidth: 0.8,
                        borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.lightGreyBg,
                        marginVertical: moderateScaleVertical(8),
                        marginHorizontal: 16
                      }}
                    />)}
                  </View>
                )
              })}

              {!!orderFullDetail?.agent_location ? <View style={{
                backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.greyNew,
                marginVertical: moderateScaleVertical(24),
                padding: moderateScale(12),
                borderRadius: moderateScale(8)
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RoundImg
                      img={orderFullDetail?.agent_image}
                      size={34}
                    />
                    <Text style={{
                      ...styles.statusText,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      marginLeft: moderateScale(10)
                    }}>{orderFullDetail?.order?.name || ''}</Text>
                  </View>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={3}
                    selectedStar={(rating) => onStarRatingPress(item, rating)}
                    fullStarColor={'#DD812E'}
                    starSize={15}
                  />
                </View>
                <Text style={styles.deliveryProof}>Delivery Proof</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateState({ showModal: true })}
                >
                  <Image
                    source={{ uri: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2018/05/10/13/man-flashy-car.jpg?width=1200' }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 4,
                    }}
                  />
                </TouchableOpacity>
              </View> :
                <View style={{ marginBottom: moderateScaleVertical(24) }} />
              }

              {!!orderFullDetail?.order_details?.delivery_fee && orderFullDetail?.order_details?.delivery_fee !== '0.00' && (<View>
                <LeftRightText
                  leftText={strings.DELIVERYFEE}
                  rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.delivery_fee}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>)}

              {!!orderFullDetail?.order_details?.discount_amount && orderFullDetail?.order_details?.discount_amount !== '0.00' && (<View>
                <LeftRightText
                  leftText={strings.DISCOUNT}
                  rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.discount_amount}`}
                  leftTextStyle={{ color: themeColors.primary_color }}
                  rightTextStyle={{ color: themeColors.primary_color }}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>)}
              {!!orderFullDetail?.order_details?.taxable_amount && orderFullDetail?.order_details?.taxable_amount !== '0.00' && (<View>
                <LeftRightText
                  leftText={strings.TAX_AMOUNT}
                  rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.taxable_amount}`}
                  isDarkMode={isDarkMode}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>)}
              {!!orderFullDetail?.order_details?.subtotal_amount && orderFullDetail?.order_details?.subtotal_amount !== '0.00' && (<View>
                <LeftRightText
                  leftText={strings.SUBTOTAL}
                  rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.subtotal_amount}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>)}

              {!!orderFullDetail?.order_details?.payable_amount && orderFullDetail?.order_details?.payable_amount !== '0.00' && (<View>
                <LeftRightText
                  leftText={strings.TOTAL}
                  rightText={` ${currencies?.primary_currency?.symbol} ${orderFullDetail?.order_details?.payable_amount}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
              </View>)}
            </View>
            }
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
      <BottomViewModal
        show={isVisible}
        mainContainView={_ModalMainView}
        closeModal={_modalClose}
      />
      <Modal
        isVisible={showModal}
        onBackdropPress={() => updateState({ showModal: false })}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View style={{
          backgroundColor: isDarkMode ? colors.whiteOpacity50 : colors.white,
          borderRadius: moderateScale(8),
          overflow: 'hidden'
          // paddingVertical: moderateScale(12)
        }}>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: moderateScale(6)
          }}>
            <Text />
            <Text style={{
              fontSize: textScale(16),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              alignSelf: 'center',
              fontFamily: fontFamily.medium
            }}>Proof</Text>
            <TouchableOpacity
              onPress={() => updateState({ showModal: false })}
            >
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://www.digitalcreed.in/wp-content/uploads/2016/04/driver.jpg' }}
            style={{
              width: '100%',
              height: height / 3,
              backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity10,
              // borderRadius: 8,
            }}
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
}
