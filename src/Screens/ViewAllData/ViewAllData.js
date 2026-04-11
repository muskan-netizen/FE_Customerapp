import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import { enableFreeze } from 'react-native-screens';
import { useSelector } from 'react-redux';
import MarketCard3V2 from '../../Components/MarketCard3V2';
import NoDataFound from '../../Components/NoDataFound';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { getColorSchema } from '../../utils/utils';

enableFreeze(true);

var noMoreData = false;

// Animated card wrapper with fadeInUp
const AnimatedCard = ({ item, index, onPress, extraStyles }) => {
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <MarketCard3V2
        data={item}
        index={index}
        onPress={onPress}
        extraStyles={extraStyles}
      />
    </Animated.View>
  );
};

export default function ViewAllData({ route, navigation }) {
  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot,
  );
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const { appMainData, dineInType, location } = useSelector(
    (state) => state?.home,
  );
  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;

  const headerAnim = useRef(new Animated.Value(0)).current;

  const [state, setState] = useState({
    isLoading: true,
    pageNo: 1,
    limit: 10,
    data: [],
  });

  const { isLoading, pageNo, limit, data } = state;
  const updateState = (d) => setState((s) => ({ ...s, ...d }));

  useEffect(() => {
    // Header slide-down animation
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    apiHit(1);
    return () => { noMoreData = false; };
  }, []);

  const apiHit = (page) => {
    let latlongObj = {};
    if (!!appData?.profile?.preferences?.is_hyperlocal) {
      latlongObj = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      };
    }

    const query = `?limit=${limit}&page=${page}&type=${dineInType || ''}&latitude=${latlongObj?.latitude || ''}&longitude=${latlongObj?.longitude || ''}`;
    const headers = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    };

    actions
      .vendorAll(query, {}, headers)
      .then((res) => {
        if (res?.data?.data?.length === 0) noMoreData = true;
        if (page === 1 && res?.data?.data?.length > 0) {
          console.log('vendorAll first item keys:', JSON.stringify(Object.keys(res.data.data[0])));
          console.log('vendorAll first item rating fields:', JSON.stringify({
            rating: res.data.data[0]?.rating,
            vendorRating: res.data.data[0]?.vendorRating,
            vendor_rating: res.data.data[0]?.vendor_rating,
            avg_rating: res.data.data[0]?.avg_rating,
          }));
        }
        updateState({
          data: page === 1 ? res?.data?.data : [...data, ...res?.data?.data],
          isLoading: false,
        });
      })
      .catch(() => updateState({ isLoading: false }));
  };

  const _checkRedirectScreen = (item) => {
    item?.is_show_category
      ? navigation.navigate(navigationStrings.VENDOR_DETAIL, {
          data: { item, rootProducts: true, categoryData: data },
        })
      : navigation.navigate(navigationStrings.PRODUCT_LIST, {
          data: {
            id: item.id,
            vendor: true,
            name: item.name,
            isVendorList: true,
            fetchOffers: true,
          },
        });
  };

  const onEndReached = () => {
    if (!noMoreData) {
      updateState({ pageNo: pageNo + 1 });
      apiHit(pageNo + 1);
    }
  };
  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const cardWidth = width - moderateScale(32);

  const _renderItem = ({ item, index }) => (
    <AnimatedCard
      item={item}
      index={index}
      onPress={() => _checkRedirectScreen(item)}
      extraStyles={{ width: cardWidth, margin: 0 }}
    />
  );

  const headerTranslate = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 0],
  });

  const bgColor = isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey || '#f5f5f5';

  return (
    <WrapperContainer bgColor={bgColor} statusBarColor={bgColor} isSafeArea={false}>
      <StatusBar backgroundColor={bgColor} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <Animated.View
        style={{
          opacity: headerAnim,
          transform: [{ translateY: headerTranslate }],
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: moderateScale(16),
          paddingTop: moderateScaleVertical(52),
          paddingBottom: moderateScaleVertical(12),
          backgroundColor: bgColor,
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={{
            width: moderateScale(36),
            height: moderateScale(36),
            borderRadius: moderateScale(18),
            backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <Image
            source={imagePath.icBackb}
            style={{
              width: moderateScale(18),
              height: moderateScale(18),
              tintColor: isDarkMode ? colors.white : colors.black,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            marginLeft: moderateScale(12),
            fontSize: textScale(18),
            fontFamily: fontFamily?.bold,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {strings.EXPLORE_SERVICES}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)}
          style={{
            width: moderateScale(36),
            height: moderateScale(36),
            borderRadius: moderateScale(18),
            backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <Image
            source={imagePath.search}
            style={{
              width: moderateScale(18),
              height: moderateScale(18),
              tintColor: isDarkMode ? colors.white : colors.black,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Loading skeleton */}
      {isLoading ? (
        <View style={{ alignItems: 'center', paddingTop: moderateScaleVertical(8) }}>
          {[0, 1, 2, 3].map((i) => (
            <HeaderLoader
              key={i}
              viewStyles={{ marginTop: i === 0 ? 0 : moderateScaleVertical(12), marginHorizontal: moderateScale(16) }}
              widthLeft={cardWidth}
              rectWidthLeft={cardWidth}
              heightLeft={moderateScaleVertical(180)}
              rectHeightLeft={moderateScaleVertical(180)}
              isRight={false}
              rx={14}
              ry={14}
            />
          ))}
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          extraData={data}
          keyExtractor={(item, index) => String(item?.id || index)}
          renderItem={_renderItem}
          contentContainerStyle={{
            paddingHorizontal: moderateScale(16),
            paddingBottom: moderateScaleVertical(32),
          }}
          ItemSeparatorComponent={() => <View style={{ height: moderateScaleVertical(10) }} />}
          onEndReachedThreshold={0.5}
          onEndReached={onEndReachedDelayed}
          initialNumToRender={6}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                marginTop: moderateScaleVertical(width / 2.5),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NoDataFound isLoading={isLoading} />
            </View>
          }
          ListFooterComponent={
            !noMoreData && data.length > 0 ? (
              <View style={{ marginVertical: moderateScaleVertical(20) }}>
                <UIActivityIndicator color={themeColors?.primary_color} size={28} />
              </View>
            ) : (
              <View style={{ height: moderateScaleVertical(20) }} />
            )
          }
        />
      )}
    </WrapperContainer>
  );
}
