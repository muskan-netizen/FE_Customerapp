import { isEmpty } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import VendorModeHeader from '../../../Components/VendorModeHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import BottomSlideModal from '../../../Components/BottomSlideModal';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
    height,
    moderateScale,
    textScale,
    width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { getImageUrl } from '../../../utils/helperFunctions';
import { getColorSchema } from '../../../utils/utils';
import { getImageUrlNew } from '../../../utils/commonFunction';
import stylesFunc from './styles';

const EcommerceHomePage = ({
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
    console.log(cartItemCount,'cartItemCount')
    const insets = useSafeAreaInsets();

    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const styles = stylesFunc({ fontFamily, themeColors, isDarkMode });

    const [selectedTab, setSelectedTab] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [categoryData, setCategoryData] = useState([]);
    const [vendorsData, setVendorsData] = useState([]);
    const [bannerData, setBannerData] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isShowSort, setIsShowSort] = useState(false);
    const [selectedSortFilter, setSelectedSortFilter] = useState(null);

    const sortOptions = [
        { id: 'relevance', label: 'Relevance' },
        { id: 'low_to_high', label: 'Prices (Lowest First)' },
        { id: 'newly_added', label: "What’s New" },
        { id: 'high_to_low', label: 'Price (Highest First)' },
    ];

    const RenderSortView = () => {
        return (
            <View>
                <View style={styles.sortHeaderContainer}>
                    <View style={styles.sortHeaderLeft}>
                        <Image source={imagePath.sort} style={styles.sortIcon} resizeMode="contain" />
                        <Text style={styles.sortTitle}>{strings.SORT_BY}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setIsShowSort(false)} style={styles.sortCloseBtn}>
                        <Image source={imagePath.greyCrossSmall} tintColor={colors.black} style={styles.sortCloseTxt} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.divider} />

                {sortOptions.map((opt) => {
                    return (
                        <TouchableOpacity key={opt.id} onPress={() => { setSelectedSortFilter(opt); setIsShowSort(false); }}
                            style={styles.sortOptionRow}>
                            <Text style={styles.sortOptionText}>{opt.label}</Text>
                            <Image source={imagePath.arrow_forward} style={styles.sortChevron} resizeMode="contain" />
                        </TouchableOpacity>
                    )
                })}
            </View>
        );
    };
    // Extract dynamic data from appMainData
    useEffect(() => {
        // Get category data
        const categoryDataHome =
            appMainData?.homePageLabels?.filter(
                item => item?.slug === 'nav_categories',
            ) || [];
        setCategoryData(categoryDataHome[0]?.data || []);

        // Get vendors data
        const vendorsDataHome =
            appMainData?.homePageLabels?.filter(
                item => item?.slug === 'vendors',
            ) || [];
        setVendorsData(vendorsDataHome[0]?.data || []);

        // Get banner data
        const bannerDataHome =
            appMainData?.homePageLabels?.filter(
                item => item?.slug === 'banner',
            ) || [];
        setBannerData(
            bannerDataHome[0]?.banner_images ||
            appMainData?.mobile_banners ||
            appData?.mobile_banners ||
            []
        );
    }, [appMainData, appData]);

    // Category tabs - use dynamic data or fallback to static
    const categoryTabs = useMemo(() => {
        if (!isEmpty(categoryData)) {
            return ['All', ...categoryData.slice(0, 3).map(cat => cat?.name)];
        }
        return [];
    }, [categoryData]);

    // Stores data - use dynamic data or fallback to static
    const storesData = useMemo(() => {
        if (!isEmpty(vendorsData)) {
            return vendorsData;
        }
        return [];
    }, [vendorsData]);

    // Animation values
    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: event => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Sticky Search Bar Animation
    const stickySearchStyle = useAnimatedStyle(() => {
        const shouldShow = appData?.profile?.preferences?.vendorMode?.length == 1 ?
            scrollY.value > 44 :
            scrollY.value > 110;

        return {
            display: shouldShow ? 'flex' : 'none',
        };
    });

    // Sticky Category Animation
    const stickyCategoryStyle = useAnimatedStyle(() => {
        const visible =
            appData?.profile?.preferences?.vendorMode?.length == 1 ?
                scrollY.value > 44 :
                scrollY.value > 110; // threshold

        return {
            display: visible ? 'flex' : 'none',
        };
    });

    // Render Banner
    const renderBanner = ({ item, index }) => {
        const imageUrl = getImageUrl(
            item?.image?.image_fit,
            item?.image?.image_path,
            '800/600'
        );

        return (
            <View
                key={String(item?.id || index)}
                style={{
                    marginHorizontal: moderateScale(16),
                    marginVertical: moderateScale(10),
                }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => bannerPress(item)}>
                    <FastImage
                        source={{
                            uri: imageUrl,
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        style={{
                            height: moderateScale(156),
                            width: width - moderateScale(32),
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

    // Render Store Card (Grid)
    const renderStoreCardGrid = ({ item, index }) => {
        let imageUrlNew = getImageUrlNew({
            url: item?.banner || item?.path || item?.logo || null,
            image_const_arr: appMainData.image_prefix,
            type: 'image_fill',
            height: ((height * 2) / 2).toFixed(0),
            width: width.toFixed(0),
        });

        return (
            <TouchableOpacity
                onPress={() => onPressVendor(item)}
                style={{
                    width: (width - moderateScale(48)) / 2,
                    marginBottom: moderateScale(16),
                    marginRight: index % 2 === 0 ? moderateScale(8) : 0,
                    marginLeft: index % 2 !== 0 ? moderateScale(8) : 0,
                }}>
                <View
                    style={{
                        backgroundColor: isDarkMode ? colors.blackOpacity20 : colors.white,
                        overflow: 'hidden',
                    }}>
                    <FastImage
                        source={{
                            uri: imageUrlNew,
                            priority: FastImage.priority.high,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        style={{
                            width: '100%',
                            height: moderateScale(180),
                            backgroundColor: colors.greyColor,
                            borderRadius: moderateScale(12),
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: moderateScale(12),
                            right: moderateScale(12),
                            backgroundColor: colors.white,
                            borderRadius: moderateScale(20),
                            padding: moderateScale(4),
                        }}>
                        <Image
                            source={imagePath.heart2}
                            style={{
                                width: moderateScale(18),
                                height: moderateScale(18),
                                tintColor: colors.black,
                            }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View style={{ marginTop: moderateScale(12) }}>
                        <Text
                            style={{
                                fontFamily: fontFamily?.semiBold,
                                fontSize: textScale(14),
                                color: isDarkMode ? colors.white : colors.black,
                            }}>
                            {item?.name || item?.title}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    // Render Store Card (List)
    const renderStoreCardList = ({ item, index }) => {
        let imageUrlNew = getImageUrlNew({
            url: item?.banner || item?.path || item?.logo || null,
            image_const_arr: appMainData.image_prefix,
            type: 'image_fill',
            height: ((height * 2) / 2).toFixed(0),
            width: width.toFixed(0),
        });

        return (
            <TouchableOpacity
                onPress={() => onPressVendor(item)}
                style={{
                    backgroundColor: isDarkMode ? colors.blackOpacity20 : colors.white,
                    borderRadius: moderateScale(12),
                    marginBottom: moderateScale(12),
                    padding: moderateScale(12),
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.borderColorD,
                }}>
                <FastImage
                    source={{
                        uri: imageUrlNew,
                        priority: FastImage.priority.high,
                        cache: FastImage.cacheControl.immutable,
                    }}
                    style={{
                        width: moderateScale(74),
                        height: moderateScale(74),
                        borderRadius: moderateScale(10),
                        backgroundColor: colors.greyColor,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <Text
                    style={{
                        flex: 1,
                        marginLeft: moderateScale(16),
                        fontFamily: fontFamily?.semiBold,
                        fontSize: textScale(14),
                        color: isDarkMode ? colors.white : colors.black,
                    }}>
                    {item?.name || item?.title}
                </Text>
                <TouchableOpacity
                    style={{
                        padding: moderateScale(8),
                    }}>
                    <Image
                        source={imagePath.heart2}
                        style={{
                            width: moderateScale(20),
                            height: moderateScale(20),
                            tintColor: colors.black,
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            isLoading={isRefreshing}
            isSafeArea={false}
        >
            <StatusBar
                backgroundColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />

            {/* Sticky Search Bar - Absolute positioned, shows when scrolling */}
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
                        paddingBottom: moderateScale(12),
                        backgroundColor: themeColors?.primary_color,
                    }
                ]}
                pointerEvents={scrollY.value > 150 ? 'auto' : 'none'}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                    }
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.whiteOpacity22,
                        borderRadius: moderateScale(24),
                        paddingHorizontal: moderateScale(16),
                        paddingVertical: moderateScale(12),
                    }}>
                    <Image
                        source={imagePath.search1}
                        style={{
                            width: moderateScale(16),
                            height: moderateScale(16),
                            tintColor: colors.white,
                            marginRight: moderateScale(12),
                        }}
                        resizeMode="contain"
                    />
                    <Text
                        style={{
                            flex: 1,
                            color: colors.white,
                            fontSize: textScale(12),
                            fontFamily: fontFamily?.regular,
                        }}>
                        {strings.SEARCH_HERE}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Sticky Category Section - Absolute positioned, shows when scrolling */}
            <Animated.View
                style={[
                    stickyCategoryStyle,
                    {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        backgroundColor: themeColors?.primary_color,
                        paddingTop: moderateScale(66) + insets.top,
                        shadowColor: colors.black,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3.84,
                        elevation: 3,
                    }
                ]}
                pointerEvents={scrollY.value > 200 ? 'auto' : 'none'}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: moderateScale(16),
                    }}>
                    {categoryTabs.map((tab, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedTab(tab)}
                            style={{
                                paddingHorizontal: moderateScale(24),
                                paddingVertical: moderateScale(6),
                                borderTopLeftRadius: moderateScale(4),
                                borderTopRightRadius: moderateScale(4),
                                backgroundColor:
                                    selectedTab === tab
                                        ? colors.white
                                        : 'transparent',
                                marginRight: moderateScale(12),
                            }}>
                            <Text
                                style={{
                                    fontFamily: fontFamily?.medium,
                                    fontSize: textScale(12),
                                    color:
                                        selectedTab === tab
                                            ? colors.black
                                            : colors.white,
                                }}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
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
                    paddingBottom: moderateScale(100),
                }}>
                {/* Header Section */}
                <View
                    style={{
                        paddingTop:
                            Platform.OS === 'android'
                                ? StatusBar.currentHeight
                                : insets.top,
                        paddingHorizontal: moderateScale(16),
                        paddingBottom: moderateScale(12),
                        backgroundColor: themeColors?.primary_color,
                    }}>
                    {/* Vendor Mode Header */}
                    <VendorModeHeader
                        selectedToggle={selcetedToggle}
                    />

                    {/* Location and Icons Row */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: moderateScale(16),
                        }}>
                        {/* Location Section */}
                        <TouchableOpacity
                            activeOpacity={0.8}
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
                            <Image
                                source={imagePath.location2}
                                style={{
                                    width: moderateScale(24),
                                    height: moderateScale(24),
                                    tintColor: colors.white,
                                    marginRight: moderateScale(4),
                                }}
                                resizeMode="contain"
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        color: colors.white,
                                        fontFamily: fontFamily?.regular,
                                        fontSize: textScale(10),
                                    }}>
                                    {strings.YOUR_LOCATION}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            color: colors.white,
                                            fontFamily: fontFamily?.bold,
                                            fontSize: textScale(12),
                                        }}>
                                        {location?.address}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Icons Section */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {userData?.auth_token && <TouchableOpacity
                                onPress={() => navigation.navigate(navigationStrings.NOTIFICATION)}
                                style={{ padding: moderateScale(8) }}>
                                <Image
                                    source={imagePath.atlantic_notification}
                                    style={{
                                        width: moderateScale(22),
                                        height: moderateScale(22),
                                        tintColor: colors.white,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>}
                            {userData?.auth_token && <TouchableOpacity
                                onPress={() => navigation.navigate(navigationStrings.WISHLIST)}
                                style={{ marginLeft: moderateScale(4) }}>
                                <Image
                                    source={imagePath.heart2}
                                    style={{
                                        width: moderateScale(22),
                                        height: moderateScale(22),
                                        tintColor: colors.white,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>}
                            <TouchableOpacity
                                onPress={() => navigation.navigate(navigationStrings.CART)}
                                style={{ marginLeft: moderateScale(14) }}>
                                <Image
                                    source={imagePath.cartIcon}
                                    style={{
                                        width: moderateScale(22),
                                        height: moderateScale(22),
                                        tintColor: colors.white,
                                    }}
                                    resizeMode="contain"
                                />
                                {cartItemCount?.data?.item_count > 0 && (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: moderateScale(-6),
                                            right: moderateScale(-6),
                                            backgroundColor: colors.redNew,
                                            borderRadius: moderateScale(10),
                                            minWidth: moderateScale(16),
                                            height: moderateScale(16),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingHorizontal: moderateScale(4),
                                        }}>
                                        <Text
                                            style={{
                                                color: colors.white,
                                                fontSize: textScale(10),
                                                fontFamily: fontFamily?.bold,
                                            }}>
                                            {cartItemCount?.data?.item_count}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                        }
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.whiteOpacity22,
                            borderRadius: moderateScale(24),
                            paddingHorizontal: moderateScale(16),
                            paddingVertical: moderateScale(12),
                        }}>
                        <Image
                            source={imagePath.search1}
                            style={{
                                width: moderateScale(16),
                                height: moderateScale(16),
                                tintColor: colors.white,
                                marginRight: moderateScale(12),
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                flex: 1,
                                color: colors.white,
                                fontSize: textScale(12),
                                fontFamily: fontFamily?.regular,
                            }}>
                            {strings.SEARCH_HERE}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Category Tabs */}
                <View style={{ backgroundColor: themeColors?.primary_color }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: moderateScale(16),
                        }}>
                        {categoryTabs.map((tab, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedTab(tab)}
                                style={{
                                    paddingHorizontal: moderateScale(24),
                                    paddingVertical: moderateScale(6),
                                    borderTopLeftRadius: moderateScale(4),
                                    borderTopRightRadius: moderateScale(4),
                                    backgroundColor:
                                        selectedTab === tab
                                            ? colors.white
                                            : 'transparent',
                                    marginRight: moderateScale(12),
                                }}>
                                <Text
                                    style={{
                                        fontFamily: fontFamily?.medium,
                                        fontSize: textScale(12),
                                        color:
                                            selectedTab === tab
                                                ? colors.black
                                                : colors.white,
                                    }}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Banner Carousel */}
                <View style={{ marginTop: moderateScale(8) }}>
                    <Carousel
                        autoplay={true}
                        loop={true}
                        autoplayInterval={3000}
                        data={bannerData}
                        renderItem={renderBanner}
                        sliderWidth={width}
                        itemWidth={width}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        activeSlideAlignment="center"
                        onSnapToItem={(index) => setActiveSlide(index)}
                    />
                    <Pagination
                        dotsLength={bannerData.length}
                        activeDotIndex={activeSlide}
                        dotStyle={{
                            width: moderateScale(18),
                            height: moderateScale(8),
                            borderRadius: moderateScale(4),
                            backgroundColor: themeColors?.primary_color
                        }}
                        containerStyle={{
                            paddingVertical: 0,
                            width: '12%',
                            alignSelf: 'center',
                        }}
                        inactiveDotStyle={{
                            backgroundColor: colors.blackOpacity43,
                            width: moderateScale(8),
                            height: moderateScale(8),
                            borderRadius: moderateScale(4),
                        }}
                    />
                </View>

                {/* Filter Section */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: moderateScale(16),
                        marginTop: moderateScale(16),
                    }}>
                    <TouchableOpacity
                        onPress={() => setIsShowSort(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: moderateScale(12),
                            paddingVertical: moderateScale(8),
                            borderRadius: moderateScale(8),
                            borderWidth: 1,
                            borderColor: colors.blackOpacity20,
                            marginRight: moderateScale(12),
                        }}>
                        <Image
                            source={imagePath.sort}
                            style={{
                                width: moderateScale(16),
                                height: moderateScale(16),
                                marginRight: moderateScale(6),
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                fontFamily: fontFamily?.medium,
                                fontSize: textScale(12),
                                color: isDarkMode ? colors.white : colors.black,
                            }}>
                            {strings.SORT_BY}
                        </Text>
                        <Image
                            source={imagePath.dropDownSingle}
                            style={{
                                width: moderateScale(16),
                                height: moderateScale(16),
                                marginLeft: moderateScale(6),
                                tintColor: isDarkMode ? colors.white : colors.black,
                            }}
                        />
                    </TouchableOpacity>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{ flex: 1 }}>
                        {categoryData.map((item, index) => <TouchableOpacity
                            onPress={() => onPressCategory(item)}
                            style={{
                                paddingHorizontal: moderateScale(12),
                                paddingVertical: moderateScale(8),
                                borderRadius: moderateScale(8),
                                borderWidth: 1,
                                borderColor: colors.blackOpacity20,
                                marginRight: moderateScale(12),
                            }}>
                            <Text
                                style={{
                                    fontFamily: fontFamily?.medium,
                                    fontSize: textScale(12),
                                    color: isDarkMode ? colors.white : colors.black,
                                }}>
                                {item?.name}
                            </Text>
                        </TouchableOpacity>)}
                    </ScrollView>
                </View>

                {/* Stores Section */}
                <View
                    style={{
                        paddingHorizontal: moderateScale(16),
                        marginTop: moderateScale(12),
                    }}>
                    {/* Stores Header */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: moderateScale(12),
                        }}>
                        <Text
                            style={{
                                fontFamily: fontFamily?.bold,
                                fontSize: textScale(16),
                                color: isDarkMode ? colors.white : colors.black,
                            }}>
                            {strings.STORES}{' '}
                        </Text>
                        {/* View Toggle */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                style={{
                                    color: isDarkMode ? colors.white : colors.black,
                                    fontFamily: fontFamily?.regular,
                                    fontSize: textScale(16),
                                }}>
                                ({storesData?.length || 0})
                            </Text>
                            {viewMode == 'grid' ? (<TouchableOpacity
                                onPress={() => viewMode == 'grid' ? setViewMode('list') : setViewMode('grid')}
                                style={{
                                    padding: moderateScale(6),
                                }}>
                                <Image
                                    source={imagePath.gridViewIcon}
                                    style={{
                                        width: moderateScale(20),
                                        height: moderateScale(20),
                                        tintColor:
                                            viewMode === 'grid'
                                                ? colors.black
                                                : colors.blackOpacity43,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>) : (
                                <TouchableOpacity
                                    onPress={() => viewMode == 'list' ? setViewMode('grid') : setViewMode('list')}
                                    style={{ padding: moderateScale(6) }}>
                                    <Image
                                        source={imagePath.listViewIcon}
                                        style={{
                                            width: moderateScale(20),
                                            height: moderateScale(20),
                                            tintColor:
                                                viewMode === 'list'
                                                    ? colors.black
                                                    : colors.blackOpacity43,
                                        }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>)}
                        </View>
                    </View>

                    {/* Stores Grid/List */}
                    {viewMode === 'grid' ? (
                        <FlatList
                            key="grid-view"
                            data={storesData}
                            renderItem={renderStoreCardGrid}
                            keyExtractor={item => item.id.toString()}
                            numColumns={2}
                            scrollEnabled={false}
                            columnWrapperStyle={{
                                justifyContent: 'flex-start',
                            }}
                        />
                    ) : (
                        <FlatList
                            key="list-view"
                            data={storesData}
                            renderItem={renderStoreCardList}
                            keyExtractor={item => item.id.toString()}
                            scrollEnabled={false}
                        />
                    )}
                </View>
            </Animated.ScrollView>
            {!!isShowSort && (
                <BottomSlideModal
                    isModalVisible={isShowSort}
                    onBackdropPress={() => setIsShowSort(false)}
                    mainContainView={RenderSortView}
                    mainContainerStyle={styles.sortModalMain}
                    innerViewContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                />
            )}
        </WrapperContainer>
    );
};

export default React.memo(EcommerceHomePage);

