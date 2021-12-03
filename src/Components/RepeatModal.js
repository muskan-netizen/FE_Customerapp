//import liraries
import React, { Component } from 'react';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, Image } from 'react-native';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';
import { useSelector } from 'react-redux';
import ButtonWithLoader from './ButtonWithLoader';


const RepeatModal = ({
    data = {},
    modalHide = () => { },
    onRepeat = () => { },
    onAddNew = () => { }
}) => {
    const { appData, themeColors, themeLayouts, currencies, languages, appStyle } =
        useSelector((state) => state?.initBoot);
    const userData = useSelector((state) => state?.auth?.userData);
    const fontFamily = appStyle?.fontSizeData;
    console.log("data", data)
    return (
        <Modal
            isVisible={!!data ? true : false}
            animationIn="slideInUp"
            style={{
                margin: 0,
                justifyContent: 'flex-end'
            }}
            onBackdropPress={modalHide}
        >

            <View style={{
                backgroundColor: 'white',
                borderTopRightRadius: 12,
                borderTopLeftRadius: 12,
                padding: moderateScale(12)
            }}>
                <Text style={{
                    fontSize: textScale(14),
                    fontFamily: fontFamily.regular,

                }}>Repeat last used customization?</Text>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    marginTop: moderateScaleVertical(4)
                }}>
                    {/* <Image source={imagePath.icVeg} /> */}
                    <Text style={{
                        fontSize: textScale(14),
                        fontFamily: fontFamily.regular,
                        // marginLeft: moderateScale(8)
                    }}>{data?.translation_title}</Text>
                </View>
                <View style={{ flexDirection: 'row',marginBottom: 16 }}>
                    <ButtonWithLoader
                        btnText="Add new"
                        btnTextStyle={{
                            color: 'blue',
                            textTransform: 'none',
                            fontFamily: fontFamily.regular
                        }}
                        btnStyle={{
                            flex: 1,
                            borderColor: 'blue',
                            borderRadius: moderateScale(6),
                            borderWidth: 0.5
                        }}
                        onPress={onAddNew}
                    />
                    <View style={{ marginHorizontal: moderateScale(6) }} />
                    <ButtonWithLoader
                        btnText="Repeat last"
                        btnTextStyle={{
                            color: 'red',
                            textTransform: 'none',
                            fontFamily: fontFamily.regular
                        }}
                        onPress={onRepeat}
                        btnStyle={{
                            flex: 1,
                            borderColor: 'red',
                            borderRadius: moderateScale(6),
                            borderWidth: 0.5
                        }}
                    />
                </View>
            </View>
        </Modal>
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
export default RepeatModal;
