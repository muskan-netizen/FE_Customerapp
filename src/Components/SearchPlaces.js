import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Image, Keyboard, I18nManager } from 'react-native';
import { useDarkMode } from 'react-native-dark-mode';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import { googlePlacesApi } from '../utils/googlePlaceApi';

const SearchPlaces = ({
    containerStyle = {},
    inputStyle = {},
    mapKey = "",
    fetchArrayResult = () => { },
    value = '',
    setValue = () => { },
    placeHolder,
    onFocus = () => { },
    autoFocus = false,
    _moveToNextScreen = () => { },
    curLatLng = {},
    placeHolderColor = colors.black,
    onClear = () => { },
    showRightImg = true,
    textStyle = {}
}) => {
    console.log(mapKey, 'in MapPlaceComp map key')

    const theme = useSelector((state) => state?.initBoot?.themeColor);

    const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    const { appStyle } = useSelector((state) => state?.initBoot);

    const textChangeHandler = async (data) => {
        setValue(data)
        let res = await googlePlacesApi(data, mapKey, curLatLng);

        if (res && !!res.results) {
            fetchArrayResult(res.results)
        }
    }


    return (
        <View style={{
            ...styles.container,
            backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.greyNew,
            ...containerStyle,
        }}>
            <TextInput
                // multiline
                autoFocus={autoFocus}
                value={value}
                placeholder={placeHolder}
                onChangeText={textChangeHandler}
                style={{
                    ...styles.text,
                    color: isDarkMode ? colors.textGreyB : colors.black,
                    ...textStyle
                }}
                onSubmitEditing={Keyboard.dismiss}
                onFocus={onFocus}
                placeholderTextColor={isDarkMode ? colors.textGreyB : placeHolderColor}
            />
            {value !== '' && (
                <TouchableOpacity
                    onPress={onClear}
                    activeOpacity={0.8}
                >
                    <Image
                        style={{
                            height: moderateScale(15),
                            width: moderateScale(15),
                            borderRadius: moderateScale(15/2),
                            marginHorizontal: moderateScale(4)
                        }}
                        resizeMode='contain'
                        source={imagePath.closeButton}
                    />
                </TouchableOpacity>)}
            {!!showRightImg ? <TouchableOpacity
                onPress={_moveToNextScreen}
            >
                <Image
                    style={{
                        height: moderateScale(20),
                        width: moderateScale(20),
                        borderRadius: moderateScale(10),
                    }}
                    source={imagePath.blackNav}
                />
            </TouchableOpacity>: null}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: moderateScale(36),
        backgroundColor: 'gray',
        borderRadius: moderateScale(4),
        paddingHorizontal: moderateScale(8),
    },
    text: {
        flex: 1,
        fontFamily: fontFamily.medium,
        textAlign: I18nManager.isRTL ? 'right' : 'left',
        fontSize: textScale(11),
    }

})

export default React.memo(SearchPlaces);