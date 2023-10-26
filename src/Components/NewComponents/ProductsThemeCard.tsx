import { Animated, StyleSheet, Text, View } from 'react-native'
import React, { FC, memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { height, moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize'
import FastImage from 'react-native-fast-image'
import { getImageUrlNew, tokenConverterPlusCurrencyNumberFormater } from '../../utils/commonFunction'
import { useSelector } from 'react-redux'
import fontFamily from '../../styles/fontFamily'
import colors from '../../styles/colors'
import { getImageUrl,getScaleTransformationStyle, pressInAnimation, pressOutAnimation } from '../../utils/helperFunctions'
import imagePath from '../../constants/imagePath'
import { useDarkMode } from 'react-native-dynamic'
import { MyDarkTheme } from '../../styles/theme'
import strings from '../../constants/lang'
import { itemType } from './interface'
import { IRootState } from '../../Screens/ShortCode/interfaces'
import { isEmpty } from 'lodash'


type productType = {
    item: itemType
    onPressProduct: () => void,

}
const ProductsThemeCard: FC<productType> = ({ item, onPressProduct }) => {
    const { appMainData } = useSelector((state: IRootState) => state?.home || {});
    const { appStyle, themeColors, appData, currencies, themeColor, themeToggle } = useSelector(
        (state: IRootState) => state?.initBoot,
    );
    const darkthemeusingDevice = useDarkMode();
    const scaleInAnimated = new Animated.Value(0);
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};

    const imageUrl = !!item?.media
        ? getImageUrl(
            item?.media[0]?.image?.path?.image_fit,
            item?.media[0]?.image?.path?.image_path,
            '381/181')
        : getImageUrlNew({
            url: item?.path,
            image_const_arr: appMainData.image_prefix,
            type: 'image_fit',
            height: '1028',
            width: '1028',
        })

    const attributes = !!item?.product_attributes ? JSON.parse(item?.product_attributes) : {};
    const variantPrice = !!item?.price_numeric ? item?.price_numeric :item?.varian?.length > 0 ? item?.variant[0]?.actual_price : 0
    console.log(attributes, 'itemitemitemitem',item);

    return (
        <TouchableOpacity
            style={[styles.mainContainer,
            {   ...getScaleTransformationStyle(scaleInAnimated),
                backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.white,
                borderColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.boxGrey,
            }]} onPress={onPressProduct}
            onPressIn={() => pressInAnimation(scaleInAnimated)}
            onPressOut={() => pressOutAnimation(scaleInAnimated)}
            activeOpacity={1}
            >
            <FastImage resizeMode='cover'
                style={{ height: moderateScale(180), width: '100%', alignSelf: 'center' }}
                source={{
                    uri: imageUrl,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }}

            />

            <View style={{ paddingHorizontal: moderateScale(16) }}>

                <Text style={{ ...styles.titleStyle, color: isDarkMode ? colors.white : colors.black }}>{item?.title}</Text>

                <View style={styles.borderLine} />
                {!!item?.address || variantPrice > 0 ? <View style={styles.addressAndPriceView}>
                    <Text style={{ ...styles.address, color: isDarkMode ? colors.white : colors.black }}>{item?.address || ''}</Text>

                    {variantPrice > 0 || variantPrice > 0 ? <Text style={[styles.priceText, { color: themeColors?.primary_color }]}>
                        {tokenConverterPlusCurrencyNumberFormater(
                            variantPrice,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                        )}</Text> : null}
                </View> : null}
                <View style={{ flexDirection: 'row', marginTop: moderateScale(14) }}>


                    {!!attributes.Transmission || !!item?.transmission ? <View style={styles.attributesView}>
                        <FastImage
                            source={imagePath.transmission}
                            style={styles.imageStyle} tintColor={isDarkMode ? colors.white : colors.black} />
                        <Text style={{ ...styles.attributesText, color: isDarkMode ? colors.white : colors.black }}>{ attributes.Transmission  || item?.transmission}</Text>
                    </View> : null}

                    {!!attributes.fuel_type || !!item?.fuel_type ? <View style={[styles.attributesView, { paddingLeft: moderateScale(10) }]}>
                        <FastImage
                            source={imagePath.fule}
                            style={styles.imageStyle} tintColor={isDarkMode ? colors.white : colors.black} />
                        <Text style={{ ...styles.attributesText, color: isDarkMode ? colors.white : colors.black }}>{ attributes.fuel_type || item?.fuel_type}</Text>
                    </View> : null}

                    {!!attributes.Seats || !!item?.Seats ? <View style={styles.attributesView}>
                        <FastImage
                            source={imagePath.seats}
                            style={styles.imageStyle} tintColor={isDarkMode ? colors.white : colors.black} />
                        <Text style={{ ...styles.attributesText, color: isDarkMode ? colors.white : colors.black }}>{`${!isEmpty(attributes) ? attributes.Seats : item?.Seats} ${strings.SEATS}`}</Text>
                    </View> : null}

                </View>
            </View>
        </TouchableOpacity>
    )
}

export default memo(ProductsThemeCard)

const styles = StyleSheet.create({
    mainContainer: {
        marginHorizontal: moderateScale(16),
        paddingBottom: moderateScale(10),
        overflow: 'hidden',
        marginTop: moderateScaleVertical(16),
        //   height: height/3, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: colors.boxGrey,
        elevation: 1,
        borderRadius: moderateScale(12)
    },
    titleStyle: {
        fontSize: textScale(16),
        fontFamily: fontFamily.bold,
        paddingVertical: moderateScaleVertical(8)
    },
    borderLine: {

        width: '100%',
        height: 1,
        backgroundColor: colors.boxGrey
    },
    address: {
        fontFamily: fontFamily.medium,
        fontSize: textScale(14),
        color: colors.black,
        maxWidth: width / 2
    },
    priceText: {
        fontFamily: fontFamily.bold,
        fontSize: textScale(16),
    },
    addressAndPriceView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: moderateScaleVertical(6)
    },
    attributesView: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.33,
        flexWrap: 'wrap',
        // justifyContent: 'center'

    },
    imageStyle: {
        height: moderateScale(20),
        width: moderateScale(20),
        marginRight: moderateScale(4)
    },
    attributesText: {
        fontFamily: fontFamily.medium, fontSize: textScale(14)
    }

})