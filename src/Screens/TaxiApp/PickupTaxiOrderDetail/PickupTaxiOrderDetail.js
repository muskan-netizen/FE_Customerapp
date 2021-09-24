import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, View, Text, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import HeaderWithFilters from '../../../Components/HeaderWithFilters';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {showError} from '../../../utils/helperFunctions';
import stylesFunc from './styles';
const {height, width} = Dimensions.get('window');
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import MapView, {Marker, Callout} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {useIsFocused} from '@react-navigation/native';

import Communications from 'react-native-communications';
import navigationStrings from '../../../navigation/navigationStrings';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';
import TaxiOrderDetailView from './TaxiOrderDetailView';
import SearchingForDriverView from './SearchingForDriverView';
import {color} from 'react-native-reanimated';
import useInterval from '../../../utils/useInterval';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function PickupTaxiOrderDetail({navigation, route}) {
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
  } = state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state.initBoot,
  );
  const isFocused = useIsFocused();

  const {profile} = appData;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };
  const urlValue = paramData?.orderDetail?.dispatch_traking_url
    ? (paramData?.orderDetail?.dispatch_traking_url).replace(
        '/order/',
        '/order-details/',
      )
    : null;

  console.log(
    paramData?.selectedCarOption,
    'selectedCarOptionselectedCarOption',
  );

  useFocusEffect(
    React.useCallback(() => {
      //   updateState({isLoading: true});
      if (!!userData?.auth_token) {
        let url = paramData?.orderDetail?.dispatch_traking_url
          ? (paramData?.orderDetail?.dispatch_traking_url).replace(
              '/order/',
              '/order-details/',
            )
          : null;

        if (url && url.includes('order-details')) {
          _getOrderDetailScreen(url);
        } else {
          updateState({isLoading: false});
        }
      } else {
        showError(strings.UNAUTHORIZED_MESSAGE);
      }
    }, [currencies, languages, paramData]),
  );
  const mapRef = useRef();

  useInterval(
    () => {
      if (urlValue && urlValue.includes('order-details')) {
        _updateDriverLocationLocation(urlValue);
      } else {
        updateState({isLoading: false});
      }
    },
    isFocused ? 3000 : null,
  );

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     //assign interval to a variable to clear it.

  //     if (urlValue && urlValue.includes('order-details')) {
  //       _updateDriverLocationLocation(urlValue);
  //     } else {
  //       updateState({isLoading: false});
  //     }
  //   }, 3000);
  //   return () => clearInterval(intervalId);
  // }, []);

  /*********Update driver detail screen********* */
  const _updateDriverLocationLocation = (url) => {
    actions
      .getOrderDetailPickUp(
        url,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'res---agent');
        updateState({
          agent_location: res?.agent_location,
          orderDetail: res?.order,
          agent_image: res?.agent_image,
        });
      })
      .catch(errorMethod);
  };

  console.log(agent_location, 'agent_locationagent_location');

  /*********Get order detail screen********* */
  const _getOrderDetailScreen = (url) => {
    actions
      .getOrderDetailPickUp(
        url,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'res from pickup');
        updateState({
          isLoading: false,
          tasks: res?.tasks,
          region: {
            latitude: res?.tasks[0]?.latitude
              ? Number(res?.tasks[0].latitude)
              : 30.7191,
            longitude: res?.tasks[0]?.longitude
              ? Number(res?.tasks[0].longitude)
              : 76.8107,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          coordinate: {
            latitude: res?.tasks[0]?.latitude
              ? Number(res?.tasks[0].latitude)
              : 30.7191,
            longitude: res?.tasks[0]?.longitude
              ? Number(res?.tasks[0].longitude)
              : 76.8107,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          agent_location: res?.agent_location,
          orderDetail: res?.order,
          showOrderDetailView: true,
          agent_image: res?.agent_image,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isLoading: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };
  const _onRegionChange = (region) => {
    updateState({region: region});
    // _getAddressBasedOnCoordinates(region);
    // animate(region);
  };

  //   on press call
  const _onPressCall = (orderDetail) => {
    Communications.phonecall(orderDetail?.phone_number, true);
  };

  // on press chat
  const _onPressChat = (orderDetail) => {
    Communications.text(orderDetail?.phone_number);
  };

  console.log(paramData?.fromCab, 'paramData?.fromCab');
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
      />
    );
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <View style={styles.container}>
        {!isLoading && (
          <>
            <MapView
              //   provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={region}
              // initialRegion={region}
              ref={mapRef}
              // cacheEnabled={true}
              showsMyLocationButton={true}
              userLocationFastestInterval={10000}
              onRegionChangeComplete={_onRegionChange}>
              {/* pick and drop all locations */}
              {tasks.map((coordinate, index) => (
                <MapView.Marker
                  key={`coordinate_${index}`}
                  image={imagePath.radioLocation}
                  coordinate={{
                    latitude: Number(coordinate?.latitude),
                    longitude: Number(coordinate?.longitude),
                  }}>
                  <Callout style={styles.plainView}>
                    <View>
                      <Text style={styles.pickupDropOff}>
                        {coordinate?.task_type_id == 1 ? 'Pick up' : 'Drop off'}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={styles.pickupDropOffAddress}>
                        {coordinate?.address}
                      </Text>
                    </View>
                  </Callout>
                </MapView.Marker>
              ))}

              {/* driver location */}
              {agent_location && (
                <MapView.Marker
                  key={`coordinate_${agent_location?.agent_id}`}
                  //   image={imagePath.driver}
                  coordinate={{
                    latitude: Number(agent_location?.lat),
                    longitude: Number(agent_location?.long),
                  }}>
                  <Image
                    style={{height: 35, width: 35}}
                    source={imagePath.driver}
                  />
                </MapView.Marker>
              )}

              {/* Directions and paths */}
              <MapViewDirections
                origin={tasks[0]}
                waypoints={tasks.length > 2 ? tasks.slice(1, -1) : []}
                destination={tasks[tasks.length - 1]}
                apikey={profile?.preferences?.map_key}
                strokeWidth={2}
                strokeColor={themeColors.primary_color}
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
                      right: width / 20,
                      bottom: height / 20,
                      left: width / 20,
                      top: height / 20,
                    },
                  });
                }}
                onError={(errorMessage) => {
                  //
                }}
              />
            </MapView>

            <View style={styles.topView}>
              <TouchableOpacity
                style={[
                  styles.backButtonView,
                  {
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                  },
                ]}
                onPress={
                  paramData?.fromCab
                    ? () => navigation.navigate(navigationStrings.HOME)
                    : () =>
                        navigation.navigate(navigationStrings.TAB_ROUTES, {
                          screen: navigationStrings.ACCOUNTS,
                        })
                  // navigation.goBack()
                }>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                  }}
                  source={imagePath.backArrowCourier}
                />
              </TouchableOpacity>
            </View>
            {/* {_selectOrderDetailView()} */}
            {_selectTexiOrderDetailView()}
          </>
        )}
      </View>
    </WrapperContainer>
  );
}
