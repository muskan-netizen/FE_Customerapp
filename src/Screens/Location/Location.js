import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import Geocoder from 'react-native-geocoding';
import {useSelector} from 'react-redux';
import GooglePlaceInput from '../../Components/GooglePlaceInput';
import Header from '../../Components/Header';
import SearchPlaces from '../../Components/SearchPlaces';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {hitSlopProp} from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {
  getCurrentLocationFromApi,
  getPlaceDetails,
  nearbySearch,
} from '../../utils/googlePlaceApi';
import {getCurrentLocation} from '../../utils/helperFunctions';
import {
  chekLocationPermission,
  locationPermission,
} from '../../utils/permissions';
import stylesFun from './styles';

navigator.geolocation = require('react-native-geolocation-service');

export default function Location({route, navigation}) {
  //get param data from specific screen
  const {type} = route.params;
  const addressType = route?.params?.addressType;

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    address: '',
    curLatLng: {
      latitude: 30.7333,
      longitude: 76.7794,
    },
    nearByAddressess: [],
    searchResult: [],
  });

  const {isLoading, address, curLatLng, nearByAddressess, searchResult} = state;

  //Reduc store data
  const {appData, appStyle, themeColors} = useSelector(
    (state) => state?.initBoot,
  );
  const {profile} = appData;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  useEffect(() => {
    Geocoder.init(profile.preferences.map_key, {language: 'en'}); // set the language
  }, []);

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useEffect(() => {
    getLiveLocation();
  }, []);

  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const {latitude, longitude} = await getCurrentLocationFromApi();
      // console.log("get live location after 4 second")
      updateState({curLatLng: {latitude, longitude}});
      getNearByAddress(`${latitude}, ${longitude}`);
    }
  };

  const getNearByAddress = async (latlng) => {
    try {
      const res = await nearbySearch(latlng, profile?.preferences?.map_key);
      console.log('nearby search res+++++', res.results);
      updateState({
        nearByAddressess: res.results,
      });
    } catch (error) {
      console.log('error raised', error);
    }
  };

  //Get Your current location
  const getCurrentLocate = () => {
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          getCurrentPosition();
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  };

  const getCurrentPosition = () => {
    getCurrentLocation('home')
      .then((res) => {
        let details = {};
        updateState({address: res.address});
        details = {
          formatted_address: res?.address,
          geometry: {
            location: {
              lat: res?.latitude,
              lng: res?.longitude,
            },
          },
        };

        setTimeout(() => {
          if (type == 'Home1') {
            navigation.navigate(navigationStrings.HOME, {
              details,
            });
          }
          if (type == 'Pickup') {
            navigation.navigate(navigationStrings.PICKUPLOCATION, {
              details,
              addressType,
            });
          }
        }, 200);
      })
      .catch((err) => console.log(err, 'errorOccured'));
    // return navigator.geolocation.default.getCurrentPosition(
    //   (position) => {
    //     Geocoder.from({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     })
    //       .then((json) => {
    //         var addressComponent = json.results[0].formatted_address;
    //         let details = {};
    //         details = {
    //           formatted_address: addressComponent,
    //           geometry: {
    //             location: {
    //               lat: position.coords.latitude,
    //               lng: position.coords.longitude,
    //             },
    //           },
    //           address_components: json.results[0].address_components,
    //         };

    //         console.log(details, 'detailsdetails');

    //         if (type == 'Home1') {
    //           navigation.navigate(navigationStrings.HOME, {
    //             details,
    //           });
    //         }

    //         if (type == 'Pickup') {
    //           navigation.navigate(navigationStrings.PICKUPLOCATION, {
    //             details,
    //             addressType,
    //           });
    //         }
    //       })
    //       .catch((error) => console.log(error, 'errro geocode'));
    //   },
    //   (error) => console.log(error.message),
    //   {enableHighAccuracy: true, timeout: 20000},
    // );
  };

  const handleAddressOnKeyUp = (text) => {
    updateState({address: text});
  };

  const _moveToNextScreen = (data) => {};

  const updateCurValues = (text) => {
    updateState({address: text});
  };

  const onPressAddress = async (place) => {
    Keyboard.dismiss();
    console.log('selected item', place?.name);
    // return;
    if (!!place.place_id && !!place?.name) {
      try {
        let res = await getPlaceDetails(
          place.place_id,
          profile?.preferences?.map_key,
        );
        const {result} = res;
        console.log('res===', result);

        let details = {};
        details = {
          formatted_address: result.formatted_address,
          geometry: {
            location: {
              lat: result?.geometry.location.lat,
              lng: result?.geometry.location.lng,
            },
          },
        };

        if (type == 'Home1') {
          navigation.navigate(navigationStrings.HOME, {
            details,
          });
        }
        if (type == 'Pickup') {
          navigation.navigate(navigationStrings.PICKUPLOCATION, {
            details,
            addressType,
          });
        }
      } catch (error) {
        console.log("something wen't wrong");
      }
    } else {
      alert(strings.PLACE_ID_NOT_FOUND);
    }
  };

  const renderAddressess = (item) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.addressViewStyle,
          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.lightGreyBg,
        }}
        onPress={() =>
          onPressAddress({place_id: item.place_id, name: item.name})
        }>
        <View style={{flex: 0.12}}>
          <Image
            style={{
              height: moderateScale(24),
              width: moderateScale(24),
              borderRadius: moderateScale(12),
            }}
            source={imagePath.RecentLocationImage}
          />
        </View>
        <View style={{flex: 0.9}}>
          <Text
            style={{
              fontSize: textScale(12),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily.regular,
            }}>
            {item?.name}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: textScale(10),
              color: colors.textGreyJ,
              fontFamily: fontFamily.regular,
              lineHeight: moderateScaleVertical(20),
            }}>
            {item?.vicinity}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchItem = (item) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.addressViewStyle,
          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.lightGreyBg,
        }}
        onPress={() => onPressAddress(item)}>
        <View style={{flex: 0.15}}>
          <Image source={imagePath.RecentLocationImage} />
        </View>
        <View style={{flex: 0.9}}>
          <Text
            style={{
              fontSize: textScale(12),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily.regular,
            }}>
            {item?.name}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: textScale(10),
              color: colors.textGreyJ,
              fontFamily: fontFamily.regular,
              lineHeight: moderateScaleVertical(20),
            }}>
            {item?.formatted_address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: moderateScale(12),
            marginTop: moderateScale(5),
          }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={{
              flex: 0.1,
            }}
            hitSlop={hitSlopProp}>
            <Image
              source={
                appStyle?.homePageLayout === 3
                  ? imagePath.icBackb
                  : imagePath.back
              }
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
              }}
            />
          </TouchableOpacity>

          <View style={{flex: 0.9}}>
            <SearchPlaces
              curLatLng={`${curLatLng.latitude}-${curLatLng.longitude}`}
              autoFocus={true}
              placeHolder={strings.SEARCH_LOCATION}
              value={address} // instant update search value
              mapKey={profile?.preferences?.map_key} //send here google Key
              fetchArrayResult={(data) => updateState({searchResult: data})}
              setValue={(text) => updateCurValues(text)} //return & update on change text value
              _moveToNextScreen={getCurrentLocate}
            />
          </View>

          {/* <View style={{ flex: 0.8 }}>
            <GooglePlaceInput
              autoFocus
              getDefaultValue={address}
              type={type}
              navigation={navigation}
              addressType={addressType}
              googleApiKey={profile?.preferences?.map_key}
              handleAddressOnKeyUp={(text) => handleAddressOnKeyUp(text)}
              style={{
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity15
                  : colors.greyColor,
              }}
            />
          </View> */}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {!!searchResult && searchResult.length > 0 ? (
            <View style={{marginTop: moderateScaleVertical(16)}}>
              <View style={{...styles.savedAddressView}}>
                <Image
                  style={{marginHorizontal: moderateScale(12)}}
                  source={imagePath.starRoundedBackground}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.addresssLableName,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.SEARCHED_RESULTS}
                </Text>
              </View>
              {searchResult?.map((item, i) => {
                return renderSearchItem(item);
              })}
            </View>
          ) : (
            <View style={{marginTop: moderateScaleVertical(16)}}>
              <View style={{...styles.savedAddressView}}>
                <Image
                  style={{marginHorizontal: moderateScale(12)}}
                  source={imagePath.starRoundedBackground}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.addresssLableName,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.NEARBY_LOCATION}
                </Text>
              </View>
              {nearByAddressess.slice(0, 5).map((val) => {
                return renderAddressess(val);
              })}
            </View>
          )}
        </ScrollView>

        {/* <View style={{ marginTop: moderateScaleVertical(16) }}>
          <View style={{ ...styles.savedAddressView }}>
            <Image
              style={{ marginHorizontal: moderateScale(12) }}
              source={imagePath.starRoundedBackground}
            />
            <Text
              numberOfLines={1}
              style={{
                ...styles.addresssLableName,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.black,
              }}>
              {strings.NEARBY_LOCATION}
            </Text>
          </View>
          {nearByAddressess.slice(0, 5).map((val) => {
            return renderAddressess(val);
          })}
        </View> */}
      </View>
      {/* 
      <View style={{ zIndex: -1000 }}>
        <TouchableOpacity
          style={{ backgroundColor: 'transparent' }}
          onPress={() => getCurrentLocate()}>
          <View style={styles.useCurrentLocationView}>
            <Image
              style={{
                tintColor: themeColors.primary_color,
                height: moderateScale(16),
                width: moderateScale(16),
              }}
              source={imagePath.redLocation}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.detectLocation,
                { color: themeColors.primary_color },
              ]}>
              {strings.USECURRENTLOACTION}
            </Text>
          </View>
        </TouchableOpacity>
      </View> */}
    </WrapperContainer>
  );
}
