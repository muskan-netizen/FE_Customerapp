import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import { getBundleId } from 'react-native-device-info';
import Geocoder from 'react-native-geocoding';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import SearchPlaces from '../../../Components/SearchPlaces';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang/index';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { getCurrentLocationFromApi, getPlaceDetails, nearbySearch } from '../../../utils/googlePlaceApi';
import {
  getAddressComponent,
  showError,
  showSuccess
} from '../../../utils/helperFunctions';
import { chekLocationPermission, locationPermission } from '../../../utils/permissions';
import stylesFun from './styles';


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
    searchResult: {
      currentIndex: 0,
      data: []
    },
    pickupLocationAddress: '',
    dropLocationAddress: '',
    curLatLng: {
      latitude: 30.7333,
      longitude: 76.7794
    },
    dropLocationData: [
      {
        pre_address: '',
        address: '',
        latitude: 0,
        longitude: 0
      },
      {
        pre_address: '',
        address: '',
        latitude: 0,
        longitude: 0
      },
    ],
    nearByAddressess: []
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
    dropLocationData,
    nearByAddressess,
    curLatLng
  } = state;

  useEffect(() => {
    if (!!paramData?.data) {
      console.log("param data address", paramData)
      const { data } = paramData
      const cloneArr = dropLocationData
      cloneArr[searchResult.currentIndex].pre_address = data?.address
      cloneArr[searchResult.currentIndex].latitude = data?.latitude
      cloneArr[searchResult.currentIndex].longitude = data?.longitude
      cloneArr[searchResult.currentIndex].task_type_id = data.task_type_id
      // cloneArr[searchResult.currentIndex].post_code = addressData?.pincode
      // cloneArr[searchResult.currentIndex].short_name = addressData?.states || addressData?.state
      cloneArr[searchResult?.currentIndex].address = data?.address
      updateState({ dropLocationData: cloneArr, searchResult: { currentIndex: searchResult.currentIndex, data: [] } })
      console.log("clone array result", cloneArr)
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

  // useEffect(() => {
  //   updateTheAddress(
  //     paramData?.details,
  //     paramData?.addressType,
  //     paramData?.type,
  //   );
  // }, [paramData?.type]);

  const _moveToNextScreen = (updateIndex) => {
    let existLatLng = {
      latitude: dropLocationData[updateIndex]?.latitude || 0,
      longitude: dropLocationData[updateIndex]?.longitude || 0
    }
    updateState({ searchResult: { ...searchResult, currentIndex: updateIndex } })
    navigation.navigate(navigationStrings.PINADDRESSONMAP, {
      task_id: updateIndex,
      pickUpLocationLatLng: existLatLng?.latitude !== 0 ? existLatLng : curLatLng
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
    let location = []
    console.log('here it goes', dropLocationData);

    if (dropLocationData[0].address == '') {
      showError(strings.PLEASE_SELECT_PICKUP_LOCATION);
      return;
    }
    if (dropLocationData[1].address == '') {
      showError(strings.PLEASE_SELECT_DROP_OFF_LOCATION);
      return;
    }

    dropLocationData.map((val) => {
      location.push({
        latitude: val.latitude,
        longitude: val.longitude
      })
    })


    // return;

    navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
      location: location,
      id: paramData?.data?.id,
      pickup_taxi: paramData?.data?.pickup_taxi,
      tasks: dropLocationData,
      cabVendors: pickUpVendors,
      datetime: paramData?.datetime,
      pickUpTimeType: paramData?.pickUpTimeType,
    });

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


  useEffect(() => {
    getLiveLocation()
  }, [])


  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission()
    if (locPermissionDenied) {
      const { latitude, longitude } = await getCurrentLocationFromApi()
      // console.log("get live location after 4 second")
      updateState({
        curLatLng: {
          latitude,
          longitude
        }
      })
      getNearByAddress(`${latitude}, ${longitude}`)

    }
  }

  const getNearByAddress = async (latlng) => {
    try {
      const res = await nearbySearch(latlng, profile?.preferences?.map_key)
      console.log("nearby search res+++++", res.results)
      updateState({
        nearByAddressess: res.results
      })
    } catch (error) {
      console.log("error raised", error)
    }
  }

  const renderAddressess = (item) => {
    return (
      <TouchableOpacity
        style={{
          // marginTop: moderateScaleVertical(10),
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: moderateScale(10),
          borderBottomWidth: 0.5,
          marginBottom: moderateScaleVertical(4),
          borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.lightGreyBg
        }}
        onPress={() => onPressAddress({
          place_id: item.place_id,
          description: item.vicinity,
        })}
      >
        <View style={{ flex: 0.12 }}>
          <Image source={imagePath.RecentLocationImage} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Text numberOfLines={2} style={{
            fontSize: textScale(12),
            color: colors.textGreyJ,
            fontFamily: fontFamily.regular,
            lineHeight: moderateScaleVertical(20),
          }}>
            {item?.vicinity}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

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



  const onPressAddress = async (place) => {
    console.log("selected item", place?.description)
    // return;
    if (!!place.place_id && !!place?.description) {
      // updateAddress(place.description)
      const cloneArr = dropLocationData
      cloneArr[searchResult.currentIndex].pre_address = place?.description
      updateState({ dropLocationData: cloneArr })
      try {
        let res = await getPlaceDetails(place.place_id, profile?.preferences?.map_key);
        const { result } = res
        console.log('res===', result)
        let addressData = getAddressComponent(result);
        cloneArr[searchResult.currentIndex].latitude = result.geometry.location.lat
        cloneArr[searchResult.currentIndex].longitude = result.geometry.location.lng
        cloneArr[searchResult.currentIndex].task_type_id = searchResult.currentIndex + 1
        cloneArr[searchResult.currentIndex].post_code = addressData?.pincode
        cloneArr[searchResult.currentIndex].short_name = addressData?.states || addressData?.state
        cloneArr[searchResult?.currentIndex].address = result?.formatted_address
        updateState({ dropLocationData: cloneArr, searchResult: { currentIndex: searchResult.currentIndex, data: [] } })

      } catch (error) {
        console.log("something wen't wrong")
      }
    } else {
      alert('Place Id not found')
    }
  }

  console.log('dropLocationData', dropLocationData)

  const renderSearchItem = (item) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: moderateScale(10),
          borderBottomWidth: 0.5,
          marginBottom: moderateScaleVertical(4),
          borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.lightGreyBg
        }}
        onPress={() => onPressAddress(item)}
      >
        <View style={{ flex: 0.15 }}>
          <Image source={imagePath.RecentLocationImage} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Text numberOfLines={2} style={{
            fontSize: textScale(12),
            color: colors.textGreyJ,
            fontFamily: fontFamily.regular,
            lineHeight: moderateScaleVertical(20),
          }}>
            {item?.description}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const addRemove = (isAddd, inx) => {
    if (!isAddd) {
      let cloneArr = dropLocationData
      let removeItem = cloneArr.filter((item, i) => {
        if (i !== inx) {
          return item
        }
      });
      updateState({ dropLocationData: removeItem })
      return;
    }

    let isFill = true
    if (dropLocationData.length > 5) {
      return;
    }
    dropLocationData.map((val) => {
      if (val.latitude == 0) {
        isFill = false
      }
    })

    if (isFill) {
      if (isAddd) {
        let x = []
        x.push({
          address: '',
          latitude: 0,
          longitude: 0
        })
        isFill = true
        updateState({ dropLocationData: [...dropLocationData, ...x] })
      }
    } else {
      alert("pleas fill exist address")
    }
  }

  const updateCurValues = (text, i) => {
    console.log("dropLocationData+++", dropLocationData[i])
    const cloneArr = dropLocationData
    cloneArr[i].pre_address = text
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
        centerTitle={'Select Locations'}
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
        <View style={{ flex: 1 }}>


          <View style={{
            ...commonStyles.shadowStyle,
            backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white,
          }}>
            {dropLocationData.map((val, i) => {
              return (
                <View style={{
                  flexDirection: 'row',
                  marginHorizontal: 16,
                  alignItems: 'center',
                  marginBottom: moderateScale(8),
                }}>
                  <View style={{
                    flex: 0.9
                  }}>
                    <SearchPlaces
                      autoFocus={i == 0 ? true : false}
                      placeHolder={i == 0 ? strings.PICKUP_LOCATION : 'Where to?'}
                      value={val.pre_address} // instant update search value
                      mapKey={profile?.preferences?.map_key} //send here google Key
                      fetchArrayResult={(data) => updateState({ searchResult: { data: data, currentIndex: i } })}
                      setValue={(text) => updateCurValues(text, i)} //return & update on change text value
                      onFocus={() => updateState({ searchResult: { ...searchResult, currentIndex: i } })}
                      _moveToNextScreen={() => _moveToNextScreen(i)}
                    />

                  </View>
                  <View style={{ marginHorizontal: moderateScale(8) }} />
                  <View style={{
                    flex: 0.1
                  }}>
                    {i >= 1 && (<TouchableOpacity style={{

                    }}
                      onPress={() => addRemove(dropLocationData.length - 1 == i ? true : false, i)}
                    >
                      <Text>{dropLocationData.length - 1 == i ? 'Add' : 'Mins'}</Text>
                    </TouchableOpacity>)}
                  </View>
                </View>
              )
            })}

          </View>

          {!!searchResult?.data && searchResult?.data.length > 0 ?
            <View style={{
              marginTop: moderateScaleVertical(16),
            }}>
              <View style={{ ...styles.savedAddressView }}>
                <Image
                  style={{ marginHorizontal: moderateScale(12) }}
                  source={imagePath.starRoundedBackground}
                />
                <Text
                  numberOfLines={1}
                  style={
                    isDarkMode
                      ? [
                        styles.addresssLableName,
                        { color: MyDarkTheme.colors.text },
                      ]
                      : styles.addresssLableName
                  }>
                  {'Search Results'}
                </Text>
              </View>
              {searchResult?.data.map((item, i) => {
                return renderSearchItem(item)
              })}
            </View>
            :
            <View style={{ marginTop: moderateScaleVertical(16) }}>
              <View style={{
                ...styles.savedAddressView
              }}>
                <Image
                  style={{ marginHorizontal: moderateScale(12) }}
                  source={imagePath.starRoundedBackground}
                />
                <Text
                  numberOfLines={1}
                  style={
                    isDarkMode
                      ? [
                        styles.addresssLableName,
                        { color: MyDarkTheme.colors.text },
                      ]
                      : styles.addresssLableName
                  }>
                  {'Nearby Locations'}
                </Text>
              </View>

              {nearByAddressess.slice(0, 5).map((val) => {
                return renderAddressess(val)
              })}
            </View>
          }
        </View>
      </KeyboardAwareScrollView>
      {renderbtn()}
    </WrapperContainer>
  );
}
