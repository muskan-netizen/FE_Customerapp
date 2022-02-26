import {debounce} from 'lodash';
import React, {useState, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import {useSelector} from 'react-redux';
import Header3 from '../../Components/Header3';
import SearchLoader from '../../Components/Loaders/SearchLoader';
import MarketCard3 from '../../Components/MarketCard3';
import NoDataFound from '../../Components/NoDataFound';
import SearchBar2 from '../../Components/SearchBar2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import * as Animatable from 'react-native-animatable';
import actions from '../../redux/actions';
import VendorDetailLoader from '../../Components/Loaders/VendorDetailLoader';
import BannerLoader from '../../Components/Loaders/BannerLoader';

export default function ViewAllData({route, navigation}) {
  console.log('route', route);

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 5,
    isRefreshing: false,
    vendorData: [],
  });
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state.initBoot);

  const categoryData = useSelector((state) => state?.vendor?.categoryData);
  const {appMainData, dineInType} = useSelector((state) => state?.home);
  // alert(dine_In_Type);
  const location = useSelector((state) => state?.home?.location);

  const {isLoading, pageNo, isRefreshing, limit, vendorData} = state;
  const {data, type} = route.params;

  console.log(data, 'ViewAllData>ViewAllData');
  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

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
            isVendorList: true,
            fetchOffers: true,
          })();
    }
  };
  useEffect(() => {
    getAllVendorData();
  }, []);

  const getAllVendorData = (slectedLocatonFromPreviousScreen) => {
    console.log('getAllVendorData>>>>COMES HERE');
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
    {
      actions
        .getAllVendors(
          {
            type: dineInType ? dineInType : dineInType,
            ...latlongObj,
            // ...vendorFilterData,
          },
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
            // ...latlongObj,
          },
        )
        .then((res) => {
          if (res && res?.data && res?.data?.data) {
            updateState({
              vendorData: res?.data?.data,
              isLoadingB: false,
              isLoading: false,
            });
          }
          console.log('getAllVendors data++++++', res);
        })
        .catch(errorMethod);
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

  /**********/

  const _renderItem = ({item, index}) => {
    return (
      <Animatable.View
        style={{marginHorizontal: moderateScale(15)}}
        animation={'fadeInUp'}
        delay={index * 60}>
        <MarketCard3 onPress={() => _checkRedirectScreen(item)} data={item} />
      </Animatable.View>
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
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}>
      <Header3
        leftIcon={imagePath.icBackb}
        centerTitle={data?.name}
        rightIcon={imagePath.search}
        location={location}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />
      <SearchBar2 navigation={navigation} />
      {isLoading ? (
        <View>
          <View style={{height: 10}} />
          <BannerLoader
            isVendorLoader
            viewStyles={{marginTop: moderateScale(20)}}
          />
          <BannerLoader
            isVendorLoader
            viewStyles={{marginTop: moderateScale(20)}}
          />
          <BannerLoader
            isVendorLoader
            viewStyles={{marginTop: moderateScale(20)}}
          />

          <BannerLoader
            isVendorLoader
            viewStyles={{marginTop: moderateScale(20)}}
          />
          <BannerLoader
            isVendorLoader
            viewStyles={{marginTop: moderateScale(20)}}
          />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={(!!vendorData && vendorData) || []}
          ItemSeparatorComponent={() => <View style={{height: 8}} />}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItem}
          ListEmptyComponent={
            !isLoading && (
              <View
                style={{
                  flex: 1,
                  marginTop: moderateScaleVertical(width / 2),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <NoDataFound isLoading={state.isLoading} />
              </View>
            )
          }
          ListFooterComponent={() => <View style={{height: 100}} />}
        />
      )}
    </WrapperContainer>
  );
}
