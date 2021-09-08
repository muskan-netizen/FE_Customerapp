import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground
} from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import GradientButton from '../Components/GradientButton';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
    height,
    moderateScale,
    moderateScaleVertical,
    textScale,
    width,
} from '../styles/responsiveSize';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../utils/helperFunctions';
import { useNavigation } from '@react-navigation/native';
import navigationStrings from '../navigation/navigationStrings';
import HTMLView from 'react-native-htmlview';
import HtmlViewComp from './HtmlViewComp';
import { MyDarkTheme } from '../styles/theme';
import * as Animatable from 'react-native-animatable';

export default function VariantAddons({
    productdetail = {},
    addonSet = [],
    isVisible = false,
    onClose,
    onPress,
    resizeMode = 'contain',
    imagestyle = {},
}) {

    const navigation = useNavigation();
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const isDarkMode = theme;
    const { appData, themeColors, themeLayouts, currencies, languages, appStyle } =
        useSelector((state) => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;
    const buttonTextColor = themeColors;

    const commonStyles = commonStylesFun({ fontFamily, buttonTextColor });

    const [state, setState] = useState({
        addonSetData: addonSet,
        viewHeight: 0,
        maxLimitAddon: 0,
    });
    const { addonSetData, viewHeight, maxLimitAddon } = state;
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    let productImage = productdetail?.media[0];

    const selectSpecificOptionsForAddions = (options, i, inx) => {
        let newArray = cloneDeep(options);
        console.log(i, 'i>>>i');
        console.log(newArray, 'newArray>>>newArray');
        console.log(addonSetData, 'addonSetData>>>addonSetData');
        let find = addonSetData.find((x) => x?.addon_id == i?.addon_id);
        console.log(find, 'find>>>find');

        updateState({
            addonSetData: addonSetData.map((vi, vnx) => {
                if (vi.addon_id == i.addon_id) {
                    return {
                        ...vi,
                        setoptions: newArray.map((j, jnx) => {
                            if (vi?.max_select > 1) {
                                let incrementedValue = 0;
                                newArray.forEach((e) => {
                                    if (e.value) {
                                        incrementedValue = incrementedValue + 1;
                                    }
                                });
                                console.log(incrementedValue, 'incrementedValue');
                                if ((incrementedValue == vi?.max_select) && !j.value) {
                                    return {
                                        ...j,
                                    };
                                } else {
                                    if (j?.id == i?.id) {
                                        return {
                                            ...j,
                                            value: i?.value ? false : true,
                                        };
                                    }

                                    return {
                                        ...j,
                                    };
                                }
                            } else {
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
                            }
                        }),
                    };
                } else {
                    return vi;
                }
            }),
        });
    };

    const checkBoxButtonViewAddons = ({ setoptions }) => {
        return (
            <View>
                {setoptions.map((i, inx) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                selectSpecificOptionsForAddions(setoptions, i, inx);
                            }}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',

                                marginBottom: moderateScaleVertical(10),
                            }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.variantValue}>
                                    {i?.title
                                        ? i.title.charAt(0).toUpperCase() + i.title.slice(1)
                                        : ''}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.variantValue}>
                                    {`${currencies?.primary_currency?.symbol}${(
                                        Number(i?.multiplier) * Number(i?.price)
                                    ).toFixed(2)}`}
                                </Text>
                                <View style={{ paddingLeft: moderateScale(5) }}>
                                    <Image
                                        source={i?.value ? imagePath.check : imagePath.unCheck}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const showAllAddons = () => {
        let variantSetData = cloneDeep(addonSetData);
        return (
            <>
                <View
                    style={{
                        marginVertical: moderateScaleVertical(5),
                    }}>
                    {variantSetData.map((i, inx) => {
                        return (
                            <View
                                key={inx}
                                style={{
                                    marginVertical: moderateScaleVertical(5),
                                }}>
                                <Text
                                    style={[styles.variantLable]}>{`Choice of ${i?.title}`}</Text>
                                <Text style={styles.chooseOption}>
                                    {strings.PLS_SELECT_ONE}
                                </Text>
                                {i?.setoptions ? checkBoxButtonViewAddons(i) : null}
                                <View
                                    style={{
                                        ...commonStyles.headerTopLine,
                                        marginVertical: moderateScaleVertical(10),
                                    }}
                                />
                            </View>
                        );
                    })}
                </View>
            </>
        );
    };

    const addToCart = () => {

    };

    const onScroll = ({ nativeEvent }) => {
        let preHeight = (height / 3.8) - 10
        let offset = nativeEvent.contentOffset.y;
        let index = parseInt(offset / preHeight);
        console.log("index+++", index)
    }
    return (
        <Modal
            transparent={false}
            isVisible={isVisible}
            animationType={'none'}
            style={styles.modalContainer}
            onLayout={(event) => {
                updateState({ viewHeight: event.nativeEvent.layout.height });
            }}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Image source={imagePath.crossC} />
            </TouchableOpacity>
            <Animatable.View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    // onScroll={onScroll}
                    style={{
                        ...styles.modalMainViewContainer,
                        backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
                    }}
                >

                    <ImageBackground
                        source={{
                            uri: getImageUrl(
                                productImage?.image?.path?.image_fit,
                                productImage?.image?.path?.image_path,
                                '400/400',
                            ),
                        }}
                        style={[styles.cardView, imagestyle]}
                        resizeMode={resizeMode}
                    />
                    <Animatable.View animation="fadeInUp" style={styles.mainView}>
                        <View>
                            <Text numberOfLines={1} style={{
                                ...styles.productName,
                                color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.black
                            }}>
                                {productdetail?.translation[0]?.title}
                            </Text>
                        </View>

                        {productdetail?.translation[0]?.body_html != null && (<HtmlViewComp
                            plainHtml={productdetail?.translation[0]?.body_html}
                        />)}


                        <View
                            style={{
                                ...commonStyles.headerTopLine,
                                marginVertical: moderateScaleVertical(10),
                            }}
                        />
                        {/* ********Addon set View*******  */}
                        {/* {addonSetData && addonSetData.length ? showAllAddons() : null} */}
                    </Animatable.View>

                </ScrollView>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 16,
                        paddingBottom: moderateScaleVertical(10),
                        backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
                    }}
                >

                    <View style={{ flex: 0.25 }}>
                        <View
                            style={{
                                ...commonStyles.buttonRect,
                                ...styles.incDecBtnStyle,
                                backgroundColor: getColorCodeWithOpactiyNumber(
                                    themeColors.primary_color.substr(1),
                                    15,
                                ),
                                borderColor: themeColors?.primary_color,
                            }}
                        // onPress={onPress}
                        >
                            <TouchableOpacity>
                                <Text style={{
                                    ...commonStyles.mediumFont14,
                                    color: themeColors?.primary_color,
                                    fontFamily: fontFamily.bold
                                }}>-</Text>
                            </TouchableOpacity>
                            <Text style={{
                                ...commonStyles.mediumFont14,
                                color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black
                                }}>1</Text>
                            <TouchableOpacity>
                                <Text style={{
                                    ...commonStyles.mediumFont14,
                                    color: themeColors?.primary_color,
                                    fontFamily: fontFamily.bold
                                }}>+</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={{ marginHorizontal: 8 }} />
                    <View style={{ flex: 0.75 }}>
                        <GradientButton
                            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
                            textStyle={{
                                fontFamily: fontFamily.medium,
                                textTransform: 'capitalize'
                            }}
                            onPress={addToCart}
                            btnText={`${strings.ADD_ITEM} - ${currencies?.primary_currency?.symbol}${(
                                Number(productdetail?.variant[0]?.multiplier) *
                                Number(productdetail?.variant[0]?.price)
                            ).toFixed(2)}`}
                            btnStyle={{ borderRadius: moderateScale(4), height: moderateScale(38) }}
                        />
                    </View>
                </View>
            </Animatable.View>
        </Modal>
    );
}



const styles = StyleSheet.create({

    productName: {
        color: colors.textGrey,
        fontSize: textScale(18),
        lineHeight: 28,
        fontFamily: fontFamily.bold,
    },
    description: {
        color: colors.textGreyB,
        fontSize: textScale(14),
        lineHeight: 22,
        fontFamily: fontFamily.medium,
    },
    relatedProducts: {
        color: colors.textGrey,
        fontSize: textScale(18),
        lineHeight: 28,
        fontFamily: fontFamily.bold,
        marginVertical: moderateScaleVertical(10),
    },

    variantLable: {
        color: colors.textGrey,
        fontSize: textScale(14),
        lineHeight: 22,
        fontFamily: fontFamily.bold,
    },

    modalMainViewContainer: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // overflow: 'hidden',
        // paddingHorizontal: moderateScale(24),
    },
    modalContainer: {
        marginHorizontal: 0,
        marginBottom: 0,
        marginTop: moderateScaleVertical(height / 10),
        overflow: 'hidden',
    },
    closeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: moderateScaleVertical(10),
    },
    imageStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    cardView: {
        height: height / 3.8,
        width: width,
        overflow: 'hidden',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    productName: {
        color: colors.textGrey,
        fontSize: textScale(14),
        lineHeight: 28,
        fontFamily: fontFamily.medium,
    },
    mainView: {
        marginVertical: moderateScaleVertical(15),
        paddingHorizontal: moderateScale(15),
    },
    description: {
        color: colors.textGreyB,
        fontSize: textScale(14),
        lineHeight: 22,
        fontFamily: fontFamily.regular,
        textAlign: 'left',
    },
    variantValue: {
        color: colors.black,
        fontSize: textScale(14),
        lineHeight: 22,
        fontFamily: fontFamily.medium,
        paddingLeft: moderateScale(5),
        paddingRight: moderateScale(20),
    },

    chooseOption: {
        marginBottom: moderateScale(2),
        color: colors.textGreyF,
        fontWeight: '600',
        fontSize: textScale(10),
        lineHeight: 22,
        fontFamily: fontFamily.regular,
    },
    incDecBtnStyle: {
        borderWidth: 0.4,
        borderRadius: moderateScale(4),
        height: moderateScale(38),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(12)
    }

});
