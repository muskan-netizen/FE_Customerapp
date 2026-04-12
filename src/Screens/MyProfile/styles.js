import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({themeColors, fontFamily}) => {
  const styles = StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      borderBottomColor: colors.lightGreyBorder,
      borderBottomWidth: 0.7,
    },
    userProfileView: {
      backgroundColor: colors.backgroundGrey,
      alignSelf: 'center',
      height: moderateScale(100),
      width: moderateScale(100),
      borderRadius: moderateScale(100 / 2),
      borderWidth: moderateScale(5),
      borderColor: colors.white,
      marginTop: moderateScale(20),
    },
    profileImage: {
      height: moderateScale(90),
      width: moderateScale(90),
      borderRadius: moderateScale(100 / 2),
    },
    cameraView: {
      position: 'absolute',
      right: -15,
    },
    avatarWrap: {
      alignSelf: 'center',
      marginTop: moderateScaleVertical(24),
      marginBottom: moderateScaleVertical(14),
    },
    avatarImage: {
      height: moderateScale(88),
      width: moderateScale(88),
      borderRadius: moderateScale(44),
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.9)',
    },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      height: moderateScale(26),
      width: moderateScale(26),
      borderRadius: moderateScale(13),
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.white,
    },
    userName: {
      fontSize: textScale(15),
      color: colors.white,
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    userEmail: {
      marginTop: moderateScaleVertical(4),
      fontSize: textScale(11),
      color: 'rgba(255,255,255,0.78)',
      fontFamily: fontFamily.regular,
      textAlign: 'center',
      marginBottom: moderateScaleVertical(24),
    },
    borderRoundBotton: {
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      height: moderateScaleVertical(30),
    },
    topSection: {
      alignItems: 'center',
      paddingHorizontal: moderateScale(20),
    },
    bottomSection: {
      marginHorizontal: moderateScale(16),
      marginTop: -moderateScaleVertical(20),
      borderRadius: moderateScale(20),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 4,
    },
    address: {
      fontSize: textScale(10),
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      lineHeight: moderateScale(20),
      opacity: 0.7,
    },
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      // opacity: 0.6,
    },
    topTextStyle: {
      fontSize: textScale(15),
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(20),
    },
    bottomTextStyle: {
      fontSize: textScale(15),
      color: colors.textGrey,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(20),
    },
    referralCode: {
      fontSize: textScale(12),
      color: colors.textGreyC,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
    },
    roundViewCamera: {
      height: moderateScale(26),
      width: moderateScale(26),
      backgroundColor: themeColors.primary_color,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(13),
      borderWidth: 2,
      borderColor: colors.white,
    },

    viewStyleForUploadImage: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      // justifyContent: 'space-between',
    },
    imageUpload: {
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: moderateScaleVertical(10),
    },
    imageStyle2: {
      height: 100,
      width: 100,
      borderRadius: moderateScale(4),
    },
    label3: {
      marginBottom: moderateScaleVertical(10),
      textAlign: 'center',
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.greyLight,
    },
    uploadStyle: {
      color: colors.blue,
      fontFamily: fontFamily.medium,
    },
  });
  return styles;
};
