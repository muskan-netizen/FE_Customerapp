import { useScrollToTop } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DashedLine from 'react-native-dashed-line';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import RNExitApp from 'react-native-exit-app';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import HomeCategoryCard3 from '../../../Components/HomeCategoryCard3';
import HomeCategoryCard4 from '../../../Components/HomeCategoryCard4';
import BannerLoader from '../../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import MarketCard3 from '../../../Components/MarketCard3';
import ProductsComp2 from '../../../Components/ProductsComp2';
import ProductsComp3 from '../../../Components/ProductsComp3';
import SingleCategoryProducts from '../../../Components/SingleCategoryProducts';
import SubscriptionModal from '../../../Components/SubscriptionModal';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl
} from '../../../utils/helperFunctions';
import { getItem, setItem } from '../../../utils/utils';
import stylesFunc from '../styles';

const DashBoardFiveV2Api = ({
  handleRefresh = () => { },
  bannerPress = () => { },
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => { },
  navigation = {},
  onVendorFilterSeletion = () => { },
  tempCartData = null,
  onPressVendor = () => { },
  onClose = () => { },
  onPressSubscribe = () => { },
  isSubscription = false,
  showAllProducts = () => { },
  showAllSpotDealAndSelectedProducts = () => { }
}) => {


  const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state?.auth?.userData);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  let businessType = appData?.profile?.preferences?.business_type || null;

  const isGetEstimation = appData?.profile?.preferences?.get_estimations;

  const [isConfirmAgeModal, setIsConfirmAgeModal] = useState(true);
  const [state, setState] = useState({
    newCategoryData: [],
    isVendorColumnList: false,
    showMenu: false,
    currSelectedFilter: null,
    categoriesData: [],
    seeMore: false,
  });
  const { showMenu, categoriesData, seeMore } = state;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    if (!!appMainData?.categories && appMainData?.categories.length) {
      if (appStyle?.homePageLayout == 5) {
        updateState({
          categoriesData: appMainData?.categories.filter(
            (item, indx) => indx < 8,
          ),
        });
      } else {
        updateState({
          categoriesData: appMainData?.categories,
        });
      }
      return;
    }
    updateState({
      categoriesData: [],
    });
  }, [appMainData?.categories]);

  const { currSelectedFilter } = state;

  const onSelectedFilter = (selectedFilter) => {
    updateState({ showMenu: false, currSelectedFilter: selectedFilter });
    onVendorFilterSeletion(selectedFilter);
  };

  const homeAllFilters = () => {
    let homeFilter = [
      { id: 1, type: strings.OPEN },
      { id: 2, type: strings.CLOSE },
      { id: 3, type: strings.BESTSELLER },
    ];

    return homeFilter;
  };

  const OnTakeMeOut = () => {
    RNExitApp.exitApp();
  };

  const checkAgeModalPermission = async () => {
    try {
      const getIsUserCofirmedAgeModal = await getItem(
        'isUserConfirmedAgeModal',
      );
      if (
        getIsUserCofirmedAgeModal !== null &&
        !!(userData && userData?.auth_token)
      ) {
        setIsConfirmAgeModal(getIsUserCofirmedAgeModal);
      } else {
        setIsConfirmAgeModal(true);
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  useEffect(() => {
    checkAgeModalPermission();
  }, []);

  const onConfirmAge = async (userPermission) => {
    try {
      const getIsUserCofirmedAgeModal = await getItem(
        'isUserConfirmedAgeModal',
      );
      console.log(getIsUserCofirmedAgeModal, 'checkkk');
      if (
        getIsUserCofirmedAgeModal !== null &&
        !!(userData && userData?.auth_token)
      ) {
        setIsConfirmAgeModal(getIsUserCofirmedAgeModal);
      } else {
        setIsConfirmAgeModal(false);
        if (!!(userData && userData?.auth_token)) {
          await setItem('isUserConfirmedAgeModal', userPermission);
        }
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };
  const _renderCategories = ({ item, index }) => {
    return (
      <HomeCategoryCard4
        data={item}
        onPress={() => onPressCategory(item)}
        isLoading={isLoading}
      />

    );
  };

  const _renderVendors = ({ item, index }) => (
    <View
      style={{
        width: width - width / 3.5,
      }}>
      <MarketCard3
        data={item}
        onPress={() => onPressVendor(item)}
        extraStyles={{ margin: 2 }}
      />
    </View>
  );

  const seeMoreCategories = () => {
    updateState({
      categoriesData: !seeMore
        ? appMainData?.categories
        : appMainData?.categories.filter((item, indx) => indx < 8),
      seeMore: !seeMore,
    });
  };

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const _renderBrands = ({ item }) => {
    const imageURI = item?.image?.proxy_url
      ? getImageUrl(item.image.proxy_url, item.image.image_path, '800/600')
      : item?.image_url;
    const isSVG = imageURI ? imageURI.includes('.svg') : null;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={
          {
            // elevation: 1,
            // marginVertical: 1,
            // borderRadius: 2,
            // backgroundColor: colors.white
          }
        }
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}>
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
              borderWidth: 1,
              borderColor: colors.borderStroke
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const onViewAll = (type, data) => {
    console.log(data, 'type+++++', type);
    navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
      data: data,
      type: type,
    });
  };

  const scrollRef = React.useRef(null);
  useScrollToTop(scrollRef);

  if (isLoading) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}>
        <CategoryLoader2 />
        <View style={{ flexDirection: 'row', marginTop: moderateScaleVertical(16) }}>
          <HeaderLoader
            viewStyles={{
              marginTop: moderateScaleVertical(8),
              marginBottom: moderateScaleVertical(16),
            }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(240)}
            rectHeightLeft={moderateScaleVertical(240)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{
              marginTop: moderateScaleVertical(8),
              marginBottom: moderateScaleVertical(16),
            }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(240)}
            rectHeightLeft={moderateScaleVertical(240)}
            isRight={false}
            rx={15}
            ry={15}
          />
          <HeaderLoader
            viewStyles={{
              marginTop: moderateScaleVertical(8),
              marginBottom: moderateScaleVertical(16),
            }}
            widthLeft={moderateScale(150)}
            rectWidthLeft={moderateScale(150)}
            heightLeft={moderateScaleVertical(240)}
            rectHeightLeft={moderateScaleVertical(240)}
            isRight={false}
            rx={15}
            ry={15}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <HeaderLoader
            widthLeft={moderateScale(180)}
            rectWidthLeft={moderateScale(180)}
            rectHeightLeft={moderateScaleVertical(60)}
            isRight={false}
            rx={4}
            ry={4}
          />
          <HeaderLoader
            widthLeft={moderateScale(100)}
            rectWidthLeft={moderateScale(100)}
            rectHeightLeft={moderateScaleVertical(60)}
            isRight={false}
            rx={4}
            ry={4}
          />
        </View>

        <BannerLoader
          // isVendorLoader
          viewStyles={{ marginTop: moderateScale(12) }}
        />
        <BannerLoader
          // isVendorLoader
          viewStyles={{ marginTop: moderateScale(12) }}
        />
        <BannerLoader
          // isVendorLoader
          viewStyles={{ marginTop: moderateScale(12) }}
        />
      </ScrollView>
    );
  }

  const vendorHeader = (item) => {
    if (appData?.profile?.preferences?.single_vendor) {
      return (
        <View
          style={{
            marginBottom: moderateScaleVertical(24),
            marginTop: moderateScaleVertical(8),
          }}
        />
      );
    }
    return (
      <View key={Math.random()}>
        {getBundleId() == appIds.muvpod ? null : (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: moderateScale(16),
            marginBottom: moderateScaleVertical(15),
          }}>
            <Text
              numberOfLines={1}
              style={{
                ...styles.exploreStoresTxt,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,

                flex: 1,
              }}>
              {getBundleId() == appIds.quickLube
                ? item?.data?.length > 1
                  ? `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`
                  : strings.BOOK_HERE
                : `${strings.EXPLORE_STORES} ${appData?.profile?.preferences?.vendors_nomenclature}`}
            </Text>

            {item?.data?.length > 1 && (
              <TouchableOpacity
                style={{ marginHorizontal: moderateScale(4) }}
                onPress={() => onViewAll('vendor', appMainData?.vendors)}>
                <Text
                  style={{
                    ...styles.viewAllText,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : themeColors.primary_color,
                  }}>
                  {strings.VIEW_ALL}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const onPressViewEditAndReplace = (item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      orderId: item?.vendors[0].order_id,
      orderDetail: {
        dispatch_traking_url: item?.vendors[0].dispatch_traking_url,
      },
      selectedVendor: { id: item?.vendors[0].vendor_id },
    });
  };

  const showAllTempCartOrders = () => {
    return (
      <View>
        {!isEmpty(tempCartData) && tempCartData?.length
          ? tempCartData?.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => onPressViewEditAndReplace(item)}
                style={{
                  padding: moderateScale(8),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  // alignItems: 'center',
                  backgroundColor: getColorCodeWithOpactiyNumber(
                    themeColors?.primary_color.substr(1),
                    20,
                  ),
                  marginHorizontal: moderateScale(15),
                  marginTop: moderateScale(15),
                  borderRadius: moderateScale(5),
                  borderWidth: moderateScale(0.5),
                  borderColor: themeColors?.primary_color,
                }}>
                <View style={{ flex: 0.7 }}>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.medium,
                    }}>
                    {strings.YOURDRIVERHASMODIFIED}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(12),
                      paddingTop: moderateScale(5),
                      fontFamily: fontFamily.bold,
                    }}>
                    {strings.VIEW_DETAIL}
                  </Text>
                </View>
                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: textScale(14),
                      fontFamily: fontFamily.medium,
                    }}>{`#${item?.order_number}`}</Text>
                </View>
              </TouchableOpacity>
            );
          })
          : null}
      </View>
    );
  };

  const _renderProducts = ({ item, index }) => {
    return (
      <ProductsComp3
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />

    );
  };

  const _renderSingleCategoryProducts = ({ item, index }) => {
    return (
      <SingleCategoryProducts
        mainContainerStyle={{
          width: moderateScale(width / 4),
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScaleVertical(8),
          borderRadius: moderateScale(20),
          overflow: 'hidden',
          height: moderateScaleVertical(130),
          elevation: 0,

        }}
        showRating={false}
        imageStyle={{ width: moderateScale(width / 4), height: moderateScaleVertical(80), resizeMode: 'cover' }}
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
        productNameStyle={{ textAlign: 'center', fontSize: textScale(10), marginBottom: moderateScaleVertical(5) }}
        numberOfLines={2}
      />

    );
  };

  const ProductsThemeView = ({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(32)
      }}>
        <TitleViewHome item={item} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderProducts}
          keyExtractor={(item) => item?.id?.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
          ListHeaderComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  };

  const SingleCategoryProductsView = ({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(32)
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={{ title: item?.data?.category_detail?.slug }} />
          {item?.data?.category_detail?.products?.length >= 9 && <TouchableOpacity onPress={() => showAllProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}

          numColumns={3}
          data={item?.data?.category_detail?.products}
          renderItem={_renderSingleCategoryProducts}
          keyExtractor={(item) => item?.id?.toString()}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  };

  const _renderSelectedProducts = ({ item, index }) => {
    console.log(item, " selected");
    return (
      <ProductsComp2
        mainContainerStyle={{
          width: moderateScale(width / 4),
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScaleVertical(8),
          borderRadius: moderateScale(20),
          overflow: 'hidden',
          height: moderateScaleVertical(130),
          elevation: 0,

        }}
        showRating={false}
        imageStyle={{ width: moderateScale(width / 4), height: moderateScaleVertical(80), resizeMode: 'cover' }}
        item={item?.products}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
        productNameStyle={{ textAlign: 'center', fontSize: textScale(10), marginBottom: moderateScaleVertical(5) }}
        numberOfLines={2}
      />)

  }

  const SelectedProductsThemeView = ({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(32)
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={item} />
          {item?.data?.length >= 9 && <TouchableOpacity onPress={() => showAllSpotDealAndSelectedProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          // horizontal
          style={{ width: width, alignItems: 'center' }}
          numColumns={3}
          data={item?.data}
          renderItem={_renderSelectedProducts}
          keyExtractor={(item) => item?.id?.toString()}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  };


  const CategoriesView = ({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(32)
      }}>
        <TitleViewHome item={item} />
        <FlatList
          key={'6'}
          horizontal
          data={item?.data}
          keyExtractor={(item) => item?.id?.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={_renderCategories}
          ItemSeparatorComponent={() => (
            <View style={{ width: moderateScale(16) }} />
          )}
          ListHeaderComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(12) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  };

  const VendorsView = ({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(32)
      }}>
        {vendorHeader(item)}
        <FlatList
          horizontal
          alwaysBounceVertical={true}
          data={item?.data}
          keyExtractor={(item) => item?.id?.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={_renderVendors}
          ListHeaderComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListFooterComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListEmptyComponent={() => (
            <View>
              <FastImage
                source={imagePath.noDataFound}
                resizeMode="contain"
                style={{
                  width: moderateScale(140),
                  height: moderateScale(140),
                  alignSelf: 'center',
                  marginTop: moderateScaleVertical(30),
                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: textScale(11),
                  fontFamily: fontFamily.regular,
                  marginHorizontal: moderateScale(10),
                  lineHeight: moderateScale(20),
                  marginTop: moderateScale(5),
                }}>
                {businessType == 'home_service'
                  ? `${strings.WR_ARE_CURRENTLY_NOT_OPERATING} `
                  : `${strings.SORRY_MSG}`}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={{ width: moderateScale(10) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  };

  const _renderBestVendors = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressVendor(item)}
        activeOpacity={0.7}
        style={{
          height: moderateScaleVertical(140),
          width: width - width / 3.5,
          borderRadius: moderateScale(10),
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FastImage
          source={{ uri: item?.logo?.image_s3_url }}
          style={{
            ...StyleSheet.absoluteFill,
            height: moderateScaleVertical(140),
            width: width - width / 3.5,
          }}
        />
        <View
          style={{
            ...StyleSheet.absoluteFill,
            height: moderateScaleVertical(140),
            width: width - width / 3.5,
            backgroundColor: colors.blackOpacity66,
          }}
        />
        {!!item?.rating !== '0.0' && (
          <View
            style={{ ...styles.hdrRatingTxtView, position: 'absolute', top: 0 }}>
            <Text
              style={{
                ...styles.ratingTxt,
                fontFamily: fontFamily.medium,
              }}>
              {Number(item?.rating).toFixed(1)}
            </Text>
            <Image
              style={styles.starImg}
              source={imagePath.star}
              resizeMode="contain"
            />
          </View>
        )}
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: textScale(18),
            color: colors.white,
          }}>
          {item?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const BestSellersView = ({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(32)
      }}>
        <TitleViewHome item={item} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderBestVendors}
          keyExtractor={(item) => item?.id?.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
          ListHeaderComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  };

  const BrandsView = ({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(32)
      }}>
        <TitleViewHome item={item} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderBrands}
          keyExtractor={(item) => item?.id?.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ marginRight: moderateScale(12) }} />
          )}
          ListHeaderComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  };

  const TitleViewHome = ({ item, titleViewStyle = {} }) => {
    return (
      <Text
        style={{
          ...styles.exploreStoresTxt,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          marginHorizontal: moderateScale(16),
          marginBottom: moderateScaleVertical(12),
          fontSize: textScale(16),

          ...titleViewStyle
        }}>
        {!isEmpty(item?.translations) ? (item?.translations[0]?.title || item?.title) : item?.title}
      </Text>
    );
  };

  const _renderSpotlightDeals = ({ item }) => {
    return (
      <ProductsComp2
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
        numberOfLines={2}

      />
    )
  };


  const SpotlightDealsView = ({ item }) => {
    return !isEmpty(item?.data) ? (
      <View style={{
        marginBottom: moderateScaleVertical(32)
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TitleViewHome item={item} />
          {item?.data?.length >= 9 && <TouchableOpacity onPress={() => showAllSpotDealAndSelectedProducts(item)}>
            <Text style={{ marginHorizontal: moderateScale(18), color: themeColors?.primary_color, fontFamily: fontFamily?.bold }}>{strings.VIEW_ALL}</Text>
          </TouchableOpacity>}
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={item?.data}
          renderItem={_renderSpotlightDeals}
          keyExtractor={(item) => item?.id?.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ marginRight: moderateScale(12) }} />
          )}
          ListHeaderComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListFooterComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    ) : (
      <React.Fragment />
    );
  };

  const BannersView = ({ item }) => {
    return !isEmpty(item?.banner_images) ? <View style={{
      marginBottom: moderateScaleVertical(32)
    }}>
      <TitleViewHome item={item} />
      <Carousel
        autoplay={true}
        loop={true}
        autoplayInterval={2000}
        data={
          item?.banner_images ||
          appMainData?.mobile_banners ||
          appData?.mobile_banners
        }
        renderItem={renderBanners}
        sliderWidth={width}
        itemWidth={width - moderateScale(32)}
      />
    </View> : <React.Fragment />

  };

  const renderHomePageItems = ({ item, index }) => {
    return (
      <View>
        {(item?.slug == 'new_products' ||
          item?.slug == 'featured_products' ||
          item?.slug == 'on_sale' ||
          item?.slug == 'most_popular_products') ? <ProductsThemeView item={item} /> : item?.slug == 'vendors' ?
          <VendorsView item={item} />
          : item?.slug == 'nav_categories' ? (
            <CategoriesView item={item} />
          ) : item?.slug == 'best_sellers' ? (
            <BestSellersView item={item} />
          ) : item?.slug == 'brands' ? (
            <BrandsView item={item} />
          ) : item?.slug == 'spotlight_deals' ? (
            <SpotlightDealsView item={item} />
          ) : item?.slug == 'banner' ? (
            <BannersView item={item} />
          ) : item?.slug == 'selected_products' ? (
            <SelectedProductsThemeView item={item} />
          ) : item?.slug == 'single_category_products' ? <SingleCategoryProductsView item={item} /> :
            <React.Fragment />
        }
      </View>
    );
  };

  const renderBanners = ({ item }) => {
    const imageUrl =
      item?.banner_image_url ||
      getImageUrl(
        item.image.image_fit,
        item.image.image_path,
        appStyle?.homePageLayout === 5
          ? '800/600'
          : DeviceInfo.getBundleId() == appIds.masa
            ? '800/600'
            : '400/600',
      );
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => bannerPress(item)}>
        <FastImage
          source={{
            uri: imageUrl,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{
            height: moderateScale(200),
            width: width - moderateScale(30),
            borderRadius: moderateScale(16),
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyColor,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}

        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }>
        {showAllTempCartOrders()}
        <Animatable.View animation={'fadeInUp'} delay={200}>
          <FlatList
            data={appMainData?.homePageLabels}
            renderItem={renderHomePageItems}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </Animatable.View>
        <View
          style={{
            height:
              Platform.OS == 'ios' ? moderateScale(60) : moderateScale(90),
          }}
        />
      </ScrollView>

      {getBundleId() == appIds.easyDrink && isConfirmAgeModal && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isConfirmAgeModal}
          // onRequestClose={() => {
          //   Alert.alert("Modal has been closed.");
          //   setModalVisible(!modalVisible);
          // }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
              <View style={styles.innerAgeModaleView}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'center',
                    marginBottom: moderateScale(10),
                  }}>
                  <Image
                    style={{
                      height: moderateScaleVertical(25),
                      width: moderateScale(25),
                    }}
                    source={imagePath.icCross18}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.ageModalText,
                    { color: isDarkMode ? colors.white : colors.black },
                  ]}>
                  {strings.AGE_VERIFICATION}
                </Text>
                {/* <View style={styles.horizontalLine} /> */}
                <View style={styles.horizontalLine}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={1}
                    dashGap={2}
                    dashColor={colors.black}
                    style={{ marginTop: moderateScale(7) }}
                  />
                </View>
                <Text style={styles.ageConfirmationText}>
                  {strings.YOU_MUST_BE_18}
                </Text>
                <View
                  style={{
                    marginVertical: moderateScaleVertical(10),
                    width: '70%',
                  }}>
                  <GradientButton
                    colorsArray={[
                      themeColors.primary_color,
                      themeColors.primary_color,
                    ]}
                    textStyle={{
                      fontFamily: fontFamily.medium,
                      color: colors.white,
                    }}
                    onPress={() => {
                      onConfirmAge(false);
                    }}
                    borderRadius={moderateScale(5)}
                    btnText={strings.YES_I_AM_ABOVE_18}
                    containerStyle={{
                      width: '100%',
                    }}
                  />
                </View>

                <Text onPress={OnTakeMeOut} style={styles.takeMeOutStyle}>
                  {strings.TAKE_ME_OUT}
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {!!userData?.auth_token &&
        !!appData?.profile?.preferences?.show_subscription_plan_popup && (
          <SubscriptionModal
            isVisible={isSubscription}
            onClose={onClose}
            onPressSubscribe={onPressSubscribe}
          />
        )}
    </View>
  );
}


export default React.memo(DashBoardFiveV2Api);