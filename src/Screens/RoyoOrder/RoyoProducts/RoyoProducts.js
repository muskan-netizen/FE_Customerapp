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
import HTMLView from 'react-native-htmlview';
import {RefreshControl} from 'react-native';

const RoyoProducts = (props) => {
  const {navigation} = props;

  const updateState = (data) => setState((state) => ({...state, ...data}));


  const renderItem = (data, rowMap) => {
    const {item, index} = data;
    console.log(item);
    return (
      <View style={styles.itemBox}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.PRODUCTDETAIL, {data: item})
          }
          style={{alignSelf: 'center'}}>
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
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {/* <View style={{flex: 1, }}> */}
            <Text numberOfLines={1} style={styles.font16medium}>
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
            style={styles.font13Regular}>
            in {categoryName}
          </Text>
          
          <View style={{marginTop: 10}}>
            <HTMLView value={item?.translation[0]?.body_html} />
            <View />
          </View>
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

  useEffect(() => {
    if (isLoading || isRefreshing) {
      getAllProducts();
    }
  }, [languages, currencies, isRefreshing, isLoading]);

  useEffect(() => {
    updateState({
      // selectedTab: null,
      selectedVendor: storeSelectedVendor,
      isLoading: true,
      pageNo: 1,
    });
  }, [storeSelectedVendor]);

  /**********Get all list items by store  id and category id */
  const getAllProducts = (id) => {
    console.log(pageNo, 'data at product');
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
        console.log(res, 'data at product');
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
    updateState({pageNo: pageNo + 1, isLoading: true});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const selectedCategory = (index) => {
    getAllProducts(index);
  };

  const renderCatogry = ({item, index}) => (
    <View
      key={index}
      style={{
        marginBottom: moderateScaleVertical(16),
        marginLeft:
          width > 600
            ? index % 5
              ? moderateScale(10)
              : 0
            : index % 3
            ? moderateScale(10)
            : 0,
      }}>
      <TouchableOpacity
        onPress={() => selectedCategory(item.id)}
        style={styles.categoryItem}>
        <Image
          style={{
            resizeMode: 'center',
            width:
              width > 600
                ? (width - moderateScale(173)) / 5
                : (width - moderateScale(112)) / 3,
            height:
              width > 600
                ? (width - moderateScale(203)) / 5
                : (width - moderateScale(152)) / 3,
          }}
          source={imagePath.testingImageRoyo}
        />
      </TouchableOpacity>
      <Text
        style={{
          textAlign: 'center',
          width:
            width > 600
              ? (width - moderateScale(173)) / 5
              : (width - moderateScale(112)) / 3,
        }}>
        {item.name}
      </Text>
    </View>
  );
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
      <View style={styles.container}>
        <MultiScreen
          tabTextStyle={{marginTop: moderateScaleVertical(0)}}
          screenName={['Products', 'Categories', '', '', '']}
          selectedScreen={(index) => selectedOrder(index)}
          selectedScreenIndex={activeIndex}
        />
        {activeIndex == 0 ? (
          <View style={{flex: 1}}>
            <SwipeListView
              refreshControl={
                <RefreshControl
                  onRefresh={handleRefresh}
                  refreshing={isRefreshing}
                />
              }
              onEndReached={onEndReachedDelayed}
              ListEmptyComponent={() => {
                return (
                  <View style={styles.emptyCartBody}>
                    <Image source={imagePath.emptyCartRoyo} />
                  </View>
                );
              }}
              data={productListData}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              renderHiddenItem={(data, rowMap) => (
                <View style={styles.rowReverse}>
                  <TouchableOpacity
                    style={{
                      ...styles.hiddenButton,
                      backgroundColor: '#FFC8C8',
                    }}>
                    <Image source={imagePath.deleteRoyo} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.hiddenButton,
                      backgroundColor: '#C8F3FF',
                    }}>
                    <Image source={imagePath.editRoyo} />
                  </TouchableOpacity>
                </View>
              )}
              disableRightSwipe
              rightOpenValue={-moderateScale(100)}
            />
            <ButtonWithLoader
              onPress={() =>
                navigation.navigate(navigationStrings.ROYO_ADD_PRODUCT, {vendor_list})
              }
              btnStyle={styles.productBtn}
              btnText="+  products"
            />
          </View>
        ) : null}
        {activeIndex == 1 ? (
          <View
            style={{
              flex: 1,
            }}>
            <FlatList
              data={category_list}
              keyExtractor={(item, index) => index}
              bounces={false}
              showsVerticalScrollIndicator={false}
              numColumns={width > 600 ? 5 : 3}
              renderItem={renderCatogry}
            />

            <ButtonWithLoader
              onPress={() =>
                navigation.navigate(navigationStrings.ROYO_ADD_PRODUCT, {vendor_list})
              }
              btnStyle={styles.categoryBtn}
              btnText="+  category"
            />
          </View>
        ) : null}
      </View>
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
  font16medium: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.black,
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
  },
  itemBox: {
    padding: moderateScale(18),
    borderRadius: moderateScale(6),
    backgroundColor: colors.whiteSmokeColor,
    flexDirection: 'row',
    marginBottom: moderateScaleVertical(16),
  },
  font13Regular: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.blackOpacity40,
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
