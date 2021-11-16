import { useFocusEffect } from '@react-navigation/native';
import { wrap } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Keyboard,
  FlatList
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import { abs } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import GooglePlaceInput from '../../../Components/GooglePlaceInput';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang/index';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import { getBundleId } from 'react-native-device-info';
import { appIds, shortCodes } from '../../../utils/constants/DynamicAppKeys';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {
  getAddressComponent,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import { chekLocationPermission } from '../../../utils/permissions';
import stylesFun from './styles';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../../styles/theme';
import AddressModal3 from '../../../Components/AddressModal3';
import SearchPlaces from '../../../Components/SearchPlaces';
import { getPlaceDetails } from '../../../utils/googlePlaceApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


export default function Addaddress({ navigation, route }) {
  const paramData = route?.params;
  console.log(paramData, 'paramDataparamDataparamDataparamData');
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const userData = useSelector((state) => state?.auth?.userData);
  const { appData, allAddresss, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const [state, setState] = useState({
    pickUpLocation: '',
    pickUpLocationLatLng: null,
    pickUpLocationAddressData: null,
    dropOffLocation: '',
    dropOffLocationLatLng: null,
    dropOffLocationAddressData: null,
    dropOffLocationTwo: '',
    dropOffLocationTwoLatLng: null,
    dropOffLocationTwoAddressData: null,
    dropOffLocationThree: '',
    dropOffLocationThreeLatLng: null,
    dropOffLocationThreeAddressData: null,
    pickUpLocationFocus: true,
    dropOffLocationFocus: false,
    dropOffLocationTwoFocus: false,
    dropOffLocationThreeFocus: false,
    dot: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    suggestions: [],
    viewHeight: null,
    showDropOfTwo: false,
    showDropOfThree: false,
    pageNo: 1,
    limit: 5,
    pickUpVendors: [],
    allSavedAddress: [],
    selectedAddress: null,
    savedAddressViewHeight: 0,
    avalibleValueInTextInput: false,
    vendorId: null,
    isVisible: false,
    updateData: {},
    indicator: false,
    type: 'addAddress',
    del: false,
    searchResult: {},
    pickupLocationAddress: '',
    dropLocationAddress: '',
    dropLocationData: [
      {
        address: '',
        lat: 0,
        lng: 0
      },
      {
        address: '',
        lat: 0,
        lng: 0
      },
    ],
  });
  const {
    pickUpLocationAddressData,
    dropOffLocationAddressData,
    dropOffLocationTwoAddressData,
    dropOffLocationThreeAddressData,
    viewHeight,
    pickUpLocation,
    pickUpLocationLatLng,
    dropOffLocation,
    dropOffLocationTwo,
    dropOffLocationThree,
    pickUpLocationFocus,
    dropOffLocationFocus,
    dropOffLocationTwoFocus,
    dropOffLocationThreeFocus,
    dropOffLocationLatLng,
    dropOffLocationTwoLatLng,
    dropOffLocationThreeLatLng,
    dot,
    showDropOfTwo,
    showDropOfThree,
    suggestions,
    pageNo,
    limit,
    pickUpVendors,
    allSavedAddress,
    selectedAddress,
    savedAddressViewHeight,
    avalibleValueInTextInput,
    isVisible,
    updateData,
    indicator,
    type,
    del,
    searchResult,
    pickupLocationAddress,
    dropLocationAddress,
    dropLocationData
  } = state;

  useEffect(() => {
    if (
      paramData?.data?.pickuplocationAllData != undefined &&
      paramData?.data?.pickuplocationAllData[0]?.task_type_id === 1
    ) {
      updateState({
        pickUpLocation: paramData?.data.pickuplocationAllData[0]?.address,
        pickUpLocationLatLng: {
          latitude: paramData?.data.pickuplocationAllData[0]?.latitude,
          longitude: paramData?.data.pickuplocationAllData[0]?.longitude,
        },

        pickUpLocationAddressData: paramData?.data.pickuplocationAllData[0],
      });
    }
    if (
      paramData?.data?.pickuplocationAllData != undefined &&
      paramData?.data?.pickuplocationAllData[0]?.task_type_id === 2
    ) {
      updateState({
        dropOffLocation: paramData?.data.pickuplocationAllData[0]?.address,

        dropOffLocationLatLng: {
          latitude: paramData?.data.pickuplocationAllData[0]?.latitude,
          longitude: paramData?.data.pickuplocationAllData[0]?.longitude,
        },
        dropOffLocationAddressData: paramData?.data.pickuplocationAllData[0],
      });
    }

    if (!!(userData && userData?.auth_token)) {
      getAllAddress();
    }
  }, [paramData]);

  //get All address
  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        console.log(res, 'all address');
        // actions.saveAllUserAddress(res.data);
        updateState({
          allSavedAddress: res.data,
          isLoading: false,
          indicator: false,
        });
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  useEffect(() => {
    chekLocationPermission()
      .then((result) => {
        if (result === 'goback') {
          navigation.goBack();
        }
        Geocoder.init(profile?.preferences?.map_key, { language: 'en' }); // set the language
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const styles = stylesFun({
    fontFamily,
    themeColors,
    savedAddressViewHeight,
    avalibleValueInTextInput,
  });
  const commonStyles = commonStylesFun({ fontFamily });
  const { profile } = appData;

  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  useFocusEffect(
    React.useCallback(() => {
      getAllPickUpVendors();
    }, [pageNo]),
  );

  const getAllPickUpVendors = () => {
    actions
      .getDataByCategoryId(
        `/${paramData?.data?.id ? paramData?.data?.id : paramData?.cat?.id
        }?limit=${limit}&page=${pageNo}`,
        {},
        { code: appData?.profile?.code },
      )
      .then((res) => {
        console.log(res, 'res>>>>>');
        updateState({
          isLoading: false,
          isRefreshing: false,
          pickUpVendors:
            pageNo == 1
              ? res.data.listData.data
              : [...pickUpVendors, ...res.data.listData.data],
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({ isLoading: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };

  const _onFocus = (type) => {
    updateState({ [type]: true });
  };
  /*************************** On Text Change
   */ const addressHelper = (results) => {
    let clonedArrayData = { ...state };
    clonedArrayData = { ...clonedArrayData, ...results, showDialogBox: false };
    updateState(clonedArrayData);
  };

  const handleAddressOnKeyUp = (text, type) => {
    if (text == '') {
      updateState({ [type]: '', avalibleValueInTextInput: false });
    } else {
      updateState({ [type]: text, avalibleValueInTextInput: true });
    }
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: 'addAddress',
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const addUpdateLocation = (childData) => {
    //setModalVisible(false);

    updateState({ isLoading: true });

    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({ del: del ? false : true });
        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  const _setModalVisiblity = () => {
    updateState({
      isVisible: true,
    });
  };

  const _rendorCustomRow = (itm) => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 0.1,
            marginRight: 10,
            justifyContent: 'space-around',
          }}>
          <Image source={imagePath.locationRoundedBackground} />
        </View>
        <View
          style={{
            flex: 0.15,
          }}>
          <Text style={styles.address}>{itm.description}</Text>
        </View>
      </View>
    );
  };

  const updateTheAddress = (details, addressType, type) => {
    const address = details?.formatted_address || details?.address;
    let latlng = {
      latitude: details?.geometry?.location?.lat
        ? JSON.stringify(details?.geometry?.location?.lat)
        : details?.latitude,
      longitude: details?.geometry?.location?.lng
        ? JSON.stringify(details?.geometry?.location?.lng)
        : details?.longitude,
    };

    let addressData = details?.user_id ? details : getAddressComponent(details);

    let updatedAddress = {
      task_type_id: addressType == 'pickup' ? 1 : 2,
      post_code: addressData?.pincode,
      short_name: addressData?.states || addressData?.state,
      address: addressData?.address,
      latitude: details?.user_id
        ? addressData?.latitude
        : JSON.stringify(addressData?.latitude),
      longitude: details?.user_id
        ? addressData?.longitude
        : JSON.stringify(addressData?.longitude),
    };

    if (addressType == 'pickup') {
      updateState({
        pickUpLocation: address,
        pickUpLocationAddressData: updatedAddress,
        pickUpLocationLatLng: latlng,
        pickUpLocationFocus: false,
      });
      Keyboard.dismiss();
    }
    if (addressType == 'dropoff') {
      if (type == 'dropOffLocation') {
        updateState({
          dropOffLocation: address,
          dropOffLocationAddressData: updatedAddress,
          dropOffLocationLatLng: latlng,
          dropOffLocationFocus: false,
        });
        Keyboard.dismiss();
      }
      if (type == 'dropOffLocationTwo') {
        updateState({
          dropOffLocationTwo: address,
          dropOffLocationTwoAddressData: updatedAddress,
          dropOffLocationTwoLatLng: latlng,
          dropOffLocationTwoFocus: false,
          // showDropOfThree: true,
        });
        Keyboard.dismiss();
      }
      if (type == 'dropOffLocationThree') {
        updateState({
          dropOffLocationThree: address,
          dropOffLocationThreeAddressData: updatedAddress,
          dropOffLocationThreeLatLng: latlng,
          dropOffLocationThreeFocus: false,
        });
        Keyboard.dismiss();
      }
    }
  };

  useEffect(() => {
    updateTheAddress(
      paramData?.details,
      paramData?.addressType,
      paramData?.type,
    );
  }, [paramData?.type]);

  const _moveToNextScreen = (type) => {

    navigation.navigate(navigationStrings.PINADDRESSONMAP, {
      data: type,
      pickUpLocationLatLng: type === "pickup" ? pickUpLocationLatLng : dropOffLocationLatLng,
    });
  };
  const renderbtn = () => {
    switch (getBundleId()) {
      case appIds.yoho:
        return (
          <View
            style={{
              marginVertical: moderateScaleVertical(10),
              marginHorizontal: moderateScale(20),
              justifyContent: 'flex-end',
            }}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={{ textTransform: 'none', fontSize: textScale(16) }}
              onPress={saveAddressAndRedirect}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.DONE}
            />
          </View>
        );
      default:
        return (
          <View
            style={{
              marginVertical: moderateScaleVertical(10),
              marginHorizontal: moderateScale(20),
              justifyContent: 'flex-end',
            }}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={{ textTransform: 'none', fontSize: textScale(16) }}
              onPress={saveAddressAndRedirect}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.DONE}
            />
          </View>
        );
    }
  };
  const renderDotContainer = () => {
    return (
      <>
        <View style={{ height: 40, overflow: 'hidden', alignItems: 'center' }}>
          <View
            style={{
              height: 40,
              width: 0.5,
              backgroundColor: colors.textGreyLight,
            }}
          />
        </View>

        <Image
          style={{
            tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}
          source={imagePath.blackSquare}
        />
      </>
    );
  };
  const getHeight = () => {
    if (showDropOfTwo && showDropOfThree) {
      return 160;
    } else if (showDropOfTwo || showDropOfThree) {
      return 110;
    } else {
      return 60;
    }
  };

  const addRemoveAddress = (type) => {
    Keyboard.dismiss();
    if (type == 'dropOffLocation') {
      updateState({
        // dropOffLocation: '',
        // dropOffLocationLatLng: false,
        // dropOffLocationFocus: false,
        showDropOfTwo: true,
        savedAddressViewHeight: savedAddressViewHeight + 1,
      });
    }
    if (type == 'dropOffLocationTwo') {
      updateState({
        dropOffLocationTwo: '',
        dropOffLocationTwoLatLng: false,
        dropOffLocationTwoFocus: false,
        showDropOfTwo: false,
        savedAddressViewHeight: savedAddressViewHeight - 1,
      });
    }
    if (type == 'dropOffLocationThree') {
      updateState({
        dropOffLocationThree: '',
        dropOffLocationThreeLatLng: false,
        dropOffLocationThreeFocus: false,
        savedAddressViewHeight: savedAddressViewHeight - 1,
      });
    }
  };

  const renderCross = (type) => {
    return (
      <>
        <View
          style={{
            height: moderateScale(5),
            marginTop: moderateScaleVertical(10),
          }}
        />
        <TouchableOpacity
          //  onPress={() => addRemoveAddress(type)}
          onPress={() => _moveToNextScreen('drop')}
          style={{
            height: moderateScale(48),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{
              height: 25,
              width: 25,
            }}
            source={imagePath.blackNav}
          />
        </TouchableOpacity>
      </>
    );
  };

  const saveAddressAndRedirect = () => {
    if (pickUpLocationLatLng?.latitude == undefined) {
      showError(strings.PLEASE_SELECT_PICKUP_LOCATION);
    } else if (dropOffLocationLatLng?.latitude == undefined) {
      showError(strings.PLEASE_SELECT_DROP_OFF_LOCATION);
    } else {
      let location = [];
      let addressData = [];
      location.push(pickUpLocationLatLng);

      addressData.push(pickUpLocationAddressData);
      if (dropOffLocationLatLng) {
        location.push(dropOffLocationLatLng);
        addressData.push(dropOffLocationAddressData);
      }
      // if (dropOffLocationTwoLatLng) {
      //   location.push(dropOffLocationTwoLatLng);
      //   addressData.push(dropOffLocationTwoAddressData);
      // }
      console.log('here it goes');

      navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
        location: location,
        id: paramData?.data?.id,
        pickup_taxi: paramData?.data?.pickup_taxi,
        tasks: addressData,
        cabVendors: pickUpVendors,
        datetime: paramData?.datetime,
        pickUpTimeType: paramData?.pickUpTimeType,
      });
    }
  };

  const _redirectToMapScreen = (type, addressType) => {
    navigation.navigate(navigationStrings.SETLOACTIONMAP, {
      type: type,
      addressType: addressType,
    });
  };

  //All Saved address

  const selectAddress = (address) => {
    if (pickUpLocationFocus) {
      updateTheAddress(address, 'pickup', 'pickUpLocation');
    }
    if (dropOffLocationFocus) {
      updateTheAddress(address, 'dropoff', 'dropOffLocation');
    }
    if (dropOffLocationTwoFocus) {
      updateTheAddress(address, 'dropoff', 'dropOffLocationTwo');
    }
  };

  //address view tab
  const addressView = (image) => {
    return (
      allSavedAddress &&
      allSavedAddress.map((itm, inx) => {
        return (
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            style={{ width: width - 40 }}>
            <TouchableOpacity
              key={inx}
              style={{
                marginTop: moderateScaleVertical(10),
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                marginHorizontal: moderateScale(10),
              }}
              onPress={() => selectAddress(itm)}>
              <View>
                <Image source={image} />
              </View>
              <View style={{ marginHorizontal: moderateScale(10) }}>
                <Text numberOfLines={2} style={[styles.address]}>
                  {itm?.address}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        );
      })
    );
  };

  const updateAddress = (value) => {
    switch (searchResult?.inx) {
      case 0:
        updateState({ pickupLocationAddress: value, searchResult: [] })
        break;
      case 1:
        updateState({ dropLocationAddress: value, searchResult: [] })
        break;
      case 2:
        updateState({ pickupLocationAddress: value, searchResult: [] })
        break;
      case 3:
        updateState({ pickupLocationAddress: value, searchResult: [] })
        break;
      case 4:
        updateState({ pickupLocationAddress: value, searchResult: [] })
        break;
      default:
        break;
    }
  }

  const onPressAddress = async (place) => {
    console.log("selected item", place)
    // cloneArr[searchResult.currentIndex].address = place?.description
    if (place.place_id) {
      // updateAddress(place.description)
      let res = await getPlaceDetails(place.place_id, profile?.preferences?.map_key);
      console.log("res====>>>", res)
      const cloneArr = dropLocationData
      cloneArr[searchResult.currentIndex].lat = '0.02'
      cloneArr[searchResult.currentIndex].lng = '0.055'
      cloneArr[searchResult.currentIndex].address = place?.description
      updateState({ dropLocationData: cloneArr })
      console.log('res===', res)
    } else {
      alert('Place Id not found')
    }
  }

  const renderSearchItem = (item) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressAddress(item)}
        style={{ marginBottom: 16 }}
      >
        <Text>{item?.description}</Text>
      </TouchableOpacity>
    )
  }

  const addRemove = (isAddd) => {
    let x = []
    x.push({
      address: '',
      lat: 0,
      lng: 0
    })
    updateState({ dropLocationData: [...dropLocationData, ...x] })
  }

  const updateCurValues = (text, i) => {
    console.log("dropLocationData+++", dropLocationData[i])
    const cloneArr = dropLocationData
    cloneArr[i].address = text
    updateState({ dropLocationData: cloneArr })
  }
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}>

      <Header
        rightViewStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.greyColor,
          alignItems: 'center',
          paddingVertical: moderateScaleVertical(8),
          borderRadius: 14,
          flex: 0.15,
        }}
        leftIcon={imagePath.backArrowCourier}
        centerTitle={strings.ADD_ADDRESS}
        // rightIcon={imagePath.cartShop}
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          marginVertical: moderateScaleVertical(10),
          rightViewStyle: { backgroundColor: colors.greyColor },
        }}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"

        showsVerticalScrollIndicator={false}
        style={{
          flex: 1
        }}>
        <View style={{ flex: 1, marginHorizontal: moderateScale(16) }}>
          {/* <SearchPlaces
          placeHolder={strings.PICKUP_LOCATION}
          value={pickupLocationAddress} // instant update search value
          mapKey={profile?.preferences?.map_key} //send here google Key
          fetchArrayResult={(data) => updateState({ searchResult: { data: data, inx: 0 } })}
          setValue={text => updateState({ pickupLocationAddress: text })} //return & update on change text value
        /> */}
          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <SearchPlaces
              placeHolder={strings.DROPOFFLOCATION}
              value={dropLocationAddress} // instant update search value
              mapKey={profile?.preferences?.map_key} //send here google Key
              fetchArrayResult={(data) => updateState({ searchResult: { data: data, inx: 1 } })}
              setValue={text => updateState({ dropLocationAddress: text })} //return & update on change text value
            />
          </View>
          <View style={{ marginHorizontal: 8 }} />
          <TouchableOpacity style={{
            flex: 0.2
          }}
            onPress={() => addRemove(true)}
          >
            <Text>{'Add+'}</Text>
          </TouchableOpacity>
        </View> */}

          {dropLocationData.map((val, i) => {
            return (
              <View style={{ }}>
          
                  <SearchPlaces
                    placeHolder={i == 0 ? strings.PICKUP_LOCATION : strings.DROPOFFLOCATION}
                    value={val.address} // instant update search value
                    mapKey={profile?.preferences?.map_key} //send here google Key
                    fetchArrayResult={(data) => updateState({ searchResult: { data: data, currentIndex: i } })}
                    setValue={(text) => updateCurValues(text, i)} //return & update on change text value
                  />
           
            
                {/* {i >= 1 && (<TouchableOpacity style={{
                  flex: 0.2
                }}
                  onPress={() => addRemove(false, i)}
                >
                  <Text>{dropLocationData.length - 1 == i ? 'Add' : 'Mins'}</Text>
                </TouchableOpacity>)} */}
              </View>
            )
          })}


          {/* render search address results */}
          {!!searchResult?.data && searchResult?.data.map((item, i) => {
            return renderSearchItem(item)
          })}
        </View>
      </KeyboardAwareScrollView>
      {renderbtn()}
    </WrapperContainer>
  );
}
