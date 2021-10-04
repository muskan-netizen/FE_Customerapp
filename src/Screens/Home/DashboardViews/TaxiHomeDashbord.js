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
import TaxiHomeCategoryCard from '../../../Components/TaxiHomeCategoryCard';
import TaxiBannerHome from '../../../Components/TaxiBannerHome';

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
        // actions.saveAllUserAddress(res.data);
        console.log(res, 'res?>>>>>>>>>>>>>>');
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
    onPressCategory(item);
  };

  const _modalClose = () => {
    updateState({
      isVisible: false,
    });
  };

  console.log(appMainData?.categories, 'appMainData?.categories');

  const _renderItem = ({item}) => {
    return (
      <TaxiHomeCategoryCard
        data={item}
        onPress={() => continueWithNaxtScreen(item)}
      />
    );
  };

  const addressView = (image) => {
    return (
      allSavedAddress &&
      allSavedAddress.map((itm, inx) => {
        return (
          <ScrollView
            keyboardShouldPersistTaps={'handled'}
            style={{width: width}}>
            <TouchableOpacity
              key={inx}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                justifyContent: 'space-between',
                marginLeft: moderateScale(20),
                width: width - 20,
              }}
              onPress={moveToNewScreen(
                navigationStrings.ADDADDRESS,
                appMainData?.categories[0],
              )}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <View>
                  <Image source={image} />
                </View>
                <View style={{marginHorizontal: moderateScale(10)}}>
                  <Text numberOfLines={2} style={[styles.addressTitle]}>
                    {itm?.street}
                  </Text>
                  <Text numberOfLines={2} style={[styles.address]}>
                    {itm?.address}
                  </Text>
                </View>
              </View>
              <Image
                style={{
                  tintColor: colors.textGreyLight,
                  marginRight: moderateScale(20),
                }}
                source={imagePath.goRight}
              />
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: getColorCodeWithOpactiyNumber(
                  colors.textGreyLight.substr(1),
                  40,
                ),
                width: width / 1.2,
                marginLeft: moderateScale(60),
                height: 0.5,
              }}></View>
          </ScrollView>
        );
      })
    );
  };
  const savedPlaceView1 = (image) => {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{width: width}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            justifyContent: 'space-between',
            marginLeft: moderateScale(20),
            width: width - 20,
          }}
          onPress={moveToNewScreen(
            navigationStrings.ADDADDRESS,
            appMainData?.categories[0],
          )}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <View>
              <Image source={image} />
            </View>
            <View style={{marginHorizontal: moderateScale(10)}}>
              <Text numberOfLines={2} style={[styles.address]}>
                {strings.CHOOSESAVEDPLACE}
              </Text>
            </View>
          </View>
          <Image
            style={{
              tintColor: colors.textGreyLight,
              marginRight: moderateScale(20),
            }}
            source={imagePath.goRight}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: getColorCodeWithOpactiyNumber(
              colors.textGreyLight.substr(1),
              40,
            ),
            width: width / 1.2,
            marginLeft: moderateScale(60),
            height: 0.5,
          }}></View>
      </ScrollView>
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
        <TaxiBannerHome
          bannerRef={bannerRef}
          slider1ActiveSlide={slider1ActiveSlide}
          bannerData={[appData?.banners[0]]}
          sliderWidth={sliderWidth + 20}
          itemWidth={itemWidth + 20}
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
        onPress={moveToNewScreen(
          navigationStrings.ADDADDRESS,
          appMainData?.categories[0],
        )}>
        <View
          style={{
            marginHorizontal: moderateScale(10),
            height: moderateScaleVertical(40),
            backgroundColor: getColorCodeWithOpactiyNumber(
              colors.taxiCategoryGrayColor.substr(1),
              30,
            ),
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: moderateScale(10),
            justifyContent: 'space-between',
            marginTop: moderateScaleVertical(5),
          }}>
          <Text
            style={{
              fontSize: textScale(14),
              fontFamily: fontFamily.Medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {strings.WHERETO}
          </Text>
          <View
            style={{
              backgroundColor: colors.white,
              width: moderateScale(80),
              height: moderateScaleVertical(26),
              borderRadius: 20,
              justifyContent: 'space-around',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: moderateScale(5),
            }}>
            <Image source={imagePath.clock} />
            <Text>{strings.NOW}</Text>
            <Image
              style={{
                transform: [{rotate: '90deg'}],
                height: moderateScaleVertical(8),
                width: moderateScale(8),
              }}
              source={imagePath.goRight}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          alignItems: 'center',
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScaleVertical(20),
        }}>
        {addressView(imagePath.locationRoundedBackground)}
        {savedPlaceView1(imagePath.starRoundedBackground)}
      </View>

      <View style={{marginHorizontal: moderateScale(20)}}>
        <Text
          style={{
            fontSize: textScale(14),
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
            marginTop: moderateScaleVertical(20),
          }}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            customMapStyle={mapStyleGrey}
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 12,
            }}
            // provider={MapView.PROVIDER_GOOGLE}
            region={region}
            initialRegion={region}
            showsUserLocation={true}
            //showsMyLocationButton={true}
            // pointerEvents={'none'}
          ></MapView>
        </View>
      </View>

      <View style={{height: moderateScaleVertical(65)}} />
    </ScrollView>
  );
}
