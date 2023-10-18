//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import { getImageUrl } from '../utils/helperFunctions';




// create a component
const CarCategory = (
    { data }
) => {

    const imageUrl =

        getImageUrl(
            data?.image.image_fit,
            data?.image.image_path,
            '700/700'
        );
    console.log(data, 'dataKyaa')
    return (
        <View style={{
            paddingVertical: moderateScaleVertical(10),
            elevation: 2,
            marginRight: moderateScale(5),
            borderRadius: moderateScale(20),
            alignItems: 'center',
            padding: moderateScaleVertical(14)
        }}>
            <FastImage
                style={{
                    height: 60,
                    width: moderateScale(60)
                }}
                source={{
                    uri: imageUrl,
                    cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }}
                resizeMode="cover"

            />
            <Text numberOfLines={1}
                style={{ fontSize: textScale(12), textAlign: 'center', width: 60, marginTop: moderateScaleVertical(6) }}>{data?.name}</Text>
        
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default CarCategory;
