import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({themeColors, fontFamily}) =>
  StyleSheet.create({
    topHeaderView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      zIndex: 1000,
      width: width - moderateScale(20),
      top: height > 700 ? 50 : 30,
      alignSelf: 'center',
    },
    leftRightHeaderIconStyle: {
      // backgroundColor: colors.white,
      // height: 45,
      // width: 45,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(11),
      elevation: 2,
    },

    bottomHeaderView: {
      flexDirection: 'row',
      position: 'absolute',
      zIndex: 1000,
      width: width - moderateScale(40),
      top: width * 0.5,
      alignSelf: 'center',
      backgroundColor: 'white',
      borderRadius: moderateScale(12),
      paddingVertical: moderateScale(20),
      paddingLeft: moderateScale(20),
      borderRadius: 13,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  });
