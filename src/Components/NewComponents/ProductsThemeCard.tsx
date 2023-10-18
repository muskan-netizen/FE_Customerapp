import { StyleSheet, Text, View } from 'react-native'
import React, { FC, memo } from 'react'
import { TouchableOpacity } from 'react-native'
import { height, moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize'
import FastImage from 'react-native-fast-image'
import { getImageUrlNew, tokenConverterPlusCurrencyNumberFormater } from '../../utils/commonFunction'
import { useSelector } from 'react-redux'
import fontFamily from '../../styles/fontFamily'
import colors from '../../styles/colors'
import { getImageUrl } from '../../utils/helperFunctions'
import imagePath from '../../constants/imagePath'
type productType = {
    item: object
    onPressProduct: () => void,

}
const ProductsThemeCard: FC<productType> = ({ item, onPressProduct }) => {
    const { appMainData } = useSelector((state) => state?.home || {});
    const { appStyle, themeColors, appData, currencies } = useSelector(
        (state) => state?.initBoot,
    );
    const { additional_preferences, digit_after_decimal } =
        appData?.profile?.preferences || {};

    const imageUrl = !!item?.media
        ? getImageUrl(
            item?.media[0]?.image?.path?.image_fit,
            item?.media[0]?.image?.path?.image_path,
            '1000/1000')
        : getImageUrlNew({
            url: item?.path || null,
            image_const_arr: appMainData.image_prefix,
            type: 'image_fit',
            height: '1028',
            width: '1028',
        })

    return (
        <TouchableOpacity style={styles.mainContainer} onPress={onPressProduct}>
            <FastImage resizeMode='cover'
                style={{ height: moderateScale(180), width: '99%', alignSelf: 'center' }}
                source={{
                    uri: imageUrl,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }}

            />

            <View style={{ paddingHorizontal: moderateScale(16) }}>

                <Text style={styles.titleStyle}>{item?.title}</Text>

                <View style={styles.borderLine} />
                <View style={styles.addressAndPriceView}>
                    <Text style={styles.address}>{item?.address}{item?.address}</Text>
                    <Text style={[styles.priceText, { color: themeColors?.primary_color }]}>
                        {tokenConverterPlusCurrencyNumberFormater(
                            item?.price_numeric || item?.variant[0]?.actual_price,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                        )}</Text>
                </View>
<FastImage source={imagePath.transmission} style={{height:20,width:20}}/>
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
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        borderRadius: moderateScale(16)
    },
    titleStyle: {
        fontSize: textScale(16),
        fontFamily: fontFamily.bold,
        paddingVertical: moderateScaleVertical(8)
    },
    borderLine: {
    
        width: '100%',
        height:1,
        backgroundColor:colors.boxGrey
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
    addressAndPriceView:{   
        flexDirection: 'row',
    justifyContent: 'space-between', 
    marginTop: moderateScaleVertical(6)
}
})