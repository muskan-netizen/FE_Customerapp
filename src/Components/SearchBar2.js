import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import navigationStrings from '../navigation/navigationStrings';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import colors from '../styles/colors';

export default function SearchBar2({
  navigation,
  placeHolderTxt = strings.SEARCH_HERE,
}) {
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.mainContainer}
      onPress={() =>
        navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
      }>
      <View style={{width: '80%'}}>
        <Text style={styles.placeHolderTxt}>{placeHolderTxt}</Text>
      </View>
      <Image source={imagePath.search1} />
    </TouchableOpacity>
  );
}

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      height: moderateScaleVertical(50),
      backgroundColor: colors.greyNew,
      borderRadius: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: moderateScale(15),
      marginVertical: moderateScale(13),
    },
    placeHolderTxt: {fontFamily: fontFamily.regular, color: colors.textGreyB},
  });
  return styles;
}
