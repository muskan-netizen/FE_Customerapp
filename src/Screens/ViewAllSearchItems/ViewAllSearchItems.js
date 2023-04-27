import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import Header3 from '../../Components/Header3';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import SearchLoader from '../../Components/Loaders/SearchLoader';
import MarketCard3 from '../../Components/MarketCard3';
import NoDataFound from '../../Components/NoDataFound';
import SearchBar2 from '../../Components/SearchBar2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
    moderateScale,
    moderateScaleVertical,
    width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import FooterLoader from '../../Components/FooterLoader';

import { enableFreeze } from "react-native-screens";
import { UIActivityIndicator } from 'react-native-indicators';
import { getCurrentLocation } from '../../utils/helperFunctions';
import BrandCard3 from '../../Components/BrandCard3';
import { Text } from 'react-native';
import staticStrings from '../../constants/staticStrings';
import { shortCodes } from '../../utils/constants/DynamicAppKeys';
import ProductsComp3 from '../../Components/ProductsComp3';
enableFreeze(true);

export default function ViewAllSearchItems({ route, navigation }) {
    const { appData, themeColors, currencies, languages, appStyle } = useSelector((state) => state.initBoot || {});
    const userData = useSelector((state) => state?.auth?.userData || {});

    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const { appMainData, dineInType, location } = useSelector((state) => state?.home || {});
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const fontFamily = appStyle?.fontSizeData;
    const commonStyles = commonStylesFun({ fontFamily });

    const paramData = route?.params

    const [state, setState] = useState({
        isLoading: true,
        pageNo: 1,
        limit: 5,
        isRefreshing: false,
        data: [],
        totalProduct: 0,
        loadMore: false,
        openVendor: 1,
        closeVendor: 0,
        bestSeller: 0,
        nearMe: 0,
        userCurrentLatitude: null,
        userCurrentLongitude: null,

    });

    const {
        isLoading,
        pageNo,
        isRefreshing,
        limit,
        data,
        totalProduct,
        loadMore,
        openVendor,
        closeVendor,
        bestSeller,
        nearMe,
        userCurrentLatitude,
        userCurrentLongitude
    } = state;

    //update state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
        getCurrentLocation()
            .then((res) => {
                updateState({
                    userCurrentLatitude: res?.latitude,
                    userCurrentLongitude: res?.longitude,
                });
            })
            .catch((error) => {
                console.log(error, ' error in response for current location');
            });
    }, [])


    useEffect(() => {
        apiHit(pageNo);
    }, []);

    //Home data
    const apiHit = (pageNo) => {
        let latlongObj = {};
        if (!!appData?.profile?.preferences?.is_hyperlocal) {
            latlongObj = {
                latitude: location?.latitude,
                longitude: location?.longitude,
            };
        }
        let data = {};
        data['keyword'] = 'testing';
        data['type'] = dineInType;
        data['limit'] = 10;
        data['latitude'] = !!location?.latitude
            ? location?.latitude
            : userCurrentLatitude;
        data['longitude'] = !!location?.longitude
            ? location?.longitude
            : userCurrentLongitude;
        data['page'] = 1;
        data['view_type'] = paramData?.view_type || 'category'


        let headers = {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
        };
        console.log(data, 'sending data headers', headers);


        actions.viewAllSearchItemV2('', data, headers)
            .then((res) => {
                console.log('Home data++++++', res);
                // if (totalProduct == 0) {
                //     updateState({ totalProduct: res?.data?.total });
                // }
                updateState({
                    data: pageNo == 1 ? res?.data[0]?.result : [...data, ...res?.data[0]?.result],
                    isLoading: false,
                    loadMore: false,
                });
            })
            .catch((error) => {
                console.log('error raised', error);
                updateState({
                    isLoading: false,
                    loadMore: false,
                });
            });
    };
    console.log('data length', data.length);

    //Naviagtion to specific screen
    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    const _checkRedirectScreen = (item) => {
        {
            item?.is_show_category
                ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
                    item,
                    rootProducts: true,
                    categoryData: data,
                })()
                : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                    id: item.id,
                    vendor: true,
                    name: item.name,
                    isVendorList: true,
                    fetchOffers: true,
                })();
        }
    };

    /**********/


    const onPressCategory = useCallback((item) => {
        if (item?.redirect_to == staticStrings.P2P) {
            moveToNewScreen(navigationStrings.P2P_PRODUCTS, item)();
            return;
        }
        if (item?.redirect_to == staticStrings.FOOD_TEMPLATE) {
            moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();

            return;
        }
        if (item.redirect_to == staticStrings.VENDOR) {

            moveToNewScreen(navigationStrings.VENDOR, item)();
        } else if (
            item.redirect_to == staticStrings.PRODUCT ||
            item.redirect_to == staticStrings.CATEGORY ||
            item.redirect_to == staticStrings.ONDEMANDSERVICE ||
            item?.redirect_to == staticStrings.LAUNDRY ||
            item?.redirect_to == staticStrings.APPOINTMENT ||
            item?.redirect_to == staticStrings.RENTAL
        ) {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                fetchOffers: true,
                id: item.id,
                vendor:
                    item.redirect_to == staticStrings.ONDEMANDSERVICE ||
                        item.redirect_to == staticStrings.PRODUCT ||
                        item?.redirect_to == staticStrings.LAUNDRY ||
                        item?.redirect_to == staticStrings.APPOINTMENT ||
                        item?.redirect_to == staticStrings.RENTAL
                        ? false
                        : true,
                name: item.name,
                isVendorList: false,
            })();
        } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
            if (!!userData?.auth_token) {
                if (shortCodes.arenagrub == appData?.profile?.code) {
                    //   openUber();
                } else {
                    item['pickup_taxi'] = true;
                    moveToNewScreen(navigationStrings.ADDADDRESS, item)();
                }
            } else {
                actions.setAppSessionData('on_login');
            }
        } else if (item.redirect_to == staticStrings.DISPATCHER) {
            // moveToNewScreen(navigationStrings.DELIVERY, item)();
        } else if (item.redirect_to == staticStrings.CELEBRITY) {
            moveToNewScreen(navigationStrings.CELEBRITY)();
        } else if (item.redirect_to == staticStrings.BRAND) {
            moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();
        } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
            // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
            moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
        } else if (!item.is_show_category || item.is_show_category) {
            item?.is_show_category
                ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
                    item,
                    rootProducts: true,
                    // categoryData: data,
                })()
                : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                    id: item?.id,
                    vendor: true,
                    name: item?.name,
                    isVendorList: true,
                    fetchOffers: true,
                })();
        }
    }, [shortCodes, appData])




    const renderViewType = (item) => {
        switch (paramData?.view_type) {
            case 'category':
                return (<BrandCard3
                    data={item}
                    onPress={() => onPressCategory(item)}
                />)
            case 'product':
                return (<ProductsComp3
                    item={item}
                    onPress={() =>
                        navigation.push(navigationStrings.PRODUCTDETAIL, { data: item })
                    }
                />)
            case 'vendor':
                return (<MarketCard3 onPress={() => _checkRedirectScreen(item)} data={item} />)
            case 'brand':
                return (<BrandCard3
                    data={item}
                    onPress={() => onPressCategory(item)}
                />)

            default:
                break;
        }
    }

    const _renderItem = ({ item, index }) => {
        console.log("my item", item)
        return (
            <Animatable.View
                style={{ marginHorizontal: moderateScale(15) }}
            // animation={'fadeInUp'}
            // delay={index * 60}
            >
                {renderViewType(item)}
           

            </Animatable.View>
        );
    };

    if (isLoading) {
        return (
            <WrapperContainer
                bgColor={
                    isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
                }
                statusBarColor={colors.backgroundGrey}>
                <Header3
                    leftIcon={imagePath.icBackb}
                    centerTitle={data?.name}
                    rightIcon={imagePath.search}
                    showAddress={false}
                // location={location}
                // onPressRight={() =>
                //   navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
                // }
                />
                <View style={{ alignItems: 'center' }}>
                    <SearchLoader viewStyles={{ marginVertical: moderateScale(17) }} />
                    <HeaderLoader
                        viewStyles={{ marginTop: 5 }}
                        widthLeft={width - moderateScaleVertical(40)}
                        rectWidthLeft={width - moderateScaleVertical(40)}
                        heightLeft={moderateScaleVertical(170)}
                        rectHeightLeft={moderateScaleVertical(170)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                    <HeaderLoader
                        viewStyles={{ marginTop: 15 }}
                        widthLeft={width - moderateScaleVertical(40)}
                        rectWidthLeft={width - moderateScaleVertical(40)}
                        heightLeft={moderateScaleVertical(170)}
                        rectHeightLeft={moderateScaleVertical(170)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                    <HeaderLoader
                        viewStyles={{ marginTop: 15 }}
                        widthLeft={width - moderateScaleVertical(40)}
                        rectWidthLeft={width - moderateScaleVertical(40)}
                        heightLeft={moderateScaleVertical(170)}
                        rectHeightLeft={moderateScaleVertical(170)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                    <HeaderLoader
                        viewStyles={{ marginTop: 15 }}
                        widthLeft={width - moderateScaleVertical(40)}
                        rectWidthLeft={width - moderateScaleVertical(40)}
                        heightLeft={moderateScaleVertical(170)}
                        rectHeightLeft={moderateScaleVertical(170)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                    <HeaderLoader
                        viewStyles={{ marginTop: 15 }}
                        widthLeft={width - moderateScaleVertical(40)}
                        rectWidthLeft={width - moderateScaleVertical(40)}
                        heightLeft={moderateScaleVertical(170)}
                        rectHeightLeft={moderateScaleVertical(170)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                </View>
            </WrapperContainer>
        );
    }

    const onEndReached = () => {
        if (totalProduct !== data.length) {
            updateState({ pageNo: pageNo + 1, loadMore: true });
            apiHit(pageNo + 1);
        } else {
            updateState({ loadMore: false });
        }
    };

    return (
        <WrapperContainer
            bgColor={
                isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
            }
            statusBarColor={colors.backgroundGrey}>

            <Header3
                leftIcon={imagePath.icBackb}
                showAddress={false}
                rightIcon={imagePath.search}


            />
            {/* <TouchableOpacity>
          <Image source={imagePath.filter} />
        </TouchableOpacity> */}

            <SearchBar2 navigation={navigation} />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={data}
                extraData={data}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                keyExtractor={(item, index) => String(index)}
                renderItem={_renderItem}
                onEndReachedThreshold={0.5}
                // onEndReached={onEndReached}
                initialNumToRender={6}
                ListEmptyComponent={
                    !isLoading && (
                        <View
                            style={{
                                flex: 1,
                                marginTop: moderateScaleVertical(width / 2),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <NoDataFound isLoading={isLoading} />
                        </View>
                    )
                }
                ListFooterComponent={!!loadMore ?
                    <View style={{ marginBottom: moderateScale(100) }}>

                        <UIActivityIndicator
                            color={themeColors.primary_color}
                            size={30}
                        />
                    </View>

                    : <View style={{ height: moderateScale(100) }} />}
            />
        </WrapperContainer>
    );
}
