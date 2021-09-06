import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { moderateScale } from '../styles/responsiveSize';

const RoundImg = ({
    imgStyle = {},
    img= {},
    size= 76
}) => {
    return (
        <Image
            style={{
                width: moderateScale(size),
                height: moderateScale(size),
                borderRadius: moderateScale(size / 2),
                 ...imgStyle 
                }}
            source={{ uri: img }}
        />
    )
};



export default RoundImg;