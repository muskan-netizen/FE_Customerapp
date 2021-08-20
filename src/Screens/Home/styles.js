import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({themeColors, fontFamily}) => {
  const styles = StyleSheet.create({
    topLogo: {
      justifyContent: 'center',
      alignItems: 'flex-start',
      // paddingTop: moderateScaleVertical(12),
      paddingBottom: moderateScaleVertical(12),
      paddingLeft: moderateScaleVertical(12),
    },
    imgSmall: {height: '100%', width: '100%', borderRadius: 4},
    imgContainer: {
      height: moderateScaleVertical(128),
      width: width * 0.5 - moderateScale(12),
      borderRadius: 4,
      marginBottom: moderateScale(8),
    },
    imgOverlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 4,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    blurContainer: {
      position: 'absolute',
      left: moderateScale(115),
      bottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      right: moderateScale(115),
      // backgroundColor: 'rgba(255,255,255,.35)',
      borderRadius: moderateScaleVertical(15),
      height: moderateScaleVertical(30),
      overflow: 'hidden',
    },
    txt: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      opacity: 0.9,
    },
    absolute: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      height: moderateScaleVertical(30),
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: moderateScaleVertical(15),
    },
    columnBox: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: moderateScale(8),
      justifyContent: 'space-between',
      marginTop: moderateScaleVertical(8),
    },
    verticalRectBox: {
      marginHorizontal: moderateScale(8),
      marginTop: moderateScale(8),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rectangleBox: {
      height: width * 0.32,
      width: width * 0.96,
      // height: moderateScaleVertical(128),
      marginHorizontal: moderateScale(8),
      // width: width - moderateScale(16),
      borderRadius: 4,
    },
    cardViewStyle: {
      alignItems: 'center',
      height: 180,
      width: width - 20,
      marginHorizontal: moderateScale(10),
      // marginRight: 20
    },
    searchBarLogo: {
      justifyContent: 'center',
      // flex: 0,
      alignItems: 'flex-end',
      // paddingTop: moderateScaleVertical(12),
      paddingBottom: moderateScaleVertical(12),
      paddingRight: moderateScaleVertical(12),
      flexDirection: 'row',
      alignItems: 'center',
    },
    address: {
      paddingLeft: 5,
      // height:20,
      lineHeight: 20,
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBgColor,
      fontSize: textScale(10),
    },

    mainView: {
      flex: 1,
    },
    sheetContent: {
      height: '100%',
      backgroundColor: colors.white,
    },
    header: {
      backgroundColor: colors.white,
      shadowColor: colors.black,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: moderateScale(45),
      height: moderateScaleVertical(5),
      borderRadius: 4,
      backgroundColor: colors.greyLight,
      marginVertical: moderateScaleVertical(12),
    },

    container: {
      height: moderateScale(height / 2),
      width: width,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circularView: {
      height: moderateScale(width / 3.8),
      width: moderateScale(width / 3.8),
      borderWidth: 10,
      borderColor: colors.borderColorc,
      borderRadius: moderateScale(width / 7.5),
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryText: {
      color: colors.textGreyH,
      fontSize: textScale(10),
    },
    circularListCenterImage: {
      position: 'absolute',
    },

    //////ye alg h
    container1: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    circularView: {
      height: moderateScale(width / 4),
      width: moderateScale(width / 4),
      borderWidth: 5,
      borderColor: colors.borderColorc,
      borderRadius: moderateScale(width / 8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryText: {
      color: colors.textGreyH,
      fontSize: textScale(9),
    },
    circularListImage: {height: moderateScale(40), width: moderateScale(40)},
    applyPromoBtn: {
      marginHorizontal: moderateScale(7),
      borderRadius: moderateScale(15),
      borderWidth: 1.5,
      borderColor: colors.borderColorD,
      paddingVertical: moderateScaleVertical(15),
      paddingHorizontal: moderateScaleVertical(10),
      marginVertical: moderateScaleVertical(20),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return styles;
};
