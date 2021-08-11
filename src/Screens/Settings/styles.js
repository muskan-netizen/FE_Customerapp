import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {moderateScaleVertical, textScale} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    currency: {
      lineHeight: 24,
      color: colors.blackB,
      // textAlign: 'center',
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      marginTop: moderateScaleVertical(14),
    },
  });
  return styles;
};
