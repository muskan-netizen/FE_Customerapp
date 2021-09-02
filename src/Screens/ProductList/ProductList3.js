import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep, debounce} from 'lodash';
import React, {Fragment, useEffect, useState} from 'react';
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
} from 'react-native';
import {useSelector} from 'react-redux';
import EmptyListLoader from '../../Components/EmptyListLoader';
import ProductCard3 from '../../Components/ProductCard3';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {getImageUrl, showError, showSuccess} from '../../utils/helperFunctions';
import stylesFunc from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import CustomAnimatedLoader from '../../Components/CustomAnimatedLoader';

export default function Products({route, navigation}) {
  const {data} = route.params;
  console.log(data, 'data params >>>>>');
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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log('one');
  //     // updateState({pageNo: 1});
  //     getAllListItems();
  //   }, []),
  // );

  useEffect(() => {
    updateState({pageNo: 1});
    getAllListItems();
  }, [languages, currencies]);

  useEffect(() => {
    // do something
    getAllListItems();
  }, [pageNo, isRefreshing]);

  useFocusEffect(
    React.useCallback(() => {
      updateState({pageNo: 1});
      getAllListItems();
    }, [
      sleectdBrands,
      selectedOptions,
      slectedSortBy,
      minimumPrice,
      maximumPrice,
    ]),
  );

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
    console.log(allBrands, '>allBrands');
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
        },
      )
      .then((res) => {
        console.log(res, 'res vendor products');
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
        },
      )
      .then((res) => {
        console.log(res, 'comes here');
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
    actions
      .getProductByVendorId(
        `/${productListId.id}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res, 'res vendor products');
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
    actions
      .getProductByCategoryId(
        `/${productListId.id}?limit=${limit}&page=${pageNo}&product_list=${
          data?.rootProducts ? true : false
        }`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        // console.log(pageNo, 'pageNO');
        console.log(res, 'res--getproducts');
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
    updateState({productListData: newArray, isLoadingB: false});
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false, isLoadingB: false});
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
  const _addToCart = (item) => {
    moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)();
  };

  const renderProduct = ({item, index}) => {
    const {isSelectItem} = state;
    return (
      <ProductCard3
        data={item}
        index={index}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        addToCart={() => _addToCart(item)}
      />
    );
  };

  console.log(productListData, 'productListDataproductListDataproductListData');

  const openModal = () => {
    updateState({isVisibleModal: true});
  };
  const closeModal = () => {
    updateState({isVisibleModal: false});
  };

  const onPressChildCards = (item) => {
    console.log(item, 'item upload');
    let filterExist =
      sleectdBrands.length ||
      selectedVariants.length ||
      selectedOptions.length ||
      slectedSortBy.length ||
      minimumPrice != 0 ||
      maximumPrice != 50000 ||
      checkForMaximumPriceChange ||
      checkForMinimumPriceChange;
    updateState({
      selectedCategory: item,
      productListData: [],
      productListId: item,
      pageNo: 1,
      limit: 12,
      isLoadingC: true,
    });
    setTimeout(() => {
      filterExist ? getAllProductsCategoryFilter() : getAllProducts();
    }, 1000);
    // navigation.push(navigationStrings.PRODUCT_LIST, {data: item});
  };

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
        {categoryInfo && categoryInfo.childs && categoryInfo.childs.length ? (
          <View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                marginHorizontal: moderateScale(16),
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

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
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
        visible={isLoadingC}
      />

      <View
        style={{
          // alignItems: 'center',
          // height: Platform.OS === 'ios' ? height * 0.27 : height * 0.3,
          zIndex: Platform.OS === 'ios' ? 0 : -1000,
        }}>
        <View style={{backgroundColor: colors.grey}}>
          <ImageBackground
            source={{
              uri: getImageUrl(
                data?.categoryInfo?.image?.proxy_url || data?.image?.proxy_url,
                data?.categoryInfo?.image?.image_path ||
                  data?.image?.image_path,
                '500/500',
              ),
            }}
            style={{
              height: width * 0.5,
              width: width,
            }}
            imageStyle={{
              alignItems: 'center',
              height: width * 0.5,
              width: width,
            }}>
            <LinearGradient
              style={{alignItems: 'center', height: width * 0.5, width: width}}
              colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.5)']}>
              <View style={styles.topHeaderView}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  background={colors.green}
                  onPress={() => navigation.goBack()}
                  style={styles.leftRightHeaderIconStyle}>
                  <Image source={imagePath.greyRoundBack} />
                </TouchableOpacity>

                <View>
                  <Image
                    source={{
                      uri: getImageUrl(
                        data?.categoryInfo?.icon?.proxy_url ||
                          data?.icon?.proxy_url,
                        data?.categoryInfo?.icon?.image_path ||
                          data?.icon?.image_path,
                        '200/200',
                      ),
                    }}
                    style={{height: 67, width: 67, borderRadius: 67 / 2}}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                  }
                  style={styles.leftRightHeaderIconStyle}>
                  <Image
                    source={
                      !!data?.showAddToCart ? false : imagePath.greyRoundSearch
                    }
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
            <View style={styles.bottomHeaderView}>
              <View style={{flex: 0.5}}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: moderateScale(16),
                    fontFamily: fontFamily.medium,
                  }}>
                  {data?.categoryInfo?.name || data?.name}
                </Text>
                <Text style={styles.distanceAndTimeView}>
                  {'0.2 km | 30 mins'}
                </Text>
              </View>

              <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                <View style={styles.rateViewStyle}>
                  <Image
                    source={imagePath.star}
                    style={{tintColor: colors.white}}
                  />
                  <Text style={{color: colors.white}}>{'4.5'}</Text>
                </View>
                <Text style={styles.openCloseStatus}>{'Open'}</Text>
              </View>
            </View>
          </ImageBackground>
          {/* <View style={styles.overlay} /> */}
        </View>

        <View style={{height: moderateScaleVertical(50)}} />
        <FlatList
          data={(!isLoading && productListData) || []}
          renderItem={renderProduct}
          ListHeaderComponent={listHeaderComponent()}
          keyExtractor={(item, index) => String(index)}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          // style={{flex: 1}}
          contentContainerStyle={{
            flexGrow: 1,
            // flex:1,
            // backgroundColor:'red',
            marginTop: width * 0.1,
          }}
          ItemSeparatorComponent={() => <View style={{height: 10}} />}
          refreshing={isRefreshing}
          getItemLayout={getItemLayout}
          initialNumToRender={12}
          maxToRenderPerBatch={10}
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
            <View style={{marginBottom: width / 1.3}} />
          )}
          // ListEmptyComponent={<EmptyListLoader />}
        />
      </View>
    </View>
  );
}
