import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { moderateScale, moderateScaleVertical, width } from '../../styles/responsiveSize';



export default ({
  fontFamily,
  themeColors,

}) => {
 

  const styles = StyleSheet.create({
  textInputContainer: {
      marginVertical: moderateScaleVertical(10),
      borderColor: colors.textGreyB,
      borderWidth: 0.5,
      borderBottomWidth:0.5
    }, textInputStyle: {
      height: moderateScaleVertical(30),
      paddingTop: moderateScaleVertical(10)
    }, phoneNumberTextInputLabel: {
      color: colors.black
    }, phoneNumberInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    }, countryPickerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: moderateScale(88),
    }, countryPickerInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    }, callingCodeText: {
      fontFamily: fontFamily.medium,
      color: colors.textGreyOpcaity7,
    }, phoneNumberInnput: {
      borderColor: colors.textGreyB,
      borderWidth: 0.5,
      width: moderateScale(width / 1.6),
      borderBottomWidth:0.5
    }, textInputStyle: { height: moderateScaleVertical(30), paddingTop: moderateScaleVertical(10) }
  });
  return styles;
};
