import { useScrollToTop } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList, Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
  Animated
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import AppLink from 'react-native-app-link';
import { useDarkMode } from 'react-native-dark-mode';
import FastImage from 'react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import BlurImages from '../../../Components/BlurImages';
import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
import BannerLoader from '../../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import SearchLoader from '../../../Components/Loaders/SearchLoader';
import MarketCard3 from '../../../Components/MarketCard3';
import ProductsComp from '../../../Components/ProductsComp';
import SearchBar2 from '../../../Components/SearchBar2';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import stylesFunc from '../styles';
import { SvgUri } from 'react-native-svg';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../../../utils/helperFunctions';

export default function DashBoardFive({
  handleRefresh = () => { },
  bannerPress = () => { },
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  navigation = {},
  toggleData = {},
  curAddress = {}
}) {
  const userData = useSelector((state) => state?.auth?.userData);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    isVendorColumnList: false,
    vendorsData: []
  });

  const appMainData = useSelector((state) => state?.home?.appMainData);
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );


  const { bannerRef } = useRef();
  const { slider1ActiveSlide, vendorsData } = state;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    if (appMainData?.vendors && appMainData?.vendors.length) {
      updateState({
        vendorsData: appMainData?.vendors.splice(0, 4)
      })
    }
  }, [appMainData?.vendors])


  const _renderItem = ({ item }) => (
    <HomeCategoryCard2
      data={item}
      onPress={() => onPressCategory(item)}
      isLoading={isLoading}
    />
  );

  const _renderVendors = ({ item, index }) => (
    <View style={{ marginHorizontal: moderateScale(16) }}>
      <MarketCard3
        data={item}
        onPress={() => onPressCategory(item)}
        extraStyles={{ margin: 2 }}
      />
    </View>
  );

  const ref = React.useRef(null);
  useScrollToTop(ref); // scroll to top

  const scaleInAnimated = new Animated.Value(0);

  const renderBanners = ({ item }) => {
    const imageUrl = getImageUrl(item.image.proxy_url, item.image.image_path, '900/700');
    return (
      <TouchableOpacity
        onPress={() => bannerPress(item)}
      >
        <FastImage
          source={{ uri: imageUrl, priority: FastImage.priority.high }}
          style={{
            height: height / 3.8,
            width: moderateScale(160),
            borderRadius: moderateScale(16)
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    )
  }

  // console.log("app main data", appMainData)


  const categoriesBanners = () => {
    return (
      <View>
        {appMainData &&
          appMainData?.categories &&
          !!appMainData?.categories.length && (
            <View style={{ marginHorizontal: moderateScale(8) }}>
              <FlatList
                numColumns={4}
                data={appMainData?.categories}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={_renderItem}
                ItemSeparatorComponent={() => (
                  <View style={{ height: moderateScale(10) }} />
                )}
              />
            </View>
          )}
        <View style={{ marginVertical: moderateScale(24) }}>
          {!!appData?.banners?.length && (
            <>
              <FlatList
                horizontal
                data={appData?.banners}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={renderBanners}
                ItemSeparatorComponent={() => (
                  <View style={{ marginRight: moderateScale(12) }} />
                )}
                ListHeaderComponent={() => <View style={{ marginLeft: moderateScale(16) }} />}
                ListFooterComponent={() => <View style={{ marginRight: moderateScale(16) }} />}
              />
            </>
          )}
        </View>
      </View>
    );
  };

  const moveToNewScreen = (screenName, data = {}) => () => { navigation.navigate(screenName, { data }) };
  const renderBrands = ({ item }) => {
    // const imageUrl = getImageUrl(item.image.proxy_url, item.image.image_path, '800/600');
    const imageURI = getImageUrl(
      item.image.proxy_url,
      item.image.image_path,
      '800/600'
    );
    const isSVG = imageURI ? imageURI.includes('.svg') : null;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}
        // style={{
        //   ...getScaleTransformationStyle(scaleInAnimated),
        // }}
        // onPressIn={() => pressInAnimation(scaleInAnimated)}
        // onPressOut={() => pressOutAnimation(scaleInAnimated)}
      >
        {isSVG ? (
          <SvgUri
            height={moderateScale(96)}
            width={moderateScale(96)}
            uri={imageURI}
          />
        ) : (
          <FastImage
            source={{ uri: imageURI, priority: FastImage.priority.high }}
            style={{
              height: moderateScale(96),
              width: moderateScale(96),
              borderRadius: moderateScale(10),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
          />
        )}
      </TouchableOpacity>
    )
  }


  const listHeader = (type, isViewAll = true) => {
    return (
      <View style={styles.viewAllVeiw}>
        <Text
          style={{
            ...styles.exploreStoresTxt,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            marginTop: 0,
          }}>
          {type}
        </Text>
        {/* {!!isViewAll && (<TouchableOpacity>
          <Text style={styles.viewAllText}>{strings.VIEW_ALL}</Text>
        </TouchableOpacity>)} */}
      </View>
    )
  }


  const renderFeaturedProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() => navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })}
      />
    )
  }

  const renderSale = ({ item }) => {
    return (
      <ProductsComp
        // isDiscount
        item={item}
        imageStyle={{ height: moderateScale(186) }}
        onPress={() => navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })}
      />
    )
  }

  if (isLoading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <SearchLoader viewStyles={{ marginTop: moderateScale(15) }} />
        <CategoryLoader2 viewStyles={{ marginTop: moderateScale(25) }} />
        <CategoryLoader2 viewStyles={{ marginTop: moderateScale(25) }} />
        <BannerLoader
          isBannerDots
          viewStyles={{
            marginTop: moderateScale(35),
          }}
        />
        <HeaderLoader
          viewStyles={{ marginVertical: 20 }}
          widthLeft={moderateScale(150)}
          rectWidthLeft={moderateScale(150)}
          heightLeft={moderateScaleVertical(20)}
          rectHeightLeft={moderateScaleVertical(20)}
          isRight={false}
          rx={15}
          ry={15}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{ marginTop: moderateScale(20) }}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{ marginTop: moderateScale(25) }}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{ marginTop: moderateScale(25) }}
        />
        {/* <HomeLoader /> */}
      </ScrollView>
    );
  }


  return (
    <View style={{ flex: 1 }}>
      <SearchBar2
        placeHolderTxt={
          toggleData?.profile?.preferences?.search_nomenclature ||
          strings.SEARCH_HERE
        }
        navigation={navigation}
      />
      <ScrollView
        showsVerticalScrollIndicator={false} style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
      >
        <Animatable.View animation={'fadeInUp'} delay={200}>
          {categoriesBanners()}
          {vendorsData && !!vendorsData?.length && (
            <>
              <FlatList
                ListHeaderComponent={() => listHeader(strings.EXPLORE_STORES)}
                showsVerticalScrollIndicator={false}
                alwaysBounceVertical={true}
                ref={ref}
                data={vendorsData}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={_renderVendors}
                ItemSeparatorComponent={() => (
                  <View style={{ height: moderateScale(10) }} />
                )}
              />
              <View style={{ marginVertical: 16 }} />
              <View>
                {appMainData &&
                  appMainData?.brands &&
                  !!appMainData?.brands.length && (
                    <>
                      <View>
                        {listHeader(strings.POPULAR_BRANDS, false)}
                      </View>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={appMainData?.brands}
                        renderItem={renderBrands}
                        ItemSeparatorComponent={() => (
                          <View style={{ marginRight: moderateScale(12) }} />
                        )}
                        ListHeaderComponent={() => <View style={{ marginLeft: moderateScale(16) }} />}
                        ListFooterComponent={() => <View style={{ marginRight: moderateScale(16) }} />}
                      />
                    </>
                  )}
              </View>
            </>
          )}
          <View style={{ marginVertical: moderateScaleVertical(12) }}>
            <View>
              {appMainData &&
                appMainData?.featured_products &&
                !!appMainData?.featured_products.length && (
                  <>
                    <View>
                      {listHeader(strings.FEATURED_PRODUCTS)}
                    </View>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      data={appMainData?.featured_products}
                      renderItem={renderFeaturedProducts}
                      ItemSeparatorComponent={() => (
                        <View style={{ marginRight: moderateScale(16) }} />
                      )}
                      ListHeaderComponent={() => <View style={{ marginLeft: moderateScale(16) }} />}
                      ListFooterComponent={() => <View style={{ marginRight: moderateScale(16) }} />}
                    />
                  </>
                )}
            </View>
          </View>

          <View style={{ marginVertical: moderateScaleVertical(12) }}>
            <View>
              {appMainData &&
                appMainData?.new_products &&
                !!appMainData?.new_products.length && (
                  <>
                    <View>
                      {listHeader('New Products')}
                    </View>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      data={appMainData?.new_products}
                      renderItem={renderFeaturedProducts}
                      ItemSeparatorComponent={() => (
                        <View style={{ marginRight: moderateScale(16) }} />
                      )}
                      ListHeaderComponent={() => <View style={{ marginLeft: moderateScale(16) }} />}
                      ListFooterComponent={() => <View style={{ marginRight: moderateScale(16) }} />}
                    />
                  </>
                )}
            </View>
          </View>

          <View>
            {appMainData &&
              appMainData?.on_sale_products &&
              !!appMainData?.on_sale_products.length && (
                <>
                  <View>
                    {listHeader(strings.ON_SALE)}
                  </View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={appMainData?.on_sale_products}
                    renderItem={renderSale}
                    ItemSeparatorComponent={() => (
                      <View style={{ marginRight: moderateScale(16) }} />
                    )}
                    ListHeaderComponent={() => <View style={{ marginLeft: moderateScale(16) }} />}
                    ListFooterComponent={() => <View style={{ marginRight: moderateScale(16) }} />}
                  />
                </>
              )}
          </View>
        </Animatable.View>
        <View
          style={{
            height:
              Platform.OS == 'ios'
                ? moderateScale(60)
                : moderateScale(90),
          }}
        />
      </ScrollView>
    </View>
  );
}
