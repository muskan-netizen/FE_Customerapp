import React, {useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Pagination} from 'react-native-snap-carousel';
import {useSelector} from 'react-redux';
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

export default function DashBoardFive({
  handleRefresh = () => {},
  bannerPress = () => {},
  //   appMainData = {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => {},
  selcetedToggle,
  toggleData,
  navigation = {},
}) {
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    isVendorColumnList: false,
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state?.auth?.userData);

  const fontFamily = appStyle?.fontSizeData;
  const {bannerRef} = useRef();
  const {slider1ActiveSlide, newCategoryData, isVendorColumnList} = state;
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
    <MarketCard3 data={item} onPress={() => onPressCategory(item)} />
  );
  const _changeVendorListStyle = () =>
    updateState({isVendorColumnList: !isVendorColumnList});

  // console.log(appMainData, 'appMainData');

  return (
    <>
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
        <View style={{width: '90%'}}>
          <Text
            style={{fontFamily: fontFamily.regular, color: colors.textGreyB}}>
            {strings.SEARCH_HERE}
          </Text>
        </View>
        <Image source={imagePath.search1} />
      </TouchableOpacity>
      <ScrollView
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
          paddingHorizontal: moderateScale(15),
        }}>
        {isLoading ? (
          <View style={{marginTop: moderateScale(10)}}>
            <CategoryLoader
              listSize={2}
              isRow
              cardWidth={80}
              height={moderateScale(80)}
              containerStyle={{margin: moderateScale(5)}}
            />
          </View>
        ) : appMainData &&
          appMainData?.categories &&
          appMainData?.categories.length ? (
          <View style={{width: '100%'}}>
            {/* <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: textScale(16),
                marginVertical: moderateScale(15),
              }}>
              {strings.SELECT_CATEGORY}
            </Text> */}
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
          </View>
        ) : null}
        <View style={{marginTop: moderateScale(20)}}>
          {isLoading ? (
            <ListEmptyVendors
              isLoading={isLoading}
              emptyText={'No data found'}
              listSize={1}
              height={moderateScaleVertical(130)}
              vendorContainerStyle={{marginLeft: 0}}
            />
          ) : appData?.banners?.length ? (
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
          ) : null}
        </View>
        {isLoading ? (
          <ListEmptyVendors
            isLoading={isLoading}
            emptyText={'No data found'}
            listSize={3}
            height={moderateScaleVertical(130)}
            vendorContainerStyle={{marginLeft: 0}}
          />
        ) : appMainData?.vendors && appMainData?.vendors?.length ? (
          <View>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: textScale(16),
                marginBottom: moderateScale(10),
              }}>
              {strings.EXPLORE_STORES}
            </Text>
            <FlatList
              data={appMainData?.vendors}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={_renderVendors}
              ItemSeparatorComponent={() => (
                <View style={{height: moderateScale(10)}} />
              )}
            />
          </View>
        ) : null}
        <View style={{height: Platform.OS === 'ios' ? 55 : 90}} />
      </ScrollView>
    </>
  );
}
