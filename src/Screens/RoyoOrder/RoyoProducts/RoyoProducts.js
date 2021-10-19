import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {customMarginBottom} from '../../../utils/constants/constants';
import WrapperContainer from '../../../Components/WrapperContainer';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import MultiScreen from '../../../Components/MultiScreen';
import imagePath from '../../../constants/imagePath';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import navigationStrings from '../../../navigation/navigationStrings';
import Header from '../../../Components/Header';
import {FlatList} from 'react-native';
import staticStrings from '../../../constants/staticStrings';
import {cloneDeep, debounce} from 'lodash';
import actions from '../../../redux/actions';
import {getImageUrl} from '../../../utils/helperFunctions';

const RoyoProducts = (props) => {
  const {navigation} = props;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  //   const {product} = useSelector((state) => state.product);
  const renderItem = (data, rowMap) => {
    const {item, index} = data;
    console.log(item);
    return (
      <View
        style={{
          padding: moderateScale(18),
          borderRadius: moderateScale(6),
          backgroundColor: colors.whiteSmokeColor,
          flexDirection: 'row',
          marginBottom: moderateScaleVertical(16),
        }}>
        <TouchableOpacity style={{alignSelf: 'center'}}>
          <Image
            style={styles.imageStyle}
            source={{
              uri: getImageUrl(
                item?.media[0].image?.path?.image_fit,
                item?.media[0].image?.path?.image_path,
                '500/500',
              ),
            }}
          />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', }}>
            {/* <View style={{flex: 1, }}> */}
              <Text numberOfLines={1}
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontFamily: fontFamily.medium,
                  color: colors.black,
                }}>
                {item.translation[0]?.title}
              </Text>
              
            {/* </View> */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.font16Semibold}>In Stock</Text>
              <TouchableOpacity>
                <Image
                  source={
                    item.is_live
                      ? imagePath.inStockRoyo
                      : imagePath.outStockRoyo
                  }
                />
              </TouchableOpacity>
            </View>
            {/* <Image style={{alignSelf: 'flex-end'}} source={imagePath.share} /> */}
          </View>
          <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: 13,
                  color: colors.blackOpacity40,
                }}>
                in {categoryName}
              </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontFamily.regular,
              color: colors.blackOpacity86,
              marginTop: moderateScaleVertical(8),
            }}>
            {item.translation[0]?.body_html}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: 14,
              color: colors.black,
              marginTop: moderateScaleVertical(4),
            }}>
            $ {item.variant[0]?.price}
          </Text>
        </View>
      </View>
    );
  };

  const selectedOrder = (index) => {
    if (index == 0) updateState({activeIndex: index, headerText: 'Products'});
    else updateState({activeIndex: index, headerText: 'Categories'});
  };

  const {storeSelectedVendor} = useSelector((state) => state?.order);

  const [state, setState] = useState({
    activeIndex: 0,
    headerText: 'Products',
    vendor_list: [],
    selectedVendor: null,
    isVisibleModal: false,
    isLoading: true,
    pageNo: 1,
    limit: 12,
    isRefreshing: false,
    productListData: [],
    category_list: [],
    categoryName: '',
    gridView: false,
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
    vendor_list,
    selectedVendor,
    isLoading,
    pageNo,
    limit,
    isRefreshing,
    categoryInfo,
    productListData,
    category_list,
    gridView,
    activeIndex,
    headerText,
    categoryName,
  } = state;

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

  useEffect(() => {
    if (isLoading) {
      getAllProducts();
    }
  }, [languages, currencies, isRefreshing, isLoading]);

  useEffect(() => {
    updateState({
      // selectedTab: null,
      selectedVendor: storeSelectedVendor,
      isLoading: true,
    });
  }, [storeSelectedVendor]);

  // useEffect(() => {
  //   getAllListItems();
  // }, [pageNo]);

  // const getAllListItems = () => {
  //   getAllProducts();
  // };

  useFocusEffect(
    React.useCallback(() => {
      updateState({pageNo: 1});
    }, [pageNo]),
  );

  /**********Get all list items by store  id and category id */
  const getAllProducts = (id) => {
    actions
      .getProductBySpecificId(
        `?selected_category_id=${
          id || ''
        }&limit=${limit}&page=${pageNo}&selected_vendor_id=${
          selectedVendor?.id || ''
        }`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        let categorylist = res.data.category_list.filter((x) => x.is_selected);
        console.log(categorylist[0].name, 'data');
        updateState({
          isLoading: false,
          isRefreshing: false,
          vendor_list: res.data.vendor_list,
          categoryName: categorylist[0].name,
          selectedVendor: !!storeSelectedVendor?.id
            ? storeSelectedVendor
            : !!selectedVendor
            ? selectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),

          category_list: res.data.category_list,
          productListData:
            pageNo == 1
              ? res.data.products.data
              : [...productListData, ...res.data.products.data],
        });
      })
      .catch(errorMethod);
    // }
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
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

  const onPressChildCards = (item) => {
    // updateState({selectedSbCategoryID: item.id});
    navigation.push(navigationStrings.PRODUCT_LIST, {data: item});
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width * 0.5 - 21.5,
    offset: (width * 0.5 - 21.5) * index,
    index,
  });

  const selectedCategory = (index) => {
    getAllProducts(index);
  };
  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: selectedVendor,
      allVendors: vendor_list,
      screenType: staticStrings.PRODUCTS,
    });
  };

  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        centerTitle={`${headerText} | ${selectedVendor?.name} `}
        noLeftIcon
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
      />
      
    </WrapperContainer>
  );
};

export default RoyoProducts;

const styles = StyleSheet.create({
  font16Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: '#4CB549',
    marginRight: moderateScale(10),
  },
  container: {
    // marginTop: moderateScaleVertical(24),
    marginHorizontal: moderateScale(16),
    marginBottom: customMarginBottom(),
    flex: 1,
  },

  textStyle: {
    color: colors.black,
    fontSize: 24,
    fontFamily: fontFamily.bold,
  },
  imageStyle: {
    width: moderateScale(60),
    height: moderateScaleVertical(60),
    borderRadius: 6,
    marginRight: moderateScale(18),
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    height: '100%',
    // alignItems: 'center',
  },
  hiddenButton: {
    paddingHorizontal: moderateScale(14),
    marginBottom: moderateScale(16),
    borderRadius: moderateScaleVertical(8),
    justifyContent: 'center',
    marginLeft: moderateScale(8),
  },
  categoryItem: {
    alignSelf: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(16),
    marginBottom: moderateScaleVertical(8),
    borderRadius: moderateScaleVertical(6),
  },
  productBtn: {
    position: 'absolute',
    padding: moderateScale(10),
    bottom: moderateScaleVertical(20),
    right: moderateScale(10),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
  },
  categoryBtn: {
    position: 'absolute',
    padding: moderateScale(10),
    bottom: moderateScaleVertical(20),
    right: moderateScale(10),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
  },
  emptyCartBody: {
    flex: 1,
    justifyContent: 'center',
    height: 400,
    alignItems: 'center',
  },
});
