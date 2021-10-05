import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    Animated
} from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import colors from '../styles/colors';
import strings from '../constants/lang';
import { useDarkMode } from 'react-native-dark-mode';
import { MyDarkTheme } from '../styles/theme';
import {
    getImageUrl,
    getScaleTransformationStyle,
    pressInAnimation,
    pressOutAnimation,
} from '../utils/helperFunctions';

const ProductsComp = ({
    isDiscount,
    item,
    imageStyle
}) => {
    const theme = useSelector((state) => state?.initBoot?.themeColor);
    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const { themeColors, appStyle } = useSelector((state) => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;

    const scaleInAnimated = new Animated.Value(0);
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                width: width / 2.5,
                ...getScaleTransformationStyle(scaleInAnimated),
            }}
            onPressIn={() => pressInAnimation(scaleInAnimated)}
            onPressOut={() => pressOutAnimation(scaleInAnimated)}
        >
            <ImageBackground
                source={{ uri: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2FuZHdpY2h8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80' }}
                style={{
                    height: moderateScale(100),
                    width: width / 2.5,
                    ...imageStyle
                }}
                imageStyle={{ borderRadius: moderateScale(10) }}
            >
                <View style={styles.hdrRatingTxtView}>
                    <Text style={{
                        ...styles.ratingTxt,
                        fontFamily: fontFamily.medium
                    }}>4</Text>
                    <Image
                        style={styles.starImg}
                        source={imagePath.star}
                        resizeMode="contain"
                    />
                </View>
            </ImageBackground>
            <View style={{ marginVertical: moderateScaleVertical(6) }}>
                <Text
                    numberOfLines={2}
                    style={{
                        fontSize: textScale(12),
                        fontFamily: fontFamily.medium,
                        color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                        textAlign: 'left',
                        lineHeight: moderateScale(16)
                    }}
                >Potato Grilled Sandwich</Text>
                <Text style={{
                    fontSize: textScale(11),
                    fontFamily: fontFamily.regular,
                    marginVertical: moderateScaleVertical(4),
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity40,
                    textAlign: 'left',
                }}>Foodie's Hub</Text>
                {!isDiscount ? <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 0.6, alignItems: 'flex-start' }}>
                        <Text
                            style={{
                                ...styles.inTextStyle,
                                fontFamily: fontFamily.regular,
                                color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity40,
                                width: width / 4
                            }}
                        >{strings.IN} sandwiche</Text>
                    </View>
                    <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                        <Text style={{
                            fontSize: textScale(12),
                            fontFamily: fontFamily.medium,
                            color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                        }}>$ 1267</Text>
                    </View>
                </View> :
                    <View>
                        <Text
                            style={{
                                ...styles.inTextStyle,
                                fontFamily: fontFamily.regular,
                                color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity40,
                            }}
                        >{strings.IN} sandwiche</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                fontSize: textScale(12),
                                fontFamily: fontFamily.medium,
                                color: colors.green,
                                marginVertical: moderateScaleVertical(8)
                            }}>$ 12
                            </Text>
                            <Text style={{
                                textDecorationLine: 'line-through',
                                color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity40,
                                marginLeft: moderateScale(12)
                            }}  >$ 11</Text>
                        </View>
                    </View>
                }
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
        paddingHorizontal: moderateScale(4),
        alignSelf: 'flex-start',
        borderRadius: moderateScale(2),
        marginTop: moderateScaleVertical(16)
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
    inTextStyle: {
        fontSize: textScale(9),
        width: width / 3,
        textAlign: 'left',
    },
});


export default ProductsComp;
