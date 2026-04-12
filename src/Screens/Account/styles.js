import { Platform, StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../../styles/responsiveSize';

export default ({ fontFamily, themeColors }) => {
  const commonStyles = commonStylesFun({ fontFamily });
  const styles = StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(56),
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 10,
      borderWidth: 0,
      marginHorizontal: moderateScale(16),
      marginTop: moderateScaleVertical(8),
      paddingHorizontal: moderateScale(14),
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    containerStyle2: {
      paddingVertical: 0,
      height: moderateScaleVertical(56),
      alignItems: 'center',
      backgroundColor: colors.white,
      borderRadius: 10,
      borderWidth: 0,
      marginTop: moderateScaleVertical(8),
      paddingHorizontal: moderateScale(14),
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    loginView: {
      marginTop: moderateScaleVertical(32),
      marginBottom:
        Platform.OS === 'ios'
          ? moderateScaleVertical(10)
          : moderateScaleVertical(100),
      marginHorizontal: moderateScale(16),
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchAbleLoginVIew: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeColors?.primary_color || '#4A6CF7',
      paddingVertical: moderateScaleVertical(14),
      paddingHorizontal: moderateScale(32),
      borderRadius: 10,
      width: '100%',
    },
    loginLogoutText: {
      ...commonStyles.futuraHeavyBt,
      color: colors.white,
      marginRight: 8,
      fontSize: moderateScale(15),
    },
  });
  return styles;
};
