import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import WrapperContainer from '../../../Components/WrapperContainer';
import stylesFun from './styles';
import {useSelector} from 'react-redux';
import MapView, {AnimatedRegion} from 'react-native-maps';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {chekLocationPermission} from '../../../utils/permissions';
import {getCurrentLocation} from '../../../utils/helperFunctions';
import GradientButton from '../../../Components/GradientButton';
import {width} from '../../../styles/responsiveSize';
import imagePath from '../../../constants/imagePath';
import {colors} from 'react-native-elements';

export default function PinAddressOnMap() {
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
            json.results[0].formatted_address,
            'json.results[0].formatted_address',
          );
          // console.log(json, 'json');
          updateState({
            formattedAddress1: json.results[0].formatted_address,
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
          console.log(
            json.results[0].formatted_address,
            'json.results[0].formatted_address',
          );
          // console.log(json, 'json');
          updateState({
            formattedAddress2: json.results[0].formatted_address,
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
                        markerImage: imagePath.soptLight,
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
                        markerImage: imagePath.markerPin2,
                        formattedAddress: formattedAddress2,
                      },
                    ],
                    // formattedAddress1: formattedAddress1,
                    // formattedAddress2: formattedAddress2,
                  });
                },
                (error) => alert(error.message),
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
              markerImage: imagePath.soptLight,
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
              markerImage: imagePath.markerPin2,
              formattedAddress: formattedAddress2,
            },
          ],
          // formattedAddress1: formattedAddress1,
          // formattedAddress2: formattedAddress2,
        });
      },
      (error) => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  }, [formattedAddress1, formattedAddress2]);
  const onMarkerDragEnd = (coordinate, id) => {
    console.log(id, coordinate, 'coordinate,id');

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
                markerImage: imagePath.soptLight,
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
                markerImage: imagePath.markerPin2,
                formattedAddress: formattedAddress2,
              },
            ],
            // formattedAddress1: formattedAddress1,
            // formattedAddress2: formattedAddress2,
          });
        },
        (error) => alert(error.message),
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
                markerImage: imagePath.soptLight,
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
                markerImage: imagePath.markerPin2,
                formattedAddress: formattedAddress2,
              },
            ],
            // formattedAddress1: formattedAddress1,
            // formattedAddress2: formattedAddress2,
          });
        },
        (error) => alert(error.message),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
        },
      );
    }
  };
  console.log(markers, 'markersmarkersmarkersmarkers');

  return (
    <>
      <MapView
        ref={mapRef}
        //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={region}
        initialRegion={region}
        customMapStyle={mapStyleGrey}
        // pointerEvents={'none'}
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
            pinColor={themeColors.primary_color}
            image={marker?.markerImage}></MapView.Marker>
        ))}
      </MapView>

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
          Place the pin on Map to mark exact location
        </Text>
        <GradientButton btnText={'Done'} />
      </View>
    </>
  );
}
