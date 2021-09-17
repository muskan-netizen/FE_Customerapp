import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { moderateScale } from '../styles/responsiveSize';
import colors from '../styles/colors'
const RoundImg = ({
    imgStyle = {},
    img= {},
    size= 76,
    isDarkMode,
    MyDarkTheme
}) => {
    return (
        <Image
            style={{
                width: moderateScale(size),
                height: moderateScale(size),
                borderRadius: moderateScale(size / 2),
                backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.blackOpacity10,
                 ...imgStyle 
                }}
            source={{ uri: img }}
        />
    )
};



export default RoundImg;