import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { memo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import BottomModal from '../../../../Components/BottomModal';
import GradientButton from '../../../../Components/GradientButton';
import Header from '../../../../Components/Header';
import SearchAreaModal from '../../../../Components/SearchAreaModal';
import SelectDatePicker from '../../../../Components/SelectDatePicker';
import WrapperContainer from '../../../../Components/WrapperContainer';
import imagePath from '../../../../constants/imagePath';
import strings from '../../../../constants/lang';
import navigationStrings from '../../../../navigation/navigationStrings';
import colors from '../../../../styles/colors';
import fontFamily from '../../../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../../styles/theme';
import { mapStyleGrey } from '../../../../utils/constants/MapStyle';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError
} from '../../../../utils/helperFunctions';
import styles from '../styles';
const CarRentHomeScreen = ({ location = {}, curLatLong = {} }) => {
  const navigation = useNavigation();
  const mapRef = useRef();

  let date = moment().toDate();
  // -----------------redux data
  const { appData, themeColors, themeColor, themeToggle } = useSelector(
    state => state?.initBoot || {},
  );
  const appMainData = useSelector(state => state?.home?.appMainData || {});
  const userData = useSelector(state => state?.auth?.userData || {});
  console.log(appMainData, 'appMainDataappMainData');
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const profileInfo = appData?.profile;

  // -------------states
  const [showPickUpTime, setShowPickUpTime] = useState(false);

  const [showReturnTime, setShowReturnTime] = useState(false);


  const [addressModal, showAddressModal] = useState(false);
  const [locationIndex, setLocationIndex] = useState(null);
  const [returnlocation, setreturnlocation] = useState('');
  const [searchResult, setSearchResult] = useState([]);


  const [dropLocationData, setDropLocationData] = useState([
    {
      type: 'pickup',
      address: '',
      location: { latitude: 0, longitude: 0 },
    },
    {
      type: 'dropOff',
      address: '',
      location: { latitude: 0, longitude: 0 },
    },
  ]);

  const [pickTimeDate, setPickTimeDate] = useState(
    {
      time: '',
      date: '',
      period: '',
      dateAndTime:''
    },
  );

  const [returnTimeDate, setReturnPickTimeDate] = useState(
    {
      time: '',
      date: '',
      period: '',
      dateAndTime:''
    },
  );

  const [checkBox, setCheckBox] = useState(true);
  console.log(pickTimeDate, 'dropLocationDatadropLocationData',returnTimeDate);

  const imageURI = getImageUrl(
    isDarkMode
      ? profileInfo?.dark_logo?.image_fit
      : profileInfo?.logo?.image_fit,
    isDarkMode
      ? profileInfo?.dark_logo?.image_path
      : profileInfo?.logo?.image_path,
    '200/400',
  );



  // ----------selectedSearch -------------

  const onSearchHandler = val => {
    setLocationIndex(val);
    showAddressModal(true);
  };


  const onShowCars = () => {
    if (!dropLocationData[0]?.location?.lat) {
      showError('Please enter pickup location')
      return
    }
    if (!checkBox && !dropLocationData[1]?.location?.lat) {
      showError('Please enter dropLocation location')
      return
    }

    navigation?.navigate(navigationStrings.AVAILABLE_CARS, {
      data: {
        pickup: {
          latitude: dropLocationData[0]?.location?.lat,
          longitude: dropLocationData[0]?.location?.lng,
          address: dropLocationData[0]?.address,
          time: !!pickTimeDate.dateAndTime  ? pickTimeDate.dateAndTime  :moment().format('YYYY-MM-DD hh:mm a'),
        },
        dropOff: {
          latitude:
            dropLocationData[!!checkBox ? 0 : 1]?.location
              ?.lat,
          longitude:
            dropLocationData[!!checkBox ? 0 : 1]?.location
              ?.lng,
          address:
            dropLocationData[!!checkBox ? 0 : 1]?.address,
          time: !!returnTimeDate.dateAndTime  ? returnTimeDate.dateAndTime  :moment().format('YYYY-MM-DD hh:mm a'),
        },
        service: 'rental',
      },
    })
  }


  return (
    <WrapperContainer>
      <View style={{ backgroundColor: themeColors?.primary_color, flex: 1 }}>
       

        <View
          style={{
            flex: 1,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1, zIndex: 0 }}>
              <MapView
                ref={mapRef}
                provider={
                  Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                }
                // / remove if not using Google Maps
                customMapStyle={mapStyleGrey}
                // customMapStyle={
                //   appIds.cabway == DeviceInfo.getBundleId() ? null : mapStyleGrey
                // }

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
                showsUserLocation={true}
                showsMyLocationButton={false}></MapView>
            </View>

            {/* -----------------rentbook container-------------- */}
            <View
              style={[
                styles.taxiBookContainer,
                {
                  backgroundColor: isDarkMode
                    ? colors.blackOpacity70
                    : colors.white,

                },
              ]}>
              <View style={styles.texiBookView}>
                <View style={{ alignItems: 'center', flex: 0.1 }}>

                  <View>
                    {checkBox ? <Image
                      resizeMode="contain"
                      source={imagePath.locationoval}
                    /> :
                      <View>

                        <Image resizeMode="contain" source={imagePath.location} />
                        <Image resizeMode="contain" source={imagePath.oval} style={{ tintColor: themeColors?.primary_color }} />
                      </View>
                    }
                  </View>



                </View>
                <View style={{ flex: 0.9, paddingHorizontal: moderateScale(21) }}>
                  <TouchableOpacity
                    style={{
                      paddingBottom: moderateScale(8),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={() => onSearchHandler(0)

                    }>
                    <View>
                      <Text style={styles.locationHadingText}>
                        {strings.PICKUP_LOCATION}
                      </Text>


                      <Text
                        style={[
                          styles.locationText,
                          {
                            textTransform: 'capitalize',
                            color: isDarkMode
                              ? colors.white
                              : colors.blackOpacity80,
                          },
                        ]}>
                        {!!dropLocationData[0]?.address
                          ? dropLocationData[0]?.address
                          : strings.MY_CURRENT_LOCATION}
                      </Text>

                    </View>

                

                  </TouchableOpacity>

                  <View style={styles.sepratorView} />


                  {
                    !checkBox ?

                      <View>
                        <TouchableOpacity
                          style={{
                            marginBottom: moderateScaleVertical(0),
                            marginTop: moderateScaleVertical(16),
                          }}
                          onPress={() => onSearchHandler(1)

                          }>
                          <Text style={styles.locationHadingText}>
                            {strings.RETURN_LOCATION}
                          </Text>


                          <Text
                            style={[
                              styles.locationText,
                              {
                                textTransform: 'capitalize',
                                color: isDarkMode
                                  ? colors.white
                                  : colors.black,
                              },
                            ]}>
                            {!!dropLocationData[1]?.address
                              ? dropLocationData[1]?.address
                              : 'My Return Location'}
                          </Text>


                        </TouchableOpacity>
                        <View style={styles.sepratorView} />
                      </View>
                      : null
                  }



                  <TouchableOpacity
                  activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: moderateScaleVertical(16),
                      marginTop: moderateScaleVertical(0),
                    }}
                    onPress={() => setCheckBox(!checkBox)}>

                    <Image
                      source={
                        !checkBox
                          ? imagePath.checkBox2Active
                          : imagePath.checkBox2InActive
                      }
                      style={{
                        resizeMode:'contain',
                        height: moderateScaleVertical(16),
                        width: moderateScale(16),
                        tintColor: themeColors.primary_color,
                      }}
                    />
                    {/* </View> */}
                    <Text
                      style={{
                        fontSize: textScale(13),
                        fontFamily: fontFamily.bold,
                        marginLeft: moderateScale(10),
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : themeColors.primary_color,
                      }}>
                      {strings.DIFFERENT_RETURN_LOCATION}
                    </Text>
                  </TouchableOpacity>

                </View>
              </View>

              <View style={{ overflow: 'hidden' }}>
                <View
                  style={{
                    backgroundColor: getColorCodeWithOpactiyNumber(
                      themeColors?.primary_color?.substr(1),
                      10,
                    ),
                    ...styles.datepickerview,
                  }}>

                    {/* --------------------piuck time ----------- */}
                  <TouchableOpacity
                    style={{}}
                    onPress={() => setShowPickUpTime(!showPickUpTime)}>
                    <Text style={{
                      fontSize: moderateScale(12),
                      fontFamily: fontFamily.bold,
                      color: isDarkMode ? colors.white : colors.black,
                      textTransform: 'uppercase',
                    }}>
                      {strings.PICKUP_DATE}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: moderateScaleVertical(8),
                      }}>
                      <Text style={{
                        marginRight: moderateScale(6),
                        fontSize: textScale(10),
                        color: isDarkMode ? colors.white : colors.black,
                        // marginTop: moderateScaleVertical(8),
                        fontFamily: fontFamily.regular,
                      }}>
                        {!!pickTimeDate?.dateAndTime ? pickTimeDate?.dateAndTime :  moment().format('YYYY-MM-DD hh:mm a')}
                      </Text>
                      <Image
                        source={imagePath.ic_down_arrow1}
                        style={{
                          height: moderateScaleVertical(6),
                          width: moderateScale(6),
                          tintColor: isDarkMode ? MyDarkTheme.colors.white : colors.black,
                          opacity: 0.8,
                          alignItems: 'center',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      borderWidth: 0.6,
                      width: moderateScale(20),
                    }}
                  />
                  {/* -------------------------return date button */}
            <TouchableOpacity
                    style={{}}
                    onPress={() => setShowReturnTime(!showReturnTime)}>
                    <Text style={{
                      fontSize: moderateScale(12),
                      fontFamily: fontFamily.bold,
                      color: isDarkMode ? colors.white : colors.black,
                      textTransform: 'uppercase',
                    }}>
                      {strings.RETURN_DATE}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: moderateScaleVertical(8),
                      }}>
                      <Text style={{
                        marginRight: moderateScale(6),
                        fontSize: textScale(10),
                        color: isDarkMode ? colors.white : colors.black,
                        // marginTop: moderateScaleVertical(8),
                        fontFamily: fontFamily.regular,
                      }}>
                        {!!returnTimeDate?.dateAndTime ? returnTimeDate?.dateAndTime :  moment().format('YYYY-MM-DD hh:mm a')}
                      </Text>
                      <Image
                        source={imagePath.ic_down_arrow1}
                        style={{
                          height: moderateScaleVertical(6),
                          width: moderateScale(6),
                          tintColor: isDarkMode ? MyDarkTheme.colors.white : colors.black,
                          opacity: 0.8,
                          alignItems: 'center',
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                {console.log(dropLocationData, 'dropLocationData')}
                <GradientButton
                  containerStyle={styles.showCarButtonStyle}
                  textStyle={{
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.atlanticgreen,
                    fontSize: moderateScale(13),
                    fontWeight: '600',

                  }}
                  btnText={strings.SHOW_CARS}
                  onPress={onShowCars}
                  colorsArray={[colors.transparent, colors.transparent]}
                />
              </View>

            </View>
          </View>
        </View>
        <SearchAreaModal
          showModal={addressModal}
          location={`${location.latitude}-${location.longitude}`}
          mapKey={appData?.profile?.preferences?.map_key}
          title={locationIndex ? 'My Return Location' : 'My Current Location'}
          onClose={() => {
            showAddressModal(false);
            setSearchResult([]);
            setreturnlocation('');
          }}
          searchResult={searchResult}
          setSearchResult={data => setSearchResult(data)}
          value={returnlocation}
          setValue={text => setreturnlocation(text)}
          onClear={() => {
            setreturnlocation('');
            setSearchResult([]);
          }}
          getLocation={async val => {
            let newArr = [...dropLocationData];
            if (newArr[locationIndex]) {
              newArr[locationIndex].location = val?.location;
              newArr[locationIndex].address = val?.name;
            }
            await setDropLocationData(newArr);
            showAddressModal(false);
            setSearchResult([]);
            setreturnlocation('');
          }}
        />
      </View>
      <SelectDatePicker
        showTime={showPickUpTime}
        setShowTime={val => setShowPickUpTime(val)}
        timeDate={pickTimeDate}
        setTimeAndDate={(vel) => setPickTimeDate(vel)}
        title={strings.PICKUP_DATE}
      />

      <SelectDatePicker
        showTime={showReturnTime}
        setShowTime={val => setShowReturnTime(val)}
        timeDate={returnTimeDate}
        setTimeAndDate={(vel) => setReturnPickTimeDate(vel)}
        title={strings.RETURN_DATE}
      />
    </WrapperContainer>
  );
};

export default memo(CarRentHomeScreen);