import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({themeColors, fontFamily}) => {
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = StyleSheet.create({
    header: {
      color: colors.black,
      fontSize: textScale(24),
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(15),
    },
    socialRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    socialRowBtn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: moderateScaleVertical(40),
      alignSelf: 'center',
    },
    hyphen: {
      width: 20,
      height: 1,
      backgroundColor: colors.textGrey,
      opacity: 0.6,
    },
    bottomContainer: {
      marginBottom: moderateScaleVertical(30),
    },
    guestBtn: {
      marginTop: moderateScaleVertical(20),
      backgroundColor: colors.lightSky,
      borderWidth: 0,
    },
    orText: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      opacity: 0.6,
      marginTop: 0,
      marginHorizontal: moderateScale(16),
    },
    orText2: {
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.bold,
      marginTop: 0,
      marginHorizontal: moderateScale(16),
      color: colors.black,
      fontSize: textScale(14),
    },
    forgotContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(8),
    },
    headerContainer: {
      height: moderateScaleVertical(60),
      paddingHorizontal: moderateScale(24),
      justifyContent: 'center',
    },
  });
  return styles;
};
