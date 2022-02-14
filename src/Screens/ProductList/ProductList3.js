import {cloneDeep, debounce, update} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  Platform,
  RefreshControl,
  SafeAreaView,
  Share,
  StatusBar,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  ScrollView,
  Modal,
} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import * as Animatable from 'react-native-animatable';
import {useDarkMode} from 'react-native-dark-mode';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import SectionList from 'react-native-tabs-section-list';
import {useSelector} from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import BottomSheetModal from '../../Components/BottomSheetModal';
import BottomSlideModal from '../../Components/BottomSlideModal';
import BrowseMenuButton from '../../Components/BrowseMenuButton';
import CustomAnimatedLoader from '../../Components/CustomAnimatedLoader';
import GradientCartView from '../../Components/GradientCartView';
import HomeServiceVariantAddons from '../../Components/HomeServiceVariantAddons';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import CircularProfileLoader from '../../Components/Loaders/CircularProfileLoader';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import ProductListLoader from '../../Components/Loaders/ProductListLoader';
import NoDataFound from '../../Components/NoDataFound';
import ProductCard3 from '../../Components/ProductCard3';
import RoundImg from '../../Components/RoundImg';
import SearchBar from '../../Components/SearchBar';
import VariantAddons from '../../Components/VariantAddons';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, {hitSlopProp} from '../../styles/commonStyles';
import * as NavigationService from '../../navigation/NavigationService';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {currencyNumberFormatter} from '../../utils/commonFunction';
import {
  checkEvenOdd,
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  playVibration,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import {removeItem} from '../../utils/utils';
import stylesFunc from './styles';
import _ from 'lodash';
import ProductListLoader3 from '../../Components/Loaders/ProductListLoader3';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import RepeatModal from '../../Components/RepeatModal';
import DifferentAddOns from '../../Components/DifferentAddOns ';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import FilterComp from '../../Components/FilterComp';
import {appIds} from '../../utils/constants/DynamicAppKeys';

let timeOut = undefined;

var tempQty = 0;

let activeIdx = 0;

export default function Products({route, navigation}) {
  const bottomSheetRef = useRef(null);
  let selectedFilters = useRef(null);
  // console.log(route.params, 'route.params');
  const {data} = route.params;
  // console.log(data, 'datadatadata');
  const routeData = data?.fetchOffers;
  const {blurRef} = useRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const dineInType = useSelector((state) => state?.home?.dineInType);
  const CartItems = useSelector((state) => state?.cart?.cartItemCount);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  let sectionListRef = useRef(null);
  const [state, setState] = useState({
    isVisibleModal: false,
    isOffline: false,
    isLoading: true,
    isLoadingB: false,
    pageNo: 1,
    limit: 30,
    isRefreshing: false,
    selectedSbCategoryID: -1,
    productListId: data,
    productListData: [],
    categoryInfo: null,
    click: false,
    filterData: [],
    brandData: [],
    allFilters: [],
    isVisibleModal: false,
    updateQtyLoader: false,
    showShimmer: true,
    typeId: null,
    selectedSection: null,
    sortFilters: [
      {
        id: -2,
        label: strings.SORT_BY,
        value: [
          {
            id: 1,
            label: strings.LOW_TO_HIGH,
            labelValue: 'low_to_high',
            parent: strings.SORT_BY,
          },
          {
            id: 2,
            label: strings.HIGH_TO_LOW,
            labelValue: 'high_to_low',
            parent: strings.SORT_BY,
          },
          {
            id: 3,
            label: strings.POPULARITY,
            labelValue: 'popularity',
            parent: strings.SORT_BY,
          },
          {
            id: 4,
            label: strings.MOST_PURCHASED,
            labelValue: 'most_purcahsed',
            parent: strings.SORT_BY,
          },
        ],
      },
    ],
    sleectdBrands: [],
    selectedVariants: [],
    selectedOptions: [],
    slectedSortBy: [],
    minimumPrice: 0,
    maximumPrice: 50000,
    checkForMinimumPriceChange: false,
    checkForMaximumPriceChange: false,
    showFilterSlectedIcon: false,
    isLoadingC: false,
    selectedCategory: null,
    AnimatedHeaderValue: false,
    selectedCartItem: null,
    cartId: null,
    isSearch: false,
    searchInput: '',
    btnLoader: false,
    selectedItemID: -1,
    selectedItemIndx: null,
    vendorCategories: null,
    vendorCategorySelectedIndx: 0,
    vendorCategoryItms: null,
    sectionListData: [],
    numberOfQtyToBeAdd: 0,
    searchedRecords: [],
    cloneSectionList: [],
    offersModalVisible: false,
    MenuModalVisible: false,
    isVegEnabled: true,
    ProductTags: [],
    updateTagFilter: false,
    offerList: [],
    repeatItems: null,
    differentAddsOns: [],
    selectedDiffAdsOnItem: null,
    selectedDiffAdsOnSection: null,
    diffAddOnCartIdProductId: null,
    storeLocalQty: null,
    differentAddsOnsModal: false,
    selectedDiffAdsOnId: 0,
    isShowFilter: false,
    selectedSortFilter: null,
  });

  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    internetConnection,
    appStyle,
  } = useSelector((state) => state?.initBoot);

  console.log(appStyle, 'appStyleeee');

  let businessType = appData?.profile?.preferences?.business_type || null;

  const {
    selectedCategory,
    isLoadingC,
    isLoading,
    isOffline,
    pageNo,
    limit,
    isRefreshing,
    selectedSbCategoryID,
    productListId,
    categoryInfo,
    productListData,
    isLoadingB,
    filterData,
    brandData,
    allFilters,
    sortFilters,
    sleectdBrands,
    selectedVariants,
    selectedOptions,
    slectedSortBy,
    minimumPrice,
    maximumPrice,
    checkForMinimumPriceChange,
    checkForMaximumPriceChange,
    showFilterSlectedIcon,
    AnimatedHeaderValue,
    selectedCartItem,
    isVisibleModal,
    updateQtyLoader,
    cartId,
    showShimmer,
    isSearch,
    searchInput,
    btnLoader,
    selectedItemID,
    selectedItemIndx,
    vendorCategories,
    vendorCategorySelectedIndx,
    vendorCategoryItms,
    typeId,
    sectionListData,
    cloneSectionList,
    selectedSection,
    numberOfQtyToBeAdd,
    searchedRecords,
    offersModalVisible,
    isVegEnabled,
    MenuModalVisible,
    ProductTags,
    updateTagFilter,
    offerList,
    repeatItems,
    differentAddsOns,
    selectedDiffAdsOnItem,
    selectedDiffAdsOnSection,
    diffAddOnCartIdProductId,
    storeLocalQty,
    differentAddsOnsModal,
    selectedDiffAdsOnId,
    isShowFilter,
    selectedSortFilter,
  } = state;

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = stylesFunc({themeColors, fontFamily, isDarkMode, MyDarkTheme});

  //Saving the initial state
  const initialState = cloneDeep(state);
  //Logged in user data
  const userData = useSelector((state) => state?.auth?.userData);
  //app Main Data
  const appMainData = useSelector((state) => state?.home?.appMainData);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateState({pageNo: 1});
      getAllListItems(1);
      if (productListId?.vendor && routeData) {
        fetchOffers();
      }
      if (isLoadingC) {
        getAllProductsByCategoryId(true);
      }
    });
    return unsubscribe;
  }, [navigation, languages, currencies]);

  // useEffect(() => {
  //   updateState({ pageNo: 1 });
  //   getAllListItems();
  // }, [languages, currencies]);

  // useEffect(() => {
  //   getAllListItems();
  // }, [pageNo, isRefreshing]);

  const getAllProductTags = () => {
    actions
      .getAllProductTags(
        '',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),

          // code: '245bae',
          // currency: 1,
          // language: 1,
          // systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        const productTagsArr = res?.data?.map((el) => {
          return {
            ...el,
            isSelected: false,
          };
        });
        updateState({ProductTags: productTagsArr});

        // if (res && res.data) {
        //   updateState({allAvailableCoupons: res.data});
        // }
      })
      // .catch(errorMethod);
      .catch((error) => {
        console.log('tags api error >>>>>', error);
      });
  };

  const getAllListItems = (pageNo = 1) => {
    if (data?.vendor) {
      {
        !!selectedFilters.current
          ? newVendorFilter(pageNo)
          : data?.vendorData
          ? getAllProductsByVendorCategory(pageNo)
          : getAllProductsByVendor(pageNo);
      }
    } else {
      {
        !!selectedFilters.current
          ? getAllProductsCategoryFilter(pageNo)
          : getAllProductsByCategoryId(pageNo);
      }
    }
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendorCategory = () => {
    console.log('api hit getAllProductsByVendorCategory', data);
    actions
      .getProductByVendorCategoryId(
        `/${data?.vendorData.slug}/${data?.categoryInfo?.slug}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'getProductByVendorCategoryId');
        updateState({
          isLoading: false,
          isRefreshing: false,
          categoryInfo: res?.data?.vendor,
          filterData: res?.data?.filterData,
          productListData:
            pageNo == 1
              ? res.data.products.data
              : [...productListData, ...res?.data?.products?.data],
        });
        updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
      })
      .catch(errorMethod);
  };

  const updateBrandAndCategoryFilter = (filterData, allBrands) => {
    var brandDatas = [];
    var filterDataNew = [];
    // if (allBrands.length) {
    //   brandDatas = [
    //     {
    //       id: -1,
    //       label: strings.BRANDS,
    //       value: allBrands.map((i, inx) => {
    //         return {
    //           id: i?.translation[0]?.brand_id,
    //           label: i?.translation[0]?.title,
    //           parent: strings.BRANDS,
    //         };
    //       }),
    //     },
    //   ];

    //   updateState({allFilters: [...allFilters,...brandDatas]});
    // }

    // Price filter
    if (!!filterData?.length) {
      filterDataNew = filterData.map((i, inx) => {
        return {
          id: i.variant_type_id,
          label: i.title,
          value: i.options.map((j, jnx) => {
            return {
              id: j.id,
              parent: i.title,
              label: j.title,
              variant_type_id: i.variant_type_id,
            };
          }),
        };
      });
      updateState({allFilters: filterDataNew});
    }
  };

  console.log('allFilters', allFilters);
  const onFilterApply = (filterData = {}) => {
    selectedFilters.current = filterData;
    updateState({pageNo: 1});
    getAllListItems(1);
  };
  const allClearFilters = () => {
    selectedFilters.current = null;
    updateState({
      pageNo: 1,
      selectedSortFilter: null,
      minimumPrice: 0,
      maximumPrice: 50000,
    });
    getAllListItems(1);
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendor = (pageNo) => {
    console.log('api hit getAllProductsByVendor');
    actions
      .getProductByVendorId(
        `/${productListId?.id}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          latitude: appMainData?.reqData?.latitude,
          longitude: appMainData?.reqData?.longitude,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log('get all products by vendor res', res);
        if (res?.data?.vendor?.is_show_products_with_category) {
          var totalProduct = 1;
          let filterArray = res?.data?.categories?.map((val) => {
            let newKey = {
              ...val,
              ['data']: val?.products && val.products,
              title: val?.category && val.category?.translation[0]?.name,
              totalProduct: totalProduct + val.products.length,
            };
            delete newKey['products'];
            return newKey;
          });
          updateState({
            sectionListData: filterArray,
            cloneSectionList: filterArray,
            isLoading: false,
            isRefreshing: false,
            categoryInfo: res?.data?.vendor,
            filterData: res?.data?.filterData,
            vendorCategories: res?.data?.categories,
          });
          console.log(filterArray, 'filterArrayfilterArray');
          fetchTags(filterArray);
        } else {
          // console.log('get product list by vendor id >>>> ', res);
          if (res?.data) {
            updateState({
              isLoading: false,
              isRefreshing: false,
              categoryInfo: res?.data?.vendor,
              filterData: res?.data?.filterData,
              productListData: res?.data?.vendor?.is_show_products_with_category
                ? res?.data?.categories[0]?.products
                : pageNo == 1
                ? res.data.products.data
                : [...productListData, ...res.data.products.data],
              vendorCategories: res?.data?.categories,
              // vendorCategoryItms: res?.data?.categories[0]?.products,
            });
          } else {
            updateState({
              isLoading: false,
              isRefreshing: false,
            });
          }
        }
        if (res?.data) {
          updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
        }
      })
      .catch(errorMethod);
  };

  //***************get products by vendor filter**************
  const newVendorFilter = (pageNo) => {
    console.log('api hit new vendorFilter', selectedFilters);
    let data = {};
    data['variants'] = selectedFilters?.current?.selectedVariants || [];
    data['options'] = selectedFilters?.current?.selectedOptions || [];
    data['brands'] = selectedFilters?.current?.sleectdBrands || [];
    data['order_type'] = selectedFilters?.current?.selectedSorting || 0;
    data['range'] = `${minimumPrice};${maximumPrice}`;
    data['vendor_id'] = productListId.id;
    data['limit'] = limit;
    data['page'] = pageNo;
    console.log('sending data', data);
    actions
      .newVendorFilters(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log('filter vendor res', res);
        if (!!res?.data?.vendor?.is_show_products_with_category) {
          var totalProduct = 1;
          let filterArray = res?.data?.categories?.map((val) => {
            let newKey = {
              ...val,
              ['data']: val?.products && val.products,
              title: val?.category && val.category?.translation[0]?.name,
              totalProduct: totalProduct + val.products.length,
            };
            delete newKey['products'];
            return newKey;
          });
          updateState({
            sectionListData: filterArray,
            cloneSectionList: filterArray,
            isLoading: false,
            isRefreshing: false,
            categoryInfo: res?.data?.vendor,
            filterData: res?.data?.filterData,
            vendorCategories: res?.data?.categories,
          });
          console.log(filterArray, 'filterArrayfilterArray');
          fetchTags(filterArray);
        } else {
          // console.log('get product list by vendor id >>>> ', res);
          if (!!res?.data?.products?.data) {
            updateState({
              isLoading: false,
              isRefreshing: false,
              categoryInfo: res?.data?.vendor,
              filterData: res?.data?.filterData,
              productListData: !!res?.data?.vendor
                ?.is_show_products_with_category
                ? res?.data?.categories[0]?.products
                : pageNo == 1
                ? res.data.products.data
                : [...productListData, ...res.data.products.data],
              vendorCategories: res?.data?.categories,
              // vendorCategoryItms: res?.data?.categories[0]?.products,
            });
          } else {
            updateState({
              isLoading: false,
              isRefreshing: false,
            });
          }
        }
        if (res?.data) {
          updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
        }
      })
      .catch(errorMethod);
    // }
  };

  /**********Get all list items by category id */
  const getAllProductsByCategoryId = (pageNo) => {
    console.log('api hit getProductByCategoryId', data);
    actions
      .getProductByCategoryId(
        `/${productListId?.id}?limit=${limit}&page=${pageNo}&product_list=${
          data?.rootProducts ? true : false
        }`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'getProductByCategoryId');
        updateState({
          categoryInfo: categoryInfo ? categoryInfo : res.data.category,
          filterData: res?.data?.filterData,
          productListData:
            pageNo == 1
              ? res.data.listData.data
              : [...productListData, ...res.data.listData.data],
          isLoadingC: false,
          isRefreshing: false,
          isLoading: false,
        });
        {
          pageNo == 1 &&
          res?.data?.listData?.data.length == 0 &&
          res?.data?.category &&
          res?.data?.category?.childs.length
            ? updateState({
                selectedCategory: res.data.category.childs[0],
                productListId: res.data.category.childs[0],
                pageNo: 1,
                limit: 30,
                isLoadingC: true,
              })
            : null;
        }
        setTimeout(() => {
          updateState({isLoading: false});
        }, 700);
        updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
      })
      .catch(errorMethod);
    // }
  };

  /**********Get all list items category filters */
  const getAllProductsCategoryFilter = (pageNo) => {
    let data = {};
    data['variants'] = selectedFilters?.current?.selectedVariants || [];
    data['options'] = selectedFilters?.current?.selectedOptions || [];
    data['brands'] = selectedFilters?.current?.sleectdBrands || [];
    data['order_type'] = selectedFilters?.current?.selectedSorting || 0;
    data['range'] = `${minimumPrice};${maximumPrice}`;
    console.log('api hit getAllProductsCategoryFilter', data);
    actions
      .getProductByCategoryFilters(
        `/${productListId.id}?limit=${limit}&page=${pageNo}`,
        data,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'getAllProductsCategoryFilter  res ++++++');

        updateState({
          isLoading: false,
          isRefreshing: false,
          productListData:
            pageNo == 1
              ? res.data.data
              : [...productListData, ...res.data.data],
        });
      })
      .catch(errorMethod);
    // }
  };

  console.log('productListData length+++++++', productListData.length);

  const fetchTags = (filterArray) => {
    if (filterArray && filterArray.length > 0) {
      let tagsArr = [];
      filterArray.forEach((el) => {
        // console.log('checking data for tags >>>', el);
        el.data.forEach((data_) => {
          if (data_ && data_.tags) {
            tagsArr.push(...data_.tags);
          }
        });
      });
      tagsArr = _.uniqBy(tagsArr, 'tag_id');
      updateState({
        ProductTags: tagsArr.map((el) => {
          return {
            ...el.tag,
            isSelected: false,
          };
        }),
      });
    }
  };

  /*********Add product to wish list******* */
  const _onAddtoWishlist = (item) => {
    playHapticEffect(hapticEffects.impactLight);
    if (!!userData?.auth_token) {
      updateState({isLoadingB: true});
      actions
        .updateProductWishListData(
          `/${item.id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          console.log(res, 'updateProductWishListData');
          showSuccess(res.message);
          updateProductList(item);
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
      updateState({isLoadingB: false});
    }
  };

  /*******Upadte products in wishlist>*********/
  const updateProductList = (item) => {
    let newArray = cloneDeep(productListData);
    newArray = newArray.map((i, inx) => {
      if (i.id == item.id) {
        if (item.inwishlist) {
          i.inwishlist = null;
          return {...i, inwishlist: null};
        } else {
          return {...i, inwishlist: {product_id: i.id}};
        }
      } else {
        return i;
      }
    });
    updateState({
      productListData: newArray,
      isLoadingB: false,
      updateQtyLoader: false,
      selectedItemID: -1,
    });
  };

  const errorMethod = (error) => {
    console.log('checking error', error);
    updateState({
      updateQtyLoader: false,
      selectedItemID: -1,
      btnLoader: false,
      isLoading: false,
    });
    showError(error?.message || error?.error);
  };

  console.log('pageNopageNo', pageNo);
  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
    getAllListItems(pageNo + 1);
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const checkSingleVendor = async (id) => {
    let vendorData = {vendor_id: categoryInfo?.id};
    updateState({selectedItemID: id});
    return new Promise((resolve, reject) => {
      actions
        .checkSingleVendor(vendorData, {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          console.log('res check singel vendro==>>>>>>', res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
          updateState({selectedItemID: -1});
        });
    });
  };

  const clearCartAndAddProduct = async (item, section = null) => {
    updateState({updateQtyLoader: true});
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
        console.log('clear cart res', res);
        // alert("add single item")
        addSingleItem(item, section);
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const hideDifferentAddOns = () => {
    updateState({differentAddsOnsModal: false, differentAddsOns: []});
  };

  const addSingleItem = async (item, section = null) => {
    console.log('checking item info >>>', item);

    if (
      !!categoryInfo?.is_vendor_closed &&
      !categoryInfo?.show_slot &&
      !categoryInfo?.closed_store_order_scheduled
    ) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    playHapticEffect(hapticEffects.impactLight);
    let getTypeId = !!item?.category && item?.category.category_detail?.type_id;
    updateState({selectedItemID: item?.id, btnLoader: true});
    let isSingleVendor = await checkSingleVendor(item.id);
    console.log('is singel vendor', isSingleVendor);

    if (
      isSingleVendor.isSingleVendorEnabled == 1 &&
      isSingleVendor.otherVendorExists == 1
    ) {
      updateState({
        updateQtyLoader: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      Alert.alert('', strings.ALREADY_EXIST, [
        {
          text: strings.CANCEL,
          onPress: () => {},
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: () => clearCartAndAddProduct(item, section),
        },
      ]);
      return;
    }

    // return;

    if (item?.add_on?.length !== 0 || item?.variantSet?.length !== 0) {
      updateState({
        updateQtyLoader: false,
        typeId: getTypeId,
        isVisibleModal: true,
        selectedCartItem: item,
        selectedSection: section,
        selectedItemID: -1,
        btnLoader: false,
      });
      return;
    }
    if (item?.add_on?.length === 0 && item?.mode_of_service === 'schedule') {
      updateState({
        updateQtyLoader: false,
        typeId: getTypeId,
        isVisibleModal: true,
        selectedCartItem: item,
        selectedSection: section,
        selectedItemID: -1,
        btnLoader: false,
      });
      return;
    }

    let data = {};
    data['sku'] = item.sku;
    data['quantity'] = !!item?.minimum_order_count
      ? Number(item?.minimum_order_count)
      : 1;
    data['product_variant_id'] = item?.variant[0]?.id;
    data['type'] = dine_In_Type;
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res.data, 'add single item addProductsToCart');
        actions.cartItemQty(res);
        updateState({cartId: res.data.id});
        // showSuccess('Product successfully added');
        if (!!section) {
          let updatedSection = section.data.map((x, xnx) => {
            if (x?.id == item?.id) {
              x['qty'] = !!item?.minimum_order_count
                ? Number(item?.minimum_order_count)
                : 1;
              x['cart_product_id'] = res.data.cart_product_id;
              return x;
            }
            return x;
          });
          section['data'] = updatedSection;
          const filteredArr = sectionListData.map((f, fnx) => {
            if (f?.id == section?.id) {
              return section;
            }
            return f;
          });
          updateState({
            sectionListData: filteredArr,
            cloneSectionList: filteredArr,
          });
          // fetchTags(filteredArr)
        } else {
          let updateArray = productListData.map((val, i) => {
            if (val.id == item.id) {
              return {
                ...val,
                qty: !!item?.minimum_order_count
                  ? Number(item?.minimum_order_count)
                  : 1,
                cart_product_id: res.data.cart_product_id,
                isRemove: false,
              };
            }
            return val;
          });
          updateState({
            productListData: updateArray,
          });
        }
        updateState({
          selectedCartItem: item,
          updateQtyLoader: false,
          selectedSection: section,
          selectedItemID: -1,
          btnLoader: false,
        });
      })
      .catch((error) => errorMethodSecond(error, [], item, section));
  };

  const addDeleteCartItems = async (
    item,
    isExistqty,
    isExistproductId,
    isExistCartId,
    section = null,
    index,
    type,
    updateLocalQty = null,
    differentAddsOnsQty = null,
  ) => {
    console.log('categoryInfocategoryInfo', categoryInfo);
    if (
      !!categoryInfo?.is_vendor_closed &&
      !categoryInfo?.show_slot &&
      !categoryInfo?.closed_store_order_scheduled
    ) {
      if (type == 1) {
        //user can remove item if vendor closed
        alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
        return;
      }
    }
    let quantityToIncreaseDecrease = !!item?.batch_count
      ? Number(item?.batch_count)
      : 1;
    playHapticEffect(hapticEffects.impactLight);

    let quanitity = null;
    let itemToUpdate = cloneDeep(item);

    console.log('exist qty', isExistqty);
    /** This will restring unneccessary api call , only hit api once user wait for 1.5 seconds ***/

    if (timeOut) {
      clearTimeout(timeOut);
    }

    tempQty = tempQty + 1;

    if (type == 1) {
      quanitity = Number(isExistqty) + quantityToIncreaseDecrease;
    } else {
      console.log(isExistqty, item?.minimum_order_count, 'kdhgkjdfkjgh');
      if (
        Number(isExistqty - item?.batch_count) <
        Number(item?.minimum_order_count)
      ) {
        quanitity = 0;
      } else {
        quanitity = Number(isExistqty) - quantityToIncreaseDecrease;
      }
    }

    updateLocally(
      section,
      quanitity,
      item,
      isExistproductId,
      differentAddsOnsQty,
    );

    timeOut = setTimeout(
      () => {
        if (quanitity) {
          updateState({
            selectedItemID: itemToUpdate.id,
            btnLoader: true,
            selectedItemIndx: index,
          });
          let data = {};
          data['cart_id'] = isExistCartId;
          data['quantity'] = !!updateLocalQty
            ? type == 1
              ? updateLocalQty + quantityToIncreaseDecrease
              : updateLocalQty - quantityToIncreaseDecrease
            : quanitity;
          data['cart_product_id'] = isExistproductId;
          data['type'] = dineInType;
          console.log('sending api data', data);

          actions
            .increaseDecreaseItemQty(data, {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              systemuser: DeviceInfo.getUniqueId(),
            })
            .then((res) => {
              console.log('update qty res', res);
              tempQty = 0;
              actions.cartItemQty(res);
              updateState({
                cartItems: res.data.products,
                cartData: res.data,
                updateQtyLoader: false,
                selectedItemID: -1,
                btnLoader: false,
              });
            })
            .catch(async () => {
              errorMethod();
              if (type == 1) {
                quanitity = quanitity - tempQty;
              } else {
                quanitity = quanitity + tempQty;
              }
              await updateLocally(section, quanitity, item, isExistproductId);
              tempQty = 0;
            });
        } else {
          updateState({
            selectedItemID: itemToUpdate?.id,
            btnLoader: false,
          });
          removeItem('selectedTable');
          removeProductFromCart(itemToUpdate, section, isExistproductId);
        }
      },
      quanitity === 1 ? 0 : 700,
    );
  };

  const updateLocally = (
    section,
    quanitity,
    item,
    isExistproductId,
    differentAddsOnsQty,
  ) => {
    console.log('quanitity', quanitity);
    console.log('quanitity localy', differentAddsOnsQty);

    // return;
    if (!!section) {
      let updatedSection = section.data.map((x, xnx) => {
        if (x?.id == item?.id) {
          return {
            ...x,
            qty: !!differentAddsOnsQty ? differentAddsOnsQty : quanitity,
            cart_product_id: isExistproductId,
            isRemove: false,
          };
        }
        return x;
      });
      section['data'] = updatedSection;
      const filteredArr = sectionListData.map((f, fnx) => {
        if (f?.id == section?.id) {
          return section;
        }
        return f;
      });
      updateState({
        ...state,
        sectionListData: filteredArr,
        cloneSectionList: filteredArr,
        selectedItemID: -1,
        storeLocalQty: differentAddsOnsQty,
      });
      // fetchTags(filteredArr)
    } else {
      let updateArray = productListData.map((val, i) => {
        if (val.id == item.id) {
          return {
            ...val,
            qty: !!differentAddsOnsQty ? differentAddsOnsQty : quanitity,
            cart_product_id: isExistproductId,
            isRemove: false,
          };
        }
        return val;
      });
      updateState({
        productListData: updateArray,
        selectedItemID: -1,
        storeLocalQty: differentAddsOnsQty,
      });
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (
    itemToUpdate,
    section = null,
    diffAdOnId = 0,
  ) => {
    // console.log("item to update remove item", itemToUpdate)

    let updateLocallyAddOns = [];
    if (differentAddsOnsModal) {
      let cloneArr = differentAddsOns;
      updateLocallyAddOns = cloneArr.filter((val) => {
        if (diffAdOnId !== val.id) {
          return val;
        }
      });
      updateState({differentAddsOns: updateLocallyAddOns});
    }

    let data = {};
    let isExistproductId = diffAdOnId;
    let isExistCartId =
      !!itemToUpdate?.check_if_in_cart_app &&
      !!itemToUpdate?.check_if_in_cart_app.length > 0
        ? itemToUpdate?.check_if_in_cart_app[0]?.cart_id
        : cartId;
    console.log('item', itemToUpdate);

    data['cart_id'] = isExistCartId;
    data['cart_product_id'] = isExistproductId;
    data['type'] = dineInType;
    updateState({btnLoader: true});
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        if (!!section) {
          let updatedSection = section.data.map((x, xnx) => {
            if (x?.id == itemToUpdate?.id) {
              return {
                ...x,
                qty: null,
                cart_product_id: res.data.cart_product_id,
                check_if_in_cart_app: differentAddsOnsModal
                  ? updateLocallyAddOns
                  : [],
                // variant: itemToUpdate?.variant.map((val, i) => {
                //   return { ...val, check_if_in_cart_app: differentAddsOnsModal ? updateLocallyAddOns : [] };
                // }),
              };
            }
            return x;
          });
          section['data'] = updatedSection;
          updateState({
            sectionListData: sectionListData.map((f, fnx) => {
              if (f?.id == section?.id) {
                return section;
              }
              return f;
            }),
            cloneSectionList: cloneSectionList.map((f, fnx) => {
              if (f?.id == section?.id) {
                return section;
              }
              return f;
            }),
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        } else {
          let updateArray = productListData.map((val, i) => {
            if (val.id == itemToUpdate.id) {
              return {
                ...val,
                qty: null,
                cart_product_id: res.data.cart_product_id,
                check_if_in_cart_app: differentAddsOnsModal
                  ? updateLocallyAddOns
                  : [],
                // variant: itemToUpdate?.variant.map((val, i) => {
                //   return { ...val, check_if_in_cart_app: differentAddsOnsModal ? updateLocallyAddOns : [] };
                // }),
              };
            }
            return val;
          });
          updateState({
            productListData: updateArray,
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        }
      })
      .catch(errorMethod);
  };

  const errorMethodSecond = (error, addonSet = [], item, section) => {
    console.log(error, 'Error>>>>>');
    updateState({updateQtyLoader: false});
    if (error?.message?.alert == 1) {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: strings.CLEARCART,
          onPress: () => clearCart(addonSet, item, section),
        },
      ]);
    } else {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      showError(error?.message || error?.error);
    }
  };

  const clearCart = async (addonSet = [], item, section) => {
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
        addSingleItem(item, section);
        if (addonSet) {
        } else {
          // addToCart();
        }
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const onRepeat = async () => {
    // console.log("repeate items", repeatItems)
    const {item, isExistqty, productId, parentCartId, updateLocalQty} =
      repeatItems;
    await addDeleteCartItems(
      item,
      isExistqty,
      productId,
      parentCartId,
      repeatItems?.section,
      repeatItems?.index,
      1,
      updateLocalQty,
    );
    updateState({repeatItems: null});
  };

  const onAddNew = () => {
    if (
      !!categoryInfo?.is_vendor_closed &&
      !categoryInfo?.show_slot &&
      !categoryInfo?.closed_store_order_scheduled
    ) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    let getTypeId =
      !!repeatItems?.item?.category &&
      repeatItems?.item?.category.category_detail?.type_id;
    updateState({
      repeatItems: null,
      updateQtyLoader: false,
      typeId: getTypeId,
      isVisibleModal: true,
      selectedCartItem: repeatItems?.item,
      selectedItemID: -1,
      btnLoader: false,
    });
  };

  const addProductsWithoutCustomize = (item, section, index, type) => {
    console.log('very nice', item);
    // return;
    let itemToUpdate = cloneDeep(item);
    let quanitity = !!itemToUpdate?.qty
      ? itemToUpdate?.qty
      : itemToUpdate?.check_if_in_cart_app[0].quantity;
    let productId = !!itemToUpdate?.cart_product_id
      ? itemToUpdate?.cart_product_id
      : itemToUpdate?.check_if_in_cart_app[0].id;
    let parentCartId = !!cartId
      ? cartId
      : itemToUpdate?.check_if_in_cart_app[0].cart_id;

    if (type == 1) {
      addDeleteCartItems(
        item,
        quanitity,
        productId,
        parentCartId,
        section,
        index,
        1,
      );
    } else {
      addDeleteCartItems(
        item,
        quanitity,
        productId,
        parentCartId,
        section,
        index,
        2,
      );
    }
  };

  const checkIsCustomize = async (item, section = null, index, type) => {
    let itemToUpdate = cloneDeep(item);
    console.log('check item to update', itemToUpdate);
    // return;
    if (item.add_on.length == 0 && item.variantSet.length == 0) {
      // hit in case of simple products withou any customization
      addProductsWithoutCustomize(item, section, index, type);
      return;
    }

    let productId = !!itemToUpdate?.cart_product_id
      ? itemToUpdate?.cart_product_id
      : itemToUpdate?.check_if_in_cart_app[0]?.id;
    let parentCartId = !!cartId
      ? cartId
      : itemToUpdate.check_if_in_cart_app[0]?.cart_id;

    var totalProductQty = 0;
    if (itemToUpdate?.variant && itemToUpdate?.check_if_in_cart_app) {
      itemToUpdate?.check_if_in_cart_app.map((val) => {
        totalProductQty = totalProductQty + val?.quantity;
      });
    }

    // return;

    var isExistqty = itemToUpdate?.qty ? itemToUpdate?.qty : totalProductQty; //this variable contain only local product quantity
    var tempQty = 0; //this variable contain latest updated quantity of products

    if (
      (type == 2 && item?.add_on?.length > 0) ||
      item?.variantSet?.length > 0
    ) {
      //hit in case of subtruction
      let apiData = {cart_id: parentCartId, product_id: item.id};
      let checkIsAvailable = await getDiffAddsOn(apiData, section, item); //check products with different addOns is exist or not.
      // console.log("check available", checkIsAvailable)

      !!checkIsAvailable?.data &&
        checkIsAvailable?.data.map((val) => {
          console.log('check available', val);
          tempQty = tempQty + val?.quantity; //store updated total quantity of products
        });

      if (!!checkIsAvailable?.goNext) {
        //if different adOns is exist then open DifferentAddOns Modal.
        return;
      }
    }

    if (type == 2) {
      // direct subtract customize items if products added with same addons

      addDeleteCartItems(
        item,
        tempQty == 0 ? isExistqty : tempQty,
        productId,
        parentCartId,
        section,
        index,
        2,
      );
      return;
    }

    if (type == 1) {
      //hit in case of add new products
      let apiData = {cart_id: parentCartId, product_id: item.id};
      let header = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      };
      console.log('api data checkLastAdded', apiData);
      try {
        const res = await actions.checkLastAdded(apiData, header);
        console.log('res++++++', res);
        if (!!res.data) {
          //open RepeatModal
          const addData = {
            item: item,
            index: index,
            type: type,
            section: section,
            isExistqty: tempQty == 0 ? isExistqty : tempQty,
            updateLocalQty: res.data?.quantity,
            productId: res?.data?.id,
            parentCartId: res.data.cart_id,
          };
          console.log('is++ exist qty', tempQty == 0 ? isExistqty : tempQty);
          console.log('is++ update local qty', res.data?.quantity);

          updateState({repeatItems: addData, selectedSection: section});
        }
      } catch (error) {
        console.log('error riased++++', error);
        showError(error?.message || error?.error);
      }
      return;
    }
  };

  const getDiffAddsOn = async (apiData, section, item) => {
    console.log('get diffadds on data', apiData);
    let header = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      systemuser: DeviceInfo.getUniqueId(),
    };
    try {
      const res = await actions.differentAddOns(apiData, header);
      console.log('res+++++++', res);
      if (res?.data.length > 1) {
        updateState({
          differentAddsOns: res?.data || [],
          selectedDiffAdsOnItem: item,
          selectedDiffAdsOnSection: section,
          diffAddOnCartIdProductId: {
            cart_id: apiData?.cart_id,
            product_id: apiData?.product_id,
          },
          differentAddsOnsModal: true,
        });
        return {data: res?.data, goNext: true};
      }
      return {data: res?.data, goNext: false};
    } catch (error) {
      console.log('error raised,error');
      return {data: null, goNext: false};
    }
  };

  const difAddOnsAdded = async (
    item,
    qty,
    productId,
    cartId,
    section,
    index,
    type,
  ) => {
    let batchCount = !!item?.batch_count ? item?.batch_count : 1;
    let differentAddsOnsQty = 0;
    let cloneArr = differentAddsOns;
    let updateLocallyAddOns = cloneArr.map((val) => {
      differentAddsOnsQty = differentAddsOnsQty + val.quantity;
      if (cartId == val.id) {
        return {
          ...val,
          quantity: type == 1 ? qty + batchCount : qty - batchCount,
        };
      }
      return val;
    });
    await addDeleteCartItems(
      item,
      qty,
      cartId,
      productId,
      section,
      index,
      type,
      null,
      type == 1
        ? differentAddsOnsQty + batchCount
        : differentAddsOnsQty - batchCount, //send updated total quantity
    );
    updateState({differentAddsOns: updateLocallyAddOns});
  };

  const renderProduct = ({item, index}) => {
    return (
      <Animatable.View animation={'slideInUp'} delay={index * 5}>
        <ProductCard3
          data={item}
          index={index}
          onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
          onAddtoWishlist={() => _onAddtoWishlist(item)}
          addToCart={() => addSingleItem(item, null, index)}
          onIncrement={() => checkIsCustomize(item, null, index, 1)}
          onDecrement={() => checkIsCustomize(item, null, index, 2)}
          selectedItemID={selectedItemID}
          btnLoader={false}
          selectedItemIndx={selectedItemIndx}
          differentAddsOns={differentAddsOns}
          businessType={businessType}
          categoryInfo={categoryInfo}
        />
        <View style={styles.horizontalLine} />
      </Animatable.View>
    );
  };

  const updateCartItems = (item, quanitity, productId, cartID) => {
    playHapticEffect(hapticEffects.impactLight);
    console.log('selcted section', selectedSection);

    if (!!selectedSection) {
      let updatedSection = selectedSection.data.map((x, xnx) => {
        if (x?.id == item?.id) {
          return {
            ...x,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        return x;
      });
      selectedSection['data'] = updatedSection;
      updateState({
        sectionListData: sectionListData.map((f, fnx) => {
          if (f?.id == selectedSection?.id) {
            return selectedSection;
          }
          return f;
        }),
        cloneSectionList: cloneSectionList.map((f, fnx) => {
          if (f?.id == selectedSection?.id) {
            return selectedSection;
          }
          return f;
        }),
        cartId: cartID,
        storeLocalQty: quanitity,
        isVisibleModal: false,
      });
    } else {
      let updateArray = productListData.map((val, i) => {
        if (val.id == item.id) {
          return {
            ...val,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        updateState({storeLocalQty: quanitity});
        return val;
      });
      updateState({
        cartId: cartID,
        productListData: updateArray,
        isVisibleModal: false,
      });
    }
  };

  useEffect(() => {
    if (isLoadingC) {
      getAllProductsByCategoryId(true);
      if (productListId?.vendor && routeData) {
        fetchOffers();
      }

      // getAllProductTags();
    }
  }, [isLoadingC]);

  const checkIfItemExist = (item, tags) => {
    let result = false;
    tags.forEach((el) => {
      if (el.id === item.tag_id) {
        result = true;
      }
    });
    return result;
  };

  useEffect(() => {
    let EnabledTags = ProductTags.filter((el) => el.isSelected);
    if (EnabledTags.length > 0) {
      const newArr = sectionListData.map((el) => {
        const records =
          el.data &&
          el.data.filter((item) => {
            if (
              item.tags.length > 0 &&
              checkIfItemExist(item.tags[0], EnabledTags)
            )
              return item;
          });
        const newObj = {
          ...el,
        };
        newObj.data = records;
        return newObj;
      });
      updateState({cloneSectionList: newArr});
    } else {
      // getAllProductsByVendor();
    }
  }, [ProductTags && updateTagFilter]);

  const onPressChildCards = (item) => {
    console.log(item, 'item upload');
    updateState({
      selectedCategory: item,
      // productListData: [],
      productListId: item,
      pageNo: 1,
      limit: 30,
      isLoadingC: true,
    });

    // navigation.push(navigationStrings.PRODUCT_LIST, {data: item});
  };

  const onSearchWithinMenu = (text) => {
    updateState({searchInput: text});
    if (text) {
      const newArr = sectionListData.map((el) => {
        const records =
          el.data &&
          el.data.filter((item) => {
            return item?.translation[0]?.title
              .toLowerCase()
              .includes(text.toLowerCase());
          });
        const newObj = {
          ...el,
        };

        newObj.data = records;
        return newObj;
        // console.log('checking products >>>>>', records)
        // Arr.push(...records)
      });
      updateState({cloneSectionList: newArr});
    } else {
      getAllProductsByVendor();
      // updateState({ cloneSectionList: sectionListData })
    }
  };

  const fetchOffers = () => {
    let data = {};
    // data['vendor_id'] = 2;
    data['vendor_id'] = productListId?.id;
    // data['cart_id'] = vendorInfo.cartId;
    // console.log(data, 'vendor_id');
    actions
      .getAllPromoCodesForProductList(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        // console.log('res >>>>>>> offers >>>', res);
        if (res && res.data) {
          updateState({offerList: res.data});
        }
      });
    // .catch(errorMethod);
  };

  const RenderMenuView = () => {
    return (
      <View>
        {/* <View style={{ paddingHorizontal: moderateScale(15), width: '100%', borderBottomColor: colors.greyMedium, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: textScale(14), fontFamily: fontFamily.regular }}>Recommended</Text>
        <Text style={{ fontSize: textScale(14), fontFamily: fontFamily.regular }}>2</Text>
                </View> */}
        <ScrollView style={{width: '100%'}}>
          <Text
            style={{
              paddingHorizontal: moderateScale(16),
              fontSize: textScale(14),
              fontFamily: fontFamily.medium,
            }}>
            Menu
          </Text>
          <View
            style={{
              width: '100%',
              height: 1,
              marginVertical: moderateScaleVertical(10),
            }}
          />
          {cloneSectionList.map((el, index) => {
            console.log('checking dtaa on tap >>>', activeIdx);
            const idx = index + 1;
            const temp = el.data.length + idx * 2;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  activeIdx = index;
                  let cells = [];
                  cloneSectionList.forEach((el, ind) => {
                    if (index > ind) {
                      cells.push(...el.data);
                    }
                  });
                  let hight = Number(cells.length) * 160;
                  playHapticEffect(hapticEffects.rigid);
                  updateState({MenuModalVisible: !MenuModalVisible});
                  sectionListRef.current.sectionList.current._wrapperListRef._listRef._scrollRef.scrollTo(
                    {
                      // x: (height / 7.5) * idx * idx,
                      // y: (height / 7.5) * idx * idx,

                      // x: (height / 7.5) * temp * idx,
                      // y: (height / 7.5) * temp * idx,
                      x: hight + 200,
                      y: hight + 200,
                      animated: true,
                    },
                  );
                }}
                style={{
                  borderBottomWidth: 0,
                  paddingHorizontal: moderateScale(15),
                  width: '100%',
                  borderBottomColor: colors.greyMedium,
                  marginBottom: moderateScale(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize:
                      activeIdx === index ? textScale(13.5) : textScale(13),
                    marginBottom: moderateScale(5),
                    fontFamily:
                      activeIdx === index
                        ? fontFamily.medium
                        : fontFamily.regular,
                  }}>
                  {el.title}
                </Text>
                <Text
                  style={{
                    fontSize:
                      activeIdx === index ? textScale(13.5) : textScale(13),
                    marginBottom: moderateScale(5),
                    fontFamily:
                      activeIdx === index
                        ? fontFamily.medium
                        : fontFamily.regular,
                  }}>
                  {el.data.length}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const RenderOfferView = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: textScale(14),
            paddingHorizontal: moderateScale(15),
            fontFamily: fontFamily.regular,
          }}>
          {strings.AVAILABLE_OFFERS}
        </Text>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: colors.greyMedium,
            marginVertical: moderateScaleVertical(10),
          }}
        />
        <ScrollView style={{width: '100%'}}>
          {offerList?.length > 0 &&
            offerList.map((el, indx) => {
              // console.log(el);
              return (
                <View
                  key={indx}
                  style={{
                    borderBottomWidth: 1,
                    paddingHorizontal: moderateScale(15),
                    width: '100%',
                    borderBottomColor: colors.greyMedium,
                    marginBottom: moderateScale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: textScale(13),
                      marginBottom: moderateScale(5),
                      fontFamily: fontFamily.regular,
                    }}>
                    {el.title ? el.title : ''}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(11),
                      marginBottom: moderateScale(5),
                      color: colors.textGreyOpcaity7,
                      fontFamily: fontFamily.regular,
                    }}>
                    {el.title ? el.title : ''}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      borderTopWidth: 1,
                      borderTopColor: colors.greyMedium,
                      alignItems: 'center',
                      paddingTop: moderateScaleVertical(15),
                      marginTop: moderateScale(8),
                      paddingBottom: moderateScale(15),
                    }}>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: themeColors.primary_color,
                        borderRadius: moderateScale(3),
                        paddingHorizontal: moderateScale(7),
                        paddingVertical: moderateScale(4),
                        borderStyle: 'dashed',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: textScale(11),
                          fontFamily: fontFamily.regular,
                          textTransform: 'uppercase',
                        }}>
                        {el.name ? el.name : ''}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(`${el.name ? el.name : ''}`);
                        Toast.show(strings.COPIED);
                      }}>
                      <Text
                        style={{
                          fontSize: textScale(11),
                          color: themeColors.primary_color,
                          fontFamily: fontFamily.regular,
                        }}>
                        {strings.TAP_TO_COPY}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  };

  const listHeaderComponent2 = () => {
    return (
      <View>
        {!!categoryInfo?.categoriesList ? (
          <View style={{marginBottom: moderateScaleVertical(16)}}>
            <ImageBackground
              source={{
                uri: getImageUrl(
                  // data?.item?.banner.image_fit ||
                  categoryInfo?.banner?.image_fit ||
                    categoryInfo?.image?.image_fit,
                  // data?.item?.banner.image_path ||
                  categoryInfo?.banner?.image_path ||
                    categoryInfo?.image?.image_path,
                  '400/400',
                ),
              }}
              style={{
                // ...styles.imageBackgroundHdr,
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity15
                  : colors.greyColor,
              }}
              resizeMode="cover">
              <LinearGradient
                style={{}}
                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.7)']}>
                <SafeAreaView>
                  <TouchableOpacity
                    hitSlop={styles.hitSlopProp}
                    activeOpacity={0.7}
                    style={{
                      width: moderateScale(30),
                      height: moderateScale(30),
                      justifyContent: 'center',
                      marginLeft: moderateScale(10),
                      paddding: 10,
                    }}
                    onPress={() => navigation.goBack()}>
                    <Image
                      source={imagePath.icBackb}
                      style={{
                        tintColor: colors.white,
                        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                      }}
                    />
                  </TouchableOpacity>

                  <View
                    style={{
                      width: width,
                      paddingLeft: moderateScale(13),
                      marginBottom: moderateScaleVertical(8),
                    }}>
                    <View
                      style={{
                        marginTop: moderateScale(10),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          ...styles.hdrTitleTxt,
                          flex: 0,
                          textAlign: 'left',
                          fontSize: textScale(15),
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.white,
                        }}>
                        {data?.name || categoryInfo?.name || ''}
                      </Text>

                      {!!categoryInfo &&
                        !!categoryInfo?.product_avg_average_rating && (
                          <View
                            style={[
                              styles.hdrRatingTxtView,
                              {
                                backgroundColor: colors.yellowC,
                                width: moderateScale(50),
                                justifyContent: 'center',
                                height: moderateScale(20),
                              },
                            ]}>
                            <Text
                              style={[
                                styles.ratingTxt,
                                {fontSize: textScale(9.5)},
                              ]}>
                              {Number(
                                categoryInfo?.product_avg_average_rating,
                              ).toFixed(1)}
                            </Text>
                            <Image
                              style={styles.starImg}
                              source={imagePath.star}
                              resizeMode="contain"
                            />
                          </View>
                        )}
                    </View>
                    <View
                      style={{
                        marginTop: moderateScale(5),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        // numberOfLines={2}
                        style={{
                          ...styles.hdrTitleTxt,
                          flex: 0,
                          fontSize: textScale(12.5),
                          fontFamily: fontFamily.regular,
                          textAlign: 'left',
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.white,
                          width: width / 1.5,
                        }}>
                        {categoryInfo?.address || ''}
                      </Text>

                      {!!categoryInfo &&
                      !categoryInfo?.closed_store_order_scheduled ? (
                        <View
                          style={[
                            styles.hdrRatingTxtView,
                            {
                              justifyContent: 'center',
                              height: moderateScale(20),
                              backgroundColor: categoryInfo?.show_slot
                                ? colors.green
                                : categoryInfo?.is_vendor_closed
                                ? colors.redB
                                : colors.green,
                            },
                          ]}>
                          <Text
                            style={{
                              ...styles.ratingTxt,
                              color: colors.white,
                              fontSize: textScale(9.5),
                            }}>
                            {categoryInfo?.show_slot
                              ? strings.OPEN
                              : categoryInfo?.is_vendor_closed
                              ? strings.CLOSE
                              : strings.OPEN}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {Number(categoryInfo?.order_min_amount) > 0 ? (
                      <View
                        style={{
                          backgroundColor: colors.redB,
                          width: moderateScale(230),
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: moderateScaleVertical(30),
                          // paddingHorizontal: moderateScale(10),
                          // paddingVertical: moderateScaleVertical(10),
                          borderRadius: moderateScale(6),
                          marginTop: moderateScale(10),
                        }}>
                        <Text
                          style={{
                            fontSize: textScale(12),
                            fontFamily: fontFamily.medium,
                            color: colors.white,
                          }}>
                          Minimum order value{' '}
                          {currencies?.primary_currency?.symbol}
                          {categoryInfo?.order_min_amount}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </SafeAreaView>
              </LinearGradient>

              {/* ****************************************/}
              <View
                style={{
                  // backgroundColor: 'pink'
                  ...styles.hdrAbsoluteView,
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.white,
                  // // minHeight: moderateScale(80),
                }}>
                {!!categoryInfo && !!categoryInfo?.categoriesList ? (
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        ...styles.milesTxt,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginRight: moderateScale(40),
                        marginVertical: moderateScale(1),
                        marginLeft: 0,
                        fontSize: textScale(13),
                        opacity: 0.8,
                        fontFamily: fontFamily.medium,
                      }}>
                      {categoryInfo?.categoriesList || ''}
                    </Text>
                    {!!desc && (
                      <Text
                        numberOfLines={2}
                        style={{
                          ...styles.milesTxt,
                          marginLeft: 0,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                          marginVertical: moderateScaleVertical(4),
                          fontSize: textScale(10.5),
                          opacity: 0.6,
                        }}>
                        {desc}
                      </Text>
                    )}
                  </View>
                ) : null}
                {!!categoryInfo?.closed_store_order_scheduled ? (
                  <Text
                    style={{
                      ...commonStyles.mediumFont14Normal,
                      fontSize: textScale(10),
                      textAlign: 'left',
                      color: colors.redB,
                      // marginTop: moderateScaleVertical(4)
                    }}>
                    {strings.WE_ARE_NOT_ACCEPTING} {categoryInfo?.delaySlot}
                  </Text>
                ) : null}
              </View>
            </ImageBackground>
          </View>
        ) : (
          <Animatable.View
            // key={AnimatedHeaderValue}
            // duration={10}
            animation={'fadeIn'}
            style={{
              ...styles.headerStyle,
              marginBottom: moderateScale(12),
              // height: 52
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                hitSlop={styles.hitSlopProp}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                  source={imagePath.icBackb}
                />
              </TouchableOpacity>

              <View style={{marginLeft: moderateScale(8), flex: 0.7}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RoundImg
                    img={getImageUrl(uri1, uri2, '400/400')}
                    size={30}
                    isDarkMode={isDarkMode}
                    MyDarkTheme={MyDarkTheme}
                  />
                  <View style={{marginLeft: moderateScale(8)}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        fontSize: moderateScale(14),
                        fontFamily: fontFamily.medium,
                      }}>
                      {name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {isSearch ? (
              <Animatable.View
              // animation="fadeIn"
              >
                <SearchBar
                  containerStyle={{
                    marginHorizontal: moderateScale(18),
                    borderRadius: 8,
                    width: width / 1.15,
                    backgroundColor: isDarkMode
                      ? colors.whiteOpacity15
                      : colors.greyColor,
                    height: moderateScaleVertical(37),
                  }}
                  searchValue={searchInput}
                  placeholder={strings.SEARCH_ITEM}
                  // onChangeText={(value) => onChangeText(value)}
                  showRightIcon
                  rightIconPress={() =>
                    updateState({
                      searchInput: '',
                      isSearch: false,
                      isLoading: false,
                    })
                  }
                />
              </Animatable.View>
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  // onPress={() => updateState({isSearch: true})}
                  onPress={moveToNewScreen(
                    navigationStrings.SEARCHPRODUCTOVENDOR,
                    {
                      type: data?.vendor
                        ? staticStrings.VENDOR
                        : staticStrings.CATEGORY,
                      id: data?.vendor ? data?.id : productListId?.id,
                    },
                  )}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                    source={!!data?.showAddToCart ? false : imagePath.icSearchb}
                  />
                </TouchableOpacity>
                <View style={{marginHorizontal: moderateScale(8)}} />
                <TouchableOpacity
                  onPress={onShare}
                  hitSlop={hitSlopProp}
                  activeOpacity={0.8}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                    source={imagePath.icShareb}
                  />
                </TouchableOpacity>
              </View>
            )}
          </Animatable.View>
        )}

        {!(
          categoryInfo &&
          categoryInfo?.lineOfSightDistance == undefined &&
          categoryInfo.lineOfSightDistance == null &&
          categoryInfo?.timeofLineOfSightDistance == undefined &&
          categoryInfo.timeofLineOfSightDistance == null &&
          offerList?.length === 0
        ) && (
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: width / 1.11,
              alignSelf: 'center',
              borderBottomWidth: 1,
              borderBottomColor: colors.greyMedium,
              // marginBottom: moderateScale(15),
              paddingBottom: moderateScaleVertical(10),
              paddingHorizontal: moderateScale(10),
            }}>
            {categoryInfo?.lineOfSightDistance != undefined &&
            categoryInfo.lineOfSightDistance != null ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    backgroundColor: colors.greyColor,
                    width: moderateScale(30),
                    height: moderateScale(30),
                    borderRadius: moderateScale(30),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image source={imagePath.ic_pinIcon} />
                </View>

                <Text
                  style={{
                    ...styles.milesTxt,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    opacity: 1,
                    fontSize: textScale(10),
                  }}>
                  {categoryInfo.lineOfSightDistance}
                </Text>
              </View>
            ) : null}

            {categoryInfo?.timeofLineOfSightDistance != undefined &&
              categoryInfo.timeofLineOfSightDistance != null && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      backgroundColor: colors.greyColor,
                      width: moderateScale(30),
                      height: moderateScale(30),
                      borderRadius: moderateScale(30),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image source={imagePath.ic_timeIcon} />
                  </View>
                  {categoryInfo?.timeofLineOfSightDistance != undefined &&
                  categoryInfo.timeofLineOfSightDistance != null ? (
                    <Text
                      style={{
                        ...styles.milesTxt,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        opacity: 1,
                        fontSize: textScale(10),
                      }}>
                      {checkEvenOdd(categoryInfo.timeofLineOfSightDistance)}-
                      {checkEvenOdd(categoryInfo.timeofLineOfSightDistance + 5)}
                    </Text>
                  ) : null}
                </View>
              )}

            {offerList?.length > 0 && (
              <TouchableOpacity
                onPress={() =>
                  updateState({offersModalVisible: !offersModalVisible})
                }
                activeOpacity={0.7}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    backgroundColor: colors.greyColor,
                    width: moderateScale(30),
                    height: moderateScale(30),
                    borderRadius: moderateScale(30),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image source={imagePath.ic_offersIcon} />
                </View>
                <Text
                  style={{
                    ...styles.milesTxt,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    opacity: 1,
                    fontSize: textScale(10),
                  }}>
                  {strings.OFFERS}
                </Text>
                <Image
                  source={imagePath.icBackb}
                  style={{
                    transform: [{rotate: '-90deg'}],
                    width: moderateScale(11),
                    height: moderateScale(11),
                    resizeMode: 'contain',
                    marginLeft: moderateScale(6),
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: moderateScale(20),
            marginBottom: moderateScale(15),
          }}
          contentContainerStyle={{alignItems: 'center'}}>
          {ProductTags &&
            ProductTags.map((el, index) => {
              return (
                <View
                  key={index}
                  style={{flexDirection: 'row', marginTop: moderateScale(20)}}>
                  <ToggleSwitch
                    isOn={el.isSelected}
                    onColor={colors.green}
                    offColor={
                      isDarkMode ? MyDarkTheme.colors.text : colors.borderLight
                    }
                    size="small"
                    onToggle={() => {
                      playHapticEffect(hapticEffects.impactLight);
                      const updatedArr = ProductTags.map((el, idx) => {
                        console.log(el);
                        if (idx === index) {
                          let newObj = el;
                          newObj.isSelected = !newObj.isSelected;
                          return newObj;
                        } else {
                          return el;
                        }
                      });
                      updateState({
                        ProductTags: updatedArr,
                        updateTagFilter: !updateTagFilter,
                      });
                    }}
                  />
                  <Text
                    style={{
                      fontSize: textScale(11),
                      fontFamily: fontFamily.regular,
                      marginLeft: moderateScale(7),
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGrey,
                    }}>
                    {!!el?.translations?.length > 0
                      ? el.translations[0].name
                      : ''}
                  </Text>
                  <View style={{width: moderateScale(20)}} />
                </View>
              );
            })}
        </ScrollView>
        {!!categoryInfo?.is_show_products_with_category && (
          <SearchBar
            autoFocus={false}
            containerStyle={{
              alignSelf: 'center',
              // marginHorizontal: moderateScale(18),
              borderRadius: 8,
              width: width / 1.1,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
              height: moderateScaleVertical(37),
              marginBottom: moderateScaleVertical(16),
            }}
            searchValue={searchInput}
            placeholder={strings.SEARCH_WITHIN_MENU}
            onChangeText={(value) => onSearchWithinMenu(value)}
            showRightIcon={searchInput ? true : false}
            rightIconStyle={{tintColor: themeColors.secondary_color}}
            rightIconPress={() => onSearchWithinMenu('')}
          />
        )}
        {!!categoryInfo && categoryInfo?.childs?.length > 0 && (
          <View style={{marginHorizontal: moderateScale(20)}}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                // marginHorizontal: moderateScale(0),
                marginTop: moderateScaleVertical(5),
              }}>
              {/* <View><Image source={imagePath.}/></View> */}
              {categoryInfo.childs.map((item, inx) => {
                return (
                  <View key={inx}>
                    <TouchableOpacity
                      style={{
                        padding: moderateScale(10),
                        // backgroundColor: colors.lightGreyBg,
                        marginRight: moderateScale(10),
                        borderRadius: moderateScale(12),
                        backgroundColor:
                          selectedCategory && selectedCategory?.id == item?.id
                            ? themeColors.primary_color
                            : colors.lightGreyBg,
                      }}
                      onPress={() => onPressChildCards(item)}>
                      <Text
                        style={{
                          color:
                            selectedCategory && selectedCategory?.id == item?.id
                              ? colors.white
                              : colors.black,
                          opacity:
                            selectedCategory && selectedCategory?.id == item?.id
                              ? 1
                              : 0.61,
                          fontSize: textScale(12),
                          fontFamily: fontFamily.medium,
                        }}>
                        {item?.translation[0]?.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        {appIds.codiner == DeviceInfo.getBundleId() ? null : (
          <View>
            <TouchableOpacity
              onPress={onShowHideFilter}
              style={{
                alignSelf: 'flex-end',
                marginRight: moderateScale(16),
              }}>
              <Image
                style={{
                  tintColor: isDarkMode ? colors.white : colors.black,
                }}
                source={imagePath.filter}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const _onVendorCategory = (itm, indx) => {
    updateState({
      vendorCategorySelectedIndx: indx,
      productListData: itm?.products,
      // AnimatedHeaderValue: true
    });
  };

  const _renderVendorCategories = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        // onPress={() => _onVendorCategory(item, index)}
        style={{
          paddingHorizontal: 5,
          paddingVertical: 7,
          backgroundColor:
            vendorCategorySelectedIndx === index
              ? themeColors.primary_color
              : colors.transparent,
          borderRadius: 10,
          borderColor:
            vendorCategorySelectedIndx !== index
              ? themeColors.primary_color
              : colors.transparent,
          borderWidth: 0.7,
        }}>
        <Text
          style={{
            fontFamily: fontFamily.medium,
            color:
              vendorCategorySelectedIndx === index
                ? colors.white
                : isDarkMode
                ? MyDarkTheme.colors.text
                : colors.black,
          }}>
          {item?.category?.translation[0]?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <SafeAreaView>
          <HeaderLoader
            widthLeft={20}
            rectWidthLeft={20}
            widthRight={20}
            rectWidthRight={20}
            heightLeft={20}
            rectHeightLeft={20}
            heightRight={20}
            rectHeightRight={20}
            rx={5}
            ry={5}
            viewStyles={{marginTop: moderateScale(10)}}
          />
          {true ? (
            <View>
              <View style={{height: moderateScale(16)}} />
              <HeaderLoader
                viewStyles={{
                  marginHorizontal: moderateScale(20),
                  marginBottom: moderateScale(10),
                }}
                widthLeft={width - moderateScale(40)}
                rectWidthLeft={width - moderateScale(40)}
                heightLeft={moderateScaleVertical(100)}
                rectHeightLeft={moderateScaleVertical(100)}
                isRight={false}
                rx={8}
                ry={8}
              />
            </View>
          ) : (
            <View style={{marginBottom: moderateScaleVertical(16)}} />
          )}
          <View style={{marginHorizontal: moderateScale(16)}}>
            <ProductListLoader3 />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader3 />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader3 />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader3 />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader3 />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
          </View>
          {!data?.isVerndorList && (
            <View style={{marginHorizontal: moderateScale(16)}}>
              <ProductListLoader3 />
              <View style={{marginBottom: moderateScaleVertical(12)}} />
              <ProductListLoader3 />
              <View style={{marginBottom: moderateScaleVertical(12)}} />
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }

  const updateMinMax = (min, max) => {
    updateState({minimumPrice: min, maximumPrice: max});
  };

  const onShowHideFilter = () => {
    updateState({isShowFilter: !isShowFilter});
  };

  const onShare = async () => {
    let convertJson = JSON.stringify(data);
    let shareLink = `${categoryInfo.share_link + `?data=${convertJson}`}`;
    try {
      const result = await Share.share({
        url: shareLink,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderSectionTab = (props) => {
    const {title, isActive} = props;

    if (isActive) {
      // activeIdx = props.index;
    }
    if (!AnimatedHeaderValue) {
      return <View style={{width: 40}} />;
    }
    return (
      <Animatable.View
        animation={'fadeInUp'}
        style={{
          marginTop: moderateScaleVertical(4),
          marginLeft: moderateScale(12),
          marginBottom: moderateScaleVertical(16),
          padding: 4,
          borderBottomWidth: 3,
          borderColor:
            activeIdx == props.index
              ? themeColors.primary_color
              : colors.transparent,
        }}>
        <TouchableOpacity
          onPress={() => {
            const newArr = cloneSectionList.map((el, indx) => {
              if (indx == props.index) {
                let temp = el;
                temp.isActive = true;
                activeIdx = indx;
                return temp;
              } else {
                return el;
              }
            });
            updateState({sectionListData: newArr, cloneSectionList: newArr});
            console.log(props);
            // activeIdx = props.index;
            let cells = [];
            cloneSectionList.forEach((el, ind) => {
              if (props.index > ind) {
                cells.push(...el.data);
              }
            });
            let hight = Number(cells.length) * 160;
            playHapticEffect(hapticEffects.rigid);
            // updateState({MenuModalVisible: !MenuModalVisible});
            sectionListRef.current.sectionList.current._wrapperListRef._listRef._scrollRef.scrollTo(
              {
                x: hight + 200,
                y: hight + 200,
                animated: true,
              },
            );
          }}>
          <Text
            style={{
              fontFamily: fontFamily.medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {title}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  const renderSectionHeader = (props) => {
    const {section} = props;
    return (
      <View
        style={{
          marginHorizontal: moderateScale(16),
          marginVertical: moderateScaleVertical(8),
        }}>
        <Text
          style={{
            ...styles.hdrTitleTxt,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {section?.title}
        </Text>
      </View>
    );
  };
  const renderSectionItem = ({item, index, section}) => {
    return (
      <Animatable.View animation={'slideInUp'} delay={index * 5}>
        <ProductCard3
          data={item}
          index={index}
          onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
          onAddtoWishlist={() => _onAddtoWishlist(item)}
          addToCart={() => addSingleItem(item, section, index)}
          onIncrement={() => checkIsCustomize(item, section, index, 1)}
          onDecrement={() => checkIsCustomize(item, section, index, 2)}
          selectedItemID={selectedItemID}
          btnLoader={btnLoader}
          selectedItemIndx={selectedItemIndx}
          businessType={businessType}
          categoryInfo={categoryInfo}
        />
        <View style={styles.horizontalLine} />
      </Animatable.View>
    );
  };

  const onScroll = (props) => {
    const {nativeEvent} = props;
    if (
      productListData &&
      productListData.length &&
      productListData.length < 6
    ) {
      return;
    }

    let offset = nativeEvent.contentOffset.y;
    let index = parseInt(offset / 8); // your cell height
    /** cell heihgt 167 */
    let num = [];
    const hej = cloneSectionList.map((el, index) => {
      if (offset > Number(num.length) * 167) {
        num.push(...el.data);
        activeIdx = index;
      }
    });
    if (index > moderateScale(36)) {
      if (!AnimatedHeaderValue) {
        updateState({AnimatedHeaderValue: true});
      }
      return;
    }
    if (index < moderateScale(36)) {
      if (AnimatedHeaderValue) {
        updateState({AnimatedHeaderValue: false});
        return;
      }
      return;
    }
  };

  let uri1 = categoryInfo?.banner?.image_fit || categoryInfo?.icon?.image_fit;
  let uri2 = categoryInfo?.banner?.image_path || categoryInfo?.icon?.image_path;
  let name =
    data?.name ||
    data?.categoryInfo?.name ||
    (!!categoryInfo?.translation && categoryInfo?.translation[0]?.name);
  let desc =
    categoryInfo?.desc ||
    (!!categoryInfo?.translation &&
      categoryInfo?.translation[0]?.meta_description);

  var itemHeights = [];
  const getItemLayout = (data, index) => {
    const length = itemHeights[index];
    const offset = itemHeights.slice(0, index).reduce((a, c) => a + c, 0);
    console.log('l++++lenght', length);
    console.log('l++++index', index);
    console.log('l++++offset', offset);
    return {length, offset, index};
  };

  return (
    <View
      style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
        flex: 1,
        // paddingVertical: moderateScale(16),
      }}>
      <View style={{flex: 1}}>
        {/* {!data.isVendorList && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: moderateScale(15),
              marginTop: Platform.OS === 'ios' ? StatusBarHeight : 15,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                hitSlop={styles.hitSlopProp}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                  source={imagePath.icBackb}
                />
              </TouchableOpacity>
              <Text
                numberOfLines={1}
                style={{
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity86,
                  fontSize: moderateScale(14),
                  fontFamily: fontFamily.bold,
                  marginLeft: moderateScale(15),
                }}>
                {name}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.8}
                // onPress={() => updateState({ isSearch: true })}
                onPress={moveToNewScreen(
                  navigationStrings.SEARCHPRODUCTOVENDOR,
                  {
                    type: data?.vendor
                      ? staticStrings.VENDOR
                      : staticStrings.CATEGORY,
                    id: data?.vendor ? data?.id : productListId?.id,
                  },
                )}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    marginRight: moderateScale(15),
                  }}
                  source={imagePath.icSearchb}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onShare}
                hitSlop={hitSlopProp}
                activeOpacity={0.8}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                  source={imagePath.icShareb}
                />
              </TouchableOpacity>
            </View>
          </View>
        )} */}

        {((AnimatedHeaderValue && productListData.length > 6) ||
          (!!sectionListData?.length && AnimatedHeaderValue)) && (
          <Animatable.View
            // key={AnimatedHeaderValue}
            // duration={10}
            animation={'fadeIn'}
            style={{
              ...styles.headerStyle,
              marginBottom: moderateScale(12),
              // height: 52
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                hitSlop={styles.hitSlopProp}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                  source={imagePath.icBackb}
                />
              </TouchableOpacity>

              <View style={{marginLeft: moderateScale(8), flex: 0.7}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <RoundImg
                    img={getImageUrl(uri1, uri2, '400/400')}
                    size={30}
                    isDarkMode={isDarkMode}
                    MyDarkTheme={MyDarkTheme}
                  />
                  <View style={{marginLeft: moderateScale(8)}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        fontSize: moderateScale(14),
                        fontFamily: fontFamily.medium,
                      }}>
                      {name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity43,
                        fontSize: moderateScale(12),
                        fontFamily: fontFamily.regular,
                        marginTop: moderateScaleVertical(2),
                      }}>
                      {categoryInfo?.categoriesList || ''}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {isSearch ? (
              <Animatable.View
              // animation="fadeIn"
              >
                <SearchBar
                  containerStyle={{
                    marginHorizontal: moderateScale(18),
                    borderRadius: 8,
                    width: width / 1.15,
                    backgroundColor: isDarkMode
                      ? colors.whiteOpacity15
                      : colors.greyColor,
                    height: moderateScaleVertical(37),
                  }}
                  searchValue={searchInput}
                  placeholder={strings.SEARCH_ITEM}
                  // onChangeText={(value) => onChangeText(value)}
                  showRightIcon
                  rightIconPress={() =>
                    updateState({
                      searchInput: '',
                      isSearch: false,
                      isLoading: false,
                    })
                  }
                />
              </Animatable.View>
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  // onPress={() => updateState({isSearch: true})}
                  onPress={moveToNewScreen(
                    navigationStrings.SEARCHPRODUCTOVENDOR,
                    {
                      type: data?.vendor
                        ? staticStrings.VENDOR
                        : staticStrings.CATEGORY,
                      id: data?.vendor ? data?.id : productListId?.id,
                    },
                  )}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                    source={!!data?.showAddToCart ? false : imagePath.icSearchb}
                  />
                </TouchableOpacity>
                <View style={{marginHorizontal: moderateScale(8)}} />
                <TouchableOpacity
                  onPress={onShare}
                  hitSlop={hitSlopProp}
                  activeOpacity={0.8}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                    source={imagePath.icShareb}
                  />
                </TouchableOpacity>
              </View>
            )}
          </Animatable.View>
        )}
        {/* <View style={{height: moderateScale(10)}} /> */}
        {!!categoryInfo?.is_show_products_with_category ? (
          <Animatable.View style={{flex: 1}}>
            <SectionList
              ref={sectionListRef}
              showsVerticalScrollIndicator={false}
              onScroll={onScroll}
              sections={cloneSectionList}
              ListHeaderComponent={listHeaderComponent2()}
              stickySectionHeadersEnabled={false}
              scrollToLocationOffset={10}
              maxToRenderPerBatch={18}
              windowSize={18}
              initialNumToRender={18}
              removeClippedSubviews={true}
              extraData={sectionListData}
              keyExtractor={(item, index) => index}
              // tabBarStyle={styles.tabBar}
              // ItemSeparatorComponent={() => <View style={styles.separator} />}
              getItemLayout={(data, index) => {
                return {
                  length: height / 10,
                  offset: (height / 10) * index,
                  index: index,
                };
              }}
              renderTab={renderSectionTab}
              renderItem={renderSectionItem}
              ListFooterComponent={() => (
                <View style={{height: moderateScale(80)}} />
              )}
              renderSectionHeader={renderSectionHeader}
              ListEmptyComponent={
                <NoDataFound isLoading={state.isLoading} containerStyle={{}} />
              }
            />
          </Animatable.View>
        ) : (
          <FlatList
            onScroll={onScroll}
            disableScrollViewPanResponder
            showsVerticalScrollIndicator={false}
            data={productListData}
            renderItem={renderProduct}
            ListHeaderComponent={listHeaderComponent2()}
            keyExtractor={(item, index) => String(index)}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
            }}
            extraData={productListData}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            // refreshing={isRefreshing}
            // initialNumToRender={12}
            // maxToRenderPerBatch={10}
            // windowSize={10}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={isRefreshing}
            //     onRefresh={handleRefresh}
            //     tintColor={themeColors.primary_color}
            //   />
            // }
            // onEndReached={
            //   !categoryInfo?.is_show_products_with_category &&
            //   onEndReachedDelayed
            // }
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
              <View style={{height: moderateScale(60)}} />
            )}
            ListEmptyComponent={
              <NoDataFound isLoading={state.isLoading} containerStyle={{}} />
            }
          />
        )}

        {/* {!!repeatItems && (<BlurView
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
          viewRef={blurRef}
          blurType="light"
          blurAmount={10}
          blurRadius={10}
        />)} */}
        {/* <View style={{ height: moderateScale(height * 0.070) }} /> */}
      </View>

      {!!typeId && typeId == 8 ? (
        <View>
          {isVisibleModal && (
            <HomeServiceVariantAddons
              addonSet={selectedCartItem?.add_on}
              variantData={selectedCartItem?.variantSet}
              isVisible={isVisibleModal}
              productdetail={selectedCartItem}
              onClose={() =>
                updateState({isVisibleModal: false, showShimmer: true})
              }
              showShimmer={showShimmer}
              shimmerClose={(val) => updateState({showShimmer: val})}
              updateCartItems={updateCartItems}
              // modeOfService={selectedCartItem?.mode_of_service}
            />
          )}
        </View>
      ) : (
        isVisibleModal && (
          <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={[0, height / 1.5, height / 1.25]}
            activeOffsetY={[-1, 1]}
            failOffsetX={[-5, 5]}
            animateOnMount={true}
            handleComponent={() => (
              <View
                style={{
                  height: 0,
                  borderTopLeftRadius: 20,
                  backgroundColor: 'rgba(0,0,0,0)',
                }}
              />
            )}
            onChange={(index) => {
              if (index === 0) {
                updateState({isVisibleModal: false, showShimmer: true});
              }
              playHapticEffect(hapticEffects.impactMedium);
            }}>
            <BottomSheetScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={{
                borderTopLeftRadius: moderateScale(15),
                borderTopRightRadius: moderateScale(15),
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.white,
              }}>
              <VariantAddons
                addonSet={selectedCartItem?.add_on}
                variantData={selectedCartItem?.variantSet}
                isVisible={isVisibleModal}
                productdetail={selectedCartItem}
                onClose={() =>
                  updateState({isVisibleModal: false, showShimmer: true})
                }
                typeId={typeId}
                showShimmer={showShimmer}
                shimmerClose={(val) => updateState({showShimmer: val})}
                updateCartItems={updateCartItems}
              />
            </BottomSheetScrollView>
          </BottomSheet>
        )
      )}

      <CustomAnimatedLoader
        source={loaderOne}
        loaderTitle="Loading"
        containerColor={colors.white}
        loadercolor={themeColors.primary_color}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
          },
        ]}
        visible={updateQtyLoader}
      />

      {!searchInput && (
        <GradientCartView
          onPress={() => {
            playHapticEffect(hapticEffects.notificationSuccess);
            navigation.navigate(navigationStrings.CART);
          }}
          btnText={
            CartItems && CartItems.data && CartItems.data.item_count
              ? `${CartItems.data.item_count} ${
                  CartItems.data.item_count == 1 ? strings.ITEM : strings.ITEMS
                } | ${
                  currencies.primary_currency.symbol
                }${currencyNumberFormatter(
                  Number(CartItems.data.total_payable_amount).toFixed(2),
                )}`
              : ''
          }
          ifCartShow={
            CartItems && CartItems.data && CartItems.data.item_count > 0
              ? true
              : false
          }
          isMenuBtnShow={categoryInfo?.is_show_products_with_category}
          onMenuTap={() => {
            playHapticEffect(hapticEffects.impactLight);
            updateState({MenuModalVisible: !MenuModalVisible});
          }}
          isLoading={btnLoader}
          // btnStyle={
          //   appStyle?.tabBarLayout == 4 && {marginBottom: moderateScale(160)}
          // }
        />
      )}

      <BottomSlideModal
        mainContainView={RenderOfferView}
        isModalVisible={offersModalVisible}
        mainContainerStyle={{
          width: '100%',
          paddingHorizontal: 0,
          marginHorizontal: 0,
          maxHeight: moderateScale(450),
        }}
        innerViewContainerStyle={{
          width: '100%',
          paddingHorizontal: 0,
          marginHorizontal: 0,
        }}
        onBackdropPress={() =>
          updateState({offersModalVisible: !offersModalVisible})
        }
      />

      <BottomSlideModal
        mainContainView={RenderMenuView}
        isModalVisible={MenuModalVisible}
        mainContainerStyle={{
          width: '100%',
          paddingHorizontal: moderateScale(15),
          marginHorizontal: 0,
          height: moderateScale(250),
          backgroundColor: 'transparent',
        }}
        innerViewContainerStyle={{
          width: '100%',
          paddingHorizontal: 0,
          marginHorizontal: 0,
          backgroundColor: 'white',
          borderRadius: moderateScale(10),
        }}
        onBackdropPress={() => {
          updateState({MenuModalVisible: !MenuModalVisible});
        }}
      />

      {/* Add new addons and repeat item view */}
      {!!repeatItems ? (
        <RepeatModal
          data={repeatItems?.item}
          modalHide={() => updateState({repeatItems: null})}
          onRepeat={onRepeat}
          onAddNew={onAddNew}
        />
      ) : null}

      {!!differentAddsOns && differentAddsOns.length > 1 ? (
        <DifferentAddOns
          differentAddsOnsModal={differentAddsOnsModal}
          data={differentAddsOns}
          selectedDiffAdsOnItem={selectedDiffAdsOnItem}
          hideDifferentAddOns={hideDifferentAddOns}
          difAddOnsAdded={difAddOnsAdded}
          selectedDiffAdsOnSection={selectedDiffAdsOnSection}
          storeLocalQty={storeLocalQty}
          btnLoader={btnLoader}
          selectedDiffAdsOnId={selectedDiffAdsOnId}
        />
      ) : null}

      {isShowFilter ? (
        <FilterComp
          isDarkMode={isDarkMode}
          themeColors={themeColors}
          onFilterApply={onFilterApply}
          onShowHideFilter={onShowHideFilter}
          allClearFilters={allClearFilters}
          selectedSortFilter={selectedSortFilter}
          onSelectedSortFilter={(val) => updateState({selectedSortFilter: val})}
          maximumPrice={maximumPrice}
          minimumPrice={minimumPrice}
          updateMinMax={updateMinMax}
          filterData={allFilters}
        />
      ) : null}
    </View>
  );
}
