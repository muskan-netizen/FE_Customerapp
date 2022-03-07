import {cloneDeep, debounce, isEmpty, update} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useSelector} from 'react-redux';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import Header from '../../../Components/Header';
import MultiScreen from '../../../Components/MultiScreen';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {
  getImageUrl,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import ModalView from '../../../Components/Modal';
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import GradientButton from '../../../Components/GradientButton';
import strings from '../../../constants/lang';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import Modal from 'react-native-modal';
import SelectVendorListModal from '../../../Components/SelectVendorListModal';

const RoyoProducts = (props) => {
  const {navigation} = props;

  const {storeSelectedVendor} = useSelector((state) => state?.order);
  const {appData, themeColors, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const [state, setState] = useState({
    activeIndex: 0,
    headerText: 'Products',
    vendor_list: [],
    selectedVendor: {},
    isVisibleModal: false,
    isLoading: true,
    pageNo: 1,
    limit: 100,
    isRefreshing: false,
    productListData: [],
    category_list: [],
    categoryName: '',
    topTabs: ['Products', 'Categories'],
    isAddProductModal: false,
    productName: '',
    productSKU: '',
    productSlug: '',
    isVendorCategory: false,
    vendorCategories: [],
    selectedVendorCategory: {},
    isAddProductLoading: false,
    skuDefault: '',
    isLoadingB: false,
    isVendorSelectModal: false,
  });

  const {
    vendor_list,
    selectedVendor,
    isLoading,
    pageNo,
    limit,
    isRefreshing,
    productListData,
    category_list,
    activeIndex,
    headerText,
    categoryName,
    topTabs,
    isAddProductModal,
    productName,
    productSKU,
    productSlug,
    isVendorCategory,
    vendorCategories,
    selectedVendorCategory,
    isAddProductLoading,
    skuDefault,
    isLoadingB,
    isVendorSelectModal,
  } = state;

  useEffect(() => {
    getAllProducts(undefined);
    // if (!!selectedVendor?.id) {

    updateState({
      selectedVendorCategory: [],
    });
    // }
  }, [isRefreshing, storeSelectedVendor]);

  console.log(storeSelectedVendor, 'storeSelectedVendor>>>>>');

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const updateIsLiveStatus = (id, status) => {
    console.log('statusstatus', status);
    console.log('statusstatus', status == 1 ? 0 : 1);
    actions
      .postVendorProductStatusUpdate(
        {
          is_live: status == 1 ? 0 : 1,
          product_id: id,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        let temp = cloneDeep(productListData);
        temp = temp.map((el) => {
          if (el.id == id) {
            el.is_live = status == 1 ? 0 : 1;
            return el;
          } else {
            return el;
          }
        });
        updateState({productListData: temp});
      })
      .catch(errorMethod);
  };

  const renderItem = (data, rowMap) => {
    const {item} = data;
    return (
      <View style={styles.itemBox}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.PRODUCTDETAIL, {
              data: item,
              isVendor: true,
            })
          }
          style={{alignSelf: 'center'}}>
          {!isEmpty(item?.media) && (
            <Image
              style={styles.imageStyle}
              source={{
                uri: getImageUrl(
                  item?.media[0].image?.path?.image_fit,
                  item?.media[0].image?.path?.image_path,
                  '500/500',
                ),
              }}
            />
          )}
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {/* <View style={{flex: 1, }}> */}
            <Text
              numberOfLines={1}
              style={[styles.font16medium, {textTransform: 'capitalize'}]}>
              {item.translation[0]?.title}
            </Text>

            {/* </View> */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.font16Semibold}>In Stock</Text>
              <TouchableOpacity
                onPress={() => updateIsLiveStatus(item.id, item.is_live)}>
                <Image
                  source={
                    item.is_live
                      ? imagePath.inStockRoyo
                      : imagePath.outStockRoyo
                  }
                />
              </TouchableOpacity>
            </View>
            {/* <Image style={{alignSelf: 'flex-end'}} source={imagePath.share} /> */}
          </View>
          {item?.category_name?.name ? (
            <Text style={styles.font13Regular}>
              in {item.category_name.name}
            </Text>
          ) : null}

          <View style={{marginTop: 10}}>
            <HTMLView
              value={
                item?.translation[0]?.body_html
                  ? item?.translation[0]?.body_html
                  : ''
              }
            />
            <View />
          </View>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: 14,
              color: colors.black,
              marginTop: moderateScaleVertical(4),
            }}>
            {item.variant[0]?.price
              ? `${currencies?.primary_currency?.symbol} ${Number(
                  item.variant[0]?.price,
                ).toFixed(2)}`
              : ''}
          </Text>
        </View>
      </View>
    );
  };

  const selectedOrder = (index) => {
    if (index == 0) updateState({activeIndex: index, headerText: 'Products'});
    else updateState({activeIndex: index, headerText: 'Categories'});
  };

  /**********Get all list items by store  id and category id */
  const getAllProducts = async (catId) => {
    const pageNo_ = catId ? 1 : pageNo;
    updateState({
      isLoading: true,
    });
    let vendordId = !isEmpty(storeSelectedVendor)
      ? storeSelectedVendor?.id
      : !isEmpty(selectedVendor)
      ? selectedVendor?.id
      : '';

    // if (!vendordId) {
    //   setTimeout(() => {
    //     getAllProducts();
    //   }, 2000);
    //   return false;
    // }
    const data = {};

    data['selected_vendor_id'] = vendordId.toString();
    if (catId) {
      data['selected_category_id'] = catId.toString();
    }
    data['limit'] = limit;
    if (!catId) {
      data['type'] = 'all';
    }
    data['page'] = pageNo_;

    console.log(data, 'data>>>>>');
    actions
      .getAllProductByVendorId(``, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res.data, 'res.data>>>>>', pageNo_);
        let categorylist = res.data.category_list.filter((x) => x.is_selected);
        let selectedVendor = res.data.vendor_list.find((x) => x.is_selected);
        if (!isEmpty(res.data.vendor_list)) {
          _getVendorCategories({id: vendordId});
        }

        updateState({
          isLoading: false,
          isRefreshing: false,
          vendor_list: res.data.vendor_list,
          categoryName: categorylist[0]?.name,
          selectedVendor: selectedVendor,
          category_list: res.data.category_list,
          productListData:
            pageNo_ == 1
              ? res.data.products.data
              : [...productListData, ...res.data.products.data],
        });
        if (catId) {
          selectedOrder(0);
        }
      })
      .catch((err) => {
        console.log(err);
        errorMethod(err);
      });
    // }
  };

  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isRefreshing: false,
      isAddProductLoading: false,
      isAddProductModal: false,
    });
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const selectedCategory = async (index) => {
    updateState({pageNo: 0});
    setTimeout(() => getAllProducts(index), 1000);
  };

  const renderCatogry = ({item, index}) => (
    <View
      key={index}
      style={{
        marginBottom: moderateScaleVertical(16),
        marginLeft:
          width > 600
            ? index % 5
              ? moderateScale(10)
              : 0
            : index % 3
            ? moderateScale(10)
            : 0,
      }}>
      {console.log(item)}
      <TouchableOpacity
        // disabled
        onPress={() => selectedCategory(item.id)}
        style={styles.categoryItem}>
        <Image
          style={{
            resizeMode: 'center',
            width:
              width > 600
                ? (width - moderateScale(173)) / 5
                : (width - moderateScale(112)) / 3,
            height:
              width > 600
                ? (width - moderateScale(203)) / 5
                : (width - moderateScale(152)) / 3,
            borderRadius: moderateScale(7),
          }}
          // source={imagePath.testingImageRoyo}
          source={
            item.cat_image && item.cat_image.proxy_url
              ? {
                  uri: `${item.cat_image.proxy_url}200/200${item.cat_image.image_path}`,
                }
              : imagePath.testingImageRoyo
          }
        />
      </TouchableOpacity>
      <Text
        style={{
          textAlign: 'center',
          width:
            width > 600
              ? (width - moderateScale(173)) / 5
              : (width - moderateScale(112)) / 3,
          textTransform: 'capitalize',
        }}>
        {item.name}
      </Text>
    </View>
  );

  const _reDirectToVendorList = () => {
    updateState({
      isVendorSelectModal: true,
    });
    // navigation.navigate(navigationStrings.VENDORLIST, {
    //   selectedVendor: selectedVendor,
    //   allVendors: vendor_list,
    //   screenType: staticStrings.PRODUCTS,
    // });
  };

  const onCloseModal = () => {
    updateState({
      isAddProductModal: false,
      isVendorSelectModal: false,
      productName: '',
      productSKU: '',
      productSlug: '',
    });
  };

  const checkValidations = () => {
    if (productName == '') {
      alert('Please enter product name');
      return false;
    } else if (isEmpty(selectedVendorCategory)) {
      alert('Please select category');
      return false;
    } else if (productSKU == '') {
      alert('Please enter SKU');
      return false;
    } else if (productSlug == '') {
      alert('Please enter url slug');
      return false;
    } else return true;
  };

  const onAddProduct = () => {
    const isValid = checkValidations();
    if (!isValid) {
      return;
    }
    updateState({
      isAddProductLoading: true,
      isVendorCategory: false,
    });

    const data = {};
    data['product_name'] = productName;
    data['category_id'] = selectedVendorCategory?.id;
    data['sku'] = productSKU;
    data['url_slug'] = productSlug;
    data['vendor_id'] = selectedVendor?.id;

    console.log('check add product api data >>', data);
    actions
      .addVendorProduct(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        updateState({
          isAddProductLoading: false,
          isAddProductModal: false,
        });
        showSuccess(res?.message);
        setTimeout(() => {
          navigation.navigate(navigationStrings.ROYO_VENDOR_ADD_PRODUCT, {
            productDetail: res?.data?.product_detail,
            onCallBack: () => {
              updateState({pageNo: 1});
              getAllProducts(undefined);
            },
          });
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        errorMethod(err);
      });
  };

  const _getVendorCategories = (selectedVendor) => {
    console.log('selectedVendorselectedVendor', selectedVendor);
    actions
      .getVendorCategories(
        {
          vendor_id: selectedVendor?.id,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          vendorCategories: res?.data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(selectedVendor, err);
        // errorMethod(err);
      });
  };

  const mainViewModal = () => {
    return (
      <View
        style={{
          minHeight: moderateScale(100),
          borderTopWidth: 0.7,
          borderTopColor: colors.blackOpacity43,
          paddingHorizontal: moderateScale(15),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: moderateScale(20),
          }}>
          <TextInputWithUnderlineAndLabel
            label={'Product Name'}
            labelStyle={styles.labelStyle}
            placeholder={''}
            value={productName}
            onChangeText={(text) => {
              updateState({
                productName: text,
                productSKU: !!skuDefault
                  ? skuDefault.concat(text).replace(/ /g, '')
                  : '',
                productSlug: text.replace(/ /g, ''),
              });
            }}
            mainStyle={{flex: 0.4}}
            placeholderTextColor={colors.textGreyB}
            txtInputStyle={styles.textInputStyle}
            autoFocus
          />
          <View style={{flex: 0.56}}>
            <Text style={styles.labelStyle}>Category</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                updateState({
                  isVendorCategory: !isVendorCategory,
                });
              }}
              style={styles.selectedCategory}>
              <Text style={styles.labelStyle}>
                {!isEmpty(selectedVendorCategory)
                  ? selectedVendorCategory.hierarchy
                  : 'Select a category'}
              </Text>
              <Image source={imagePath.icDropdown} />
            </TouchableOpacity>

            {!!isVendorCategory && (
              <View style={styles.categorySelectDropDownView}>
                <ScrollView>
                  {!isEmpty(vendorCategories) ? (
                    vendorCategories.map((itm, indx) => {
                      return (
                        <TouchableOpacity
                          onPress={() =>
                            updateState({
                              selectedVendorCategory: itm,
                              isVendorCategory: false,
                            })
                          }
                          style={styles.categoryItm}
                          key={String(indx)}>
                          <Text style={{flex: 0.95}} numberOfLines={1}>
                            {itm.hierarchy}
                          </Text>
                          {selectedVendorCategory.id == itm.id && (
                            <Image
                              source={imagePath.tick2}
                              style={{tintColor: themeColors.primary_color}}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <View
                      style={{
                        ...styles.noDataFound,
                        backgroundColor: colors.white,
                      }}>
                      <Text
                        style={{
                          fontFamily: fontFamily.medium,
                          fontSize: moderateScale(13),
                        }}>
                        {strings.NODATAFOUND}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
        <TextInputWithUnderlineAndLabel
          label={`SKU ( a-z, A-Z,0-9,-,…)`}
          labelStyle={styles.labelStyle}
          placeholder={'xyz.LocalMarket.Tshirt'}
          value={productSKU}
          onChangeText={(text) => {
            updateState({
              productSKU: text,
            });
          }}
          placeholderTextColor={colors.textGreyB}
          txtInputStyle={styles.textInputStyle}
          mainStyle={{marginTop: moderateScale(5)}}
        />
        <TextInputWithUnderlineAndLabel
          label={`Url Slug`}
          labelStyle={styles.labelStyle}
          placeholder={'Slug'}
          value={productSlug}
          onChangeText={(text) => {
            updateState({
              productSlug: text,
            });
          }}
          placeholderTextColor={colors.textGreyB}
          txtInputStyle={styles.textInputStyle}
          mainStyle={{marginTop: moderateScale(5)}}
        />
        <ButtonWithLoader
          isLoading={isAddProductLoading}
          onPress={onAddProduct}
          btnStyle={{
            marginBottom: 10,
            borderWidth: 0,
            backgroundColor: themeColors.primary_color,
          }}
          btnTextStyle={{
            color: colors.white,
          }}
          btnText={strings.ADD_PRODUCT}
        />
      </View>
    );
  };

  const onProductDelete = ({item}) => {
    updateState({
      isLoading: true,
    });

    actions
      .deleteVendorProduct(
        {product_id: item?.id},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        showSuccess(res?.message);
        let temp = cloneDeep(productListData);
        temp = temp.filter((el) => el.id != item?.id);
        updateState({
          isLoadingB: true,
          isLoading: false,
          productListData: temp,
        });
      })
      .catch(errorMethod);
  };

  const onVendorSelect = (item) => {
    console.log('selectedVendorselectedVendor', selectedVendor);
    updateState({
      selectedVendor: item,
      isVendorSelectModal: false,
      pageNo: 1,
    });
    setTimeout(() => {
      actions.savedSelectedVendor(item);
    }, 300);
  };

  return (
    <WrapperContainer isLoadingB={isLoading} source={loaderOne}>
      <Header
        centerTitle={`${headerText} ${
          !isEmpty(selectedVendor) ? `| ${selectedVendor?.name}` : ''
        } `}
        noLeftIcon
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
      />

      <View style={styles.container}>
        <MultiScreen
          tabTextStyle={{marginTop: moderateScaleVertical(0)}}
          screenName={topTabs}
          selectedScreen={(index) => selectedOrder(index)}
          selectedScreenIndex={activeIndex}
          scrollEnabled={topTabs.length > 4 ? true : false}
          mainViewStyle={{
            paddingRight: topTabs.length > 4 ? 0 : moderateScale(20),
          }}
          scrollViewStyle={{
            justifyContent:
              topTabs.length > 2 ? 'space-between' : 'space-evenly',
          }}
        />
        {activeIndex == 0 ? (
          <View
            style={{
              flex: 1,
              paddingBottom:
                Platform.OS === 'ios' ? moderateScaleVertical(70) : 0,
            }}>
            <SwipeListView
              refreshControl={
                <RefreshControl
                  onRefresh={handleRefresh}
                  refreshing={isRefreshing}
                />
              }
              onEndReached={onEndReachedDelayed}
              ListEmptyComponent={() => {
                return (
                  <View style={styles.emptyCartBody}>
                    <Image source={imagePath.emptyCartRoyo} />
                  </View>
                );
              }}
              data={productListData} //productListData
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              renderHiddenItem={(data, rowMap) => (
                <View style={styles.rowReverse}>
                  <TouchableOpacity
                    onPress={() => onProductDelete(data)}
                    style={{
                      ...styles.hiddenButton,
                      backgroundColor: '#FFC8C8',
                    }}>
                    <Image source={imagePath.deleteRoyo} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('check product data', data);
                      // return;
                      navigation.navigate(
                        navigationStrings.ROYO_VENDOR_ADD_PRODUCT,
                        {
                          productDetail: data.item,
                          onCallBack: getAllProducts,
                        },
                      );
                    }}
                    style={{
                      ...styles.hiddenButton,
                      backgroundColor: '#C8F3FF',
                    }}>
                    <Image source={imagePath.editRoyo} />
                  </TouchableOpacity>
                </View>
              )}
              disableRightSwipe
              rightOpenValue={-moderateScale(100)}
            />
            <ButtonWithLoader
              onPress={() =>
                updateState({
                  isAddProductModal: true,
                  skuDefault: `xyz.${selectedVendor.name.replace(/ /g, '')}.`,
                })
              }
              btnStyle={styles.productBtn}
              btnTextStyle={{color: colors.black}}
              btnText={`+ ${strings.PRODUCT}`}
            />
          </View>
        ) : null}
        {activeIndex == 1 ? (
          <View
            style={{
              flex: 0.9,
              // alignItems: 'center',
              paddingBottom:
                Platform.OS === 'ios' ? moderateScaleVertical(0) : 0,
            }}>
            <FlatList
              data={category_list}
              keyExtractor={(item, index) => index}
              bounces={false}
              showsVerticalScrollIndicator={false}
              numColumns={width > 600 ? 5 : 3}
              renderItem={renderCatogry}
              style={{
                alignSelf: category_list.length > 2 ? 'center' : 'flex-start',
                marginLeft: category_list.length > 2 ? 0 : moderateScale(20),
              }}
            />

            {/* <ButtonWithLoader
              onPress={() =>
                navigation.navigate(navigationStrings.ROYO_VENDOR_ADD_PRODUCT, {
                  vendor_list,
                })
              }
              btnStyle={styles.categoryBtn}
              btnText="+ category"
              btnTextStyle={{color: colors.black}}
            /> */}
          </View>
        ) : null}
      </View>
      <ModalView
        isVisible={isAddProductModal}
        onClose={onCloseModal}
        mainViewStyle={{
          minHeight: moderateScale(350),
          backgroundColor: colors.white,
          paddingTop: moderateScaleVertical(10),
        }}
        modalMainContent={mainViewModal}
        centerTitle={strings.ADD_PRODUCT}
        topCustomComponent={false}
        leftIcon={false}
        rightIcon={imagePath.ic_cross}
        rightIconStyle={{tintColor: colors.black}}
      />

      <Modal
        isVisible={isVendorSelectModal}
        style={{
          margin: 0,
        }}>
        <View style={{flex: 1, backgroundColor: colors.white}}>
          <SelectVendorListModal
            vendorList={vendor_list}
            onCloseModal={() => updateState({isVendorSelectModal: false})}
            onVendorSelect={(item) => onVendorSelect(item)}
            selectedVendor={selectedVendor}
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default RoyoProducts;

const styles = StyleSheet.create({
  font16Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: '#4CB549',
    marginRight: moderateScale(10),
  },
  container: {
    flex: 1,
  },
  font16medium: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  textStyle: {
    color: colors.black,
    fontSize: 24,
    fontFamily: fontFamily.bold,
  },
  imageStyle: {
    width: moderateScale(60),
    height: moderateScaleVertical(60),
    borderRadius: 6,
    marginRight: moderateScale(18),
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    height: '100%',
  },
  itemBox: {
    padding: moderateScale(18),
    borderRadius: moderateScale(6),
    backgroundColor: colors.whiteSmokeColor,
    flexDirection: 'row',
    marginBottom: moderateScaleVertical(16),
  },
  font13Regular: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.blackOpacity40,
  },
  hiddenButton: {
    paddingHorizontal: moderateScale(14),
    marginBottom: moderateScale(16),
    borderRadius: moderateScaleVertical(8),
    justifyContent: 'center',
    marginLeft: moderateScale(8),
  },
  categoryItem: {
    alignSelf: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(16),
    marginBottom: moderateScaleVertical(8),
    borderRadius: moderateScaleVertical(6),
  },
  productBtn: {
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? moderateScale(75) : moderateScale(5),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
    right: 10,
    backgroundColor: colors.white,
  },
  categoryBtn: {
    position: 'absolute',
    padding: moderateScale(10),
    bottom: moderateScaleVertical(20),
    right: moderateScale(10),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
  },
  emptyCartBody: {
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(600),
  },
  labelStyle: {
    fontFamily: fontFamily.bold,
    color: colors.blackOpacity43,
    fontSize: textScale(13),
    marginBottom: moderateScale(5),
  },
  addProductBtn: {
    color: colors.white,
    fontSize: textScale(14),
  },
  textInputStyle: {
    fontFamily: fontFamily.bold,
    color: colors.black,
    fontSize: textScale(13),
  },
  noDataFound: {
    width: '100%',
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySelectDropDownView: {
    borderWidth: 1,
    borderColor: colors.blackOpacity20,
    borderRadius: 5,
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(5),
    maxHeight: moderateScale(100),
  },
  categoryItm: {
    marginBottom: moderateScale(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.textGreyB,
    paddingBottom: 8,
  },
});
