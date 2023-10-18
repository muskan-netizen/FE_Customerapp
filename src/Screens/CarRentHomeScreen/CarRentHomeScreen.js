import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { memo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { useDarkMode } from 'react-native-dynamic';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import SearchAreaModal from '../../Components/SearchAreaModal';
import SelectDatePicker from '../../Components/SelectDatePicker';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { mapStyleGrey } from '../../utils/constants/MapStyle';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError
} from '../../utils/helperFunctions';
import stylesFunc from './styles';
import Header from '../../Components/Header';
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
  const styles= stylesFunc({themeColors,isDarkMode})
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
      dateAndTime: ''
    },
  );

  const [returnTimeDate, setReturnPickTimeDate] = useState(
    {
      time: '',
      date: '',
      period: '',
      dateAndTime: ''
    },
  );

  const [checkBox, setCheckBox] = useState(false);
  console.log(pickTimeDate, 'dropLocationDatadropLocationData', returnTimeDate);

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
          time: !!pickTimeDate.dateAndTime ? pickTimeDate.dateAndTime : moment().format('YYYY-MM-DD hh:mm a'),
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
          time: !!returnTimeDate.dateAndTime ? returnTimeDate.dateAndTime : moment().format('YYYY-MM-DD hh:mm a'),
        },
        service: 'rental',
      },
    })
  }


  return (
    <WrapperContainer>


      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <Header onPressLeft={() => navigation.goBack()} />

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
                  <View style={{marginTop:moderateScale(10)}}>

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

            </View>
          </View>

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
                <Text style={styles.dateTitleText}>
                  {strings.PICKUP_DATE}
                </Text>
                <View
                  style={styles.dateView}>
                  <Text style={styles.dateText}>
                    {!!pickTimeDate?.dateAndTime ? pickTimeDate?.dateAndTime : moment().format('YYYY-MM-DD hh:mm a')}
                  </Text>
                  <Image
                    source={imagePath.ic_down_arrow1}
                    style={styles.dropDownIcon}
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
                <Text style={styles.dateTitleText}>
                  {strings.RETURN_DATE}
                </Text>
                <View
                  style={styles.dateView}>
                    <Text style={styles.dateText}>
                    {!!returnTimeDate?.dateAndTime ? returnTimeDate?.dateAndTime : moment().format('YYYY-MM-DD hh:mm a')}
                  </Text>
                  <Image
                    source={imagePath.ic_down_arrow1}
                    style={styles.dropDownIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>

        </View>
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