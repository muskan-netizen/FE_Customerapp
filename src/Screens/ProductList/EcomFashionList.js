import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import WrapperContainer from '../../Components/WrapperContainer';
import BottomSlideModal from '../../Components/BottomSlideModal';
import FashionProductCard from '../../Components/FashionProductCard';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import { moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { getColorSchema } from '../../utils/utils';
import actions from '../../redux/actions';
import { showSuccess, showError } from '../../utils/helperFunctions';
import stylesFunc from './styles.ecomFashionList';
import Header from '../../Components/Header';
import navigationStrings from '../../navigation/navigationStrings';
import GradientCartView from '../../Components/GradientCartView';
import { tokenConverterPlusCurrencyNumberFormater } from '../../utils/commonFunction';

export default function EcomFashionList({ route, navigation }) {
    const { data } = route.params || {};
    const { appData, themeColors, appStyle, themeColor, themeToggle, currencies, languages } = useSelector(state => state?.initBoot);
    const userData = useSelector(state => state?.auth?.userData);
    const { location, dineInType, appMainData } = useSelector(state => state?.home || {});
    const isDarkMode = (themeToggle ? getColorSchema() : themeColor);
    const styles = stylesFunc({ themeColors, isDarkMode });
    const fontFamily = appStyle?.fontSizeData;
    const CartItems = useSelector(state => state?.cart?.cartItemCount);
    const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};

    const [state, setState] = useState({
        isLoading: true,
        products: [],
        pageNo: 1,
        lastPage: 1,
        loadMore: true,
        isShowSort: false,
        selectedSort: null,
        categoryDataHome: [],
    });

    const { isLoading, products, pageNo, lastPage, loadMore, isShowSort, selectedSort, categoryDataHome } = state;
    const updateState = data => setState(prev => ({ ...prev, ...data }));

    useEffect(() => {
        const categoryDataHome =
            appMainData?.homePageLabels?.filter(
                item => item?.slug === 'nav_categories',
            ) || []
        updateState({ categoryDataHome: categoryDataHome?.[0]?.data || [] });
    }, [appMainData?.homePageLabels]);

    const onPressCategory = (item) => { };

    const sortOptions = [
        { id: 'relevance', label: 'Relevance' },
        { id: 'low_to_high', label: 'Prices (Lowest First)' },
        { id: 'newly_added', label: "What’s New" },
        { id: 'high_to_low', label: 'Price (Highest First)' },
    ];

    const fetchPage = useCallback((page) => {
        const isVendorFlow = !!data?.vendor || !!data?.isVendorList;
        const orderType = selectedSort?.id === 'low_to_high' ? 3 : selectedSort?.id === 'high_to_low' ? 4 : selectedSort?.id === 'newly_added' ? 6 : 0;
        if (isVendorFlow) {
            const vendorId = !!data?.vendorData ? data?.vendorData.id : data?.id || data;
            // If sorting selected, use vendor filter API (POST). Otherwise, use vendor listing API (GET)
            if (orderType !== 0) {
                const body = {
                    variants: [],
                    options: [],
                    brands: [],
                    order_type: orderType,
                    range: `0;50000`,
                    vendor_id: vendorId,
                    page: page,
                    type: dineInType,
                };
                actions
                    .newVendorFilters(body, {
                        code: appData?.profile?.code,
                        currency: currencies?.primary_currency?.id,
                        language: languages?.primary_language?.id,
                    })
                    .then(res => {
                        const list = res?.data?.products?.data || [];
                        const last = res?.data?.products?.last_page || 1;
                        const current = res?.data?.products?.current_page || page;
                        updateState({
                            isLoading: false,
                            products: page === 1 ? list : [...products, ...list],
                            lastPage: last,
                            loadMore: current < last,
                        });
                    })
                    .catch(() => updateState({ isLoading: false, loadMore: false }));
                return;
            }

            const apiData = `/${vendorId}?page=${page}&type=${dineInType}&limit=20`;
            actions
                .getProductByVendorIdOptamizeV2(
                    apiData,
                    {},
                    {
                        code: appData?.profile?.code,
                        currency: currencies?.primary_currency?.id,
                        language: languages?.primary_language?.id,
                    },
                )
                .then(res => {
                    const list = res?.data?.products?.data || [];
                    const last = res?.data?.products?.last_page || 1;
                    const current = res?.data?.products?.current_page || page;
                    updateState({
                        isLoading: false,
                        products: page === 1 ? list : [...products, ...list],
                        lastPage: last,
                        loadMore: current < last,
                    });
                })
                .catch(() => updateState({ isLoading: false, loadMore: false }));
            return;
        }

        // Category flow (default)
        let apiUri = `/${data?.id || data}?page=${page}&type=${dineInType}&limit=20`;
        const body = {
            variants: [],
            options: [],
            brands: [],
            order_type: orderType,
            range: `0;50000`,
        };
        actions
            .getProductByCategoryFiltersOptamize(
                apiUri,
                body,
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                },
            )
            .then(res => {
                const list = res?.data?.data || res?.data?.listData?.data || [];
                const last = res?.data?.last_page || res?.data?.listData?.last_page || 1;
                const current = res?.data?.current_page || res?.data?.listData?.current_page || page;
                updateState({
                    isLoading: false,
                    products: page === 1 ? list : [...products, ...list],
                    lastPage: last,
                    loadMore: current < last,
                });
            })
            .catch(() => updateState({ isLoading: false, loadMore: false }));
    }, [data, dineInType, selectedSort, products]);

    useEffect(() => {
        updateState({ isLoading: true, pageNo: 1 });
        fetchPage(1);
    }, [selectedSort]);

    const onEndReached = () => {
        if (loadMore && pageNo < lastPage) {
            const next = pageNo + 1;
            updateState({ pageNo: next });
            fetchPage(next);
        }
    };

    const _onAddtoWishlist = (item) => {
        if (!!userData?.auth_token) {
            actions
                .updateProductWishListData(
                    `/${item.id}`,
                    {},
                    {
                        code: appData?.profile?.code,
                        currency: currencies?.primary_currency?.id,
                        language: languages?.primary_language?.id,
                    },
                )
                .then(res => {
                    let cloneArr = [...products];
                    const idx = cloneArr.findIndex(p => p?.id == item?.id);
                    if (idx > -1) {
                        cloneArr[idx].inwishlist = !item?.inwishlist;
                        updateState({ products: cloneArr });
                    }
                    showSuccess(res?.message || strings.UPDATED || 'Updated');
                })
                .catch(err => showError(err?.message));
        } else {
            // same behavior as ProductListEcom -> show unauthorized message
            // showError(strings.UNAUTHORIZED_MESSAGE);
            actions.setAppSessionData('on_login');
            navigation.navigate(navigationStrings.LOGIN);
        }
    };

    const renderItem = ({ item }) => (
        <FashionProductCard
            item={item}
            onPress={() => navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })}
            onToggleWishlist={_onAddtoWishlist}
            onAddToCart={() => navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })}
            inWishlist={!!item?.inwishlist}
            containerStyle={{ width: (width - moderateScale(48)) / 2 }}
        />
    );

    const RenderSortView = () => (
        <View>
            <View style={styles.sortHeaderContainer}>
                <View style={styles.sortHeaderLeft}>
                    <Image source={imagePath.sort} style={styles.sortIcon} resizeMode="contain" />
                    <Text style={styles.sortTitle}>{strings.SORT_BY}</Text>
                </View>
                <TouchableOpacity onPress={() => updateState({ isShowSort: false })} style={styles.sortCloseBtn}>
                    <Image source={imagePath.greyCrossSmall} tintColor={colors.black} style={styles.sortCloseTxt} resizeMode="contain" />
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            {sortOptions.map(opt => (
                <TouchableOpacity key={opt.id} style={styles.sortOptionRow} onPress={() => updateState({ selectedSort: opt, isShowSort: false })}>
                    <Text style={styles.sortOptionText}>{opt.label}</Text>
                    <Image source={imagePath.arrow_forward} style={styles.sortChevron} resizeMode="contain" />
                </TouchableOpacity>
            ))}
        </View>
    );

    const header = (
        <View style={styles.headerBar}>
            <Text style={styles.headerTitle}>{strings.PRODUCTS}</Text>
            <TouchableOpacity onPress={() => updateState({ isShowSort: true })} style={styles.sortChip}>
                <Image source={imagePath.sort} style={styles.sortChipIcon} resizeMode="contain" />
                <Text style={styles.sortChipTxt}>{strings.SORT_BY}</Text>
                <Image source={imagePath.dropDownSingle} style={styles.sortChipArrow} resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );

    const RenderFilterSection = () => (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: moderateScale(16),
                marginBottom: moderateScale(16),
            }}>
            <TouchableOpacity
                onPress={() => updateState({ isShowSort: true })}
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
            <FlatList
                data={categoryDataHome}
                horizontal
                keyExtractor={(it, idx) => String(it?.id || idx)}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
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
                    </TouchableOpacity>
                )}
                style={{ flex: 1 }}
            />
        </View>
    );

    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            isLoading={isLoading}
        >
            <Header centerTitle={route?.params?.data?.name || strings.PRODUCTS} />
            {RenderFilterSection()}
            <FlatList
                data={products}
                keyExtractor={item => String(item?.id)}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: moderateScale(16) }}
                contentContainerStyle={{ gap: moderateScale(12) }}
                onEndReachedThreshold={0.5}
                onEndReached={onEndReached}
                ListEmptyComponent={() => (
                    !isLoading ? <Text style={{ textAlign: 'center', marginTop: moderateScale(24), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>{strings.NOPRODUCTFOUND}</Text> : null
                )}
            />

            {!!isShowSort && (
                <BottomSlideModal
                    isModalVisible={isShowSort}
                    onBackdropPress={() => updateState({ isShowSort: false })}
                    mainContainView={RenderSortView}
                    mainContainerStyle={styles.sortModalMain}
                    innerViewContainerStyle={{ paddingHorizontal: 0, paddingVertical: 0 }}
                />
            )}
            <GradientCartView
                onPress={() => {
                    navigation.navigate(navigationStrings.CART);
                }}
                btnText={
                    CartItems && CartItems.data && CartItems.data.item_count
                        ? `${CartItems.data.item_count} ${CartItems.data.item_count == 1
                            ? strings.ITEM
                            : strings.ITEMS
                        } | ${tokenConverterPlusCurrencyNumberFormater(
                            Number(CartItems?.data?.gross_paybale_amount),
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                        )}`
                        : ''
                }
                ifCartShow={
                    CartItems && CartItems.data && CartItems.data.item_count > 0
                        ? true
                        : false
                }
                isMenuBtnShow={false}
                isLoading={false}
                sectionListData={[]}
                isCategoryExist={false}
            />
        </WrapperContainer>
    );
}


