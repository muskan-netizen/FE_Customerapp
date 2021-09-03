import {debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import Header3 from '../../Components/Header3';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import MarketCard from '../../Components/MarketCard';
import MarketCard2 from '../../Components/MarketCard2';
import MarketCard3 from '../../Components/MarketCard3';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import ListEmptyVendors from './ListEmptyVendors';
export default function Vendors3({route, navigation}) {
  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 5,
    isRefreshing: false,
  });
  const {appData, themeColors, themeLayouts, currencies, languages} =
    useSelector((state) => state.initBoot);

  const categoryData = useSelector((state) => state?.vendor?.categoryData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const location = useSelector((state) => state?.home?.location);

  const {isLoading, pageNo, isRefreshing, limit} = state;
  const {data} = route.params;
  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  useEffect(() => {
    actions
      .getDataByCategoryId(
        `/${data.id}?limit=${limit}&page=${pageNo}&type=${dine_In_Type}`,
        {},
        {code: appData.profile.code},
      )
      .then((res) => {
        updateState({isLoading: false, isRefreshing: false});
        const vendorData = {
          category: res.data.category,
          listData:
            pageNo == 1
              ? res.data.listData.data
              : [...categoryData?.listData, ...res.data.listData.data],
        };
        actions.saveVendorListingAndCategoryInfo(vendorData);
      })
      .catch(errorMethod);
  }, [pageNo, isRefreshing]);

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

  //************Check the redirecton screen********/
  const _checkRedirectScreen = (item) => {
    {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            categoryData: data,
          })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
            id: item.id,
            vendor: true,
            name: item.name,
          })();
    }
  };

  /**********/

  const _renderItem = ({item, index}) => {
    return (
      <View style={{marginHorizontal: moderateScale(15)}}>
        <MarketCard3 onPress={() => _checkRedirectScreen(item)} data={item} />
      </View>
    );
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width - moderateScale(32),
    offset: (width - moderateScale(32)) * index,
    index,
  });

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}>
      <Header3
        leftIcon={imagePath.backArrow1}
        centerTitle={data?.name}
        rightIcon={imagePath.search}
        location={location}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flexDirection: 'row',
            height: moderateScaleVertical(50),
            backgroundColor: colors.greyNew,
            borderRadius: moderateScale(15),
            paddingHorizontal: moderateScale(15),
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: moderateScale(15),
            marginVertical: moderateScale(13),
          }}
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }>
          <View style={{width: '80%'}}>
            <Text style={{fontFamily: fontFamily.regular}}>
              {strings.SEARCH_HERE}
            </Text>
          </View>
          <Image source={imagePath.search1} />
        </TouchableOpacity>
        <Image source={imagePath.filter1} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={(!isLoading && categoryData?.listData) || []}
        ItemSeparatorComponent={() => <View style={{height: 8}} />}
        keyExtractor={(item, index) => String(index)}
        renderItem={_renderItem}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
            // titleColor="#fff"
          />
        }
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        onEndReached={onEndReachedDelayed}
        onEndReachedThreshold={0.5}
        // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
        ListEmptyComponent={
          <ListEmptyVendors isLoading={isLoading} emptyText={'No data found'} />
        }
        ListFooterComponent={() => <View style={{height: 100}} />}
      />
    </WrapperContainer>

    //<VendorsDesign1 />
  );
}
