import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import colors from '../styles/colors';
import { useSelector } from 'react-redux';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../utils/helperFunctions';

export default function CategoriesCard({ item = {}, onPress = () => { } }) {
    const {
        appStyle
    } = useSelector(state => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;


    let imageURI = getImageUrl(
        item?.image?.image_fit,
        item?.image?.image_path,
        '900/900',
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
                backgroundColor: colors.blackOpacity10,
                zIndex: 1
            }} />
            <FastImage
                style={{
                    borderRadius: moderateScale(16),
                    height: moderateScaleVertical(149),
                    width: moderateScale(166),
                }}
                source={{
                    uri: imageURI, cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }} />
            <Text style={{ position: 'absolute', bottom: 10, left: 10, color: colors.white, fontFamily: fontFamily?.medium, fontSize: textScale(16), zIndex: 2 }}>{item?.name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})