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
      top: width * 0.4,
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
    rateViewStyle:{
      backgroundColor: colors.yellowB,
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    openCloseStatus:{fontFamily:fontFamily.bold, color:colors.green,fontSize:textScale(12), paddingTop:moderateScaleVertical(10)},
    distanceAndTimeView:{color:colors.black,opacity:0.48,fontSize:textScale(12),paddingTop:moderateScaleVertical(10)}
  });
