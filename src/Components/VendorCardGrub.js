import React from 'react';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {
    height,
    moderateScale,
    moderateScaleVertical,
    textScale,
    width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import {
    getImageUrlNew,
    tokenConverterPlusCurrencyNumberFormater,
} from '../utils/commonFunction';
import {
    getImageUrl,
    getScaleTransformationStyle,
    pressInAnimation,
    pressOutAnimation,
} from '../utils/helperFunctions';
import { getColorSchema } from '../utils/utils';
import { appIds } from '../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';
import fontFamily from '../styles/fontFamily';
let imageHeight = 110;
let imageWidth = 140;
let imageRadius = 16;

const VendorCardGrub = ({
    isDiscount,
    item,
    imageStyle,
    onPress = () => { },
    numberOfLines = 1,
    containerStyle = {},
}) => {
    const { themeColors, appStyle, currencies, themeColor, themeToggle, appData } =
        useSelector(state => state?.initBoot || {});
    const { additional_preferences, digit_after_decimal } = useSelector(
        state => state?.initBoot?.appData?.profile?.preferences || {},
    );
    const priceType = useSelector(state => state?.home?.priceType);
    const darkthemeusingDevice = getColorSchema();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const fontFamily = appStyle?.fontSizeData;
    const scaleInAnimated = new Animated.Value(0);

    const { appMainData, dineInType } = useSelector(state => state?.home || {});

    const { category = {} } = item || {};
    let imageUrlNew = getImageUrlNew({
        url: item?.banner || item?.path || item?.logo || null,
        image_const_arr: appMainData.image_prefix,
        type: 'image_fill',
        height: ((height * 2) / 2).toFixed(0),
        width: width.toFixed(0),
    });

    let imageUrl = getImageUrl(
        item?.banner?.proxy_url || item?.image?.proxy_url,
        item?.banner?.image_path || item?.image?.image_path,
        '700/300',
    );

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={{
                // backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
                width: imageWidth,

                margin: 1,
                borderRadius: imageRadius,

                ...containerStyle,
                ...getScaleTransformationStyle(scaleInAnimated),
            }}
            onPressIn={() => pressInAnimation(scaleInAnimated)}
            onPressOut={() => pressOutAnimation(scaleInAnimated)}>
            <FastImage
                // resizeMode={FastImage.resizeMode.contain}
                source={{
                    uri: imageUrlNew,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }}
                style={{
                    height: imageHeight,
                    width: imageWidth,
                    borderRadius: imageRadius,

                    backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,
                    ...imageStyle,
                }}
                imageStyle={{
                    borderRadius: moderateScale(10),
                    backgroundColor: isDarkMode
                        ? colors.whiteOpacity15
                        : colors.greyColor,
                }}>
                {!!item?.promo_discount ? (
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: colors.blackOpacity66,
                            paddingVertical: moderateScaleVertical(4),
                            paddingHorizontal: moderateScale(16),
                            borderTopLeftRadius: moderateScale(6),
                            borderBottomRightRadius: moderateScale(6),
                            top: 10,
                            borderColor: colors.whiteOpacity5,
                            borderWidth: 0.5,
                        }}>
                        <Text
                            style={{
                                fontSize: textScale(11),
                                color: colors.white,
                                fontFamily: fontFamily.medium,
                            }}>
                            {item?.promo_discount}
                        </Text>
                    </View>
                ) : null}
            </FastImage>
            {!!item?.vendorRating && item?.vendorRating !== '0.0' ? (
                <View
                    style={{
                        alignSelf: 'flex-start',

                        left: 0,

                        backgroundColor: colors.white,
                        marginTop: -moderateScaleVertical(12),
                        paddingRight: moderateScale(8),
                        height: moderateScaleVertical(30),
                        width: moderateScale(50),
                        borderTopRightRadius: moderateScale(18),
                        // borderBottomRightRadius: moderateScale(18),
                        justifyContent: 'center',
                    }}>
                    {!!item?.vendorRating && item?.vendorRating !== '0.0' && (
                        <View style={styles.hdrRatingTxtView}>
                            <Text
                                style={{
                                    ...styles.ratingTxt,
                                    fontFamily: fontFamily.medium,
                                }}>
                                {Number(item?.vendorRating).toFixed(1)}
                            </Text>
                            <Image
                                style={styles.starImg}
                                source={imagePath.star}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                </View>
            ) : (
                <View style={{ height: moderateScaleVertical(8) }} />
            )}
            <View style={{}}>
                <Text
                    numberOfLines={numberOfLines}
                    style={{
                        fontSize: textScale(13),
                        fontFamily: fontFamily.medium,
                        color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                        textAlign: 'left',
                    }}>
                    {item?.name}
                </Text>
                {!!item?.timeofLineOfSightDistance && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: moderateScaleVertical(4),
                    }}>
                    <Image
                      style={{
                        width: moderateScale(10),
                        height: moderateScale(10),
                        opacity: item?.is_vendor_closed ? 0.5 : 1,
                        marginRight: moderateScale(4),
                      }}
                      resizeMode="contain"
                      source={imagePath.icTime2}
                    />
                    <Text numberOfLines={1} style={styles.distanceTimeStyle}>
                      {item?.timeofLineOfSightDistance}
                    </Text>
                  </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    hdrRatingTxtView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.green,
        paddingVertical: moderateScale(2),
        paddingHorizontal: moderateScale(8),
        borderRadius: moderateScale(10),
        // borderBottomLeftRadius: moderateScale(10),

        // marginTop: moderateScaleVertical(16),
    },
    ratingTxt: {
        textAlign: 'left',
        color: colors.white,
        fontSize: textScale(9),
        textAlign: 'left',
    },
    starImg: {
        tintColor: colors.white,
        marginLeft: 2,
        width: 9,
        height: 9,
    },
    distanceTimeStyle: {
        color: colors.blackOpacity70,
        fontSize: textScale(10),
        fontFamily: fontFamily.regular,
        textAlign: 'left',
      },
});

export default React.memo(VendorCardGrub);
