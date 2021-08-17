import React, {useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import BannerHome from '../../../Components/BannerHome';
import BrickList from '../../../Components/BrickList';
import ImgCardForBrickList from '../../../Components/ImgCardForBrickList';
import CardLoader from '../../../Components/Loaders/CardLoader';
import {
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import ToggleTabBar from './ToggleTabBar';

export default function DashBoardOne({
  handleRefresh = () => {},
  bannerPress = () => {},
  //   appMainData = {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => {},
  selcetedToggle,
  toggleData,
}) {
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const {bannerRef} = useRef();
  const {slider1ActiveSlide, newCategoryData} = state;
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

  const renderView = (prop) => {
    return (
      <ImgCardForBrickList
        onPress={() => onPressCategory(prop)}
        text={prop.name}
        data={prop}
      />
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
      {isLoading && (
        <CardLoader
          listSize={1}
          cardWidth={sliderWidth}
          height={180}
          containerStyle={{marginHorizontal: moderateScale(10)}}
        />
      )}
      {!isLoading && appData && appData.banners && appData.banners.length ? (
        <>
          <BannerHome
            bannerRef={bannerRef}
            slider1ActiveSlide={slider1ActiveSlide}
            bannerData={appData.banners}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={(index) => updateState({slider1ActiveSlide: index})}
            onPress={(item) => bannerPress(item)}
          />
          <View style={{height: moderateScaleVertical(5)}} />
        </>
      ) : null}

      <ToggleTabBar toggleData={toggleData} selcetedToggle={selcetedToggle} />

      {isLoading && <CardLoader listSize={6} isRow />}
      {!isLoading &&
      appMainData &&
      appMainData?.categories &&
      appMainData?.categories.length ? (
        <BrickList
          data={newCategoryData}
          renderItem={(prop) => renderView(prop)}
          columns={3}
        />
      ) : null}
      <View style={{height: moderateScaleVertical(70)}} />
    </ScrollView>
  );
}
