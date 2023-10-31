//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import { getImageUrl, pressInAnimation, pressOutAnimation ,getScaleTransformationStyle} from '../utils/helperFunctions';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import { MyDarkTheme } from '../styles/theme';
import colors from '../styles/colors';




// create a component
const CarCategory = (
    { data, onPress = () => { } }
) => {
    const { appStyle, themeColors, appData, currencies, themeColor, themeToggle } = useSelector((state) => state?.initBoot || {});

    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const imageUrl =

        getImageUrl(
            data?.image.image_fit,
            data?.image.image_path,
            '150/150'
        );
    console.log(imageUrl, 'dataKyaa',data?.image)
    const scaleInAnimated = new Animated.Value(0);

    return (
        <TouchableOpacity style={{
            ...styles.mainView,
            ...getScaleTransformationStyle(scaleInAnimated),
            backgroundColor: isDarkMode ? MyDarkTheme?.colors.lightDark : colors.white

        }} onPress={onPress}
        onPressIn={() => pressInAnimation(scaleInAnimated)}
        onPressOut={() => pressOutAnimation(scaleInAnimated)}
        activeOpacity={1}
        >
            <FastImage
                style={styles.imageStyle}
                source={{
                    uri: imageUrl,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }}
                resizeMode="contain"

            />
            <Text numberOfLines={1}
                style={{ ...styles.titleStyle, 
                color: isDarkMode ? colors.white : colors.black }}>{data?.name}</Text>

        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    mainView: {
        paddingVertical: moderateScaleVertical(10),
        elevation: 2,
        marginRight: moderateScale(5),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        padding: moderateScaleVertical(14),
        margin:3
    }, imageStyle: {
        height: moderateScale(60),
        width: moderateScale(60)
    },
    titleStyle: {
        fontSize: textScale(12),
        textAlign: 'center',
        maxWidth: moderateScale(60),
        marginTop: moderateScaleVertical(6)
    }
});

//make this component available to the app
export default CarCategory;

