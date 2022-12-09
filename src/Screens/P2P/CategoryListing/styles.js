import {StyleSheet} from 'react-native';
import colors from '../../../styles/colors';
import {moderateScale} from '../../../styles/responsiveSize';
import {width, height} from '../../../styles/responsiveSize';
import fontFamily from '../../../styles/fontFamily';

export default ({themeColor, toggleTheme}) => {
  const styles = StyleSheet.create({
    imgBack: {
      width: width / 1.1,
      height: 200,
      marginVertical: moderateScale(8),
    },
    btn: {
      width: '40%',
      height: moderateScale(30),
      borderRadius: 6,
    },
    txt1: {
      color: !!themeColor ? colors.white : colors.black,
      fontFamily: fontFamily.medium,
    },
    txt2: {
      color: !!themeColor ? colors.white : colors.blackOpacity70,
      fontFamily: fontFamily.regular,
      marginVertical: moderateScale(2),
      fontSize: 12,
      lineHeight: 20,
    },
    view1: {
      flexDirection: 'row',
      margin: 12,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    btn1: {
      borderRadius: moderateScale(19),
      width: 38,
      height: 38,
    },
    view2: {marginHorizontal: moderateScale(18), marginBottom: '15%'},
    centeredView: {
      flex: 1,
      marginTop: 22,
    },
    modalView: {
      flex: 1,
      padding: 18,
      backgroundColor: 'white',
      paddingBottom: '20%',
    },
    checkView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: moderateScale(10),
    },
    checkText: {
      fontSize: 13,
      fontFamily: fontFamily.futura,
      color: colors.blackOpacity86,
    },
    txt3: {
      fontFamily: fontFamily.bold,
      marginTop: moderateScale(24),
      marginBottom: moderateScale(8),
    },
    selectedStyle: {
      height: 6,
    },
    customMarker: {
      height: 22,
      width: 22,
      borderRadius: 20 / 2,
      shadowColor: colors.blackOpacity43,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    commonStyle: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    text4: {
      color: '#7D7D7D',
      fontFamily: fontFamily.medium,
      fontSize: 13,
    },
    rowBtn: {
      borderWidth: 1,
      borderColor: colors.orange,
      borderRadius: moderateScale(12),
      height: 48,
      width: '48%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    rowTxt: {
      fontFamily: fontFamily.regular,
      textTransform: 'uppercase',
      textAlign: 'center',
      color: colors.orange,
      fontSize: 16,
      marginLeft: moderateScale(8),
    },
    btnStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScale(24),
      marginTop: '10%',
    },
  });
  // export default styles;
  return styles;
};
