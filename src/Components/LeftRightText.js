
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import fontFamily from '../styles/fontFamily';
import { moderateScaleVertical, textScale } from '../styles/responsiveSize';
import colors from '../styles/colors';

const LeftRightText = ({
    leftText,
    rightText,
    isDarkMode,
    MyDarkTheme,
    leftTextStyle,
    rightTextStyle
}) => {
    return (
        <View style={{ flexDirection: "row", justifyContent: 'space-between',marginBottom:moderateScaleVertical(12) }}>
            <Text style={{
                ...styles.textStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity43,
                ...leftTextStyle,
                flex:1
            }}>{leftText}</Text>
            <Text style={{
                ...styles.textStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity43,
                ...rightTextStyle,
            }}>{rightText}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    textStyle: {
        fontFamily: fontFamily.medium,
        textAlign: 'left',
        fontSize: textScale(12)
    },
});

export default LeftRightText;
