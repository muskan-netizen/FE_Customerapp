import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Pagination } from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import BannerHome2 from '../../../Components/BannerHome2';
import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
import CardLoader from '../../../Components/Loaders/CardLoader';
import CategoryLoader from '../../../Components/Loaders/CategoryLoader';
import VendorDetailLoader from '../../../Components/Loaders/VendorDetailLoader';
import MarketCard3 from '../../../Components/MarketCard3';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import { useScrollToTop } from '@react-navigation/native';
import {
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import ListEmptyVendors from '../../Vendors/ListEmptyVendors';
import stylesFunc from '../styles';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../../../styles/theme';
import { SearchBar } from 'react-native-elements/dist/searchbar/SearchBar';
import SearchBar2 from '../../../Components/SearchBar2';
import HomeLoader from '../../../Components/Loaders/HomeLoader';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import SearchLoader from '../../../Components/Loaders/SearchLoader';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import BannerLoader from '../../../Components/Loaders/BannerLoader';

export default function DashBoardFive({
  handleRefresh = () => { },
  bannerPress = () => { },
  //   appMainData = {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  selcetedToggle,
  toggleData,
  navigation = {},
}) {
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
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state?.auth?.userData);

  const fontFamily = appStyle?.fontSizeData;
  const { bannerRef } = useRef();
  const { slider1ActiveSlide, newCategoryData, isVendorColumnList } = state;
  const styles = stylesFunc({ themeColors, fontFamily });

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const _renderItem = ({ item }) => (
    <HomeCategoryCard2
      data={item}
      onPress={() => onPressCategory(item)}
      isLoading={isLoading}
    />
  );

  const _renderVendors = ({ item }) => (
    <MarketCard3 data={item} onPress={() => onPressCategory(item)} />
  );
  const _changeVendorListStyle = () =>
    updateState({ isVendorColumnList: !isVendorColumnList });

  // console.log(appMainData, 'appMainData');

  const ref = React.useRef(null);
  useScrollToTop(ref); // scroll to top

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
          rx={20}
          ry={20}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{
            marginTop: moderateScale(20),
          }}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{
            marginTop: moderateScale(25),
          }}
        />
        <BannerLoader
          isVendorLoader
          viewStyles={{
            marginTop: moderateScale(25),
          }}
        />
        {/* <HomeLoader /> */}
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SearchBar2 navigation={navigation} />
      <ScrollView
        ref={ref}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginHorizontal: moderateScale(15),
        }}>
        {appMainData &&
          appMainData?.categories &&
          appMainData?.categories.length && (
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
          )}
        <View style={{ marginVertical: moderateScale(30) }}>
          {appData?.banners?.length && (
            <>
              <BannerHome2
                bannerRef={bannerRef}
                slider1ActiveSlide={slider1ActiveSlide}
                bannerData={appData.banners}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                onSnapToItem={(index) =>
                  updateState({ slider1ActiveSlide: index })
                }
                setActiveState={(index) =>
                  updateState({ slider1ActiveSlide: index })
                }
                onPress={(item) => bannerPress(item)}
                carouselViewStyle={{ height: width * 0.33 }}
              />

              <Pagination
                dotsLength={appData.banners.length}
                activeDotIndex={slider1ActiveSlide}
                containerStyle={{
                  marginTop: -15,
                }}
                dotColor={themeColors.primary_color}
                dotStyle={{
                  height: 6,
                  width: 18,
                  borderRadius: 12 / 2,
                  marginLeft: -8,
                }}
                inactiveDotColor={colors.greyLight}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
                inactiveDotStyle={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  marginLeft: -8,
                }}
              />
            </>
          )}
        </View>
        {appMainData?.vendors && appMainData?.vendors?.length && (
          <View>
            <Text
              style={[
                styles.exploreStoresTxt,
                {
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                },
              ]}>
              {strings.EXPLORE_STORES}
            </Text>
            <FlatList
              data={appMainData?.vendors}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={_renderVendors}
              ItemSeparatorComponent={() => (
                <View style={{ height: moderateScale(10) }} />
              )}
            />
          </View>
        )}
        <View
          style={{
            height:
              Platform.OS === 'ios'
                ? moderateScaleVertical(70)
                : moderateScaleVertical(90),
          }}
        />
      </ScrollView>
    </View>
  );
}
