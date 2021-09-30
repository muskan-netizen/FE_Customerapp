import React, {useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
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
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import ToggleTabBar from './ToggleTabBar';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';
import {TouchableOpacity} from 'react-native-gesture-handler';
import navigationStrings from '../../../navigation/navigationStrings';
import {useNavigation} from '@react-navigation/native';

import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
import actions from '../../../redux/actions';
import BottomViewModal from '../../../Components/BottomViewModal';
import {useDarkMode} from 'react-native-dark-mode';
import {MyDarkTheme} from '../../../styles/theme';

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
  const mapRef = React.createRef();
  const navigation = useNavigation();
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    homeCategoryData: [
      {id: 1, categoryImage: imagePath.car5, categoryName: 'Ride'},
      {id: 2, categoryImage: imagePath.ic_package1, categoryName: 'Package'},
      {id: 3, categoryImage: imagePath.car5, categoryName: 'Rentals'},
      {id: 4, categoryImage: imagePath.car5, categoryName: 'Intercity'},
    ],
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    coordinate: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    allSavedAddress: [],
    isVisible: false,
  });
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const {bannerRef} = useRef();
  const {
    slider1ActiveSlide,
    newCategoryData,
    homeCategoryData,
    region,
    coordinate,
    allSavedAddress,
    isVisible,
  } = state;
  const styles = stylesFunc({themeColors, fontFamily});

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const newCategoryAry = [...appMainData?.categories];

  console.log(appMainData?.categories, 'appMainData');

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useFocusEffect(
    React.useCallback(() => {
      getAllAddress();
    }, []),
  );

  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        console.log(res, 'all address');
        // actions.saveAllUserAddress(res.data);
        updateState({
          allSavedAddress: res.data,
          isLoading: false,
          indicator: false,
        });
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  const continueWithNaxtScreen = (item) => {
    updateState({
      isVisible: false,
    });
    onPressCategory(item);
  };

  const _modalClose = () => {
    updateState({
      isVisible: false,
    });
  };

  const _renderItem = ({item}) => {
    return (
      <HomeCategoryCard2
        data={item}
        onPress={() => continueWithNaxtScreen(item)}
      />
    );
  };

  const _ModalMainView = () => (
    <View
      style={{
        height: height / 5,
        backgroundColor: colors.white,
      }}>
      <Text />
      <FlatList
        numColumns={4}
        data={appMainData?.categories}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => {
          return <View style={{height: moderateScaleVertical(20)}}></View>;
        }}
        renderItem={_renderItem}
      />
    </View>
  );

  const addressView = (image) => {
    return (
      allSavedAddress &&
      allSavedAddress.map((itm, inx) => {
        console.log(itm, 'saved Address');
        return (
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            style={{width: width - 40}}>
            <TouchableOpacity
              key={inx}
              style={{
                marginTop: moderateScaleVertical(10),
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                marginHorizontal: moderateScale(10),
              }}
              onPress={() => {
                updateState({
                  isVisible: true,
                });
              }}>
              <View>
                <Image source={image} />
              </View>
              <View style={{marginHorizontal: moderateScale(10)}}>
                <Text numberOfLines={2} style={[styles.address]}>
                  {itm?.address}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        );
      })
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
        data={appMainData?.categories}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => {
          return <View style={{height: moderateScaleVertical(20)}}></View>;
        }}
        renderItem={_renderItem}
      />
      <TouchableOpacity
        onPress={() => {
          updateState({
            isVisible: true,
          });
        }}>
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
          <Text
            style={{
              fontSize: textScale(14),
              fontFamily: fontFamily.Medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {strings.WHERETO}
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          alignItems: 'center',
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScaleVertical(20),
        }}>
        {addressView(imagePath.savedLocationImage)}
      </View>

      <View style={{marginHorizontal: moderateScale(20)}}>
        <Text
          style={{
            fontSize: textScale(14),
            marginVertical: moderateScaleVertical(20),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {strings.AROUNDYOU}
        </Text>

        <View
          style={{
            height: height / 4,
            width: width - 50,
            borderRadius: 12,
          }}>
          <MapView
            ref={mapRef}
            //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 12,
            }}
            region={region}
            initialRegion={region}
            customMapStyle={mapStyleGrey}
            showsUserLocation={true}
            showsMyLocationButton={true}
            // pointerEvents={'none'}
          ></MapView>
        </View>
      </View>

      <BottomViewModal
        show={isVisible}
        mainContainView={_ModalMainView}
        closeModal={_modalClose}
      />

      <View style={{height: moderateScaleVertical(65)}} />
    </ScrollView>
  );
}
