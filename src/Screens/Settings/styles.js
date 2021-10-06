import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {textScale} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    currency: {
      color: colors.blackB,
      // textAlign: 'center',
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    darkAppearanceTextStyle: {
      lineHeight: 24,
      color: colors.blackB,
      // textAlign: 'center',
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
  });
  return styles;
};
