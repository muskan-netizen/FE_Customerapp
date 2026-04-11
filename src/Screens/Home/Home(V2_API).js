import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Image,
  InteractionManager,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Geocoder from 'react-native-geocoding';
import { useDispatch, useSelector } from 'react-redux';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import types from '../../redux/types';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import { appIds } from '../../utils/constants/DynamicAppKeys';

import Voice from '@react-native-voice/voice';

import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import Animated, {
  FadeIn,
  useAnimatedScrollHandler,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { enableFreeze } from 'react-native-screens';
import imagePath from '../../constants/imagePath';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {
  androidBackButtonHandler,
  getCurrentLocation,
  getImageUrl,
  getNearestLocation,
  showError,
} from '../../utils/helperFunctions';
import { openBrowser } from '../../utils/openNativeApp';
import { chekLocationPermission, requestRecordAudioPermission } from '../../utils/permissions';
import socketServices from '../../utils/scoketService';
import { getColorSchema, getItem, setItem } from '../../utils/utils';
import fontFamily from '../../styles/fontFamily';

enableFreeze(true);

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HOME_CACHE_PREFIX = 'home_v2_cache';

export default function Home({ route, navigation }) {
  const paramData = route?.params;
  const dispatch = useDispatch();
  const {
    appData,
    currencies,
    languages,
    appStyle,
    isDineInSelected,
    themeColor,
    themeToggle,
    allAddresss,
    themeColors,
  } = useSelector(state => state?.initBoot);
  const { location, appMainData, dineInType, isLocationSearched, priceType, isSubscription } = useSelector(
    state => state?.home || {},
  );

  const isFocused = useIsFocused();
  const animation = useSharedValue(0);
  const { cartItemCount } = useSelector(state => state?.cart);
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(insets.top + 60);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [shouldMountDeferredUi, setShouldMountDeferredUi] = useState(false);
  const homeRequestKeyRef = React.useRef('');
  const latestHomeRequestIdRef = React.useRef(0);
  const lastBootstrapSignatureRef = React.useRef('');
  const lastLocationResolutionSignatureRef = React.useRef('');
  const hasRestoredCacheRef = React.useRef(false);

  const _isScrolledRef = React.useRef(false);
  const updateHeaderScroll = React.useCallback((y) => {
    const shouldScroll = y > 40;
    if (shouldScroll !== _isScrolledRef.current) {
      _isScrolledRef.current = shouldScroll;
      setIsHeaderScrolled(shouldScroll);
    }
  }, []);


  const { userData } = useSelector(state => state?.auth);
  const [nearestLocDis, setNearestLocDis] = useState(null);
  const { pendingNotifications } = useSelector(
    state => state?.pendingNotifications || {},
  );

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [isLaundryAddonModal, setLaundryAddonModal] = useState(false);
  const [isLoadingAddons, setLoadingAddons] = useState(true);
  const [selectedLaundryCategory, setSelectedLaundryCategory] = useState({});
  const [esitmatedLaundryProducts, setEsitmatedLaundryProducts] = useState([]);
  const [minMaxError, setMinMaxError] = useState([]);
  const [isOnPressed, setIsOnPressed] = useState(false);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState({});
  const [ispriceTypeModal, setIsPriceTypeModal] = useState(false);

  // AI chat moved into AIChat component

  const [state, setState] = useState({
    isLoading: true,
    isRefreshing: false,
    selectedTabType: '',
    updateTime: 0,
    isDineInSelected: false,
    pageActive: 1,
    currentLocation: '',
    saveAllUserAddress: null,
    isLoadingB: false,
    searchDataLoader: false,
    openVendor: 0,
    closeVendor: 0,
    bestSeller: 0,
    tempCartData: null,
    isVoiceRecord: false,
    singleVendor: false,
    selectedAddonSet: [],
    unPresentAry: [],
    stopOrderModalVisible: true,
    selectedFilterType: {},
  });

  const {
    tempCartData,
    isLoading,
    isRefreshing,
    selectedTabType,
    pageActive,
    currentLocation,
    isLoadingB,
    searchDataLoader,
    openVendor,
    closeVendor,
    bestSeller,
    selectedFilterType,
    isVoiceRecord,
    singleVendor,
    selectedAddonSet,
    unPresentAry,
    stopOrderModalVisible,
  } = state;
  const { profile } = appData;
  const hasHomeData = !!appMainData?.homePageLabels?.length;

  const hasValidCoordinates = useCallback((loc = {}) => {
    return (
      loc?.latitude !== '' &&
      loc?.longitude !== '' &&
      loc?.latitude != null &&
      loc?.longitude != null
    );
  }, []);

  const getLocationSignature = useCallback(
    (loc = {}) => {
      if (!hasValidCoordinates(loc)) {
        return 'no-location';
      }

      return [
        Number(loc?.latitude).toFixed(4),
        Number(loc?.longitude).toFixed(4),
      ].join(':');
    },
    [hasValidCoordinates],
  );

  const getDefaultLocationData = useCallback(() => {
    if (
      appData?.profile?.preferences?.is_hyperlocal ||
      dineInType == 'p2p'
    ) {
      const data = {
        address: appData?.profile?.preferences?.Default_location_name,
        latitude: appData?.profile?.preferences?.Default_latitude,
        longitude: appData?.profile?.preferences?.Default_longitude,
      };

      return hasValidCoordinates(data) ? data : null;
    }

    return null;
  }, [
    appData?.profile?.preferences?.Default_latitude,
    appData?.profile?.preferences?.Default_location_name,
    appData?.profile?.preferences?.Default_longitude,
    appData?.profile?.preferences?.is_hyperlocal,
    dineInType,
    hasValidCoordinates,
  ]);

  const getBestAvailableLocation = useCallback(() => {
    if (hasValidCoordinates(location)) {
      return location;
    }

    return getDefaultLocationData();
  }, [getDefaultLocationData, hasValidCoordinates, location]);

  const getResolvedVendorType = useCallback(() => {
    let selectedVendorType = null;
    let defaultVendorType = null;

    if (!!appData?.profile && appData?.profile?.preferences?.vendorMode) {
      defaultVendorType = appData?.profile?.preferences?.vendorMode[0]?.type;
      appData?.profile?.preferences?.vendorMode.forEach((val) => {
        if (val?.type == dineInType) {
          selectedVendorType = val.type;
        }
      });
    }

    if (!selectedVendorType && defaultVendorType) {
      actions.dineInData(defaultVendorType);
    }

    return selectedVendorType || defaultVendorType;
  }, [appData?.profile, dineInType]);

  const getHomeCacheKey = useCallback(
    (locationData = null) => {
      const resolvedLocation = locationData || getBestAvailableLocation() || {};

      return [
        HOME_CACHE_PREFIX,
        appData?.profile?.code || 'app',
        getResolvedVendorType() || 'default',
        priceType || 'vendor',
        getLocationSignature(resolvedLocation),
      ].join(':');
    },
    [
      appData?.profile?.code,
      getBestAvailableLocation,
      getLocationSignature,
      getResolvedVendorType,
      priceType,
    ],
  );

  const restoreHomeCache = useCallback(
    async (locationData = null) => {
      if (hasRestoredCacheRef.current || hasHomeData) {
        return;
      }

      const cacheKey = getHomeCacheKey(locationData);
      const cachedHomeData = await getItem(cacheKey);

      if (cachedHomeData?.data?.homePageLabels?.length) {
        hasRestoredCacheRef.current = true;
        dispatch({
          type: types.HOME_DATA,
          payload: cachedHomeData.data,
        });
        updateState({
          isLoading: false,
          isRefreshing: false,
          searchDataLoader: false,
        });
      }
    },
    [dispatch, getHomeCacheKey, hasHomeData],
  );

  useLayoutEffect(() => {
    Geocoder.init(
      Platform.OS == 'ios'
        ? profile?.preferences?.map_key_for_ios_app ||
        profile?.preferences?.map_key
        : profile?.preferences?.map_key_for_app ||
        profile?.preferences?.map_key,
      { language: 'en' },
    ); // set the language
  }, []);

  useEffect(() => {
    if (!!userData?.auth_token && !!appData?.profile?.socket_url) {
      socketServices.initializeSocket(appData?.profile?.socket_url);
    }
  }, [appData]);

  useEffect(() => {
    const deferredUiTask = InteractionManager.runAfterInteractions(() => {
      setShouldMountDeferredUi(true);
    });

    return () => {
      deferredUiTask.cancel();
    };
  }, []);

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
    if (
      paramData?.details &&
      paramData?.details?.formatted_address != location?.address
    ) {
      _getLocationFromParams();
      updateState({
        selectedFilterType: {},
      });
    }
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

  useFocusEffect(
    useCallback(() => {
      if (!!userData?.auth_token) {
        getAllTempOrders();
      }
    }, [userData?.auth_token]),
  );

  const _getLocationFromParams = () => {
    actions.isLocationSearched(true);
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
  };

  const checkCartWithLatLang = res => {
    Alert.alert('', strings.THIS_WILL_REMOVE_CART, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart(res) },
    ]);
  };

  const clearCart = location => {
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
      .then(res => {
        actions.cartItemQty(res);
        homeData(location);
      })
      .catch(errorMethod);
  };

  const updateLatLang = res => {
    actions.locationData(res);
    homeData(res);
  };

  //get All address
  const getAllAddress = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await actions.getAddress({}, { code: appData?.profile?.code });
        if (!!res?.data) {
          resolve(res.data);
        } else {
          resolve(res);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const getAllTempOrders = () => {
    actions
      .getAllTempOrders(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then(res => {
        if (res && res?.data) {
          updateState({
            tempCartData: res?.data,
          });
        }
      })
      .catch(errorMethod);
  };

  //Home data
  const homeData = async (
    locationData = null,
    selectedFilter = null,
    options = {},
  ) => {
    const { force = false } = options;

    if (!isFocused) {
      updateState({ isLoading: false });
      return;
    }
    if (!!paramData) {
      updateState({ searchDataLoader: true });
    }
    let latlongObj = {};

    if (!!locationData) {
      latlongObj = {
        address: locationData?.address || '',
        latitude: locationData?.latitude || '',
        longitude: locationData?.longitude || '',
      };
    }

    let vendorFilterData = {
      open_close_vendor: selectedFilter?.id == 2 ? 1 : 0,
    };
    if (closeVendor == 0 && openVendor == 0 && bestSeller == 0) {
      updateState({ singleVendor: true });
    } else {
      updateState({ singleVendor: false });
    }

    let vendorType = getResolvedVendorType();
    let apiData = {
      type: vendorType,
      ...latlongObj,
      ...vendorFilterData,
      action: '2',
    };

    let apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      freelancer: priceType === 'freelancer' ? 1 : 0,
    };

    const requestKey = JSON.stringify({
      type: vendorType,
      lat: apiData?.latitude || '',
      lng: apiData?.longitude || '',
      address: apiData?.address || '',
      open_close_vendor: apiData?.open_close_vendor || 0,
      freelancer: apiHeader?.freelancer || 0,
    });

    if (!force && homeRequestKeyRef.current === requestKey) {
      updateState({
        isLoading: false,
        isRefreshing: false,
        searchDataLoader: false,
      });
      return;
    }

    homeRequestKeyRef.current = requestKey;
    const requestId = latestHomeRequestIdRef.current + 1;
    latestHomeRequestIdRef.current = requestId;

    console.log('sending api data header', apiData);
    actions
      .homeDataV2(apiData, apiHeader)
      .then(async res => {
        if (requestId !== latestHomeRequestIdRef.current) {
          return;
        }

        console.log('Home data++++++', res);
        updateState({ searchDataLoader: false, isRefreshing: false });
        const checkLayout = res?.data?.homePageLabels || [];
        const filterCat = checkLayout.find(
          layout => layout?.slug == 'nav_categories',
        );
        preLoadImages(filterCat);

        if (
          (appData?.profile?.preferences?.is_hyperlocal ||
            dineInType == 'p2p') &&
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
        }

        setItem(getHomeCacheKey(locationData), {
          data: res?.data,
          updatedAt: Date.now(),
        });

        updateState({
          isLoading: false,
          isLoadingB: false,
          searchDataLoader: false,
        });
      })
      .catch(error => {
        if (requestId !== latestHomeRequestIdRef.current) {
          return;
        }

        errorMethod(error);
      });
  };

  useEffect(() => {
    if (!appData?.profile?.code) {
      return;
    }

    const fallbackLocation = getBestAvailableLocation();
    const bootstrapSignature = [
      selectedTabType || 'default-tab',
      allAddresss?.length || 0,
      dineInType || 'delivery',
      priceType || 'vendor',
      getLocationSignature(fallbackLocation),
      isLocationSearched ? 'searched' : 'auto',
    ].join(':');

    if (lastBootstrapSignatureRef.current === bootstrapSignature) {
      return;
    }

    lastBootstrapSignatureRef.current = bootstrapSignature;
    restoreHomeCache(fallbackLocation);

    if (fallbackLocation) {
      homeData(fallbackLocation);
    }

    const locationResolutionSignature = [
      selectedTabType || 'default-tab',
      allAddresss?.length || 0,
      dineInType || 'delivery',
      priceType || 'vendor',
      isLocationSearched ? 'searched' : 'auto',
      !!userData?.auth_token ? 'auth' : 'guest',
    ].join(':');

    if (
      lastLocationResolutionSignatureRef.current ===
      locationResolutionSignature
    ) {
      return;
    }

    lastLocationResolutionSignatureRef.current = locationResolutionSignature;

    let isCancelled = false;

    const bootstrapHome = async () => {
      try {
        const result = await chekLocationPermission(true);

        if (isCancelled) {
          return;
        }

        if (result === 'goback' || result !== 'granted') {
          const defaultLocation = getDefaultLocationData();

          if (defaultLocation) {
            actions.locationData(defaultLocation);
            homeData(defaultLocation);
          } else if (!fallbackLocation) {
            homeData();
          }
          return;
        }

        const [curLoc, savedAddress] = await Promise.all([
          getCurrentLocation('home').catch(() => null),
          !!userData?.auth_token ? getAllAddress().catch(() => []) : Promise.resolve([]),
        ]);

        if (isCancelled) {
          return;
        }

        if (isLocationSearched) {
          const searchedLocation =
            location?.address || hasValidCoordinates(location)
              ? location
              : curLoc;

          if (searchedLocation) {
            actions.locationData(searchedLocation);
            homeData(searchedLocation);
          } else {
            homeData();
          }
          return;
        }

        if (!!userData?.auth_token && savedAddress?.length > 0) {
          const primaryAddress = savedAddress.find(
            a => a.is_primary == 1 || a.is_primary === '1',
          );

          if (primaryAddress) {
            const resolvedLocation = {
              address: primaryAddress.address,
              latitude: parseFloat(primaryAddress.latitude),
              longitude: parseFloat(primaryAddress.longitude),
              type: primaryAddress.type || primaryAddress.address_type,
              type_name: primaryAddress.type_name,
              id: primaryAddress.id,
            };
            actions.locationData(resolvedLocation);
            homeData(resolvedLocation);
            return;
          }

          if (curLoc) {
            getNearestLocation(curLoc, savedAddress)
              .then(nearestLoc => {
                if (isCancelled) {
                  return;
                }
                actions.locationData(nearestLoc);
                homeData(nearestLoc);
              })
              .catch(() => {
                if (isCancelled) {
                  return;
                }
                actions.locationData(curLoc);
                homeData(curLoc);
              });
            return;
          }
        }

        if (curLoc) {
          actions.locationData(curLoc);
          homeData(curLoc);
          return;
        }

        if (!fallbackLocation) {
          homeData();
        }
      } catch (error) {
        console.log('error while accessing location', error);
        console.log('api hit without lat lng');
        if (!isCancelled && !fallbackLocation) {
          homeData();
        }
      }
    };

    bootstrapHome();

    return () => {
      isCancelled = true;
    };
  }, [
    allAddresss?.length,
    appData?.profile?.code,
    dineInType,
    getBestAvailableLocation,
    getDefaultLocationData,
    getLocationSignature,
    hasValidCoordinates,
    isLocationSearched,
    location,
    priceType,
    restoreHomeCache,
    selectedTabType,
    userData?.auth_token,
  ]);

  const preLoadImages = useCallback(data => {
    if (!!data?.data) {
      data.data.map(data => {
        const imageURI = data?.icon
          ? getImageUrl(
            data.icon.image_fit,
            data.icon.image_path,
            `${80 + 140}/${80 + 140}`,
          )
          : getImageUrl(
            data.image.image_fit,
            data.image.image_path,
            `${80 + 140}/${80 + 140}`,
          );
        FastImage.preload([{ uri: imageURI }]);
      });
    }
  }, []);

  //Error handling in screen
  const errorMethod = error => {
    setLoadingAddons(false);
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
  const updateState = data => setState(state => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };
  const onPressVendor = item => {
    if (dineInType == 'car_rental') {
      navigation.navigate(navigationStrings.CAR_RENTAL_HOME, {
        data: { ...item, type: 'vendor' },
      });
      return;
    }

    if (item?.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        item['pickup_taxi'] = true;
        moveToNewScreen(navigationStrings.ADDADDRESS, item)();
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (!!item?.is_show_category) {
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
        item,
        rootProducts: true,
        // categoryData: data,
      })();
    } else {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        id: item?.id,
        vendor: true,
        name: item?.name,
        isVendorList: true,
        fetchOffers: true,
      })();
    }
  };

  //onPress Category
  const onPressCategory = (item, parentData) => {
    if (dineInType == 'car_rental') {
      navigation.navigate(navigationStrings.CAR_RENTAL_HOME, {
        data: { ...item, type: 'category' },
      });
      return;
    }
    if (
      !!appData?.profile?.preferences?.is_service_product_price_from_dispatch &&
      priceType == 'vendor' &&
      dineInType === 'on_demand'
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        fetchOffers: true,
        id: item.id,
        vendor:
          item.redirect_to == staticStrings.ONDEMANDSERVICE ||
            item.redirect_to == staticStrings.PRODUCT ||
            item?.redirect_to == staticStrings.LAUNDRY ||
            item?.redirect_to == staticStrings.APPOINTMENT
            ? false
            : true,
        name: item.name,
        isVendorList: false,
        categoryData: parentData
      })();
      return;
    }

    if (item?.redirect_to == staticStrings.APPOINTMENT) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        id: item?.id,
        vendor: false,
        name: item?.name,
        isVendorList: false,
        fetchOffers: true,
        categoryData: parentData
      })();
      return;
    }
    if (item?.redirect_to == staticStrings.P2P) {
      moveToNewScreen(navigationStrings.P2P_PRODUCTS, item)();
      return;
    }
    if (item?.redirect_to == staticStrings.RENTAL) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        id: item?.id,
        vendor: false,
        name: item?.name,
        isVendorList: true,
        fetchOffers: true,
        categoryData: parentData
      })();
      return;
    }
    if (item?.redirect_to == staticStrings.FOOD_TEMPLATE) {
      moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();
      return;
    }
    if (
      item?.redirect_to == staticStrings.SUBCATEGORY &&
      appStyle?.homePageLayout == 10
    ) {
      moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();
      return;
    }

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
          item.redirect_to == staticStrings.ONDEMANDSERVICE ||
            item.redirect_to == staticStrings.PRODUCT ||
            item?.redirect_to == staticStrings.LAUNDRY
            ? false
            : true,
        name: item.name,
        isVendorList: false,
        categoryData: parentData
      })();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      item['pickup_taxi'] = true;
      moveToNewScreen(navigationStrings.ADDADDRESS, item)();
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, item)();
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
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
          categoryData: parentData
        })();
      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  //On Press banner
  const bannerPress = data => {
    if (dineInType == 'p2p') {
      if (data.redirect_to == staticStrings.CATEGORY) {
        if (data?.category?.type?.title == staticStrings.VENDOR) {
          let dat2 = data;
          dat2['id'] = data?.redirect_id;
          moveToNewScreen(navigationStrings.VENDOR, dat2)();
          return;
        } else {
          if (data?.category?.type?.title == staticStrings.PRODUCT) {
            moveToNewScreen(navigationStrings.P2P_PRODUCTS, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
            return;
          } else {
            moveToNewScreen(navigationStrings.P2P_PRODUCTS, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
          }
        }
      }
      if (data?.redirect_to == "Url") {
        openBrowser(data?.link_url)
        return
      }
      return;
    }
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
            categoryData: parentData
          })();
      } else if (data.redirect_to == staticStrings.CATEGORY) {
        if (data?.category?.type?.title == staticStrings.VENDOR) {
          let dat2 = data;
          dat2['id'] = data?.redirect_id;
          moveToNewScreen(navigationStrings.VENDOR, dat2)();
          return;
        } else {
          if (data?.category?.type?.title == staticStrings.PRODUCT) {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
            return;
          }
        }
      }
    }
  };

  const onPressProduct = item => {
    if (dineInType == 'p2p') {
      navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, {
        product_id: item?.id,
      });
      return;
    }

    if (dineInType == 'car_rental') {
      navigation.navigate(navigationStrings.CAR_RENTAL_HOME, {
        data: { ...item, type: 'product' },
      });
      return;
    } else {
      !!item?.is_p2p
        ? navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, {
          data: item,
        })
        : navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item });
    }
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ isRefreshing: true });
    homeData(location);
  };

  const selcetedToggle = type => {
    // Configure smooth layout animation
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );

    actions.dineInData(type);
    updateState({ selectedFilterType: {} });
    if (dineInType != type) {
      {
        updateState({
          selectedTabType: type,
          isLoading: true,
        });
      }
    } else {
      updateState({
        selectedTabType: type,
      });
    }
  };

  const onVendorFilterSeletion = selectedFilter => {
    updateState({
      isLoading: true,
      openVendor: selectedFilter?.id == 1 ? 1 : 0,
      closeVendor: selectedFilter?.id == 2 ? 1 : 0,
      bestSeller: selectedFilter?.id == 3 ? 1 : 0,
      selectedFilterType: selectedFilter,
    });
    homeData(location, selectedFilter);
  };

  const onSpeechStartHandler = e => { };
  const onSpeechEndHandler = e => {
    updateState({
      isVoiceRecord: false,
    });
  };

  const onSpeechResultsHandler = e => {
    let text = e.value[0];
    moveToNewScreen(navigationStrings.SEARCHPRODUCTOVENDOR, {
      voiceInput: text,
    })();
    _onVoiceStop();
  };

  const _onVoiceListen = async () => {
    const voicePermision = await requestRecordAudioPermission()
    if (!voicePermision) {
      return
    }
    const langType = languages?.primary_language?.sort_code;
    updateState({
      isVoiceRecord: true,
    });
    try {
      await Voice.start(langType);
    } catch (error) { }
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

  const onPressAddLaundryItem = item => {
    setSelectedHomeCategory(item);
    setLoadingAddons(true);
    updateState({
      selectedAddonSet: [],
    });
    let url = `?category_id=${item?.id}`;
    actions
      .getProductEstimationWithAddons(
        url,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(res => {
        setLoadingAddons(false);
        setEsitmatedLaundryProducts(res?.data);
        setSelectedLaundryCategory(res?.data[0]);
        setLaundryAddonModal(true);
      })
      .catch(errorMethod);
  };

  const onPressLaundryCategory = item => {
    setIsOnPressed(false);
    setSelectedLaundryCategory(item);
    updateState({
      selectedAddonSet: [],
    });
  };

  const onLaundryAddonSelect = (item, categoryDetails) => {
    let newSelectedAddonSet = [...selectedAddonSet];
    let counter = 0;
    let maxSelectLimit = categoryDetails.estimate_addon_set?.max_select;
    newSelectedAddonSet.map(item => {
      if (item?.estimate_addon_id == categoryDetails.estimate_addon_set?.id) {
        counter++;
      }
    });

    let selectedSetIndex = newSelectedAddonSet.findIndex(
      x => x?.id === item?.id,
    );

    item.estimate_product_id = categoryDetails?.estimate_product_id;

    if (selectedSetIndex == -1 && counter !== maxSelectLimit) {
      updateState({
        selectedAddonSet: [...newSelectedAddonSet, item],
      });

      return;
    } else if (selectedSetIndex == -1 && counter == maxSelectLimit) {
      updateState({
        selectedAddonSet: [item],
      });
    } else {
      let filteredAddonSet = newSelectedAddonSet.filter(
        (item, index) => index !== selectedSetIndex,
      );
      updateState({
        selectedAddonSet: filteredAddonSet,
      });
    }
  };

  const onFindVendors = () => {
    let newAry = [];
    selectedLaundryCategory?.estimate_product_addons.map((item, index) => {
      let newObj = {
        addon_id: item?.estimate_addon_id,
        min_select_count: item?.estimate_addon_set?.min_select,
        max_select_count: item?.estimate_addon_set?.max_select,
      };
      newAry[index] = newObj;
    });
    let unPresentItems = [];
    newAry.map(itm => {
      if (
        !selectedAddonSet.some(item => item?.estimate_addon_id == itm?.addon_id)
      ) {
        if (itm?.min_select_count !== 0) {
          unPresentItems.push(itm);
        }
      }
    });
    updateState({
      unPresentAry: unPresentItems,
    });
    setIsOnPressed(true);
    if (unPresentItems.length == 0) {
      onHideModal();
      moveToNewScreen(navigationStrings.LAUNDRY_AVAILABLE_VENDORS, {
        selectedAddonSet: selectedAddonSet,
      })();
    }
  };

  const showAllProducts = item => {
    moveToNewScreen(navigationStrings.PRODUCT_LIST, {
      id: item?.data?.category_detail?.id,
      vendor: false,
      name:
        item?.data?.category_detail?.title || item?.data?.category_detail?.slug,
      isVendorList: false,
      fetchOffers: false,
      productWithSingleCategory: true,
    })();
  };

  const showAllSpotDealAndSelectedProducts = item => {
    moveToNewScreen(
      navigationStrings.SPOTDEALPRODUCTSANDSELECTEDPRODUCTS,
      item,
    )();
  };

  const onHideModal = () => {
    setIsOnPressed(false);
    setLaundryAddonModal(false);
  };

  const _closeModal = () => {
    actions.changeSubscriptionModal(false)
    return
  };

  const _stopOrderModalClose = () => {
    updateState({
      stopOrderModalVisible: false,
    });
  };

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        'worklet';
        const y = event.contentOffset.y;
        animation.value = y > 170 ? 170 : y;
        runOnJS(updateHeaderScroll)(y);
      },
    },
    [updateHeaderScroll],
  );

  const renderHeaders = useCallback(() => {
    switch (appStyle?.homePageLayout) {
      case 1:
      case 2: {
        const HeaderOne = require('./DashboardViews/DashBoardHeaderOne').default;
        return (
          <SafeAreaView>
            <HeaderOne navigation={navigation} location={location} />
          </SafeAreaView>
        );
      }
      case 3: {
        if (getBundleId() === appIds.onTheWheel) {
          const HeaderSix = require('./DashboardViews/DashBoardHeaderSix').default;
          return (
            <HeaderSix
              showToggles={false}
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
          );
        }

        const HeaderFive = require('./DashboardViews/DashBoardHeaderFive').default;
        return (
          <HeaderFive
            showToggles={false}
            navigation={navigation}
            location={location}
            selcetedToggle={selcetedToggle}
            toggleData={appData}
            isLoading={isLoading}
            currentLocation={location}
            isLoadingB={isLoadingB}
            _onVoiceListen={_onVoiceListen}
            isVoiceRecord={isVoiceRecord}
            _onVoiceStop={_onVoiceStop}
            nearestLoc={nearestLocDis}
            currentLoc={currentLocation}
            onSeviceType={() => setIsPriceTypeModal(true)}
            isScrolled={isHeaderScrolled}
          />
        );
      }
      case 4: {
        const HeaderFour = require('./DashboardViews/DashBoardHeaderFour').default;
        return (
          <SafeAreaView>
            <HeaderFour
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
            />
          </SafeAreaView>
        );
      }
      case 5:
      case 6: {
        const HeaderFive = require('./DashboardViews/DashBoardHeaderFive').default;
        return (
          <HeaderFive
            showToggles={false}
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
            nearestLoc={nearestLocDis}
            currentLoc={currentLocation}
            onSeviceType={() => setIsPriceTypeModal(true)}
            isScrolled={isHeaderScrolled}
          />
        );
      }
      case 7: {
        const HeaderFive = require('./DashboardViews/DashBoardHeaderFive').default;
        return (
          <HeaderFive
            showToggles={false}
            navigation={navigation}
            location={location}
            selcetedToggle={selcetedToggle}
            toggleData={appData}
            isLoading={isLoading}
            currentLocation={location}
            isLoadingB={isLoadingB}
            _onVoiceListen={_onVoiceListen}
            isVoiceRecord={isVoiceRecord}
            _onVoiceStop={_onVoiceStop}
            nearestLoc={nearestLocDis}
            currentLoc={currentLocation}
            onSeviceType={() => setIsPriceTypeModal(true)}
            isScrolled={isHeaderScrolled}
          />
        );
      }
      case 8: {
        const HeaderSeven = require('./DashboardViews/DashBoardHeaderSeven').default;
        return (
          <SafeAreaView>
            <HeaderSeven
              showToggles={false}
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
              curLatLong={location}
            />
          </SafeAreaView>
        );
      }
      case 10: {
        const HeaderEcommerce =
          require('./DashboardViews/DashBoardHeaderEcommerce').default;
        return (
          <HeaderEcommerce
            showToggles={false}
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
            animation={animation}
          />
        );
      }
      case 11: {
        const HeaderFive = require('./DashboardViews/DashBoardHeaderFive').default;
        return (
          <HeaderFive
            showToggles={false}
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
            onSeviceType={() => setIsPriceTypeModal(true)}
            priceType={priceType}
            isScrolled={isHeaderScrolled}
          />
        );
      }
      default: {
        const HeaderFive = require('./DashboardViews/DashBoardHeaderFive').default;
        return (
          <HeaderFive
            location={location}
            selcetedToggle={selcetedToggle}
            isLoadingB={isLoadingB}
            onSeviceType={() => setIsPriceTypeModal(true)}
            isScrolled={isHeaderScrolled}
          />
        );
      }
    }
  }, [
    appStyle?.homePageLayout,
    location,
    appData,
    isLoading,
    currentLocation,
    isLoadingB,
    isVoiceRecord,
    priceType,
    isHeaderScrolled,
  ]);

  const renderHomeScreen = () => {
    const shouldShowContent = hasHomeData;
    const renderSimpleHomeLoader = loaderKey => (
      <Animated.View
        key={loaderKey}
        entering={FadeIn.duration(200)}
        style={{
          flex: 1,
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <ActivityIndicator
            size="large"
            color={themeColors?.primary_color || colors.black}
          />
        </View>
      </Animated.View>
    );

    switch (dineInType) {
      case 'grocery': {
        const GroceryHomePage =
          require('./GroceryHomePage/GroceryHomePage').default;
        const DashBoardFiveV2ApiGroceryLoader =
          require('./DashboardViews/DashBoardFiveV2ApiGroceryLoader').default;
        return (
          <View style={{ flex: 1 }}>
            {shouldShowContent && (
              <View
                key={`content-grocery`}
                style={{ flex: 1 }}
              >
                <GroceryHomePage
                  navigation={navigation}
                  handleRefresh={() => handleRefresh()}
                  bannerPress={item => bannerPress(item)}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  appMainData={appMainData}
                  onPressCategory={(item, parentData) => onPressCategory(item, parentData)}
                  onPressVendor={item => onPressVendor(item)}
                  tempCartData={tempCartData}
                  onVendorFilterSeletion={onVendorFilterSeletion}
                  selcetedToggle={selcetedToggle}
                  onClose={_closeModal}
                  onPressSubscribe={_onPressSubscribe}
                  isSubscription={isSubscription}
                  showAllProducts={showAllProducts}
                  showAllSpotDealAndSelectedProducts={showAllSpotDealAndSelectedProducts}
                  showVendorCategory={true}
                  onPressProduct={onPressProduct}
                />
              </View>
            )}
            {isLoading && !shouldShowContent && (
              <Animated.View
                key={`loader-grocery`}
                entering={FadeIn.duration(200)}
                style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}
              >
                <DashBoardFiveV2ApiGroceryLoader selcetedToggle={selcetedToggle}/>
              </Animated.View>
            )}
          </View>
        );
      }
      case 'delivery':
      case 'dine_in':
      case 'takeaway': {
        const FoodHomePage = require('./FoodHomePage/FoodHomePage').default;
        return (
          <View style={{ flex: 1 }}>
            {shouldShowContent && (
              <View
                key={`content-delivery`}
                style={{ flex: 1 }}
              >
                <FoodHomePage
                  navigation={navigation}
                  handleRefresh={() => handleRefresh()}
                  bannerPress={item => bannerPress(item)}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  appMainData={appMainData}
                  onPressCategory={(item, parentData) => onPressCategory(item, parentData)}
                  onPressVendor={item => onPressVendor(item)}
                  tempCartData={tempCartData}
                  onVendorFilterSeletion={onVendorFilterSeletion}
                  selcetedToggle={selcetedToggle}
                  onClose={_closeModal}
                  onPressSubscribe={_onPressSubscribe}
                  isSubscription={isSubscription}
                  showAllProducts={showAllProducts}
                  showAllSpotDealAndSelectedProducts={showAllSpotDealAndSelectedProducts}
                  showVendorCategory={true}
                  onPressProduct={onPressProduct}
                />
              </View>
            )}
            {isLoading && !shouldShowContent && (
              renderSimpleHomeLoader('loader-delivery')
            )}
          </View>
        );
      }
      case 'ecommerce': {
        const EcommerceHomePage =
          require('./EcommerceHomePage/EcommerceHomePage').default;
        const EcommerceHomePageLoader =
          require('./DashboardViews/EcommerceHomePageLoader').default;
        return (
          <View style={{ flex: 1 }}>
            {shouldShowContent && (
              <View
                key={`content-ecommerce`}
                style={{ flex: 1 }}
              >
                <EcommerceHomePage
                  navigation={navigation}
                  handleRefresh={() => handleRefresh()}
                  bannerPress={item => bannerPress(item)}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  appMainData={appMainData}
                  onPressCategory={(item, parentData) => onPressCategory(item, parentData)}
                  onPressVendor={item => onPressVendor(item)}
                  tempCartData={tempCartData}
                  onVendorFilterSeletion={onVendorFilterSeletion}
                  selcetedToggle={selcetedToggle}
                  onClose={_closeModal}
                  onPressSubscribe={_onPressSubscribe}
                  isSubscription={isSubscription}
                  showAllProducts={showAllProducts}
                  showAllSpotDealAndSelectedProducts={showAllSpotDealAndSelectedProducts}
                  showVendorCategory={true}
                  onPressProduct={onPressProduct}
                />
              </View>
            )}
            {isLoading && !shouldShowContent && (
              <Animated.View
                key={`loader-ecommerce`}
                entering={FadeIn.duration(200)}
                style={{ flex: 1, position: 'absolute', width: '100%', height: '100%' }}
              >
                <EcommerceHomePageLoader selcetedToggle={selcetedToggle}/>
              </Animated.View>
            )}
          </View>
        );
      }
      default: {
        const DashBoardFiveV2Api =
          require('./DashboardViews/DashBoardFiveV2Api').default;
        return (
          <View style={{ flex: 1 }}>
            {shouldShowContent && (
              <View
                key={`content-default`}
                style={{ flex: 1 }}
              >
                <DashBoardFiveV2Api
                  headerPadding={headerHeight}
                  handleRefresh={() => handleRefresh()}
                  bannerPress={item => bannerPress(item)}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  appMainData={appMainData}
                  onPressCategory={(item, parentData) => onPressCategory(item, parentData)}
                  onPressVendor={item => onPressVendor(item)}
                  isDineInSelected={isDineInSelected}
                  selcetedToggle={selcetedToggle}
                  tempCartData={tempCartData}
                  toggleData={appData}
                  navigation={navigation}
                  onVendorFilterSeletion={onVendorFilterSeletion}
                  singleVendor={singleVendor}
                  onPressAddLaundryItem={onPressAddLaundryItem}
                  isLoadingAddons={isLoadingAddons}
                  selectedHomeCategory={selectedHomeCategory}
                  onClose={_closeModal}
                  onPressSubscribe={_onPressSubscribe}
                  isSubscription={isSubscription}
                  selectedFilterType={selectedFilterType}
                  showAllProducts={showAllProducts}
                  showAllSpotDealAndSelectedProducts={
                    showAllSpotDealAndSelectedProducts
                  }
                  showVendorCategory={true}
                  scrollHandler={scrollHandler}
                  onPressProduct={onPressProduct}
                />
                {/* Absolute header floating over banner */}
                <View
                  pointerEvents="box-none"
                  onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
                  {renderHeaders()}
                </View>
              </View>
            )}
            {isLoading && !shouldShowContent && (
              renderSimpleHomeLoader('loader-default')
            )}
          </View>
        );
      }
    }
  };

  useEffect(() => {
    if (!!userData?.auth_token) {
      const pendingOrderTask = InteractionManager.runAfterInteractions(() => {
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
      });

      return () => {
        pendingOrderTask.cancel();
      };
    }
  }, []);

  const _onPressSubscribe = () => {
    actions.changeSubscriptionModal(false)
    setTimeout(() => {
      moveToNewScreen(navigationStrings.SUBSCRIPTION)();
    }, 500);
  };

  return (
    <WrapperContainer
      statusBarColor={colors.whiteSmokeColor}
      bgColor={
        isDarkMode
          ? MyDarkTheme.colors.background
          : appStyle?.homePageLayout == 8 && dineInType == 'p2p'
            ? colors.white
            : colors.whiteSmokeColor
      }
      isLoading={searchDataLoader}
      isSafeArea={false}>
      <>{renderHomeScreen()}</>
      {shouldMountDeferredUi &&
        (() => {
          const AIChat = require('../../Components/AI/AIChat').default;
          return (
            <AIChat
              themeColors={themeColors}
              fontFamily={fontFamily}
              location={location}
              shortcode={appData?.profile?.code}
              appData={appData}
              navigation={navigation}
            />
          );
        })()}
      {(shouldMountDeferredUi || isLaundryAddonModal) &&
        (() => {
          const LaundryAddonModal =
            require('../../Components/LaundryAddonModal').default;
          return (
            <LaundryAddonModal
              isVisible={isLaundryAddonModal}
              hideModal={onHideModal}
              selectedLaundryCategory={selectedLaundryCategory}
              onPressLaundryCategory={onPressLaundryCategory}
              flatlistData={esitmatedLaundryProducts}
              onLaundryAddonSelect={onLaundryAddonSelect}
              selectedAddonSet={selectedAddonSet}
              onFindVendors={onFindVendors}
              minMaxError={minMaxError}
              isOnPressed={isOnPressed}
              selectedHomeCategory={selectedHomeCategory}
              unPresentAry={unPresentAry}
            />
          );
        })()}

      {!!appData?.stop_order_acceptance_for_users &&
        (shouldMountDeferredUi || stopOrderModalVisible) &&
        (() => {
          const StopAcceptingOrderModal =
            require('../../Components/StopAcceptingOrderModal').default;
          return (
            <StopAcceptingOrderModal
              isVisible={stopOrderModalVisible}
              onClose={_stopOrderModalClose}
            />
          );
        })()}
      <Modal onBackdropPress={() => setIsPriceTypeModal(false)} isVisible={ispriceTypeModal}>
        <View style={{ height: moderateScaleVertical(170), backgroundColor: colors.white, borderRadius: moderateScale(12), padding: moderateScale(12) }}>
          <Text style={{
            fontFamily: fontFamily?.bold,
            fontSize: textScale(16)
          }}>{strings.SELECT_PRICE_TYPE}</Text>
          <View style={{
            margin: moderateScale(12)
          }}>
            <TouchableOpacity
              onPress={() => actions.changeServiceType('vendor')}
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}>
              <Image source={priceType == "vendor" ? imagePath.icoRadioSelected : imagePath.icoRadioNonSelected} />
              <Text style={{
                fontFamily: fontFamily?.regular,
                fontSize: textScale(14),
                marginLeft: moderateScale(8)
              }}>{strings.FROM_VENDOR}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => actions.changeServiceType('freelancer')}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: moderateScaleVertical(12)
              }}>
              <Image source={priceType == "freelancer" ? imagePath.icoRadioSelected : imagePath.icoRadioNonSelected} />
              <Text style={{
                fontFamily: fontFamily?.regular,
                fontSize: textScale(14),
                marginLeft: moderateScale(8)
              }}>{strings.FROM_FREELANCER}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setIsPriceTypeModal(false)
              updateState({
                searchDataLoader: true
              })
              homeData()
            }} style={{
              borderWidth: 1,
              borderColor: themeColors?.primary_color,
              height: 35,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-end",
              marginTop: moderateScale(10),
              paddingHorizontal: moderateScale(10)
            }}>
              <Text style={{
                color: themeColors?.primary_color
              }}>{strings.DONE}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
}
