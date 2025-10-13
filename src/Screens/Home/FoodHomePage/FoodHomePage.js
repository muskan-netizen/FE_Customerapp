import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Image,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
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
import MarketCard3V2 from '../../../Components/MarketCard3V2';
import ProductsThemeCard from '../../../Components/NewComponents/ProductsThemeCard';
import OnDemanVendor from '../../../Components/OnDemanVendor';
import ProductsComp3V2 from '../../../Components/ProductsComp3V2';
import VendorCardGrub from '../../../Components/VendorCardGrub';
import VendorModeHeader from '../../../Components/VendorModeHeader';
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
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { getImageUrl } from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';
import * as CategoryTemplate from '../TemplateStyle/CategoryStyle';
import fontFamily from '../../../styles/fontFamily';

const FoodHomePage = ({
    navigation,
    handleRefresh = () => { },
    bannerPress = () => { },
    isRefreshing = false,
    onPressCategory = () => { },
    onPressVendor = () => { },
    onPressProduct = () => { },
    _onVoiceListen = () => { },
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
                        index={index}
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
        return <ProductsComp3V2 item={item} onPress={() => onPressProduct(item)} />;
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
                            height: moderateScale(100),
                            width: width - 32,
                            borderRadius: moderateScale(16),
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


    //Title home component
    const TitleViewHome = ({ item = {}, isDarkMode = false, appStyle = {}, textStyle = {} }) => {
        return (
            <Text
                style={{
                    fontFamily: fontFamily?.medium,
                    fontSize: textScale(12),
                    textAlign: 'left',
                    color: isDarkMode ? colors.white : colors.blackOpacity43,
                    marginHorizontal: moderateScale(16),
                    marginTop: moderateScaleVertical(12),
                    marginBottom: moderateScaleVertical(7),
                    textTransform: 'uppercase',
                    letterSpacing: 1,
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
        return !isEmpty(myBanner) ? (
            <View
                key={String(item?.id)}
                style={{ marginBottom: moderateScaleVertical(0) }}>
                {!!showTitle ? (
                    <TitleViewHome
                        item={item}
                        isDarkMode={isDarkMode}
                        appStyle={appStyle}
                    />
                ) : (
                    <View style={{ marginVertical: moderateScaleVertical(6) }} />
                )}
                <Carousel
                    autoplay={true}
                    loop={true}
                    autoplayInterval={3000}
                    data={myBanner}
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
        return !isEmpty(item?.data) ? (
            <View
                key={String(item?.id || '')}
                style={{
                    marginBottom: moderateScaleVertical(0),
                }}>
                <TitleViewHome item={item} isDarkMode={isDarkMode} appStyle={appStyle} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {(() => {
                        const data = item?.data || [];
                        const sections = [];

                        // If less than 10 items, show in single line
                        if (data.length < 6) {
                            return data.map((product, index) => (
                                <View
                                    key={`single-${index}`}
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
                            ));
                        }

                        // If 10 or more items, show in 2-line grid
                        for (let i = 0; i < data.length; i += 2) {
                            const sectionData = data.slice(i, i + 2);

                            sections.push(
                                <View
                                    key={`section-${i}`}
                                    style={{
                                        marginRight: moderateScale(14),
                                        marginLeft: i === 0 ? moderateScale(16) : 0,
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
                            );
                        }

                        return sections;
                    })()}
                </ScrollView>
            </View>
        ) : (
            <React.Fragment />
        );
    };
    //product theme view
    const RenderRecommendedProducts = ({
        item,
        navigation,
        isDarkMode,
        appStyle = {},
        onPressProduct = () => { },
        dineInType,
    }) => {
        return !isEmpty(item?.data) ? (
            <View
                key={String(item?.id || '')}
                style={{
                    marginBottom: moderateScaleVertical(0),
                }}>
                <TitleViewHome item={item} isDarkMode={isDarkMode} appStyle={appStyle} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {(() => {
                        const data = item?.data || [];
                        const sections = [];

                        // If less than 10 items, show in single line
                        if (data.length < 6) {
                            return data.map((product, index) => (
                                <View
                                    key={`single-${index}`}
                                    style={{
                                        marginRight: moderateScale(14),
                                        marginLeft: index === 0 ? moderateScale(16) : 0,
                                    }}>
                                    <VendorCardGrub onPress={() => onPressVendor(product)} item={product} />
                                </View>
                            ));
                        }

                        // If 10 or more items, show in 2-line grid
                        for (let i = 0; i < data.length; i += 2) {
                            const sectionData = data.slice(i, i + 2);

                            sections.push(
                                <View
                                    key={`section-${i}`}
                                    style={{
                                        marginRight: moderateScale(14),
                                        marginLeft: i === 0 ? moderateScale(16) : 0,
                                    }}>
                                    {/* Column 1 */}
                                    <View style={{ marginBottom: moderateScale(8) }}>
                                        {sectionData[0] && <VendorCardGrub onPress={() => onPressVendor(sectionData[0])} item={sectionData[0]} />}
                                    </View>

                                    {/* Column 2 */}
                                    <View>
                                        {sectionData[1] && <VendorCardGrub onPress={() => onPressVendor(sectionData[1])} item={sectionData[1]} />}
                                    </View>
                                </View>
                            );
                        }

                        return sections;
                    })()}
                </ScrollView>
            </View>
        ) : (
            <React.Fragment />
        );
    };
    //vendors view
    const VendorsView = ({ item }) => {
        return (
            <View
                key={String(item?.id || '')}
                style={{
                    marginBottom: moderateScaleVertical(0),
                }}>
                <TitleViewHome item={item} isDarkMode={isDarkMode} appStyle={appStyle} />
                <View style={{ marginHorizontal: moderateScale(16) }}>
                    <Animated.FlatList
                        alwaysBounceVertical={true}
                        data={item?.data || []}
                        keyExtractor={(item, index) => String(item?.id + `${index}`)}
                        showsHorizontalScrollIndicator={false}
                        renderItem={_renderVendors}
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
                    ) :
                        item?.slug == 'trending_vendors' ? (
                            <RenderRecommendedProducts item={item} />
                        ) :
                            item?.slug == 'vendors' &&
                                getBundleId() !== appIds?.greenhippo ? (
                                <VendorsView item={item} />
                            ) : item?.slug == 'nav_categories' ? (
                                // Skip categories here as they're handled in sticky header
                                <React.Fragment />
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

    // Sticky Search Bar Animation
    const stickySearchStyle = useAnimatedStyle(() => {
        const visible = appData?.profile?.preferences?.vendorMode?.length == 1 ?
            scrollY.value > 46 :
            scrollY.value > 102; // threshold

        return {
            display: visible ? 'flex' : 'none',
        };
    });

    // Sticky Category Animation
    const stickyCategoryStyle = useAnimatedStyle(() => {
        const visible =
            appData?.profile?.preferences?.vendorMode?.length == 1 ?
                scrollY.value > 44 :
                scrollY.value > 104; // threshold

        return {
            display: visible ? 'flex' : 'none',
        };
    });

    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            isLoading={isRefreshing}
            isSafeArea={false}>
            <LinearGradient
                colors={[isDarkMode ? MyDarkTheme.colors.background : colors.white, isDarkMode ? MyDarkTheme.colors.background : colors.white]}
                // colors={[colors.white, colors.white]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                locations={[0, 1]}
                style={{
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: moderateScale(140),
                }}
            />
            {/* Sticky Search Bar - Absolute positioned, shows when needed */}
            <Animated.View
                style={[
                    stickySearchStyle,
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 25,
                        paddingHorizontal: moderateScale(16),
                        paddingTop: moderateScale(12) + insets.top,
                        paddingBottom: moderateScale(6),
                        backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white,
                    }
                ]}
                pointerEvents={scrollY.value > 100 ? 'auto' : 'none'}>
                <SafeAreaView>
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
                            paddingVertical: moderateScale(6),
                            marginVertical: moderateScale(4),
                            shadowColor: colors.black,
                            borderWidth: moderateScale(1),
                            borderColor: colors.borderColorB,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3.84,
                            elevation: 2,
                        }}>
                        <Image
                            source={imagePath.search1}
                            style={{
                                width: moderateScale(20),
                                height: moderateScale(20),
                                tintColor: colors.redNew,
                                marginRight: moderateScale(12),
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                flex: 1,
                                color: colors.textGreyLight,
                                fontSize: moderateScale(16),
                                fontFamily: fontFamily?.regular,
                            }}>
                            {categoryData?.length > 0
                                ? `Search '${categoryData[currentCategoryIndex]?.name || 'food'}'`
                                : 'Search food'}
                        </Text>
                        {/* Vertical Separator */}
                        <View
                            style={{
                                width: 1,
                                height: moderateScale(20),
                                backgroundColor: colors.blackOpacity20,
                                marginHorizontal: moderateScale(12),
                            }}
                        />

                        {/* Red Microphone Icon */}
                        <TouchableOpacity
                            onPress={_onVoiceListen}
                            disabled={true}
                            style={{
                                padding: moderateScale(4),
                            }}>
                            <Image
                                source={imagePath.icVoice}
                                style={{
                                    width: moderateScale(20),
                                    height: moderateScale(20),
                                    tintColor: colors.redNew,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </SafeAreaView>
            </Animated.View>


            {/* Sticky Category Section - Absolute positioned, shows when needed */}
            <Animated.View
                style={[
                    stickyCategoryStyle,
                    {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white,
                        paddingTop: moderateScale(32) + insets.top,
                        paddingBottom: moderateScale(6),
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3.84,
                        elevation: 3,
                        marginTop: moderateScaleVertical(6),
                    }
                ]}
                pointerEvents={scrollY.value > 180 ? 'auto' : 'none'}>
                {(() => {
                    const categoriesData = appMainData?.homePageLabels?.find(
                        item => item?.slug === 'nav_categories'
                    );

                    return !isEmpty(categoriesData?.data) ? (
                        <View style={{ marginTop: moderateScale(28) }}>
                            <Animated.FlatList
                                horizontal
                                data={categoriesData.data}
                                scrollEnabled={true}
                                keyExtractor={(item, index) => String(item?.id + `${index}`)}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View style={{ marginRight: moderateScale(8) }}>
                                        <CategoryTemplate.HomeCategoryCard_3_5_7
                                            data={item}
                                            onPress={() => onPressCategory(item)}
                                        />
                                    </View>
                                )}
                                contentContainerStyle={{
                                    paddingHorizontal: moderateScale(16),
                                }}
                            />
                        </View>
                    ) : null;
                })()}
            </Animated.View>
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
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    // paddingTop: insets.top, // Account for location header,
                }}>

                {/* Search Bar Section - Normal flow */}
                <View style={{paddingHorizontal: moderateScale(16),}}>
                    {/* Location Header - Fixed at top, animates out */}
                    <View
                        style={[
                            {
                                flex: 1,
                                paddingTop:
                                    Platform.OS === 'android' && Platform.constants.Version < 35
                                        ? StatusBar.currentHeight / 3
                                        : 0 + insets.top,
                                paddingBottom: moderateScale(12),
                            },
                        ]}>
                        {/* Vendor Mode Header - At the very top */}
                        <VendorModeHeader
                            selectedToggle={selcetedToggle}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                                                tintColor: isDarkMode ? colors.white : colors.black,
                                                marginRight: moderateScale(10),
                                            }}
                                            source={imagePath.location1}
                                            resizeMode="contain"
                                        />
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                color: isDarkMode ? colors.white : colors.black,
                                                fontFamily: fontFamily?.bold,
                                                fontSize: textScale(16),
                                            }}>
                                            {location?.type === 3
                                                ? location?.type_name || strings.UNKNOWN
                                                : location?.type === 2
                                                    ? strings.WORK
                                                    : strings.HOME}
                                        </Text>
                                        <Image
                                            tintColor={isDarkMode ? colors.white : colors.black}
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
                                            color: isDarkMode ? colors.white : colors.blackOpacity43,
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
                                            fontSize: moderateScale(16),
                                            fontFamily: fontFamily?.bold,
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                        }}>
                                        {!!userData?.name ? userData?.name?.charAt(0) : 'G'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
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
                            paddingVertical: moderateScale(6),
                            shadowColor: colors.black,
                            borderWidth: moderateScale(1),
                            borderColor: colors.borderColorB,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 3.84,
                            elevation: 2,
                        }}>
                        <Image
                            source={imagePath.search1}
                            style={{
                                width: moderateScale(20),
                                height: moderateScale(20),
                                tintColor: colors.redNew,
                                marginRight: moderateScale(12),
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                flex: 1,
                                color: colors.textGreyLight,
                                fontSize: moderateScale(16),
                                fontFamily: fontFamily?.regular,
                            }}>
                            {categoryData?.length > 0
                                ? `Search '${categoryData[currentCategoryIndex]?.name || 'food'}'`
                                : 'Search food'}
                        </Text>
                        {/* Vertical Separator */}
                        <View
                            style={{
                                width: 1,
                                height: moderateScale(20),
                                backgroundColor: colors.blackOpacity20,
                                marginHorizontal: moderateScale(12),
                            }}
                        />

                        {/* Red Microphone Icon */}
                        <TouchableOpacity
                            onPress={_onVoiceListen}
                            disabled={true}
                            style={{
                                padding: moderateScale(4),
                            }}>
                            <Image
                                source={imagePath.icVoice}
                                style={{
                                    width: moderateScale(20),
                                    height: moderateScale(20),
                                    tintColor: colors.redNew,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                {/* Category Section - Normal flow */}
                <View style={{
                    backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white,
                    marginTop: moderateScaleVertical(6),
                }}>
                    {(() => {
                        const categoriesData = appMainData?.homePageLabels?.find(
                            item => item?.slug === 'nav_categories'
                        );
                        return !isEmpty(categoriesData?.data) ? (
                            <Animated.FlatList
                                horizontal
                                data={categoriesData.data}
                                scrollEnabled={true}
                                keyExtractor={(item, index) => String(item?.id + `${index}`)}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View style={{ marginRight: moderateScale(8) }}>
                                        <CategoryTemplate.HomeCategoryCard_3_5_7
                                            data={item}
                                            onPress={() => onPressCategory(item)}
                                        />
                                    </View>
                                )}
                                contentContainerStyle={{
                                    paddingHorizontal: moderateScale(16),
                                }}
                            />
                        ) : null;
                    })()}
                    <View style={{ height: 1, backgroundColor: colors.greyNew, marginTop: moderateScaleVertical(12) }} />
                </View>

                {/* Main Content - Dynamic sections based on data */}
                <View style={{ backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white }}>
                    {!isEmpty(dataProvider) &&
                        dataProvider.map((item, index) => {
                            // Skip categories and banners as they're handled separately
                            if (item?.slug === 'nav_categories') {
                                return null;
                            }
                            return renderHomePageItems({ item, index });
                        })
                    }
                </View>

                {/* Bottom spacing */}
                <View style={{ height: moderateScale(100) }} />
            </Animated.ScrollView>
        </WrapperContainer >
    );
}

export default React.memo(FoodHomePage)