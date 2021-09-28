import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import BannerHome from '../../../Components/BannerHome';
import BrickList from '../../../Components/BrickList';
import ImgCardForBrickList from '../../../Components/ImgCardForBrickList';
import CardLoader from '../../../Components/Loaders/CardLoader';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import {
  height,
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import ToggleTabBar from './ToggleTabBar';

export default function TaxiHomeDashbord({
  handleRefresh = () => {},
  bannerPress = () => {},
  //   appMainData = {},
  isLoading = false,
  isRefreshing = false,
  onPressCategory = () => {},
  selcetedToggle,
  toggleData,
  isDineInSelected = false,
}) {
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    homeCategoryData: [
      {id: 1, categoryImage: imagePath.car5, categoryName: 'Ride'},
      {id: 2, categoryImage: imagePath.ic_package1, categoryName: 'Package'},
      {id: 3, categoryImage: imagePath.car5, categoryName: 'Rentals'},
      {id: 4, categoryImage: imagePath.car5, categoryName: 'Intercity'},
    ],
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const {bannerRef} = useRef();
  const {slider1ActiveSlide, newCategoryData, homeCategoryData} = state;
  const styles = stylesFunc({themeColors, fontFamily});

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const newCategoryAry = [...appMainData?.categories];
  useEffect(() => {
    gridFn(10, 5);
  }, [appMainData]);

  let gapper = 0;
  const gridFn = (setItems, setValue) => {
    newCategoryAry.forEach((element, index) => {
      if (index <= setValue + gapper) {
        element['span'] = 1.5;
        updateState({newCategoryData: [...newCategoryAry]});
      } else if (index === setValue + 1 + gapper) {
        element['span'] = 3;
        updateState({newCategoryData: [...newCategoryAry]});
      } else if (
        index === setValue + 2 + gapper ||
        index === setValue + 3 + gapper
      ) {
        element['span'] = 1.5;
        element['rowHeight'] = moderateScaleVertical(250);
        updateState({newCategoryData: [...newCategoryAry]});
      } else {
        element['span'] = 3;
        updateState({newCategoryData: [...newCategoryAry]});
        gapper += setItems;
      }
    });
  };

  const _renderItem = (item) => {
    console.log(item.item, 'it3em');
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: getColorCodeWithOpactiyNumber(
              colors.textGreyLight.substr(1),
              20,
            ),
            height: height / 14.5,
            width: width / 6.5,
            marginHorizontal: moderateScale(18),
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            resizeMode={'contain'}
            style={{
              height: moderateScaleVertical(40),
              width: moderateScale(40),
            }}
            source={item.item?.categoryImage}
          />
        </View>
        <Text style={{marginVertical: moderateScaleVertical(10)}}>
          {item.item?.categoryName}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      // bounces={false}
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
      style={{flex: 1, marginHorizontal: moderateScale(3)}}>
      <>
        <BannerHome
          bannerRef={bannerRef}
          slider1ActiveSlide={slider1ActiveSlide}
          bannerData={appData?.banners}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          onSnapToItem={(index) => updateState({slider1ActiveSlide: index})}
          onPress={(item) => bannerPress(item)}
        />
        <View style={{height: moderateScaleVertical(5)}} />
      </>

      <FlatList
        horizontal
        data={homeCategoryData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => {
          return <View style={{height: moderateScaleVertical(20)}}></View>;
        }}
        renderItem={_renderItem}
      />
      <View
        style={{
          marginHorizontal: moderateScale(10),
          height: moderateScaleVertical(40),
          backgroundColor: getColorCodeWithOpactiyNumber(
            colors.textGreyLight.substr(1),
            40,
          ),
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: moderateScale(10),
        }}>
        <Text style={{fontSize: textScale(14), fontFamily: fontFamily.Medium}}>
          Where to ?
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: moderateScale(20),
          marginTop: moderateScaleVertical(10),
        }}>
        <Image
          style={{tintColor: colors.black}}
          source={imagePath.locationGreen}
        />
        <Text numberOfLines={1} style={{color: colors.black}}>
          {strings.ADDRESS}:
        </Text>
      </View>
      {/* <ToggleTabBar
        toggleData={toggleData}
        selcetedToggle={selcetedToggle}
        isDineInSelected={isDineInSelected}
      /> */}

      {/*{isLoading && <CardLoader listSize={6} isRow />}
      {!isLoading &&
      appMainData &&
      appMainData?.categories &&
      appMainData?.categories.length ? (
        <BrickList
          data={newCategoryData}
          renderItem={(prop) => renderView(prop)}
          columns={3}
        />
      ) : null} */}
      <View style={{height: moderateScaleVertical(65)}} />
    </ScrollView>
  );
}
