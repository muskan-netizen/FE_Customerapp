import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    moderateScale,
} from '../../../../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import colors from '../../../../styles/colors';
import imagePath from '../../../../constants/imagePath';
import strings from '../../../../constants/lang';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';

/**
 * PromoCodeAvailableSection Part
 * @param {item ,styles,cartData,themeColors, _getAllOffers,_removeCoupon} props 
 * @returns 
 */

function PromoCodeAvailableSection(props) {
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

    const { item=[], styles, cartData, themeColors, _getAllOffers, _removeCoupon } = props;
    return (
        <>
            {/* offerview */}
            {
                // !!item?.is_promo_code_available && 
                true&&(
                    <TouchableOpacity
                        disabled={item?.couponData ? true : false}
                        onPress={() => _getAllOffers(item.vendor, cartData)}
                        style={styles.offersViewB}>
                        {item?.couponData ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <View
                                    style={{
                                        flex: 0.7,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <FastImage
                                        source={imagePath.percent}
                                        resizeMode="contain"
                                        style={{
                                            width: moderateScale(16),
                                            height: moderateScale(16),
                                            tintColor: themeColors.primary_color,
                                        }}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.viewOffers,
                                            { 
                                                marginLeft: moderateScale(10),
                                                color: isDarkMode ? colors.white: colors.black
                                             },
                                        ]}>
                                        {`${item?.couponData?.name} ${strings.CODE} ${strings.APPLYED}`}
                                    </Text>
                                </View>
                                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                    {/* <Image source={imagePath.crossBlueB}  /> */}
                                    <Text
                                        onPress={() => _removeCoupon(item, cartData)}
                                        style={[
                                            styles.removeCoupon,
                                            { 
                                                color: isDarkMode ? colors.white: colors.black
                                            },
                                        ]}>
                                        {strings.REMOVE}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center',flex:1 }}>
                                <FastImage
                                    source={imagePath.percentage}
                                    resizeMode="contain"
                                    style={{
                                        width: moderateScale(24),
                                        height: moderateScale(24),
                                        tintColor: themeColors.primary_color,
                                    }}
                                />

                                <Text
                                    style={[
                                        styles.viewOffers,
                                        { 
                                            marginLeft: moderateScale(10),
                                            color: isDarkMode ? colors.white: colors.black
                                         },
                                    ]}>
                                    {strings.COUPONS_PROMO_CODES}
                                </Text>
                                <View style={{marginLeft:'auto',flexDirection:'row',alignItems:'center'}}>
                                <Image style={{width:15,height:15,tintColor:colors.orange}} source={imagePath.ic_right_arrow}/>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                )
            }
        </>

    )

}
export default React.memo(PromoCodeAvailableSection);