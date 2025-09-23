import { useNavigation } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'
import Header from '../../../Components/Header'
import ProductCard from '../../../Components/ProductCard'
import WrapperContainer from '../../../Components/WrapperContainer'
import navigationStrings from '../../../navigation/navigationStrings'
import actions from '../../../redux/actions'
import colors from '../../../styles/colors'
import fontFamily from '../../../styles/fontFamily'
import { moderateScale, moderateScaleVertical, textScale, width } from '../../../styles/responsiveSize'
import { getImageUrl, showError, showSuccess } from '../../../utils/helperFunctions'
import ListEmptyProduct from '../../ProductDetail/ListEmptyProduct'
import { styles } from './styles'
import ProductsComp3V2 from '../../../Components/ProductsComp3V2'
import { ProductCardGrocery } from '../../../Components/ProductCardGrocery'
import GradientCartView from '../../../Components/GradientCartView'
import strings from '../../../constants/lang'
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction'
import { getColorSchema } from '../../../utils/utils'
import { MyDarkTheme } from '../../../styles/theme'
import imagePath from '../../../constants/imagePath'
import FilterComp from '../../../Components/FilterComp'
import NoDataFound from '../../../Components/NoDataFound'

let timeOut = undefined;
var tempQty = 0;


const GroceryProductList = ({ route }) => {
    const navigation = useNavigation();
    const { location, dineInType } = useSelector((state) => state.home)
    const { appData, currencies, languages, themeToggle, themeColor, themeColors } = useSelector(state => state?.initBoot);
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const darkthemeusingDevice = getColorSchema();
    const { cartItemCount } = useSelector(state => state?.cart);
    const CartItems = useSelector(state => state?.cart?.cartItemCount);
    const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};
    console.log(route?.params, 'route?.params')

    let selectedFilters = useRef(null);

    const [state, setState] = useState({
        selectedCategory: route?.params?.data,
        categoryProducts: [],
        pageNo: 1,
        isRefreshing: false,
        loadMore: false,
        isLoading: true,
        selectedItemID: -1,
        selectedItemIndx: null,
        btnLoader: false,
        cartId: null,
        isShowFilter: false,
        selectedSortFilter: null,
        maximumPrice: 50000,
        minimumPrice: 0,
        allFilters: [],
        isSortOnly: false,
        sortFilters: [],
        limit: 200,
    });

    const {
        selectedCategory,
        categoryProducts,
        pageNo,
        isRefreshing,
        loadMore,
        isLoading,
        selectedItemID,
        selectedItemIndx,
        btnLoader,
        cartId,
        isShowFilter,
        selectedSortFilter,
        maximumPrice,
        minimumPrice,
        allFilters,
        isSortOnly,
        sortFilters,
        limit,
    } = state;

    const updateState = (data) => setState(state => ({ ...state, ...data }));
    const categoryScrollRef = useRef(null);
    const productListRef = useRef(null);

    const errorMethod = error => {
        console.log('checking error', error);
        updateState({
            isLoading: false
        });
        if (error?.message == 'Recurring booking type not be empty.') {
            showSuccess('Schedule the product in product detail page');
        } else {
            showError(error?.message || error?.error);
        }
        updateState({ loadMore: false });
    };

    // API calls
    const getAllProductsByCategoryId = (pageNo, filterValue) => {
        let apiUri;
        if (!!filterValue) {
            apiUri = `/${selectedCategory?.id}?page=${pageNo}&product_list=${false}&type=${dineInType}&${filterValue} `
        } else {
            apiUri = `/${selectedCategory?.id}?page=${pageNo}&product_list=${false}&type=${dineInType}&limit=${limit}`
        }
        updateState({ isLoading: pageNo == 1 ? true : false, loadMore: pageNo > 1 });
        actions
            .getProductByCategoryIdOptamize(
                apiUri,
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    systemuser: DeviceInfo.getUniqueId(),
                },
            )
            .then(res => {
                if (!!res?.data) {
                    updateState({
                        categoryProducts: pageNo == 1 ? res?.data?.listData?.data : [...categoryProducts, ...res?.data?.listData?.data],
                        isLoading: false,
                        isRefreshing: false,
                        loadMore: false,
                    });
                }
            })
            .catch(errorMethod);
    };

    // Get filtered products by category
    const getAllProductsCategoryFilter = (pageNo) => {
        let data = {};
        data['variants'] = selectedFilters?.current?.selectedVariants || [];
        data['options'] = selectedFilters?.current?.selectedOptions || [];
        data['brands'] = selectedFilters?.current?.sleectdBrands || [];
        data['order_type'] = selectedFilters?.current?.selectedSorting || 0;
        data['range'] = `${minimumPrice};${maximumPrice}`;

        updateState({ isLoading: pageNo == 1 ? true : false, loadMore: pageNo > 1 });

        actions
            .getProductByCategoryFiltersOptamize(
                `/${selectedCategory?.id}?page=${pageNo}&product_list=${false}&type=${dineInType}`,
                data,
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    systemuser: DeviceInfo.getUniqueId(),
                },
            )
            .then(res => {
                console.log(res, "<==res getProductByCategoryFiltersOptamize")
                updateState({
                    categoryProducts: pageNo == 1 ? res?.data?.data : [...categoryProducts, ...res?.data?.data],
                    isLoading: false,
                    isRefreshing: false,
                    loadMore: false,
                    lastPage: res?.data?.last_page,
                });

                if (res?.data?.current_page < res?.data?.last_page) {
                    updateState({ loadMore: true });
                } else {
                    updateState({ loadMore: false });
                }
            })
            .catch(errorMethod);
    };

    useEffect(() => {
        if (selectedCategory) {
            !!selectedFilters.current
                ? getAllProductsCategoryFilter(pageNo)
                : getAllProductsByCategoryId(pageNo);
        }
    }, [selectedCategory, pageNo]);


    // Handle category selection
    const handleCategorySelect = (category, index) => {
        productListRef.current?.scrollToOffset({ offset: 0, animated: true });
        updateState({ selectedCategory: category, pageNo: 1 });

        // Scroll selected category to center
        if (categoryScrollRef.current) {
            categoryScrollRef.current.scrollTo({
                y: index * 100 - 200, // Adjust offset to center the item
                animated: true,
            });
        }
    };

    // Pagination
    const onEndReached = () => {
        if (loadMore && !isLoading) {
            const nextPage = pageNo + 1;
            updateState({ pageNo: nextPage });
            !!selectedFilters.current
                ? getAllProductsCategoryFilter(nextPage)
                : getAllProductsByCategoryId(nextPage);
        }
    };

    // Refresh
    const handleRefresh = () => {
        updateState({ pageNo: 1 });
        !!selectedFilters.current
            ? getAllProductsCategoryFilter(1)
            : getAllProductsByCategoryId(1);
    };

    // Auto scroll to selected category on mount
    useEffect(() => {
        const selectedIndex = route?.params?.otherCategories?.children?.findIndex((cat) => cat.id === selectedCategory.id);
        if (selectedIndex !== -1 && categoryScrollRef.current) {
            setTimeout(() => {
                categoryScrollRef.current?.scrollTo({
                    y: selectedIndex * 100 - 200,
                    animated: true,
                });
            }, 100);
        }
    }, []);

    // Render category item
    const renderCategoryItem = (category, index) => {
        const isSelected = category.id === selectedCategory.id;
        const imageURI =
            category?.icon?.ext === 'gif'
                ? category?.icon?.image_path
                : getImageUrl(category?.icon?.image_fit, category?.icon?.image_path, '360/360');

        return (
            <TouchableOpacity
                key={category.id}
                style={[styles.categoryItem, {
                    borderRightWidth: isSelected ? 2 : 0,
                    borderColor: colors.themeColor,
                }]}
                onPress={() => handleCategorySelect(category, index)}
                activeOpacity={0.7}
            >
                <View style={styles.categoryContent}>
                    <View style={{ ...styles.imageContainer, backgroundColor: isSelected ? colors.themeColor2 : colors.white }}>
                        <FastImage
                            source={{ uri: imageURI }}
                            style={styles.categoryImage}
                        />
                    </View>
                    <Text
                        style={[styles.categoryText, {
                            color: isSelected ? isDarkMode ? colors.white : colors.black : isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                            fontFamily: isSelected ? fontFamily.bold : fontFamily.medium,
                            fontSize: textScale(10),
                        }]}
                        numberOfLines={2}
                    >
                        {category.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };
    const goToProductDetail = productDetail => {
        if (dineInType == 'p2p') {
            navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, {
                product_id: productDetail?.id,
            })
            return
        }
        navigation.navigate(navigationStrings.PRODUCTDETAIL, {
            data: productDetail,
            previousScreenData: route?.params?.data,
            isProductList: true,
        });
    };

    // Add single item to cart
    const addSingleItem = async (item, index) => {
        updateState({ selectedItemID: item?.id, btnLoader: true });

        if (item?.add_on_count !== 0 || item?.variant_set_count !== 0) {
            // Navigate to product detail for customization
            goToProductDetail(item);
            updateState({ selectedItemID: -1, btnLoader: false });
            return;
        }

        let data = {};
        data['sku'] = item.sku;
        data['quantity'] = !!item?.minimum_order_count ? Number(item?.minimum_order_count) : 1;
        data['product_variant_id'] = item?.variant[0].id;
        data['type'] = dineInType;

        try {
            const res = await actions.addProductsToCart(data, {
                code: appData.profile.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                systemuser: DeviceInfo.getUniqueId(),
            });

            console.log('add single item response:', res);
            actions.cartItemQty(res);
            updateState({ cartId: res.data.id });

            // Update local product list
            updateProductList(item, res.data.cart_product_id, data.quantity);

            updateState({ selectedItemID: -1, btnLoader: false });
        } catch (error) {
            console.log('Error adding to cart:', error);
            showError(error?.message || error?.error || 'Something went wrong');
            updateState({ selectedItemID: -1, btnLoader: false });
        }
    };

    // Check if item is customizable
    const checkIsCustomize = async (item, index, type) => {
        if (item?.add_on_count == 0 && item?.variant_set_count == 0) {
            // Simple product without customization
            addProductsWithoutCustomize(item, index, type);
            return;
        }

        // For customizable products, navigate to detail page
        goToProductDetail(item);
    };

    // Add/Remove products without customization
    const addProductsWithoutCustomize = (item, index, type) => {
        let itemToUpdate = { ...item };
        let quantity = itemToUpdate?.qty || 0;

        // Calculate total quantity from check_if_in_cart_app
        var totalProductQty = 0;
        if (item?.check_if_in_cart_app) {
            item?.check_if_in_cart_app.map((val) => {
                totalProductQty = totalProductQty + val.quantity;
            });
        }

        let finalQuantity = itemToUpdate?.qty || totalProductQty;
        let productId = !!itemToUpdate?.cart_product_id
            ? itemToUpdate?.cart_product_id
            : itemToUpdate?.check_if_in_cart_app?.[0]?.id;
        let parentCartId = cartId || itemToUpdate?.check_if_in_cart_app?.[0]?.cart_id;

        console.log(item, finalQuantity, productId, parentCartId, index, type, 'testttt', itemToUpdate);

        addDeleteCartItems(
            item,
            finalQuantity,
            productId,
            parentCartId,
            null, // section
            index,
            type,
            null, // updateLocalQty
            null, // differentAddsOnsQty
        );
    };

    const addDeleteCartItems = async (
        item,
        isExistqty,
        isExistproductId,
        isExistCartId,
        section = null,
        index,
        type,
        updateLocalQty = null,
        differentAddsOnsQty = null,
    ) => {
        let itemToUpdate = { ...item };
        let quantityToIncreaseDecrease = !!item?.minimum_order_count
            ? Number(item?.minimum_order_count)
            : 1;

        let quanitity = type == 1 ? isExistqty + quantityToIncreaseDecrease : isExistqty - quantityToIncreaseDecrease;

        if (type == 2) {
            tempQty = tempQty - quantityToIncreaseDecrease;
        } else {
            tempQty = tempQty + quantityToIncreaseDecrease;
        }

        updateLocally(
            section,
            quanitity,
            item,
            isExistproductId,
            differentAddsOnsQty,
            index,
        );

        if (timeOut) {
            clearTimeout(timeOut);
        }

        timeOut = setTimeout(
            () => {
                if (quanitity > 0) {
                    updateState({
                        selectedItemID: itemToUpdate.id,
                        btnLoader: true,
                        selectedItemIndx: index,
                    });
                    let data = {};
                    data['cart_id'] = isExistCartId;
                    data['quantity'] = !!updateLocalQty
                        ? type == 1
                            ? updateLocalQty + quantityToIncreaseDecrease
                            : updateLocalQty - quantityToIncreaseDecrease
                        : quanitity;
                    data['cart_product_id'] = isExistproductId;
                    data['type'] = dineInType;
                    console.log('sending api data', data);

                    actions
                        .increaseDecreaseItemQty(data, {
                            code: appData?.profile?.code,
                            currency: currencies?.primary_currency?.id,
                            language: languages?.primary_language?.id,
                            systemuser: DeviceInfo.getUniqueId(),
                        })
                        .then(res => {
                            console.log('update qty res', res);
                            tempQty = 0;
                            actions.cartItemQty(res);
                            updateState({
                                selectedItemID: -1,
                                btnLoader: false,
                            });
                        })
                        .catch(async () => {
                            errorMethod();
                            if (type == 1) {
                                quanitity = quanitity - tempQty;
                            } else {
                                quanitity = quanitity + tempQty;
                            }
                            updateLocally(section, quanitity, item, isExistproductId);
                            tempQty = 0;
                        });
                } else {
                    updateState({
                        selectedItemID: itemToUpdate?.id,
                        btnLoader: true,
                    });
                    removeProductFromCart(itemToUpdate, isExistproductId);
                }
            },
            800,
        );
    };

    const updateLocally = (
        section,
        quanitity,
        item,
        isExistproductId,
        differentAddsOnsQty,
        index,
    ) => {
        let updateArray = categoryProducts.map((val, i) => {
            if (val.id == item.id) {
                return {
                    ...val,
                    qty: quanitity,
                    cart_product_id: isExistproductId,
                };
            }
            return val;
        });
        updateState({ categoryProducts: updateArray });
    };

    // Remove product from cart
    const removeProductFromCart = async (item, productId) => {
        let data = {};
        data['cart_id'] = cartId || item?.check_if_in_cart_app?.[0]?.cart_id;
        data['cart_product_id'] = productId;
        data['type'] = dineInType;

        try {
            const res = await actions.removeProductFromCart(data, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                systemuser: DeviceInfo.getUniqueId(),
            });

            console.log('remove item response:', res);
            tempQty = 0;
            actions.cartItemQty(res);
            updateProductList(item, null, 0);
            updateState({ selectedItemID: -1, btnLoader: false });
        } catch (error) {
            console.log('Error removing item:', error);
            tempQty = 0;
            showError(error?.message || error?.error || 'Something went wrong');
            updateState({ selectedItemID: -1, btnLoader: false });
        }
    };

    // Update product list locally
    const updateProductList = (item, cartProductId, quantity) => {
        let updateArray = categoryProducts.map((val, i) => {
            if (val.id == item.id) {
                return {
                    ...val,
                    qty: quantity,
                    cart_product_id: cartProductId,
                };
            }
            return val;
        });
        updateState({ categoryProducts: updateArray });
    };

    // Render product item
    const renderProductItem = ({ item, index }) => (
        <ProductCardGrocery
            item={item}
            index={index}
            onPress={() => goToProductDetail(item)}
            onAddToCartPress={() => addSingleItem(item, index)}
            onIncrement={() => checkIsCustomize(item, index, 1)}
            onDecrement={() => checkIsCustomize(item, index, 2)}
            selectedItemID={selectedItemID}
            btnLoader={btnLoader}
            showAddToCart={true}
            CartItems={CartItems}
            isDarkMode={isDarkMode}
        />
    );

    const onShowHideFilter = () => {
        updateState({ isShowFilter: !isShowFilter, isSortOnly: false });
    };

    const allClearFilters = () => {
        selectedFilters.current = null;
        updateState({
            isShowFilter: false,
            selectedSortFilter: null,
            minimumPrice: 0,
            maximumPrice: 50000,
            pageNo: 1,
            loadMore: true,
            isSortOnly: false,
        });
        getAllProductsByCategoryId(1);
    };

    const onFilterApply = (filterData = {}) => {
        selectedFilters.current = filterData;
        updateState({
            isShowFilter: false,
            isSortOnly: false,
            loadMore: true,
            pageNo: 1
        });
        getAllProductsCategoryFilter(1);
    };

    const updateMinMax = (min, max) => {
        updateState({ minimumPrice: min, maximumPrice: max });
    };

    return (
        <WrapperContainer isLoading={isLoading} bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white} mainStyle={{ marginHorizontal: 0 }}>
            <Header leftIcon={imagePath.backRoyo} isLeft={true} centerTitle={selectedCategory?.name} />
            <View style={styles.container}>
                {/* Left Category Sidebar */}
                <View style={{ ...styles.categoryContainer, backgroundColor: isDarkMode ? MyDarkTheme.colors.border : colors.greyColor }}>
                    <ScrollView
                        ref={categoryScrollRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.categoryScrollContent}
                    >
                        {route?.params?.data?.categoryData?.children?.map((category, index) =>
                            renderCategoryItem(category, index)
                        )}
                    </ScrollView>
                </View>
                {/* Right Product Grid */}
                <View style={{ ...styles.productContainer, backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white }}>
                    <FlatList
                        data={categoryProducts || []}
                        renderItem={renderProductItem}
                        keyExtractor={(item) => String(item.id)}
                        numColumns={2}
                        ref={productListRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.productGrid}
                        columnWrapperStyle={styles.productRow}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={handleRefresh}
                            />
                        }
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={!isLoading ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',marginTop: moderateScaleVertical(width / 2) }}>
                                <NoDataFound />
                            </View>
                            : null}
                        ItemSeparatorComponent={() => <View style={styles.productSeparator} />}
                        ListHeaderComponent={() => {
                            return (
                                <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ margin: moderateScale(6) }}>
                                    <TouchableOpacity style={styles.filterContainer} onPress={() => updateState({ isShowFilter: true })}>
                                        <Image style={styles.filterIconStyle} source={imagePath.filter} />
                                        <Text>{strings.FILTER}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.filterContainer} onPress={() => updateState({ isShowFilter: true, isSortOnly: true })}>
                                        <Image style={styles.filterIconStyle} source={imagePath.sort} />
                                        <Text>{strings.SORT}</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            );
                        }}
                        ListFooterComponent={() => {
                            return (
                                <>
                                    {loadMore && !isLoading && (
                                        <View style={{
                                            height: moderateScale(60),
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <ActivityIndicator size="large" color={colors.themeColor} />
                                        </View>
                                    )}
                                </>
                            );
                        }}
                    />
                </View>
            </View>

            {/* Cart View */}
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
                isLoading={btnLoader}
                sectionListData={[]}
                isCategoryExist={false}
            />
            {isShowFilter ? (
                <FilterComp
                    isDarkMode={isDarkMode}
                    themeColors={themeColors}
                    onFilterApply={onFilterApply}
                    onShowHideFilter={onShowHideFilter}
                    allClearFilters={allClearFilters}
                    selectedSortFilter={selectedSortFilter}
                    onSelectedSortFilter={val =>
                        updateState({ selectedSortFilter: val })
                    }
                    isSortOnly={isSortOnly}
                    maximumPrice={maximumPrice}
                    minimumPrice={minimumPrice}
                    updateMinMax={updateMinMax}
                    filterData={allFilters}
                    currencies={currencies}
                />
            ) : null}
        </WrapperContainer>
    )
};

export default GroceryProductList;
