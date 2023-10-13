import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useEffect, useRef, useState} from 'react';
import WrapperContainer from '../../Components/WrapperContainer';
import Header from '../../Components/Header';
import FastImage from 'react-native-fast-image';
import imagePath from '../../constants/imagePath';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import moment from 'moment';
import {
  getColorCodeWithOpactiyNumber,
  showSuccess,
} from '../../utils/helperFunctions';
import strings from '../../constants/lang';
import SelectDatePicker from '../../Components/SelectDatePicker';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import colors from '../../styles/colors';
import ProductInfoCard from '../../Components/ProductInfoCard';
import navigationStrings from '../../navigation/navigationStrings';
import {Image} from 'react-native-animatable';
import fontFamily from '../../styles/fontFamily';
import {black} from 'react-native-paper/lib/typescript/styles/colors';
import FilterComp from '../../Components/FilterComp';
import actions from '../../redux/actions';
import NoDataFound from '../../Components/NoDataFound';
import {debounce} from 'lodash';
import {UIActivityIndicator} from 'react-native-indicators';

const AvailableCars = ({route}) => {
  const navigation = useNavigation();
  console.log(navigation, 'ehjdkjebdjk');
  let selectedFilters = useRef(null);
  const darkthemeusingDevice = useDarkMode();
  let paramData = route?.params?.data;
console.log(paramData,'paramDataparamDataparamData');
  // --------------------redux state
  const {appData, themeColors, themeColor, themeToggle} = useSelector(
    state => state?.initBoot || {},
  );

  const appMainData = useSelector(state => state?.home?.appMainData);
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  // -------------states
  const [showTime, setShowTime] = useState(false);
  const [pickupTime, setPickTime] = useState(moment().toDate());
  const [showReturnTime, setShowReturnTime] = useState(false);
  const [returnTime, setReturnTime] = useState(moment().toDate());
  const [editOption, setEditOption] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [selectedSortFilter, setSelectedSortFilter] = useState(null);
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [maximumPrice, setMaximumPrice] = useState(50000);
  const [allFilters, setAllFilter] = useState([
    {id: 1, label: 'all', value: [{label: 'sadsfd'}]},
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchFullData, setSearchFullData] = useState({});
  const [searchData, setSearchData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [moreLoader, setMoreLoader] = useState(false);
  const [searchDataParam, setSearchDataParam] = useState(paramData);
  console.log(searchDataParam, 'searchDatasearchData');


  useEffect(() => {
    getProductDetail();
  }, [pageNo]);


  console.log(pageNo,'pageNo');
  const getProductDetail = () => {
    let data = {
      ...searchDataParam,
      page: pageNo,
      limit: 3,
      // location: {location_latitude: 30.733315, location_longitude: 76.779419},
    };
    let header = {
      code: appData.profile.code,
    };
    console.log(data, 'datadatadatadata');
    actions
      .searchProductByType(data, header)
      .then(res => {
        console.log(res, 'resresresresres++resres');
        setSearchFullData(res?.data)
        setLastPage(res?.data?.products?.last_page);
        setSearchData(pageNo == 1 ?res?.data?.products :[...searchData, ...res?.data?.products])
        setRefreshing(false);
        setMoreLoader(false);
        setIsLoading(false);
      })
      .catch(erro => {
        setRefreshing(false);
        setMoreLoader(false);
        setIsLoading(false);
      });
  };

  const onFilterApply = (filterData = {}) => {
    console.log(filterData, 'filterDatafilterData');
    selectedFilters.current = filterData;
  };

  const allClearFilters = () => {
    selectedFilters.current = null;
  };

  const updateMinMax = (min, max) => {
    setMinimumPrice(min);
    setMaximumPrice(max);
  };
  // ----------------refres sheet-----------
  const handleRefresh = () => {
    setRefreshing(true);
    setPageNo(1);
    getProductDetail();
  };

  const onEndReached = () => {
    if (pageNo <= lastPage) {
      setPageNo(prvPage => prvPage + 1);
      setMoreLoader(true);
    }
    setIsLoading(false);
  };

  function headerview() {
    return (
      <View style={styles.flallistheaderview}>
        <Text
          style={{
            ...styles.headertext,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          { searchDataParam?.service == 'yacht' ? strings.AVAILABLE_YACTH :strings.AVAILABLE_CAR}
        </Text>
        {/* <TouchableOpacity onPress={() => setIsShowFilter(true)}>
          <Image
            source={imagePath.filter_atlantic}
            style={{
              ...styles.headerimage,
              tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
          />
        </TouchableOpacity> */}
      </View>
    );
  }
  const listFooterComponent = () => {
    return (
      <>
        {!!moreLoader ? (
          <View style={{height: moderateScale(60)}}>
            <UIActivityIndicator />
          </View>
        ) : null}
      </>
    );
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      isLoading={isLoading}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: moderateScale(14),
          borderBottomColor: colors.grey3,
          borderBottomWidth: 1,
          paddingBottom: moderateScaleVertical(16),
        }}>
        <View style={{flex: 0.1, justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FastImage
              source={imagePath.backRoyo}
              style={{height: moderateScale(16), width: moderateScale(16)}}
              resizeMode="contain"
              tintColor={isDarkMode ? MyDarkTheme.colors.white : colors.black}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingVertical: moderateScale(20),
            flex: 0.9,
            backgroundColor: isDarkMode ? MyDarkTheme.colors.border : '#F7F7F7',
            flexDirection: 'row',
            marginTop: moderateScale(10),
            paddingHorizontal:moderateScale(10)
          }}>
          {/* {editOption && (
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                paddingVertical: moderateScaleVertical(10),
              }}
              onPress={() => setEditOption(false)}>
              <FastImage
                source={imagePath.greyCrossSmall}
                style={{
                  height: moderateScale(25),
                  width: moderateScale(25),
                  marginHorizontal: moderateScale(10),
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )} */}
          {/* {editOption ? (
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <SelectDatePicker
                showTime={showTime}
                setShowTime={val => setShowTime(val)}
                time={pickupTime}
                minimumDate={pickupTime}
                selectTime={vel => setPickTime(vel)}
                title={strings.PICKUP_DATE}
              />
              <View
                style={{
                  justifyContent: 'center',
                  borderWidth: 0.6,
                  width: moderateScale(20),
                }}
              />
              <SelectDatePicker
                showTime={showReturnTime}
                setShowTime={val => setShowReturnTime(val)}
                time={returnTime}
                minimumDate={returnTime}
                selectTime={vel => setReturnTime(vel)}
                title={'Return Date'}
              />
            </View>
          ) : ( */}
          <View style={{flex: 0.9}}>
            {/* ---------place view---------- */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 0.45}}>
                <Text
                  style={{
                    maxWidth: width / 3,
                    color: isDarkMode ? colors.white : colors.black,
                    
                  }}
                  numberOfLines={2}
                >
                  {searchDataParam?.pickup?.address}
                </Text>
              </View>
              {searchDataParam?.service == 'yacht' ? null :
                <>

              <View style={{flex: 0.1, marginRight: moderateScale(20)}}>
                <FastImage
                  source={imagePath.backArrow}
                  style={{
                    height: moderateScale(14),
                    width: moderateScale(20),
                    marginHorizontal: moderateScale(20),
                    transform: [{rotate: '180deg'}],
                    justifyContent: 'center',
                  }}
                  tintColor={isDarkMode ? colors.white : colors.black}
                  resizeMode="contain"
                />
              </View>
              <View style={{flex: 0.45}}>
                <Text
                  style={{
                    maxWidth: width / 3,
                    color: isDarkMode ? colors.white : colors.black,
                      }}
                      numberOfLines={2}
                    >
                  {searchDataParam?.dropOff?.address}
                </Text>
                  </View>
                  </>
              }
            </View>
            {/* ---------date view---------- */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: moderateScale(6),
              }}>
              <View style={{flex: 0.45}}>
                <Text
                  style={{
                    color: isDarkMode ? colors.white : colors.black,
                    maxWidth: width / 3,
                  }}>
                  {searchDataParam?.pickup?.time}
                </Text>
              </View>

              {searchDataParam?.service == 'yacht' ? null :
             <>
             <View
                style={{
                  justifyContent: 'center',
                  // borderWidth: 0.6,
                  flex: 0.1,
                  marginRight: moderateScale(10),
                  width: moderateScale(20),
                  marginHorizontal: moderateScale(10),
                  height: moderateScale(1),
                  backgroundColor: isDarkMode ? colors.white : colors.black,
                }}
              />
              <View style={{flex: 0.45}}>
                <Text
                  style={{
                    color: isDarkMode ? colors.white : colors.black,
                    maxWidth: width / 3,
                  }}>
                  {searchDataParam?.dropOff?.time}
                </Text>
                  </View>
                  </>
              }
            </View>
          </View>
         {searchDataParam?.service == 'yacht' ? null :   <TouchableOpacity
            style={{
              // position: 'absolute',
              //   right: 0,
              flex: 0.1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            // onPress={() => setEditOption(true)}>
            onPress={() => navigation.goBack()}>
            <FastImage
              source={imagePath.edit1Royo}
              style={{
                height: moderateScale(14),
                width: moderateScale(20),
                marginHorizontal: moderateScale(10),
              }}
              tintColor={isDarkMode ? colors.white : colors.black}
              resizeMode="contain"
            />
          </TouchableOpacity>}
          {/* )} */}
        </View>
      </View>
      <FlatList
        data={searchData || []}
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          marginTop: moderateScaleVertical(15),
        }}
        refreshing={refreshing}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={headerview}
        contentContainerStyle={{paddingBottom: moderateScale(20)}}
        keyExtractor={(i, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <ProductInfoCard
              onPress={() =>
              {
               
                navigation.navigate(navigationStrings.PRODUCTDETAIL, {
                  data: item,
                  searchDataParam:searchDataParam
                })
              }
              }
              serviveType={searchFullData?.service}
              item={item}
            />
          );
        }}
        ListEmptyComponent={
          !isLoading && (
            <View
              style={{
                flex: 1,
                marginTop: moderateScaleVertical(width / 2),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NoDataFound isLoading={isLoading} />
            </View>
          )
        }
        ListFooterComponent={listFooterComponent}
      />
      {/* --------------filter for cars */}
      {isShowFilter ? (
        <FilterComp
          isDarkMode={isDarkMode}
          themeColors={themeColors}
          onFilterApply={onFilterApply}
          onShowHideFilter={() => setIsShowFilter(false)}
          allClearFilters={allClearFilters}
          selectedSortFilter={selectedSortFilter}
          onSelectedSortFilter={val => setSelectedSortFilter(val)}
          maximumPrice={maximumPrice}
          minimumPrice={minimumPrice}
          updateMinMax={updateMinMax}
          filterData={allFilters}
        />
      ) : null}
    </WrapperContainer>
  );
};
export default memo(AvailableCars);

const styles = StyleSheet.create({
  flallistheaderview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(22),
    alignItems: 'center',
    marginTop: moderateScaleVertical(16),
    // backgroundColor:'pink'
  },
  headertext: {
    fontFamily: fontFamily.bold,
    marginTop: moderateScaleVertical(10),
    fontSize: textScale(16),
  },
  headerimage: {
    alignItems: 'center',
    height: moderateScaleVertical(18),
    // width: moderateScaleVertical(18),
    marginTop: moderateScaleVertical(10),
  },
});
