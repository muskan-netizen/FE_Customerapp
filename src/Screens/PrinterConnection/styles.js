import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
var { height, width } = Dimensions.get('window');
export default () => {
  const styles = StyleSheet.create({
    main: {
      flex: 1,
      // marginVertical: 40
  },
  container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      // marginVertical: 30,
      // borderBottomLeftRadius: 20,
      // borderBottomRightRadius: 20
  },
  scanBtn: {
      width: '100%',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4287f5',
      // borderTopStartRadius: 20,
      // borderTopEndRadius: 20,
      // marginBottom: 10
  },
  scanBtnTxt: {
      fontSize: 13,
      fontFamily: fontFamily.regular,
      color: 'white'
  },
  closeBtn: { borderRadius: 50, top: 0, right: 0, zIndex: 99999, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
  imageStyle: { tintColor: 'black', transform: [{ rotate: '45deg' }], width: 35, height: 35 },
  title: {
      width: width,
      backgroundColor: "#eee",
      color: "#232323",
      paddingLeft: 8,
      paddingVertical: 4,
      textAlign: "left",
      marginBottom: 5
  },
  wtf: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 30,
      backgroundColor: colors.lightBlueBackground,
      marginBottom: 10,
      marginHorizontal: 5,
      borderRadius: 5,
      paddingHorizontal: 10
  },
  name: {
      flex: 1,
      textAlign: "left"
  },
  address: {
      flex: 1,
      textAlign: "right"
  }
  });
  return styles;
};
