import { StyleSheet } from 'react-native'
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';
const   styles = StyleSheet.create({
    topdescription: {
      fontSize: textScale(16),
      fontFamily: fontFamily.semiBold,
      marginVertical: moderateScaleVertical(16),
      marginHorizontal: moderateScale(16),
    },
    topflalist: {
      marginHorizontal: moderateScale(16),
      marginBottom: moderateScaleVertical(16),
    },
    toptext: {fontSize: textScale(12), marginLeft: moderateScale(8)},
    greyview: {
      width: width - 32,
      borderRadius: moderateScale(4),
      padding: moderateScale(10),
      alignSelf: 'center',
      backgroundColor: colors.greyColor,
      marginBottom: moderateScaleVertical(20),
    },
    buttonview: {
      padding: moderateScale(16),
      height: moderateScaleVertical(120),
      width: width,
      position: 'absolute',
      bottom: 0,
      backgroundColor: colors.white,
    },
    button: {
      height: moderateScaleVertical(40),
      borderRadius: moderateScale(4),
      marginTop: moderateScaleVertical(16),
    },
    categoriesview: {
      flexDirection: 'row',
      marginBottom: moderateScale(10),
      justifyContent: 'space-between',
    },
    listtext: {fontSize: textScale(12), marginLeft: moderateScale(8)},
    listimage: {
      height: moderateScaleVertical(15),
      width: moderateScale(15),
      resizeMode: 'contain',
    },
    listheading: {
      fontSize: textScale(14),
      marginLeft: moderateScale(10),
      fontFamily: fontFamily.semiBold,
    },
    listsubhead: {
      fontSize: textScale(12),
      marginVertical: moderateScaleVertical(12),
    },
});
  
export default styles