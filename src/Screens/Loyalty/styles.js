import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    subscriptionTitle: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(16),
      color: colors.blackC,
      opacity: 0.5,
    },
    subscription2: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(16),
      color: colors.blackC,
      // opacity: 0.5,
    },
    title: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
    },
    title2: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      opacity: 0.5,
    },
    youareat: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      opacity: 0.8,
    },
    currentLoyaltyColor: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(32),
      // opacity: 0.9,
    },
    imageStyle:{
      height: height / 7,
      width: width / 2,
      borderRadius: 8,
    },
    loyaltyPointsEarned:{
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: textScale(24),
    },
    loyaltyPointsUsed:{
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
    },
    upcoming:{
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      opacity:0.5
    },
    descriptionLoyalty:{
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      opacity:0.8
    }
  });
  return styles;
};
