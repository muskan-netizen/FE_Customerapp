import { StyleSheet, Text, View } from 'react-native'
import React, { FC, memo } from 'react'
import { moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize'
import fontFamily from '../../styles/fontFamily'
import { MyDarkTheme } from '../../styles/theme'
import { useDarkMode } from 'react-native-dynamic'
import { useSelector } from 'react-redux'
import { Image } from 'react-native'
import colors from '../../styles/colors'
import FastImage from 'react-native-fast-image'

type propType = {
    item: object,

}
const FeaturesCard: FC<propType> = ({ item }) => {

    const theme = useSelector(state => state?.initBoot?.themeColor);
    const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
    return (
        <View style={{ ...styles.featureslist, backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.greyColor1, }}>

            <FastImage
                source={{ uri: item?.icon }}
                style={{
                    height: moderateScale(30),
                    width: moderateScale(30),
                }}
                tintColor={isDarkMode ? colors.white : colors.black}
            />



            <Text
                style={{
                    fontSize: textScale(12),
                    color: isDarkMode
                        ? colors.white
                        : colors.black,
                    fontFamily: fontFamily.medium,
                    marginTop: moderateScaleVertical(7)
                }}>
                {item?.title}
            </Text>
            <Text
                style={{
                    fontSize: textScale(13),
                    color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    fontFamily: fontFamily.bold,
                    marginTop: moderateScaleVertical(4),
                }}>
                {item?.value}
            </Text>

        </View>
    )
}

export default memo(FeaturesCard)

const styles = StyleSheet.create({
    featureslist: {
        paddingVertical: moderateScale(10),
        // flexWrap: 'wrap',
        paddingHorizontal: moderateScale(17),
        // marginVertical: moderateScaleVertical(8),
        width:(width-20)/2.14,
        borderRadius: moderateScale(16),
        // flex: 0.47,
        borderWidth: 1,
        borderColor: colors.lightGreyBg

    }
})