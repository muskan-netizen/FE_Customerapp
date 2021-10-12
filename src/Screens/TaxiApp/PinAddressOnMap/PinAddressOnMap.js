import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import WrapperContainer from '../../../Components/WrapperContainer';
import stylesFun from './styles';
import {useSelector} from 'react-redux';
import MapView, {AnimatedRegion, PROVIDER_GOOGLE} from 'react-native-maps';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {chekLocationPermission} from '../../../utils/permissions';
import {getCurrentLocation} from '../../../utils/helperFunctions';
import GradientButton from '../../../Components/GradientButton';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import imagePath from '../../../constants/imagePath';
import {colors} from 'react-native-elements';
import navigationStrings from '../../../navigation/navigationStrings';
import strings from '../../../constants/lang';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';

export default function PinAddressOnMap(props) {
  const {navigation, route} = props;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  const mapRef = React.createRef();
  const [state, setState] = useState({
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    coordinate: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    isLoading: false,
    details: {},
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
    locationListData: [
      {id: 1, location: 'ISBT,Sector43'},
      {id: 1, location: 'Shukna Lake'},
      {id: 1, location: 'Green View Tower'},
      {id: 1, location: 'Sector 28'},
    ],
    userCurrentLongitude: null,
    userCurrentLatitude: null,
    marker: null,
    markers: [],
    formattedAddress1: null,
    formattedAddress2: null,
    pickuplocationlat: null,
    pickuplocationlong: null,
    pickuplocationshortname: null,
    droplocationshortname: null,
    pickup_post_code: null,
    drop_post_code: null,
    task_type_id: null,
    task_type_id1: null,
  });

  const {
    isLoading,
    addressLabel,
    details,
    formattedAddress,
    region,
    coordinate,
    locationListData,
    userCurrentLongitude,
    userCurrentLatitude,
    marker,
    markers,
    formattedAddress1,
    formattedAddress2,
    pickuplocationlat,
    pickuplocationlong,
    droplocationlat,
    droplocationlong,
    pickuplocationshortname,
    droplocationshortname,
    pickup_post_code,
    drop_post_code,
    task_type_id,
    task_type_id1,
  } = state;

  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const _getAddressBasedOnCoordinates = (region, id) => {
    console.log(region, 'region');
    if (id == 1) {
      Geocoder.from({
        latitude: region.latitude,
        longitude: region.longitude,
      })
        .then((json) => {
          console.log(
            json.results[0].address_components[
              json.results[0].address_components.length - 3
            ],
            'json.results[0]',
          );
          // console.log(json, 'json');
          updateState({
            formattedAddress1: json.results[0]?.formatted_address,
            pickuplocationlat: region.latitude,
            pickuplocationlong: region.longitude,
            pickuplocationshortname:
              json.results[0]?.address_components[
                json.results[0]?.address_components.length - 3
              ]?.short_name,
            pickup_post_code:
              json.results[0]?.address_components[
                json.results[0]?.address_components.length - 1
              ].short_name,
            task_type_id: id,
          });
          let detail = {};
          detail = {
            formatted_address: json.results[0].formatted_address,
            geometry: {
              location: {
                lat: region.latitude,
                lng: region.longitude,
              },
            },
            address_components: json.results[0].address_components,
          };
          updateState({
            details: detail,
          });
        })
        .catch((error) => console.log(error, 'errro geocode'));
    } else {
      Geocoder.from({
        latitude: region.latitude,
        longitude: region.longitude,
      })
        .then((json) => {
          console.log(json.results[0], 'json.results[0]1');
          // console.log(json, 'json');
          updateState({
            formattedAddress2: json.results[0].formatted_address,
            droplocationlat: region.latitude,
            droplocationlong: region.longitude,
            droplocationshortname:
              json.results[0]?.address_components[
                json.results[0]?.address_components.length - 3
              ]?.short_name,
            drop_post_code:
              json.results[0]?.address_components[
                json.results[0]?.address_components.length - 1
              ].short_name,
            task_type_id1: id,
          });
          let detail = {};
          detail = {
            formatted_address: json.results[0].formatted_address,
            geometry: {
              location: {
                lat: region.latitude,
                lng: region.longitude,
              },
            },
            address_components: json.results[0].address_components,
          };
          updateState({
            details: detail,
          });
        })
        .catch((error) => console.log(error, 'errro geocode'));
    }
  };

  const onDragMarker = (e) => {
    updateState({marker: e.nativeEvent.coordinate});
  };

  useEffect(() => {
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          getCurrentLocation('home')
            .then((res) => {
              Geolocation.getCurrentPosition(
                //Will give you the current location
                (position) => {
                  //getting the Longitude from the location json
                  const currentLongitude = JSON.stringify(
                    position.coords.longitude,
                  );

                  //getting the Latitude from the location json
                  const currentLatitude = JSON.stringify(
                    position.coords.latitude,
                  );

                  updateState({
                    userCurrentLongitude: currentLongitude,
                    userCurrentLatitude: currentLatitude,
                    markers: [
                      {
                        id: 1,
                        title: 'Current Location',
                        position: {
                          lat: currentLatitude,
                          lng: currentLongitude,
                        },
                        draggable: true,
                        markerImage: imagePath.locationpinGreen,
                        formattedAddress: formattedAddress1,
                      },
                      {
                        id: 2,
                        title: 'Drop Location',
                        position: {
                          lat: currentLatitude,
                          lng: currentLongitude,
                        },
                        draggable: true,
                        markerImage: imagePath.locationpin3,
                        formattedAddress: formattedAddress2,
                      },
                    ],
                    // formattedAddress1: formattedAddress1,
                    // formattedAddress2: formattedAddress2,
                  });
                },
                (error) => console.log(error.message),
                {
                  enableHighAccuracy: true,
                  timeout: 20000,
                  maximumAge: 1000,
                },
              );
            })
            .catch((err) => {});
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        updateState({
          userCurrentLongitude: currentLongitude,
          userCurrentLatitude: currentLatitude,
          markers: [
            {
              id: 1,
              title: 'Current Location',
              position: {
                lat: currentLatitude,
                lng: currentLongitude,
              },
              draggable: true,

              markerImage: imagePath.locationpinGreen,
              formattedAddress: formattedAddress1,
            },
            {
              id: 2,
              title: 'Drop Location',
              position: {
                lat: currentLatitude,
                lng: currentLongitude,
              },
              draggable: true,
              markerImage: imagePath.locationpin3,
              formattedAddress: formattedAddress2,
            },
          ],
        });
      },
      (error) => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  }, [formattedAddress1, formattedAddress2]);
  const onMarkerDragEnd = (coordinate, id) => {
    if (id == 1) {
      _getAddressBasedOnCoordinates(coordinate, id);
      Geolocation.getCurrentPosition(
        //Will give you the current location
        (position) => {
          //getting the Longitude from the location json
          const currentLongitude = JSON.stringify(position.coords.longitude);

          //getting the Latitude from the location json
          const currentLatitude = JSON.stringify(position.coords.latitude);

          updateState({
            userCurrentLongitude: currentLongitude,
            userCurrentLatitude: currentLatitude,
            markers: [
              {
                id: 1,
                title: 'Current Location',
                position: {
                  lat: currentLatitude,
                  lng: currentLongitude,
                },
                draggable: true,
                markerImage: imagePath.locationpinGreen,
                formattedAddress: formattedAddress1,
              },
              {
                id: 2,
                title: 'Drop Location',
                position: {
                  lat: currentLatitude,
                  lng: currentLongitude,
                },
                draggable: true,
                markerImage: imagePath.locationpin3,
                formattedAddress: formattedAddress2,
              },
            ],
            // formattedAddress1: formattedAddress1,
            // formattedAddress2: formattedAddress2,
          });
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        },
      );
    } else if (id == 2) {
      _getAddressBasedOnCoordinates(coordinate, id);
      Geolocation.getCurrentPosition(
        //Will give you the current location
        (position) => {
          //getting the Longitude from the location json
          const currentLongitude = JSON.stringify(position.coords.longitude);

          //getting the Latitude from the location json
          const currentLatitude = JSON.stringify(position.coords.latitude);

          updateState({
            userCurrentLongitude: currentLongitude,
            userCurrentLatitude: currentLatitude,
            markers: [
              {
                id: 1,
                title: 'Current Location',
                position: {
                  lat: currentLatitude,
                  lng: currentLongitude,
                },
                draggable: true,
                markerImage: imagePath.locationpinGreen,
                formattedAddress: formattedAddress1,
              },
              {
                id: 2,
                title: 'Drop Location',
                position: {
                  lat: currentLatitude,
                  lng: currentLongitude,
                },
                draggable: true,
                markerImage: imagePath.locationpin3,
                formattedAddress: formattedAddress2,
              },
            ],
            // formattedAddress1: formattedAddress1,
            // formattedAddress2: formattedAddress2,
          });
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        },
      );
    }
  };

  const _modeToNextScreen = () => {
    Geocoder.from({
      latitude: userCurrentLatitude,
      longitude: userCurrentLongitude,
    })
      .then((json) => {
        const pickuplocationAllData = [
          {
            longitude: pickuplocationlong
              ? pickuplocationlong
              : Number(userCurrentLongitude),
            latitude: pickuplocationlat
              ? pickuplocationlat
              : Number(userCurrentLatitude),
            address: formattedAddress1
              ? formattedAddress1
              : json.results[0].formatted_address,
            short_name: pickuplocationshortname
              ? pickuplocationshortname
              : json.results[0]?.address_components[
                  json.results[0]?.address_components.length - 3
                ]?.short_name,
            post_code: pickup_post_code
              ? pickup_post_code
              : json.results[0]?.address_components[
                  json.results[0]?.address_components.length - 1
                ].short_name,
            task_type_id: task_type_id ? task_type_id : 1,
          },
          {
            longitude: droplocationlong
              ? droplocationlong
              : Number(userCurrentLongitude),
            latitude: droplocationlat
              ? droplocationlat
              : Number(userCurrentLatitude),
            address: formattedAddress2
              ? formattedAddress2
              : json.results[0].formatted_address,
            short_name: droplocationshortname
              ? droplocationshortname
              : json.results[0]?.address_components[
                  json.results[0]?.address_components.length - 3
                ]?.short_name,
            post_code: drop_post_code
              ? drop_post_code
              : json.results[0]?.address_components[
                  json.results[0]?.address_components.length - 1
                ].short_name,
            task_type_id: task_type_id1 ? task_type_id1 : 2,
          },
        ];
        console.log(pickuplocationAllData, 'pickuplocationAllData');
        navigation.navigate(navigationStrings.ADDADDRESS, {
          data: {pickuplocationAllData, id: paramData?.data?.id},
        });
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };
  const _onRegionChange = (region) => {
    updateState({region: region});
    _getAddressBasedOnCoordinates(region);
    // animate(region);
  };
  return (
    <>
      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        // customMapStyle={mapStyleGrey}
        style={styles.map}
        region={region}
        initialRegion={region}
        // onRegionChangeComplete={() =>
        //   _onRegionChange(region, {isGesture: true})
        // }
      >
        {markers?.map((marker, index) => (
          <MapView.Marker
            coordinate={{
              latitude: Number(marker?.position?.lat),
              longitude: Number(marker?.position?.lng),
            }}
            draggable={marker?.draggable}
            onDragEnd={(e) =>
              onMarkerDragEnd(e.nativeEvent.coordinate, marker?.id)
            }
            title={marker?.title}
            description={marker?.formattedAddress}
            image={marker?.markerImage}></MapView.Marker>
        ))}
      </MapView>
      <View style={[styles.backbutton, {marginHorizontal: moderateScale(15)}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              paddingHorizontal: moderateScale(15),
              paddingVertical: moderateScaleVertical(15),
              borderRadius: 15,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.grey5,
            }}>
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
              source={imagePath.backArrow}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 30,
          width: width - 40,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            marginBottom: 40,
            textAlign: 'center',
            color: colors.black,
            fontFamily: fontFamily.medium,
          }}>
          {strings.PLACE_PIN_ON_MAP}
        </Text>
        <GradientButton btnText={'Done'} onPress={() => _modeToNextScreen()} />
      </View>
    </>
  );
}
