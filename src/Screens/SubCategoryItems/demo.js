import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import HomeCategoryCard2 from '../../Components/HomeCategoryCard2';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import Carousel from 'react-native-snap-carousel';
import DeviceInfo from 'react-native-device-info';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import Ecomheader from '../../Components/EcomHeader';
import {height,moderateScale,moderateScaleVertical,width} from '../../styles/responsiveSize';
import { getImageUrl, showError } from '../../utils/helperFunctions';
import CompLoader from './CompLoader';
import stylesFunc from './styles';
import { getImageUrlNew } from '../../utils/commonFunction';
import { SvgUri } from 'react-native-svg';
import BrandCard2 from '../../Components/BrandCard2';
import BrandCard from '../../Components/BrandCard';
import MarketCard from '../../Components/MarketCard';
import { appIds, shortCodes } from '../../utils/constants/DynamicAppKeys';

export default function SubcategoryVendor({ navigation, route }) {
  console.log(route, 'route>>>>route');
  const paramData = route?.params?.data;
  const {
    appData,
    currencies,
    languages,
    appStyle,
    isDineInSelected,
    themeColor,
    themeToggle,
    themeColors,
  } = useSelector((state) => state?.initBoot);
  const { appMainData, dineInType, location } = useSelector((state) => state?.home || {});
  const { userData } = useSelector((state) => state?.auth);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;


  const memorizedThemeColors = useMemo(() => themeColors, [themeColors])
  const memorizedIsDarkMode = useMemo(() => isDarkMode, [isDarkMode])
  const memorizedAppStyle = useMemo(() => appStyle, [appStyle])

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  const initState = {
    mobile_banners: [],
    vendors: [],
    categories: [],
    brands: [],
    featured_products: [],
    new_products: [],
    on_sale_products: []
  }

  const [subcategoryVendorData, setSubcategoryVendorData] = useState(initState);
  const [isLoading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState({});
  const [isApiLoading, setApiLoading] = useState(false);
  const [selectedTabType, setSelectedTabType] = useState({});
  const [currentActiveSlider, setCurrentActiveSlider] = useState(0)

  const moveToNewScreen =(screenName, data = {}) =>() => {navigation.navigate(screenName, { data })};



  useEffect(() => {
    getSubCategoryVendors();
    return () => {setSubcategoryVendorData(initState)}
  }, []);

  const getSubCategoryVendors = useCallback(() => {
    if (!isEmpty(selectedFilter)) {
      setApiLoading(true);
    }
    let latlongObj = {};
    if (appData?.profile?.preferences?.is_hyperlocal) {
      latlongObj = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
    }
    let vendorFilterData = {
      open_vendor: selectedFilter?.id == 1 ? 1 : 0,
      close_vendor: selectedFilter?.id == 2 ? 1 : 0,
      best_vendor: selectedFilter?.id == 3 ? 1 : 0,
    };

    let apiData = {
      type: dineInType,
      category_id: paramData?.id,
      ...latlongObj,
      ...vendorFilterData,
    }
    let apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }

    console.log(apiHeader, "api data", apiData)

    actions.getSubCategoryVendors(apiData, apiHeader)
      .then((res) => {
        console.log(res, 'res>>>>>>res...res');
        setApiLoading(false);
        setLoading(false);
        setSubcategoryVendorData(res?.data);
      })
      .catch(errorMethod);
  }, [selectedFilter]);

  //Error handling in screen
  const errorMethod = useCallback((error) => {
    console.log("error raised", error)
    setApiLoading(false);
    setLoading(false);
    showError(error?.message || error?.error);
  }, [selectedTabType, paramData]);



  const openUber = useCallback(()=>{
    let appName = 'Uber - Easy affordable trips';
    let appStoreLocale = '';
    let playStoreId = 'com.ubercab';
    let appStoreId = '368677368';
    AppLink.maybeOpenURL('uber://', {
      appName: appName,
      appStoreId: appStoreId,
      appStoreLocale: appStoreLocale,
      playStoreId: playStoreId,
    })
      .then((res) => { })
      .catch((err) => {
        Linking.openURL('https://www.uber.com/in/en/');
        console.log('errro raised', err);
      });
  },[])

  
  const onPressVendor = useCallback((item)=>{
    if (item?.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          item['pickup_taxi'] = true;
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (!!item?.is_show_category) {
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
        item,
        rootProducts: true,
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
  },[userData])


  const onPressCategory = useCallback((item)=>{
    console.log("onPressCategoryItem",item)  
    switch (item?.redirect_to) {
      case staticStrings.VENDOR: moveToNewScreen(navigationStrings.VENDOR, item)();break;
      case staticStrings.PRODUCT: case staticStrings.CATEGORY:
      case staticStrings.ONDEMANDSERVICE: case staticStrings.LAUNDRY:
        moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          fetchOffers: true,
          id: item.id,
          vendor:
            item.redirect_to == staticStrings.ONDEMANDSERVICE
              ? false
              : item.redirect_to == staticStrings.PRODUCT
                ? false
                : true,
          name: item.name,
          isVendorList: false,
        })();
        break;
        case staticStrings.PICKUPANDDELIEVRY:
          if (!!userData?.auth_token) {
            if (shortCodes.arenagrub == appData?.profile?.code) {openUber();
            } else {
              item['pickup_taxi'] = true;
              moveToNewScreen(navigationStrings.ADDADDRESS, item)();
            }
          } else {actions.setAppSessionData('on_login')}
        break;
        case staticStrings.CELEBRITY: moveToNewScreen(navigationStrings.CELEBRITY)();break;
        case staticStrings.BRAND: moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();break;
        case staticStrings.SUBCATEGORY: moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
        break;
        default:
        !!item?.is_show_category ? 
        moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
          item,
          rootProducts: true,
        })():
        moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: item?.id,
          vendor: false,
          name: item?.name,
          isVendorList: false,
          fetchOffers: true,
        })();
        break;
    }
  },[userData])
  

const onViewAll = useCallback((type, data)=>{
  navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
    data: data,
    type: type,
  });
},[])
 
  const _renderItem = useCallback(({ item, index }) => {
    return (
      <HomeCategoryCard2
        data={item}
        onPress={() => onPressCategory(item)}
        isLoading={isLoading}
      />
    );
  }, [isLoading]);

  const renderBanners = useCallback(({ item, index }) => {
    const imageUrl = item?.banner_image_url ||
    getImageUrl(
      item?.image.image_fit,
      item?.image.image_path,
      appStyle?.homePageLayout === 5
        ? '800/600'
        : DeviceInfo.getBundleId() == appIds.masa
          ? '800/600'
          : '1200/1000',
    );
    console.log("appStyle?.homePageLayout ", appStyle?.homePageLayout)
    return (
      <View key={String(item?.id || index)}>
        <TouchableOpacity style={{
        }} activeOpacity={0.8} onPress={() => bannerPress(item)}>
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              height:
                appStyle?.homePageLayout !== 5
                  ? moderateScale(200)
                  : DeviceInfo.getBundleId() == appIds.masa
                    ? moderateScale(260)
                    : height / 3.8,
              width:
                appStyle?.homePageLayout !== 5
                  ? '100%'
                  : DeviceInfo.getBundleId() == appIds.masa
                    ? '100%'
                    : moderateScale(200),
              // borderRadius: moderateScale(16),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
    );
    // // const imageUrl = getImageUrl(item.image_fit, item.image_path, '400/600');
    // return (
    //   <>

    //   <FastImage
    //     source={{
    //       uri: 'https://previews.123rf.com/images/hollygraphic/hollygraphic1511/hollygraphic151100020/48173455-big-sale-banner-design.jpg',
    //       priority: FastImage.priority.high,
    //       cache: FastImage.cacheControl.immutable,
    //     }}
    //     style={{
    //       height: 200,
    //       width: moderateScale(160),
    //       borderRadius: moderateScale(16),
    //       backgroundColor: isDarkMode
    //         ? colors.whiteOpacity15
    //         : colors.greyColor,
    //     }}
    //     resizeMode={FastImage.resizeMode.cover}
    //   />
    //   </>
    // );
  }, []);


  console.log("currentActiveSlider", currentActiveSlider)


  const horizontalLine = useCallback(() => {
    return <View style={{ height: 2, backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity10, marginVertical: moderateScaleVertical(8) }} />
  }, [isDarkMode])


  const categoryView = useCallback(()=>{
    return (
      <View
        style={{

        }}>
        {!isEmpty(subcategoryVendorData?.categories) ? <FlatList
          key={1}
          horizontal
          data={subcategoryVendorData?.categories}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={_renderItem}
          ItemSeparatorComponent={() => (
            <View style={{ marginTop: moderateScale(24) }} />
          )}
          ListHeaderComponent={() => (
            <View style={{ marginLeft: moderateScale(12) }} />
          )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(12) }} />
          )}
        /> : null}
        
        {!!subcategoryVendorData?.mobile_banners && !isEmpty(subcategoryVendorData?.mobile_banners) ? <View
          style={{ marginTop: moderateScaleVertical(4) }}>

          <Carousel
            autoplay={true}
            loop={true}
            autoplayInterval={2000}
            data={subcategoryVendorData?.mobile_banners}
            renderItem={renderBanners}
            sliderWidth={width}
            itemWidth={width}
            onSnapToItem={(index) => setCurrentActiveSlider(index)}

          />
          <View style={{ alignSelf: 'center', flexDirection: 'row', marginTop: moderateScaleVertical(8) }}>
            {subcategoryVendorData?.mobile_banners.map((val, i) => {
              return (<View style={{
                ...styles.dotStyle, backgroundColor: i == currentActiveSlider ?
                  isDarkMode ? colors.white : colors.black : isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity20
              }} />)
            })}
          </View>
          {horizontalLine()}
          {/* <FlatList
            horizontal
            // data={subcategoryVendorData?.mobile_banners}
            data={[{},{}]}
            keyExtractor={(item, index) => String(index)}
            showsHorizontalScrollIndicator={false}
            renderItem={renderBanners}
            ItemSeparatorComponent={() => (
              <View style={{ marginRight: moderateScale(12) }} />
            )}
            ListHeaderComponent={() => (
              <View style={{ marginLeft: moderateScale(16) }} />
            )}
            ListFooterComponent={() => (
              <View style={{ marginRight: moderateScale(16) }} />
            )}
          /> */}
        </View> : null}
      </View>
    )
  },[isDarkMode, currentActiveSlider,subcategoryVendorData])
  
  const vendorHeader = useCallback(() => {

    if (appData?.profile?.preferences?.single_vendor) {
      return (<>{categoryView()}</>)
    }
    return (
      <View key={Math.random()}>
        {categoryView()}
      </View>
    );
  }, [selectedFilter, subcategoryVendorData, isDarkMode, currentActiveSlider]);

  const _renderVendors = useCallback(
    (item, index) => {
      let imageUrl = getImageUrl(
        item?.banner?.proxy_url || item?.image?.proxy_url,
        item?.banner?.image_path || item?.image?.image_path,
        '100/100',
      );
      return (
        <Pressable onPress={() => onPressVendor(item)} style={{ width: width / 3 }}>
          <View style={{ borderRadius: 8, alignItems: 'center' }}>
            <FastImage
              source={{
                uri: imageUrl,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={{
                width: moderateScale(100),
                height: moderateScale(100),
                borderRadius: 8
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text
              numberOfLines={1}
              style={{
                ...styles.vendorText,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                textAlign: 'center'
              }}>
              {item.name}
            </Text>
          </View>
        </Pressable>
      )
    },
    [isDarkMode, subcategoryVendorData],
  );




  const _renderBrands = useCallback((item, index) => {
    return (
      <BrandCard2
        data={item}
        onPress={() => { }}
        showName={false}
      />
    );
  }, [subcategoryVendorData, isDarkMode])


  const _renderSales = useCallback((item, index) => {
    return (
      <Text>Sales Product</Text>
      // <MarketCard3
      // data={item}
      // onPress={()=>{}}

      // />
    );
  }, [subcategoryVendorData, isDarkMode])

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white }}>
      {isLoading ?
        <Animatable.View animation={'fadeIn'} easing={'ease-in-out-sine'} style={{ flex: 1 }}>
          <CompLoader
            navigation={navigation}
            isDarkMode={memorizedIsDarkMode}
            appStyle={memorizedAppStyle}
            themeColors={memorizedThemeColors}
          /></Animatable.View> : <>

          <Animatable.View animation={'fadeIn'} easing={'ease-in-out-sine'} style={{ flex: 1 }}>
            <Ecomheader
              isDarkMode={memorizedIsDarkMode}
              navigation={navigation}
              style={{ marginBottom: moderateScaleVertical(16) }}
              themeColors={memorizedThemeColors}
              appStyle={memorizedAppStyle}
            />

            <ScrollView>
              {vendorHeader()}


              {/* Brands View */}
              {!isEmpty(subcategoryVendorData?.brands) ?
                <View style={{
                  backgroundColor: 'rgba(222,236,249,1)',
                  paddingHorizontal: moderateScale(16),
                  paddingVertical: moderateScaleVertical(8)
                }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.exploreStoresTxt,
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      fontFamily: fontFamily.medium,
                      marginBottom: moderateScaleVertical(8)
                    }}>
                    {strings.BRANDS}
                  </Text>
                  <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    {subcategoryVendorData?.brands.map((val, i) => {
                      return _renderBrands(val, i)
                    })}
                  </ScrollView>
                </View> : null}


              {!isEmpty(subcategoryVendorData?.brands) ? horizontalLine() : null}

              {/* On Sale Products View */}
              {!isEmpty(subcategoryVendorData?.on_sale_products) ?
                <View style={{
                  backgroundColor: 'rgba(222,236,249,1)',
                  paddingHorizontal: moderateScale(16),
                  paddingVertical: moderateScaleVertical(8),
                  marginTop: moderateScaleVertical(16)
                }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.exploreStoresTxt,
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      fontFamily: fontFamily.medium,
                      marginBottom: moderateScaleVertical(8)
                    }}>
                    {strings.ON_SALE}
                  </Text>

                  <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
                    {subcategoryVendorData?.on_sale_products.map((val, i) => {
                      return _renderSales(val, i)
                    })}
                  </View>
                </View> : null}

              {!isEmpty(subcategoryVendorData?.on_sale_products) ? horizontalLine() : null}

              {/* Vendors View */}

              {!isEmpty(subcategoryVendorData?.vendors) ? <View>
                <View style={{ ...styles.viewAllVeiw }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.exploreStoresTxt,
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      marginTop: 0,
                      flex: 1,
                      fontFamily: fontFamily.medium,
                    }}>
                    {`${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`}
                  </Text>

                  {!isEmpty(subcategoryVendorData?.vendors) && (
                    <TouchableOpacity
                      style={{ marginHorizontal: moderateScale(4) }}
                      onPress={() => onViewAll('vendor', appMainData?.vendors)}>
                      <Text style={styles.viewAllText}>{strings.VIEW_ALL}</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
                  {subcategoryVendorData?.vendors.map((val, i) => {
                    return _renderVendors(val, i)
                  })}
                </View>
              </View> : null}
              {!isEmpty(subcategoryVendorData?.vendors) ? horizontalLine() : null}



              {/* On Featured Products View */}
              {!isEmpty(subcategoryVendorData?.featured_products) ?
                <View style={{
                  backgroundColor: 'rgba(222,236,249,1)',
                  paddingHorizontal: moderateScale(16),
                  paddingVertical: moderateScaleVertical(8),
                  marginTop: moderateScaleVertical(16)
                }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.exploreStoresTxt,
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      fontFamily: fontFamily.medium,
                      marginBottom: moderateScaleVertical(8)
                    }}>
                    {strings.FEATURED_PRODUCTS}
                  </Text>

                  <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
                    {subcategoryVendorData?.featured_products.map((val, i) => {
                      return _renderSales(val, i)
                    })}
                  </View>
                </View> : null}

              {!isEmpty(subcategoryVendorData?.featured_products) ? horizontalLine() : null}



              {/* On New Products View */}
              {!isEmpty(subcategoryVendorData?.new_products) ?
                <View style={{
                  backgroundColor: 'rgba(222,236,249,1)',
                  paddingHorizontal: moderateScale(16),
                  paddingVertical: moderateScaleVertical(8),
                  marginTop: moderateScaleVertical(16)
                }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.exploreStoresTxt,
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      fontFamily: fontFamily.medium,
                      marginBottom: moderateScaleVertical(8)
                    }}>
                    {strings.NEW_PRODUCTS}
                  </Text>

                  <View style={{ flexDirection: "row", flexWrap: 'wrap' }}>
                    {subcategoryVendorData?.new_products.map((val, i) => {
                      return _renderSales(val, i)
                    })}
                  </View>
                </View> : null}

              {!isEmpty(subcategoryVendorData?.new_products) ? horizontalLine() : null}


            </ScrollView>


          </Animatable.View>
        </>
      }
    </View>
  );
}
