import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
//custom components
import SearchBar2 from '../../../Components/NewComponents/SearchBar2';
import TopHeader from '../../../Components/NewComponents/TopHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
//styling
import colors from '../../../styles/colors';
import {
    height,
    moderateScale,
    moderateScaleVertical,
    textScale,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import styleFun from './styles';
//constants
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
//3rd party
import { debounce, isEmpty } from 'lodash';
import deviceInfoModule from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import Header from '../../../Components/Header';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import {
    getColorCodeWithOpactiyNumber,
    getImageUrl,
    showError,
} from '../../../utils/helperFunctions';

import { MultiSelect } from 'react-native-element-dropdown';
import FastImage from 'react-native-fast-image';
import GradientView from '../../../Components/GradientView';
import {
    checkValueExistInAry,
    tokenConverterPlusCurrencyNumberFormater,
} from '../../../utils/commonFunction';
import OoryksHeader from '../../../Components/OoryksHeader';

const P2pOndemandProducts = ({ route, navigation }) => {
    const flatlistRef = useRef(null);
    const paramData = route?.params?.data;
    const {
        appData,
        currencies,
        languages,
        appStyle,
        themeColors,
        themeToggle,
        themeColor,
    } = useSelector((state) => state?.initBoot);
    const { userData } = useSelector((state) => state?.auth);
    const { additional_preferences, digit_after_decimal } =
        appData?.profile?.preferences || {};
    const darkthemeusingDevice = useDarkMode();
    const fontFamily = appStyle?.fontSizeData;
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const styles = styleFun({ themeColor, themeToggle, fontFamily });

    const [isLoading, setIsLoading] = useState(true);
    const [p2pProducts, setP2pProducts] = useState([]);
    const [attributeInfo, setAttributeInfo] = useState([]);
    const [isAttributeFilterModal, setIsAttributeFilterModal] = useState(false);
    const [isLoadMore, setLoadMore] = useState(false);
    const [pageNo, setPageNo] = useState(1);

    useEffect(() => {
        getP2pProductsByCategoryId();
        if (!!userData?.auth_token) {
            getListOfAvailableAttributes();
        }
    }, []);

    const getListOfAvailableAttributes = () => {
        actions
            .getAvailableAttributes(
                `?category_id=${paramData?.id}`,
                {},
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                },
            )
            .then((res) => {
                console.log(res, '<===response getListOfAvailableAttributes');
                setAttributeInfo(res?.data || []);
            })
            .catch((error) => showError(error?.message || error?.error));
    };

    const getP2pProductsByCategoryId = (pageNo = 1, filterAry = [], limit = 10) => {
        actions
            .getProductByP2pCategoryId(
                `/${paramData?.id}?page=${pageNo}&limit=${limit}&product_list=true&type=p2p`,
                {
                    attributes: filterAry,
                },
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                    systemuser: deviceInfoModule.getUniqueId(),
                },
            )
            .then((res) => {
                console.log(res, '<===response getP2pProductsByCategoryId');
                if (
                    res?.data?.listData?.current_page < res?.data?.listData?.last_page
                ) {
                    setLoadMore(true);
                } else {
                    setLoadMore(false);
                }
                setP2pProducts(
                    pageNo == 1
                        ? res?.data?.listData?.data
                        : [...p2pProducts, ...res?.data?.listData?.data],
                );
                setIsLoading(false);
            })
            .catch(errorMethod);
    };

    const errorMethod = (error) => {
        setIsLoading(false);
        showError(error?.message || error?.error);
    };

    const onChangeDropDownOption = (value, item) => {
        const attributeInfoData = [...attributeInfo];
        let indexOfAttributeToUpdate = attributeInfoData.findIndex(
            (itm) => itm?.id == item?.id,
        );
        attributeInfoData[indexOfAttributeToUpdate].values = value;
        setAttributeInfo(attributeInfoData);
    };

    const onPressRadioButton = (item) => {
        const attributeInfoData = [...attributeInfo];
        let indexOfAttributeToUpdate = attributeInfoData.findIndex(
            (itm) => itm?.id == item?.attribute_id,
        );
        attributeInfoData[indexOfAttributeToUpdate].values = [item?.id];
        setAttributeInfo(attributeInfoData);
    };

    const onChangeText = (text, item) => {
        const attributeInfoData = [...attributeInfo];
        let indexOfAttributeToUpdate = attributeInfoData.findIndex(
            (itm) => itm?.id == item?.id,
        );
        attributeInfoData[indexOfAttributeToUpdate].values = [text];
        setAttributeInfo(attributeInfoData);
    };

    const onPressCheckBoxes = (value, data) => {
        const attributeInfoData = [...attributeInfo];
        let indexOfAttributeToUpdate = attributeInfoData.findIndex(
            (itm) => itm?.id == value?.attribute_id,
        );
        if (!isEmpty(data?.values)) {
            let existingItmIndx = data?.values.findIndex((itm) => itm == value.id);
            if (existingItmIndx == -1) {
                attributeInfoData[indexOfAttributeToUpdate].values = [
                    ...data?.values,
                    value?.id,
                ];
            } else {
                let index = attributeInfoData[indexOfAttributeToUpdate].values.indexOf(
                    value?.id,
                );
                if (index >= 0) {
                    attributeInfoData[indexOfAttributeToUpdate].values.splice(index, 1);
                }
            }
        } else {
            attributeInfoData[indexOfAttributeToUpdate].values = [value?.id];
        }
        setAttributeInfo(attributeInfoData);
    };

    const onFilterPress = () => {
        if (!!userData?.auth_token) {
            setIsAttributeFilterModal(true);
        } else {
            actions.setRedirection('');
            actions.setAppSessionData('on_login');
        }
    };

    const onApplyAttributeFilter = () => {
        let newAttributeInfo = [...attributeInfo];
        if (isEmpty(newAttributeInfo)) {
            alert("Please select filters!")
            return
        }
        setIsAttributeFilterModal(false);
        setIsLoading(true);
        let attributeFilterAry = [];
        newAttributeInfo.map((itm) => {
            if (!isEmpty(itm?.values)) {

                attributeFilterAry.push({ attribute_id: itm?.id, options: itm?.values });
            }
        });
        flatlistRef.current.scrollToOffset({ animated: true, offset: 0 });
        getP2pProductsByCategoryId(1, attributeFilterAry);
    };

    const onClearAttributeFilter = () => {
        flatlistRef.current.scrollToOffset({ animated: true, offset: 0 });
        onResetFilter();
        setIsAttributeFilterModal(false);
        setIsLoading(true);
        getP2pProductsByCategoryId();
    };

    const onResetFilter = () => {
        const attributeInfoData = [...attributeInfo];
        attributeInfoData.map((itm) => {
            delete itm['values'];
        });
        setAttributeInfo(attributeInfoData);
    };

    const onEndReached = () => {
        if (isLoadMore) {
            setPageNo(pageNo + 1);
            getP2pProductsByCategoryId(pageNo + 1);
        }
    };

    const onEndReachedDelayed = debounce(onEndReached, 1000, {
        leading: true,
        trailing: false,
    });

    const renderP2pProducts = useCallback(
        ({ item, index }) => {
            const getImage = quality =>
                !isEmpty(item?.media)
                    ? getImageUrl(
                        item?.media[0]?.image?.path.image_fit,
                        item?.media[0]?.image?.path.image_path,
                        quality,
                    )
                    : item?.product_image;

            return (
                <View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                            navigation.navigate(navigationStrings.P2P_PRODUCT_DETAIL, {
                                product_id: item?.id,
                            })
                        }>
                        <View
                            style={{
                                flexDirection: 'row',
                                borderRadius: 12,
                                backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.whiteSmokeColor,
                                padding: 11,
                            }}>
                            <FastImage

                                source={{
                                    uri: getImage('240/240'), cache: FastImage.cacheControl.immutable,
                                    priority: FastImage.priority.high,

                                }}
                                style={{
                                    width: moderateScale(109),
                                    height: moderateScaleVertical(98),
                                    borderRadius: moderateScale(12)
                                }}
                            />
                            <View
                                style={{
                                    marginLeft: moderateScale(20),
                                    width: moderateScale(199),
                                    justifyContent: "center"
                                }}>
                                <Text style={styles.txt1}>
                                    {item?.translation[0]?.title || item?.title || item?.sku}
                                </Text>

                                {
                                    !!item?.translation_description ||
                                        !!item?.translation[0]?.translation_description
                                        ? (
                                            <Text
                                                numberOfLines={3}
                                                style={{
                                                    fontSize: textScale(10),
                                                    fontFamily: fontFamily.regular,
                                                    // lineHeight: moderateScale(14),
                                                    color: isDarkMode
                                                        ? MyDarkTheme.colors.text
                                                        : colors.blackOpacity66,
                                                    textAlign: 'left',
                                                    marginTop: moderateScaleVertical(8),
                                                }}>
                                                {!!item?.translation_description
                                                    ? item?.translation_description.toString()
                                                    : !!item?.translation[0]?.translation_description
                                                        ? item?.translation[0]?.translation_description
                                                        : ''}
                                            </Text>
                                        ) : null
                                }
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontSize: textScale(14),
                                        fontWeight: '700',
                                        fontFamily: fontFamily.regular,
                                        marginVertical: moderateScaleVertical(4),
                                        color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                                        textAlign: 'left',
                                        marginLeft: moderateScale(5),
                                        marginTop: moderateScaleVertical(12),
                                    }}>

                                    {tokenConverterPlusCurrencyNumberFormater(
                                        item?.variant[0]?.price,
                                        digit_after_decimal,
                                        additional_preferences,
                                        currencies?.primary_currency?.symbol,
                                    )} / Day
                                    <Text>


                                    </Text>
                                </Text>
                                {/* <Text style={styles.txt3}>
                  {item?.translation[0]?.title || item?.title || item?.sku}
                </Text> */}
                            </View>
                        </View>
                        {/* <FastImage
              style={styles.imgBack}
              source={{uri: getImage('700/700')}}
            /> */}
                        {/* <FastImage
              source={
                !!item?.vendor?.logo?.image_fit
                  ? {
                      uri: getImageUrl(
                        item?.vendor?.logo?.image_fit,
                        item?.vendor?.logo?.image_path,
                        '400/400',
                      ),
                    }
                  : imagePath.icProfile
              }
              style={{
                height: moderateScale(50),
                width: moderateScale(50),
                borderRadius: moderateScale(25),
                position: 'absolute',
                top: moderateScaleVertical(15),
                left: moderateScale(15),
              }}
            /> */}
                    </TouchableOpacity>

                    {/* <GradientView
            title={tokenConverterPlusCurrencyNumberFormater(
              Number(item?.variant[0]?.price),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
            colorsArray={[
              getColorCodeWithOpactiyNumber(
                themeColors?.primary_color.substr(1),
                30,
              ),
              getColorCodeWithOpactiyNumber(
                themeColors?.primary_color.substr(1),
                60,
              ),
              themeColors?.primary_color,
            ]}
            btnStyle={{ marginTop: moderateScale(4) }}
          /> */}
                </View>
            );
        },
        [p2pProducts, isLoadMore],
    );

    const renderRadioBtns = useCallback(
        (item, data, index) => {
            return (
                <TouchableOpacity
                    key={String(index)}
                    onPress={() => onPressRadioButton(item)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: moderateScale(20),
                    }}>
                    <Image
                        source={
                            !isEmpty(data?.values) && data?.values[0] == item?.id
                                ? imagePath.icActiveRadio
                                : imagePath.icInActiveRadio
                        }
                        style={{
                            tintColor:
                                !isEmpty(data?.values) && data?.values[0] == item?.id
                                    ? themeColors.primary_color
                                    : colors.blackOpacity43,
                        }}
                    />
                    <Text
                        style={{
                            fontFamily: fontFamily.regular,
                            fontSize: textScale(14),
                            marginLeft: moderateScale(6),
                        }}>
                        {item?.title}
                    </Text>
                </TouchableOpacity>
            );
        },
        [attributeInfo],
    );

    const renderCheckBoxes = useCallback(
        (item, data, index) => {
            return (
                <TouchableOpacity
                    key={String(index)}
                    onPress={() => onPressCheckBoxes(item, data)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: moderateScale(20),
                        marginBottom: moderateScaleVertical(10),
                    }}>
                    <Image
                        source={
                            checkValueExistInAry(item, data?.values)
                                ? imagePath.checkBox2Active
                                : imagePath.checkBox2InActive
                        }
                        style={{
                            tintColor: checkValueExistInAry(item, data?.values)
                                ? themeColors.primary_color
                                : colors.blackOpacity43,
                        }}
                    />
                    <Text
                        style={{
                            fontFamily: fontFamily.regular,
                            fontSize: textScale(12),
                            marginLeft: moderateScale(6),
                        }}>
                        {item?.title}
                    </Text>
                </TouchableOpacity>
            );
        },
        [attributeInfo],
    );

    const renderAttributeOptions = useCallback(
        ({ item, index }) => {
            return (
                <View>
                    <Text
                        style={{
                            ...styles.attributeTitle,
                            marginBottom: moderateScaleVertical(6),
                        }}>
                        {item?.title}
                    </Text>
                    {item?.type == 1 ? (
                        <MultiSelect
                            style={styles.multiSelect}
                            labelField="title"
                            valueField="id"
                            value={!isEmpty(item?.values) ? item?.values : []}
                            data={item?.option}
                            onChange={(value) => onChangeDropDownOption(value, item)}
                            placeholder={'Select value'}
                            fontFamily={fontFamily.regular}
                            placeholderStyle={styles.multiSelectPlaceholder}
                        />
                    ) : item?.type == 3 ? (
                        <View style={styles.radioBtn}>
                            {item?.option?.map((itm, indx) =>
                                renderRadioBtns(itm, item, indx),
                            )}
                        </View>
                    ) : item?.type == 4 ? (
                        <TextInput
                            placeholder={strings.TYPE_HERE}
                            onChangeText={(text) => onChangeText(text, item)}
                            style={styles.textInput}
                        />
                    ) : (
                        <View style={styles.checkBox}>
                            {item?.option?.map((itm, index) =>
                                renderCheckBoxes(itm, item, index),
                            )}
                        </View>
                    )}
                </View>
            );
        },
        [attributeInfo],
    );

    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            isLoading={isLoading}>
            <OoryksHeader
                leftTitle={paramData?.name || ''}
                onPressRight={onFilterPress}
                isRight
                rightIcon={imagePath.filter}


            />

            <View
                style={{
                    flex: 1,
                    paddingHorizontal: moderateScale(15),
                }}>
                <FlatList
                    ref={flatlistRef}
                    data={p2pProducts}
                    extraData={p2pProducts}
                    windowSize={4}
                    maxToRenderPerBatch={4}
                    renderItem={renderP2pProducts}
                    keyExtractor={(itm, indx) => String(indx)}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    ListEmptyComponent={() =>
                        !isLoading && (
                            <View>
                                <Image
                                    source={imagePath.noDataFound}
                                    style={{
                                        marginTop: height / 4.5,
                                        height: moderateScaleVertical(200),
                                        width: moderateScale(200),
                                        alignSelf: 'center',
                                    }}
                                />
                                <Text
                                    style={{
                                        fontFamily: fontFamily.bold,
                                        fontSize: textScale(17),
                                        textAlign: 'center',
                                    }}>
                                    {strings.NODATAFOUND}
                                </Text>
                            </View>
                        )
                    }
                    onEndReached={onEndReachedDelayed}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => (
                        <View>
                            {isLoadMore ? (
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        marginVertical: moderateScaleVertical(10)
                                    }}>
                                    Loading ...{' '}
                                </Text>
                            ) : (
                                <></>
                            )}
                        </View>
                    )}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                style={{
                    overflow: 'hidden',
                    marginHorizontal: 0,
                    marginBottom: 0,
                }}
                visible={isAttributeFilterModal}
                onRequestClose={() => setIsAttributeFilterModal(false)}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: colors.white,
                        paddingHorizontal: moderateScale(15),
                        borderTopLeftRadius: moderateScale(12),
                        borderTopRightRadius: moderateScale(12),
                    }}>
                    <TopHeader
                        onPressLeft={() => setIsAttributeFilterModal(false)}
                        onPressRight={onResetFilter}
                    />
                    <KeyboardAwareScrollView
                        showsVerticalScrollIndicator={false}
                        style={{ flexGrow: 1 }}>
                        <FlatList
                            data={attributeInfo}
                            keyboardShouldPersistTaps={'handled'}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => (
                                <View
                                    style={{
                                        height: moderateScaleVertical(18),
                                    }}
                                />
                            )}
                            renderItem={renderAttributeOptions}
                        // ListFooterComponent={listFooterComponent}
                        />
                        <View style={styles.btnStyle}>
                            <ButtonWithLoader
                                btnText="Apply Filter"
                                onPress={onApplyAttributeFilter}
                                btnStyle={{
                                    flex: 0.48,
                                    backgroundColor: themeColors.primary_color,
                                    borderWidth: 0,
                                }}
                                btnTextStyle={{
                                    textTransform: 'none',
                                }}
                            />
                            <ButtonWithLoader
                                onPress={onClearAttributeFilter}
                                btnText="Clear Filter"
                                btnStyle={{
                                    flex: 0.48,
                                    borderColor: themeColors.primary_color,
                                }}
                                btnTextStyle={{
                                    color: themeColors.primary_color,
                                    textTransform: 'none',
                                }}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </Modal>
        </WrapperContainer>
    );
};

export default P2pOndemandProducts;
