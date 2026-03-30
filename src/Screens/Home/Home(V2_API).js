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
  LayoutAnimation,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import Geocoder from 'react-native-geocoding';
import { useSelector } from 'react-redux';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
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
} from 'react-native-reanimated';
import { enableFreeze } from 'react-native-screens';
import BorderTextInput from '../../Components/BorderTextInput';
import AIChat from '../../Components/AI/AIChat';
import LaundryAddonModal from '../../Components/LaundryAddonModal';
import StopAcceptingOrderModal from '../../Components/StopAcceptingOrderModal';
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
import { getColorSchema } from '../../utils/utils';
import DashBoardFiveV2ApiGroceryLoader from './DashboardViews/DashBoardFiveV2ApiGroceryLoader';
import EcommerceHomePageLoader from './DashboardViews/EcommerceHomePageLoader';
import DashBoardHeaderEcommerce from './DashboardViews/DashBoardHeaderEcommerce';
import DashBoardHeaderOne from './DashboardViews/DashBoardHeaderOne';
import DashBoardHeaderSeven from './DashboardViews/DashBoardHeaderSeven';
import DashBoardHeaderSix from './DashboardViews/DashBoardHeaderSix';
import {
  DashBoardFiveV2Api,
  DashBoardHeaderFive,
  DashBoardHeaderFour
} from './DashboardViews/Index';
import FoodHomePage from './FoodHomePage/FoodHomePage';
import GroceryHomePage from './GroceryHomePage/GroceryHomePage';
import EcommerceHomePage from './EcommerceHomePage/EcommerceHomePage';
import fontFamily from '../../styles/fontFamily';

enableFreeze(true);

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Home({ route, navigation }) {
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
    themeColors,
  } = useSelector(state => state?.initBoot);
  const { location, appMainData, dineInType, isLocationSearched, priceType, isSubscription } = useSelector(
    state => state?.home || {},
  );

  const isFocused = useIsFocused();
  const animation = useSharedValue(0);
  const { cartItemCount } = useSelector(state => state?.cart);

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

  useLayoutEffect(() => {
    chekLocationPermission(true)
      .then(result => {
        if (result !== 'goback' && result == 'granted') {
          getCurrentLocation('home')
            .then(curLoc => {
              let locData = location?.address ? location : curLoc;
              if (!!userData?.auth_token) {
                getAllAddress()
                  .then(savedAddress => {
                    if (savedAddress.length > 0) {
                      getNearestLocation(curLoc, savedAddress)
                        .then(nearestLoc => {
                          if (isLocationSearched || isRefreshing) {
                            actions.locationData(locData);
                            homeData(locData);
                          } else {
                            actions.locationData(nearestLoc);
                            homeData(nearestLoc);
                          }
                        })
                        .catch(error => {
                          actions.locationData(locData);
                          homeData(locData);
                        });
                      return;
                    } else {
                      actions.locationData(locData);
                      homeData(locData);
                      return;
                    }
                  })
                  .catch(error => {
                    homeData(locData);
                    return;
                  });
              } else {
                actions.locationData(locData);
                homeData(locData);
                return;
              }
              return;
            })
            .catch(err => {
              homeData();
              return;
            });
        } else {
          if (
            appData?.profile?.preferences?.is_hyperlocal ||
            dineInType == 'p2p'
          ) {
            const data = {
              address: appData?.profile?.preferences?.Default_location_name,
              latitude: appData?.profile?.preferences?.Default_latitude,
              longitude: appData?.profile?.preferences?.Default_longitude,
            };
            if (!!data?.latitude) {
              actions.locationData(data);
              homeData(data);
              return;
            } else {
              homeData();
              return;
            }
          } else {
            homeData();
            return;
          }
        }
      })
      .catch(error => {
        console.log('error while accessing location', error);
        console.log('api hit without lat lng');
        homeData();
        return;
      });
  }, [selectedTabType, appData, allAddresss]);

  useEffect(() => {
    if (!!userData?.auth_token && !!appData?.profile?.socket_url) {
      socketServices.initializeSocket(appData?.profile?.socket_url);
    }
  }, [appData]);

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
    }, []),
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
  const homeData = (locationData = null, selectedFilter = null) => {
    if (!isFocused) {
      updateState({ isLoading: false })
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

    {
      var selectedVendorType = null;
      var defaultVendorType = null;

      if (!!appData?.profile && appData?.profile?.preferences?.vendorMode) {
        defaultVendorType = appData?.profile?.preferences?.vendorMode[0]?.type; //
        appData?.profile?.preferences?.vendorMode.forEach((val, i) => {
          if (val?.type == dineInType) {
            selectedVendorType = val.type;
          }
        });
      }
      if (!selectedVendorType) {
        actions.dineInData(defaultVendorType);
      }

      let vendorType = !!selectedVendorType
        ? selectedVendorType
        : defaultVendorType;
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
      console.log('sending api data header', apiData);
      actions
        .homeDataV2(apiData, apiHeader)
        .then(async res => {
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
          updateState({
            isLoading: false,
            isLoadingB: false,
            searchDataLoader: false,
          });
        })
        .catch(errorMethod);
    }
  };

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

  const scrollHandler = useAnimatedScrollHandler(event => {
    if (event.contentOffset.y > 170) {
      animation.value = 170;
      return;
    }
    animation.value = event.contentOffset.y;
  });

  const renderHeaders = useCallback(() => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return (
          <SafeAreaView>
            <DashBoardHeaderOne
              navigation={navigation}
              location={location}
            />
          </SafeAreaView>
        );

      case 2:
        return (
          <SafeAreaView>
            <DashBoardHeaderOne
              navigation={navigation}
              location={location}
            />
          </SafeAreaView>
        );
      case 3:
        if (getBundleId() === appIds.onTheWheel) {
          return (
            <SafeAreaView>
              <DashBoardHeaderSix
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
            </SafeAreaView>
          );
        } else {
          return (
            <SafeAreaView>
              <DashBoardHeaderFive
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
              />
            </SafeAreaView>
          );
        }

      case 4:
        return (
          <SafeAreaView>
            <DashBoardHeaderFour
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
            />
          </SafeAreaView>
        );

      case 5: // 5
        return (
          <SafeAreaView>
            <DashBoardHeaderFive
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
            />
          </SafeAreaView>
        );
      case 6:
        return (
          <SafeAreaView>
            <DashBoardHeaderFive
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
            />
          </SafeAreaView>
        );

      case 7:
        return (
          <SafeAreaView>
            <DashBoardHeaderFive
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
            />
          </SafeAreaView>
        );

      case 10:
        return (
          <DashBoardHeaderEcommerce
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

      case 8:
        return (
          <SafeAreaView>
            <DashBoardHeaderSeven
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

      case 11:
        return (
          <SafeAreaView>
            <DashBoardHeaderFive
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
            />
          </SafeAreaView>
        );

      default:
        return (
          <SafeAreaView>
            <DashBoardHeaderFive
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
            />
          </SafeAreaView>
        );
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
  ]);

  const renderHomeScreen = () => {
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
      case 'grocery':
        return (
          <View style={{ flex: 1 }}>
            {!isLoading && (
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
            {isLoading && (
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
        case 'delivery':
        case 'dine_in':
        case 'takeaway':
        return (
          <View style={{ flex: 1 }}>
            {!isLoading && (
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
            {isLoading && (
              renderSimpleHomeLoader('loader-delivery')
            )}
          </View>
        );
      case 'ecommerce':
        return (
          <View style={{ flex: 1 }}>
            {!isLoading && (
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
            {isLoading && (
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
      default:
        return (
          <View style={{ flex: 1 }}>
            {!isLoading && (
              <View
                key={`content-default`}
                style={{ flex: 1 }}
              >
                {renderHeaders()}
                <DashBoardFiveV2Api
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
              </View>
            )}
            {isLoading && (
              renderSimpleHomeLoader('loader-default')
            )}
          </View>
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
      <AIChat 
        themeColors={themeColors} 
        fontFamily={fontFamily} 
        location={location}
        shortcode={appData?.profile?.code}
        appData={appData}
        navigation={navigation}
      />
      <LaundryAddonModal
        isVisible={isLaundryAddonModal}
        hideModal={onHideModal}
        // isLoadingAddons={isLoadingAddons}
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

      {!!appData?.stop_order_acceptance_for_users && (
        <StopAcceptingOrderModal
          isVisible={stopOrderModalVisible}
          onClose={_stopOrderModalClose}
        />
      )}
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
