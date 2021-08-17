import {cloneDeep, update} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StatusBar,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Pagination} from 'react-native-snap-carousel';
import {useSelector} from 'react-redux';
import Banner from '../../Components/Banner';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import ProductCard from '../../Components/ProductCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';

import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {showError, showSuccess} from '../../utils/helperFunctions';
import ListEmptyProduct from './ListEmptyProduct';
import stylesFunc from './styles';
import {useFocusEffect} from '@react-navigation/native';
import AddonModal from './AddonModal';
import HTMLView from 'react-native-htmlview';
import Header2 from '../../Components/Header2';

export default function ProductDetail2({route, navigation}) {
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const {productListData} = useSelector((state) => state?.product);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});
  const {data} = route.params;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    isLoading: true,
    isLoadingB: false,
    isLoadingC: false,
    productId: data.id,
    productDetailData: null,
    productPriceData: null,
    variantSet: [],
    addonSet: [],
    relatedProducts: [],
    showListOfAddons: false,
    venderDetail: null,
    productTotalQuantity: 0,
    productSku: null,
    productVariantId: null,
    isVisibleAddonModal: false,
    lightBox: false,
    productQuantityForCart: 1,
  });
  //Saving the initial state
  const initialState = cloneDeep(state);
  const userData = useSelector((state) => state?.auth?.userData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {bannerRef} = useRef();
  const {
    productDetailData,
    productPriceData,
    isLoadingC,
    addonSet,
    variantSet,
    showListOfAddons,
    venderDetail,
    productTotalQuantity,
    productSku,
    productVariantId,
    relatedProducts,
    isVisibleAddonModal,
    lightBox,
    productQuantityForCart,
    isLoading,
    slider1ActiveSlide,
  } = state;

  const customRight = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={imagePath.search} />
      </View>
    );
  };

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useFocusEffect(
    React.useCallback(() => {
      if (variantSet.length) {
        let variantSetData = variantSet
          .map((i, inx) => {
            let find = i.options.filter((x) => x.value);
            if (find.length) {
              return {
                variant_id: find[0].variant_id,
                optionId: find[0].id,
              };
            }
          })
          .filter((x) => x != undefined);
        console.log(variantSetData, 'variantSetData');
        if (variantSetData.length) {
          getProductDetailBasedOnFilter(variantSetData);
        } else {
          getProductDetail();
        }
      }
    }, [variantSet]),
  );

  useEffect(() => {
    getProductDetail();
  }, [state.productId, state.isLoadingB]);

  // useEffect(() => {
  //   if (variantSet.length) {
  //     let variantSetData = variantSet
  //       .map((i, inx) => {
  //         let find = i.options.filter((x) => x.value);
  //         if (find.length) {
  //           return {
  //             variant_id: find[0].variant_id,
  //             optionId: find[0].id,
  //           };
  //         }
  //       })
  //       .filter((x) => x != undefined);
  //     console.log(variantSetData, 'variantSetData');
  //     if (variantSetData.length) {
  //       getProductDetailBasedOnFilter(variantSetData);
  //     } else {
  //       getProductDetail();
  //     }
  //   }
  // }, [variantSet]);

  //Get Product detail

  const getProductDetail = () => {
    actions
      .getProductDetailByProductId(
        `/${state.productId}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res.data, 'res.data');
        updateState({
          isLoading: false,
          isLoadingB: false,
          productDetailData: res.data.products,
          relatedProducts: res.data.relatedProducts,
          productPriceData: res.data.products.variant[0],
          addonSet: res.data.products.add_on,

          venderDetail: res.data.products.vendor,
          productTotalQuantity: res.data.products.variant[0].quantity,
          productVariantId: res.data.products.variant[0].id,
          productSku: res.data.products.sku,
        });
        if (
          res.data.products.variant_set.length &&
          variantSet &&
          !variantSet.length
        ) {
          updateState({variantSet: res.data.products.variant_set});
        }
      })
      .catch(errorMethod);
  };

  //Get Product detail based on varint selection
  const getProductDetailBasedOnFilter = (variantSetData) => {
    updateState({isLoadingC: true});
    let data = {};
    data['variants'] = variantSetData.map((i) => i.variant_id);
    data['options'] = variantSetData.map((i) => i.optionId);
    actions
      .getProductDetailByVariants(`/${productDetailData.sku}`, data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        console.log(res.data, 'res.data by vendor id ');
        updateState({
          isLoading: false,
          isLoadingB: false,
          isLoadingC: false,
          productDetailData: res.data,
          productPriceData: {
            multiplier: res.data.multiplier,
            price: res.data.price,
          },
          productSku: res.data.sku,
          productVariantId: res.data.id,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error.message.alert, 'Error>>>>>');

    if (error?.message?.alert == 1) {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: 'Clear Cart', onPress: () => clearCart()},
      ]);
    } else {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      showError(error?.message || error?.error);
    }
  };

  const errorMethodSecond = (error, addonSet) => {
    console.log(error.message.alert, 'Error>>>>>');

    if (error?.message?.alert == 1) {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: 'Clear Cart', onPress: () => clearCart(addonSet)},
      ]);
    } else {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      showError(error?.message || error?.error);
    }
  };

  const clearCart = (addonSet) => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty(res);
        // updateState({
        //   cartItems: [],
        //   cartData: {},
        //   isLoadingB: false,
        // });
        // addToCart();
        if (addonSet) {
          _finalAddToCart(addonSet);
        } else {
          addToCart();
        }
        // _finalAddToCart(addonSet);
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //add Product to wishlist
  const _onAddtoWishlist = (item) => {
    console.log(item, 'itemwishlist');

    if (!!userData?.auth_token) {
      actions
        .updateProductWishListData(
          `/${item.product_id || item.id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          console.log(res, 'addtowishlist response');
          showSuccess(res.message);

          if (item.inwishlist) {
            item.inwishlist = null;
            updateState({productDetailData: item});
          } else {
            item.inwishlist = {product_id: item.id};
            updateState({productDetailData: item});
          }
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  // useEffect(() => {
  //   myRef.current.scrollToPosition(1, 0, true);
  // }, [state.productId]);

  const selectSpecificOptions = (options, i, inx) => {
    let newArray = cloneDeep(options);
    updateState({
      variantSet: variantSet.map((vi, vnx) => {
        if (vi.variant_type_id == i.variant_id) {
          return {
            ...vi,
            options: newArray.map((j, jnx) => {
              if (j.id == i.id) {
                return {
                  ...j,
                  value: i?.value ? false : true,
                };
              }
              return {
                ...j,
                value: false,
              };
            }),
          };
        } else {
          return vi;
        }
      }),
    });

    console.log(variantSet, 'newArray>>>>>');
  };

  const radioButtonView = (options) => {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {options.map((i, inx) => {
          return (
            <TouchableOpacity
              disabled={options && options.length == 1 ? true : false}
              onPress={() => selectSpecificOptions(options, i, inx)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: moderateScale(5),
                marginBottom: moderateScaleVertical(10),
              }}>
              <Image source={i?.value ? imagePath.check : imagePath.unCheck} />
              <Text style={styles.variantValue}>{i.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const circularView = (options) => {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {options.map((i, inx) => {
          return (
            <TouchableOpacity
              disabled={options && options.length == 1 ? true : false}
              onPress={() => selectSpecificOptions(options, i, inx)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: moderateScale(5),
                marginBottom: moderateScaleVertical(10),
              }}>
              <View
                style={[
                  styles.variantSizeViewTwo,
                  {
                    backgroundColor: colors.white,
                    borderWidth: i?.value ? 1 : 0,

                    borderColor:
                      i?.value &&
                      (i.hexacode == '#FFFFFF' || i.hexacode == '#FFF')
                        ? colors.textGrey
                        : i.hexacode,
                  },
                ]}>
                <View
                  style={[
                    styles.variantSizeViewOne,
                    {
                      backgroundColor: i.hexacode,
                      borderWidth:
                        i.hexacode == '#FFFFFF' || i.hexacode == '#FFF'
                          ? StyleSheet.hairlineWidth
                          : 0,
                    },
                  ]}></View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  const variantSetValue = ({options, type}) => {
    if (type == 1) {
      return <>{radioButtonView(options)}</>;
    }
    return <>{circularView(options)}</>;
  };

  const showAllVariants = () => {
    let variantSetData = cloneDeep(variantSet);
    return (
      <>
        {/* <View
          style={{
            marginHorizontal: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.addonLable,
              {marginBottom: moderateScale(5), marginVertical: 10},
            ]}>
            {'Product Variant'}
          </Text>
        </View> */}
        <View style={{marginHorizontal: moderateScale(20), marginVertical: 10}}>
          {variantSetData.map((i, inx) => {
            return (
              <View
                key={inx}
                style={{
                  rtical: moderateScaleVertical(5),
                }}>
                <Text
                  style={[
                    styles.variantLable,
                    {marginBottom: moderateScale(5)},
                  ]}>{`${i?.title}`}</Text>
                {i?.options ? variantSetValue(i) : null}
              </View>
            );
          })}
        </View>
      </>
    );
  };

  useEffect(() => {
    if (data?.addonSetData && data?.randomValue) {
      updateState({addonSet: data?.addonSetData});
      setTimeout(() => {
        _finalAddToCart(data?.addonSetData);
      }, 1000);
    }
  }, [data?.addonSetData, data?.randomValue]);

  const _finalAddToCart = (addonSet = addonSet) => {
    const addon_ids = [];
    const addon_options = [];

    addonSet.map((i, inx) => {
      i.setoptions.map((j, jnx) => {
        console.log(j, 'J');
        if (j?.value == true) {
          addon_ids.push(j?.addon_id);
          addon_options.push(j?.id);
        }
      });
    });

    let data = {};
    data['sku'] = productSku;
    data['quantity'] = productQuantityForCart;
    data['product_variant_id'] = productVariantId;
    data['type'] = dine_In_Type;

    if (addonSet && addonSet.length) {
      // console.log(addonSetData, 'addonSetData');
      data['addon_ids'] = addon_ids;
      data['addon_options'] = addon_options;
    }
    console.log(data, 'data for cart');
    updateState({isLoadingC: true, isVisibleAddonModal: false});
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res.data');
        actions.cartItemQty(res);
        showSuccess('Product successfully added');

        updateState({isLoadingC: false});
        navigation.goBack();
      })
      .catch((error) => errorMethodSecond(error, addonSet));
  };

  const addToCart = () => {
    {
      addonSet && addonSet.length
        ? updateState({isVisibleAddonModal: true})
        : _finalAddToCart(addonSet);
    }
    // _finalAddToCart()
  };

  const myRef = useRef(null);

  const productIncrDecreamentForCart = (type) => {
    if (type == 2) {
      if (productQuantityForCart <= 1) {
      } else {
        updateState({
          productQuantityForCart: productQuantityForCart - 1,
        });
      }
    } else if (type == 1) {
      if (productQuantityForCart == productTotalQuantity) {
        showError('Maximum Limit Reached');
      } else {
        updateState({
          productQuantityForCart: productQuantityForCart + 1,
        });
      }
    }
  };

  const renderProduct = ({item, index}) => {
    item.showAddToCart = true;
    return (
      <ProductCard
        onPress={() =>
          navigation.push(navigationStrings.PRODUCTDETAIL, {data: item})
        }
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        data={item}
        cardStyle={{marginHorizontal: moderateScale(10)}}
        addToCart={() =>
          navigation.push(navigationStrings.PRODUCTDETAIL, {data: item})
        }
        bottomText={strings.VIEW_DETAIL}
      />
    );
  };

  const setModalVisibleForAddonModal = (visible) => {
    updateState({isVisibleAddonModal: false});
  };

  const onclickBanner = () => {
    updateState({lightBox: true});
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={'dark-content'}
      />
      {isLoading && <ListEmptyProduct isLoading={isLoading} />}

      {!isLoading && (
        <>
          <View
            style={{
              alignItems: 'center',
              height: height * 0.3,
              backgroundColor: 'green',
            }}>
            <Banner
              bannerRef={bannerRef}
              bannerData={productDetailData?.product_media}
              sliderWidth={width}
              itemWidth={width}
              pagination={false}
              setActiveState={(index) =>
                updateState({slider1ActiveSlide: index})
              }
              showLightbox={true}
              cardViewStyle={{
                alignItems: 'center',
                height: width * 0.7,
                width: width,
              }}
              childView={
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 10,
                  }}>
                  {productDetailData?.averageRating !== null && (
                    <View style={{alignItems: 'flex-end'}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          borderRadius: 18,
                          paddingHorizontal: 12,
                          backgroundColor: colors.orange,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image source={imagePath.starWhite} />
                        <Text style={styles.ratingColor}>
                          {productDetailData?.averageRating !== null
                            ? Number(productDetailData?.averageRating).toFixed(
                                1,
                              )
                            : ''}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              }
            />
            <View style={{paddingTop: 5}}>
              <Pagination
                dotsLength={productDetailData?.product_media?.length}
                activeDotIndex={slider1ActiveSlide}
                dotColor={'grey'}
                dotStyle={[styles.dotStyle]}
                inactiveDotColor={'black'}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
              />
            </View>
          </View>

          <View
            style={{
              height: height * 0.75,
              backgroundColor: colors.backgroundGrey,
              borderTopLeftRadius: moderateScale(20),
              borderTopRightRadius: moderateScale(20),
              marginTop: moderateScale(22),
              paddingHorizontal: moderateScale(15),
              paddingVertical: moderateScale(15),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text numberOfLines={2} style={styles.productName}>
                {productDetailData?.translation[0]?.title}
              </Text>
              <TouchableOpacity
                onPress={() => _onAddtoWishlist(productDetailData)}>
                {productDetailData?.is_wishlist ? (
                  <View>
                    {!!productDetailData?.inwishlist ? (
                      <Image source={imagePath.blackFilledHeart} />
                    ) : (
                      <Image source={imagePath.fav} />
                    )}
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>
            <Text style={styles.productPrice}>{`${
              currencies?.primary_currency.symbol
            }${(
              Number(productPriceData?.multiplier) *
              Number(productPriceData?.price)
            ).toFixed(2)}`}</Text>
          </View>
        </>
      )}
    </>
  );
}
