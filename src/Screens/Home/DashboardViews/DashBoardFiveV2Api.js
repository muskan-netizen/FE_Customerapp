import { useScrollToTop } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import {
  default as DeviceInfo,
  default as deviceInfoModule,
  getBundleId,
} from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Animated from 'react-native-reanimated';
import { enableFreeze } from 'react-native-screens';
import Carousel from 'react-native-snap-carousel';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import CarCategory from '../../../Components/CarCategory';
import HomeFaq from '../../../Components/HomeFaq';
import HomeOurProfessional from '../../../Components/HomeOurProfessional';
import HomeTrust from '../../../Components/HomeTrust';
import Cities from '../../../Components/Cities';
import GradientButton from '../../../Components/GradientButton';
import HomeCategoryCard4 from '../../../Components/HomeCategoryCard4';
import MarketCard3V2 from '../../../Components/MarketCard3V2';
import ProductsThemeCard from '../../../Components/NewComponents/ProductsThemeCard';
import OnDemanVendor from '../../../Components/OnDemanVendor';
import ProductsComp3V2 from '../../../Components/ProductsComp3V2';
import SubscriptionModal from '../../../Components/SubscriptionModal';
import VendorMode from '../../../Components/VendorMode';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { getImageUrlNew, tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import { getColorSchema, getItem, setItem } from '../../../utils/utils';
import * as CategoryTemplate from '../TemplateStyle/CategoryStyle';
import stylesFunc from '../styles';
import DashBoardFiveV2ApiLoader from './DashBoardFiveV2ApiGroceryLoader';

enableFreeze(true);

const homeFilter = [
  {id: 1, type: strings.OPEN},
  {id: 2, type: strings.CLOSE},
  {id: 3, type: strings.BESTSELLER},
];

const DashBoardFiveV2Api = ({
  handleRefresh = () => {},
  bannerPress = () => {},
  isLoading = true,
  isRefreshing = false,
  onPressCategory = () => {},
  navigation = {},
  tempCartData = null,
  onPressVendor = () => {},
  onClose = () => {},
  onPressSubscribe = () => {},
  isSubscription = false,
  showAllProducts = () => {},
  showAllSpotDealAndSelectedProducts = () => {},
  onVendorFilterSeletion = () => {},
  selcetedToggle = () => {},
  showVendorCategory = true,
  appMainData = {},
  scrollHandler = () => {},
  onPressProduct = () => {},
  headerPadding = 0,
  onScrollPositionChange = () => {},
}) => {
  const {
    appData,
    themeColors,
    appStyle,
    currencies,
    languages,
    themeColor,
    themeToggle,
  } = useSelector(state => state?.initBoot || {});
  const userData = useSelector(state => state?.auth?.userData);
  const {cartItemCount} = useSelector(state => state?.cart);
  const {dineInType, priceType} = useSelector(state => state?.home || {});

  const darkthemeusingDevice = getColorSchema();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  let businessType = appData?.profile?.preferences?.business_type || null;
  const {width: screenWidth} = useWindowDimensions();
  const isCompactScreen = screenWidth < 360;
  const categoryColumns = 4;
  const categoryColumnGap = isCompactScreen
    ? moderateScale(8)
    : moderateScale(12);
  const categoryItemWidth =
    (screenWidth -
      moderateScale(24) -
      categoryColumnGap * (categoryColumns - 1)) /
    categoryColumns;
  const bannerItemWidth = screenWidth;
  const singleCategoryCardWidth = screenWidth / (isCompactScreen ? 2.9 : 3.2);
  const bestSellerCardWidth = Math.min(
    screenWidth * (isCompactScreen ? 0.5 : 0.46),
    moderateScale(180),
  );

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    newCategoryData: [],
    isVendorColumnList: false,
    vendorsData: [],
    showMenu: false,
    currSelectedFilter: null,
    categoriesData: [],
    seeMore: false,
  });
  const {
    slider1ActiveSlide,
    vendorsData,
    showMenu,
    categoriesData,
    seeMore,
    currSelectedFilter,
  } = state;

  //update state
  const updateState = data => setState(state => ({...state, ...data}));

  const ref = React.useRef(null);

  useScrollToTop(ref);

  const [isConfirmAgeModal, setIsConfirmAgeModal] = useState(true);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});


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

  const onConfirmAge = async userPermission => {
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
        setIsConfirmAgeModal(false);
        if (!!(userData && userData?.auth_token)) {
          await setItem('isUserConfirmedAgeModal', userPermission);
        }
      }
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const onSelectedFilter = selectedFilter => {
    updateState({showMenu: false, currSelectedFilter: selectedFilter});
    onVendorFilterSeletion(selectedFilter);
  };

  const _renderVendors = useCallback(
    ({item, index}) => {
      if (appStyle?.homePageLayout == 11 && dineInType == 'on_demand') {
        return (
          <OnDemanVendor
            data={item}
            onPress={() => onPressVendor(item)}
            extraStyles={{margin: 2}}
          />
        );
      }
      return (
        <MarketCard3V2
          data={item}
          index={index}
          onPress={() => onPressVendor(item)}
          extraStyles={{width: moderateScale(225), margin: 0}}
        />
      );
    },
    [isDarkMode, priceType, dineInType, appStyle],
  );

  const onViewAll = useCallback(
    (type, data) => {
      navigation.navigate(navigationStrings.VIEW_ALL_DATA, {
        data: data,
        type: type,
      });
    },
    [isDarkMode],
  );

  const vendorHeader = useCallback(
    item => {
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: moderateScale(16),
                marginTop: moderateScaleVertical(10),
                marginBottom: moderateScaleVertical(4),
              }}>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.exploreStoresTxt,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  marginTop: 0,
                  flex: 1,
                  fontSize: textScale(13),
                  fontFamily: fontFamily.semiBold || fontFamily.bold,
                }}>
                {getBundleId() == appIds.quickLube
                  ? item?.data?.length > 1
                    ? strings.EXPLORE_SERVICES
                    : strings.BOOK_HERE
                  : strings.EXPLORE_SERVICES}
              </Text>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => onViewAll('vendor', appMainData?.vendors)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: moderateScale(10),
                  paddingVertical: moderateScaleVertical(4),
                  borderRadius: moderateScale(16),
                  borderWidth: 1,
                  borderColor: themeColors?.primary_color || colors.black,
                  gap: moderateScale(2),
                }}>
                <Text
                  style={{
                    fontSize: textScale(10),
                    fontFamily: fontFamily.medium,
                    color: themeColors?.primary_color || colors.black,
                  }}>
                  {strings.SEE_ALL}
                </Text>
                <Text style={{
                  fontSize: textScale(11),
                  fontFamily: fontFamily.medium,
                  color: themeColors?.primary_color || colors.black,
                  marginTop: -1,
                }}>
                  {'›'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    },
    [appData, isDarkMode, appMainData, isDarkMode],
  );

  const onPressViewEditAndReplace = useCallback(
    item => {
      navigation.navigate(navigationStrings.ORDER_DETAIL, {
        orderId: item?.vendors[0].order_id,
        orderDetail: {
          dispatch_traking_url: item?.vendors[0].dispatch_traking_url,
        },
        selectedVendor: {id: item?.vendors[0].vendor_id},
      });
    },
    [isDarkMode],
  );

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };
  const renderFilterBtn = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCT_POWER_CONSUMPTION)
        }
        style={styles.PowerConsumptionWrapper}>
        <Text
          style={{
            ...styles.PowerConsumptiontext,
            color: isDarkMode ? colors.white : colors.black,
          }}>
          Power Consumption Calculator
        </Text>
        <Image source={imagePath.goRight} />
      </TouchableOpacity>
    );
  };

  const renderHomePageItems = useCallback(
    ({item, index}) => {
      let uniqueId = String(item?.id || index);

      // White card that "slides over" the bottom of the banner
      const isFirstContent = index === 1;
      const cardStyle = isFirstContent ? {
        marginTop: moderateScaleVertical(-50),
        borderTopLeftRadius: moderateScale(24),
        borderTopRightRadius: moderateScale(24),
        backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey,
        paddingTop: moderateScaleVertical(10),
        overflow: 'hidden',
      } : {};

      return (
        <View key={uniqueId} style={item?.slug !== 'banner' ? cardStyle : {}}>
          {index == 0 &&
            appIds?.solarPrimex === getBundleId() &&
            renderFilterBtn()}
          {item?.slug == 'banner' ? (
            <BannersView item={item} showTitle={false} />
          ) : dineInType != 'car_rental' &&
            (item?.slug == 'new_products' ||
              item?.slug == 'on_sale' ||
              item?.slug == 'most_popular_products' ||
              item?.slug == 'recently_viewed' ||
              item?.slug == 'ordered_products' ||
              item?.slug == 'featured_products') ? (
              appStyle?.homePageLayout == 11 && dineInType == 'on_demand' ? (
              <ProductsThemeViewOnDeamnd
                appStyle={appStyle}
                item={item}
                isDarkMode={isDarkMode}
                navigation={navigation}
                onPressProduct={onPressProduct}
                priceType={priceType}
              />
            ) : (
              <ProductsThemeView
                appStyle={appStyle}
                item={item}
                isDarkMode={isDarkMode}
                navigation={navigation}
                onPressProduct={onPressProduct}
              />
            )
          ) : item?.slug == 'vendors' &&
            getBundleId() !== appIds?.greenhippo ? (
            <VendorsView item={item} />
          ) : item?.slug == 'nav_categories' ? (
            <CategoriesView item={item} showTitle={false} />
          ) : item?.slug == 'best_sellers' &&
            getBundleId() !== appIds?.greenhippo ? (
            <BestSellersView
              item={item}
              onPressVendor={onPressVendor}
              appMainData={appMainData}
              styles={styles}
              appStyle={appStyle}
              isDarkMode={isDarkMode}
            />
          ) : item?.slug == 'brands' ? (
            <BrandsView
              isDarkMode={isDarkMode}
              item={item}
              showTitle={false}
              appStyle={appStyle}
              appMainData={appMainData}
              moveToNewScreen={moveToNewScreen}
            />
          ) : item?.slug == 'spotlight_deals' ? (
            <SpotlightDealsView item={item} />
          ) : item?.slug == 'selected_products' ? (
            <SelectedProductsThemeView item={item} />
          ) : item?.slug == 'single_category_products' ? (
            <SingleCategoryProductsView item={item} />
          ) : item?.slug == 'cities' ? (
            <CitiesView item={item} />
          ) : (
            <React.Fragment />
          )}
        </View>
      );
    },
    [themeColors, fontFamily, appMainData, appStyle, isDarkMode, cartItemCount],
  );

  const showAllTempCartOrders = useCallback(() => {
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
                  <View style={{flex: 0.7}}>
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
                  <View style={{flex: 0.3, alignItems: 'flex-end'}}>
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
  }, [fontFamily, themeColors, tempCartData, isDarkMode]);
  const _renderSingleCategoryProducts = useCallback(
    ({item, index}) => {
      const cardW = moderateScale(130);
      const imgH = moderateScaleVertical(150);
      return (
        <ProductsComp3V2
          item={item}
          onPress={() => onPressProduct(item)}
          numberOfLines={2}
          containerStyle={{
            width: cardW,
            borderRadius: moderateScale(8),
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
            paddingBottom: moderateScaleVertical(10),
            overflow: 'hidden',
          }}
          imageStyle={{
            width: cardW,
            height: imgH,
            borderTopLeftRadius: moderateScale(8),
            borderTopRightRadius: moderateScale(8),
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#F0F1F5',
          }}
          imageContentStyle={{
            borderTopLeftRadius: moderateScale(8),
            borderTopRightRadius: moderateScale(8),
          }}
          contentContainerStyle={{
            paddingHorizontal: moderateScale(8),
            paddingTop: moderateScaleVertical(8),
            minHeight: moderateScaleVertical(52),
          }}
          titleTextStyle={{
            fontSize: textScale(10.5),
            lineHeight: moderateScaleVertical(15),
            fontFamily: appStyle?.fontSizeData?.medium,
          }}
          priceTextStyle={{
            fontSize: textScale(11.5),
            lineHeight: moderateScaleVertical(16),
          }}
          preserveRatingSpace={false}
          ratingPosition="topRight"
          enableEntryAnimation={true}
          animationDelay={index * 60}
        />
      );
    },
    [isDarkMode, priceType, appStyle],
  );

  const SingleCategoryProductsView = useCallback(
    ({item}) => {
      return !isEmpty(item?.data) ? (
        <View style={{marginBottom: moderateScaleVertical(4)}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TitleViewHome
              item={item}
              isDarkMode={isDarkMode}
              appStyle={appStyle}
              textStyle={{
                fontSize: textScale(13),
                fontFamily: appStyle?.fontSizeData?.bold,
                marginTop: moderateScaleVertical(14),
                marginBottom: moderateScaleVertical(8),
              }}
            />
            {item?.data?.length >= 9 && (
              <TouchableOpacity onPress={() => showAllProducts(item)}>
                <Text
                  style={{
                    marginHorizontal: moderateScale(16),
                    color: themeColors?.primary_color,
                    fontFamily: fontFamily?.medium,
                    fontSize: textScale(10),
                  }}>
                  {strings.VIEW_ALL}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={item?.data}
            renderItem={_renderSingleCategoryProducts}
            keyExtractor={(item, index) => String(item?.id + `${index}`)}
            ItemSeparatorComponent={() => (
              <View style={{marginRight: moderateScale(10)}} />
            )}
            ListHeaderComponent={() => (
              <View style={{marginLeft: moderateScale(16)}} />
            )}
            ListFooterComponent={() => (
              <View style={{marginRight: moderateScale(16)}} />
            )}
          />
        </View>
      ) : (
        <React.Fragment />
      );
    },
    [themeColors, fontFamily, appMainData, isDarkMode],
  );

  const _renderSelectedProducts = useCallback(
    ({item, index}) => {
      const cardW = moderateScale(148);
      const cardH = moderateScaleVertical(180);
      const imageUrl =
        item?.path?.includes('http')
          ? item?.path
          : getImageUrlNew({
              url: item?.path || null,
              image_const_arr: appMainData?.image_prefix,
              type: 'image_fill',
            });
      return (
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => onPressProduct(item)}
          style={{
            width: cardW,
            height: cardH,
            borderRadius: moderateScale(8),
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
          }}>
          {/* Full bleed image */}
          <FastImage
            source={{
              uri: imageUrl,
              cache: FastImage.cacheControl.immutable,
              priority: FastImage.priority.high,
            }}
            style={{width: cardW, height: cardH}}
            resizeMode={FastImage.resizeMode.cover}
          />
          {/* Dark gradient overlay at bottom */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: cardH * 0.52,
              backgroundColor: 'rgba(0,0,0,0.52)',
              justifyContent: 'flex-end',
              paddingHorizontal: moderateScale(10),
              paddingBottom: moderateScaleVertical(12),
            }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: textScale(11),
                fontFamily: fontFamily?.semiBold || fontFamily?.bold,
                color: colors.white,
                lineHeight: moderateScaleVertical(16),
                marginBottom: moderateScaleVertical(4),
              }}>
              {item?.translation?.[0]?.title || item?.title}
            </Text>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: themeColors?.primary_color || '#41A2E6',
                paddingHorizontal: moderateScale(8),
                paddingVertical: moderateScaleVertical(3),
                borderRadius: moderateScale(6),
              }}>
              <Text
                style={{
                  fontSize: textScale(10.5),
                  fontFamily: fontFamily?.semiBold || fontFamily?.bold,
                  color: colors.white,
                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  item?.variant?.[0]?.price || item?.price_numeric,
                  appData?.profile?.preferences?.digit_after_decimal,
                  appData?.profile?.preferences?.additional_preferences,
                  currencies?.primary_currency?.symbol,
                  currencies,
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [appMainData, isDarkMode, themeColors, priceType, fontFamily],
  );

  const SelectedProductsThemeView = useCallback(
    ({item}) => {
      return !isEmpty(item?.data) ? (
        <View
          key={String(item?.id || '')}
          style={{marginBottom: moderateScaleVertical(0)}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TitleViewHome
              item={item}
              isDarkMode={isDarkMode}
              appStyle={appStyle}
              textStyle={{
                fontSize: textScale(13),
                fontFamily: appStyle?.fontSizeData?.bold,
                marginTop: moderateScaleVertical(14),
                marginBottom: moderateScaleVertical(8),
              }}
            />
            {item?.data?.length >= 9 && (
              <TouchableOpacity
                onPress={() => showAllSpotDealAndSelectedProducts(item)}>
                <Text
                  style={{
                    marginHorizontal: moderateScale(16),
                    color: themeColors?.primary_color,
                    fontFamily: fontFamily?.medium,
                    fontSize: textScale(10),
                  }}>
                  {strings.VIEW_ALL}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={item?.data}
            renderItem={_renderSelectedProducts}
            keyExtractor={(item, index) => String(item?.id + `${index}`)}
            ItemSeparatorComponent={() => (
              <View style={{marginRight: moderateScale(10)}} />
            )}
            ListHeaderComponent={() => (
              <View style={{marginLeft: moderateScale(16)}} />
            )}
            ListFooterComponent={() => (
              <View style={{marginRight: moderateScale(16)}} />
            )}
          />
        </View>
      ) : (
        <React.Fragment />
      );
    },
    [themeColors, fontFamily, appMainData, isDarkMode],
  );

  const _renderCategories = useCallback(
    ({item, index}) => {
      if (dineInType == 'car_rental') {
        return (
          <View style={{width: categoryItemWidth, paddingTop: 1}}>
            <CarCategory data={item} onPress={() => onPressCategory(item)} />
          </View>
        );
      }

      switch (appStyle?.homePageLayout) {
        case 1:
          return (
            <CategoryTemplate.HomeCategory6
              data={item}
              onPress={() => onPressCategory(item)}
            />
          );
        case 2:
          return (
            <View style={{marginRight: moderateScale(8)}}>
              <CategoryTemplate.HomeCategoryCard2
                data={item}
                onPress={() => onPressCategory(item)}
              />
            </View>
          );
        case 3:
          return (
            <View style={{width: categoryItemWidth}}>
              <CategoryTemplate.HomeCategoryCard_3_5_7
                data={item}
                onPress={() => onPressCategory(item)}
                isLoading={isLoading}
              />
            </View>
          );
        case 4:
          return (
            <View style={{width: categoryItemWidth}}>
              <CategoryTemplate.HomeCategoryCard4
                data={item}
                onPress={() => onPressCategory(item)}
              />
            </View>
          );
        case 5:
          return (
            <View style={{width: categoryItemWidth}}>
              <CategoryTemplate.HomeCategoryCard_3_5_7
                data={item}
                onPress={() => onPressCategory(item)}
                isLoading={isLoading}
              />
            </View>
          );
        case 6:
          return (
            <View style={{width: categoryItemWidth}}>
              <CategoryTemplate.HomeCategoryCard6
                data={item}
                onPress={() => onPressCategory(item)}
              />
            </View>
          );
        case 7:
          return (
            <View style={{width: categoryItemWidth}}>
              <CategoryTemplate.HomeCategoryCard_3_5_7
                data={item}
                onPress={() => onPressCategory(item)}
                isLoading={isLoading}
              />
            </View>
          );
        case 8:
          return (
            <CategoryTemplate.HomeCategoryCardP2p
              data={item}
              onPress={() => onPressCategory(item)}
            />
          );
        case 9:
         return (
            <View style={{width: categoryItemWidth}}>
              <CategoryTemplate.HomeCategoryCard_3_5_7
                data={item}
                onPress={() => onPressCategory(item)}
                isLoading={isLoading}
              />
            </View>
          );
        case 10:
          return (
            <HomeCategoryCard4
              data={item}
              onPress={() => onPressCategory(item)}
              applyRadius={moderateScale(30)}
              categoryHieght={60}
              categoryWidth={60}
              index={index}
            />
          );
        default:
          return (
            <HomeCategoryCard4
              data={item}
              onPress={() => onPressCategory(item)}
              applyRadius={4}
              index={index}
            />
          );
      }
    },
    [appStyle, isDarkMode, priceType, dineInType, categoryItemWidth],
  );

  const vendorFlatViewStyle = useCallback(() => {
    switch (appStyle?.homePageLayout) {
      case 11:
        return {
          numColumns: 0,
          horizontal: true,
          scrollEnabled: true,
        };

      default:
        return {
          numColumns: 0,
          horizontal: false,
          scrollEnabled: false,
        };
    }
  }, [appStyle]);
  const categoryFlatViewStyle = () => {
    if (dineInType == 'car_rental') {
      return {
        numColumns: 4,
        horizontal: false,
        scrollEnabled: false,
      };
    }

    switch (appStyle?.homePageLayout) {
      case 1:
        return {
          numColumns: categoryColumns,
          horizontal: false,
          scrollEnabled: false,
        };
      case 2:
        return {
          numColumns: 0,
          horizontal: true,
          scrollEnabled: true,
        };

      case 8:
        return {
          numColumns: categoryColumns,
          horizontal: false,
          scrollEnabled: false,
        };
      case 10:
        return {
          numColumns: 0,
          horizontal: true,
          scrollEnabled: true,
        };

      default:
        return {
          numColumns: categoryColumns,
          horizontal: false,
          scrollEnabled: false,
        };
    }
  };

  //banners view
  const BannersView = ({item = {}, showTitle = true}) => {
    let myBanner =
      item?.banner_images ||
      appMainData?.mobile_banners ||
      appData?.mobile_banners ||
      [];
    return !isEmpty(myBanner) ? (
      <View
        key={String(item?.id)}
        style={{marginBottom: moderateScaleVertical(8)}}>
        {!!showTitle && (
          <TitleViewHome
            item={item}
            isDarkMode={isDarkMode}
            appStyle={appStyle}
          />
        )}
        <Carousel
          autoplay={true}
          loop={true}
          autoplayInterval={3000}
          removeClippedSubviews={false}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          lockScrollWhileSnapping={true}
          data={myBanner}
          renderItem={renderBanners}
          sliderWidth={screenWidth}
          itemWidth={bannerItemWidth}
          onSnapToItem={index => updateState({slider1ActiveSlide: index})}
        />
        {myBanner.length > 1 && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: moderateScaleVertical(8),
          }}>
            {myBanner.map((_, i) => (
              <View
                key={i}
                style={{
                  height: moderateScale(6),
                  width: slider1ActiveSlide === i ? moderateScale(18) : moderateScale(6),
                  borderRadius: moderateScale(4),
                  backgroundColor: slider1ActiveSlide === i
                    ? (themeColors?.primary_color || colors.black)
                    : colors.blackOpacity10,
                  marginHorizontal: moderateScale(3),
                }}
              />
            ))}
          </View>
        )}
      </View>
    ) : (
      <React.Fragment />
    );
  };

  //render banners function
  const renderBanners = ({item = {}, index = 0}) => {
    const imageUrl =
      item?.banner_image_url ||
      getImageUrl(
        item?.image.image_fit,
        item?.image.image_path,
        appStyle?.homePageLayout === 5
          ? '800/600'
          : DeviceInfo.getBundleId() == appIds.masa
          ? '800/600'
          : '1200/1000',
      );

    return (
      <View key={String(item?.id || index)} style={{}}>
        <TouchableOpacity
          style={{}}
          activeOpacity={0.8}
          onPress={() => bannerPress(item)}>
          <FastImage
            source={{
              uri: imageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              height:
                DeviceInfo.getBundleId() == appIds.masa
                  ? moderateScale(310)
                  : moderateScale(310) + headerPadding,
              width: bannerItemWidth,
              borderBottomLeftRadius: moderateScale(24),
              borderBottomRightRadius: moderateScale(24),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const onPressMode = item => {
    if (!!cartItemCount?.data && cartItemCount?.data?.item_count) {
      clearCartItem(item);
    } else {
      selcetedToggle(item.type);
    }
  };

  const clearCartItem = item => {
    Alert.alert('', strings.REMOVE_CART_MSG, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
      },
      {text: strings.CLEAR_CART2, onPress: () => clearCart(item)},
    ]);
  };

  const clearCart = item => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: deviceInfoModule.getUniqueId(),
        },
      )
      .then(res => {
        showSuccess(res?.message);
        actions.cartItemQty(res);
        selcetedToggle(item.type);
      })
      .catch(errorMethod);
  };

  const errorMethod = error => {
    showError(error?.message || error?.error);
  };

  const renderMode = useCallback(
    ({item, index}) => {
      return <VendorMode item={item} onPressMode={onPressMode} />;
    },
    [cartItemCount, appData?.profile?.preferences?.vendorMode || []],
  );

  const CategoriesView = useCallback(
    ({item, showTitle}) => {
      return !isEmpty(item?.data) ? (
        <View
          key={String(item?.id || '')}
          style={{
            marginBottom: moderateScaleVertical(0),
            marginHorizontal: moderateScale(10),
          }}>
          {appStyle?.homePageLayout == 6 &&
          showVendorCategory &&
          getBundleId() == appIds?.dropOff ? (
            <View>
              <View>
                <Text
                  style={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.medium,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    marginHorizontal: moderateScale(10),
                    marginTop: moderateScaleVertical(20),
                    marginBottom: moderateScaleVertical(8),
                  }}>
                  {strings.WHAT_WHOULD_YOU_LIKE_TO_DO}
                </Text>

                <FlatList
                  data={appData?.profile?.preferences?.vendorMode || []}
                  renderItem={renderMode}
                  numColumns={4}
                  ItemSeparatorComponent={() => (
                    <View style={{height: moderateScale(10)}} />
                  )}
                  keyExtractor={(item, index) => String(item?.type || index)}
                />
              </View>
            </View>
          ) : (
            <View
              key={String(item?.id || '')}
              style={
                appStyle?.homePageLayout == 11 && dineInType == 'on_demand'
                  ? {
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                    }
                  : {
                      marginBottom: moderateScaleVertical(0),
                      marginHorizontal: 0,
                    }
              }>
              {!!showTitle ? (
                <TitleViewHome isDarkMode={isDarkMode} item={item} />
              ) : (
                <View style={{height: 0}} />
              )}
              {appStyle?.homePageLayout == 11 && dineInType == 'on_demand' ? (
                item.data.map((item, i) => {
                  return (
                    <View
                      style={{
                        width:
                          i == 0 || i == 1
                            ? moderateScale(width / 2.4)
                            : moderateScale(width / 3.6),
                        marginRight: moderateScale(8),
                        marginVertical:
                          i == 0 || i == 1 ? moderateScaleVertical(12) : 0,
                          backgroundColor:colors.blackOpacity02,
                          borderRadius:moderateScale(12)
                      }}>
                      <CategoryTemplate.HomeCategoryCard11
                        data={item}
                        onPress={() => onPressCategory(item)}
                        applyRadius={moderateScale(30)}
                        categoryHieght={60}
                        categoryWidth={60}
                        index={i}
                        navigation={navigation}
                        priceType={priceType}
                      />
                    </View>
                  );
                })
              ) : appStyle?.homePageLayout == 8 && dineInType == 'p2p' ? (
                <View
                  style={{
                    borderRadius: moderateScale(8),
                    borderColor: colors.borderColor,
                    marginTop: moderateScaleVertical(12),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: moderateScaleVertical(8),
                    }}>
                    <Text
                      style={{
                        fontSize: textScale(16),
                        fontFamily: fontFamily?.bold,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      }}>
                      {strings.CATEGORIES}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      borderRadius: moderateScale(8),
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                      borderWidth: moderateScale(1),
                      borderColor: colors.borderColor,
                      paddingVertical: moderateScale(16),
                    }}>
                    <FlatList
                      key={'6'}
                      data={
                        item?.data?.length > 4
                          ? item?.data.slice(0, 4)
                          : item?.data
                      }
                      keyExtractor={item => item?.id?.toString()}
                      showsHorizontalScrollIndicator={false}
                      numColumns={4}
                      renderItem={_renderCategories}
                      ItemSeparatorComponent={() => (
                        <View style={{height: moderateScale(8)}} />
                      )}
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    marginTop: 0,
                    paddingHorizontal: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}>
                  <FlatList
                    horizontal={categoryFlatViewStyle().horizontal}
                    data={item?.data}
                    scrollEnabled={categoryFlatViewStyle().scrollEnabled}
                    keyExtractor={(item, index) =>
                      String(item?.id + `${index}`)
                    }
                    showsHorizontalScrollIndicator={false}
                    numColumns={categoryFlatViewStyle().numColumns}
                    renderItem={_renderCategories}
                    columnWrapperStyle={
                      !categoryFlatViewStyle().horizontal &&
                      categoryFlatViewStyle().numColumns > 1
                        ? {
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }
                        : null
                    }
                    contentContainerStyle={{
                      paddingHorizontal: 0,
                      paddingBottom: 0,
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={{height: moderateScale(8)}} />
                    )}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      ) : (
        <React.Fragment />
      );
    },
    [appMainData, isDarkMode, cartItemCount],
  );

  const listEmptyComponent = useCallback(() => {
    return (
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
            color: isDarkMode ? colors.white : colors.black,
          }}>
          {businessType == 'home_service'
            ? `${strings.WR_ARE_CURRENTLY_NOT_OPERATING} `
            : `${strings.SORRY_MSG}`}
        </Text>
      </View>
    );
  }, [isDarkMode]);

  const VendorsView = useCallback(
    ({item}) => {
      return (
        <View
          key={String(item?.id || '')}
          style={{
            marginBottom: moderateScaleVertical(0),
          }}>
          <View style={{marginTop: moderateScaleVertical(8)}} />

          {vendorHeader(item)}
          {appStyle?.homePageLayout == 11 && dineInType == 'on_demand' ? (
            <View style={{marginHorizontal: moderateScale(16)}}>
              <FlatList
                alwaysBounceVertical={true}
                data={item?.data || []}
                keyExtractor={(item, index) => String(item?.id + `${index}`)}
                showsHorizontalScrollIndicator={false}
                renderItem={_renderVendors}
                ListEmptyComponent={listEmptyComponent}
                numColumns={vendorFlatViewStyle().numColumns}
                horizontal={vendorFlatViewStyle().horizontal}
                scrollEnabled={vendorFlatViewStyle().scrollEnabled}
                ItemSeparatorComponent={() => (
                  <View style={{height: moderateScale(10)}} />
                )}
                ListFooterComponent={() => {
                  return (
                    <View
                      style={{
                        alignSelf: 'center',
                        marginTop: moderateScaleVertical(8),
                        borderBottomWidth: 1,
                        borderBottomColor: themeColors?.primary_color,
                      }}>
                      {item?.data?.length > 1 && (
                        <TouchableOpacity
                          onPress={() =>
                            onViewAll('vendor', appMainData?.vendors)
                          }>
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
                  );
                }}
              />
            </View>
          ) : (
            <View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={item?.data || []}
                keyExtractor={(item, index) => String(item?.id + `${index}`)}
                renderItem={_renderVendors}
                ListEmptyComponent={listEmptyComponent}
                contentContainerStyle={{
                  paddingHorizontal: moderateScale(8),
                  paddingBottom: moderateScaleVertical(8),
                }}
                ItemSeparatorComponent={() => (
                  <View style={{width: moderateScale(6)}} />
                )}
              />
            </View>
          )}
        </View>
      );
    },
    [appMainData, isDarkMode],
  );

  const _renderSpotlightDeals = useCallback(
    ({item, index}) => {
      const spotCardWidth = Math.min(width * 0.44, moderateScale(186));
      const spotImageHeight = moderateScaleVertical(124);
      return (
        <ProductsComp3V2
          item={item}
          onPress={() =>
            navigation.navigate(navigationStrings.PRODUCTDETAIL, {data: item})
          }
          numberOfLines={2}
          containerStyle={{
            width: spotCardWidth,
            minHeight: spotImageHeight + moderateScaleVertical(72),
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
            borderRadius: moderateScale(8),
            paddingBottom: moderateScaleVertical(8),
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: isDarkMode ? 0 : 0.07,
            shadowRadius: 6,
            elevation: isDarkMode ? 0 : 2,
          }}
          imageStyle={{
            width: spotCardWidth,
            height: spotImageHeight,
            borderTopLeftRadius: moderateScale(8),
            borderTopRightRadius: moderateScale(8),
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.06)' : '#F4F6F8',
          }}
          imageContentStyle={{
            borderTopLeftRadius: moderateScale(8),
            borderTopRightRadius: moderateScale(8),
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
          contentContainerStyle={{
            paddingHorizontal: moderateScale(8),
            paddingTop: moderateScaleVertical(6),
            minHeight: moderateScaleVertical(60),
            justifyContent: 'space-between',
          }}
          titleTextStyle={{
            fontSize: textScale(10.5),
            lineHeight: moderateScaleVertical(15),
            fontFamily: fontFamily?.medium,
          }}
          priceTextStyle={{
            fontSize: textScale(12),
            lineHeight: moderateScaleVertical(16),
          }}
          preserveRatingSpace={false}
          ratingPosition="topRight"
          enableEntryAnimation={true}
          animationDelay={index * 70}
        />
      );
    },
    [themeColors, fontFamily, appMainData, isDarkMode, dataProvider],
  );

  const SpotlightDealsView = useCallback(
    ({item}) => {
      return !isEmpty(item?.data) ? (
        <View
          key={String(item?.id || '')}
          style={{marginBottom: moderateScaleVertical(0)}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TitleViewHome
              item={item}
              isDarkMode={isDarkMode}
              appStyle={appStyle}
              textStyle={{
                fontSize: textScale(13),
                fontFamily: appStyle?.fontSizeData?.bold,
                marginTop: moderateScaleVertical(14),
                marginBottom: moderateScaleVertical(8),
              }}
            />
            {item?.data?.length >= 9 && (
              <TouchableOpacity
                onPress={() => showAllSpotDealAndSelectedProducts(item)}>
                <Text
                  style={{
                    marginHorizontal: moderateScale(16),
                    color: themeColors?.primary_color,
                    fontFamily: fontFamily?.medium,
                    fontSize: textScale(10),
                  }}>
                  {strings.VIEW_ALL}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={item?.data || []}
            renderItem={_renderSpotlightDeals}
            keyExtractor={(item, index) => String(item?.id + `${index}`)}
            ItemSeparatorComponent={() => (
              <View style={{marginRight: moderateScale(10)}} />
            )}
            ListHeaderComponent={() => (
              <View style={{marginLeft: moderateScale(12)}} />
            )}
            ListFooterComponent={() => (
              <View style={{marginRight: moderateScale(12)}} />
            )}
          />
        </View>
      ) : (
        <React.Fragment />
      );
    },
    [themeColors, fontFamily, appMainData, isDarkMode, dataProvider],
  );

  const keyExtractorUnique = useCallback((item, index) =>
    !!item?.id ? String(item.id) : String(index),
  );

  // //remove unncessary data
  // const optamizeValue = useMemo(() => {
  //   let filterData =
  //     !!appMainData?.homePageLabels &&
  //     appMainData?.homePageLabels.filter((val, i) => {
  //       if (val?.slug == 'banner' && !isEmpty(val?.banner_image)) {
  //         return val;
  //       }
  //       return val;
  //     });
  //   return filterData;
  // }, [appMainData?.homePageLabels]);

  const dataProvider = useMemo(
    () => appMainData?.homePageLabels,
    [appMainData?.homePageLabels],
  );

  if (isLoading) {
    return <DashBoardFiveV2ApiLoader />;
  } //home loader

  const ListHeaderComponent = () => {
    let myBanner = appMainData?.mobile_banners || appData?.mobile_banners || [];
    return (
      <View style={{marginTop: moderateScaleVertical(8)}}>
        <Carousel
          autoplay={true}
          loop={true}
          autoplayInterval={2000}
          data={myBanner}
          renderItem={renderBanners}
          sliderWidth={screenWidth}
          itemWidth={bannerItemWidth}
        />
      </View>
    );
  };

  return (
    <WrapperContainer
      isSafeArea={false}
      bgColor={
        isDarkMode
          ? MyDarkTheme.colors.background
          : dineInType == 'p2p' && appStyle?.homePageLayout == 8
          ? colors.white
          : colors.backgroundGrey
      }>
      {showAllTempCartOrders()}
      {!!dataProvider && !isEmpty(dataProvider) ? (
        <Animated.FlatList
          ref={ref}
          data={dataProvider}
          extraData={dataProvider}
          renderItem={renderHomePageItems}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          onScrollBeginDrag={(e) => onScrollPositionChange(e.nativeEvent.contentOffset.y)}
          onScrollEndDrag={(e) => onScrollPositionChange(e.nativeEvent.contentOffset.y)}
          onMomentumScrollEnd={(e) => onScrollPositionChange(e.nativeEvent.contentOffset.y)}
          keyExtractor={keyExtractorUnique}
          onScrollToIndexFailed={() => console.log('df')}
          contentContainerStyle={{ paddingTop: 0 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          // ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={() => (
            <View>
              <HomeOurProfessional />
              <HomeFaq />
              <HomeTrust />
              <View style={{height: moderateScale(80)}} />
            </View>
          )}
        />
      ) : null}
      {getBundleId() == appIds.easyDrink && isConfirmAgeModal && (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isConfirmAgeModal}>
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
                    {color: isDarkMode ? colors.white : colors.black},
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
                    style={{marginTop: moderateScale(7)}}
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
    </WrapperContainer>
  );
};

//Title home
const TitleViewHome = ({
  item = {},
  isDarkMode = false,
  appStyle = {},
  textStyle = {},
}) => {
  const fontFamily = appStyle?.fontSizeData;
  return (
    <Text
      style={{
        fontFamily: fontFamily?.medium,
        fontSize: textScale(16),
        textAlign: 'left',
        color: isDarkMode ? colors.white : colors.black,
        marginHorizontal: moderateScale(16),
        marginTop: moderateScaleVertical(20),
        marginBottom: moderateScaleVertical(7),
        ...textStyle,
      }}>
      {!isEmpty(item?.translations)
        ? item?.translations[0]?.title || item?.title
        : item?.title}
    </Text>
  );
};
const ProductsThemeViewOnDeamnd = ({
  themeColors = {},
  item,
  navigation,
  isDarkMode,
  appStyle = {},
  onPressProduct = () => {},
  priceType,
}) => {
  return !isEmpty(item?.data) ? (
    <View
      key={String(item?.id || '')}
      style={{
        marginBottom: moderateScaleVertical(0),
      }}>
      <TitleViewHome
        item={item}
        isDarkMode={isDarkMode}
        appStyle={appStyle}
        themeColors={themeColors}
      />

      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={item?.data}
        renderItem={({item}) =>
          _renderProducts({item, navigation, onPressProduct, priceType})
        }
        keyExtractor={(item, index) => String(item?.id + `${index}`)}
        ItemSeparatorComponent={() => (
          <View style={{marginRight: moderateScale(16)}} />
        )}
        ListHeaderComponent={() => (
          <View style={{marginLeft: moderateScale(16)}} />
        )}
        ListFooterComponent={() => (
          <View style={{marginRight: moderateScale(16)}} />
        )}
      />
    </View>
  ) : (
    <React.Fragment />
  );
};
//product theme view
const ProductsThemeView = ({
  item,
  navigation,
  isDarkMode,
  appStyle = {},
  onPressProduct = () => {},
  dineInType,
}) => {
  const {width: screenWidth} = useWindowDimensions();
  const isCompactScreen = screenWidth < 360;
  const isTwoRowFeaturedProducts = item?.slug === 'featured_products';
  const featuredCardWidth = Math.min(
    screenWidth * (isCompactScreen ? 0.48 : 0.44),
    moderateScale(186),
  );
  const featuredImageHeight = isCompactScreen
    ? moderateScaleVertical(112)
    : moderateScaleVertical(124);
  const featuredColumnData = useMemo(() => {
    if (!isTwoRowFeaturedProducts) {
      return item?.data || [];
    }

    const groupedData = [];
    const sourceData = item?.data || [];

    for (let index = 0; index < sourceData.length; index += 2) {
      groupedData.push(sourceData.slice(index, index + 2));
    }

    return groupedData;
  }, [item?.data, isTwoRowFeaturedProducts]);

  return !isEmpty(item?.data) ? (
    <View
      key={String(item?.id || '')}
      style={{
        marginBottom: moderateScaleVertical(0),
      }}>
      <TitleViewHome
        item={item}
        isDarkMode={isDarkMode}
        appStyle={appStyle}
        textStyle={{
          fontSize: textScale(13),
          fontFamily: appStyle?.fontSizeData?.bold,
          marginTop: moderateScaleVertical(14),
          marginBottom: moderateScaleVertical(8),
        }}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={dineInType == 'car_rental' ? false : true}
        data={featuredColumnData}
        renderItem={({item: productColumn, index}) => {
          const baseProductCardProps = {
            navigation,
            onPressProduct,
            dineInType,
            numberOfLines: 2,
            containerStyle: {
              width: featuredCardWidth,
              minHeight: featuredImageHeight + moderateScaleVertical(72),
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
              borderRadius: moderateScale(8),
              paddingBottom: moderateScaleVertical(8),
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: isDarkMode ? 0 : 0.07,
              shadowRadius: 6,
              elevation: isDarkMode ? 0 : 2,
            },
            imageStyle: {
              width: featuredCardWidth,
              height: featuredImageHeight,
              borderTopLeftRadius: moderateScale(8),
              borderTopRightRadius: moderateScale(8),
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              overflow: 'hidden',
              backgroundColor: isDarkMode
                ? 'rgba(255,255,255,0.06)'
                : '#F4F6F8',
            },
            imageContentStyle: {
              borderTopLeftRadius: moderateScale(8),
              borderTopRightRadius: moderateScale(8),
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
            imageResizeMode: FastImage.resizeMode.cover,
            contentContainerStyle: {
              paddingHorizontal: moderateScale(8),
              paddingTop: moderateScaleVertical(6),
              minHeight: moderateScaleVertical(60),
              justifyContent: 'space-between',
            },
            titleTextStyle: {
              fontSize: textScale(10.5),
              lineHeight: moderateScaleVertical(15),
              fontFamily: appStyle?.fontSizeData?.medium,
            },
            priceTextStyle: {
              fontSize: textScale(12),
              lineHeight: moderateScaleVertical(16),
            },
            preserveRatingSpace: false,
            ratingPosition: 'topRight',
            enableEntryAnimation: true,
          };

          if (!isTwoRowFeaturedProducts) {
            return _renderProducts({
              ...baseProductCardProps,
              item: productColumn,
              index,
              animationDelay: index * 70,
            });
          }

          return (
            <View style={{width: featuredCardWidth}}>
              {productColumn.map((productItem, productIndex) => (
                <View
                  key={String(productItem?.id || `${index}-${productIndex}`)}
                  style={{
                    marginBottom:
                      productIndex === productColumn.length - 1
                        ? 0
                        : moderateScaleVertical(10),
                  }}>
                  {_renderProducts({
                    ...baseProductCardProps,
                    item: productItem,
                    index: index * 2 + productIndex,
                    animationDelay: index * 120 + productIndex * 70,
                  })}
                </View>
              ))}
            </View>
          );
        }}
        keyExtractor={(productItem, index) =>
          isTwoRowFeaturedProducts
            ? `featured-column-${index}`
            : String(productItem?.id + `${index}`)
        }
        ItemSeparatorComponent={() => (
          <View style={{marginRight: moderateScale(10)}} />
        )}
        ListHeaderComponent={() => (
          <View style={{marginLeft: moderateScale(12)}} />
        )}
        ListFooterComponent={() => (
          <View style={{marginRight: moderateScale(12)}} />
        )}
      />
    </View>
  ) : (
    <React.Fragment />
  );
};
const _renderCities = ({item, navigation}) => {
  return (
    <View>
      <Cities item={item} />
    </View>
  );
};

const CitiesView = ({
  item = {},
  onPressVendor = () => {},
  appMainData = {},
  styles = {},
  appStyle = {},
  moveToNewScreen = () => {},
  isDarkMode = false,
}) => {
  if (isEmpty(item?.data || [])) {
    return <></>;
  }
  return (
    <View>
      <TitleViewHome
        item={item}
        isDarkMode={isDarkMode}
        appStyle={appStyle}
        textStyle={{
          fontSize: textScale(13),
          fontFamily: appStyle?.fontSizeData?.bold,
          marginTop: moderateScaleVertical(14),
          marginBottom: moderateScaleVertical(8),
        }}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={item?.data || []}
        renderItem={({item}) =>
          _renderCities({item, isDarkMode, appMainData, moveToNewScreen})
        }
        keyExtractor={(item, index) => String(item?.id + `${index}`)}
        ItemSeparatorComponent={() => (
          <View style={{marginRight: moderateScale(6)}} />
        )}
        ListHeaderComponent={() => (
          <View style={{marginLeft: moderateScale(16)}} />
        )}
        ListFooterComponent={() => (
          <View style={{marginRight: moderateScale(16)}} />
        )}
      />
    </View>
  );
};
const _renderProducts = ({
  item,
  index = 0,
  navigation,
  onPressProduct = () => {},
  dineInType,
  imageStyle,
  imageContentStyle,
  imageResizeMode,
  numberOfLines,
  containerStyle,
  contentContainerStyle,
  preserveRatingSpace,
  titleTextStyle,
  priceTextStyle,
  enableEntryAnimation,
  animationDelay,
  ratingPosition,
}) => {
  if (dineInType == 'car_rental') {
    return (
      <ProductsThemeCard
        item={item}
        onPressProduct={() => onPressProduct(item)}
      />
    );
  }
  return (
    <ProductsComp3V2
      item={item}
      onPress={() => onPressProduct(item)}
      imageStyle={imageStyle}
      imageContentStyle={imageContentStyle}
      imageResizeMode={imageResizeMode}
      numberOfLines={numberOfLines}
      containerStyle={containerStyle}
      contentContainerStyle={contentContainerStyle}
      preserveRatingSpace={preserveRatingSpace}
      titleTextStyle={titleTextStyle}
      priceTextStyle={priceTextStyle}
      enableEntryAnimation={enableEntryAnimation}
      animationDelay={animationDelay ?? index * 70}
      ratingPosition={ratingPosition}
    />
  );
};

//best sellers view
const BestSellersView = ({
  item = {},
  onPressVendor = () => {},
  appMainData = {},
  styles = {},
  appStyle = {},
  isDarkMode = false,
}) => {
  return !isEmpty(item?.data) ? (
    <View
      key={String(item?.id || '')}
      style={{
        marginBottom: moderateScaleVertical(0),
      }}>
      <TitleViewHome item={item} isDarkMode={isDarkMode} appStyle={appStyle} />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={item?.data || []}
        renderItem={({item}) =>
          _renderBestVendors({
            item,
            onPressVendor,
            appMainData,
            styles,
            appStyle,
            cardWidth: bestSellerCardWidth,
          })
        }
        keyExtractor={(item, index) => String(item?.id + `${index}`)}
        ItemSeparatorComponent={() => (
          <View style={{marginRight: moderateScale(16)}} />
        )}
        ListHeaderComponent={() => (
          <View style={{marginLeft: moderateScale(16)}} />
        )}
        ListFooterComponent={() => (
          <View style={{marginRight: moderateScale(16)}} />
        )}
      />
    </View>
  ) : (
    <React.Fragment />
  );
};
//render best vendors function

const _renderBestVendors = ({
  item = {},
  onPressVendor = () => {},
  appMainData = {},
  styles = {},
  appStyle = {},
  cardWidth = moderateScale(168),
}) => {
  const fontFamily = appStyle?.fontSizeData;

  return (
    <TouchableOpacity
      key={String(item?.id)}
      onPress={() => onPressVendor(item)}
      activeOpacity={0.7}
      style={{
        height: moderateScaleVertical(140),
        width: cardWidth,
        borderRadius: moderateScale(10),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <FastImage
        source={{
          uri: getImageUrlNew({
            url: item?.logo || null,
            image_const_arr: appMainData.image_prefix,
            type: 'image_fit',
            height: 250,
            width: 250,
          }),
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.high,
        }}
        style={{
          ...StyleSheet.absoluteFill,
          height: moderateScaleVertical(140),
          width: cardWidth,
        }}
      />
      <View
        style={{
          ...StyleSheet.absoluteFill,
          height: moderateScaleVertical(140),
          width: cardWidth,
          backgroundColor: colors.blackOpacity66,
        }}
      />
      {!!item?.rating !== '0.0' && !!item?.rating && (
        <View
          style={{...styles.hdrRatingTxtView, position: 'absolute', top: 0}}>
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
          fontFamily: fontFamily?.bold,
          fontSize: textScale(18),
          color: colors.white,
        }}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );
};

//brand view

const BrandsView = ({
  item = {},
  isDarkMode = false,
  appMainData = {},
  moveToNewScreen = () => {},
  appStyle = {},
}) => {
  return !isEmpty(item?.data) ? (
    <View
      key={String(item?.id || '')}
      style={{
        marginBottom: moderateScaleVertical(0),
      }}>
      <TitleViewHome
        item={item}
        isDarkMode={isDarkMode}
        appStyle={appStyle}
        // textStyle={{ fontFamily: fontFamily?.medium}}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={item?.data}
        renderItem={({item}) =>
          _renderBrands({item, isDarkMode, appMainData, moveToNewScreen})
        }
        keyExtractor={(item, index) => String(item?.id + `${index}`)}
        ItemSeparatorComponent={() => (
          <View style={{marginRight: moderateScale(12)}} />
        )}
        ListHeaderComponent={() => (
          <View style={{marginLeft: moderateScale(16)}} />
        )}
        ListFooterComponent={() => (
          <View style={{marginRight: moderateScale(16)}} />
        )}
      />
    </View>
  ) : (
    <React.Fragment />
  );
};

//render brands function
const _renderBrands = ({
  item = {},
  isDarkMode = false,
  appMainData = {},
  moveToNewScreen = () => {},
}) => {
  const imageURI = item?.image
    ? getImageUrlNew({
        url: item?.image || null,
        image_const_arr: appMainData.image_prefix,
        type: 'image_fit',
        height: 250,
        width: 250,
      })
    : item?.image_url;
  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}>
      {isSVG ? (
        <SvgUri
          height={moderateScale(96)}
          width={moderateScale(96)}
          uri={imageURI}
        />
      ) : (
        <FastImage
          source={{uri: imageURI, priority: FastImage.priority.high}}
          style={{
            height: moderateScale(96),
            width: moderateScale(96),
            borderRadius: moderateScale(10),
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyColor,
            borderWidth: 1,
            borderColor: colors.borderStroke,
          }}
        />
      )}
    </TouchableOpacity>
  );
};


export default React.memo(DashBoardFiveV2Api);
