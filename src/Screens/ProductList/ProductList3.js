import {useFocusEffect} from '@react-navigation/native';
import {assign, cloneDeep, debounce} from 'lodash';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Animated,
  SafeAreaView,
  Platform,
  Modal,
  Alert,
  I18nManager,
  Share,
} from 'react-native';
import {useSelector} from 'react-redux';
import EmptyListLoader from '../../Components/EmptyListLoader';
import ProductCard3 from '../../Components/ProductCard3';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, {hitSlopProp} from '../../styles/commonStyles';
import DeviceInfo from 'react-native-device-info';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {getImageUrl, showError, showSuccess} from '../../utils/helperFunctions';
import stylesFunc from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import CustomAnimatedLoader from '../../Components/CustomAnimatedLoader';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../styles/theme';
import HeaderImageScrollView, {
  TriggeringView,
} from 'react-native-image-header-scroll-view';
import CardLoader from '../../Components/Loaders/CardLoader';
import ProductDetailLoader from '../../Components/Loaders/ProductDetailLoader';
import * as Animatable from 'react-native-animatable';
import RoundImg from '../../Components/RoundImg';
import WrapperContainer from '../../Components/WrapperContainer';
import CircularLoader from '../../Components/Loaders/CircularLoader';
import LottieLoader from '../../Components/LottieLoader';
import {noDataFound} from '../../Components/Loaders/AnimatedLoaderFiles';
import staticStrings from '../../constants/staticStrings';
import AddonModal from '../ProductDetail/AddonModal';
import VariantAddons from '../../Components/VariantAddons';
import {removeItem} from '../../utils/utils';
import NoDataFound from '../../Components/NoDataFound';
import SearchBar from '../../Components/SearchBar';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import CircularProfileLoader from '../../Components/Loaders/CircularProfileLoader';
import CategoryLoader2 from '../../Components/Loaders/CategoryLoader2';
import ProductListLoader from '../../Components/Loaders/ProductListLoader';
import HomeServiceVariantAddons from '../../Components/HomeServiceVariantAddons';
import FastImage from 'react-native-fast-image';

export default function Products({route, navigation}) {
  const {data} = route.params;

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const dineInType = useSelector((state) => state?.home?.dineInType);

  const isDarkMode = theme;
  const [state, setState] = useState({
    isVisibleModal: false,
    isOffline: false,
    isLoading: true,
    isLoadingB: false,
    pageNo: 1,
    limit: 12,
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
  } = state;

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = stylesFunc({themeColors, fontFamily});

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
      getAllListItems();
      if (isLoadingC) {
        getAllProducts(true);
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    updateState({pageNo: 1});
    getAllListItems();
  }, [languages, currencies]);

  useEffect(() => {
    getAllListItems();
  }, [pageNo, isRefreshing]);

  const getAllListItems = () => {
    let filterExist =
      sleectdBrands.length ||
      selectedVariants.length ||
      selectedOptions.length ||
      slectedSortBy.length ||
      minimumPrice != 0 ||
      maximumPrice != 50000 ||
      checkForMaximumPriceChange ||
      checkForMinimumPriceChange;
    console.log(filterExist, 'filterExist');
    {
      filterExist
        ? updateState({showFilterSlectedIcon: true})
        : updateState({showFilterSlectedIcon: false});
    }

    if (data?.vendor) {
      {
        filterExist
          ? getAllProductsVendorFilter()
          : data?.vendorData
          ? getAllProductsByVendorCategory()
          : getAllProductsByVendor();
      }
    } else {
      {
        filterExist ? getAllProductsCategoryFilter() : getAllProducts();
      }
    }
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendorCategory = () => {
    // alert("21312")
    console.log('api hit getAllProductsByVendorCategory');
    console.log(
      `/${data?.vendorData.slug}/${data?.categoryInfo?.slug}?limit=${limit}&page=${pageNo}`,
      'url',
    );
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
        console.log(res, 'resz');
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

    if (allBrands.length) {
      brandDatas = [
        {
          id: -1,
          label: strings.BRANDS,
          value: allBrands.map((i, inx) => {
            return {
              id: i?.translation[0]?.brand_id,
              label: i?.translation[0]?.title,
              parent: strings.BRANDS,
            };
          }),
        },
      ];

      // updateState({allFilters: [...allFilters,...brandDatas]});
    }

    // Price filter
    if (filterData.length) {
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
      // updateState({allFilters: [...allFilters,...filterDataNew]});
    }

    updateState({
      allFilters: [...brandDatas, ...sortFilters, ...filterDataNew],
    });
  };

  const getProductBasedOnFilter = (
    minimumPrice,
    maximumPrice,
    checkForMinimumPriceChange,
    checkForMaximumPriceChange,
    slectedSortBy,
    sleectdBrands,
    selectedVariants,
    selectedOptions,
    allSelectdFilters,
  ) => {
    updateState({
      minimumPrice: minimumPrice,
      maximumPrice: maximumPrice,
      checkForMinimumPriceChange: checkForMinimumPriceChange,
      checkForMaximumPriceChange: checkForMaximumPriceChange,
      allFilters: allSelectdFilters,
      sleectdBrands: sleectdBrands,
      selectedVariants: selectedVariants,
      selectedOptions: selectedOptions,
      slectedSortBy: slectedSortBy,
    });
  };

  /**********Get all list items by category filters */
  const getAllProductsVendorFilter = () => {
    console.log('api hit getAllProductsVendorFilter');
    let data = {};
    data['variants'] = selectedVariants;
    data['options'] = selectedOptions;
    data['brands'] = sleectdBrands;
    data['order_type'] = slectedSortBy.length ? slectedSortBy[0] : '';
    data['range'] = `${minimumPrice};${maximumPrice}`;
    actions
      .getProductByVendorFilters(
        `/${productListId.id}?limit=${limit}&page=${pageNo}`,
        data,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'res vendor filters');
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

  /**********Get all list items by category filters */
  const getAllProductsCategoryFilter = () => {
    console.log('api hit getAllProductsCategoryFilter');
    let data = {};
    data['variants'] = selectedVariants;
    data['options'] = selectedOptions;
    data['brands'] = sleectdBrands;
    data['order_type'] = slectedSortBy.length ? slectedSortBy[0] : '';
    data['range'] = `${minimumPrice};${maximumPrice}`;
    actions
      .getProductByCategoryFilters(
        `/${productListId.id}?limit=${limit}&page=${pageNo}`,
        data,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'comes here++');
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

  /****Get all list items by vendor id */
  const getAllProductsByVendor = () => {
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
        console.log(res, 'res vendor products++++++');
        updateState({
          isLoading: false,
          isRefreshing: false,
          categoryInfo: res.data.vendor,
          filterData: res.data.filterData,
          productListData:
            pageNo == 1
              ? res.data.products.data
              : [...productListData, ...res.data.products.data],
        });
        updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
      })
      .catch(errorMethod);
  };

  /**********Get all list items by category id */
  const getAllProducts = () => {
    console.log('api hit getAllProducts');
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
        console.log('getAllProducts res', res);
        updateState({
          isLoading: false,
          isLoadingC: false,
          isRefreshing: false,
          categoryInfo: categoryInfo ? categoryInfo : res.data.category,
          filterData: res.data.filterData,
          productListData:
            pageNo == 1
              ? res.data.listData.data
              : [...productListData, ...res.data.listData.data],
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
                limit: 12,
                isLoadingC: true,
              })
            : null;
        }
        updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
      })
      .catch(errorMethod);
    // }
  };

  /*********Add product to wish list******* */
  const _onAddtoWishlist = (item) => {
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
    updateState({updateQtyLoader: false, selectedItemID: -1});
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  //Add product to cart
  const _addToCart = async (item) => {
    // moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)();
    // return;
    if (item.add_on.length !== 0 || item.variantSet.length !== 0) {
      updateState({isVisibleModal: true, selectedCartItem: item});
      return;
    }
    let updateArray = productListData.map((val, i) => {
      if (val.id == item.id) {
        return {...val, qty: 1};
      }
      return val;
    });
    updateState({updateQtyLoader: true});

    updateState({
      productListData: updateArray,
      selectedCartItem: item,
      updateQtyLoader: false,
    });
  };

  const checkSingleVendor = async (id) => {
    let vendorData = {vendor_id: categoryInfo?.id};
    console.log('idd', id);
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
          resolve(res);
        })
        .catch((error) => {
          reject(error);
          updateState({selectedItemID: -1});
        });
    });
  };

  const clearCartAndAddProduct = async (item) => {
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
        addSingleItem(item);
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const addSingleItem = async (item) => {
    updateState({selectedItemID: item?.id, btnLoader: true});
    let isSingleVendor = await checkSingleVendor(item.id);
    console.log('is single vendor', isSingleVendor);
    if (
      isSingleVendor.isSingleVendorEnabled !== 0 &&
      isSingleVendor.otherVendorExists !== 0
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
        {text: strings.CONFIRM, onPress: () => clearCartAndAddProduct(item)},
      ]);
      return;
    }

    // return;

    if (item?.add_on?.length !== 0 || item?.variantSet?.length !== 0) {
      updateState({
        updateQtyLoader: false,
        isVisibleModal: true,
        selectedCartItem: item,
        selectedItemID: -1,
      });
      return;
    }

    let data = {};
    data['sku'] = item.sku;
    data['quantity'] = 1;
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
        actions.cartItemQty(res);
        updateState({cartId: res.data.id});
        // showSuccess('Product successfully added');
        let updateArray = productListData.map((val, i) => {
          if (val.id == item.id) {
            return {
              ...val,
              qty: 1,
              cart_product_id: res.data.cart_product_id,
              isRemove: false,
            };
          }
          return val;
        });
        updateState({
          productListData: updateArray,
          selectedCartItem: item,
          updateQtyLoader: false,
          selectedItemID: -1,
          btnLoader: false,
        });
      })
      .catch((error) => errorMethodSecond(error));
  };

  const addDeleteCartItems = (item, index, type) => {
    let quanitity = null;
    let itemToUpdate = cloneDeep(item);
    //!!data?.variant[0]?.check_if_in_cart_app && data?.variant[0]?.check_if_in_cart_app.length > 0 || !!data?.qty ?

    let isExistqty = itemToUpdate?.qty
      ? itemToUpdate?.qty
      : !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
        itemToUpdate.variant[0]?.check_if_in_cart_app[0].quantity;
    let isExistproductId =
      !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
      itemToUpdate.variant[0]?.check_if_in_cart_app.length
        ? itemToUpdate.variant[0]?.check_if_in_cart_app[0].id
        : itemToUpdate?.cart_product_id;
    let isExistCartId =
      !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
      itemToUpdate.variant[0]?.check_if_in_cart_app.length
        ? itemToUpdate.variant[0]?.check_if_in_cart_app[0].cart_id
        : cartId;

    console.log('item', item);
    console.log('exist qty', isExistqty);
    // return;
    if (type == 1) {
      quanitity = Number(isExistqty) + 1;
    } else {
      quanitity = Number(isExistqty) - 1;
    }
    if (quanitity) {
      updateState({
        selectedItemID: itemToUpdate.id,
        btnLoader: true,
        selectedItemIndx: index,
      });
      let data = {};
      data['cart_id'] = isExistCartId;
      data['quantity'] = quanitity;
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
          actions.cartItemQty(res);
          updateState({
            cartItems: res.data.products,
            cartData: res.data,
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
          let updateArray = productListData.map((val, i) => {
            if (val.id == item.id) {
              return {
                ...val,
                qty: quanitity,
                cart_product_id: isExistproductId,
                isRemove: false,
              };
            }
            return val;
          });
          updateState({
            productListData: updateArray,
            selectedItemID: -1,
          });
        })
        .catch(errorMethod);
    } else {
      updateState({selectedItemID: itemToUpdate?.id, btnLoader: false});
      removeItem('selectedTable');
      removeProductFromCart(itemToUpdate);
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (itemToUpdate) => {
    let data = {};
    let isExistproductId =
      !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
      itemToUpdate.variant[0]?.check_if_in_cart_app.length > 0
        ? itemToUpdate.variant[0]?.check_if_in_cart_app[0].id
        : itemToUpdate?.cart_product_id;
    let isExistCartId =
      !!itemToUpdate?.variant[0]?.check_if_in_cart_app &&
      itemToUpdate.variant[0]?.check_if_in_cart_app.length > 0
        ? itemToUpdate.variant[0]?.check_if_in_cart_app[0].cart_id
        : cartId;
    console.log('item', itemToUpdate);

    data['cart_id'] = isExistCartId;
    data['cart_product_id'] = isExistproductId;
    data['type'] = dineInType;
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);

        let updateArray = productListData.map((val, i) => {
          if (val.id == itemToUpdate.id) {
            return {
              ...val,
              qty: null,
              cart_product_id: res.data.cart_product_id,
              variant: itemToUpdate?.variant.map((val, i) => {
                return {...val, check_if_in_cart_app: []};
              }),
            };
          }
          return val;
        });
        updateState({
          productListData: updateArray,
          updateQtyLoader: false,
          selectedItemID: -1,
        });
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const errorMethodSecond = (error, addonSet = []) => {
    console.log(error.message.alert, 'Error>>>>>');
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
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: 'Clear Cart', onPress: () => clearCart(addonSet)},
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

  const clearCart = async (addonSet = []) => {
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
        if (addonSet) {
        } else {
          // addToCart();
        }
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const renderProduct = ({item, index}) => {
    const {isSelectItem} = state;
    return (
      <ProductCard3
        data={item}
        index={index}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        addToCart={() => addSingleItem(item)}
        onIncrement={() => addDeleteCartItems(item, index, 1)}
        onDecrement={() => addDeleteCartItems(item, index, 2)}
        selectedItemID={selectedItemID}
        btnLoader={btnLoader}
        selectedItemIndx={selectedItemIndx}
      />
    );
  };

  const openModal = () => {
    updateState({isVisibleModal: true});
  };
  const closeModal = () => {
    updateState({isVisibleModal: false});
  };

  const onPressChildCards = (item) => {
    console.log(item, 'item upload');

    updateState({
      selectedCategory: item,
      // productListData: [],
      productListId: item,
      pageNo: 1,
      limit: 12,
      isLoadingC: true,
    });

    // navigation.push(navigationStrings.PRODUCT_LIST, {data: item});
  };

  const updateCartItems = (item, quanitity, productId, cartID) => {
    console.log('cart+++ item', item);
    console.log('cart++ quanitify', quanitity);
    console.log('cart++ product id', productId);
    console.log('cart++ idd', cartID);
    let updateArray = productListData.map((val, i) => {
      if (val.id == item.id) {
        return {
          ...val,
          qty: quanitity,
          cart_product_id: productId,
          isRemove: false,
        };
      }
      return val;
    });
    updateState({cartId: cartID, productListData: updateArray});
  };

  useEffect(() => {
    if (isLoadingC) {
      getAllProducts(true);
    }
  }, [isLoadingC]);

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width * 0.5 - 21.5,
    offset: (width * 0.5 - 21.5) * index,
    index,
  });

  //To remove flickering of icon and image we are creating the header child seperately
  const listHeaderComponent = () => {
    return (
      <Fragment>
        <View style={{marginVertical: moderateScaleVertical(12)}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{marginLeft: moderateScaleVertical(12), flex: 0.6}}>
              <View style={{flexDirection: 'row'}}>
                <View style={{}}>
                  <RoundImg img={getImageUrl(uri1, uri2, '400/400')} />
                </View>
                <View style={{marginLeft: moderateScale(12)}}>
                  {!!name && (
                    <Text
                      numberOfLines={2}
                      animation="fadeIn"
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        fontSize: moderateScale(18),
                        fontFamily: fontFamily.regular,
                      }}>
                      {name}
                    </Text>
                  )}
                  {!!desc && (
                    <Text
                      numberOfLines={2}
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity86,
                        fontSize: moderateScale(12),
                        fontFamily: fontFamily.regular,
                      }}>
                      {desc}
                    </Text>
                  )}
                  {!!categoryInfo?.address && (
                    <Text
                      numberOfLines={2}
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity66,
                        fontSize: moderateScale(11),
                        fontFamily: fontFamily.regular,
                        marginVertical: moderateScaleVertical(6),
                      }}>
                      {categoryInfo?.address}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={{}}>
              {/* <View style={styles.rateViewStyle}>
                <View>
                  <Text style={{ color: colors.white }}>
                    {'4.5 '}
                    <Image
                      source={imagePath.star}
                      style={{ tintColor: colors.white }}
                    />
                  </Text>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: moderateScale(8),
                      fontFamily: fontFamily.medium,
                    }}>
                    {'DELIVERY'}
                  </Text>
                </View>
              </View> */}
              <View style={{marginTop: moderateScaleVertical(4)}}>
                {/* <ImageBackground
                  source={{
                    uri: getImageUrl(
                      data?.categoryInfo?.image?.proxy_url ||
                      data?.image?.proxy_url ||
                      categoryInfo?.banner?.proxy_url,
                      data?.categoryInfo?.image?.image_path ||
                      data?.image?.image_path ||
                      categoryInfo?.banner?.image_path,
                      '200/200',
                    ),
                  }}
                  style={{
                    minWidth: moderateScale(50),
                    height: moderateScale(30),
                  }}
                  imageStyle={{
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                  }}
                  resizeMode="stretch">

                  </ImageBackground> */}
              </View>
            </View>
          </View>
        </View>
        {categoryInfo && categoryInfo.childs && categoryInfo.childs.length ? (
          <View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                // marginHorizontal: moderateScale(16),
                paddingLeft: moderateScale(8),
                paddingRight: moderateScale(8),
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
        ) : null}
        <View style={{marginTop: moderateScaleVertical(20)}} />
      </Fragment>
    );
  };

  const listHeaderComponent2 = () => {
    return (
      <View style={styles.header2}>
        <StatusBar
          translucent
          barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
        />
        <View style={{height: '80%'}}>
          <ImageBackground
            source={{
              uri: getImageUrl(
                // data?.item?.banner.image_fit ||
                data?.categoryInfo?.image?.image_fit ||
                  categoryInfo?.banner.image_fit,
                // data?.item?.banner.image_path ||
                data?.categoryInfo?.image?.image_path ||
                  categoryInfo?.banner.image_path,
                '400/400',
              ),
            }}
            style={{
              ...styles.imageBackgroundHdr,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
            resizeMode="cover">
            <LinearGradient
              style={styles.linearGradientHdr}
              colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.7)']}>
              <View style={styles.hdrCompHeader}>
                <TouchableOpacity
                  hitSlop={styles.hitSlopProp}
                  onPress={() => navigation.goBack()}
                  style={{flex: 0.2}}>
                  <Image
                    source={imagePath.icBackb}
                    style={{
                      marginLeft: moderateScale(10),
                      tintColor: colors.white,
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                  />
                </TouchableOpacity>
                <FastImage
                  source={{
                    uri: getImageUrl(
                      data?.item?.banner.image_fit ||
                        data?.categoryInfo?.image?.image_fit ||
                        categoryInfo?.banner.image_fit,
                      data?.item?.banner.image_path ||
                        data?.categoryInfo?.image?.image_path ||
                        categoryInfo?.banner.image_path,
                      '400/400',
                    ),
                    priority: FastImage.priority.low,
                  }}
                  style={styles.hdrCompRoundImg}
                />

                <View style={styles.rightViewOfShareSearch}>
                  <TouchableOpacity activeOpacity={0.8}>
                    <Image
                      style={{
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.white,
                        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                      }}
                      source={
                        !!data?.showAddToCart ? false : imagePath.icSearchb
                      }
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
                          : colors.white,
                        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                      }}
                      source={imagePath.icShareb}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
            <View
              style={{
                ...styles.hdrAbsoluteView,
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : colors.white,
              }}>
              <View style={styles.hdrNameRatingView}>
                <Text
                  numberOfLines={2}
                  style={{
                    ...styles.hdrTitleTxt,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {data?.name || categoryInfo?.name || ''}
                </Text>
                {!!categoryInfo && !!categoryInfo?.product_avg_average_rating && (
                  <View style={styles.hdrRatingTxtView}>
                    <Text style={styles.ratingTxt}>
                      {Number(categoryInfo?.product_avg_average_rating).toFixed(
                        1,
                      )}
                    </Text>
                    <Image
                      style={styles.starImg}
                      source={imagePath.star}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>
              {!!categoryInfo && !!categoryInfo?.categoriesList && (
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.milesTxt,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    marginRight: moderateScale(40),
                    marginVertical: moderateScale(1),
                    marginLeft: 0,
                  }}>
                  {categoryInfo?.categoriesList || ''}
                </Text>
              )}
              {!!categoryInfo && !!categoryInfo?.lineOfSightDistance && (
                <View
                  style={{
                    ...styles.hdrNameRatingView,
                    marginTop: moderateScaleVertical(5),
                  }}>
                  <View style={styles.milesView}>
                    <Image
                      source={imagePath.location2}
                      style={{
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      }}
                    />
                    <Text
                      style={{
                        ...styles.milesTxt,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      }}>
                      {categoryInfo.lineOfSightDistance}{' '}
                      {!!categoryInfo.lineOfSightDistance &&
                      !!categoryInfo.timeofLineOfSightDistance
                        ? '|'
                        : ''}{' '}
                      {categoryInfo.timeofLineOfSightDistance}{' '}
                      {!!categoryInfo.timeofLineOfSightDistance ? 'mins' : ''}
                    </Text>
                  </View>

                  <Text
                    style={{
                      ...commonStyles.mediumFont14Normal,
                      fontSize: textScale(12),
                      textAlign: 'left',
                      marginRight: moderateScale(5),
                      color: categoryInfo?.show_slot
                        ? colors.green
                        : categoryInfo?.is_vendor_closed
                        ? colors.redB
                        : colors.green,
                    }}>
                    {categoryInfo?.show_slot
                      ? strings.OPEN
                      : categoryInfo?.is_vendor_closed
                      ? strings.CLOSE
                      : strings.OPEN}
                  </Text>
                </View>
              )}
            </View>
          </ImageBackground>
        </View>
      </View>
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
          {!data.isVendorList && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: moderateScale(15),
                marginBottom: moderateScale(15),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  {data?.name}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => updateState({isSearch: true})}
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
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                    source={imagePath.icShareb}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {data?.isVendorList && (
            <>
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
              <View
                style={{
                  marginVertical: moderateScaleVertical(12),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CircularProfileLoader isDesc={false} />
              </View>
              <HeaderLoader
                viewStyles={{
                  marginHorizontal: moderateScale(20),
                  marginBottom: moderateScale(10),
                }}
                widthLeft={width - moderateScale(40)}
                rectWidthLeft={width - moderateScale(40)}
                heightLeft={moderateScaleVertical(80)}
                rectHeightLeft={moderateScaleVertical(80)}
                isRight={false}
                rx={8}
                ry={8}
              />
            </>
          )}

          <View style={{marginHorizontal: moderateScale(16)}}>
            <ProductListLoader />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
          </View>
          {!data?.isVerndorList && (
            <View style={{marginHorizontal: moderateScale(16)}}>
              <ProductListLoader />
              <View style={{marginBottom: moderateScaleVertical(12)}} />
              <ProductListLoader />
              <View style={{marginBottom: moderateScaleVertical(12)}} />
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }

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

  const onScroll = ({nativeEvent}) => {
    if (productListData.length < 6) {
      return;
    }
    let offset = nativeEvent.contentOffset.y;
    let index = parseInt(offset / 10); // your cell height
    if (index > 16) {
      if (!AnimatedHeaderValue) {
        updateState({AnimatedHeaderValue: true});
      }
      return;
    }
    if (index < 16) {
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

  console.log(data, 'is_show_category');

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
        {!data.isVendorList && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: moderateScale(15),
              marginTop: Platform.OS === 'ios' ? StatusBarHeight : 15,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
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

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => updateState({isSearch: true})}
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
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                  source={imagePath.icShareb}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {data.isVendorList &&
          AnimatedHeaderValue &&
          !!productListData &&
          productListData.length > 0 && (
            <View style={styles.headerStyle}>
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

                <Animatable.View
                  // key={AnimatedHeaderValue}
                  // duration={10}
                  animation={'fadeIn'}
                  style={{marginLeft: moderateScale(8), flex: 0.7}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <RoundImg
                      img={getImageUrl(uri1, uri2, '400/400')}
                      size={20}
                      isDarkMode={isDarkMode}
                      MyDarkTheme={MyDarkTheme}
                    />
                    <View style={{marginLeft: moderateScale(8)}}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.blackOpacity86,
                          fontSize: moderateScale(12),
                          fontFamily: fontFamily.regular,
                        }}>
                        {name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                          fontSize: moderateScale(12),
                          fontFamily: fontFamily.medium,
                          marginTop: moderateScaleVertical(2),
                        }}>
                        {categoryInfo?.categoriesList || ''}
                      </Text>
                    </View>
                  </View>
                </Animatable.View>
              </View>

              {isSearch ? (
                <Animatable.View animation="fadeIn">
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
                    // onPress={moveToNewScreen(
                    //   navigationStrings.SEARCHPRODUCTOVENDOR,
                    //   {
                    //     type: data?.vendor
                    //       ? staticStrings.VENDOR
                    //       : staticStrings.CATEGORY,
                    //     id: data?.vendor ? data?.id : productListId?.id,
                    //   },
                    // )}
                  >
                    <Image
                      style={{
                        tintColor: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                      }}
                      source={
                        !!data?.showAddToCart ? false : imagePath.icSearchb
                      }
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
            </View>
          )}
        {/* <View style={{height: moderateScale(10)}} /> */}
        <FlatList
          onScroll={onScroll}
          disableScrollViewPanResponder
          showsVerticalScrollIndicator={false}
          data={(!isLoading && productListData) || []}
          renderItem={renderProduct}
          ListHeaderComponent={
            data?.isVendorList ? (
              listHeaderComponent2()
            ) : (
              <View style={{height: 20}} />
            )
          }
          keyExtractor={(item, index) => String(index)}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          refreshing={isRefreshing}
          // initialNumToRender={12}
          // maxToRenderPerBatch={10}
          // windowSize={10}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          onEndReached={onEndReachedDelayed}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <View style={{height: moderateScale(50)}} />
          )}
          ListEmptyComponent={
            <NoDataFound isLoading={state.isLoading} containerStyle={{}} />
          }
        />
        {/* <View style={{ height: moderateScale(height * 0.070) }} /> */}
      </View>

      {isVisibleModal && (
        <VariantAddons
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
        />

        // <HomeServiceVariantAddons
        //   addonSet={selectedCartItem?.add_on}
        //   variantData={selectedCartItem?.variantSet}
        //   isVisible={isVisibleModal}
        //   productdetail={selectedCartItem}
        //   onClose={() =>
        //     updateState({isVisibleModal: false, showShimmer: true})
        //   }
        //   showShimmer={showShimmer}
        //   shimmerClose={(val) => updateState({showShimmer: val})}
        //   updateCartItems={updateCartItems}
        // />
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
    </View>
  );
}
