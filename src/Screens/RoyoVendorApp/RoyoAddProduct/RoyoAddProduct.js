import {cloneDeep, isEmpty, update} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import CustomDropDownWIthLabel from '../../../Components/CustomDropDownWIthLabel';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings, {changeLaguage} from '../../../constants/lang';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {cameraHandler} from '../../../utils/commonFunction';
import {showError, showSuccess} from '../../../utils/helperFunctions';
import ModalDropdown from 'react-native-modal-dropdown';
import {FlatList, TouchableHighlight} from 'react-native-gesture-handler';
import {hitSlopProp} from '../../../styles/commonStyles';

const RoyoAddProduct = ({route, navigation}) => {
  const paramData = route.params;
  const productDetailParam = paramData?.productDetail;
  console.log(productDetailParam, 'productDetailParamproductDetailParam');
  const {appData, themeColors, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const [state, setState] = useState({
    isLoading: true,
    isLoadingB: false,
    stepPoints: [
      {
        id: 1,
        name: 'General  >',
      },
      {
        id: 2,
        name: 'Pricing   >',
      },
      {
        id: 3,
        name: 'Other Information',
      },
    ],
    currentStepIndex: 0,
    isOn: false,
    productName: productDetailParam?.title || '',
    productSKU: productDetailParam?.sku || '',
    productSlug: productDetailParam?.url_slug || '',
    addons: [],
    brands: [],
    celebrities: [],
    clientLanguages: [],
    configData: {},
    productVariants: [],
    taxCategory: [],
    productImages: [],
    isLangugaeDropDown: false,
    selectedLang: {},
    selectedAddon: {},
    childVariant: [],
    variantSet: [],
    optionsSet: [],
    createdVariantSets: [],
    exisitingVariants: [],
  });
  const {
    isLoading,
    isLoadingB,
    stepPoints,
    currentStepIndex,
    isOn,
    productName,
    productSKU,
    productSlug,
    addons,
    brands,
    celebrities,
    clientLanguages,
    configData,
    productVariants,
    taxCategory,
    productImages,
    isLangugaeDropDown,
    selectedLang,
    selectedAddon,
    childVariant,
    variantSet,
    optionsSet,
    createdVariantSets,
    exisitingVariants,
  } = state;

  useEffect(() => {
    if (isLoading) {
      getVendorProductDetailByID();
    }
  }, [isLoading]);

  const getVendorProductDetailByID = () => {
    actions
      .getVendorProductDetail(
        {
          product_id: productDetailParam?.id || '',
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          addons: res?.data?.addons,
          brands: res?.data?.brands,
          celebrities: res?.data?.celebrities,
          clientLanguages: res?.data?.client_languages,
          configData: res?.data?.config_data,
          productVariants: res?.data?.product_variants,
          taxCategory: res?.data?.tax_category,
          exisitingVariants: res?.data?.product_detail?.variant,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
    });
    showError(error?.message || error?.error);
  };

  const updateState = (data) => {
    setState((state) => {
      return {...state, ...data};
    });
  };

  const customRight = () => {
    return (
      <GradientButton
        colorsArray={[themeColors.primary_color, themeColors.primary_color]}
        textStyle={styles.addProductBtn}
        marginTop={moderateScaleVertical(20)}
        marginBottom={moderateScaleVertical(20)}
        btnText={strings.SAVE}
        containerStyle={{height: moderateScale(30), width: moderateScale(60)}}
        btnStyle={{borderRadius: 5}}
      />
    );
  };

  const onStepChange = (itm, indx) => {
    updateState({
      currentStepIndex: indx,
    });
  };

  const renderStepIndicator = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => onStepChange(item, index)}
        style={{marginRight: moderateScale(12)}}>
        <Text
          style={{
            color:
              currentStepIndex >= index
                ? themeColors.primary_color
                : colors.black,
            fontSize: textScale(14),
            fontFamily: fontFamily.bold,
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const _toggleOnOff = (isOn) => {
    updateState({
      isOn: isOn ? true : false,
    });
  };

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const cameraHandle = (index) => {
    if (index == 0 || index == 1) {
      cameraHandler(index, {
        width: 300,
        height: 400,
        cropping: false,
        cropperCircleOverlay: false,
        compressImageQuality: 0.5,
        mediaType: 'photo',
      })
        .then((res) => {
          if (res && (res?.sourceURL || res?.path)) {
            let file = {
              image_id: Math.random(),
              name:
                Platform.OS == 'ios'
                  ? res?.filename
                  : res?.path.substring(res?.path.lastIndexOf('/') + 1),
              type: res?.mime,
              uri: res?.sourceURL || res?.path,
            };
            updateState({productImages: [...productImages, file]});
          }
        })
        .catch((err) => {});
    }
  };

  /***********Remove product images */
  const _removeImageFromList = (selectdImage) => {
    if (selectdImage?.id) {
      let copyArrayImages = cloneDeep(productImages);

      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id,
      );
      updateState({
        productImages: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(productImages);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        productImages: copyArrayImages,
      });
    }
  };

  const selectLanguage = (item) => {
    console.log(item, 'sdhfjsdfjsdfjh');
  };

  const onSelect = (idx, value) => {
    console.log(idx);
  };

  const renderRowComponent = (item, sdf) => {
    console.log(item, 'itemitem', sdf);
    return (
      <TouchableHighlight
        style={{
          height: moderateScale(35),
        }}></TouchableHighlight>
    );
  };

  const onProductVariant = (parent_variant, child_variant) => {
    const childVariantAry = [...childVariant];
    const variantSetAry = [...variantSet];
    const optionsSetAry = [...optionsSet];
    let variantSetString = `${parent_variant?.id};${parent_variant?.title}`;
    const optionsSetString = `${child_variant?.id};${child_variant?.title}`;

    if (
      childVariantAry.includes(child_variant) ||
      optionsSetAry.includes(optionsSetString)
    ) {
      const filteredChildVariant = childVariantAry.filter(
        (item) => item.id !== child_variant?.id,
      );
      const filteredOptionsSet = optionsSetAry.filter(
        (item) => item !== optionsSetString,
      );

      let idx = variantSetAry.indexOf(variantSetString);
      if (idx >= 0) {
        variantSetAry.splice(idx, 1);
      }

      updateState({
        childVariant: filteredChildVariant,
        variantSet: variantSetAry,
        optionsSet: filteredOptionsSet,
      });
    } else {
      updateState({
        childVariant: [...childVariantAry, child_variant],
        variantSet: [...variantSetAry, variantSetString],
        optionsSet: [...optionsSetAry, optionsSetString],
      });
    }
  };

  const isChecked = (itm) => {
    const childVariantAry = [...childVariant];
    return childVariantAry.some((item) => item.id === itm.id);
  };

  const renderProductVariants = (item, index) => {
    return (
      <View style={{marginBottom: moderateScale(15)}}>
        <Text style={styles.variantName}>{item?.title}</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {item?.option.map((itm, indx) => {
            return (
              <TouchableOpacity
                onPress={() => onProductVariant(item, itm)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: moderateScale(5),
                  marginRight: moderateScale(20),
                }}>
                <Image
                  source={
                    isChecked(itm) ? imagePath.icCheck1 : imagePath.icCheck2
                  }
                />
                <Text style={styles.variantTypeTxt}>{itm?.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const onMakeVariantSet = () => {
    updateState({
      isLoadingB: true,
    });
    var formData = new FormData();
    formData.append('product_id', productDetailParam?.id || '');
    formData.append('sku', productDetailParam?.sku || '');
    variantSet.map((itm) => {
      formData.append('variantIds[]', itm);
    });
    optionsSet.map((itm) => {
      formData.append('optionIds[]', itm);
    });
    console.log(variantSet, 'variantSet>>>>');
    console.log(optionsSet, 'optionsSet>>>>');
    console.log(formData, 'formData>>>');

    actions
      .createProductVariant(formData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, '>>>>>responseFromServer');
        updateState({isLoadingB: false, createdVariantSets: res?.data});
      })
      .catch(errorMethod);
  };

  const onDeleteProductVariant = (item) => {
    updateState({
      isLoadingB: true,
    });
    actions
      .deleteProductVariant(
        {
          product_id: item?.product_id,
          variant_id: item?.id,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        showSuccess(res?.message);
        setTimeout(() => {
          updateState({
            isLoading: true,
            isLoadingB: false,
            createdVariantSets: [],
          });
        }, 500);
      })
      .catch(errorMethod);
  };

  const renderCreatedVariants = ({item, indx}) => {
    return (
      <View
        style={{
          ...styles.seoViewStyle,
          backgroundColor: colors.lightGreen,
          borderWidth: 0,
          marginTop: moderateScale(10),
        }}>
        <View
          style={{
            ...styles.flexRowStyle,
          }}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.labelStyle}>Image</Text>

            <Image source={imagePath.icImagePlaceholder} />
          </View>
          <TextInputWithUnderlineAndLabel
            label={`Name`}
            labelStyle={styles.labelStyle}
            placeholder={'0'}
            value={item?.title || item?.sku}
            mainStyle={{flex: 0.55}}
            placeholderTextColor={colors.black}
            txtInputStyle={styles.textInputStyle}
          />
          <TextInputWithUnderlineAndLabel
            label={'Quantity'}
            placeholder={'0'}
            mainStyle={{flex: 0.25}}
            labelStyle={styles.labelStyle}
            placeholderTextColor={colors.black}
            txtInputStyle={styles.textInputStyle}
          />
          <TouchableOpacity
            hitSlop={hitSlopProp}
            onPress={() => onDeleteProductVariant(item)}>
            <Image source={imagePath.icDelete} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...styles.flexRowStyle,
          }}>
          <TextInputWithUnderlineAndLabel
            label={`Price`}
            labelStyle={styles.labelStyle}
            placeholder={'0'}
            mainStyle={{flex: 0.2}}
            placeholderTextColor={colors.black}
            txtInputStyle={styles.textInputStyle}
          />
          <TextInputWithUnderlineAndLabel
            label={`Cost price`}
            labelStyle={styles.labelStyle}
            placeholder={'0'}
            mainStyle={{flex: 0.25}}
            placeholderTextColor={colors.black}
            txtInputStyle={styles.textInputStyle}
          />
          <TextInputWithUnderlineAndLabel
            label={'Compare at price'}
            placeholder={'0'}
            mainStyle={{flex: 0.45}}
            labelStyle={styles.labelStyle}
            placeholderTextColor={colors.black}
            txtInputStyle={styles.textInputStyle}
          />
        </View>
      </View>
    );
  };

  return (
    <WrapperContainer source={loaderOne} isLoadingB={isLoading || isLoadingB}>
      <Header
        leftIcon={imagePath.backRoyo}
        centerTitle={productDetailParam?.title || ''}
        customRight={customRight}
      />
      <View style={{...styles.stepBarView, marginTop: moderateScale(10)}}>
        {stepPoints.map(renderStepIndicator)}
      </View>

      <KeyboardAwareScrollView
        // scrollEnabled={!isLangugaeDropDown}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        bounces={false}>
        {currentStepIndex == 0 ? (
          <View>
            <View style={styles.mainViewStyle}>
              <View
                style={{
                  ...styles.flexRowStyle,
                  marginTop: moderateScale(20),
                  marginHorizontal: moderateScale(15),
                }}>
                <TextInputWithUnderlineAndLabel
                  label={`SKU ( a-z, A-Z,0-9,-,…)`}
                  labelStyle={styles.labelStyle}
                  placeholder={'xyz.LocalMarket.Tshirt'}
                  value={productSKU}
                  mainStyle={{flex: 0.6}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={'Url Slug'}
                  placeholder={'tshirt'}
                  mainStyle={{flex: 0.35}}
                  value={productSlug}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>
            <View
              style={{
                ...styles.stepBarView,
                marginTop: moderateScale(40),
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                }}>
                Product Information
              </Text>
              <ModalDropdown
                options={clientLanguages}
                style={{
                  alignSelf: 'center',
                  width: moderateScale(65),
                }}
                textStyle={{
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(12),
                }}
                defaultValue={
                  isEmpty(clientLanguages) ? '' : clientLanguages[0].langTitle
                }
                onSelect={(idx, value) => updateState({selectedLang: value})}
                renderButtonText={(rowData) => (
                  <Text>{rowData?.langTitle}</Text>
                )}
                renderRow={(rowData) => (
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="cornflowerblue"
                    style={{backgroundColor: colors.white}}>
                    <Text
                      style={{
                        paddingVertical: 10,
                        marginHorizontal: 10,
                      }}>{`${rowData.langTitle}`}</Text>
                  </TouchableHighlight>
                )}
                dropdownStyle={{
                  width: moderateScale(100),
                  marginTop: moderateScale(10),
                }}
                dropdownTextStyle={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.regular,
                }}
                renderRightComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                    }}>
                    <Image source={imagePath.icDropdown} />
                  </View>
                )}
              />
            </View>
            <View
              style={{
                ...styles.mainViewStyle,
                paddingHorizontal: moderateScale(15),
                zIndex: -5,
              }}>
              <TextInputWithUnderlineAndLabel
                label={'Product Name'}
                placeholder={'tshirt'}
                labelStyle={styles.labelStyle}
                value={productName}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
                mainStyle={{
                  marginTop: moderateScale(20),
                }}
              />
              <TextInputWithUnderlineAndLabel
                label={'Product Description'}
                placeholder={'Lorem ipsum'}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
              <View style={styles.seoViewStyle}>
                <View
                  style={{
                    ...styles.flexRowStyle,
                    alignItems: 'center',
                  }}>
                  <Text>SEO</Text>
                  <Image source={imagePath.icUpArrow} />
                </View>
                <View
                  style={{
                    ...styles.flexRowStyle,
                    marginTop: moderateScale(20),
                  }}>
                  <TextInputWithUnderlineAndLabel
                    label={`Meta Title`}
                    labelStyle={styles.labelStyle}
                    placeholder={'xyz'}
                    mainStyle={{flex: 0.48}}
                    placeholderTextColor={colors.black}
                    txtInputStyle={styles.textInputStyle}
                  />
                  <TextInputWithUnderlineAndLabel
                    label={'Meta Keyword'}
                    placeholder={'xyz'}
                    mainStyle={{flex: 0.48}}
                    labelStyle={styles.labelStyle}
                    placeholderTextColor={colors.black}
                    txtInputStyle={styles.textInputStyle}
                  />
                </View>
                <TextInputWithUnderlineAndLabel
                  label={'Meta Descripton'}
                  placeholder={'Lorem ipsum'}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>

            <View
              style={{
                ...styles.stepBarView,
                marginTop: moderateScale(40),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                }}>
                Product Image
              </Text>
            </View>
            <View
              style={{
                ...styles.mainViewStyle,
                paddingHorizontal: moderateScale(15),
                paddingVertical: moderateScale(10),
                alignItems: 'center',
              }}>
              {!!(productImages && productImages.length)
                ? productImages.map((i, inx) => {
                    return (
                      <ImageBackground
                        source={{
                          uri: i.uri,
                        }}
                        style={styles.imageOrderStyle}
                        imageStyle={styles.imageOrderStyle}>
                        <View style={styles.viewOverImage}>
                          <View
                            style={{
                              position: 'absolute',
                              top: -10,
                              right: -10,
                            }}>
                            <TouchableOpacity
                              onPress={() => _removeImageFromList(i)}>
                              <Image source={imagePath.icRemoveIcon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </ImageBackground>
                    );
                  })
                : null}
              <TouchableOpacity onPress={showActionSheet} activeOpacity={0.7}>
                <Image source={imagePath.icPlaceholder} />
              </TouchableOpacity>
            </View>
          </View>
        ) : currentStepIndex == 1 ? (
          <View
            style={{
              ...styles.mainViewStyle,
              paddingHorizontal: moderateScale(15),
            }}>
            <View
              style={{
                ...styles.flexRowStyle,
                marginTop: moderateScale(20),
              }}>
              <TextInputWithUnderlineAndLabel
                label={`Price`}
                labelStyle={styles.labelStyle}
                placeholder={'645'}
                mainStyle={{flex: 0.2}}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
              <TextInputWithUnderlineAndLabel
                label={'Compare at price'}
                placeholder={'890'}
                mainStyle={{flex: 0.4}}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
              <View style={{flex: 0.31}}>
                <Text style={styles.labelStyle}>Track inventory</Text>
                <ToggleSwitch
                  isOn={isOn}
                  onColor={themeColors.primary_color}
                  offColor={colors.textGreyB}
                  size="medium"
                  onToggle={(isOn) => _toggleOnOff(isOn)}
                  animationSpeed={400}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.labelStyle}>Variant Information</Text>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                onPress={onMakeVariantSet}
                textStyle={styles.addProductBtn}
                marginTop={moderateScaleVertical(20)}
                marginBottom={moderateScaleVertical(20)}
                btnText={'Make variant set'}
                containerStyle={{
                  height: moderateScale(30),
                  width: moderateScale(130),
                }}
                btnStyle={{borderRadius: 5}}
              />
            </View>
            {console.log(exisitingVariants, 'exisitingVariants')}
            {productVariants.map(renderProductVariants)}
            <View style={{height: 1, backgroundColor: colors.blackOpacity10}} />
            {!isEmpty(exisitingVariants) && (
              <View>
                <Text
                  style={{
                    ...styles.labelStyle,
                    marginTop: moderateScale(20),
                    color: colors.black,
                  }}>
                  Applied Variants Set
                </Text>
                <FlatList
                  data={exisitingVariants}
                  renderItem={renderCreatedVariants}
                />
              </View>
            )}
            {!isEmpty(createdVariantSets) && (
              <View>
                <Text
                  style={{
                    ...styles.labelStyle,
                    marginTop: moderateScale(20),
                    color: colors.black,
                  }}>
                  New Variants Set
                </Text>
                <FlatList
                  data={createdVariantSets}
                  renderItem={renderCreatedVariants}
                />
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              ...styles.mainViewStyle,
              paddingHorizontal: moderateScale(15),
            }}>
            <View
              style={{
                ...styles.flexRowStyle,
                marginTop: moderateScale(20),
              }}>
              <View
                style={{
                  flex: 0.45,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.textGreyB,
                }}>
                <Text style={{...styles.labelStyle}}>Select Add on set</Text>
                <ModalDropdown
                  options={addons}
                  textStyle={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                  }}
                  defaultValue={isEmpty(addons) ? '' : addons[0].title}
                  onSelect={(idx, value) => updateState({selectedAddon: value})}
                  renderButtonText={(rowData) => <Text>{rowData?.title}</Text>}
                  renderRow={(rowData) => (
                    <TouchableHighlight
                      activeOpacity={0.6}
                      underlayColor="cornflowerblue"
                      style={{backgroundColor: colors.white}}>
                      <Text
                        style={{
                          paddingVertical: 10,
                          marginHorizontal: 10,
                        }}>{`${rowData.title}`}</Text>
                    </TouchableHighlight>
                  )}
                  dropdownStyle={{
                    minWidth: moderateScale(100),
                    marginTop: moderateScale(10),
                    height: moderateScaleVertical(100),
                  }}
                  dropdownTextStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.regular,
                  }}
                  renderRightComponent={() => (
                    <Image
                      source={imagePath.icDropdown}
                      style={{marginLeft: moderateScale(65)}}
                    />
                  )}
                />
              </View>

              <TextInputWithUnderlineAndLabel
                label={'Up sell products'}
                placeholder={'890'}
                mainStyle={{flex: 0.45}}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
                marginBottom={0}
              />
            </View>
            <View
              style={{
                ...styles.flexRowStyle,
                marginTop: moderateScale(10),
              }}>
              <TextInputWithUnderlineAndLabel
                label={`Cross sell products`}
                labelStyle={styles.labelStyle}
                placeholder={'645'}
                mainStyle={{flex: 0.45}}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
              <TextInputWithUnderlineAndLabel
                label={'Related products'}
                placeholder={'890'}
                mainStyle={{flex: 0.45}}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.black}
                txtInputStyle={styles.textInputStyle}
              />
            </View>

            <View
              style={{
                ...styles.seoViewStyle,
                borderWidth: 0,
                marginTop: moderateScale(10),
              }}>
              <View
                style={{
                  ...styles.flexRowStyle,
                  alignItems: 'center',
                  marginTop: moderateScale(20),
                }}>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>New</Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>Featured</Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>Inquiry only</Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  marginTop: moderateScale(15),
                  marginBottom: moderateScale(35),
                  flexDirection: 'row',
                }}>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>Requires prescription</Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>
                    Requires last mile delivery
                  </Text>
                  <ToggleSwitch
                    isOn={isOn}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) => _toggleOnOff(isOn)}
                    animationSpeed={400}
                  />
                </View>
              </View>

              <View
                style={{
                  ...styles.flexRowStyle,
                  marginBottom: moderateScaleVertical(25),
                }}>
                <TextInputWithUnderlineAndLabel
                  label={`Live`}
                  labelStyle={styles.labelStyle}
                  placeholder={'56'}
                  mainStyle={{flex: 0.31}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                  rightIcon={imagePath.icDropdown}
                  onRightPress={() => {}}
                  marginBottom={0}
                />
                <TextInputWithUnderlineAndLabel
                  label={`Brand`}
                  labelStyle={styles.labelStyle}
                  placeholder={'235'}
                  mainStyle={{flex: 0.31}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                  rightIcon={imagePath.icDropdown}
                  onRightPress={() => {}}
                  marginBottom={0}
                />
                <View
                  style={{
                    flex: 0.31,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.textGreyB,
                  }}>
                  <Text style={{...styles.labelStyle}}>Tax Category</Text>
                  <ModalDropdown
                    options={taxCategory}
                    textStyle={{
                      fontFamily: fontFamily.regular,
                      fontSize: textScale(12),
                    }}
                    defaultValue={
                      isEmpty(taxCategory) ? '' : taxCategory[0].title
                    }
                    onSelect={(idx, value) =>
                      updateState({selectedTaxCategory: value})
                    }
                    renderButtonText={(rowData) => (
                      <Text>{rowData?.title}</Text>
                    )}
                    renderRow={(rowData) => (
                      <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="cornflowerblue"
                        style={{backgroundColor: colors.white}}>
                        <Text
                          style={{
                            paddingVertical: 10,
                            marginHorizontal: 10,
                          }}>{`${rowData.title}`}</Text>
                      </TouchableHighlight>
                    )}
                    dropdownStyle={{
                      minWidth: moderateScale(100),
                      marginTop: moderateScale(10),
                      height: moderateScaleVertical(80),
                    }}
                    dropdownTextStyle={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.regular,
                    }}
                    renderRightComponent={() => (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                        }}>
                        <Image source={imagePath.icDropdown} style={{}} />
                      </View>
                    )}
                  />
                </View>
              </View>
              <View
                style={{
                  ...styles.flexRowStyle,
                }}>
                <TextInputWithUnderlineAndLabel
                  label={`Select delay time`}
                  labelStyle={styles.labelStyle}
                  placeholder={'hrs'}
                  mainStyle={{flex: 0.45}}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={'Up sell products'}
                  placeholder={'minutes'}
                  mainStyle={{flex: 0.45}}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.black}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => cameraHandle(index)}
      />
    </WrapperContainer>
  );
};

export default RoyoAddProduct;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  mainViewStyle: {
    backgroundColor: colors.blackOpacity05,
    paddingBottom: moderateScale(20),
  },
  stepBarView: {
    height: moderateScale(45),
    backgroundColor: colors.blackOpacity10,
    paddingHorizontal: moderateScale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },

  labelStyle: {
    fontFamily: fontFamily.bold,
    color: colors.blackOpacity43,
    fontSize: textScale(12),
    marginBottom: moderateScale(10),
  },
  textInputStyle: {
    fontFamily: fontFamily.medium,
    color: colors.black,
    fontSize: textScale(13),
  },
  seoViewStyle: {
    borderWidth: 0.7,
    borderColor: colors.blackOpacity20,
    borderRadius: moderateScale(5),
    backgroundColor: colors.white,
    padding: moderateScale(10),
  },
  flexRowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addProductBtn: {
    textTransform: 'none',
  },
  variantTypeTxt: {
    fontSize: textScale(11),
    fontFamily: fontFamily.regular,
    marginLeft: moderateScale(5),
  },
  variantName: {
    fontSize: textScale(12),
    fontFamily: fontFamily.bold,
  },
  imageOrderStyle: {
    height: width / 4,
    width: '94%',
    borderRadius: 5,
    marginBottom: moderateScaleVertical(10),
    marginLeft: moderateScale(6),
  },
  viewOverImage: {
    height: width / 5,
    width: '95%',
    borderRadius: 5,
  },
});
