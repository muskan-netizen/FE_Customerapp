import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, BackHandler, Linking} from 'react-native';
import AppLink from 'react-native-app-link';
import {useDarkMode} from 'react-native-dark-mode';
import DeviceInfo from 'react-native-device-info';
import Geocoder from 'react-native-geocoding';
import {useSelector} from 'react-redux';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {MyDarkTheme} from '../../styles/theme';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {
  androidBackButtonHandler,
  getCurrentLocation,
  getImageUrl,
  getNearestLocation,
  showError,
} from '../../utils/helperFunctions';
import {chekLocationPermission} from '../../utils/permissions';
import {
  DashBoardFive,
  DashBoardFour,
  DashBoardHeaderFive,
  DashBoardHeaderFour,
  DashBoardHeaderOne,
  DashBoardOne,
  DashBoardSix,
} from './DashboardViews/Index';
import Voice from '@react-native-voice/voice';
import FastImage from 'react-native-fast-image';

// navigator.geolocation = require('react-native-geolocation-service');

export default function Home({route, navigation}) {
  const paramData = route?.params;

  const {
    appData,
    currencies,
    languages,
    appStyle,
    isDineInSelected,
    themeColor,
    themeToggle,
    allAddresss,
  } = useSelector((state) => state?.initBoot);
  const {location, appMainData, dineInType} = useSelector(
    (state) => state?.home,
  );
  console.log(appMainData, 'appMainData>appMainData');
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const addressSearch = useSelector(
    (state) => state?.addressSearch.addressSearch,
  );
  const userData = useSelector((state) => state?.auth?.userData);
  const pendingNotifications = useSelector(
    (state) => state?.pendingNotifications?.pendingNotifications,
  );

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [state, setState] = useState({
    isLoading: true,
    isRefreshing: false,
    selectedTabType: '',
    updateTime: 0,
    isDineInSelected: false,
    pageActive: 1,
    currentLocation: '',
    saveAllUserAddress,
    isLoadingB: false,
    searchDataLoader: false,
    openVendor: 0,
    closeVendor: 0,
    bestSeller: 0,
    nearMe: 1,
    tempCartData: null,
    isVoiceRecord: false,
    singleVendor: false,
  });

  const {
    tempCartData,
    updateTime,
    isLoading,
    isRefreshing,
    selectedTabType,
    pageActive,
    currentLocation,
    saveAllUserAddress,
    isLoadingB,
    searchDataLoader,
    openVendor,
    closeVendor,
    bestSeller,
    nearMe,
    isVoiceRecord,
    singleVendor,
  } = state;

  const {profile} = appData;
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        androidBackButtonHandler,
      );
      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    updateState({updatedData: appMainData?.categories});
  }, [appMainData]);

  useEffect(() => {
    _getLocationFromParams();
    // if (addressSearch) {
    //   _getLocationFromParams();
    // }
  }, [paramData?.details]);

  useFocusEffect(
    useCallback(() => {
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []),
  );

  const _getLocationFromParams = () => {
    if (
      paramData?.details &&
      paramData?.details?.formatted_address != location?.address
    ) {
      const address = paramData?.details?.formatted_address;
      const res = {
        address: address,
        latitude: paramData?.details?.geometry?.location.lat,
        longitude: paramData?.details?.geometry?.location.lng,
      };
      if (
        res?.latitude != location?.latitude &&
        res?.longitude != location?.longitude
      ) {
        if (cartItemCount?.data?.item_count) {
          checkCartWithLatLang(res);
        } else {
          updateLatLang(res);
        }
      } else {
        updateLatLang(res);
      }
    }
  };

  const checkCartWithLatLang = (res) => {
    Alert.alert('', strings.THIS_WILL_REMOVE_CART, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      {text: strings.CLEAR_CART2, onPress: () => clearCart(res)},
    ]);
  };

  const clearCart = (location) => {
    updateLatLang(location);
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty(res);
        homeData(location);
      })
      .catch(errorMethod);
  };

  const updateLatLang = (res) => {
    updateState({updateTime: Math.random()});
    actions.locationData(res);
  };
  useEffect(() => {
    if (updateTime) {
      homeData();
    }
  }, [updateTime]);
  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
  }, []);

  useEffect(() => {
    chekLocationPermission(false)
      .then((result) => {
        if (result !== 'goback') {
          getCurrentLocation('home')
            .then((res) => {
              console.log(res, 'userCurrentLocation');
              actions.constLocationData(res);
              if (
                appMainData &&
                typeof appMainData?.reqData == 'object' &&
                appMainData?.reqData?.latitude &&
                (location?.latitude == '' || location?.longitude == '')
              ) {
                const data = {
                  address: appMainData?.reqData?.address,
                  latitude: appMainData?.reqData?.latitude,
                  longitude: appMainData?.reqData?.longitude,
                };
                actions.locationData(res);
              } else {
                if (!!appData?.profile?.preferences?.is_hyperlocal) {
                  if (!!userData?.auth_token && !paramData?.details) {
                    const nearestAddress = getNearestLocation(
                      res,
                      saveAllUserAddress,
                    );

                    if (!!nearestAddress) {
                      actions.locationData(nearestAddress);
                      // homeData(nearestAddress);
                      return;
                    } else {
                      actions.locationData(res);
                      return;
                    }
                  }
                  if (paramData?.details) {
                    // _getLocationFromParams();
                  } else {
                    actions.locationData(res);
                  }
                }
                return;
              }
            })
            .catch((err) => {});
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  }, [isRefreshing, userData?.auth_token, saveAllUserAddress]);

  useFocusEffect(
    useCallback(() => {
      // homeData();
      if (!!userData?.auth_token) {
        getAllAddress();
        getAllTempOrders();
      }
    }, []),
  );

  // useEffect(() => {
  //   homeData();
  // }, [appMainData]);

  //get All address
  const getAllAddress = () => {
    if (!!userData?.auth_token) {
      actions
        .getAddress(
          {},
          {
            code: appData?.profile?.code,
          },
        )
        .then((res) => {
          if (res.data) {
            actions.saveAllUserAddress(res.data);
            updateState({saveAllUserAddress: res?.data});
          }
        })
        .catch(errorMethod);
    }
  };

  const getAllTempOrders = () => {
    actions
      .getAllTempOrders(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        console.log('getAllTempOrders data++++++', res);
        if (res && res?.data) {
          updateState({
            tempCartData: res?.data,
          });
        }
      })
      .catch(errorMethod);
  };

  console.log('selectedTabTypeselectedTabType', selectedTabType);

  //Home data
  const homeData = (slectedLocatonFromPreviousScreen) => {
    console.log(slectedLocatonFromPreviousScreen,"slectedLocatonFromPreviousScreen>slectedLocatonFromPreviousScreen")
    if (!!paramData) {
      updateState({searchDataLoader: true});
    }
    let latlongObj = {};
    if (appData?.profile?.preferences?.is_hyperlocal) {
      latlongObj = {
        address: slectedLocatonFromPreviousScreen
          ? slectedLocatonFromPreviousScreen?.address
          : location?.address,
        latitude: slectedLocatonFromPreviousScreen
          ? slectedLocatonFromPreviousScreen?.latitude
          : location?.latitude,
        longitude: slectedLocatonFromPreviousScreen
          ? slectedLocatonFromPreviousScreen?.longitude
          : location?.longitude,
      };
    }
    let vendorFilterData = {
      close_vendor: closeVendor,
      open_vendor: openVendor,
      best_vendor: bestSeller,
      // near_me: nearMe,
    };
    console.log(vendorFilterData, 'vendorFilterData');

    if (closeVendor == 0 && openVendor == 0 && bestSeller == 0) {
      updateState({singleVendor: true});
    } else {
      updateState({singleVendor: false});
    }

    {
      selectedTabType
        ? actions
            .homeData(
              {
                type: dineInType ? dineInType : dineInType,
                ...latlongObj,
                ...vendorFilterData,
              },
              {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                // ...latlongObj,
              },
            )
            .then((res) => {
              console.log('Home data++++++', res);
              preLoadImages(res.data);
              updateState({searchDataLoader: false});
              if (
                appData?.profile?.preferences?.is_hyperlocal &&
                location?.latitude == '' &&
                location?.longitude == ''
              ) {
                if (
                  typeof res?.data?.reqData == 'object' &&
                  res?.data?.reqData?.latitude &&
                  res?.data?.reqData?.longitude
                ) {
                  const data = {
                    address: res?.data?.reqData?.address,
                    latitude: res?.data?.reqData?.latitude,
                    longitude: res?.data?.reqData?.longitude,
                  };

                  actions.locationData(data);
                }
              } else {
                if (
                  appData?.profile?.preferences?.is_hyperlocal &&
                  location?.latitude != '' &&
                  location?.longitude != ''
                ) {
                } else {
                  const data = {
                    address: '',
                    latitude: '',
                    longitude: '',
                  };
                  // actions.locationData(data);
                }
              }
              setTimeout(() => {
                updateState({
                  isLoading: false,
                  isLoadingB: false,
                  searchDataLoader: false,
                });
              }, 1000);
            })
            .catch(errorMethod)
        : null;
    }
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, 'erro>>>>>>errorerrorr');
    updateState({
      isLoading: false,
      isRefreshing: false,
      acceptLoader: false,
      rejectLoader: false,
      selectedOrder: null,
      isLoadingB: false,
      searchDataLoader: false,
    });
    showError(error?.message || error?.error);
  };

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const {viewRef2, viewRef3, bannerRef} = useRef();

  const preLoadImages = (data) => {
    if (data.categories.length > 0) {
      let preLoadCategories = data.categories.map((item, inx) => {
        return {
          uri: getImageUrl(
            item?.icon?.image_fit,
            item?.icon?.image_path,
            '160/160',
          ),
        };
      });
      FastImage.preload(preLoadCategories); //preload categories
    }
    if (data.vendors.length > 0) {
      let preLoadVendors = data.vendors.map((item, inx) => {
        return {
          uri: getImageUrl(
            item.banner.proxy_url || item.image.proxy_url,
            item.banner.image_path || item.image.image_path,
            '700/300',
          ),
        };
      });
      FastImage.preload(preLoadVendors); //preload vendors
    }
  };

  const openUber = () => {
    let appName = 'Uber - Easy affordable trips';
    let appStoreLocale = '';
    let playStoreId = 'com.ubercab';
    let appStoreId = '368677368';
    AppLink.maybeOpenURL('uber://', {
      appName: appName,
      appStoreId: appStoreId,
      appStoreLocale: appStoreLocale,
      playStoreId: playStoreId,
    })
      .then((res) => {})
      .catch((err) => {
        Linking.openURL('https://www.uber.com/in/en/');
        console.log('errro raised', err);
        // handle error
      });
  };

  //onPress Category
  const onPressCategory = (item) => {
    console.log(item, 'itemitem');

    if (item.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY ||
      item.redirect_to == staticStrings.ONDEMANDSERVICE ||
      item?.redirect_to == staticStrings.LAUNDRY
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        fetchOffers: true,
        id: item.id,
        vendor:
          item.redirect_to == staticStrings.ONDEMANDSERVICE
            ? false
            : item.redirect_to == staticStrings.PRODUCT
            ? false
            : true,
        name: item.name,
        isVendorList: false,
      })();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          // if (item?.warning_page_id) {
          //   if (item?.warning_page_id == 2) {
          //     moveToNewScreen(navigationStrings.DELIVERY, item)();
          //   } else {
          //     moveToNewScreen(navigationStrings.HOMESCREENCOURIER, item)();
          //   }
          // } else {
          //   if (item?.template_type_id == 1) {
          //     moveToNewScreen(navigationStrings.SEND_PRODUCT, item)();
          //   } else {
          //     item['pickup_taxi'] = true;

          //     // moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
          //     moveToNewScreen(navigationStrings.HOMESCREENTAXI, item)();
          //   }
          // }
          item['pickup_taxi'] = true;
          // moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        // showError(strings.UNAUTHORIZED_MESSAGE);
        moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
      }
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, item)();
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    } else if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item?.id,
            vendor: true,
            name: item?.name,
            isVendorList: true,
            fetchOffers: true,
          })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };
  useEffect(() => {
    console.log(saveAllUserAddress, 'saveAllUserAddress');
    homeData();
  }, [location, bestSeller, openVendor, closeVendor]);

  //On Press banner
  const bannerPress = (data) => {
    console.log('data', data);
    // return;

    let item = {};
    if (data?.redirect_id) {
      if (data?.redirect_to == staticStrings.VENDOR && data?.is_show_category) {
        moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: data.redirect_id,
          vendor: true,
          name: data.redirect_name,
          fetchOffers: true,
        })();
        return;
      }
      if (data?.redirect_to == staticStrings.VENDOR) {
        item = {
          ...data?.vendor,
          redirect_to: data.redirect_to,
        };
      } else {
        item = {
          id: data.redirect_id,
          redirect_to: data.redirect_to,
          name: data.redirect_name,
        };
      }

      if (data.redirect_to == staticStrings.VENDOR) {
        data?.is_show_category
          ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
              item,
              rootProducts: true,
              // categoryData: data,
            })()
          : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
      } else if (data.redirect_to == staticStrings.CATEGORY) {
        if (data?.category?.type?.title == staticStrings.VENDOR) {
          let dat2 = data;
          dat2['id'] = data?.redirect_id;
          moveToNewScreen(navigationStrings.VENDOR, dat2)();
        } else {
          if (data?.category?.type?.title == staticStrings.PRODUCT) {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
            // let dat2 = data;
            // dat2['id'] = data?.redirect_id;
            // moveToNewScreen(navigationStrings.VENDOR, dat2)();
          } else
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
        }
      }
    }
  };

  //Reloads the screen
  const initApiHit = () => {
    let header = {};
    header = {
      code: appData?.profile?.code,
      language: languages?.primary_language?.id,
    };

    actions
      .initApp(
        {},
        header,
        true,
        currencies?.primary_currency,
        languages?.primary_language,
      )
      .then((res) => {
        console.log(res, 'initApp');
        updateState({isRefreshing: false});
      })
      .catch((error) => {
        updateState({isRefreshing: false});
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({isRefreshing: true});
    initApiHit();
    // homeData();
  };
  const updateCircleData = (data) => {
    updateState({updatedData: data});
  };

  const selcetedToggle = (type) => {
    actions.dineInData(type);
    if (dineInType != type) {
      {
        updateState({
          selectedTabType: type,
          isLoadingB: true,
        });
      }
    } else {
      updateState({
        selectedTabType: type,
      });
    }
  };

  useEffect(() => {
    homeData();
  }, [selectedTabType, appData, dineInType]);
  // location

  ///onPressCategory2
  const onPressCategory2 = (data) => {
    if (data.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, data)();
    } else if (
      data.redirect_to == staticStrings.PRODUCT ||
      data.redirect_to == staticStrings.CATEGORY
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, data)();
    } else if (data.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (data?.warning_page_id) {
          if (data?.warning_page_id == 2) {
            moveToNewScreen(navigationStrings.DELIVERY, data)();
          } else {
            moveToNewScreen(navigationStrings.HOMESCREENCOURIER, data)();
          }
        } else {
          if (data?.template_type_id == 1) {
            moveToNewScreen(navigationStrings.SEND_PRODUCT, data)();
          } else {
            moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, data)();
          }
        }
      } else {
        // showError(strings.UNAUTHORIZED_MESSAGE);
        moveToNewScreen(navigationStrings.OUTER_SCREEN, {})();
      }
    } else if (data.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, data)();
    } else if (data.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (data.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.BRANDS)();
    } else if (data.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, data)();

      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {data})();
    } else if (!data.is_show_category || data.is_show_category) {
      let item = data;
      data?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: data?.id,
            vendor: true,
            name: data?.name,
            fetchOffers: true,
          })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const onVendorFilterSeletion = (selectedFilter) => {
    console.log('Selected filter', selectedFilter);
    switch (selectedFilter?.id) {
      case 1:
        updateState({
          isLoadingB: true,
          openVendor: 1,
          closeVendor: 0,
          bestSeller: 0,
          nearMe: 0,
        });
        break;
      case 2:
        updateState({
          isLoadingB: true,
          openVendor: 0,
          closeVendor: 1,
          bestSeller: 0,
          nearMe: 0,
        });
        break;
      case 3:
        updateState({
          isLoadingB: true,
          openVendor: 0,
          closeVendor: 0,
          bestSeller: 1,
          nearMe: 0,
        });
        break;
      case 4:
        updateState({
          isLoadingB: true,
          openVendor: 0,
          closeVendor: 0,
          bestSeller: 0,
          nearMe: 1,
        });
        break;
      default:
        break;
    }
  };

  const onSpeechStartHandler = (e) => {};
  const onSpeechEndHandler = (e) => {
    updateState({
      isVoiceRecord: false,
    });
  };

  const onSpeechResultsHandler = (e) => {
    let text = e.value[0];
    console.log(text, 'text>>>');
    moveToNewScreen(navigationStrings.SEARCHPRODUCTOVENDOR, {
      voiceInput: text,
    })();
    _onVoiceStop();
  };

  const _onVoiceListen = async () => {
    const langType = languages?.primary_language?.sort_code;
    updateState({
      isVoiceRecord: true,
    });
    try {
      await Voice.start(langType);
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const _onVoiceStop = async () => {
    updateState({
      isVoiceRecord: false,
    });
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const renderHomeScreen = () => {
    const case_ = 5;
    // alert(appStyle?.homePageLayout)
    switch (appStyle?.homePageLayout) {
      // switch (case_) {
      case 1:
        return (
          <>
            <DashBoardHeaderOne navigation={navigation} location={location} />
            <DashBoardOne
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              tempCartData={tempCartData}
              onPressCategory={(item) => onPressCategory(item)}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              navigation={navigation}
            />
          </>
        );

      case 2:
        return (
          <>
            <DashBoardHeaderOne navigation={navigation} location={location} />
            <DashBoardFour
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => {
                onPressCategory(item);
              }}
              tempCartData={tempCartData}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              navigation={navigation}
            />
          </>
        );
      case 3:
        return (
          <>
            <DashBoardHeaderFive
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
            />

            <DashBoardFive
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => {
                onPressCategory(item);
              }}
              isDineInSelected={isDineInSelected}
              selcetedToggle={selcetedToggle}
              tempCartData={tempCartData}
              toggleData={appData}
              navigation={navigation}
              onVendorFilterSeletion={onVendorFilterSeletion}
              singleVendor={singleVendor}
            />
          </>
        );

      case 4:
        return (
          <>
            <DashBoardHeaderFour
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
            />

            <DashBoardSix
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => {
                onPressCategory(item);
              }}
              tempCartData={tempCartData}
              isDineInSelected={isDineInSelected}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              navigation={navigation}
            />
          </>
        );

      case 5:
        return (
          <>
            <DashBoardHeaderFive
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
            />

            <DashBoardFive
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => {
                onPressCategory(item);
              }}
              isDineInSelected={isDineInSelected}
              selcetedToggle={selcetedToggle}
              tempCartData={tempCartData}
              toggleData={appData}
              navigation={navigation}
              onVendorFilterSeletion={onVendorFilterSeletion}
              singleVendor={singleVendor}
            />
          </>
        );
    }
  };

  useEffect(() => {
    if (!!userData?.auth_token) {
      (async () => {
        try {
          const res = await actions.allPendingOrders(
            `?limit=${10}&page=${pageActive}`,
            {},
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              // systemuser: DeviceInfo.getUniqueId(),
            },
          );
          console.log('pending res==>>>', res.data.order_list);
          let orders =
            pageActive == 1
              ? res.data.order_list.data
              : [...pendingNotifications, ...res.data.order_list.data];
          actions.pendingNotifications(orders);
        } catch (error) {
          console.log('erro rirased', error);
        }
      })();
    }
  }, []);
  // console.log(appMainData, 'appMainData');

  const {blurRef} = useRef();
  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      isLoading={searchDataLoader}>
      {/* <View style={{flex: 1}}>{}</View> */}
      <>{renderHomeScreen()}</>
    </WrapperContainer>
  );
}
