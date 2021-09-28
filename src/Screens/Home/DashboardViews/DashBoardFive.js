import React, {useRef, useState} from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useDarkMode} from 'react-native-dark-mode';
import {Pagination} from 'react-native-snap-carousel';
import {useScrollToTop} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import BannerHome2 from '../../../Components/BannerHome2';
import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
import BannerLoader from '../../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import SearchLoader from '../../../Components/Loaders/SearchLoader';
import MarketCard3 from '../../../Components/MarketCard3';
import SearchBar2 from '../../../Components/SearchBar2';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import {
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  width,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import stylesFunc from '../styles';

export default function DashBoardFive({
  handleRefresh = () => {},
  bannerPress = () => {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => {},
  navigation = {},
  toggleData = {},
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
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const {bannerRef} = useRef();
  const {slider1ActiveSlide} = state;
  const styles = stylesFunc({themeColors, fontFamily});

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const _renderItem = ({item}) => (
    <HomeCategoryCard2
      data={item}
      onPress={() => onPressCategory(item)}
      isLoading={isLoading}
    />
  );

  const _renderVendors = ({item}) => (
    <MarketCard3
      data={item}
      onPress={() => onPressCategory(item)}
      extraStyles={{margin: 0}}
    />
  );

  const ref = React.useRef(null);
  useScrollToTop(ref); // scroll to top

  const listHeader = () => {
    return (
      <View>
        {appMainData &&
          appMainData?.categories &&
          !!appMainData?.categories.length && (
            <FlatList
              numColumns={4}
              data={appMainData?.categories}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={_renderItem}
              ItemSeparatorComponent={() => (
                <View style={{height: moderateScale(10)}} />
              )}
            />
          )}
        <View style={{marginTop: moderateScale(30)}}>
          {appData?.banners?.length && (
            <>
              <BannerHome2
                bannerRef={bannerRef}
                slider1ActiveSlide={slider1ActiveSlide}
                bannerData={appData.banners}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                onSnapToItem={(index) =>
                  updateState({slider1ActiveSlide: index})
                }
                setActiveState={(index) =>
                  updateState({slider1ActiveSlide: index})
                }
                onPress={(item) => bannerPress(item)}
                carouselViewStyle={{height: width * 0.33}}
                isDarkMode={isDarkMode}
              />
              <Pagination
                dotsLength={appData?.banners?.length}
                activeDotIndex={slider1ActiveSlide}
                containerStyle={{
                  marginTop: -15,
                }}
                dotColor={themeColors.primary_color}
                dotStyle={styles.dotStyle}
                inactiveDotColor={colors.greyLight}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
                inactiveDotStyle={styles.inActiveDotStyle}
              />
            </>
          )}
        </View>
        <Text
          style={{
            ...styles.exploreStoresTxt,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            marginTop: 0,
          }}>
          {strings.EXPLORE_STORES}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <SearchLoader viewStyles={{marginTop: moderateScale(15)}} />
        <CategoryLoader2 viewStyles={{marginTop: moderateScale(25)}} />
        <CategoryLoader2 viewStyles={{marginTop: moderateScale(25)}} />
        <BannerLoader
          isBannerDots
          viewStyles={{
            marginTop: moderateScale(35),
          }}
        />
        <HeaderLoader
          viewStyles={{marginVertical: 20}}
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
          viewStyles={{marginTop: moderateScale(20)}}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{marginTop: moderateScale(25)}}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{marginTop: moderateScale(25)}}
        />
        {/* <HomeLoader /> */}
      </ScrollView>
    );
  }

  return (
    <View style={{flex: 1}}>
      <SearchBar2
        placeHolderTxt={
          toggleData?.profile?.preferences?.search_nomenclature ||
          strings.SEARCH_HERE
        }
        navigation={navigation}
      />
      <View style={{flex: 1, marginHorizontal: moderateScale(15)}}>
        {appMainData?.vendors && !!appMainData?.vendors?.length && (
          <Animatable.View animation={'fadeInUp'} delay={200}>
            <FlatList
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical={true}
              ref={ref}
              ListHeaderComponent={listHeader()}
              data={appMainData?.vendors}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={_renderVendors}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={themeColors.primary_color}
                />
              }
              ItemSeparatorComponent={() => (
                <View style={{height: moderateScale(10)}} />
              )}
              ListFooterComponent={() => (
                <View
                  style={{
                    height:
                      Platform.OS == 'ios'
                        ? moderateScale(72)
                        : moderateScale(90),
                  }}
                />
              )}
            />
          </Animatable.View>
        )}
      </View>
    </View>
  );
}
