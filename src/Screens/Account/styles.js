import { Platform, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../../styles/responsiveSize';

export default ({ fontFamily, themeColors }) => {
  const commonStyles = commonStylesFun({ fontFamily });
  const styles = StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      // Card appearance
      backgroundColor: colors.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.lightGreyBorder,
      marginHorizontal: moderateScale(16),
      marginTop: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(12),
      // iOS shadow
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      // Android elevation
      elevation: 1,
    },
    containerStyle2: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      // Card appearance
      backgroundColor: colors.white,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.lightGreyBorder,
      marginHorizontal: moderateScale(16),
      marginTop: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(12),
      // iOS shadow
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      // Android elevation
      elevation: 1,
    },
    loginView: {
      marginTop: moderateScaleVertical(30),
      marginBottom:
        Platform.OS === 'ios'
          ? moderateScaleVertical(10)
          : moderateScaleVertical(100),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchAbleLoginVIew: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginLogoutText: {
      ...commonStyles.futuraHeavyBt,
      color: themeColors?.primary_color,
      marginRight: 8,
    },
  });
  return styles;
};
