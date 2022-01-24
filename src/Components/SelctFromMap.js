import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import GradientButton from '../Components/GradientButton';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import {
    height,
    moderateScale,
    moderateScaleVertical,
    StatusBarHeightSecond, width
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getCurrentLocation } from '../utils/helperFunctions';
import { chekLocationPermission } from '../utils/permissions';

import stylesFun from './styles';

export default function SelctFromMap({
    addressDone = () => { },
    mapClose = () => { }
}) {
    const navigation = useNavigation()
    const mapRef = React.createRef();

    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const [state, setState] = useState({
        region: {
            latitude: 30.7333,
            longitude: 76.7794,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        },
        coordinate: {
            latitude: 30.7333,
            longitude: 76.7794,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
        },
        isLoading: false,
        details: {},
        addressLabel: 'Glenpark',
        formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
        userCurrentLongitude: null,
        userCurrentLatitude: null,
        isVisible: false,
        task_type_id: null,
    });

    const {
        region,
        details,
    } = state;

    const { themeColors, appStyle } = useSelector((state) => state?.initBoot);
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFun({ fontFamily, themeColors });

    const _onRegionChange = (region) => {
        updateState({ region: region });
        _getAddressBasedOnCoordinates(region);
        // animate(region);
    };

    console.log(region, 'regionregion');

    const _getAddressBasedOnCoordinates = (region) => {
        Geocoder.from({
            latitude: region.latitude,
            longitude: region.longitude,
        })
            .then((json) => {
                // console.log(json, 'json');
                updateState({
                    formattedAddress: json.results[0].formatted_address,
                });
                let detail = {};
                console.log('scroll detail', json.results[0]);
                detail = {
                    formatted_address: json.results[0].formatted_address,
                    geometry: {
                        location: {
                            lat: region.latitude,
                            lng: region.longitude,
                        },
                    },
                    address_components: json.results[0].address_components,
                    place_id: json.results[0].place_id,
                };
                updateState({ details: detail });
            })
            .catch((error) => console.log(error, 'errro geocode'));
    };

    console.log(details, 'detaildetaildetail');

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
                        .catch((err) => { });
                }
            })
            .catch((error) => console.log('error while accessing location', error));
    }, []);




    const _modeToNextScreen = () => {
        const pickuplocationAllData = {
            longitude: details?.geometry?.location?.lng,
            latitude: details?.geometry?.location?.lat,
            address: details?.formatted_address,
            task_type_id: 1,
            pre_address: details?.formatted_address,
            place_id: details?.place_id,
        };
        addressDone(pickuplocationAllData)
    };


    return (
        <>
            <MapView
                ref={mapRef}
                // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{
                    ...StyleSheet.absoluteFillObject,
                    height: height,
                }}
                // region={region}
                initialRegion={region}
                // pointerEvents={'none'}
                onRegionChangeComplete={_onRegionChange}
            />
            <View style={[styles.backbutton, { marginHorizontal: moderateScale(15) }]}>
                <TouchableOpacity onPress={mapClose}>
                    <View
                        style={{
                            paddingHorizontal: moderateScale(15),
                            paddingVertical: moderateScaleVertical(15),
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
                    top: height / 2 - StatusBarHeightSecond,
                    right: width / 2,
                    left: width / 2,
                    bottom: height / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // marginTop: height / 2,
                }}>
                <Image
                    source={imagePath.icLocationPin_}
                    style={{ tintColor: themeColors.primary_color }}
                />
            </View>
            <View
                style={{
                    position: 'absolute',
                    bottom: 40,
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
                <GradientButton btnText={strings.DONE} onPress={() => _modeToNextScreen()} />
            </View>
        </>
    );
}
