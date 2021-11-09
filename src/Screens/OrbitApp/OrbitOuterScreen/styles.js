import {StyleSheet} from 'react-native';
import {useDarkMode} from 'react-native-dark-mode';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';

export default ({themeColors, fontFamily}) => {
  const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(15),
      marginTop: moderateScale(5),
      alignItems: 'center',
      paddingBottom: moderateScale(5),
      flex: 0.06,
    },
    languageContainer: {
      backgroundColor: colors.DarkBlue,
      height: moderateScaleVertical(30),
      width: moderateScale(30),
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedLanguageText: {
      fontFamily: fontFamily.bold,
      color: colors.white,
    },
  });

  return styles;
};
