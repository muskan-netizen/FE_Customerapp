import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryGrid from '../../../Components/CategoryGrid';
import MarketCard3V2 from '../../../Components/MarketCard3V2';
import ProductsThemeCard from '../../../Components/NewComponents/ProductsThemeCard';
import OnDemanVendor from '../../../Components/OnDemanVendor';
import ProductsComp3V2Grocery from '../../../Components/ProductsComp3V2Grocery';
import VendorModeHeader from '../../../Components/VendorModeHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
    moderateScale,
    moderateScaleVertical,
    textScale,
    width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { getImageUrl } from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';
import * as CategoryTemplate from '../TemplateStyle/CategoryStyle';
import fontFamily from '../../../styles/fontFamily';

const GroceryHomePage = ({
    navigation,
    handleRefresh = () => { },
    bannerPress = () => { },
    isRefreshing = false,
    onPressCategory = () => { },
    onPressVendor = () => { },
    onPressProduct = () => { },
    selcetedToggle = () => { },
}) => {
    const {
        appData,
        themeColors,
        appStyle,
        themeColor,
        themeToggle,
    } = useSelector(state => state?.initBoot || {});
    const { location, appMainData, dineInType, priceType } = useSelector(state => state?.home || {});
    const userData = useSelector(state => state?.auth?.userData);
    const { cartItemCount } = useSelector(state => state?.cart);
    const insets = useSafeAreaInsets();
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    let businessType = appData?.profile?.preferences?.business_type || null;

    const [categoryData, setCategoryData] = useState([]);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

    // Animation values
    const scrollY = useSharedValue(0);


    useEffect(() => {
        const categoryDataHome =
            appMainData?.homePageLabels?.filter(
                item => item?.slug === 'nav_categories',
            ) || [];

        setCategoryData(categoryDataHome[0]?.data || []);
    }, [appMainData]);

    useEffect(() => {
        if (categoryData?.length > 0) {
            const interval = setInterval(() => {
                setCurrentCategoryIndex(prevIndex =>
                    (prevIndex + 1) % categoryData.length
                );
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [categoryData]);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            scrollY.value = event.contentOffset.y;
        },
    });


    // Component functions from DashBoardFiveV2Api
    const _renderVendors = useCallback(
        ({ item, index }) => {
            if (appStyle?.homePageLayout == 11 && dineInType == 'on_demand') {
                return (
                    <OnDemanVendor
                        data={item}
                        onPress={() => onPressVendor(item)}
                        extraStyles={{ margin: 2 }}
                    />
                );
            }
            return (
                <View style={{ width: '100%' }}>
                    <MarketCard3V2
                        data={item}
                        onPress={() => onPressVendor(item)}
                        extraStyles={{ margin: 2 }}
                    />
                </View>
            );
        },
        [isDarkMode, priceType, dineInType, appStyle],
    );

    const _renderProducts = ({ item, navigation, onPressProduct = () => { }, dineInType }) => {
        if (dineInType == 'car_rental') {
            return (
                <ProductsThemeCard
                    item={item}
                    onPressProduct={() => onPressProduct(item)}
                />
            );
        }
        return <ProductsComp3V2Grocery item={item} onPress={() => onPressProduct(item)} />;
    };

    const renderBanners = ({ item, index }) => {
        const imageUrl = getImageUrl(
            item?.image?.image_fit,
            item?.image?.image_path,
            '800/600'
        );

        return (
            <View key={String(item?.id || index)}>
                <TouchableOpacity
                    style={{ alignSelf: 'center' }}
                    activeOpacity={0.8}
                    onPress={() => bannerPress(item)}>
                    <FastImage
                        source={{
                            uri: imageUrl,
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        style={{
                            height: moderateScale(160),
                            width: width - 32,
                            borderRadius: moderateScale(16),
                            backgroundColor: isDarkMode
                                ? colors.whiteOpacity15
                                : colors.greyColor,
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                    />
                </TouchableOpacity>
            </View>
        );
    };


    //Title home component
    const TitleViewHome = ({ item = {}, isDarkMode = false, appStyle = {}, textStyle = {} }) => {
        return (
            <Text
                style={{
                    textAlign: 'left',
                    color: isDarkMode ? colors.white : colors.textGrey,
                    marginHorizontal: moderateScale(16),
                    marginTop: moderateScaleVertical(20),
                    marginBottom: moderateScaleVertical(7),
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: textScale(16),
                    fontFamily: fontFamily.bold,
                    marginBottom: moderateScale(10),
                    textAlign: 'left',
                    ...textStyle,
                }}>
                {!isEmpty(item?.translations)
                    ? item?.translations[0]?.title || item?.title
                    : item?.title}
            </Text>
        );
    };

    //banners view
    const BannersView = ({ item = {}, showTitle = true }) => {
        let myBanner =
            item?.banner_images ||
            appMainData?.mobile_banners ||
            appData?.mobile_banners ||
            [];

        // Remove first banner from array
        const bannersToShow = myBanner.length > 1 ? myBanner.slice(1) : myBanner;

        return !isEmpty(bannersToShow) ? (
            <View
                key={String(item?.id)}
                style={{ marginBottom: moderateScaleVertical(0), marginTop: moderateScaleVertical(12) }}>
                <Carousel
                    autoplay={true}
                    loop={true}
                    autoplayInterval={3000}
                    data={bannersToShow}
                    renderItem={renderBanners}
                    sliderWidth={width}
                    itemWidth={width}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={1}
                    activeSlideAlignment="center"
                    contentContainerCustomStyle={{
                        paddingHorizontal: 0,
                    }}
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
        onPressProduct = () => { },
        dineInType,
    }) => {
        const data = item?.data || [];
        const isSingleRow = data.length < 6;

        // Render item for single row layout
        const renderSingleRowItem = useCallback(({ item: product, index }) => (
            <View
                style={{
                    marginRight: moderateScale(14),
                    marginLeft: index === 0 ? moderateScale(16) : 0,
                }}>
                {_renderProducts({
                    item: product,
                    navigation,
                    onPressProduct,
                    dineInType,
                })}
            </View>
        ), [navigation, onPressProduct, dineInType]);

        // Render item for grid layout (2 columns)
        const renderGridItem = useCallback(({ item: sectionData, index }) => (
            <View
                style={{
                    marginRight: moderateScale(14),
                    marginLeft: index === 0 ? moderateScale(16) : 0,
                }}>
                {/* Column 1 */}
                <View style={{ marginBottom: moderateScale(8) }}>
                    {sectionData[0] &&
                        _renderProducts({
                            item: sectionData[0],
                            navigation,
                            onPressProduct,
                            dineInType,
                        })}
                </View>

                {/* Column 2 */}
                <View>
                    {sectionData[1] &&
                        _renderProducts({
                            item: sectionData[1],
                            navigation,
                            onPressProduct,
                            dineInType,
                        })}
                </View>
            </View>
        ), [navigation, onPressProduct, dineInType]);

        // Prepare data for FlatList
        const flatListData = useMemo(() => {
            if (isSingleRow) {
                return data;
            } else {
                // Group data into pairs for grid layout
                const sections = [];
                for (let i = 0; i < data.length; i += 2) {
                    sections.push(data.slice(i, i + 2));
                }
                return sections;
            }
        }, [data, isSingleRow]);

        // Key extractor for FlatList
        const keyExtractorProducts = useCallback((item, index) => {
            if (isSingleRow) {
                return `single-${item?.id || index}`;
            } else {
                return `section-${index}`;
            }
        }, [isSingleRow]);

        return !isEmpty(data) ? (
            <View
                key={String(item?.id || '')}
                style={{
                    marginBottom: moderateScaleVertical(0),
                }}>
                <TitleViewHome item={item} isDarkMode={isDarkMode} appStyle={appStyle} />
                <FlatList
                    data={flatListData}
                    renderItem={isSingleRow ? renderSingleRowItem : renderGridItem}
                    keyExtractor={keyExtractorProducts}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                />
            </View>
        ) : (
            <React.Fragment />
        );
    };

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

    //vendors view
    const VendorsView = ({ item }) => {
        return (
            <View
                key={String(item?.id || '')}
                style={{
                    marginBottom: moderateScaleVertical(0),
                }}>
                <View style={{ marginTop: moderateScaleVertical(8) }} />
                <TitleViewHome item={item} isDarkMode={isDarkMode} appStyle={appStyle} />
                <View style={{ marginHorizontal: moderateScale(16) }}>
                    <Animated.FlatList
                        alwaysBounceVertical={true}
                        data={item?.data || []}
                        keyExtractor={(item, index) => String(item?.id + `${index}`)}
                        showsHorizontalScrollIndicator={false}
                        renderItem={_renderVendors}
                        ListEmptyComponent={listEmptyComponent}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: moderateScale(10) }} />
                        )}
                    />
                </View>
            </View>
        );
    };

    // Main home page items renderer - based on DashBoardFiveV2Api
    const renderHomePageItems = useCallback(
        ({ item, index }) => {
            let uniqueId = String(item?.id || index);
            return (
                <View key={uniqueId}>
                    {item?.slug == 'banner' ? (
                        <BannersView item={item} showTitle={true} />
                    ) : dineInType != 'car_rental' &&
                        (item?.slug == 'new_products' ||
                            item?.slug == 'on_sale' ||
                            item?.slug == 'most_popular_products' ||
                            item?.slug == 'recently_viewed' ||
                            item?.slug == 'ordered_products' ||
                            item?.slug == 'top_rated' ||
                            item?.slug == 'selected_products' ||
                            item?.slug == 'single_category_products' ||
                            item?.slug == 'featured_products') ? (
                        <ProductsThemeView
                            appStyle={appStyle}
                            item={item}
                            isDarkMode={isDarkMode}
                            navigation={navigation}
                            onPressProduct={onPressProduct}
                            dineInType={dineInType}
                        />
                    ) : item?.slug == 'nav_categories' ? (
                        <>
                            {item?.data?.length > 0 && item?.data?.map((item) => (
                                <CategoryGrid
                                    key={item?.id}
                                    data={item}
                                    isDarkMode={isDarkMode}
                                    onCategoryPress={(cat) => onPressCategory(cat, item)}
                                />
                            ))}
                        </>
                    ) : (
                        <React.Fragment />
                    )}
                </View>
            );
        },
        [themeColors, fontFamily, appMainData, appStyle, isDarkMode, cartItemCount, dineInType, priceType],
    );

    // Data provider for FlatList
    const dataProvider = useMemo(
        () => appMainData?.homePageLabels || [],
        [appMainData?.homePageLabels],
    );

    // Key extractor for FlatList
    const keyExtractor = useCallback((item, index) => {
        return String(item?.id || index);
    }, []);

    // Render item for FlatList
    const renderItem = useCallback(({ item, index }) => {
        return renderHomePageItems({ item, index });
    }, [renderHomePageItems]);

    // Sticky Search Bar Animation - using display flex/none
    const stickySearchStyle = useAnimatedStyle(() => {
        const shouldShow = appData?.profile?.preferences?.vendorMode?.length == 1 ?
            scrollY.value > 1 :
            scrollY.value > 60;

        return {
            display: shouldShow ? 'flex' : 'none',
        };
    });

    // Sticky Header Component
    const StickyHeader = () => {
        return (
            <Animated.View
                style={[
                    stickySearchStyle,
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                    }
                ]}>
                <LinearGradient colors={['#062444', colors.borderBlue]}>

                    {/* Location Section - Sticky */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: moderateScale(16),
                        paddingVertical: moderateScale(8),
                        paddingTop: moderateScaleVertical(12) + insets.top
                    }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() =>
                                navigation.navigate(navigationStrings.LOCATION, {
                                    type: 'Home1',
                                })
                            }
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                            <View style={{ marginRight: moderateScale(10), flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={{
                                            width: moderateScale(16),
                                            height: moderateScale(16),
                                            tintColor: colors.white,
                                            marginRight: moderateScale(10),
                                        }}
                                        source={imagePath.location1}
                                        resizeMode="contain"
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: colors.white,
                                            fontFamily: fontFamily?.bold,
                                            fontSize: textScale(16),
                                        }}>
                                        {location?.type === 3
                                            ? strings.LOCATION
                                            : location?.type === 2
                                                ? strings.WORK
                                                : strings.HOME}
                                    </Text>
                                    <Image
                                        tintColor={colors.white}
                                        source={imagePath.dropDownSingle}
                                        style={{
                                            width: moderateScale(16),
                                            height: moderateScale(16),
                                            marginLeft: moderateScale(4),
                                        }}
                                    />
                                </View>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: colors.whiteOpacity85,
                                        fontFamily: fontFamily?.regular,
                                        fontSize: textScale(12),
                                        marginTop: moderateScale(2),
                                    }}>
                                    {location?.address}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                if (userData?.auth_token) {
                                    navigation.navigate(navigationStrings.ACCOUNTS)
                                } else {
                                    actions.setAppSessionData('on_login')
                                }
                            }}
                        >
                            <LinearGradient
                                colors={[colors.yellowB, colors.white]}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                locations={[0, 1]}
                                style={{
                                    width: moderateScale(36),
                                    height: moderateScale(36),
                                    borderRadius: moderateScale(20),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: moderateScale(1),
                                    borderColor: colors.yellowC,
                                }}>
                                <Text
                                    style={{
                                        color: '#B8860B',
                                        fontSize: textScale(14),
                                        lineHeight: textScale(18),
                                        fontFamily: fontFamily?.bold,
                                        textTransform: 'uppercase',
                                    }}>
                                    {!!userData?.name ? userData?.name?.charAt(0) : 'G'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar Section - Sticky */}
                    <View style={{
                        paddingHorizontal: moderateScale(16),
                        paddingBottom: moderateScale(12),
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                            }
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: colors.greyNew,
                                borderRadius: moderateScale(10),
                                paddingHorizontal: moderateScale(16),
                                paddingVertical: moderateScale(12),
                            }}>
                            <Image
                                source={imagePath.search1}
                                style={{
                                    width: moderateScale(20),
                                    height: moderateScale(20),
                                    tintColor: themeColors?.primary_color,
                                    marginRight: moderateScale(12),
                                }}
                                resizeMode="contain"
                            />
                            <Text
                                numberOfLines={1}
                                style={{
                                    flex: 1,
                                    color: colors.textGreyLight,
                                    fontSize: moderateScale(14),
                                    fontFamily: fontFamily?.regular,
                                }}>
                                {categoryData?.length > 0
                                    ? `Search '${categoryData[currentCategoryIndex]?.name || 'food'}'`
                                    : 'Search food'}
                            </Text>
                            <View
                                style={{
                                    width: 1,
                                    height: moderateScale(20),
                                    backgroundColor: colors.blackOpacity20,
                                    marginHorizontal: moderateScale(12),
                                }}
                            />
                            <Image
                                source={imagePath.icVoice}
                                style={{
                                    width: moderateScale(20),
                                    height: moderateScale(20),
                                    tintColor: themeColors?.primary_color,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </Animated.View>
        );
    };

    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            isSafeArea={false}
            isLoading={isRefreshing}>
            {/* Sticky Header */}
            <StickyHeader />
            {/* Main Scrollable Content */}
            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={themeColors?.primary_color}
                    />
                }
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}>
                <ImageBackground
                    source={imagePath.HomeBack}
                    resizeMode='stretch'
                    style={{
                        paddingTop: insets.top,
                        paddingBottom: moderateScale(12),
                    }}
                >
                    {/* Vendor Mode Header - At the very top */}
                    <VendorModeHeader containerStyle={{ marginHorizontal: moderateScale(16) }} selectedToggle={selcetedToggle} />
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        marginHorizontal: moderateScale(16),
                        marginBottom: moderateScale(8),
                    }}>
                        {/* Location Section */}
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() =>
                                navigation.navigate(navigationStrings.LOCATION, {
                                    type: 'Home1',
                                })
                            }
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                            <View style={{ marginRight: moderateScale(10), flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        style={{
                                            width: moderateScale(16),
                                            height: moderateScale(16),
                                            tintColor: colors.white,
                                            marginRight: moderateScale(10),
                                        }}
                                        source={imagePath.location1}
                                        resizeMode="contain"
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: colors.white,
                                            fontFamily: fontFamily?.bold,
                                            fontSize: textScale(16),
                                        }}>
                                        {location?.type === 3
                                            ? strings.LOCATION
                                            : location?.type === 2
                                                ? strings.WORK
                                                : strings.HOME}
                                    </Text>
                                    <Image
                                        tintColor={colors.white}
                                        source={imagePath.dropDownSingle}
                                        style={{
                                            width: moderateScale(16),
                                            height: moderateScale(16),
                                            marginLeft: moderateScale(4),
                                        }}
                                    />
                                </View>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: colors.whiteOpacity85,
                                        fontFamily: fontFamily?.regular,
                                        fontSize: textScale(12),
                                        marginTop: moderateScale(2),
                                    }}>
                                    {location?.address}
                                </Text>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity
                            onPress={() => {
                                if (userData?.auth_token) {
                                    navigation.navigate(navigationStrings.ACCOUNTS)
                                } else {
                                    actions.setAppSessionData('on_login')
                                }
                            }}
                        >
                            <LinearGradient
                                colors={[colors.yellowB, colors.white]}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                locations={[0, 1]}
                                style={{
                                    width: moderateScale(36),
                                    height: moderateScale(36),
                                    borderRadius: moderateScale(20),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: moderateScale(1),
                                    borderColor: colors.yellowC,
                                }}>
                                <Text
                                    style={{
                                        color: '#B8860B',
                                        fontSize: textScale(14),
                                        lineHeight: textScale(18),
                                        fontFamily: fontFamily?.bold,
                                        textTransform: 'uppercase',
                                    }}>
                                    {!!userData?.name ? userData?.name?.charAt(0) : 'G'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar Section - Normal flow */}
                    <View style={{
                        paddingHorizontal: moderateScale(16),
                        paddingBottom: moderateScale(12),
                    }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                            }
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: colors.greyNew,
                                borderRadius: moderateScale(10),
                                paddingHorizontal: moderateScale(16),
                                paddingVertical: moderateScale(12),
                            }}>
                            <Image
                                source={imagePath.search1}
                                style={{
                                    width: moderateScale(20),
                                    height: moderateScale(20),
                                    tintColor: themeColors?.primary_color,
                                    marginRight: moderateScale(12),
                                }}
                                resizeMode="contain"
                            />
                            <Text
                                numberOfLines={1}
                                style={{
                                    flex: 1,
                                    color: colors.textGreyLight,
                                    fontSize: moderateScale(14),
                                    fontFamily: fontFamily?.regular,
                                }}>
                                {categoryData?.length > 0
                                    ? `Search '${categoryData[currentCategoryIndex]?.name || 'food'}'`
                                    : 'Search food'}
                            </Text>
                            <View
                                style={{
                                    width: 1,
                                    height: moderateScale(20),
                                    backgroundColor: colors.blackOpacity20,
                                    marginHorizontal: moderateScale(12),
                                }}
                            />
                            <Image
                                source={imagePath.icVoice}
                                style={{
                                    width: moderateScale(20),
                                    height: moderateScale(20),
                                    tintColor: themeColors?.primary_color,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                    {/* Category Section - Normal flow */}
                    <View>
                        {(() => {
                            const categoriesData = appMainData?.homePageLabels?.find(
                                item => item?.slug === 'nav_categories'
                            );
                            return !isEmpty(categoriesData?.data) ? (
                                <Animated.FlatList
                                    horizontal
                                    data={categoriesData.data}
                                    keyExtractor={(item, index) => String(item?.id + `${index}`)}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => (
                                        <View>
                                            <CategoryTemplate.HomeCategoryCard_Grocery
                                                data={item}
                                                onPress={() => onPressCategory(item)}
                                            />
                                        </View>
                                    )}
                                    contentContainerStyle={{
                                        marginLeft: moderateScale(12),
                                        marginTop: moderateScaleVertical(12)
                                    }}
                                />
                            ) : null;
                        })()}
                    </View>
                    <View style={{ marginBottom: moderateScale(16), marginTop: moderateScaleVertical(10), justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: fontFamily.bold, fontSize: textScale(24), color: colors.white }}>{strings.WELCOME}</Text>
                        <Text style={{ fontFamily: fontFamily.regular, fontSize: textScale(16), color: colors.whiteOpacity85 }}>{strings.ORDER_NOW_AND_ENJOY_FREE_DELIVERY}</Text>
                    </View>
                </ImageBackground>

                {/* Main Content - Dynamic sections based on data */}
                <LinearGradient
                    style={{
                        flex: 1,
                        top: moderateScaleVertical(-30),
                        zIndex: -1,
                    }}
                    colors={[colors.backYellow, isDarkMode ? MyDarkTheme.colors.background : colors.white, isDarkMode ? MyDarkTheme.colors.background : colors.white]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: appData?.profile?.preferences?.vendorMode?.length == 1 ? 0.2 : 0.8 }}
                >
                    <View style={{ paddingTop: moderateScaleVertical(30) }}>
                        {!isEmpty(dataProvider) && (
                            <FlatList
                                data={dataProvider}
                                renderItem={renderItem}
                                keyExtractor={keyExtractor}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingBottom: moderateScale(30)
                                }}
                            />
                        )}
                    </View>
                </LinearGradient>
            </Animated.ScrollView>
        </WrapperContainer >
    );
}

export default React.memo(GroceryHomePage)