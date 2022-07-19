//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import colors from '../styles/colors';
import { moderateScaleVertical } from '../styles/responsiveSize';


// create a component
const CircularImages = ({ data = [], isDarkMode }) => {
    return (
        <View style={styles.container}>

            {data.map((val, i) => {
                if (i < 3) {
                    return (
                        <FastImage
                        key={String(i)}
                            source={{
                                uri: val?.display_image,
                                priority: FastImage.priority.high,
                                cache: FastImage.cacheControl.immutable
                            }}
                            style={{
                                ...styles.radiusStyle,
                                backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.blackOpacity30,
                                marginLeft: i == 0 ? 0 : -16
                            }}
                        />

                    )
                }
            })}

            {data.length > 3 ? <View style={styles.radiusStyle} >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>+{data.length - 3}</Text>
            </View> : null}

        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: moderateScaleVertical(8)
    },
    radiusStyle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginLeft: -20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default CircularImages;
