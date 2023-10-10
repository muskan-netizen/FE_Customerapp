import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';

export default function CategoriesCard({ item = {}, onPress = () => { } }) {
    const {
        appStyle,
        themeToggle,
        themeColor
    } = useSelector(state => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const [isValidImg, setisValidImg] = useState(true)
    console.log(item, "fsdafksd")
    let imageURI = getImageUrl(
        item?.icon?.image_fit,
        item?.icon?.image_path,
        '500/500',
    );
    return (
        <TouchableOpacity style={{
            borderRadius: moderateScale(16),
        }} onPress={onPress}>
            <View style={{
                borderRadius: moderateScale(16),
                height: moderateScaleVertical(149),
                width: moderateScale(166),
                position: "absolute",
                backgroundColor: isDarkMode ? colors.whiteOpacity5 : colors.blackOpacity20,
                zIndex: 1
            }} />
            <FastImage
                style={{
                    borderRadius: moderateScale(16),
                    height: moderateScaleVertical(149),
                    width: moderateScale(166),
                }}
                // onError={() => {
                //     setisValidImg(false)
                // }}
                source={{
                    uri: imageURI, cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }} />
            <Text
                numberOfLines={2}
                style={{
                    position: 'absolute', bottom: 10, left: 10, color: colors.white,
                    fontFamily: fontFamily?.medium, fontSize: textScale(16), zIndex: 2,
                    paddingRight: moderateScale(6)
                }}>{item?.name}</Text>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})